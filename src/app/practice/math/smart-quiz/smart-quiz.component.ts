import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Problem, ProblemType } from '../quiz/problem.model';
import { GENERATORS } from '../quiz/generators';
import { MathResultsService } from '../shared/math-results.service';
import { getTaxonomy } from '../shared/problem-taxonomy';
import { calculateWeights, weightedRandomPick, WeaknessWeight } from '../shared/weakness-analyzer';

interface AnswerLogEntry {
  question: string;
  userAnswer: string;
  correct: boolean;
}

@Component({
  templateUrl: './smart-quiz.component.html',
  styleUrl: './smart-quiz.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SmartQuizComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly results = inject(MathResultsService);

  private readonly generatorTypes = Object.keys(GENERATORS) as ProblemType[];

  readonly currentProblem = signal<Problem | null>(null);
  readonly activeProblemType = signal<ProblemType>('addition');
  readonly userInput = signal('');
  readonly extraInput = signal('');
  readonly showHint = signal(false);
  readonly correctCount = signal(0);
  readonly incorrectCount = signal(0);
  readonly answerLog = signal<AnswerLogEntry[]>([]);

  readonly weights = computed<WeaknessWeight[]>(() => {
    const counters = this.results.performanceCounters();
    return calculateWeights(counters, this.generatorTypes);
  });

  readonly focusLabel = computed(() => {
    const w = this.weights();
    if (w.length === 0) return '';
    const weakest = [...w].sort((a, b) => b.weight - a.weight)[0];
    if (!weakest || weakest.totalAttempts === 0) return 'Exploring new problem types';
    const taxonomy = getTaxonomy(weakest.problemType);
    return `Focusing on: ${taxonomy.displayLabel} — ${weakest.accuracy}% accuracy`;
  });

  readonly topWeaknesses = computed(() => {
    const w = this.weights();
    return [...w]
      .filter(x => x.weight > 1)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5)
      .map(x => ({
        label: getTaxonomy(x.problemType).displayLabel,
        accuracy: x.accuracy,
        attempts: x.totalAttempts,
      }));
  });

  readonly questionHtml = computed<SafeHtml>(() => {
    const p = this.currentProblem();
    if (!p) return '';
    return this.sanitizer.bypassSecurityTrustHtml(p.question);
  });

  readonly hintHtml = computed<SafeHtml>(() => {
    const p = this.currentProblem();
    if (!p) return '';
    return this.sanitizer.bypassSecurityTrustHtml(p.hint);
  });

  readonly currentTypeLabel = computed(() =>
    getTaxonomy(this.activeProblemType()).displayLabel,
  );

  constructor() {
    this.results.startNewSession();
    this.pickNextProblem();
  }

  pickNextProblem(): void {
    const w = this.weights();
    const type = (w.length > 0 ? weightedRandomPick(w) : 'addition') as ProblemType;
    this.activeProblemType.set(type);

    const generator = GENERATORS[type];
    if (generator) {
      this.currentProblem.set(generator.generate());
      this.userInput.set('');
      this.extraInput.set('');
      this.showHint.set(false);
    }
  }

  insertSymbol(symbol: string): void {
    this.userInput.set(symbol);
    this.checkAnswer();
  }

  checkAnswer(): void {
    const problem = this.currentProblem();
    if (!problem) return;

    let input: string;
    if (problem.needsExtraInput) {
      input = `${this.userInput().trim()},${this.extraInput().trim()}`;
    } else {
      input = this.userInput().trim();
    }

    const correct = problem.validate(input);

    if (correct) {
      this.correctCount.update(c => c + 1);
    } else {
      this.incorrectCount.update(c => c + 1);
    }

    const taxonomy = getTaxonomy(this.activeProblemType());
    this.results.recordAttempt({
      problemType: taxonomy.problemType,
      problemCategory: taxonomy.category,
      question: problem.question,
      correctAnswer: problem.answer ?? '',
      studentAnswer: problem.needsExtraInput
        ? `${this.userInput()}, ${this.extraInput()}`
        : this.userInput(),
      isCorrect: correct,
      hint: problem.hint,
      difficulty: problem.difficulty ?? taxonomy.difficulty,
      gradeLevel: problem.gradeLevel ?? taxonomy.gradeLevel,
    });

    const entry: AnswerLogEntry = {
      question: problem.question,
      userAnswer: problem.needsExtraInput
        ? `Input 1= ${this.userInput()}, Input 2= ${this.extraInput()}`
        : this.userInput(),
      correct,
    };
    this.answerLog.update(log => [entry, ...log]);

    if (correct) {
      this.showHint.set(false);
      this.pickNextProblem();
    } else {
      this.showHint.set(true);
    }
  }

  onKeypress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.checkAnswer();
    }
  }

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
