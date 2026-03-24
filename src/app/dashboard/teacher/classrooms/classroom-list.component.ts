import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClassroomService } from '../../../core/data/classroom.service';

@Component({
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section">
      <div class="container">
        <div class="flex justify-between items-center mb-4">
          <h2 class="mb-0">Classrooms</h2>
          <a routerLink="/dashboard/teacher/classrooms/new" class="btn btn-primary">
            <i class="fas fa-plus"></i> New Classroom
          </a>
        </div>

        @if (classroomService.classroomsLoading()) {
          <div class="text-center py-4">
            <span class="spinner"></span>
          </div>
        } @else if (classroomService.classrooms().length === 0) {
          <div class="card card-flat">
            <div class="card-body text-center py-4">
              <i class="fas fa-school text-muted fa-2x mb-2"></i>
              <p class="text-muted mb-0">No classrooms yet. Create your first one to get started.</p>
            </div>
          </div>
        } @else {
          <div class="grid grid-2">
            @for (classroom of classroomService.classrooms(); track classroom.id) {
              <a [routerLink]="['/dashboard/teacher/classrooms', classroom.id]" class="card card-flat">
                <div class="card-body">
                  <div class="flex justify-between items-start mb-2">
                    <h5 class="mb-0">{{ classroom.name }}</h5>
                    @if (classroom.isActive) {
                      <span class="badge badge-success">Active</span>
                    } @else {
                      <span class="badge badge-muted">Inactive</span>
                    }
                  </div>
                  <div class="flex items-center gap-2 text-sm text-muted">
                    <i class="fas fa-key"></i>
                    <code>{{ classroom.inviteCode }}</code>
                    <button
                      type="button"
                      class="btn btn-sm btn-ghost"
                      (click)="copyCode(classroom.inviteCode, $event)"
                    >
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export default class ClassroomListComponent {
  readonly classroomService = inject(ClassroomService);

  copyCode(code: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    navigator.clipboard.writeText(code);
  }
}
