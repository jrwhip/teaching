import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

import { CounterComponent } from 'src/app/components/counter/counter.component';
import { QuestionFormComponent } from 'src/app/components/question-form/question-form.component';

import { FooService } from 'src/app/services/foo.service';
import { take } from 'rxjs';

import { StudentAnswer } from 'src/app/models/student-answer.model';

@Component({
  standalone: true,
  imports: [
    AgGridModule,
    CommonModule,
    CounterComponent,
    FormsModule,
    QuestionFormComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './math.component.html',
  styleUrls: ['./math.component.scss'],
})
export class MathComponent implements OnInit {
  fooService = inject(FooService);

  roundedNumbers: any[] = [];
  correctStreak = 0;
  highestStreak = 0;
  roundingFactor = 10;
  randomNumber = '';
  userAnswer: number | null = null;
  result = '';
  resultColor = '';

  questionSignal: any;

  operation = '';

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
      valueFormatter: (params) =>
        params.value
          ? new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }).format(new Date(params.value))
          : '',
    },
  ];

  gridApi: any;
  gridColumnApi: any;

  constructor() {
    console.log('MathComponent created');
  }

  ngOnInit(): void {
    this.generateNewNumber();
    const storedHighestStreak = localStorage.getItem('highestStreak');
    if (storedHighestStreak) {
      this.highestStreak = JSON.parse(storedHighestStreak);
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // Load stored data once the grid is ready
    const storedData = localStorage.getItem('roundedNumbers');
    if (storedData) {
      this.roundedNumbers = JSON.parse(storedData);
      this.gridApi.setRowData(this.roundedNumbers);
    }
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

    if (userAnswer !== null && !Number.isNaN(userAnswer)) {
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
        this.correctStreak += 1;

        if (this.correctStreak > this.highestStreak) {
          this.highestStreak = this.correctStreak;
          localStorage.setItem(
            'highestStreak',
            JSON.stringify(this.highestStreak)
          );
        }
      } else {
        this.result = `Incorrect. The correct answer is ${roundedNumber}`;
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


  onStudentAnswer({ answer, isCorrect: answeredCorrectly }: StudentAnswer) {
    const currentOperation = this.operation; // Assuming this.operation is available and set
    this.fooService
      .setNewCounterValues(currentOperation, answeredCorrectly)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          console.log('Counter values updated:', res);
        },
        error: (error) => {
          console.error('Error updating question:', error);
        },
      });
    // Retrieve the current operation to generate the appropriate question

    // Call setNewMathQuestion to update the state with a new question
    // Assuming setNewMathQuestion returns an observable
    if (answeredCorrectly) {
      this.fooService
        .setNewMathQuestion(currentOperation)
        .pipe(
          take(1) // Ensures subscription completes after receiving the first value
        )
        .subscribe({
          next: (newQuestion) => {
            // If you need to perform any action with the newQuestion, do it here
            // Though, based on your setup, it seems the state update is handled within FooService,
            // and the UI should reactively update based on state changes
          },
          error: (error) => {
            console.error('Error updating question:', error);
          },
        });
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
    }
    if (factor === 100) {
      return 'hundreds';
    }
    if (factor === 0.1) {
      return 'tenths';
    }
    if (factor === 0.01) {
      return 'hundredths';
    }
    return 'unknown';
  }
}
