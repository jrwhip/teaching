import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="section">
      <div class="container" style="max-width: 460px;">
        <div class="text-center mb-4">
          <h2>Reset Password</h2>
          <p class="text-muted">
            @if (!codeSent) {
              Enter your email and we'll send a reset code
            } @else {
              Enter the code sent to <strong>{{ email }}</strong>
            }
          </p>
        </div>

        @if (auth.authError()) {
          <div class="alert alert-danger mb-3">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ auth.authError() }}</span>
          </div>
        }

        <div class="card">
          <div class="card-body">
            @if (!codeSent) {
              <form (ngSubmit)="requestCode()" #emailForm="ngForm">
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

                <button
                  type="submit"
                  class="btn btn-primary w-full btn-lg"
                  [disabled]="loading || !emailForm.valid"
                >
                  @if (loading) {
                    <span class="spinner"></span>
                  } @else {
                    Send Reset Code
                  }
                </button>
              </form>
            } @else {
              <form (ngSubmit)="resetPassword()" #resetForm="ngForm">
                <div class="form-group">
                  <label class="form-label" for="code">Reset code</label>
                  <input
                    id="code"
                    type="text"
                    class="form-input"
                    [(ngModel)]="code"
                    name="code"
                    placeholder="123456"
                    required
                    autocomplete="one-time-code"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label" for="newPassword">New password</label>
                  <input
                    id="newPassword"
                    type="password"
                    class="form-input"
                    [(ngModel)]="newPassword"
                    name="newPassword"
                    placeholder="At least 8 characters"
                    required
                    minlength="8"
                    autocomplete="new-password"
                  />
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-full btn-lg"
                  [disabled]="loading || !resetForm.valid"
                >
                  @if (loading) {
                    <span class="spinner"></span>
                  } @else {
                    Reset Password
                  }
                </button>
              </form>
            }
          </div>
        </div>

        <p class="text-center mt-3 text-sm">
          <a routerLink="/login">Back to sign in</a>
        </p>
      </div>
    </div>
  `,
})
export default class ForgotPasswordComponent {
  readonly auth = inject(AuthService);

  email = '';
  code = '';
  newPassword = '';
  codeSent = false;
  loading = false;

  async requestCode(): Promise<void> {
    this.loading = true;
    try {
      await this.auth.resetPassword(this.email);
      this.codeSent = true;
    } catch {
      // Error on auth.authError signal
    } finally {
      this.loading = false;
    }
  }

  async resetPassword(): Promise<void> {
    this.loading = true;
    try {
      await this.auth.confirmResetPassword(this.email, this.code, this.newPassword);
    } catch {
      // Error on auth.authError signal
    } finally {
      this.loading = false;
    }
  }
}
