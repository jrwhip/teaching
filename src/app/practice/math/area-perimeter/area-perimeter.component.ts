import { ChangeDetectionStrategy, Component, signal, ElementRef, viewChild, inject } from '@angular/core';
import { getCanvasTheme } from '../shared/canvas-theme.util';
import { MathResultsService } from '../shared/math-results.service';

type ShapeType = 'rectangle' | 'square' | 'triangle' | 'trapezoid' | 'two-rectangles-side' | 'irregular-l';

interface ShapeProblem {
  dimensions: Record<string, number | string>;
  answer: number;
  isArea: boolean;
}

@Component({
    templateUrl: './area-perimeter.component.html',
    styleUrl: './area-perimeter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AreaPerimeterComponent {
  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('shapeCanvas');
  private readonly results = inject(MathResultsService);

  readonly selectedShape = signal<ShapeType | null>(null);
  readonly problemText = signal('');
  readonly userInput = signal('');
  readonly message = signal('');
  readonly messageColor = signal('');
  readonly solution = signal('');
  readonly hintText = signal('');
  readonly showHint = signal(false);

  private currentProblem: ShapeProblem | null = null;

  readonly shapes: Array<{ type: ShapeType; label: string }> = [
    { type: 'rectangle', label: 'Rectangle' },
    { type: 'square', label: 'Square' },
    { type: 'triangle', label: 'Triangle' },
    { type: 'trapezoid', label: 'Trapezoid' },
    { type: 'two-rectangles-side', label: 'Two Rectangles (Side by Side)' },
    { type: 'irregular-l', label: 'Irregular Shape (L-Shape)' },
  ];

  constructor() {
    this.results.startNewSession();
  }

  selectShape(shape: ShapeType): void {
    this.selectedShape.set(shape);
    this.generateProblem();
  }

  generateProblem(): void {
    const shape = this.selectedShape();
    if (!shape) return;

    this.message.set('');
    this.solution.set('');
    this.userInput.set('');
    this.showHint.set(false);

    const isArea = shape === 'triangle' || shape === 'trapezoid' || Math.random() < 0.5;
    this.currentProblem = this.createShapeProblem(shape, isArea);
    this.problemText.set(`Calculate the ${isArea ? 'area' : 'perimeter'} of the ${shape.replace(/-/g, ' ')}`);
    this.drawShape(shape, this.currentProblem.dimensions);
  }

  insertUnit(unit: string): void {
    const current = this.userInput().trim();
    if (!current.endsWith(unit)) {
      this.userInput.set(current + ' ' + unit);
    }
  }

  checkAnswer(): void {
    if (!this.currentProblem) return;

    const userAnswer = this.userInput().trim();
    const expectedUnit = this.currentProblem.isArea ? 'u\u00B2' : 'u';
    const correctAnswer = `${this.currentProblem.answer} ${expectedUnit}`;
    const isCorrect = userAnswer === correctAnswer;

    this.results.recordAttempt({
      problemType: 'area-perimeter',
      problemCategory: 'Geometry',
      question: this.problemText(),
      correctAnswer,
      studentAnswer: userAnswer,
      isCorrect,
      hint: this.showHint() ? this.hintText() : undefined,
    }).subscribe();

    if (isCorrect) {
      this.message.set('Correct!');
      this.messageColor.set('green');
      this.solution.set('');
      setTimeout(() => this.generateProblem(), 1000);
    } else {
      this.message.set('Incorrect, try again!');
      this.messageColor.set('red');
      this.showSolution();
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

  showHintMessage(): void {
    if (!this.selectedShape() || !this.currentProblem) return;
    this.showHint.set(true);
    this.hintText.set(this.getHintForShape(this.selectedShape()!, this.currentProblem.isArea));
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private createShapeProblem(shape: ShapeType, isArea: boolean): ShapeProblem {
    switch (shape) {
      case 'rectangle': {
        const width = this.randomInt(4, 12);
        const height = this.randomInt(4, 12);
        return { dimensions: { width, height }, answer: isArea ? width * height : 2 * (width + height), isArea };
      }
      case 'square': {
        const side = this.randomInt(5, 12);
        return { dimensions: { side }, answer: isArea ? side ** 2 : 4 * side, isArea };
      }
      case 'triangle': {
        const base = this.randomInt(5, 12);
        const height = this.randomInt(5, 20);
        const sideA = this.randomInt(5, 20);
        const sideB = this.randomInt(5, 20);
        return {
          dimensions: { base, height, sideA, sideB },
          answer: isArea ? 0.5 * base * height : base + sideA + sideB,
          isArea,
        };
      }
      case 'trapezoid': {
        const base1 = this.randomInt(5, 15);
        const base2 = this.randomInt(5, 15);
        const height = this.randomInt(5, 16);
        const sideTrapA = this.randomInt(5, 20);
        const sideTrapB = this.randomInt(5, 20);
        return {
          dimensions: { base1, base2, height, sideTrapA, sideTrapB },
          answer: isArea ? ((base1 + base2) * height) / 2 : base1 + base2 + sideTrapA + sideTrapB,
          isArea,
        };
      }
      case 'two-rectangles-side': {
        const width1 = this.randomInt(5, 12);
        const width2 = this.randomInt(5, 12);
        const commonHeight = this.randomInt(5, 12);
        return {
          dimensions: { width1, width2, height: commonHeight },
          answer: isArea ? (width1 + width2) * commonHeight : 2 * commonHeight + 2 * (width1 + width2),
          isArea,
        };
      }
      case 'irregular-l': {
        let rect1Width = this.randomInt(4, 12);
        let rect2Width: number;
        do { rect2Width = this.randomInt(4, 12); } while (rect2Width === rect1Width);
        const rect1Height = this.randomInt(4, 10);
        const rect2Height = this.randomInt(4, 10);
        const alignSide = Math.random() < 0.5 ? 'left' : 'right';
        const area = rect1Width * rect1Height + rect2Width * rect2Height;
        const perimeter = rect1Width + rect1Height * 2 + rect2Width + rect2Height * 2 + Math.abs(rect1Width - rect2Width);
        return {
          dimensions: { rect1Width, rect1Height, rect2Width, rect2Height, alignSide },
          answer: isArea ? area : perimeter,
          isArea,
        };
      }
    }
  }

  private drawShape(shape: ShapeType, dimensions: Record<string, number | string>): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const theme = getCanvasTheme();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '16px Arial';
    ctx.fillStyle = theme.textColor;
    ctx.strokeStyle = theme.textColor;
    ctx.lineWidth = 1;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const maxSize = Math.min(canvasWidth, canvasHeight) * 0.8;

    const scale = (value: number) => (value / 20) * maxSize;

    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    switch (shape) {
      case 'rectangle': {
        const w = scale(dimensions['width'] as number);
        const h = scale(dimensions['height'] as number);
        ctx.strokeRect(-w / 2, -h / 2, w, h);
        ctx.fillText(`${dimensions['width']}u`, -20, -h / 2 - 10);
        ctx.fillText(`${dimensions['height']}u`, -w / 2 - 30, 0);
        break;
      }
      case 'square': {
        const s = scale(dimensions['side'] as number);
        ctx.strokeRect(-s / 2, -s / 2, s, s);
        ctx.fillText(`${dimensions['side']}u`, -20, -s / 2 - 10);
        break;
      }
      case 'triangle': {
        const b = scale(dimensions['base'] as number);
        const h = scale(dimensions['height'] as number);
        ctx.beginPath();
        ctx.moveTo(-b / 2, h / 2);
        ctx.lineTo(b / 2, h / 2);
        ctx.lineTo(-b / 2, -h / 2);
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(-b / 2, h / 2);
        ctx.lineTo(-b / 2, -h / 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillText(`${dimensions['base']}u`, -20, h / 2 + 20);
        ctx.fillText(`${dimensions['height']}u`, -b / 2 - 50, 0);
        break;
      }
      case 'trapezoid': {
        const b1 = scale(dimensions['base1'] as number);
        const b2 = scale(dimensions['base2'] as number);
        const h = scale(dimensions['height'] as number);
        ctx.beginPath();
        ctx.moveTo(-b1 / 2, h / 2);
        ctx.lineTo(b1 / 2, h / 2);
        ctx.lineTo(b2 / 2, -h / 2);
        ctx.lineTo(-b2 / 2, -h / 2);
        ctx.closePath();
        ctx.stroke();
        const centerX = (-b1 / 2 + b2 / 2) / 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(centerX, h / 2);
        ctx.lineTo(centerX, -h / 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillText(`${dimensions['base1']}u`, -20, h / 2 + 20);
        ctx.fillText(`${dimensions['base2']}u`, -20, -h / 2 - 10);
        ctx.fillText(`${dimensions['height']}u`, centerX + 10, 0);
        break;
      }
      case 'two-rectangles-side': {
        const w1 = scale(dimensions['width1'] as number);
        const w2 = scale(dimensions['width2'] as number);
        const h = scale(dimensions['height'] as number);
        ctx.strokeRect(-w1 - w2 / 2, -h / 2, w1, h);
        ctx.fillText(`${dimensions['width1']}u`, -w1 - w2 / 2 + w1 / 2 - 10, -h / 2 - 10);
        ctx.strokeRect(-w2 / 2, -h / 2, w2, h);
        ctx.fillText(`${dimensions['width2']}u`, -w2 / 2 + w2 / 2 - 10, -h / 2 - 10);
        ctx.fillText(`${dimensions['height']}u`, -w1 - w2 / 2 - 30, 0);
        break;
      }
      case 'irregular-l': {
        const r1w = scale(dimensions['rect1Width'] as number);
        const r1h = scale(dimensions['rect1Height'] as number);
        const r2w = scale(dimensions['rect2Width'] as number);
        const r2h = scale(dimensions['rect2Height'] as number);
        const align = dimensions['alignSide'] as string;

        ctx.beginPath();
        if (align === 'left') {
          ctx.moveTo(-r1w / 2, -r1h / 2);
          ctx.lineTo(r1w / 2, -r1h / 2);
          ctx.lineTo(r1w / 2, r1h / 2);
          ctx.lineTo(-r1w / 2 + r2w, r1h / 2);
          ctx.lineTo(-r1w / 2 + r2w, r1h / 2 + r2h);
          ctx.lineTo(-r1w / 2, r1h / 2 + r2h);
        } else {
          ctx.moveTo(-r1w / 2, -r1h / 2);
          ctx.lineTo(r1w / 2, -r1h / 2);
          ctx.lineTo(r1w / 2, r1h / 2 + r2h);
          ctx.lineTo(r1w / 2 - r2w, r1h / 2 + r2h);
          ctx.lineTo(r1w / 2 - r2w, r1h / 2);
          ctx.lineTo(-r1w / 2, r1h / 2);
        }
        ctx.closePath();
        ctx.stroke();

        const totalHeight = (dimensions['rect1Height'] as number) + (dimensions['rect2Height'] as number);
        ctx.fillText(`${dimensions['rect1Width']}u`, -r1w / 2 + r1w / 2 - 10, -r1h / 2 - 10);

        if (align === 'left') {
          ctx.fillText(`${totalHeight}u`, -r1w / 2 - 30, r1h / 2);
          ctx.fillText(`${dimensions['rect2Height']}u`, -r1w / 2 + r2w + 10, r1h / 2 + r2h / 2);
          ctx.fillText(`${dimensions['rect2Width']}u`, -r1w / 2 + r2w / 2 - 10, r1h / 2 + r2h + 15);
        } else {
          ctx.fillText(`${totalHeight}u`, r1w / 2 + 10, r1h / 2);
          ctx.fillText(`${dimensions['rect2Height']}u`, r1w / 2 - r2w - 30, r1h / 2 + r2h / 2);
          ctx.fillText(`${dimensions['rect2Width']}u`, r1w / 2 - r2w / 2 - 10, r1h / 2 + r2h + 15);
        }
        break;
      }
    }

    ctx.restore();
  }

  private getHintForShape(shape: ShapeType, isArea: boolean): string {
    const hints: Record<string, string> = {
      rectangle: isArea
        ? 'Area = Multiply the width and height of the rectangle.'
        : 'Perimeter = Add all four sides of the rectangle.',
      square: isArea
        ? 'Area = base x height (all sides are the same length).'
        : 'Perimeter = Multiply the side length by 4.',
      triangle: isArea
        ? 'Area = \u00BD \u00D7 base \u00D7 height.'
        : 'Perimeter = base + sideA + sideB.',
      trapezoid: isArea
        ? 'Area = \u00BD \u00D7 (base1 + base2) \u00D7 height.'
        : 'Perimeter = base1 + base2 + sideA + sideB.',
      'two-rectangles-side': isArea
        ? 'Area = (width1 + width2) \u00D7 height.'
        : 'Perimeter = 2 \u00D7 (width1 + width2) + 2 \u00D7 height.',
      'irregular-l': isArea
        ? 'Area = sum of areas of two rectangles.'
        : 'Perimeter = total length of all outer sides.',
    };
    return hints[shape] || '';
  }

  private showSolution(): void {
    if (!this.currentProblem || !this.selectedShape()) return;

    const d = this.currentProblem.dimensions;
    const answer = this.currentProblem.answer;
    const isArea = this.currentProblem.isArea;
    const unit = isArea ? 'u\u00B2' : 'u';
    const shape = this.selectedShape()!;

    const solutions: Record<string, string> = {
      rectangle: isArea
        ? `A = ${d['width']} \u00D7 ${d['height']} = ${answer} ${unit}`
        : `P = 2 \u00D7 (${d['width']} + ${d['height']}) = ${answer} ${unit}`,
      square: isArea
        ? `A = ${d['side']} \u00D7 ${d['side']} = ${answer} ${unit}`
        : `P = 4 \u00D7 ${d['side']} = ${answer} ${unit}`,
      triangle: isArea
        ? `A = \u00BD \u00D7 ${d['base']} \u00D7 ${d['height']} = ${answer} ${unit}`
        : `P = ${d['base']} + ${d['sideA']} + ${d['sideB']} = ${answer} ${unit}`,
      trapezoid: isArea
        ? `A = \u00BD \u00D7 (${d['base1']} + ${d['base2']}) \u00D7 ${d['height']} = ${answer} ${unit}`
        : `P = ${d['base1']} + ${d['base2']} + ${d['sideTrapA']} + ${d['sideTrapB']} = ${answer} ${unit}`,
      'two-rectangles-side': isArea
        ? `A = (${d['width1']} + ${d['width2']}) \u00D7 ${d['height']} = ${answer} ${unit}`
        : `P = 2 \u00D7 (${d['width1']} + ${d['width2']} + ${d['height']}) = ${answer} ${unit}`,
      'irregular-l': isArea
        ? `A = (${d['rect1Width']} \u00D7 ${d['rect1Height']}) + (${d['rect2Width']} \u00D7 ${d['rect2Height']}) = ${answer} ${unit}`
        : `P = ${answer} ${unit}`,
    };

    this.solution.set(solutions[shape] || '');
  }
}
