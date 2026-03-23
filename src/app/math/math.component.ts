import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { NthPlainTextPipe } from '../nth-plain-text.pipe';
import { StreakDisplayComponent } from '../shared/components/streak-display.component';

interface RoundedNumberEntry {
  dateEntered: string;
  original: number;
  rounded: number;
  roundingFactor: number;
  isCorrect: boolean;
  userAnswer: number;
}

@Component({
    imports: [AgGridModule, CommonModule, NthPlainTextPipe, FormsModule, StreakDisplayComponent],
    templateUrl: './math.component.html'
})
export class MathComponent implements OnInit {
  roundedNumbers: RoundedNumberEntry[] = [];
  correctStreak = 0;
  highestStreak = 0;
  roundingFactor = 10;
  randomNumber = '';
  userAnswer: number | null = null;
  result = '';
  resultColor = '';

  columnDefs: ColDef[] = [
    { field: 'original', headerName: 'Original Number', filter: 'agNumberColumnFilter' },
    { field: 'roundingFactor', headerName: 'Rounding Factor', valueFormatter: this.getPlaceText, filter: 'agTextColumnFilter' },
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
      valueFormatter: (params) => {
        return params.value
          ? new Intl.DateTimeFormat('en-US', {
              year: 'numeric', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit',
            }).format(new Date(params.value))
          : '';
      },
    },
  ];

  ngOnInit(): void {
    this.generateNewNumber();
    const storedHighestStreak = localStorage.getItem('highestStreak');
    if (storedHighestStreak) {
      this.highestStreak = JSON.parse(storedHighestStreak);
    }
    const storedData = localStorage.getItem('roundedNumbers');
    if (storedData) {
      this.roundedNumbers = JSON.parse(storedData);
    }
  }

  checkAnswer(userAnswer: number | null): void {
    const parsedRandomNumber = parseFloat(this.randomNumber);

    if (userAnswer !== null && !isNaN(userAnswer)) {
      let roundedNumber: number;

      if (this.roundingFactor === 0.1) {
        roundedNumber = Math.round(parsedRandomNumber * 10) / 10;
      } else if (this.roundingFactor === 0.01) {
        roundedNumber = Math.round(parsedRandomNumber * 100) / 100;
      } else {
        roundedNumber = Math.round(parsedRandomNumber / this.roundingFactor) * this.roundingFactor;
      }

      const isCorrect = Number(userAnswer) === roundedNumber;

      if (isCorrect) {
        this.result = 'Correct!';
        this.resultColor = 'var(--color-success)';
        this.correctStreak++;

        if (this.correctStreak > this.highestStreak) {
          this.highestStreak = this.correctStreak;
          localStorage.setItem('highestStreak', JSON.stringify(this.highestStreak));
        }
      } else {
        this.result = 'Incorrect. The correct answer is ' + roundedNumber;
        this.resultColor = 'var(--color-danger)';
        this.correctStreak = 0;
      }

      const newEntry: RoundedNumberEntry = {
        dateEntered: new Date().toISOString(),
        original: parsedRandomNumber,
        rounded: roundedNumber,
        roundingFactor: this.roundingFactor,
        isCorrect,
        userAnswer: Number(userAnswer),
      };

      const newRowData = [newEntry, ...this.roundedNumbers];
      this.roundedNumbers = newRowData;
      localStorage.setItem('roundedNumbers', JSON.stringify(newRowData));

      this.userAnswer = null;
      this.randomizeRoundingFactor();
    }
  }

  private generateNewNumber(): void {
    const min = 10.0;
    const max = 9999.999;
    this.randomNumber = (Math.random() * (max - min) + min).toFixed(3);
  }

  private randomizeRoundingFactor(): void {
    const roundingOptions = [10, 100, 0.1, 0.01];
    this.roundingFactor = roundingOptions[Math.floor(Math.random() * roundingOptions.length)];
    this.generateNewNumber();
  }

  private getPlaceText(params: { value: number }): string {
    switch (params.value) {
      case 10: return 'tens';
      case 100: return 'hundreds';
      case 0.1: return 'tenths';
      case 0.01: return 'hundredths';
      default: return 'unknown';
    }
  }
}
