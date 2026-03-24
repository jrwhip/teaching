import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { StudentManagementService } from '../../core/data/student-management.service';
import { StatCardComponent } from '../../shared/components/stat-card.component';

@Component({
    imports: [RouterLink, StatCardComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="section">
      <div class="container">
        <h2 class="mb-1">Welcome, {{ auth.userProfile()?.displayName }}</h2>
        <p class="text-muted mb-4">Parent Dashboard</p>

        <div class="grid grid-3 mb-4">
          <app-stat-card
            icon="fas fa-child"
            [value]="'' + studentService.studentCount()"
            label="Children Linked"
            color="primary"
          />
          <app-stat-card icon="fas fa-clipboard-list" value="0" label="Active Assignments" color="success" />
          <app-stat-card icon="fas fa-school" value="0" label="Classrooms" color="info" />
        </div>

        <div class="card card-flat">
          <div class="card-header">
            <h5 class="mb-0">Quick Actions</h5>
          </div>
          <div class="card-body flex gap-2 flex-wrap">
            <a routerLink="/dashboard/parent/students/new" class="btn btn-primary-soft">
              <i class="fas fa-user-plus"></i> Add Child
            </a>
            <a routerLink="/dashboard/parent/students/link" class="btn btn-primary-soft">
              <i class="fas fa-link"></i> Link Existing Child
            </a>
            <a routerLink="/dashboard/parent/classrooms/join" class="btn btn-success-soft">
              <i class="fas fa-sign-in-alt"></i> Join Classroom
            </a>
            <a routerLink="/practice/math/results/parent" class="btn btn-primary-soft">
              <i class="fas fa-chart-line"></i> View Progress
            </a>
            <a routerLink="/practice/math" class="btn btn-primary-soft">
              <i class="fas fa-calculator"></i> Try Math Practice
            </a>
            <a routerLink="/practice/word-study" class="btn btn-success-soft">
              <i class="fas fa-book-reader"></i> Try Word Study
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export default class ParentHomeComponent {
  readonly auth = inject(AuthService);
  readonly studentService = inject(StudentManagementService);
}
