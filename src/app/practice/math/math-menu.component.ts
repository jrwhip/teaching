import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="section">
      <div class="container">
        <h2 class="mb-1">Math Practice</h2>
        <p class="text-muted mb-4">Choose an activity</p>

        <div class="grid grid-3">
          <a routerLink="quiz" class="card">
            <div class="card-body activity-card">
              <div class="icon-badge icon-badge-primary mb-3">
                <i class="fas fa-calculator"></i>
              </div>
              <h4>Math Quiz</h4>
              <p class="text-muted">40+ problem types across all math topics</p>
            </div>
          </a>

          <a routerLink="quiz2" class="card">
            <div class="card-body activity-card">
              <div class="icon-badge icon-badge-success mb-3">
                <i class="fas fa-list-ol"></i>
              </div>
              <h4>Quiz 2</h4>
              <p class="text-muted">20-problem mixed quiz with streaks</p>
            </div>
          </a>

          <a routerLink="quiz3" class="card">
            <div class="card-body activity-card">
              <div class="icon-badge icon-badge-purple mb-3">
                <i class="fas fa-superscript"></i>
              </div>
              <h4>Solve for N</h4>
              <p class="text-muted">10 algebra problems with fractions</p>
            </div>
          </a>

          <a routerLink="inequality" class="card">
            <div class="card-body activity-card">
              <div class="icon-badge icon-badge-warning mb-3">
                <i class="fas fa-not-equal"></i>
              </div>
              <h4>Graph Inequality</h4>
              <p class="text-muted">Plot inequalities on a number line</p>
            </div>
          </a>

          <a routerLink="coordinate-grid" class="card">
            <div class="card-body activity-card">
              <div class="icon-badge icon-badge-info mb-3">
                <i class="fas fa-th"></i>
              </div>
              <h4>Coordinate Grid</h4>
              <p class="text-muted">Plot points and reflections</p>
            </div>
          </a>

          <a routerLink="area-perimeter" class="card">
            <div class="card-body activity-card">
              <div class="icon-badge icon-badge-orange mb-3">
                <i class="fas fa-shapes"></i>
              </div>
              <h4>Area &amp; Perimeter</h4>
              <p class="text-muted">Calculate area and perimeter of shapes</p>
            </div>
          </a>

          <a routerLink="number-line" class="card">
            <div class="card-body activity-card">
              <div class="icon-badge icon-badge-danger mb-3">
                <i class="fas fa-ruler-horizontal"></i>
              </div>
              <h4>Number Line</h4>
              <p class="text-muted">Place points and find distances</p>
            </div>
          </a>

          <a routerLink="rounding" class="card">
            <div class="card-body activity-card">
              <div class="icon-badge icon-badge-primary mb-3">
                <i class="fas fa-sort-numeric-up"></i>
              </div>
              <h4>Rounding</h4>
              <p class="text-muted">Practice rounding numbers</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .activity-card {
      padding: 1.5rem;
      text-align: center;
    }
    .activity-card .icon-badge {
      width: 48px;
      height: 48px;
      font-size: 1.2rem;
      margin: 0 auto;
    }
    .activity-card h4 {
      margin-bottom: 0.5rem;
    }
    .activity-card .text-muted {
      font-size: var(--text-sm);
    }
    .icon-badge-purple {
      background-color: rgba(var(--color-purple-rgb), 0.1);
      color: var(--color-purple);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-badge-orange {
      background-color: rgba(var(--color-orange-rgb), 0.1);
      color: var(--color-orange);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .grid-3 {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }
  `],
})
export default class MathMenuComponent {}
