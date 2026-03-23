import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, concat, of, exhaustMap, map, catchError, filter, share } from 'rxjs';
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
  private readonly auth = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  readonly email = this.route.snapshot.queryParams['email'] ?? '';

  private readonly submit$ = new Subject<void>();

  private readonly result$ = this.submit$.pipe(
    exhaustMap(() => {
      const { code } = this.form.getRawValue();
      return concat(
        of({ status: 'loading' as const }),
        this.auth.confirmSignUp(this.email, code).pipe(
          map(() => ({ status: 'success' as const })),
          catchError(err => of({
            status: 'error' as const,
            message: err instanceof Error ? err.message : 'Confirmation failed',
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
      this.router.navigate(['/login'], { queryParams: { confirmed: true } });
    });
  }

  onSubmit(): void {
    this.submit$.next();
  }
}
