import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

import { NthPlainTextPipe } from '../../nth-plain-text.pipe';

@Component({
  standalone: true,
  imports: [
    AgGridModule,
    CommonModule,
    NthPlainTextPipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './math.component.html',
  styleUrls: ['./math.component.scss'],
})
export class MathComponent implements OnInit, AfterViewInit {
  roundedNumbers: any[] = [];
  correctStreak: number = 0;
  highestStreak: number = 0;
  roundingFactor: number = 10;
  randomNumber: string = '';
  userAnswer: number | null = null;
  result: string = '';
  resultColor: string = '';

  columnDefs: ColDef[] = [
    {
      field: 'original',
      headerName: 'Original Number',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'roundingFactor',
      headerName: 'Rounding Factor',
      valueFormatter: this.getPlaceText,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'rounded',
      headerName: 'Correct Answer',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'userAnswer',
      headerName: 'User Answer',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'isCorrect',
      headerName: 'Is Correct?',
      cellRenderer: this.correctRenderer,
      filter: 'agBooleanColumnFilter',
    },
    {
      field: 'dateEntered',
      headerName: 'Date Entered',
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => {
        return params.value
          ? new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }).format(new Date(params.value))
          : '';
      },
    },
  ];

  gridApi: any;
  gridColumnApi: any;

  constructor() {}

  ngOnInit(): void {
    this.generateNewNumber();
    const storedHighestStreak = localStorage.getItem('highestStreak');
    if (storedHighestStreak) {
      this.highestStreak = JSON.parse(storedHighestStreak);
    }
  }

  ngAfterViewInit(): void {
    const storedData = localStorage.getItem('roundedNumbers');
    if (storedData) {
      this.roundedNumbers = JSON.parse(storedData);
      this.gridApi.setRowData(this.roundedNumbers);
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  correctRenderer(params: { value: any }) {
    return params.value ? 'Correct' : 'Incorrect';
  }

  generateRandomNumber(): string {
    const min = 10.0;
    const max = 9999.999;
    return this.getRandomFloat(min, max).toFixed(3);
  }

  getRandomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  randomizeRoundingFactor(): void {
    const roundingOptions = [10, 100, 0.1, 0.01];
    const randomIndex = Math.floor(Math.random() * roundingOptions.length);
    this.roundingFactor = roundingOptions[randomIndex];
    this.generateNewNumber();
  }

  checkAnswer(userAnswer: number | null): void {
    const parsedRandomNumber = parseFloat(this.randomNumber);

    if (userAnswer !== null && !isNaN(userAnswer)) {
      let roundedNumber;

      if (this.roundingFactor === 0.1) {
        roundedNumber = Math.round(parsedRandomNumber * 10) / 10;
      } else if (this.roundingFactor === 0.01) {
        roundedNumber = Math.round(parsedRandomNumber * 100) / 100;
      } else {
        roundedNumber =
          Math.round(parsedRandomNumber / this.roundingFactor) *
          this.roundingFactor;
      }

      const isCorrect = Number(userAnswer) === roundedNumber;

      if (isCorrect) {
        this.result = 'Correct!';
        this.resultColor = 'green';
        this.correctStreak++;

        if (this.correctStreak > this.highestStreak) {
          this.highestStreak = this.correctStreak;
          localStorage.setItem(
            'highestStreak',
            JSON.stringify(this.highestStreak)
          );
        }
      } else {
        this.result = 'Incorrect. The correct answer is ' + roundedNumber;
        this.resultColor = 'red';
        this.correctStreak = 0;
      }

      const newEntry = {
        dateEntered: new Date().toISOString(),
        original: parsedRandomNumber,
        rounded: roundedNumber,
        roundingFactor: this.roundingFactor,
        isCorrect,
        userAnswer: Number(userAnswer),
      };

      if (this.gridApi) {
        const newRowData = [newEntry, ...this.roundedNumbers];
        this.gridApi.setRowData(newRowData);
        this.roundedNumbers = newRowData;
        localStorage.setItem('roundedNumbers', JSON.stringify(newRowData));
      }

      this.userAnswer = null;
      this.randomizeRoundingFactor();
    }
  }

  generateNewNumber(): void {
    this.randomNumber = this.generateRandomNumber();
  }

  changeRoundingFactor(factor: number): void {
    this.roundingFactor = factor;
    this.generateNewNumber();
  }

  getPlaceText(params: { value: number }): string {
    const factor = params.value;
    if (factor === 10) {
      return 'tens';
    } else if (factor === 100) {
      return 'hundreds';
    } else if (factor === 0.1) {
      return 'tenths';
    } else if (factor === 0.01) {
      return 'hundredths';
    } else {
      return 'unknown';
    }
  }
}
