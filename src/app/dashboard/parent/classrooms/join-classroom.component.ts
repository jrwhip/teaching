import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, concat, of, exhaustMap, map, catchError, filter, share } from 'rxjs';
import { StudentManagementService } from '../../../core/data/student-management.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section">
      <div class="container" style="max-width: 540px;">
        <h2 class="mb-4">Join Classroom</h2>

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
                <label class="form-label" for="inviteCode">Invite Code</label>
                <input
                  id="inviteCode"
                  type="text"
                  class="form-input"
                  formControlName="inviteCode"
                  placeholder="Enter classroom invite code"
                  style="text-transform: uppercase;"
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="studentId">Student</label>
                <select id="studentId" class="form-input" formControlName="studentId">
                  <option value="">Select a student</option>
                  @for (student of studentService.students(); track student.id) {
                    <option [value]="student.id">{{ student.displayName }}</option>
                  }
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
                    Join Classroom
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
export default class JoinClassroomComponent {
  readonly studentService = inject(StudentManagementService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    inviteCode: ['', [Validators.required, Validators.minLength(6)]],
    studentId: ['', [Validators.required]],
  });

  private readonly submit$ = new Subject<void>();

  private readonly result$ = this.submit$.pipe(
    exhaustMap(() => {
      const { inviteCode, studentId } = this.form.getRawValue();
      return concat(
        of({ status: 'loading' as const }),
        this.studentService.joinClassroom(inviteCode.toUpperCase(), studentId).pipe(
          map(() => ({ status: 'success' as const })),
          catchError(err => of({
            status: 'error' as const,
            message: err instanceof Error ? err.message : 'Failed to join classroom',
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
