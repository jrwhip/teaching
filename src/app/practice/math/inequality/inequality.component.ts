import { ChangeDetectionStrategy, Component, signal, computed, ElementRef, viewChild, inject } from '@angular/core';
import { MathResultsService } from '../shared/math-results.service';

type CircleType = 'open' | 'closed';
type Direction = 'left' | 'right';

@Component({
  templateUrl: './inequality.component.html',
  styleUrl: './inequality.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InequalityComponent {
  private readonly containerRef = viewChild<ElementRef<HTMLDivElement>>('numberLineContainer');
  private readonly results = inject(MathResultsService);

  readonly tickCount = 21;
  readonly correctCount = signal(0);
  readonly incorrectCount = signal(0);
  readonly inequality = signal('');
  readonly targetValue = signal(0);
  readonly correctDirection = signal<Direction>('right');
  readonly circleType = signal<CircleType>('open');
  readonly selectedDirection = signal<Direction | null>(null);
  readonly circleChosen = signal(false);
  readonly directionChosen = signal(false);
  readonly markerPosition = signal<number | null>(null);
  readonly errorMessage = signal('');
  readonly resultMessage = signal('');
  readonly resultStyle = signal('');

  readonly ticks = computed(() =>
    Array.from({ length: this.tickCount }, (_, i) => ({ index: i, value: i - 10 }))
  );

  constructor() {
    this.results.startNewSession();
    this.generateProblem();
  }

  generateProblem(): void {
    this.circleType.set('open');
    this.selectedDirection.set(null);
    this.circleChosen.set(false);
    this.directionChosen.set(false);
    this.markerPosition.set(null);
    this.errorMessage.set('');
    this.resultMessage.set('');
    this.resultStyle.set('');

    const targetValue = Math.floor(Math.random() * 21) - 10;
    const includeEqual = Math.random() < 0.5;
    const direction: Direction = Math.random() < 0.5 ? 'left' : 'right';

    let inequality: string;
    if (direction === 'right') {
      inequality = includeEqual ? '\u2265' : '>';
    } else {
      inequality = includeEqual ? '\u2264' : '<';
    }

    this.targetValue.set(targetValue);
    this.inequality.set(inequality);
    this.correctDirection.set(direction);
  }

  setCircleType(type: CircleType): void {
    this.circleType.set(type);
    this.circleChosen.set(true);
  }

  setDirection(dir: Direction): void {
    this.selectedDirection.set(dir);
    this.directionChosen.set(true);
  }

  onNumberLineClick(event: MouseEvent): void {
    if (!this.circleChosen()) {
      this.errorMessage.set('Please select a circle type before placing a marker.');
      return;
    }
    if (!this.directionChosen()) {
      this.errorMessage.set('Please select a direction before placing a marker.');
      return;
    }

    this.errorMessage.set('');
    const container = this.containerRef()?.nativeElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const step = container.offsetWidth / (this.tickCount - 1);
    const closestIndex = Math.round(x / step);
    this.markerPosition.set(closestIndex - 10);
  }

  getMarkerLeftPx(): number {
    const pos = this.markerPosition();
    if (pos === null) return 0;
    const container = this.containerRef()?.nativeElement;
    if (!container) return 0;
    const step = container.offsetWidth / (this.tickCount - 1);
    return (pos + 10) * step;
  }

  getLineStyle(): { left: string; width: string } | null {
    if (this.markerPosition() === null || !this.selectedDirection()) return null;
    const container = this.containerRef()?.nativeElement;
    if (!container) return null;

    const step = container.offsetWidth / (this.tickCount - 1);
    const startIndex = this.markerPosition()! + 10;

    if (this.selectedDirection() === 'right') {
      return {
        left: `${startIndex * step}px`,
        width: `${container.offsetWidth - startIndex * step}px`,
      };
    } else {
      return {
        left: '0px',
        width: `${startIndex * step}px`,
      };
    }
  }

  checkAnswer(): void {
    if (this.markerPosition() === null) {
      this.errorMessage.set('Please place a marker first!');
      return;
    }

    const question = `x ${this.inequality()} ${this.targetValue()}`;
    const correctPosition = this.markerPosition() === this.targetValue();

    let correctCircle = false;
    const ineq = this.inequality();
    const circle = this.circleType();
    if (
      (ineq === '\u2265' && circle === 'closed') ||
      (ineq === '>' && circle === 'open') ||
      (ineq === '\u2264' && circle === 'closed') ||
      (ineq === '<' && circle === 'open')
    ) {
      correctCircle = true;
    }

    let correctDir = false;
    const dir = this.selectedDirection();
    if ((ineq === '>' || ineq === '\u2265') && dir === 'right') {
      correctDir = true;
    } else if ((ineq === '<' || ineq === '\u2264') && dir === 'left') {
      correctDir = true;
    }

    const isCorrect = correctPosition && correctCircle && correctDir;
    const studentAnswer = `pos=${this.markerPosition()}, circle=${circle}, dir=${dir}`;
    const correctAnswer = `pos=${this.targetValue()}, circle=${ineq.includes('=') ? 'closed' : 'open'}, dir=${this.correctDirection()}`;

    this.results.recordAttempt({
      problemType: 'inequality',
      problemCategory: 'Geometry',
      question,
      correctAnswer,
      studentAnswer,
      isCorrect,
    });

    if (isCorrect) {
      this.errorMessage.set('');
      this.resultMessage.set('Correct!');
      this.resultStyle.set('correct');
      this.correctCount.update(c => c + 1);
      setTimeout(() => this.generateProblem(), 1000);
    } else {
      this.incorrectCount.update(c => c + 1);
      if (!correctDir) {
        this.errorMessage.set('Incorrect direction! Adjust it and try again.');
      } else if (!correctCircle) {
        this.errorMessage.set('Incorrect circle type! Adjust it and try again.');
      } else {
        this.errorMessage.set('Incorrect position! Try again.');
      }
    }
  }
}
