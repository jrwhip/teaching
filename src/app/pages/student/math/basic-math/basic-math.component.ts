/* eslint-disable arrow-body-style */
/* eslint-disable no-debugger */
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { combineLatest, map, of, switchMap, take, tap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { CounterComponent } from 'src/app/components/counter/counter.component';
import { QuestionFormComponent } from 'src/app/components/question-form/question-form.component';

import { CounterValues } from 'src/app/models/counter-values.model';

import { FooService } from 'src/app/services/foo.service';
import { StateService } from 'src/app/services/state.service';
import { StudentAnswer } from 'src/app/models/student-answer.model';

@Component({
  selector: 'app-math-basics',
  standalone: true,
  imports: [CommonModule, CounterComponent, QuestionFormComponent],
  templateUrl: './basic-math.component.html',
  styleUrl: './basic-math.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicMathComponent implements OnInit {
  operation = '';
  // questionSignal: ReturnType<typeof signal<MathQuestion>>;
  questionSignal: any;
  counterValues: CounterValues;
  fooService = inject(FooService);
  stateService = inject(StateService);
  route = inject(ActivatedRoute);

  constructor() {
    const foo$ = combineLatest([
      this.stateService.storedMathQuestions$,
      this.stateService.counterData$,
    ]).pipe(
      takeUntilDestroyed(),
      switchMap(([storedMathQuestions, counterData]) => {
        return this.route.paramMap.pipe(
          switchMap((params) => {
            const currentOperation = params.get('operation') ?? '';
            this.operation = currentOperation;
            let question = null;
            let counter = null;

            if (storedMathQuestions && storedMathQuestions[currentOperation]) {
              question = of(storedMathQuestions[currentOperation]);
            } else {
              question = this.fooService.setNewMathQuestion(currentOperation);
              console.log('question: ',question);
            }

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

    this.counterValues = {
      label: this.operation,
      correct: 0,
      incorrect: 30,
      streak: 1,
      highStreak: 49,
    };
  }

  ngOnInit(): void {
    this.stateService.state$.subscribe((state) => {
      console.log('State:', state);
    });
  }

  onStudentAnswer({ answer, isCorrect: answeredCorrectly }: StudentAnswer) {
    if (answeredCorrectly) {
      // Retrieve the current operation to generate the appropriate question
      const currentOperation = this.operation; // Assuming this.operation is available and set

      // Call setNewMathQuestion to update the state with a new question
      // Assuming setNewMathQuestion returns an observable
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
}
