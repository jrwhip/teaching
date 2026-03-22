import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div class="card card-flat">
      <div class="card-body flex items-center gap-3">
        <div class="icon-badge" [class]="'icon-badge-' + color()">
          <i [class]="icon()"></i>
        </div>
        <div>
          <div class="stat-value">{{ value() }}</div>
          <div class="stat-label">{{ label() }}</div>
        </div>
      </div>
    </div>
  `,
})
export class StatCardComponent {
  icon = input('fas fa-chart-bar');
  value = input('0');
  label = input('');
  color = input('primary');
}
