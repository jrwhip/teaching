import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-addition',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="problem-container">
      <h2>Addition Practice</h2>

      <div class="problem-display">
        <div class="problem-text">{{ problem }}</div>
      </div>

      <div class="input-section">
        <input
          type="text"
          [(ngModel)]="userAnswer"
          (keypress)="onEnterKey($event)"
          placeholder="Your answer"
          class="answer-input"
        />
        <button class="submit-btn" (click)="checkAnswer()">Submit</button>
        <button class="new-problem-btn" (click)="generateProblem()">New Problem</button>
      </div>

      @if (feedback) {
        <div class="feedback" [class.correct]="isCorrect" [class.incorrect]="!isCorrect">
          {{ feedback }}
        </div>
      }

      <div class="score">
        <span class="correct-count">Correct: {{ correctCount }}</span>
        <span class="incorrect-count">Incorrect: {{ incorrectCount }}</span>
      </div>
    </div>
  `,
  styles: [`
    .problem-container {
      max-width: 600px;
      margin: 40px auto;
      padding: 30px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    h2 {
      text-align: center;
      color: #004d99;
      margin-bottom: 30px;
    }

    .problem-display {
      text-align: center;
      margin: 40px 0;
    }

    .problem-text {
      font-size: 42px;
      font-weight: bold;
      color: #333;
      min-height: 60px;
    }

    .input-section {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin: 30px 0;
    }

    .answer-input {
      padding: 12px 20px;
      font-size: 18px;
      border: 2px solid #ccc;
      border-radius: 6px;
      width: 200px;
      text-align: center;

      &:focus {
        outline: none;
        border-color: #007BFF;
      }
    }

    .submit-btn,
    .new-problem-btn {
      padding: 12px 24px;
      font-size: 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .submit-btn {
      background-color: #28a745;
      color: white;

      &:hover {
        background-color: #218838;
      }
    }

    .new-problem-btn {
      background-color: #007BFF;
      color: white;

      &:hover {
        background-color: #0056b3;
      }
    }

    .feedback {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin: 20px 0;
      min-height: 30px;

      &.correct {
        color: #009900;
      }

      &.incorrect {
        color: #ff0000;
      }
    }

    .score {
      display: flex;
      justify-content: space-around;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      font-size: 18px;

      .correct-count {
        color: #009900;
        font-weight: bold;
      }

      .incorrect-count {
        color: #ff0000;
        font-weight: bold;
      }
    }
  `]
})
export class AdditionComponent implements OnInit {
  problem: string = '';
  correctAnswer: number = 0;
  userAnswer: string = '';
  feedback: string = '';
  isCorrect: boolean = false;
  correctCount: number = 0;
  incorrectCount: number = 0;

  ngOnInit(): void {
    this.generateProblem();
  }

  generateProblem(): void {
    // Generate two random numbers
    const num1 = Math.floor(Math.random() * 100) + 1;
    const num2 = Math.floor(Math.random() * 100) + 1;

    this.correctAnswer = num1 + num2;
    this.problem = `${num1} + ${num2} = ?`;
    this.userAnswer = '';
    this.feedback = '';
  }

  checkAnswer(): void {
    const answer = parseInt(this.userAnswer.trim());

    if (isNaN(answer)) {
      this.feedback = 'Please enter a valid number';
      this.isCorrect = false;
      return;
    }

    if (answer === this.correctAnswer) {
      this.feedback = 'Correct!';
      this.isCorrect = true;
      this.correctCount++;

      // Auto-generate new problem after 1 second
      setTimeout(() => {
        this.generateProblem();
      }, 1000);
    } else {
      this.feedback = `Incorrect. The answer is ${this.correctAnswer}`;
      this.isCorrect = false;
      this.incorrectCount++;
    }
  }

  onEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.checkAnswer();
    }
  }
}
