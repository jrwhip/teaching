import { ChangeDetectionStrategy, Component, signal, computed, ElementRef, viewChild, inject } from '@angular/core';
import { MathResultsService } from '../shared/math-results.service';
import { getTaxonomy } from '../shared/problem-taxonomy';

@Component({
    templateUrl: './number-line.component.html',
    styleUrl: './number-line.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NumberLineComponent {
  private readonly containerRef = viewChild<ElementRef<HTMLDivElement>>('numberLineContainer');
  private readonly results = inject(MathResultsService);

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

  readonly markers = computed(() =>
    Array.from({ length: this.end - this.start + 1 }, (_, i) => {
      const value = this.start + i;
      return { value, leftPercent: ((value - this.start) / (this.end - this.start)) * 100 };
    })
  );

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
    this.results.startNewSession();
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

    if (this.userPlacedA() === value) {
      this.userPlacedA.set(null);
      return;
    }
    if (this.userPlacedB() === value) {
      this.userPlacedB.set(null);
      return;
    }

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
    const question = `Distance between ${this.pointA()} and ${this.pointB()}`;

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
      const taxonomy = getTaxonomy('number-line');
      this.results.recordAttempt({
        problemType: 'number-line',
        problemCategory: 'Geometry',
        question,
        correctAnswer: `Markers at ${this.pointA()}, ${this.pointB()}; distance ${correctDistance}`,
        studentAnswer: `Markers at ${this.userPlacedA()}, ${this.userPlacedB()}`,
        isCorrect: false,
        difficulty: taxonomy.difficulty,
        gradeLevel: taxonomy.gradeLevel,
      });
      return;
    }

    const isCorrect = parseInt(this.distanceInput(), 10) === correctDistance;

    const taxonomy = getTaxonomy('number-line');
    this.results.recordAttempt({
      problemType: 'number-line',
      problemCategory: 'Geometry',
      question,
      correctAnswer: String(correctDistance),
      studentAnswer: this.distanceInput(),
      isCorrect,
      difficulty: taxonomy.difficulty,
      gradeLevel: taxonomy.gradeLevel,
    });

    if (isCorrect) {
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

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
