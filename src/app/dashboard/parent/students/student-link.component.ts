import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, concat, of, exhaustMap, map, catchError, filter, share, switchMap, defer } from 'rxjs';
import { DataService } from '../../../core/data/data.service';
import { StudentManagementService } from '../../../core/data/student-management.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section">
      <div class="container" style="max-width: 540px;">
        <h2 class="mb-4">Link Existing Student</h2>

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
                <label class="form-label" for="email">Student's Email</label>
                <input
                  id="email"
                  type="email"
                  class="form-input"
                  formControlName="email"
                  placeholder="student@example.com"
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="relationship">Relationship</label>
                <select id="relationship" class="form-input" formControlName="relationship">
                  <option value="parent">Parent</option>
                  <option value="guardian">Guardian</option>
                  <option value="grandparent">Grandparent</option>
                  <option value="other">Other</option>
                </select>
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
                    Link Student
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
export default class StudentLinkComponent {
  private readonly data = inject(DataService);
  private readonly studentService = inject(StudentManagementService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    relationship: ['parent'],
  });

  private readonly submit$ = new Subject<void>();

  private readonly result$ = this.submit$.pipe(
    exhaustMap(() => {
      const { email, relationship } = this.form.getRawValue();
      return concat(
        of({ status: 'loading' as const }),
        defer(() =>
          this.data.models.UserProfile.listUserProfileByEmail({ email }),
        ).pipe(
          switchMap(({ data: profiles }) => {
            const student = profiles?.find(p => p.role === 'STUDENT');
            if (!student) {
              return of({
                status: 'error' as const,
                message: `No student account found for "${email}"`,
              });
            }
            return this.studentService.linkStudent(student.id, relationship).pipe(
              map(() => ({ status: 'success' as const })),
            );
          }),
          catchError(err => of({
            status: 'error' as const,
            message: err instanceof Error ? err.message : 'Failed to link student',
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
