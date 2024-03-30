/* eslint-disable arrow-body-style */
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Component, inject } from '@angular/core';


import { combineLatest, of, switchMap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { FooService } from 'src/app/services/foo.service';
import { StateService } from 'src/app/services/state.service';
import { StudentAnswer } from 'src/app/models/student-answer.model';

import { CounterComponent } from 'src/app/components/counter/counter.component';
import { QuestionFormComponent } from 'src/app/components/question-form/question-form.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CounterComponent,
    RouterModule,
    QuestionFormComponent,
  ],
  templateUrl: './math.component.html',
})
export class MathComponent {
  route = inject(ActivatedRoute);
  fooService = inject(FooService);
  stateService = inject(StateService);

  operation = '';
  questionSignal: any;

  studentAnswer = 'Hello';

  constructor() {
    const foo$ = combineLatest([
      this.stateService.storedMathQuestions$,
      this.stateService.counterData$,
    ]).pipe(
      takeUntilDestroyed(),
      switchMap(([storedMathQuestions, counterData]) => {
        return this.route.paramMap.pipe(
          switchMap((params) => {
            const currentCategory = params.get('category') ?? '';
            const currentOperation = params.get('operation') ?? '';

            this.operation = currentOperation;
            let question = null;
            let counter = null;

            console.log('storedMathQuestions: ', storedMathQuestions);
            console.log('Operation: ', currentOperation);

            if (storedMathQuestions && storedMathQuestions[currentOperation]) {
              question = of(storedMathQuestions[currentOperation]);
            } else {
              question = this.fooService.setNewMathQuestion(currentOperation);
              console.log('question: ', question);
            }

            console.log('Question: ', question);

            if (counterData && counterData[currentOperation]) {
              counter = of(counterData[currentOperation]);
            } else {
              counter = of({
                label: currentOperation,
                correct: 0,
                incorrect: 0,
                streak: 0,
                highStreak: 0,
              });
            }
            return combineLatest({ question, counter });
          })
        );
      })
    );
    this.questionSignal = toSignal(foo$);
  }

  onStudentAnswer(answer: StudentAnswer): void {
    console.log('MathComponent: ', answer);
  }
} 
