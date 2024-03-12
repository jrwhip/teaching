import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
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
  question = input.required<MathQuestion>();
  hint = signal<string>('');

  constructor(private fb: FormBuilder) {}

  questionForm = this.fb.group({
    answer: ['', Validators.required],
    help: [''],
  });

  checkAnswer(studentAnswer: string | number | null | undefined, correctAnswer: string | number | null | undefined) {
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
      alert('Correctness!');
    } else {
      this.hint.set(this.question().hint[0]);
      alert('Try again');
    }
  }
}
