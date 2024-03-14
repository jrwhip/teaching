/* eslint-disable arrow-body-style */
/* eslint-disable no-debugger */
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { combineLatest, map, of, switchMap, take, tap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { CounterComponent } from 'src/app/components/counter/counter.component';
import { QuestionFormComponent } from 'src/app/components/question-form/question-form.component';

import { CounterValues } from 'src/app/models/counter-values.model';

import { FooService } from 'src/app/services/foo.service';
import { StateService } from 'src/app/services/state.service';

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
  htmlContent: SafeResourceUrl;
  // questionSignal: ReturnType<typeof signal<MathQuestion>>;
  questionSignal: any;
  counterValues: CounterValues;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private stateService: StateService,
    private fooService: FooService
  ) {
    const foo$ = combineLatest([
      this.stateService.storedMathQuestions$,
      this.stateService.counterValues$,
    ]).pipe(
      takeUntilDestroyed(),
      switchMap(([storedMathQuestions, counterValues]) => {
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
            }

            if (counterValues && counterValues[currentOperation]) {
              counter = of(counterValues[currentOperation]);
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

    const rawHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Division Answer</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  padding: 20px;
              }
              h1 {
                  color: #333;
              }
              table {
                  border-collapse: collapse;
                  width: 100%;
                  margin-bottom: 20px;
              }
              th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: left;
              }
              th {
                  background-color: #f2f2f2;
              }
          </style>
      </head>
      <body>
          <h1>Division Answer</h1>
          <p>Dividing 544 by 17 can indeed seem a bit tricky at first, Jack. But let's break it down step by step:</p>
          <table>
              <tr>
                  <th>Step</th>
                  <th>Calculation</th>
                  <th>Result</th>
              </tr>
              <tr>
                  <td>1</td>
                  <td>54 ÷ 17</td>
                  <td>3 with a remainder of 3</td>
              </tr>
              <tr>
                  <td>2</td>
                  <td>34 ÷ 17</td>
                  <td>2 with no remainder</td>
              </tr>
          </table>
          <p>So, when you divide 544 by 17, you get a quotient of 32 with no remainder.</p>
          <p>If we want to round the answer to the nearest hundredth, since our quotient is a whole number, we add .00 to the end of it, making it 32.00.</p>
          <p>So, <strong>544 ÷ 17 = 32.00.</strong> Keep up the good work, Jack! Let me know if you have any more questions.</p>
      </body>
      </html>
`;
    this.htmlContent = this.sanitizer.bypassSecurityTrustResourceUrl(
      `data:text/html;charset=utf-8, ${encodeURIComponent(rawHtml)}`
    );
  }

  ngOnInit(): void {
    this.stateService.state$.subscribe((state) => {
      console.log('State:', state);
    });
  }

  // onAnsweredCorrectly(answeredCorrectly: boolean) {
  //   if (answeredCorrectly) {
  //     console.log('Correct!');
  //     // this.fooService.setNewMathQuestion('addition', newQuestion).subscribe(val => {
  //     //   console.log('val:', val);
  //     //   debugger;
  //     // });
  //   } else {
  //     console.log('Incorrect');
  //   }
  // }

  onAnsweredCorrectly(answeredCorrectly: boolean) {
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
