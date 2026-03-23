import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    imports: [ReactiveFormsModule, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="section">
      <div class="container" style="max-width: 460px;">
        <div class="text-center mb-4">
          <h2>Verify Your Email</h2>
          <p class="text-muted">Enter the 6-digit code sent to <strong>{{ email }}</strong></p>
        </div>

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
                <label class="form-label" for="code">Confirmation code</label>
                <input
                  id="code"
                  type="text"
                  class="form-input"
                  formControlName="code"
                  placeholder="123456"
                  autocomplete="one-time-code"
                />
              </div>

              <button
                type="submit"
                class="btn btn-primary w-full btn-lg"
                [disabled]="loading() || form.invalid"
              >
                @if (loading()) {
                  <span class="spinner"></span>
                } @else {
                  Verify Email
                }
              </button>
            </form>
          </div>
        </div>

        <p class="text-center mt-3 text-sm">
          <a routerLink="/login">Back to sign in</a>
        </p>
      </div>
    </div>
  `
})
export default class ConfirmComponent {
  readonly auth = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  readonly email: string;
  readonly loading = signal(false);

  constructor() {
    this.email = this.route.snapshot.queryParams['email'] ?? '';
  }

  onSubmit(): void {
    this.loading.set(true);
    const { code } = this.form.getRawValue();
    this.auth.confirmSignUp(this.email, code).pipe(
      finalize(() => this.loading.set(false)),
    ).subscribe();
  }
}
