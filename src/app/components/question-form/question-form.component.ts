import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, effect, input, output, signal, untracked } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { outputFromObservable, outputToObservable } from '@angular/core/rxjs-interop';

import { MathQuestion } from 'src/app/models/math-question.model';
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
  @Output() answeredCorrectly = new EventEmitter<StudentAnswer>();
  studentAnnser = output<StudentAnswer>();
  question = input.required<MathQuestion>();
  hint = signal<string>('');
  correct = signal<boolean>(false);
  incorrect = signal<boolean>(false);

  constructor(private fb: FormBuilder) {
    effect(() => {
      console.log(`The answer is: ${this.question().answer}`);
      untracked(() => {
        this.correct.set(false);
        this.questionForm.reset();
      })
    });
  }

  questionForm = this.fb.group({
    answer: ['', Validators.required],
    help: [''],
  });

  checkAnswer(studentAnswer: string | number | null | undefined, correctAnswer: string | number | null | undefined) {
    this.correct.set(false);
    this.incorrect.set(false);
    this.hint.set('');
    // Normalize the answers if they are strings
    let normalizedStudentAnswer = studentAnswer;
    if (typeof studentAnswer === 'string') {
      normalizedStudentAnswer = Number(studentAnswer.trim().toLowerCase());
    }
    let normalizedCorrectAnswer = correctAnswer;
    if (typeof correctAnswer === 'string') {
      normalizedCorrectAnswer = Number(correctAnswer.trim().toLowerCase());
    }

    if (normalizedStudentAnswer === normalizedCorrectAnswer) {
      this.correct.set(true);
      setTimeout(() => {
        this.answeredCorrectly.emit({ answer: 'unknown', isCorrect: true });
      }, 2000); // delay for 2 seconds
    } else {
      this.hint.set(this.question().hint[0]);
      this.incorrect.set(true);
      this.answeredCorrectly.emit({ answer: 'unknown', isCorrect: false });
    }
  }
}
