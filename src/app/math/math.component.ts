import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NthPlainTextPipe } from '../nth-plain-text.pipe';

@Component({
  standalone: true,
  imports: [CommonModule, NthPlainTextPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './math.component.html',
  styleUrls: ['./math.component.scss']
})
export class MathComponent implements OnInit {

  roundedNumbers: any[] = [];
  correctStreak: number = 0;
  roundingFactor: number = 10; // Default rounding factor is tens
  randomNumber: string = '';
  userAnswer: number | null = null;
  result: string = '';
  resultColor: string = '';

  constructor() { }

  ngOnInit(): void {
    this.generateNewNumber();
  }

  generateRandomNumber(): string {
    const min = 10.0; // Minimum number with at least tenths
    const max = 9999.999; // Maximum number with up to thousandths
    return this.getRandomFloat(min, max).toFixed(3); // Generate a number with 3 decimal places
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

    if (userAnswer !== null && !isNaN(userAnswer)) {
      let roundedNumber;

      if (this.roundingFactor === 0.1) {
        // When rounding to tenths, round to one decimal place
        roundedNumber = Math.round(parsedRandomNumber * 10) / 10;
      } else if (this.roundingFactor === 0.01) {
        // When rounding to hundredths, round to two decimal places
        roundedNumber = Math.round(parsedRandomNumber * 100) / 100;
      } else {
        // For other rounding factors, use the previous method
        roundedNumber = Math.round(parsedRandomNumber / this.roundingFactor) * this.roundingFactor;
      }

      const isCorrect = userAnswer === roundedNumber;

      if (isCorrect) {
        this.result = "Correct!";
        this.resultColor = "green";
        this.correctStreak++;
      } else {
        this.result = "Incorrect. The correct answer is " + roundedNumber;
        this.resultColor = "red";
        this.correctStreak = 0; // Reset streak on incorrect answer
      }

      // Add the rounded number, original rounding factor, and whether it was correct or incorrect to the list
      this.roundedNumbers.unshift({ original: parsedRandomNumber, rounded: roundedNumber, roundingFactor: this.roundingFactor, isCorrect, userAnswer: userAnswer });

      // Clear the input box
      this.userAnswer = null;

      // Randomly assign a new rounding factor
      this.randomizeRoundingFactor();
    }
  }

  generateNewNumber(): void {
    this.randomNumber = this.generateRandomNumber();
  }

  changeRoundingFactor(factor: number): void {
    this.roundingFactor = factor;
    this.generateNewNumber();
  }

  getPlaceText(factor: number): string {
    if (factor === 10) {
      return "tens";
    } else if (factor === 100) {
      return "hundreds";
    } else if (factor === 0.1) {
      return "tenths";
    } else if (factor === 0.01) {
      return "hundredths";
    } else {
      return "unknown";
    }
  }
}
