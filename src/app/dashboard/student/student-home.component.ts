import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { StreakDisplayComponent } from '../../shared/components/streak-display.component';

@Component({
  standalone: true,
  imports: [RouterLink, StatCardComponent, StreakDisplayComponent],
  template: `
    <div class="section">
      <div class="container">
        <h2 class="mb-1">Hey, {{ auth.userProfile()?.displayName }}!</h2>
        <p class="text-muted mb-4">Ready to practice?</p>

        <app-streak-display class="mb-4" [current]="0" [best]="0" />

        <div class="grid grid-3 mb-4">
          <app-stat-card icon="fas fa-check-circle" value="0" label="Problems Solved" color="success" />
          <app-stat-card icon="fas fa-clipboard-list" value="0" label="Active Assignments" color="primary" />
          <app-stat-card icon="fas fa-fire" value="0" label="Day Streak" color="orange" />
        </div>

        <h4 class="mb-2">Start Practicing</h4>
        <div class="grid grid-2">
          <a routerLink="/practice/math" class="card">
            <div class="card-body flex items-center gap-3">
              <div class="icon-badge icon-badge-primary">
                <i class="fas fa-calculator"></i>
              </div>
              <div>
                <h5 class="mb-0">Math</h5>
                <p class="text-sm text-muted mb-0">Number rounding and more</p>
              </div>
            </div>
          </a>
          <a routerLink="/practice/word-study" class="card">
            <div class="card-body flex items-center gap-3">
              <div class="icon-badge icon-badge-success">
                <i class="fas fa-book-reader"></i>
              </div>
              <div>
                <h5 class="mb-0">Word Study</h5>
                <p class="text-sm text-muted mb-0">Phonics-based word groups</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
})
export default class StudentHomeComponent {
  readonly auth = inject(AuthService);
}
