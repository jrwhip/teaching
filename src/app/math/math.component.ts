import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { MathResultsService } from '../practice/math/shared/math-results.service';
import { StreakDisplayComponent } from '../shared/components/streak-display.component';

interface RoundedNumberEntry {
  dateEntered: string;
  original: number;
  rounded: number;
  roundingFactor: number;
  isCorrect: boolean;
  userAnswer: number;
}

const ROUNDING_OPTIONS = [10, 100, 0.1, 0.01] as const;

function placeText(value: number): string {
  switch (value) {
    case 10: return 'tens';
    case 100: return 'hundreds';
    case 0.1: return 'tenths';
    case 0.01: return 'hundredths';
    default: return 'unknown';
  }
}

function generateRandomNumber(): string {
  const min = 10.0;
  const max = 9999.999;
  return (Math.random() * (max - min) + min).toFixed(3);
}

function pickRandomRoundingFactor(): number {
  return ROUNDING_OPTIONS[Math.floor(Math.random() * ROUNDING_OPTIONS.length)];
}

function roundNumber(value: number, factor: number): number {
  if (factor === 0.1) return Math.round(value * 10) / 10;
  if (factor === 0.01) return Math.round(value * 100) / 100;
  return Math.round(value / factor) * factor;
}

@Component({
  imports: [AgGridModule, DecimalPipe, ReactiveFormsModule, StreakDisplayComponent],
  templateUrl: './math.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MathComponent {
  private readonly results = inject(MathResultsService);

  // --- State ---
  readonly roundingFactor = signal(pickRandomRoundingFactor());
  readonly randomNumber = signal(generateRandomNumber());
  readonly answerControl = new FormControl<number | null>(null);
  readonly correctStreak = signal(0);
  readonly highestStreak = signal(0);
  readonly rowData = signal<RoundedNumberEntry[]>([]);

  // Feedback after answer check — null when no feedback shown
  readonly feedback = signal<{ message: string; color: string } | null>(null);

  // --- Computed ---
  readonly roundingPlaceText = computed(() => placeText(this.roundingFactor()));

  // --- ag-Grid ---
  readonly columnDefs: ColDef[] = [
    { field: 'original', headerName: 'Original Number', filter: 'agNumberColumnFilter' },
    { field: 'roundingFactor', headerName: 'Rounding Factor', valueFormatter: (p) => placeText(p.value), filter: 'agTextColumnFilter' },
    { field: 'rounded', headerName: 'Correct Answer', filter: 'agNumberColumnFilter' },
    { field: 'userAnswer', headerName: 'User Answer', filter: 'agNumberColumnFilter' },
    {
      field: 'isCorrect',
      headerName: 'Is Correct?',
      cellRenderer: (params: { value: boolean }) => params.value ? 'Correct' : 'Incorrect',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'dateEntered',
      headerName: 'Date Entered',
      filter: 'agDateColumnFilter',
      valueFormatter: (params) =>
        params.value
          ? new Intl.DateTimeFormat('en-US', {
              year: 'numeric', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit',
            }).format(new Date(params.value))
          : '',
    },
  ];

  constructor() {
    this.results.startNewSession();
    this.loadFromLocalStorage();
  }

  checkAnswer(): void {
    const userAnswer = this.answerControl.value;
    const parsedRandomNumber = parseFloat(this.randomNumber());

    if (userAnswer === null || isNaN(userAnswer)) return;

    const factor = this.roundingFactor();
    const roundedNumber = roundNumber(parsedRandomNumber, factor);
    const isCorrect = Number(userAnswer) === roundedNumber;

    if (isCorrect) {
      this.feedback.set({ message: 'Correct!', color: 'var(--color-success)' });
      this.correctStreak.update(s => s + 1);
      const newStreak = this.correctStreak();
      if (newStreak > this.highestStreak()) {
        this.highestStreak.set(newStreak);
        localStorage.setItem('highestStreak', JSON.stringify(newStreak));
      }
    } else {
      this.feedback.set({
        message: 'Incorrect. The correct answer is ' + roundedNumber,
        color: 'var(--color-danger)',
      });
      this.correctStreak.set(0);
    }

    const newEntry: RoundedNumberEntry = {
      dateEntered: new Date().toISOString(),
      original: parsedRandomNumber,
      rounded: roundedNumber,
      roundingFactor: factor,
      isCorrect,
      userAnswer: Number(userAnswer),
    };

    this.rowData.update(rows => [newEntry, ...rows]);
    localStorage.setItem('roundedNumbers', JSON.stringify(this.rowData()));

    this.results.recordAttempt({
      problemType: 'rounding',
      problemCategory: 'rounding',
      question: `Round ${parsedRandomNumber} to the nearest ${placeText(factor)}`,
      correctAnswer: String(roundedNumber),
      studentAnswer: String(userAnswer),
      isCorrect,
    });

    this.answerControl.reset();
    this.nextProblem();
  }

  private nextProblem(): void {
    this.roundingFactor.set(pickRandomRoundingFactor());
    this.randomNumber.set(generateRandomNumber());
  }

  private loadFromLocalStorage(): void {
    try {
      const storedStreak = localStorage.getItem('highestStreak');
      if (storedStreak) this.highestStreak.set(JSON.parse(storedStreak));

      const storedData = localStorage.getItem('roundedNumbers');
      if (storedData) this.rowData.set(JSON.parse(storedData));
    } catch {
      // Corrupted localStorage — start fresh
    }
  }
}
