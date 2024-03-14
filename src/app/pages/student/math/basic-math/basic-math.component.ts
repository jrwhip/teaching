/* eslint-disable no-plusplus */
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { MathQuestionGenerationService } from 'src/app/services/math-question-generation.service';

import { MathQuestion } from 'src/app/models/math-question.model';

import { QuestionFormComponent } from 'src/app/components/question-form/question-form.component';

import { CounterComponent } from 'src/app/components/counter/counter.component';

import { CounterValues } from 'src/app/models/counter-values.model';

import { StateService } from 'src/app/services/state.service';
import { map, of, switchMap, tap } from 'rxjs';

import { StoredMathQuestions } from 'src/app/models/stored-math-questions.model';

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
    private mathQuestionGenerationService: MathQuestionGenerationService,
    private sanitizer: DomSanitizer,
    private stateService: StateService
  ) {
    const foo$ = this.stateService
      .selectKey('storedMathQuestions')
      .pipe(
        takeUntilDestroyed(),
        switchMap((res) => {
          const storedMathQuestions = res as StoredMathQuestions;

          return this.route.paramMap.pipe(
            map((params) => {
              const currentOperation = params.get('operation') ?? '';
              console.log('Current operation:', currentOperation);
              if (storedMathQuestions) {
                if (storedMathQuestions[currentOperation]) {
                  return storedMathQuestions[currentOperation];
                  // You were missing the closing bracket for this if statement
                } 
                  const mathQuestion = this.generateQuestion(currentOperation);

                  this.stateService.patchState({
                    storedMathQuestions: {
                      [currentOperation]: {
                        ...mathQuestion,
                      },
                    },
                  });
                  console.log('No stored math questions');
                
              }
              return this.generateQuestion(currentOperation);
            })
          )
        })
      );

    this.questionSignal = toSignal(foo$);
    
    this.operation = 'addition';

    const mathQuestion = this.generateQuestion('addition');

    this.counterValues = {
      label: this.operation,
      correct: 0,
      incorrect: 30,
      streak: 1,
      highStreak: 49,
    };

    // this.questionSignal = signal<MathQuestion>(mathQuestion);

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

  onAnsweredCorrectly(answeredCorrectly: boolean) {
    console.log('Answered correctly:', answeredCorrectly);
    if (answeredCorrectly) {
      const newQuestion = this.generateQuestion('addition');
      // this.questionSignal.set(newQuestion);
      
      this.counterValues.correct++;
      this.counterValues.streak++;
      if (this.counterValues.streak > this.counterValues.highStreak) {
        this.counterValues.highStreak = this.counterValues.streak;
      }
    }
  }

  generateQuestion(operation: string): MathQuestion {
    if (operation === 'addition') {
      return this.mathQuestionGenerationService.generateAdditionQuestion();
    }
    if (operation === 'subtraction') {
      return this.mathQuestionGenerationService.generateSubtractionQuestion();
    }
    if (operation === 'multiplication') {
      return this.mathQuestionGenerationService.generateMultiplicationQuestion();
    }
    if (operation === 'division') {
      return this.mathQuestionGenerationService.generateDivisionQuestion();
    }
    return this.mathQuestionGenerationService.generateTranslateQuestion();
  }
}
