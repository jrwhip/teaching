import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UserRole } from '../../core/auth/auth.types';

@Component({
    imports: [FormsModule, RouterLink],
    template: `
    <div class="section">
      <div class="container" style="max-width: 460px;">
        <div class="text-center mb-4">
          <h2>Create Account</h2>
          <p class="text-muted">Sign up as a Teacher or Parent</p>
        </div>

        @if (auth.authError()) {
          <div class="alert alert-danger mb-3">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ auth.authError() }}</span>
          </div>
        }

        <div class="card">
          <div class="card-body">
            <form (ngSubmit)="onSubmit()" #regForm="ngForm">
              <div class="form-group">
                <label class="form-label" for="displayName">Display name</label>
                <input
                  id="displayName"
                  type="text"
                  class="form-input"
                  [(ngModel)]="displayName"
                  name="displayName"
                  placeholder="Your name"
                  required
                  autocomplete="name"
                />
              </div>

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
                  placeholder="At least 8 characters"
                  required
                  minlength="8"
                  autocomplete="new-password"
                />
              </div>

              <div class="form-group">
                <label class="form-label">I am a...</label>
                <div class="flex gap-2">
                  <button
                    type="button"
                    class="btn w-full"
                    [class]="role === 'TEACHER' ? 'btn-primary' : 'btn-light'"
                    (click)="role = 'TEACHER'"
                  >
                    <i class="fas fa-chalkboard-teacher"></i> Teacher
                  </button>
                  <button
                    type="button"
                    class="btn w-full"
                    [class]="role === 'PARENT' ? 'btn-primary' : 'btn-light'"
                    (click)="role = 'PARENT'"
                  >
                    <i class="fas fa-user-friends"></i> Parent
                  </button>
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-primary w-full btn-lg mt-2"
                [disabled]="loading || !regForm.valid || !role"
              >
                @if (loading) {
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
  readonly auth = inject(AuthService);

  displayName = '';
  email = '';
  password = '';
  role: UserRole | null = null;
  loading = false;

  async onSubmit(): Promise<void> {
    if (!this.role) return;
    this.loading = true;
    try {
      await this.auth.signUp(this.email, this.password, this.displayName, this.role);
    } catch {
      // Error is set on auth.authError signal
    } finally {
      this.loading = false;
    }
  }
}
