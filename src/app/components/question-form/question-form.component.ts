import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ModelSignal,
  effect,
  input,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  outputFromObservable,
  outputToObservable,
} from '@angular/core/rxjs-interop';

import { Problem } from 'src/app/models/problem.model';
import { StudentAnswer } from 'src/app/models/student-answer.model';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionFormComponent {
  // answeredCorrectly = output<StudentAnswer>();
  studentAnswer = output<string>();
  question = input.required<Problem>();
  hint = signal<string>('');
  correct = signal<boolean>(false);
  incorrect = signal<boolean>(false);

  answer: ModelSignal<string> = model.required();

  questionForm = this.fb.group({
    answer: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) {
    effect(() => {
      console.log(`The answer is: ${this.question().answer}`);
      console.log(`The validate function is: ${this.question().validate}`);
      untracked(() => {
        this.correct.set(false);
        // this.questionForm.reset();
      });
    });
  }
  


}
