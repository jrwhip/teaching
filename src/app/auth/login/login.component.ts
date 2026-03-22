import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
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
            <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
              <div class="form-group">
                <label class="form-label" for="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  class="form-input"
                  [(ngModel)]="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  email
                  autocomplete="email"
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="password">Password</label>
                <input
                  id="password"
                  type="password"
                  class="form-input"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  minlength="8"
                  autocomplete="current-password"
                />
              </div>

              <div class="flex justify-between items-center mb-3">
                <a routerLink="/forgot-password" class="text-sm">Forgot password?</a>
              </div>

              <button
                type="submit"
                class="btn btn-primary w-full btn-lg"
                [disabled]="loading || !loginForm.valid"
              >
                @if (loading) {
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
  `,
})
export default class LoginComponent {
  readonly auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  loading = false;
  confirmed = false;
  resetSuccess = false;

  constructor() {
    const params = this.route.snapshot.queryParams;
    this.confirmed = params['confirmed'] === 'true';
    this.resetSuccess = params['reset'] === 'true';
  }

  async onSubmit(): Promise<void> {
    this.loading = true;
    try {
      await this.auth.signIn(this.email, this.password);
    } catch {
      // Error is set on auth.authError signal
    } finally {
      this.loading = false;
    }
  }
}
