import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    imports: [ReactiveFormsModule, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="section">
      <div class="container" style="max-width: 460px;">
        <div class="text-center mb-4">
          <h2>Welcome Back</h2>
          <p class="text-muted">Sign in to continue to your dashboard</p>
        </div>

        @if (confirmed) {
          <div class="alert alert-success mb-3">
            <i class="fas fa-check-circle"></i>
            <span>Email confirmed. You can now sign in.</span>
          </div>
        }

        @if (resetSuccess) {
          <div class="alert alert-success mb-3">
            <i class="fas fa-check-circle"></i>
            <span>Password reset. Sign in with your new password.</span>
          </div>
        }

        @if (auth.authError()) {
          <div class="alert alert-danger mb-3">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ auth.authError() }}</span>
          </div>
        }

        <div class="card">
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
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
                  placeholder="Enter your password"
                  autocomplete="current-password"
                />
              </div>

              <div class="flex justify-between items-center mb-3">
                <a routerLink="/forgot-password" class="text-sm">Forgot password?</a>
              </div>

              <button
                type="submit"
                class="btn btn-primary w-full btn-lg"
                [disabled]="loading() || form.invalid"
              >
                @if (loading()) {
                  <span class="spinner"></span>
                } @else {
                  Sign In
                }
              </button>
            </form>
          </div>
        </div>

        <p class="text-center mt-3 text-sm">
          Don't have an account?
          <a routerLink="/register">Sign up</a>
        </p>
      </div>
    </div>
  `
})
export default class LoginComponent {
  readonly auth = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  readonly loading = signal(false);
  confirmed = false;
  resetSuccess = false;

  constructor() {
    const params = this.route.snapshot.queryParams;
    this.confirmed = params['confirmed'] === 'true';
    this.resetSuccess = params['reset'] === 'true';
  }

  onSubmit(): void {
    this.loading.set(true);
    const { email, password } = this.form.getRawValue();
    this.auth.signIn(email, password).pipe(
      finalize(() => this.loading.set(false)),
    ).subscribe();
  }
}
