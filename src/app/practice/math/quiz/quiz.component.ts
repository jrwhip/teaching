import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Problem, ProblemType, MENU_CATEGORIES, MenuCategory } from './problem.model';
import { GENERATORS } from './generators';

interface AnswerLogEntry {
  question: string;
  userAnswer: string;
  correct: boolean;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
})
export default class QuizComponent {
  readonly categories: MenuCategory[] = MENU_CATEGORIES;
  readonly colorOptions = [
    { label: 'Sky Blue', value: '#87ceeb' },
    { label: 'Light Green', value: '#90ee90' },
    { label: 'Lavender', value: '#e6e6fa' },
    { label: 'Peach', value: '#ffdab9' },
    { label: 'Light Pink', value: '#ffb6c1' },
    { label: 'Light Yellow', value: '#ffffe0' },
    { label: 'Thistle', value: '#d8bfd8' },
    { label: 'Powder Blue', value: '#b0e0e6' },
    { label: 'Honeydew', value: '#f0fff0' },
    { label: 'Misty Rose', value: '#ffe4e1' },
    { label: 'Alice Blue', value: '#f0f8ff' },
    { label: 'Lemon Chiffon', value: '#fffacd' },
    { label: 'Cornsilk', value: '#fff8dc' },
    { label: 'Seashell', value: '#fff5ee' },
    { label: 'Mint Cream', value: '#f5fffa' },
    { label: 'Snow', value: '#fffafa' },
  ];
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
  readonly colorTheme = signal('#87ceeb');
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

  setColor(color: string): void {
    this.colorTheme.set(color);
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

    // Log the answer
    const entry: AnswerLogEntry = {
      question: problem.question,
      userAnswer: problem.needsExtraInput
        ? `Input 1= ${this.userInput()}, Input 2= ${this.extraInput()}`
        : this.userInput(),
      correct,
    };
    this.answerLog.update(log => [entry, ...log]);

    // Update localStorage
    this.updateStorage(correct);

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

  private updateStorage(correct: boolean): void {
    try {
      const raw = localStorage.getItem('mathQuizData');
      const data = raw ? JSON.parse(raw) : { correct: 0, incorrect: 0, resetDate: this.getNextSunday() };

      const now = new Date();
      const resetDate = new Date(data.resetDate);
      if (now >= resetDate) {
        data.correct = correct ? 1 : 0;
        data.incorrect = correct ? 0 : 1;
        data.resetDate = this.getNextSunday();
      } else {
        data.correct += correct ? 1 : 0;
        data.incorrect += correct ? 0 : 1;
      }

      localStorage.setItem('mathQuizData', JSON.stringify(data));
    } catch {
      // localStorage unavailable
    }
  }

  private getNextSunday(): string {
    const today = new Date();
    const next = new Date();
    next.setDate(today.getDate() + (7 - today.getDay()));
    return next.toISOString().split('T')[0];
  }
}
