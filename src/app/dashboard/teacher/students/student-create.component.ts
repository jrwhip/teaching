import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, concat, of, exhaustMap, map, catchError, filter, share } from 'rxjs';
import { ClassroomService } from '../../../core/data/classroom.service';
import { StudentManagementService } from '../../../core/data/student-management.service';
import { StudentSummary } from '../../../core/data/data.types';

type Result =
  | { status: 'loading' }
  | { status: 'success'; student: StudentSummary }
  | { status: 'error'; message: string };

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section">
      <div class="container" style="max-width: 540px;">
        <h2 class="mb-4">Create Student Account</h2>

        @if (error()) {
          <div class="alert alert-danger mb-3">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ error() }}</span>
          </div>
        }

        @if (createdStudent(); as student) {
          <div class="alert alert-success mb-3">
            <i class="fas fa-check-circle"></i>
            <span>Student account created for {{ student.displayName }}.</span>
          </div>
          <div class="card card-flat mb-3">
            <div class="card-header">
              <h5 class="mb-0">Student Credentials</h5>
            </div>
            <div class="card-body">
              <p class="text-muted text-sm">Share these credentials with the student:</p>
              <div class="mb-2"><strong>Email:</strong> {{ student.email }}</div>
              <div class="mb-2"><strong>Password:</strong> (the password you entered)</div>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-primary" (click)="resetForm()">Create Another</button>
            <a routerLink="/dashboard/teacher/classrooms" class="btn btn-secondary">Back to Classrooms</a>
          </div>
        } @else {
          <div class="card">
            <div class="card-body">
              <form [formGroup]="form" (ngSubmit)="onSubmit()">
                <div class="form-group">
                  <label class="form-label" for="email">Student Email</label>
                  <input
                    id="email"
                    type="email"
                    class="form-input"
                    formControlName="email"
                    placeholder="student@example.com"
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

                @if (classroomService.classrooms().length > 0) {
                  <div class="form-group">
                    <label class="form-label" for="classroomId">Classroom (optional)</label>
                    <select id="classroomId" class="form-input" formControlName="classroomId">
                      <option value="">No classroom</option>
                      @for (c of classroomService.classrooms(); track c.id) {
                        <option [value]="c.id">{{ c.name }}</option>
                      }
                    </select>
                  </div>
                }

                <div class="flex gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="loading() || form.invalid"
                  >
                    @if (loading()) {
                      <span class="spinner"></span>
                    } @else {
                      Create Student
                    }
                  </button>
                  <a routerLink="/dashboard/teacher" class="btn btn-secondary">Cancel</a>
                </div>
              </form>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export default class StudentCreateComponent {
  readonly classroomService = inject(ClassroomService);
  private readonly studentService = inject(StudentManagementService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly preselectedClassroomId =
    this.route.snapshot.queryParams['classroomId'] ?? '';

  readonly form = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      classroomId: [this.preselectedClassroomId],
    },
    { validators: [passwordMatchValidator] },
  );

  private readonly submit$ = new Subject<void>();

  private readonly result$ = this.submit$.pipe(
    exhaustMap(() => {
      const { email, displayName, password, classroomId } = this.form.getRawValue();
      return concat(
        of({ status: 'loading' } as Result),
        this.studentService.createStudent({
          email,
          displayName,
          password,
          classroomId: classroomId || undefined,
        }).pipe(
          map(student => ({ status: 'success', student } as Result)),
          catchError(err => of({
            status: 'error',
            message: err instanceof Error ? err.message : 'Failed to create student',
          } as Result)),
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
  readonly createdStudent = signal<StudentSummary | null>(null);

  constructor() {
    this.result$.pipe(
      filter((r): r is Extract<Result, { status: 'success' }> => r.status === 'success'),
      takeUntilDestroyed(),
    ).subscribe(r => {
      this.createdStudent.set(r.student);
      this.classroomService.reload();
      this.studentService.reload();
    });
  }

  onSubmit(): void {
    this.submit$.next();
  }

  resetForm(): void {
    this.createdStudent.set(null);
    this.form.reset({ classroomId: '' });
  }
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}
