import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="section">
      <div class="container">
        <h2 class="mb-1">Practice</h2>
        <p class="text-muted mb-4">Choose a subject to start practicing</p>

        <div class="grid grid-2">
          <a routerLink="math" class="card">
            <div class="card-body" style="padding: 2rem;">
              <div class="icon-badge icon-badge-primary mb-3" style="width: 64px; height: 64px; font-size: 1.6rem;">
                <i class="fas fa-calculator"></i>
              </div>
              <h3>Math</h3>
              <p class="text-muted">Quizzes, number lines, coordinate grids, geometry, and more.</p>
              <span class="btn btn-primary-soft btn-sm">Start Practice</span>
            </div>
          </a>
          <a routerLink="word-study" class="card">
            <div class="card-body" style="padding: 2rem;">
              <div class="icon-badge icon-badge-success mb-3" style="width: 64px; height: 64px; font-size: 1.6rem;">
                <i class="fas fa-book-reader"></i>
              </div>
              <h3>Word Study</h3>
              <p class="text-muted">Phonics-based word grouping and practice for reading skills.</p>
              <span class="btn btn-success-soft btn-sm">Start Practice</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
})
export default class PracticeMenuComponent {}
