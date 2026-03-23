import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-streak-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="streak-display">
      <div class="streak-item">
        <div class="streak-number">{{ current() }}</div>
        <div class="streak-label">Current Streak</div>
      </div>
      <div class="streak-item">
        <div class="streak-number best">{{ best() }}</div>
        <div class="streak-label">Best Streak</div>
      </div>
    </div>
  `,
})
export class StreakDisplayComponent {
  current = input(0);
  best = input(0);
}
