import { Component, signal, computed, ElementRef, viewChild } from '@angular/core';

type Mode = 'plotCoordinate' | 'reflection';
interface Point { x: number; y: number; }

@Component({
  standalone: true,
  templateUrl: './coordinate-grid.component.html',
  styleUrl: './coordinate-grid.component.scss',
})
export default class CoordinateGridComponent {
  private readonly gridRef = viewChild<ElementRef<HTMLDivElement>>('gridContainer');

  readonly gridSize = 500;
  readonly axisRange = 8;

  readonly mode = signal<Mode>('plotCoordinate');
  readonly targetPoint = signal<Point>({ x: 0, y: 0 });
  readonly reflectionType = signal<'x-axis' | 'y-axis'>('x-axis');
  readonly userPoint = signal<Point | null>(null);
  readonly userReflection = signal<Point | null>(null);
  readonly instruction = signal('');
  readonly feedback = signal('');
  readonly feedbackColor = signal('');
  readonly correctCount = signal(0);
  readonly incorrectCount = signal(0);

  // Markers to render
  readonly markers = signal<Array<{ x: number; y: number; type: 'user' | 'correct' | 'incorrect' }>>([]);

  readonly gridLines = computed(() => {
    const lines: Array<{ offset: number; value: number }> = [];
    for (let i = -this.axisRange; i <= this.axisRange; i++) {
      lines.push({
        offset: ((i + this.axisRange) / (2 * this.axisRange)) * 100,
        value: i,
      });
    }
    return lines;
  });

  constructor() {
    this.generateProblem();
  }

  setMode(mode: Mode): void {
    this.mode.set(mode);
    this.generateProblem();
  }

  generateProblem(): void {
    this.userPoint.set(null);
    this.userReflection.set(null);
    this.feedback.set('');
    this.feedbackColor.set('');
    this.markers.set([]);

    const x = Math.floor(Math.random() * (2 * this.axisRange + 1)) - this.axisRange;
    const y = Math.floor(Math.random() * (2 * this.axisRange + 1)) - this.axisRange;
    this.targetPoint.set({ x, y });

    if (this.mode() === 'plotCoordinate') {
      this.instruction.set(`Place the point at (${x}, ${y}).`);
    } else {
      const refType = Math.random() > 0.5 ? 'x-axis' : 'y-axis';
      this.reflectionType.set(refType);
      this.instruction.set(`Place the point at (${x}, ${y}) and its ${refType} reflection.`);
    }
  }

  onGridClick(event: MouseEvent): void {
    const grid = this.gridRef()?.nativeElement;
    if (!grid) return;

    const rect = grid.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const x = Math.round((clickX / this.gridSize) * (2 * this.axisRange) - this.axisRange);
    const y = Math.round(this.axisRange - (clickY / this.gridSize) * (2 * this.axisRange));

    if (this.mode() === 'plotCoordinate' && !this.userPoint()) {
      this.userPoint.set({ x, y });
      this.markers.update(m => [...m, { x, y, type: 'user' as const }]);
      this.checkPlotCoordinateAnswer();
    } else if (this.mode() === 'reflection') {
      if (!this.userPoint()) {
        this.userPoint.set({ x, y });
        this.markers.update(m => [...m, { x, y, type: 'user' as const }]);
      } else if (!this.userReflection()) {
        this.userReflection.set({ x, y });
        this.markers.update(m => [...m, { x, y, type: 'user' as const }]);
        this.checkReflectionAnswer();
      }
    }
  }

  getMarkerLeft(x: number): number {
    return ((x + this.axisRange) / (2 * this.axisRange)) * this.gridSize;
  }

  getMarkerTop(y: number): number {
    return ((this.axisRange - y) / (2 * this.axisRange)) * this.gridSize;
  }

  private checkPlotCoordinateAnswer(): void {
    const user = this.userPoint()!;
    const target = this.targetPoint();
    let timeout: number;

    if (user.x === target.x && user.y === target.y) {
      this.feedback.set('Correct!');
      this.feedbackColor.set('green');
      this.correctCount.update(c => c + 1);
      timeout = 900;
    } else {
      this.feedback.set('Incorrect.');
      this.feedbackColor.set('red');
      this.markers.update(m => [
        ...m.map(mk => mk.type === 'user' ? { ...mk, type: 'incorrect' as const } : mk),
        { x: target.x, y: target.y, type: 'correct' as const },
      ]);
      this.incorrectCount.update(c => c + 1);
      timeout = 3000;
    }

    this.correctCount(); // trigger reactivity
    setTimeout(() => this.generateProblem(), timeout);
  }

  private checkReflectionAnswer(): void {
    const target = this.targetPoint();
    const expectedReflection: Point = this.reflectionType() === 'x-axis'
      ? { x: target.x, y: -target.y }
      : { x: -target.x, y: target.y };

    const user = this.userPoint()!;
    const userRef = this.userReflection()!;

    const isCorrectPoint = user.x === target.x && user.y === target.y;
    const isCorrectReflection = userRef.x === expectedReflection.x && userRef.y === expectedReflection.y;

    let timeout: number;

    if (isCorrectPoint && isCorrectReflection) {
      this.feedback.set('Correct!');
      this.feedbackColor.set('green');
      this.correctCount.update(c => c + 1);
      timeout = 900;
    } else {
      this.feedback.set('Incorrect.');
      this.feedbackColor.set('red');

      const updated = this.markers().map(mk => {
        if (mk.type === 'user') {
          const isFirst = mk.x === user.x && mk.y === user.y;
          if (isFirst && !isCorrectPoint) return { ...mk, type: 'incorrect' as const };
          if (!isFirst && !isCorrectReflection) return { ...mk, type: 'incorrect' as const };
        }
        return mk;
      });

      this.markers.set([
        ...updated,
        { x: target.x, y: target.y, type: 'correct' as const },
        { x: expectedReflection.x, y: expectedReflection.y, type: 'correct' as const },
      ]);

      this.incorrectCount.update(c => c + 1);
      timeout = 4000;
    }

    setTimeout(() => this.generateProblem(), timeout);
  }
}
