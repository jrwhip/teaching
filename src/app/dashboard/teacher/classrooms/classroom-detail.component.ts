import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, defer, forkJoin, map, of, switchMap } from 'rxjs';
import { ClassroomService } from '../../../core/data/classroom.service';
import { StudentManagementService } from '../../../core/data/student-management.service';
import { StudentSummary } from '../../../core/data/data.types';

@Component({
  imports: [RouterLink, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section">
      <div class="container">
        @if (classroom(); as c) {
          <div class="flex justify-between items-center mb-4">
            <div>
              <h2 class="mb-0">{{ c.name }}</h2>
              <div class="flex items-center gap-2 text-muted mt-1">
                <i class="fas fa-key"></i>
                <code>{{ c.inviteCode }}</code>
                <button type="button" class="btn btn-sm btn-ghost" (click)="copyCode(c.inviteCode)">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
            <a
              [routerLink]="['/dashboard/teacher/students/new']"
              [queryParams]="{ classroomId: c.id }"
              class="btn btn-primary"
            >
              <i class="fas fa-user-plus"></i> Add Student
            </a>
          </div>

          <div class="card card-flat mb-3">
            <div class="card-header">
              <h5 class="mb-0">Classroom Info</h5>
            </div>
            <div class="card-body">
              <div class="flex gap-4">
                <div>
                  <span class="text-muted text-sm">Status</span>
                  @if (c.isActive) {
                    <div><span class="badge badge-success">Active</span></div>
                  } @else {
                    <div><span class="badge badge-muted">Inactive</span></div>
                  }
                </div>
                <div>
                  <span class="text-muted text-sm">Created</span>
                  <div>{{ c.createdAt | date }}</div>
                </div>
                <div>
                  <span class="text-muted text-sm">Students</span>
                  <div>{{ enrolledStudents().length }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="card card-flat">
            <div class="card-header">
              <h5 class="mb-0">Enrolled Students</h5>
            </div>
            <div class="card-body">
              @if (studentsLoading()) {
                <div class="text-center py-3">
                  <span class="spinner"></span>
                </div>
              } @else if (enrolledStudents().length === 0) {
                <p class="text-muted mb-0">No students enrolled yet.</p>
              } @else {
                <div class="list">
                  @for (student of enrolledStudents(); track student.id) {
                    <div class="list-item flex items-center gap-3">
                      <div class="icon-badge icon-badge-primary">
                        <i class="fas fa-user-graduate"></i>
                      </div>
                      <div>
                        <div class="fw-medium">{{ student.displayName }}</div>
                        <div class="text-sm text-muted">{{ student.email }}</div>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        } @else {
          <div class="text-center py-4">
            <span class="spinner"></span>
          </div>
        }

        <div class="mt-3">
          <a routerLink="/dashboard/teacher/classrooms" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Back to Classrooms
          </a>
        </div>
      </div>
    </div>
  `,
})
export default class ClassroomDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly classroomService = inject(ClassroomService);
  private readonly studentService = inject(StudentManagementService);

  private readonly classroomId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id') ?? '')),
    { initialValue: '' },
  );

  readonly classroom = computed(() => {
    const id = this.classroomId();
    return this.classroomService.classrooms().find(c => c.id === id) ?? null;
  });

  private readonly enrolledStudentsResource = rxResource({
    params: () => this.classroomId(),
    stream: ({ params: classroomId }) => {
      if (!classroomId) return of([]);
      return this.studentService.getEnrollmentsByClassroomId(classroomId).pipe(
        switchMap(enrollments => {
          if (enrollments.length === 0) return of([]);
          const queries$ = enrollments.map(e =>
            this.studentService.getStudentProfile(e.studentId),
          );
          return forkJoin(queries$).pipe(
            map(profiles => profiles.filter((p): p is StudentSummary => p !== null)),
          );
        }),
        catchError(() => of([])),
      );
    },
    defaultValue: [] as StudentSummary[],
  });

  readonly enrolledStudents = this.enrolledStudentsResource.value;
  readonly studentsLoading = this.enrolledStudentsResource.isLoading;

  copyCode(code: string): void {
    navigator.clipboard.writeText(code);
  }
}
