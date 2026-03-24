import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MathResultsService } from '../shared/math-results.service';
import { QUIZ3_INDEX_TYPES, getTaxonomy } from '../shared/problem-taxonomy';

interface Problem {
  question: SafeHtml;
  questionText: string;
  answer: string;
  validate: (input: string) => boolean;
}

@Component({
    templateUrl: './quiz3.component.html',
    styleUrl: './quiz3.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Quiz3Component {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly results = inject(MathResultsService);

  readonly problemCount = 10;
  readonly problems = signal<Array<{ problem: Problem; streak: boolean[]; completed: boolean; userInput: string }>>([]);
  readonly zoomIndex = signal<number | null>(null);
  readonly zoomInput = signal('');

  readonly correctCount = computed(() =>
    this.problems().reduce((sum, p) => sum + p.streak.filter(Boolean).length, 0)
  );

  readonly incorrectCount = signal(0);

  constructor() {
    this.generateAllProblems();
  }

  generateAllProblems(): void {
    this.results.startNewSession();

    const generators = [
      () => this.genSolveProduct(),
      () => this.genSolveDivision(),
      () => this.genSolveAddition(),
      () => this.genSolveSubtraction(),
      () => this.genFractionTimesN(),
      () => this.genFractionEquation(),
      () => this.genNOverDenom(),
      () => this.genDecimalDivision(),
      () => this.genSimplifyExpr(),
      () => this.genDistribute(),
    ];

    const problems = generators.map(gen => ({
      problem: gen(),
      streak: [false, false, false],
      completed: false,
      userInput: '',
    }));

    this.problems.set(problems);
    this.incorrectCount.set(0);
  }

  checkAnswer(index: number): void {
    const items = this.problems();
    const item = items[index];
    if (item.completed) return;

    const input = this.zoomIndex() === index ? this.zoomInput() : item.userInput;
    const isCorrect = item.problem.validate(input.trim());

    const taxonomy = getTaxonomy(QUIZ3_INDEX_TYPES[index]);
    this.results.recordAttempt({
      problemType: taxonomy.problemType,
      problemCategory: taxonomy.category,
      question: item.problem.questionText,
      correctAnswer: item.problem.answer,
      studentAnswer: input.trim(),
      isCorrect,
      difficulty: taxonomy.difficulty,
      gradeLevel: taxonomy.gradeLevel,
    });

    const updated = [...items];
    if (isCorrect) {
      const nextStreak = [...item.streak];
      const emptyIdx = nextStreak.indexOf(false);
      if (emptyIdx !== -1) nextStreak[emptyIdx] = true;

      const completed = nextStreak.every(Boolean);
      const newProblem = completed ? item.problem : this.regenerateProblem(index);

      updated[index] = {
        problem: completed ? item.problem : newProblem,
        streak: nextStreak,
        completed,
        userInput: '',
      };
    } else {
      this.incorrectCount.update(c => c + 1);
      updated[index] = { ...item, userInput: '' };
    }

    this.problems.set(updated);

    if (this.zoomIndex() === index) {
      this.zoomInput.set('');
      if (updated[index].completed) {
        this.zoomIndex.set(null);
      }
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

  onZoomKeypress(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter') {
      this.checkAnswer(index);
    }
  }

  onKeypress(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter') {
      this.checkAnswer(index);
    }
  }

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  // --- Problem Generators ---

  private gcd(a: number, b: number): number {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
  }

  private reduceFraction(num: number, den: number): [number, number] {
    const g = this.gcd(num, den);
    return [num / g, den / g];
  }

  private fracHtml(num: number | string, den: number): string {
    return `<span class="frac"><sup>${num}</sup><span>/</span><sub>${den}</sub></span>`;
  }

  private safe(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private regenerateProblem(index: number): Problem {
    const generators = [
      () => this.genSolveProduct(),
      () => this.genSolveDivision(),
      () => this.genSolveAddition(),
      () => this.genSolveSubtraction(),
      () => this.genFractionTimesN(),
      () => this.genFractionEquation(),
      () => this.genNOverDenom(),
      () => this.genDecimalDivision(),
      () => this.genSimplifyExpr(),
      () => this.genDistribute(),
    ];
    return generators[index]();
  }

  private genSolveProduct(): Problem {
    const a = Math.floor(Math.random() * 11) + 2;
    const n = Math.floor(Math.random() * 11) + 2;
    const product = a * n;
    return {
      question: this.safe(`${product} = ${a} &times; n`),
      questionText: `${product} = ${a} × n`,
      answer: String(n),
      validate: (input) => parseInt(input, 10) === n,
    };
  }

  private genSolveDivision(): Problem {
    const h = Math.floor(Math.random() * 10) + 2;
    const i = Math.floor(Math.random() * 10) + 2;
    const n = h * i;
    return {
      question: this.safe(`n &divide; ${h} = ${i}`),
      questionText: `n ÷ ${h} = ${i}`,
      answer: String(n),
      validate: (input) => parseInt(input, 10) === n,
    };
  }

  private genSolveAddition(): Problem {
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 90) + 20;
    const n = b - a;
    return {
      question: this.safe(`n + ${a} = ${b}`),
      questionText: `n + ${a} = ${b}`,
      answer: String(n),
      validate: (input) => parseInt(input, 10) === n,
    };
  }

  private genSolveSubtraction(): Problem {
    const s = Math.floor(Math.random() * 30) + 5;
    const t = Math.floor(Math.random() * 50) + 10;
    const n = s + t;
    return {
      question: this.safe(`n - ${s} = ${t}`),
      questionText: `n - ${s} = ${t}`,
      answer: String(n),
      validate: (input) => parseInt(input, 10) === n,
    };
  }

  private genFractionTimesN(): Problem {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 8) + 2;
    const c = Math.floor(Math.random() * 20) + 2;
    const n = (c * b) / a;
    const [rn, rd] = this.reduceFraction(c * b, a);

    if (rn % rd === 0) {
      return {
        question: this.safe(`${this.fracHtml(a, b)} &times; n = ${c}`),
        questionText: `(${a}/${b}) × n = ${c}`,
        answer: String(rn / rd),
        validate: (input) => parseFloat(input) === rn / rd,
      };
    }

    return {
      question: this.safe(`${this.fracHtml(a, b)} &times; n = ${c}`),
      questionText: `(${a}/${b}) × n = ${c}`,
      answer: `${rn}/${rd}`,
      validate: (input) => {
        const parts = input.split('/');
        if (parts.length === 2) {
          const [un, ud] = this.reduceFraction(parseInt(parts[0]), parseInt(parts[1]));
          return un === rn && ud === rd;
        }
        return parseFloat(input) === rn / rd;
      },
    };
  }

  private genFractionEquation(): Problem {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 8) + 2;
    const c = Math.floor(Math.random() * 5) + 1;
    const d = Math.floor(Math.random() * 8) + 2;
    // (a/b) * n = (c/d)  =>  n = (c*b) / (d*a)
    const [rn, rd] = this.reduceFraction(c * b, d * a);

    return {
      question: this.safe(`${this.fracHtml(a, b)} &times; n = ${this.fracHtml(c, d)}`),
      questionText: `(${a}/${b}) × n = (${c}/${d})`,
      answer: rd === 1 ? String(rn) : `${rn}/${rd}`,
      validate: (input) => {
        if (rd === 1) return parseInt(input, 10) === rn;
        const parts = input.split('/');
        if (parts.length === 2) {
          const [un, ud] = this.reduceFraction(parseInt(parts[0]), parseInt(parts[1]));
          return un === rn && ud === rd;
        }
        return false;
      },
    };
  }

  private genNOverDenom(): Problem {
    const denominator = Math.floor(Math.random() * 10) + 2;
    const result = Math.floor(Math.random() * 10) + 1;
    const n = denominator * result;
    return {
      question: this.safe(`${this.fracHtml('n', denominator)} = ${result}`),
      questionText: `n/${denominator} = ${result}`,
      answer: String(n),
      validate: (input) => parseInt(input, 10) === n,
    };
  }

  private genDecimalDivision(): Problem {
    const denominator = Math.floor(Math.random() * 10) + 2;
    const result = parseFloat((Math.random() * 9 + 1).toFixed(1));
    const n = parseFloat((denominator * result).toFixed(1));
    return {
      question: this.safe(`${this.fracHtml('n', denominator)} = ${result}`),
      questionText: `n/${denominator} = ${result}`,
      answer: String(n),
      validate: (input) => Math.abs(parseFloat(input) - n) < 0.01,
    };
  }

  private genSimplifyExpr(): Problem {
    const a = Math.floor(Math.random() * 8) + 1;
    const b = Math.floor(Math.random() * 8) + 1;
    const c = Math.floor(Math.random() * 20) + 1;
    const d = Math.floor(Math.random() * 20) + 1;
    const coeffSum = a + b;
    const constSum = c + d;

    return {
      question: this.safe(`Simplify: ${a}x + ${c} + ${b}x + ${d}`),
      questionText: `Simplify: ${a}x + ${c} + ${b}x + ${d}`,
      answer: `${coeffSum}x + ${constSum}`,
      validate: (input) => {
        const cleaned = input.replace(/\s/g, '');
        return cleaned === `${coeffSum}x+${constSum}`;
      },
    };
  }

  private genDistribute(): Problem {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 10) + 1;
    const c = Math.floor(Math.random() * 10) + 1;
    const ab = a * b;
    const ac = a * c;

    return {
      question: this.safe(`Distribute: ${a}(${b}x + ${c})`),
      questionText: `Distribute: ${a}(${b}x + ${c})`,
      answer: `${ab}x + ${ac}`,
      validate: (input) => {
        const cleaned = input.replace(/\s/g, '');
        return cleaned === `${ab}x+${ac}`;
      },
    };
  }
}
