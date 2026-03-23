import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
  resetPassword,
  confirmResetPassword,
} from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { defer, EMPTY, Observable, switchMap, map, catchError } from 'rxjs';
import type { Schema } from '../../../../amplify/data/resource';
import { UserProfile, UserRole } from './auth.types';

const client = generateClient<Schema>();

@Injectable({ providedIn: 'root' })
export class AuthService {
  /**
   * Trigger signal for profile loading. Incrementing this causes rxResource to re-fetch.
   * Starts at 0 so the resource fires on construction.
   */
  private readonly profileTrigger = signal(0);

  /**
   * rxResource for loading the authenticated user's profile.
   * Automatically fires on construction and whenever profileTrigger changes.
   * Returns null when no user is authenticated.
   */
  private readonly profileResource = rxResource<UserProfile | null, number>({
    params: () => this.profileTrigger(),
    stream: () =>
      defer(() => getCurrentUser()).pipe(
        switchMap(user =>
          defer(() =>
            client.models.UserProfile.listUserProfileByCognitoSub({
              cognitoSub: user.userId,
            }),
          ).pipe(
            map(({ data: profiles }) => {
              if (profiles && profiles.length > 0) {
                const p = profiles[0];
                return {
                  id: p.id,
                  cognitoSub: p.cognitoSub,
                  email: p.email,
                  displayName: p.displayName,
                  role: p.role as UserRole,
                  readAccess: (p.readAccess ?? []) as string[],
                  createdAt: p.createdAt ?? undefined,
                } satisfies UserProfile;
              }
              return null;
            }),
          ),
        ),
        catchError(() => [null]),
      ),
    defaultValue: null,
  });

  readonly userProfile = this.profileResource.value;
  readonly isLoading = this.profileResource.isLoading;
  readonly userRole = computed(() => this.userProfile()?.role ?? null);
  readonly isAuthenticated = computed(() => this.userProfile() !== null);

  reloadProfile(): void {
    this.profileTrigger.update(v => v + 1);
  }

  clearProfile(): void {
    this.profileResource.set(null);
  }

  signUp(email: string, password: string, displayName: string, role: UserRole): Observable<void> {
    return defer(() =>
      signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name: displayName,
            'custom:role': role,
          },
        },
      }),
    ).pipe(map(() => undefined));
  }

  confirmSignUp(email: string, code: string): Observable<void> {
    return defer(() => confirmSignUp({ username: email, confirmationCode: code })).pipe(
      map(() => undefined),
    );
  }

  signIn(email: string, password: string): Observable<void> {
    return defer(() => signIn({ username: email, password })).pipe(
      switchMap(result => {
        if (!result.isSignedIn) {
          throw new Error('Sign-in requires additional steps (e.g. MFA or new password).');
        }
        return defer(() => getCurrentUser()).pipe(
          switchMap(user => this.ensureProfileExists(user.userId)),
        );
      }),
    );
  }

  signOut(): Observable<void> {
    return defer(() => signOut());
  }

  resetPassword(email: string): Observable<void> {
    return defer(() => resetPassword({ username: email })).pipe(
      map(() => undefined),
    );
  }

  confirmResetPassword(email: string, code: string, newPassword: string): Observable<void> {
    return defer(() =>
      confirmResetPassword({ username: email, confirmationCode: code, newPassword }),
    ).pipe(map(() => undefined));
  }

  /**
   * Creates a UserProfile in DynamoDB if one doesn't already exist for this cognitoSub.
   * Used during signIn to ensure new users get a profile record.
   */
  private ensureProfileExists(cognitoSub: string): Observable<void> {
    return defer(() =>
      client.models.UserProfile.listUserProfileByCognitoSub({ cognitoSub }),
    ).pipe(
      switchMap(({ data: existing }) => {
        if (existing && existing.length > 0) return EMPTY;
        return defer(() => fetchUserAttributes()).pipe(
          switchMap(attrs =>
            defer(() => fetchAuthSession()).pipe(
              switchMap(session => {
                const groups =
                  (session.tokens?.idToken?.payload?.['cognito:groups'] as
                    | string[]
                    | undefined) ?? [];
                const email = attrs.email ?? '';
                const displayName = attrs.name ?? email.split('@')[0];
                const role = (groups[0] as UserRole) ?? 'STUDENT';

                return defer(() =>
                  client.models.UserProfile.create({
                    cognitoSub,
                    email,
                    displayName,
                    role,
                    readAccess: [cognitoSub],
                  }),
                ).pipe(map(() => undefined));
              }),
            ),
          ),
        );
      }),
    );
  }
}
