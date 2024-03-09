import { Injectable } from '@angular/core';

import { MixedNumber } from '../models/mixed-number.model';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  normalizeInput(userInput: string, correctAnswer: string) {
    const normalizedUserInput = userInput
      .trim()
      .replace(/\s+/g, '')
      .toLowerCase();
    const normalizedCorrectAnswer = correctAnswer
      .trim()
      .replace(/\s+/g, '')
      .toLowerCase();
    return {
      normalizedUserInput,
      normalizedCorrectAnswer,
    };
  }

  displayHint(hint: unknown) {
    if (hint) {
      console.log(hint); // Display hint to console (you might want to update your UI here)
    }
  }
  parseMixedNumber(input: string): MixedNumber {
    const parts = input.split(' ');
    let whole = 0;
    let numerator = 0;
    let denominator = 1;

    if (parts.length === 2) {
      whole = parseInt(parts[0], 10);
      [numerator, denominator] = parts[1].split('/').map(Number);
    } else {
      [numerator, denominator] = input.split('/').map(Number);
    }

    return {
      whole,
      numerator,
      denominator,
    };
  }

  compareMixedNumbers(userInput: MixedNumber, correct: MixedNumber) {
    const userAnswer =
      userInput.whole * userInput.denominator + userInput.numerator;
    const correctAnswer =
      correct.whole * correct.denominator + correct.numerator;
    return (
      userAnswer === correctAnswer &&
      userInput.denominator === correct.denominator
    );
  }

  convertMixedToImproper(mixedNumber: MixedNumber) {
    const numerator =
      mixedNumber.whole * mixedNumber.denominator + mixedNumber.numerator;
    const { denominator } = mixedNumber;
    return {
      numerator,
      denominator,
    };
  }

  handleAddMixedCase(userInput: string, correctAnswer: string) {
    const parsedUserAnswer = this.parseMixedNumber(userInput);
    if (parsedUserAnswer === null) {
      return false;
    }
    const userImproper = this.convertMixedToImproper(parsedUserAnswer);
    const correctImproper = this.convertMixedToImproper(
      this.parseMixedNumber(correctAnswer)
    );
    const simplifiedUser = this.simplifyFraction(
      userImproper.numerator,
      userImproper.denominator
    );
    const simplifiedCorrect = this.simplifyFraction(
      correctImproper.numerator,
      correctImproper.denominator
    );
    return (
      simplifiedUser.numerator === simplifiedCorrect.numerator &&
      simplifiedUser.denominator === simplifiedCorrect.denominator
    );
  }

  handleConvertCase(userInput: string, correctAnswer: string) {
    const isFraction = correctAnswer.includes('/');
    if (isFraction) {
      const [userNum, userDenom] = userInput.split('/').map(Number);
      const [correctNum, correctDenom] = correctAnswer.split('/').map(Number);
      const simplifiedUser = this.simplifyFraction(userNum, userDenom);
      const simplifiedCorrect = this.simplifyFraction(correctNum, correctDenom);
      return (
        simplifiedUser.numerator === simplifiedCorrect.numerator &&
        simplifiedUser.denominator === simplifiedCorrect.denominator
      );
    }
    return Math.abs(parseFloat(userInput) - parseFloat(correctAnswer)) < 0.001;
  }

  handleImproperToMixedCase(userInput: string, correctAnswer: string) {
    const userAnswerParts = userInput.includes(' ')
      ? userInput.split(' ')
      : [userInput];
    if (userAnswerParts.length === 2 && userAnswerParts[1].includes('/')) {
      const userWhole = parseInt(userAnswerParts[0], 10);
      const [userNumerator, userDenominator] = userAnswerParts[1]
        .split('/')
        .map(Number);
      const [correctWhole, correctFraction] = correctAnswer.split(' ');
      const [correctNumerator, correctDenominator] = correctFraction
        .split('/')
        .map(Number);
      return (
        userWhole === parseInt(correctWhole, 10) &&
        userNumerator === correctNumerator &&
        userDenominator === correctDenominator
      );
    }
    return false;
  }

  handleRoundingCase(
    userInput: string,
    correctAnswer: string,
    questionText: string
  ) {
    let precision = 0;
    if (questionText.includes('nearest tenth')) {
      precision = 1;
    } else if (questionText.includes('nearest hundredth')) {
      precision = 2;
    }
    const roundedCorrectAnswer = parseFloat(correctAnswer).toFixed(precision);
    return (
      userInput === roundedCorrectAnswer ||
      parseFloat(userInput) === parseFloat(roundedCorrectAnswer)
    );
  }

  handleDivideFractionsCase(userInput: string, correctAnswer: string) {
    const [userNum, userDenom] = userInput.split('/').map(Number);
    const [correctNum, correctDenom] = correctAnswer.split('/').map(Number);
    const simplifiedUser = this.simplifyFraction(userNum, userDenom);
    const simplifiedCorrect = this.simplifyFraction(correctNum, correctDenom);
    return (
      simplifiedUser.numerator === simplifiedCorrect.numerator &&
      simplifiedUser.denominator === simplifiedCorrect.denominator
    );
  }

  handleComparisonCase(userInput: string, correctAnswer: string) {
    return userInput === correctAnswer;
  }

  handleDefaultCase(userInput: string, correctAnswer: string) {
    return Math.abs(parseFloat(userInput) - parseFloat(correctAnswer)) < 0.01;
  }

  simplifyFraction(numerator: number, denominator: number) {
    function gcd(a: number, b: number): number {
      return b ? gcd(b, a % b) : a;
    }
    const greatestCommonDivisor = gcd(numerator, denominator);
    return {
      numerator: numerator / greatestCommonDivisor,
      denominator: denominator / greatestCommonDivisor,
    };
  }

  decimalToFrac(decimal: number): string {
    const denominator = 100;
    const numerator = Math.round(decimal * denominator);
    return `${numerator}/${denominator}`;
  }

  calculateGCF(a: number, b: number): number {
    if (!Number.isInteger(a) || !Number.isInteger(b) || a <= 0 || b <= 0) {
      throw new Error('Both inputs must be positive integers.');
    }
    return b ? this.calculateGCF(b, a % b) : a;
  }

  calculateLCM(a: number, b: number): number {
    if (!Number.isInteger(a) || !Number.isInteger(b) || a <= 0 || b <= 0) {
      throw new Error('Both inputs must be positive integers.');
    }
    return (a * b) / this.calculateGCF(a, b);
  }

  isImproperFraction(input: string): boolean {
    const parts = input.split('/');
    if (parts.length !== 2) return false;
    const [numerator, denominator] = parts.map(Number);
    return (
      !Number.isNaN(numerator) &&
      !Number.isNaN(denominator) &&
      numerator > denominator &&
      denominator > 0
    );
  }

  compareDecimals(a: number, b: number) {
    if (a > b) return '>';
    if (a < b) return '<';
    return '=';
  }

  compareFractions(n1: number, d1: number, n2: number, d2: number) {
    const val1 = n1 / d1;
    const val2 = n2 / d2;
    if (val1 > val2) return '>';
    if (val1 < val2) return '<';
    return '=';
  }

  checkAnswer(
    userInput: string,
    correctAnswer: string,
    questionType: string,
    hint: unknown,
    questionText: string
  ) {
    const { normalizedUserInput, normalizedCorrectAnswer } =
      this.normalizeInput(userInput, correctAnswer);
    let isCorrect = false;

    if (normalizedUserInput === '' || normalizedUserInput === null) {
      return false;
    }

    switch (questionType) {
      case 'add mixed':
        isCorrect = this.handleAddMixedCase(
          normalizedUserInput,
          normalizedCorrectAnswer
        );
        break;
      case 'factor':
      case 'distribute':
      case 'simplify':
      case 'whole-times-mixed':
      case 'translate':
        isCorrect = normalizedUserInput === normalizedCorrectAnswer;
        break;
      case 'convert':
      case 'mixed-to-improper':
        isCorrect = this.handleConvertCase(
          normalizedUserInput,
          normalizedCorrectAnswer
        );
        break;
      case 'improper-to-mixed':
        isCorrect = this.handleImproperToMixedCase(
          normalizedUserInput,
          normalizedCorrectAnswer
        );
        break;
      case 'rounding':
        isCorrect = this.handleRoundingCase(
          normalizedUserInput,
          normalizedCorrectAnswer,
          questionText
        );
        break;
      case 'divide fractions':
        isCorrect = this.handleDivideFractionsCase(
          normalizedUserInput,
          normalizedCorrectAnswer
        );
        break;
      case 'comparison':
        isCorrect = this.handleComparisonCase(
          normalizedUserInput,
          normalizedCorrectAnswer
        );
        break;
      default:
        isCorrect = this.handleDefaultCase(
          normalizedUserInput,
          normalizedCorrectAnswer
        );
    }

    if (!isCorrect) {
      this.displayHint(hint);
    }

    return isCorrect;
  }
}
