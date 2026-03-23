import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, concat, of, EMPTY, exhaustMap, map, catchError, filter, share } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { UserRole } from '../../core/auth/auth.types';

@Component({
    imports: [ReactiveFormsModule, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="section">
      <div class="container" style="max-width: 460px;">
        <div class="text-center mb-4">
          <h2>Create Account</h2>
          <p class="text-muted">Sign up as a Teacher or Parent</p>
        </div>

        @if (error()) {
          <div class="alert alert-danger mb-3">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ error() }}</span>
          </div>
        }

        <div class="card">
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label class="form-label" for="displayName">Display name</label>
                <input
                  id="displayName"
                  type="text"
                  class="form-input"
                  formControlName="displayName"
                  placeholder="Your name"
                  autocomplete="name"
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  class="form-input"
                  formControlName="email"
                  placeholder="name@example.com"
                  autocomplete="email"
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="password">Password</label>
                <input
                  id="password"
                  type="password"
                  class="form-input"
                  formControlName="password"
                  placeholder="At least 8 characters"
                  autocomplete="new-password"
                />
              </div>

              <div class="form-group">
                <label class="form-label">I am a...</label>
                <div class="flex gap-2">
                  <button
                    type="button"
                    class="btn w-full"
                    [class]="role() === 'TEACHER' ? 'btn-primary' : 'btn-light'"
                    (click)="role.set('TEACHER')"
                  >
                    <i class="fas fa-chalkboard-teacher"></i> Teacher
                  </button>
                  <button
                    type="button"
                    class="btn w-full"
                    [class]="role() === 'PARENT' ? 'btn-primary' : 'btn-light'"
                    (click)="role.set('PARENT')"
                  >
                    <i class="fas fa-user-friends"></i> Parent
                  </button>
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-primary w-full btn-lg mt-2"
                [disabled]="loading() || form.invalid || !role()"
              >
                @if (loading()) {
                  <span class="spinner"></span>
                } @else {
                  Create Account
                }
              </button>
            </form>
          </div>
        </div>

        <p class="text-center mt-3 text-sm">
          Already have an account?
          <a routerLink="/login">Sign in</a>
        </p>
      </div>
    </div>
  `
})
export default class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  readonly role = signal<UserRole | null>(null);

  private readonly submit$ = new Subject<void>();

  private readonly result$ = this.submit$.pipe(
    exhaustMap(() => {
      const r = this.role();
      if (!r) return EMPTY;
      const { email, password, displayName } = this.form.getRawValue();
      return concat(
        of({ status: 'loading' as const }),
        this.auth.signUp(email, password, displayName, r).pipe(
          map(() => ({ status: 'success' as const })),
          catchError(err => of({
            status: 'error' as const,
            message: err instanceof Error ? err.message : 'Sign up failed',
          })),
        ),
      );
    }),
    share(),
  );

  private readonly result = toSignal(this.result$);

  readonly loading = computed(() => this.result()?.status === 'loading');
  readonly error = computed(() => {
    const r = this.result();
    if (!r || r.status !== 'error') return null;
    return r.message;
  });

  constructor() {
    this.result$.pipe(
      filter(r => r.status === 'success'),
      takeUntilDestroyed(),
    ).subscribe(() => {
      const { email } = this.form.getRawValue();
      this.router.navigate(['/confirm'], { queryParams: { email } });
    });
  }

  onSubmit(): void {
    this.submit$.next();
  }
}
