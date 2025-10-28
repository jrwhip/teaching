import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../components/navbar/navbar.component';

type ShapeType = 'rectangle' | 'square' | 'triangle' | 'trapezoid' | 'two-rectangles-side' | 'irregular-l';

interface RectangleDimensions {
  width: number;
  height: number;
}

interface SquareDimensions {
  side: number;
}

interface TriangleDimensions {
  base: number;
  height: number;
  sideA: number;
  sideB: number;
}

interface TrapezoidDimensions {
  base1: number;
  base2: number;
  height: number;
  sideTrapA: number;
  sideTrapB: number;
}

interface TwoRectanglesDimensions {
  width1: number;
  width2: number;
  height: number;
}

interface IrregularLDimensions {
  rect1Width: number;
  rect1Height: number;
  rect2Width: number;
  rect2Height: number;
  alignSide: 'left' | 'right';
}

type ShapeDimensions = RectangleDimensions | SquareDimensions | TriangleDimensions |
                       TrapezoidDimensions | TwoRectanglesDimensions | IrregularLDimensions;

interface Problem {
  dimensions: ShapeDimensions;
  answer: number;
}

@Component({
  selector: 'app-area',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements AfterViewInit {
  @ViewChild('shapeCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  shapes: { value: ShapeType; label: string }[] = [
    { value: 'rectangle', label: 'Rectangle' },
    { value: 'square', label: 'Square' },
    { value: 'triangle', label: 'Triangle' },
    { value: 'trapezoid', label: 'Trapezoid' },
    { value: 'two-rectangles-side', label: 'Two Rectangles (Side by Side)' },
    { value: 'irregular-l', label: 'Irregular Shape (L-Shape)' }
  ];

  selectedShape: ShapeType | null = null;
  currentProblem: Problem | null = null;
  problemText: string = '';
  userInput: string = '';
  message: string = '';
  solution: string = '';

  ngAfterViewInit(): void {
    // Canvas is now available
  }

  selectShape(shape: ShapeType): void {
    this.selectedShape = shape;
    this.generateProblem();
  }

  generateProblem(): void {
    if (!this.selectedShape) {
      alert('Please select a shape first!');
      return;
    }

    this.message = '';
    this.solution = '';
    this.userInput = '';

    // Determine if the question should be for area or perimeter
    const isArea = this.selectedShape === 'triangle' || this.selectedShape === 'trapezoid' || Math.random() < 0.5;

    // Generate a problem based on the selected shape
    this.currentProblem = this.createShapeProblem(this.selectedShape, isArea);

    // Update the problem text
    this.problemText = `Calculate the ${isArea ? 'area' : 'perimeter'} of the ${this.selectedShape}`;

    // Draw the selected shape with its dimensions
    this.drawShape(this.selectedShape, this.currentProblem.dimensions);
  }

  createShapeProblem(shape: ShapeType, isArea: boolean): Problem {
    switch (shape) {
      case 'rectangle': {
        const width = this.randomInt(4, 12);
        const height = this.randomInt(4, 12);
        return {
          dimensions: { width, height },
          answer: isArea ? width * height : 2 * (width + height)
        };
      }
      case 'square': {
        const side = this.randomInt(5, 12);
        return {
          dimensions: { side },
          answer: isArea ? side ** 2 : 4 * side
        };
      }
      case 'triangle': {
        const base = this.randomInt(5, 12);
        const heightTriangle = this.randomInt(5, 20);
        const sideA = this.randomInt(5, 20);
        const sideB = this.randomInt(5, 20);
        return {
          dimensions: { base, height: heightTriangle, sideA, sideB },
          answer: isArea ? 0.5 * base * heightTriangle : base + sideA + sideB
        };
      }
      case 'trapezoid': {
        const base1 = this.randomInt(5, 15);
        const base2 = this.randomInt(5, 15);
        const heightTrap = this.randomInt(5, 16);
        const sideTrapA = this.randomInt(5, 20);
        const sideTrapB = this.randomInt(5, 20);
        return {
          dimensions: { base1, base2, height: heightTrap, sideTrapA, sideTrapB },
          answer: isArea ? ((base1 + base2) * heightTrap) / 2 : base1 + base2 + sideTrapA + sideTrapB
        };
      }
      case 'two-rectangles-side': {
        const width1 = this.randomInt(5, 12);
        const width2 = this.randomInt(5, 12);
        const commonHeight = this.randomInt(5, 12);
        return {
          dimensions: { width1, width2, height: commonHeight },
          answer: isArea ? (width1 + width2) * commonHeight : 2 * commonHeight + 2 * (width1 + width2)
        };
      }
      case 'irregular-l': {
        let rect1Width = this.randomInt(4, 12);
        let rect2Width;
        do {
          rect2Width = this.randomInt(4, 12);
        } while (rect2Width === rect1Width);

        const rect1Height = this.randomInt(4, 10);
        const rect2Height = this.randomInt(4, 10);
        const alignSide: 'left' | 'right' = Math.random() < 0.5 ? 'left' : 'right';

        const area = rect1Width * rect1Height + rect2Width * rect2Height;
        const perimeter = rect1Width + rect1Height * 2 + rect2Width + rect2Height * 2 + Math.abs(rect1Width - rect2Width);

        console.log(`Irregular L-Shape (${alignSide} alignment):`);
        console.log(`  Area: Top Rectangle (${rect1Width} x ${rect1Height}) + Bottom Rectangle (${rect2Width} x ${rect2Height}) = ${area}`);
        console.log(`  Perimeter: ${perimeter}`);

        return {
          dimensions: { rect1Width, rect1Height, rect2Width, rect2Height, alignSide },
          answer: isArea ? area : perimeter
        };
      }
    }
  }

  drawShape(shape: ShapeType, dimensions: ShapeDimensions): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const maxSize = Math.min(canvasWidth, canvasHeight) * 0.8;

    const scale = (value: number, maxOriginalSize: number): number => {
      return (value / maxOriginalSize) * maxSize;
    };

    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    switch (shape) {
      case 'rectangle': {
        const dims = dimensions as RectangleDimensions;
        const width = scale(dims.width, 20);
        const height = scale(dims.height, 20);
        ctx.strokeRect(-width / 2, -height / 2, width, height);
        ctx.fillText(`${dims.width}u`, -20, -height / 2 - 10);
        ctx.fillText(`${dims.height}u`, -width / 2 - 30, 0);
        break;
      }
      case 'square': {
        const dims = dimensions as SquareDimensions;
        const side = scale(dims.side, 20);
        ctx.strokeRect(-side / 2, -side / 2, side, side);
        ctx.fillText(`${dims.side}u`, -20, -side / 2 - 10);
        break;
      }
      case 'triangle': {
        const dims = dimensions as TriangleDimensions;
        const base = scale(dims.base, 20);
        const height = scale(dims.height, 20);

        ctx.beginPath();
        ctx.moveTo(-base / 2, height / 2);
        ctx.lineTo(base / 2, height / 2);
        ctx.lineTo(-base / 2, -height / 2);
        ctx.closePath();
        ctx.stroke();

        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(-base / 2, height / 2);
        ctx.lineTo(-base / 2, -height / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillText(`${dims.base}u`, -20, height / 2 + 20);
        ctx.fillText(`${dims.height}u`, -base / 2 - 50, 0);
        break;
      }
      case 'trapezoid': {
        const dims = dimensions as TrapezoidDimensions;
        const base1 = scale(dims.base1, 20);
        const base2 = scale(dims.base2, 20);
        const height = scale(dims.height, 20);

        ctx.beginPath();
        ctx.moveTo(-base1 / 2, height / 2);
        ctx.lineTo(base1 / 2, height / 2);
        ctx.lineTo(base2 / 2, -height / 2);
        ctx.lineTo(-base2 / 2, -height / 2);
        ctx.closePath();
        ctx.stroke();

        const centerX = (-base1 / 2 + base2 / 2) / 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(centerX, height / 2);
        ctx.lineTo(centerX, -height / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillText(`${dims.base1}u`, -20, height / 2 + 20);
        ctx.fillText(`${dims.base2}u`, -20, -height / 2 - 10);
        ctx.fillText(`${dims.height}u`, centerX + 10, 0);
        break;
      }
      case 'two-rectangles-side': {
        const dims = dimensions as TwoRectanglesDimensions;
        const width1 = scale(dims.width1, 20);
        const width2 = scale(dims.width2, 20);
        const height = scale(dims.height, 20);

        ctx.strokeRect(-width1 - width2 / 2, -height / 2, width1, height);
        ctx.fillText(`${dims.width1}u`, -width1 - width2 / 2 + width1 / 2 - 10, -height / 2 - 10);

        ctx.strokeRect(-width2 / 2, -height / 2, width2, height);
        ctx.fillText(`${dims.width2}u`, -width2 / 2 + width2 / 2 - 10, -height / 2 - 10);

        ctx.fillText(`${dims.height}u`, -width1 - width2 / 2 - 30, 0);
        break;
      }
      case 'irregular-l': {
        const dims = dimensions as IrregularLDimensions;
        const rect1Width = scale(dims.rect1Width, 20);
        const rect1Height = scale(dims.rect1Height, 20);
        const rect2Width = scale(dims.rect2Width, 20);
        const rect2Height = scale(dims.rect2Height, 20);
        const alignSide = dims.alignSide;

        const irregularOffset = -canvasHeight * 0.15;
        ctx.save();
        ctx.translate(0, irregularOffset);

        ctx.beginPath();
        if (alignSide === 'left') {
          ctx.moveTo(-rect1Width / 2, -rect1Height / 2);
          ctx.lineTo(rect1Width / 2, -rect1Height / 2);
          ctx.lineTo(rect1Width / 2, rect1Height / 2);
          ctx.lineTo(-rect1Width / 2 + rect2Width, rect1Height / 2);
          ctx.lineTo(-rect1Width / 2 + rect2Width, rect1Height / 2 + rect2Height);
          ctx.lineTo(-rect1Width / 2, rect1Height / 2 + rect2Height);
          ctx.lineTo(-rect1Width / 2, -rect1Height / 2);
        } else {
          ctx.moveTo(-rect1Width / 2, -rect1Height / 2);
          ctx.lineTo(rect1Width / 2, -rect1Height / 2);
          ctx.lineTo(rect1Width / 2, rect1Height / 2 + rect2Height);
          ctx.lineTo(rect1Width / 2 - rect2Width, rect1Height / 2 + rect2Height);
          ctx.lineTo(rect1Width / 2 - rect2Width, rect1Height / 2);
          ctx.lineTo(-rect1Width / 2, rect1Height / 2);
          ctx.lineTo(-rect1Width / 2, -rect1Height / 2);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        const totalHeight = dims.rect1Height + dims.rect2Height;
        if (alignSide === 'left') {
          ctx.fillText(`${totalHeight}u`, -rect1Width / 2 - 30, irregularOffset + rect1Height / 2);
          ctx.fillText(`${dims.rect2Height}u`, -rect1Width / 2 + rect2Width + 10, irregularOffset + rect1Height / 2 + rect2Height / 2);
        } else {
          ctx.fillText(`${totalHeight}u`, rect1Width / 2 + 10, irregularOffset + rect1Height / 2);
          ctx.fillText(`${dims.rect2Height}u`, rect1Width / 2 - rect2Width - 30, irregularOffset + rect1Height / 2 + rect2Height / 2);
        }

        ctx.fillText(`${dims.rect1Width}u`, -rect1Width / 2 + rect1Width / 2 - 10, irregularOffset - rect1Height / 2 - 10);
        ctx.fillText(
          `${dims.rect2Width}u`,
          alignSide === 'left' ? -rect1Width / 2 + rect2Width / 2 - 10 : rect1Width / 2 - rect2Width / 2 - 10,
          irregularOffset + rect1Height / 2 + rect2Height + 15
        );
        break;
      }
    }

    ctx.restore();
  }

  insertUnit(unit: string): void {
    const currentValue = this.userInput.trim();
    if (!currentValue.endsWith(unit)) {
      this.userInput = currentValue + ' ' + unit;
    }
  }

  checkAnswer(): void {
    const userAnswer = this.userInput.trim();
    const isArea = this.problemText.includes('area');
    const expectedUnit = isArea ? 'u²' : 'u';
    const correctAnswer = `${this.currentProblem!.answer} ${expectedUnit}`;

    if (userAnswer === correctAnswer) {
      this.message = 'Correct!';
      this.solution = '';

      setTimeout(() => {
        this.generateProblem();
      }, 1000);
    } else {
      this.message = 'Incorrect, try again!';
      this.showSolution();
    }
  }

  showHint(): void {
    if (!this.selectedShape) {
      alert('Please select a shape first!');
      return;
    }

    const isArea = this.problemText.includes('area');
    const hintMessages: Record<ShapeType, { area: string; perimeter: string }> = {
      rectangle: {
        area: 'Area = Multiply the width and height of the rectangle to find how many square units fit inside.',
        perimeter: 'Perimeter = Add all four sides of the rectangle.'
      },
      square: {
        area: 'Area = base x Height (with a square all sides are the same length).',
        perimeter: 'Perimeter = Choice 1.) Add all 4 sides of the square. Choice 2.) Multiply the side length by 4.'
      },
      triangle: {
        area: 'Area = ½ × base × height. Multiply the base and height, then divide by 2.',
        perimeter: 'Perimeter = base + sideA + sideB. Add all three sides together.'
      },
      trapezoid: {
        area: 'Area = ½ × (base1 + base2) × height. Add the two bases, multiply by height, then divide by 2.',
        perimeter: 'Perimeter = base1 + base2 + sideA + sideB. Add all four sides together.'
      },
      'two-rectangles-side': {
        area: 'Area = (width1 + width2) × height. Add the widths of both rectangles and multiply by the height.',
        perimeter: 'Perimeter = 2 × (width1 + width2) + 2 × height. Add the widths of both rectangles and the height, then multiply by 2.'
      },
      'irregular-l': {
        area: 'Area = sum of areas of two rectangles. Calculate each rectangle\'s area and add them.',
        perimeter: 'Perimeter = total length of all sides, considering shared edges. Add lengths of each side carefully.'
      }
    };

    this.message = hintMessages[this.selectedShape][isArea ? 'area' : 'perimeter'];
  }

  showSolution(): void {
    if (!this.currentProblem || !this.selectedShape) return;

    const dims = this.currentProblem.dimensions;
    const answer = this.currentProblem.answer;
    const isArea = this.problemText.includes('area');
    const unit = isArea ? 'u²' : 'u';

    let solutionText = '';

    switch (this.selectedShape) {
      case 'rectangle': {
        const d = dims as RectangleDimensions;
        solutionText = isArea
          ? `Formula: A = w × h (Area = width × height).<br>
             What it means: w = width, h = height.<br>
             Example: A = ${d.width} × ${d.height} = ${answer} ${unit}.`
          : `Formula: P = 2 × (w + h) (Perimeter = 2 × (width + height)).<br>
             What it means: w = width, h = height.<br>
             Example: P = 2 × (${d.width} + ${d.height}) = ${answer} ${unit}.`;
        break;
      }
      case 'square': {
        const d = dims as SquareDimensions;
        solutionText = isArea
          ? `Formula: A = s × s (Area = side × side).<br>
             What it means: s = side length.<br>
             Example: A = ${d.side} × ${d.side} = ${answer} ${unit}.`
          : `Formula: P = 4 × s (Perimeter = 4 × side).<br>
             What it means: s = side length.<br>
             Example: P = 4 × ${d.side} = ${answer} ${unit}.`;
        break;
      }
      case 'triangle': {
        const d = dims as TriangleDimensions;
        solutionText = isArea
          ? `Formula: A = ½ × b × h or A = (b × h) ÷ 2 (Area = one-half base times height).<br>
             What it means: b = base, h = height.<br>
             Example: A = ½ × ${d.base} × ${d.height} = ${answer} ${unit}.<br>
             Or: A = (${d.base} × ${d.height}) ÷ 2 = ${answer} ${unit}.`
          : `Formula: P = b + s₁ + s₂ (Perimeter = base + side1 + side2).<br>
             What it means: b = base, s₁ = side1, s₂ = side2.<br>
             Example: P = ${d.base} + ${d.sideA} + ${d.sideB} = ${answer} ${unit}.`;
        break;
      }
      case 'trapezoid': {
        const d = dims as TrapezoidDimensions;
        solutionText = isArea
          ? `Formula: A = ½ × (b₁ + b₂) × h or A = ((b₁ + b₂) × h) ÷ 2 (Area = one-half the sum of bases times height).<br>
             What it means: b₁ = base1, b₂ = base2, h = height.<br>
             Example: A = ½ × (${d.base1} + ${d.base2}) × ${d.height} = ${answer} ${unit}.<br>
             Or: A = ((${d.base1} + ${d.base2}) × ${d.height}) ÷ 2 = ${answer} ${unit}.`
          : `Formula: P = b₁ + b₂ + s₁ + s₂ (Perimeter = sum of all sides).<br>
             What it means: b₁ = base1, b₂ = base2, s₁ = side1, s₂ = side2.<br>
             Example: P = ${d.base1} + ${d.base2} + ${d.sideTrapA} + ${d.sideTrapB} = ${answer} ${unit}.`;
        break;
      }
      case 'two-rectangles-side': {
        const d = dims as TwoRectanglesDimensions;
        solutionText = isArea
          ? `Formula: A = (w₁ + w₂) × h (Area = sum of widths times height).<br>
             What it means: w₁ = width1, w₂ = width2, h = height.<br>
             Example: A = (${d.width1} + ${d.width2}) × ${d.height} = ${answer} ${unit}.`
          : `Formula: P = 2 × (w₁ + w₂ + h) (Perimeter = two times sum of widths and height).<br>
             What it means: w₁ = width1, w₂ = width2, h = height.<br>
             Example: P = 2 × (${d.width1} + ${d.width2} + ${d.height}) = ${answer} ${unit}.`;
        break;
      }
      case 'irregular-l': {
        const d = dims as IrregularLDimensions;
        solutionText = isArea
          ? `Formula: A = A₁ + A₂ (Area = sum of areas of two rectangles).<br>
             What it means: A₁ = area of the top rectangle, A₂ = area of the bottom rectangle.<br>
             Example:<br>
             Top rectangle: A₁ = ${d.rect1Width} × ${d.rect1Height} = ${d.rect1Width * d.rect1Height}.<br>
             Bottom rectangle: A₂ = ${d.rect2Width} × ${d.rect2Height} = ${d.rect2Width * d.rect2Height}.<br>
             Total Area: A = A₁ + A₂ = ${answer} ${unit}.`
          : `Formula: P = total length of all sides (including shared sides).<br>
             What it means: Add the lengths of all sides.<br>
             Example: Total Perimeter = ${answer} ${unit}.`;
        break;
      }
    }

    this.solution = solutionText;
  }

  onEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.checkAnswer();
    }
  }

  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
