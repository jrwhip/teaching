import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, concat, of, exhaustMap, map, catchError, filter, share } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { StudentManagementService } from '../../../core/data/student-management.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section">
      <div class="container" style="max-width: 540px;">
        <h2 class="mb-4">Add Child Account</h2>

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
                <label class="form-label" for="email">Child's Email</label>
                <input
                  id="email"
                  type="email"
                  class="form-input"
                  formControlName="email"
                  placeholder="child@example.com"
                  autocomplete="off"
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="displayName">Display Name</label>
                <input
                  id="displayName"
                  type="text"
                  class="form-input"
                  formControlName="displayName"
                  placeholder="First name or nickname"
                  autocomplete="off"
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
                <label class="form-label" for="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  class="form-input"
                  formControlName="confirmPassword"
                  placeholder="Re-enter password"
                  autocomplete="new-password"
                />
                @if (form.hasError('passwordMismatch')) {
                  <small class="text-danger">Passwords do not match</small>
                }
              </div>

              <div class="flex gap-2">
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="loading() || form.invalid"
                >
                  @if (loading()) {
                    <span class="spinner"></span>
                  } @else {
                    Create Account
                  }
                </button>
                <a routerLink="/dashboard/parent" class="btn btn-secondary">Cancel</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class StudentCreateComponent {
  private readonly auth = inject(AuthService);
  private readonly studentService = inject(StudentManagementService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  readonly form = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [passwordMatchValidator] },
  );

  private readonly submit$ = new Subject<void>();

  private readonly result$ = this.submit$.pipe(
    exhaustMap(() => {
      const { email, displayName, password } = this.form.getRawValue();
      const profile = this.auth.userProfile();
      return concat(
        of({ status: 'loading' as const }),
        this.studentService.createStudent({
          email,
          displayName,
          password,
          parentId: profile?.id,
        }).pipe(
          map(() => ({ status: 'success' as const })),
          catchError(err => of({
            status: 'error' as const,
            message: err instanceof Error ? err.message : 'Failed to create account',
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
      this.studentService.reload();
      this.router.navigate(['/dashboard/parent']);
    });
  }

  onSubmit(): void {
    this.submit$.next();
  }
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}
