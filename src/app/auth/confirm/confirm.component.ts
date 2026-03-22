import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
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
            <form (ngSubmit)="onSubmit()" #confirmForm="ngForm">
              <div class="form-group">
                <label class="form-label" for="code">Confirmation code</label>
                <input
                  id="code"
                  type="text"
                  class="form-input"
                  [(ngModel)]="code"
                  name="code"
                  placeholder="123456"
                  required
                  minlength="6"
                  maxlength="6"
                  autocomplete="one-time-code"
                />
              </div>

              <button
                type="submit"
                class="btn btn-primary w-full btn-lg"
                [disabled]="loading || !confirmForm.valid"
              >
                @if (loading) {
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
  `,
})
export default class ConfirmComponent {
  readonly auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  email = '';
  code = '';
  loading = false;

  constructor() {
    this.email = this.route.snapshot.queryParams['email'] ?? '';
  }

  async onSubmit(): Promise<void> {
    this.loading = true;
    try {
      await this.auth.confirmSignUp(this.email, this.code);
    } catch {
      // Error on auth.authError signal
    } finally {
      this.loading = false;
    }
  }
}
