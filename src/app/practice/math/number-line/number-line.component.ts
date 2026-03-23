import { Component, signal, computed, ElementRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './number-line.component.html',
  styleUrl: './number-line.component.scss',
})
export default class NumberLineComponent {
  private readonly containerRef = viewChild<ElementRef<HTMLDivElement>>('numberLineContainer');

  readonly start = -10;
  readonly end = 10;

  readonly pointA = signal(0);
  readonly pointB = signal(0);
  readonly userPlacedA = signal<number | null>(null);
  readonly userPlacedB = signal<number | null>(null);
  readonly distanceInput = signal('');
  readonly feedback = signal('');
  readonly feedbackColor = signal('');
  readonly correctCount = signal(0);
  readonly incorrectCount = signal(0);

  readonly markers = computed(() => {
    const items: Array<{ value: number; leftPercent: number }> = [];
    for (let i = this.start; i <= this.end; i++) {
      items.push({
        value: i,
        leftPercent: ((i - this.start) / (this.end - this.start)) * 100,
      });
    }
    return items;
  });

  readonly userMarkerA = computed(() => {
    const val = this.userPlacedA();
    if (val === null) return null;
    return { value: val, leftPercent: ((val - this.start) / (this.end - this.start)) * 100 };
  });

  readonly userMarkerB = computed(() => {
    const val = this.userPlacedB();
    if (val === null) return null;
    return { value: val, leftPercent: ((val - this.start) / (this.end - this.start)) * 100 };
  });

  constructor() {
    this.generateProblem();
  }

  generateProblem(): void {
    let a: number, b: number;
    do {
      a = Math.floor(Math.random() * (this.end - this.start + 1)) + this.start;
      b = Math.floor(Math.random() * (this.end - this.start + 1)) + this.start;
    } while (a === b);

    this.pointA.set(a);
    this.pointB.set(b);
    this.userPlacedA.set(null);
    this.userPlacedB.set(null);
    this.distanceInput.set('');
    this.feedback.set('');
    this.feedbackColor.set('');
  }

  onNumberLineClick(event: MouseEvent): void {
    const container = this.containerRef()?.nativeElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left;
    const width = rect.width;
    const value = Math.round(((clickPosition / width) * (this.end - this.start)) + this.start);

    // Click on existing marker removes it
    if (this.userPlacedA() === value) {
      this.userPlacedA.set(null);
      return;
    }
    if (this.userPlacedB() === value) {
      this.userPlacedB.set(null);
      return;
    }

    // Place new markers
    if (this.userPlacedA() === null) {
      this.userPlacedA.set(value);
    } else if (this.userPlacedB() === null) {
      this.userPlacedB.set(value);
    }
  }

  removeMarkerA(event: MouseEvent): void {
    event.stopPropagation();
    this.userPlacedA.set(null);
  }

  removeMarkerB(event: MouseEvent): void {
    event.stopPropagation();
    this.userPlacedB.set(null);
  }

  checkAnswer(): void {
    const correctDistance = Math.abs(this.pointA() - this.pointB());

    if (this.userPlacedA() === null || this.userPlacedB() === null) {
      this.feedback.set('Please place both markers on the number line.');
      this.feedbackColor.set('red');
      return;
    }

    const correctPoints = [this.pointA(), this.pointB()].sort((a, b) => a - b);
    const userPoints = [this.userPlacedA()!, this.userPlacedB()!].sort((a, b) => a - b);

    if (correctPoints[0] !== userPoints[0] || correctPoints[1] !== userPoints[1]) {
      this.feedback.set(`Incorrect marker placement. Place markers at ${this.pointA()} and ${this.pointB()}.`);
      this.feedbackColor.set('red');
      this.incorrectCount.update(c => c + 1);
      return;
    }

    if (parseInt(this.distanceInput(), 10) === correctDistance) {
      this.feedback.set('Correct!');
      this.feedbackColor.set('green');
      this.correctCount.update(c => c + 1);
      setTimeout(() => this.generateProblem(), 1000);
    } else {
      this.feedback.set(`Incorrect. The correct distance is ${correctDistance}.`);
      this.feedbackColor.set('red');
      this.incorrectCount.update(c => c + 1);
    }
  }

  onKeypress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.checkAnswer();
    }
  }
}
