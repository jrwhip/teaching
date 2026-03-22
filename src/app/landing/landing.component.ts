import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../core/theme.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="hero">
      <div class="container">
        <div class="hero-grid">
          <div class="animate-in">
            <p class="section-label">K-6 Education Platform</p>
            <h1 class="display-heading mb-3">
              Essentials Only.<br>Distractions Not Included.
            </h1>
            <p class="text-muted mb-4" style="max-width: 480px;">
              Focused practice for math, word study, and more.
              Teachers assign, parents track, students learn.
            </p>
            <div class="flex gap-2">
              <a routerLink="/register" class="btn btn-primary btn-xl">Get Started</a>
              <a routerLink="/login" class="btn btn-light btn-xl">Log In</a>
            </div>
          </div>

          <div class="animate-in delay-2">
            <div class="grid grid-3" style="gap: 1rem;">
              <div class="card" style="grid-column: span 2;">
                <div class="card-body flex items-center gap-3">
                  <div class="icon-badge icon-badge-primary">
                    <i class="fas fa-calculator"></i>
                  </div>
                  <div>
                    <div class="stat-value">Math</div>
                    <div class="stat-label">Rounding, operations & more</div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-body text-center">
                  <div class="icon-badge icon-badge-success" style="margin: 0 auto .5rem;">
                    <i class="fas fa-book-reader"></i>
                  </div>
                  <div class="text-sm fw-bold text-heading">Word Study</div>
                </div>
              </div>
              <div class="card">
                <div class="card-body text-center">
                  <div class="icon-badge icon-badge-purple" style="margin: 0 auto .5rem;">
                    <i class="fas fa-chalkboard-teacher"></i>
                  </div>
                  <div class="text-sm fw-bold text-heading">Teachers</div>
                </div>
              </div>
              <div class="card">
                <div class="card-body text-center">
                  <div class="icon-badge icon-badge-warning" style="margin: 0 auto .5rem;">
                    <i class="fas fa-user-friends"></i>
                  </div>
                  <div class="text-sm fw-bold text-heading">Parents</div>
                </div>
              </div>
              <div class="card">
                <div class="card-body text-center">
                  <div class="icon-badge icon-badge-info" style="margin: 0 auto .5rem;">
                    <i class="fas fa-chart-line"></i>
                  </div>
                  <div class="text-sm fw-bold text-heading">Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class LandingComponent {
  readonly theme = inject(ThemeService);
}
