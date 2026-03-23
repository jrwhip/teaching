import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MathResultsService } from '../shared/math-results.service';
import { QUIZ2_INDEX_TYPES, getTaxonomy } from '../shared/problem-taxonomy';

interface Quiz2Problem {
  question: SafeHtml;
  questionText: string;
  answer: string;
  validate: (input: string, extra?: string) => boolean;
  streakTarget: number;
}

interface ProblemState {
  problem: Quiz2Problem;
  streak: boolean[];
  completed: boolean;
  userInput: string;
  extraInput: string;
}

@Component({
    templateUrl: './quiz2.component.html',
    styleUrl: './quiz2.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Quiz2Component {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly results = inject(MathResultsService);

  readonly problemCount = 20;
  readonly problems = signal<ProblemState[]>([]);
  readonly zoomIndex = signal<number | null>(null);
  readonly zoomInput = signal('');

  readonly topEmojis = computed(() => {
    const streakCounts = this.problems().map((p, i) => ({
      index: i,
      count: p.streak.filter(Boolean).length,
      total: p.streak.length,
    }));
    return streakCounts
      .filter(s => s.count > 0)
      .sort((a, b) => (b.count / b.total) - (a.count / a.total))
      .slice(0, 3)
      .map(s => ({ index: s.index + 1, emoji: s.count === s.total ? '🏆' : '⭐' }));
  });

  readonly correctCount = computed(() =>
    this.problems().reduce((sum, p) => sum + p.streak.filter(Boolean).length, 0)
  );

  readonly incorrectCount = signal(0);

  constructor() {
    this.generateAllProblems();
  }

  generateAllProblems(): void {
    this.results.startNewSession();

    const generators: Array<() => Quiz2Problem> = [
      () => this.genBasicFact(),
      () => this.genUnknown(),
      () => this.genDistributive(),
      () => this.genSingleDigitDiv(),
      () => this.genDoubleDigitDiv(),
      () => this.genPercentConvert(),
      () => this.genFractionConvert(),
      () => this.genNumberConvert(),
      () => this.genPercentCalc(),
      () => this.genDecimalCompare(),
      () => this.genFractionCompare(),
      () => this.genFractionToDecimal(),
      () => this.genDecimalToFraction(),
      () => this.genLShapeArea(),
      () => this.genSquareArea(),
      () => this.genTwoRectangles(),
      () => this.genTriangleArea(),
      () => this.genParallelogramArea(),
      () => this.genTrapezoidArea(),
      () => this.genBasicFact(),
    ];

    const problems: ProblemState[] = generators.map((gen, i) => {
      const problem = gen();
      const streakSize = (i === 3 || i === 4) ? 6 : 3;
      return {
        problem,
        streak: new Array(streakSize).fill(false),
        completed: false,
        userInput: '',
        extraInput: '',
      };
    });

    this.problems.set(problems);
    this.incorrectCount.set(0);
  }

  checkAnswer(index: number): void {
    const items = this.problems();
    const item = items[index];
    if (item.completed) return;

    const input = this.zoomIndex() === index ? this.zoomInput() : item.userInput;
    const isCorrect = item.problem.validate(input.trim(), item.extraInput.trim());

    const taxonomy = getTaxonomy(QUIZ2_INDEX_TYPES[index]);
    this.results.recordAttempt({
      problemType: taxonomy.problemType,
      problemCategory: taxonomy.category,
      question: item.problem.questionText,
      correctAnswer: item.problem.answer,
      studentAnswer: input.trim(),
      isCorrect,
    });

    const updated = [...items];
    if (isCorrect) {
      const nextStreak = [...item.streak];
      const emptyIdx = nextStreak.indexOf(false);
      if (emptyIdx !== -1) nextStreak[emptyIdx] = true;

      const completed = nextStreak.every(Boolean);
      updated[index] = {
        problem: completed ? item.problem : this.regenerateProblemAt(index),
        streak: nextStreak,
        completed,
        userInput: '',
        extraInput: '',
      };
    } else {
      this.incorrectCount.update(c => c + 1);
      updated[index] = { ...item, userInput: '', extraInput: '' };
    }

    this.problems.set(updated);
    if (this.zoomIndex() === index) {
      this.zoomInput.set('');
      if (updated[index].completed) this.zoomIndex.set(null);
    }
  }

  openZoom(index: number): void {
    this.zoomIndex.set(index);
    this.zoomInput.set('');
  }

  closeZoom(): void {
    this.zoomIndex.set(null);
  }

  updateUserInput(index: number, value: string): void {
    this.problems.update(p => {
      const updated = [...p];
      updated[index] = { ...updated[index], userInput: value };
      return updated;
    });
  }

  onKeypress(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter') this.checkAnswer(index);
  }

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  private regenerateProblemAt(index: number): Quiz2Problem {
    const generators: Array<() => Quiz2Problem> = [
      () => this.genBasicFact(),
      () => this.genUnknown(),
      () => this.genDistributive(),
      () => this.genSingleDigitDiv(),
      () => this.genDoubleDigitDiv(),
      () => this.genPercentConvert(),
      () => this.genFractionConvert(),
      () => this.genNumberConvert(),
      () => this.genPercentCalc(),
      () => this.genDecimalCompare(),
      () => this.genFractionCompare(),
      () => this.genFractionToDecimal(),
      () => this.genDecimalToFraction(),
      () => this.genLShapeArea(),
      () => this.genSquareArea(),
      () => this.genTwoRectangles(),
      () => this.genTriangleArea(),
      () => this.genParallelogramArea(),
      () => this.genTrapezoidArea(),
      () => this.genBasicFact(),
    ];
    return generators[index]();
  }

  private safe(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private gcd(a: number, b: number): number {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
  }

  private fracHtml(num: number, den: number): string {
    return `<span class="frac"><sup>${num}</sup><span>/</span><sub>${den}</sub></span>`;
  }

  // --- Problem Generators ---

  private genBasicFact(): Quiz2Problem {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    const op = Math.random() < 0.5 ? 'multiply' : 'divide';

    if (op === 'multiply') {
      const product = a * b;
      return {
        question: this.safe(`${a} &times; ${b} = ?`),
        questionText: `${a} × ${b} = ?`,
        answer: String(product),
        validate: (input) => parseInt(input) === product,
        streakTarget: 3,
      };
    } else {
      const product = a * b;
      return {
        question: this.safe(`${product} &divide; ${a} = ?`),
        questionText: `${product} ÷ ${a} = ?`,
        answer: String(b),
        validate: (input) => parseInt(input) === b,
        streakTarget: 3,
      };
    }
  }

  private genUnknown(): Quiz2Problem {
    const a = Math.floor(Math.random() * 12) + 2;
    const b = Math.floor(Math.random() * 12) + 2;
    const product = a * b;
    return {
      question: this.safe(`${a} &times; ? = ${product}`),
      questionText: `${a} × ? = ${product}`,
      answer: String(b),
      validate: (input) => parseInt(input) === b,
      streakTarget: 3,
    };
  }

  private genDistributive(): Quiz2Problem {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 10) + 1;
    const c = Math.floor(Math.random() * 10) + 1;
    const result = a * (b + c);
    return {
      question: this.safe(`${a}(${b} + ${c}) = ?`),
      questionText: `${a}(${b} + ${c}) = ?`,
      answer: String(result),
      validate: (input) => parseInt(input) === result,
      streakTarget: 3,
    };
  }

  private genSingleDigitDiv(): Quiz2Problem {
    const divisor = Math.floor(Math.random() * 8) + 2;
    const quotientBase = Math.floor(Math.random() * 90) + 10;
    const remainder = Math.floor(Math.random() * divisor);
    const dividend = quotientBase * divisor + remainder;
    const answer = parseFloat((dividend / divisor).toFixed(1));
    return {
      question: this.safe(`${dividend} &divide; ${divisor} = ? (round to tenth)`),
      questionText: `${dividend} ÷ ${divisor} = ? (round to tenth)`,
      answer: String(answer),
      validate: (input) => Math.abs(parseFloat(input) - answer) < 0.05,
      streakTarget: 6,
    };
  }

  private genDoubleDigitDiv(): Quiz2Problem {
    const divisor = Math.floor(Math.random() * 40) + 11;
    const quotientBase = Math.floor(Math.random() * 90) + 10;
    const dividend = quotientBase * divisor + Math.floor(Math.random() * divisor);
    const answer = parseFloat((dividend / divisor).toFixed(2));
    return {
      question: this.safe(`${dividend} &divide; ${divisor} = ? (round to hundredth)`),
      questionText: `${dividend} ÷ ${divisor} = ? (round to hundredth)`,
      answer: String(answer),
      validate: (input) => Math.abs(parseFloat(input) - answer) < 0.005,
      streakTarget: 6,
    };
  }

  private genPercentConvert(): Quiz2Problem {
    const percent = Math.floor(Math.random() * 99) + 1;
    const decimal = percent / 100;
    return {
      question: this.safe(`Convert ${percent}% to a decimal`),
      questionText: `Convert ${percent}% to a decimal`,
      answer: String(decimal),
      validate: (input) => Math.abs(parseFloat(input) - decimal) < 0.001,
      streakTarget: 3,
    };
  }

  private genFractionConvert(): Quiz2Problem {
    const den = [2, 4, 5, 8, 10, 20][Math.floor(Math.random() * 6)];
    const num = Math.floor(Math.random() * (den - 1)) + 1;
    const decimal = parseFloat((num / den).toFixed(4));
    return {
      question: this.safe(`Convert ${this.fracHtml(num, den)} to a decimal`),
      questionText: `Convert ${num}/${den} to a decimal`,
      answer: String(decimal),
      validate: (input) => Math.abs(parseFloat(input) - decimal) < 0.001,
      streakTarget: 3,
    };
  }

  private genNumberConvert(): Quiz2Problem {
    const decimal = parseFloat((Math.random() * 0.98 + 0.01).toFixed(2));
    const percent = Math.round(decimal * 100);
    return {
      question: this.safe(`Convert ${decimal} to a percent`),
      questionText: `Convert ${decimal} to a percent`,
      answer: `${percent}%`,
      validate: (input) => parseInt(input.replace('%', '')) === percent,
      streakTarget: 3,
    };
  }

  private genPercentCalc(): Quiz2Problem {
    const percent = [10, 15, 20, 25, 30, 40, 50, 75][Math.floor(Math.random() * 8)];
    const number = Math.floor(Math.random() * 200) + 20;
    const answer = (percent / 100) * number;
    return {
      question: this.safe(`What is ${percent}% of ${number}?`),
      questionText: `What is ${percent}% of ${number}?`,
      answer: String(answer),
      validate: (input) => Math.abs(parseFloat(input) - answer) < 0.01,
      streakTarget: 3,
    };
  }

  private genDecimalCompare(): Quiz2Problem {
    const a = parseFloat((Math.random() * 10).toFixed(2));
    let b: number;
    do { b = parseFloat((Math.random() * 10).toFixed(2)); } while (b === a);
    const symbol = a < b ? '<' : a > b ? '>' : '=';
    return {
      question: this.safe(`Compare: ${a} ___ ${b}`),
      questionText: `Compare: ${a} ___ ${b}`,
      answer: symbol,
      validate: (input) => input.trim() === symbol,
      streakTarget: 3,
    };
  }

  private genFractionCompare(): Quiz2Problem {
    const d1 = Math.floor(Math.random() * 10) + 2;
    const n1 = Math.floor(Math.random() * d1) + 1;
    const d2 = Math.floor(Math.random() * 10) + 2;
    const n2 = Math.floor(Math.random() * d2) + 1;
    const v1 = n1 / d1;
    const v2 = n2 / d2;
    const symbol = v1 < v2 ? '<' : v1 > v2 ? '>' : '=';
    return {
      question: this.safe(`Compare: ${this.fracHtml(n1, d1)} ___ ${this.fracHtml(n2, d2)}`),
      questionText: `Compare: ${n1}/${d1} ___ ${n2}/${d2}`,
      answer: symbol,
      validate: (input) => input.trim() === symbol,
      streakTarget: 3,
    };
  }

  private genFractionToDecimal(): Quiz2Problem {
    const den = [2, 4, 5, 8, 10, 20, 25][Math.floor(Math.random() * 7)];
    const num = Math.floor(Math.random() * (den - 1)) + 1;
    const decimal = parseFloat((num / den).toFixed(4));
    return {
      question: this.safe(`${this.fracHtml(num, den)} = ? (decimal)`),
      questionText: `${num}/${den} = ? (decimal)`,
      answer: String(decimal),
      validate: (input) => Math.abs(parseFloat(input) - decimal) < 0.001,
      streakTarget: 3,
    };
  }

  private genDecimalToFraction(): Quiz2Problem {
    const den = [2, 4, 5, 8, 10, 20][Math.floor(Math.random() * 6)];
    const num = Math.floor(Math.random() * (den - 1)) + 1;
    const decimal = num / den;
    const g = this.gcd(num, den);
    const rn = num / g;
    const rd = den / g;
    return {
      question: this.safe(`Convert ${decimal} to a fraction (simplified)`),
      questionText: `Convert ${decimal} to a fraction (simplified)`,
      answer: `${rn}/${rd}`,
      validate: (input) => {
        const parts = input.split('/');
        if (parts.length !== 2) return false;
        const un = parseInt(parts[0]);
        const ud = parseInt(parts[1]);
        const ug = this.gcd(un, ud);
        return un / ug === rn && ud / ug === rd;
      },
      streakTarget: 3,
    };
  }

  private genLShapeArea(): Quiz2Problem {
    const w1 = Math.floor(Math.random() * 8) + 3;
    const h1 = Math.floor(Math.random() * 6) + 3;
    let w2: number;
    do { w2 = Math.floor(Math.random() * 8) + 3; } while (w2 === w1);
    const h2 = Math.floor(Math.random() * 6) + 3;
    const area = w1 * h1 + w2 * h2;
    return {
      question: this.safe(`L-Shape: Top ${w1}\u00D7${h1}, Bottom ${w2}\u00D7${h2}. Area?`),
      questionText: `L-Shape: Top ${w1}×${h1}, Bottom ${w2}×${h2}. Area?`,
      answer: String(area),
      validate: (input) => parseInt(input) === area,
      streakTarget: 3,
    };
  }

  private genSquareArea(): Quiz2Problem {
    const side = Math.floor(Math.random() * 15) + 3;
    const isArea = Math.random() < 0.5;
    const answer = isArea ? side * side : 4 * side;
    const label = isArea ? 'Area' : 'Perimeter';
    return {
      question: this.safe(`Square side=${side}. ${label}?`),
      questionText: `Square side=${side}. ${label}?`,
      answer: String(answer),
      validate: (input) => parseInt(input) === answer,
      streakTarget: 3,
    };
  }

  private genTwoRectangles(): Quiz2Problem {
    const w1 = Math.floor(Math.random() * 10) + 3;
    const w2 = Math.floor(Math.random() * 10) + 3;
    const h = Math.floor(Math.random() * 8) + 3;
    const area = (w1 + w2) * h;
    return {
      question: this.safe(`Two rectangles side by side: ${w1}\u00D7${h} and ${w2}\u00D7${h}. Total area?`),
      questionText: `Two rectangles: ${w1}×${h} and ${w2}×${h}. Total area?`,
      answer: String(area),
      validate: (input) => parseInt(input) === area,
      streakTarget: 3,
    };
  }

  private genTriangleArea(): Quiz2Problem {
    const base = Math.floor(Math.random() * 15) + 3;
    const height = Math.floor(Math.random() * 15) + 3;
    const area = 0.5 * base * height;
    return {
      question: this.safe(`Triangle: base=${base}, height=${height}. Area?`),
      questionText: `Triangle: base=${base}, height=${height}. Area?`,
      answer: String(area),
      validate: (input) => Math.abs(parseFloat(input) - area) < 0.01,
      streakTarget: 3,
    };
  }

  private genParallelogramArea(): Quiz2Problem {
    const base = Math.floor(Math.random() * 15) + 3;
    const height = Math.floor(Math.random() * 15) + 3;
    const area = base * height;
    return {
      question: this.safe(`Parallelogram: base=${base}, height=${height}. Area?`),
      questionText: `Parallelogram: base=${base}, height=${height}. Area?`,
      answer: String(area),
      validate: (input) => parseInt(input) === area,
      streakTarget: 3,
    };
  }

  private genTrapezoidArea(): Quiz2Problem {
    const b1 = Math.floor(Math.random() * 12) + 3;
    const b2 = Math.floor(Math.random() * 12) + 3;
    const height = Math.floor(Math.random() * 10) + 3;
    const area = ((b1 + b2) * height) / 2;
    return {
      question: this.safe(`Trapezoid: b1=${b1}, b2=${b2}, h=${height}. Area?`),
      questionText: `Trapezoid: b1=${b1}, b2=${b2}, h=${height}. Area?`,
      answer: String(area),
      validate: (input) => Math.abs(parseFloat(input) - area) < 0.01,
      streakTarget: 3,
    };
  }
}
