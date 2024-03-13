import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, effect, input, signal, untracked } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MathQuestion } from 'src/app/models/math-question.model';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionFormComponent {
  @Output() answeredCorrectly = new EventEmitter<boolean>();
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
      normalizedStudentAnswer = studentAnswer.trim().toLowerCase();
    }
    let normalizedCorrectAnswer = correctAnswer;
    if (typeof correctAnswer === 'string') {
      normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();
    }

    if (normalizedStudentAnswer === normalizedCorrectAnswer) {
      this.correct.set(true);
      setTimeout(() => {
        this.answeredCorrectly.emit(true);
      }, 2000); // delay for 2 seconds
    } else {
      this.hint.set(this.question().hint[0]);
      this.incorrect.set(true);
      this.answeredCorrectly.emit(false);
    }
  }
}
