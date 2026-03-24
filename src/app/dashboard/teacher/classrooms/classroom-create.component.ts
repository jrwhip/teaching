import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, concat, of, exhaustMap, map, catchError, filter, share } from 'rxjs';
import { ClassroomService } from '../../../core/data/classroom.service';
import { generateInviteCode } from '../../../core/data/invite-code.util';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section">
      <div class="container" style="max-width: 540px;">
        <h2 class="mb-4">Create Classroom</h2>

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
                <label class="form-label" for="name">Classroom Name</label>
                <input
                  id="name"
                  type="text"
                  class="form-input"
                  formControlName="name"
                  placeholder="e.g. 6th Grade Math"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Invite Code</label>
                <div class="flex gap-2">
                  <input
                    type="text"
                    class="form-input"
                    [value]="inviteCode"
                    readonly
                  />
                  <button type="button" class="btn btn-secondary" (click)="regenerateCode()">
                    <i class="fas fa-sync-alt"></i>
                  </button>
                </div>
                <small class="text-muted">Share this code with parents to join the classroom</small>
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
                    Create Classroom
                  }
                </button>
                <a routerLink="/dashboard/teacher/classrooms" class="btn btn-secondary">Cancel</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class ClassroomCreateComponent {
  private readonly classroomService = inject(ClassroomService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  inviteCode = generateInviteCode();

  private readonly submit$ = new Subject<void>();

  private readonly result$ = this.submit$.pipe(
    exhaustMap(() => {
      const { name } = this.form.getRawValue();
      return concat(
        of({ status: 'loading' as const }),
        this.classroomService.create(name, this.inviteCode).pipe(
          map(() => ({ status: 'success' as const })),
          catchError(err => of({
            status: 'error' as const,
            message: err instanceof Error ? err.message : 'Failed to create classroom',
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
      this.classroomService.reload();
      this.router.navigate(['/dashboard/teacher/classrooms']);
    });
  }

  regenerateCode(): void {
    this.inviteCode = generateInviteCode();
  }

  onSubmit(): void {
    this.submit$.next();
  }
}
