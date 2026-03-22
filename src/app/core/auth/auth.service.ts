import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  getCurrentUser,
  fetchUserAttributes,
  resetPassword,
  confirmResetPassword,
  type AuthUser,
} from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../amplify/data/resource';
import { UserProfile, UserRole } from './auth.types';

const client = generateClient<Schema>();

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<AuthUser | null>(null);
  readonly userProfile = signal<UserProfile | null>(null);
  readonly isLoading = signal(true);
  readonly authError = signal<string | null>(null);

  readonly userRole = computed(() => this.userProfile()?.role ?? null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor(private router: Router) {}

  async init(): Promise<void> {
    try {
      const user = await getCurrentUser();
      this.currentUser.set(user);
      await this.loadUserProfile(user.userId);
    } catch {
      this.currentUser.set(null);
      this.userProfile.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  async signUp(email: string, password: string, displayName: string, role: UserRole): Promise<void> {
    this.authError.set(null);
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            'custom:role': role,
            'custom:displayName': displayName,
          },
        },
      });
      this.router.navigate(['/confirm'], { queryParams: { email } });
    } catch (err: any) {
      this.authError.set(err.message ?? 'Sign up failed');
      throw err;
    }
  }

  async confirmSignUp(email: string, code: string): Promise<void> {
    this.authError.set(null);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      this.router.navigate(['/login'], { queryParams: { confirmed: true } });
    } catch (err: any) {
      this.authError.set(err.message ?? 'Confirmation failed');
      throw err;
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    this.authError.set(null);
    try {
      const result = await signIn({ username: email, password });
      if (result.isSignedIn) {
        const user = await getCurrentUser();
        this.currentUser.set(user);
        await this.createUserProfileIfMissing(user.userId);
        await this.loadUserProfile(user.userId);
        this.router.navigate(['/dashboard']);
      }
    } catch (err: any) {
      this.authError.set(err.message ?? 'Sign in failed');
      throw err;
    }
  }

  async signOut(): Promise<void> {
    await signOut();
    this.currentUser.set(null);
    this.userProfile.set(null);
    this.router.navigate(['/login']);
  }

  async resetPassword(email: string): Promise<void> {
    this.authError.set(null);
    try {
      await resetPassword({ username: email });
    } catch (err: any) {
      this.authError.set(err.message ?? 'Reset request failed');
      throw err;
    }
  }

  async confirmResetPassword(email: string, code: string, newPassword: string): Promise<void> {
    this.authError.set(null);
    try {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
      this.router.navigate(['/login'], { queryParams: { reset: true } });
    } catch (err: any) {
      this.authError.set(err.message ?? 'Password reset failed');
      throw err;
    }
  }

  private async loadUserProfile(cognitoSub: string): Promise<void> {
    try {
      const { data: profiles } = await client.models.UserProfile.listUserProfileByCognitoSub(
        { cognitoSub }
      );
      if (profiles && profiles.length > 0) {
        const p = profiles[0];
        this.userProfile.set({
          id: p.id,
          cognitoSub: p.cognitoSub,
          email: p.email,
          displayName: p.displayName,
          role: p.role as UserRole,
          readAccess: (p.readAccess ?? []) as string[],
          createdAt: p.createdAt ?? undefined,
        });
      }
    } catch {
      // Profile not yet created — will be created on first login
    }
  }

  private async createUserProfileIfMissing(cognitoSub: string): Promise<void> {
    const { data: existing } = await client.models.UserProfile.listUserProfileByCognitoSub(
      { cognitoSub }
    );
    if (existing && existing.length > 0) return;

    const attrs = await fetchUserAttributes();
    const email = attrs.email ?? '';
    const displayName = attrs['custom:displayName'] ?? email.split('@')[0];
    const role = (attrs['custom:role'] as UserRole) ?? 'STUDENT';

    await client.models.UserProfile.create({
      cognitoSub,
      email,
      displayName,
      role,
      readAccess: [cognitoSub],
    });
  }
}
