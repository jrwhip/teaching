import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Problem, ProblemType, MENU_CATEGORIES, MenuCategory } from './problem.model';
import { GENERATORS } from './generators';
import { MathResultsService } from '../shared/math-results.service';
import { getTaxonomy } from '../shared/problem-taxonomy';

interface AnswerLogEntry {
  question: string;
  userAnswer: string;
  correct: boolean;
}

@Component({
    selector: 'app-quiz',
    imports: [FormsModule],
    templateUrl: './quiz.component.html',
    styleUrl: './quiz.component.scss'
})
export default class QuizComponent {
  private readonly results = inject(MathResultsService);

  readonly categories: MenuCategory[] = MENU_CATEGORIES;
  readonly fontSizes = [
    { label: 'S', cssClass: 'small-font' },
    { label: 'M', cssClass: 'medium-font' },
    { label: 'L', cssClass: 'large-font' },
  ];

  // State
  readonly activeCategory = signal<string>('Basics');
  readonly activeProblemType = signal<ProblemType>('addition');
  readonly currentProblem = signal<Problem | null>(null);
  readonly userInput = signal('');
  readonly extraInput = signal('');
  readonly fontSize = signal('medium-font');
  readonly correctCount = signal(0);
  readonly incorrectCount = signal(0);
  readonly showHint = signal(false);
  readonly answerLog = signal<AnswerLogEntry[]>([]);

  // Computed
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

  readonly activeItems = computed(() => {
    const cat = this.categories.find(c => c.label === this.activeCategory());
    return cat?.items ?? [];
  });

  constructor(private sanitizer: DomSanitizer) {
    this.results.startNewSession();
    this.generateProblem('addition');
  }

  setCategory(label: string): void {
    this.activeCategory.set(label);
  }

  selectProblemType(type: ProblemType): void {
    this.activeProblemType.set(type);
    this.generateProblem(type);
  }

  generateProblem(type?: ProblemType): void {
    const t = type ?? this.activeProblemType();
    this.activeProblemType.set(t);
    const generator = GENERATORS[t];
    if (generator) {
      this.currentProblem.set(generator.generate());
      this.userInput.set('');
      this.extraInput.set('');
      this.showHint.set(false);
    }
  }

  setFontSize(cssClass: string): void {
    this.fontSize.set(cssClass);
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
    });

    // Log the answer
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
      this.generateProblem();
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
}
