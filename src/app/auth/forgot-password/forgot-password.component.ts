import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    imports: [ReactiveFormsModule, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="section">
      <div class="container" style="max-width: 460px;">
        <div class="text-center mb-4">
          <h2>Reset Password</h2>
          <p class="text-muted">
            @if (!codeSent) {
              Enter your email and we'll send a reset code
            } @else {
              Enter the code sent to <strong>{{ emailForm.getRawValue().email }}</strong>
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
              <form [formGroup]="emailForm" (ngSubmit)="requestCode()">
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

                <button
                  type="submit"
                  class="btn btn-primary w-full btn-lg"
                  [disabled]="loading() || emailForm.invalid"
                >
                  @if (loading()) {
                    <span class="spinner"></span>
                  } @else {
                    Send Reset Code
                  }
                </button>
              </form>
            } @else {
              <form [formGroup]="resetForm" (ngSubmit)="resetPassword()">
                <div class="form-group">
                  <label class="form-label" for="code">Reset code</label>
                  <input
                    id="code"
                    type="text"
                    class="form-input"
                    formControlName="code"
                    placeholder="123456"
                    autocomplete="one-time-code"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label" for="newPassword">New password</label>
                  <input
                    id="newPassword"
                    type="password"
                    class="form-input"
                    formControlName="newPassword"
                    placeholder="At least 8 characters"
                    autocomplete="new-password"
                  />
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-full btn-lg"
                  [disabled]="loading() || resetForm.invalid"
                >
                  @if (loading()) {
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
  `
})
export default class ForgotPasswordComponent {
  readonly auth = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly resetForm = this.fb.group({
    code: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  codeSent = false;
  readonly loading = signal(false);

  requestCode(): void {
    this.loading.set(true);
    const { email } = this.emailForm.getRawValue();
    this.auth.resetPassword(email).pipe(
      finalize(() => this.loading.set(false)),
    ).subscribe({
      complete: () => { this.codeSent = true; },
    });
  }

  resetPassword(): void {
    this.loading.set(true);
    const { email } = this.emailForm.getRawValue();
    const { code, newPassword } = this.resetForm.getRawValue();
    this.auth.confirmResetPassword(email, code, newPassword).pipe(
      finalize(() => this.loading.set(false)),
    ).subscribe();
  }
}
