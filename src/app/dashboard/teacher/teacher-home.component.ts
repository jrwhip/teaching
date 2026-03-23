import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { StatCardComponent } from '../../shared/components/stat-card.component';

@Component({
    imports: [RouterLink, StatCardComponent],
    template: `
    <div class="section">
      <div class="container">
        <h2 class="mb-1">Welcome, {{ auth.userProfile()?.displayName }}</h2>
        <p class="text-muted mb-4">Teacher Dashboard</p>

        <div class="grid grid-3 mb-4">
          <app-stat-card icon="fas fa-school" value="0" label="Classrooms" color="primary" />
          <app-stat-card icon="fas fa-user-graduate" value="0" label="Students" color="success" />
          <app-stat-card icon="fas fa-clipboard-list" value="0" label="Assignments" color="purple" />
        </div>

        <div class="card card-flat">
          <div class="card-header">
            <h5 class="mb-0">Quick Actions</h5>
          </div>
          <div class="card-body flex gap-2">
            <a routerLink="/practice/math/results/teacher" class="btn btn-primary-soft">
              <i class="fas fa-chart-bar"></i> Student Results
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
export default class TeacherHomeComponent {
  readonly auth = inject(AuthService);
}
