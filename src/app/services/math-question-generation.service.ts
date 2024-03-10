import { Injectable } from '@angular/core';

import { MathQuestion } from '../models/math-question.model';

@Injectable({
  providedIn: 'root',
})
export class MathQuestionGenerationService {
  generateAdditionQuestion(): MathQuestion {
    const decimalPlacesNum1 = Math.floor(Math.random() * 4);
    const decimalPlacesNum2 = Math.floor(Math.random() * 4);
    const num1 = (Math.random() * (900 - 0.003) + 0.003).toFixed(
      decimalPlacesNum1
    );
    const num2 = (Math.random() * (90 - 0.003) + 0.003).toFixed(
      decimalPlacesNum2
    );
    const answer = parseFloat((parseFloat(num1) + parseFloat(num2)).toFixed(3));

    return {
      question: `${num1} + ${num2}`,
      answer: answer.toString(),
    };
  }

  generateSubtractionQuestion(): MathQuestion {
    const decimalPlacesNum1 = Math.floor(Math.random() * 4);
    const decimalPlacesNum2 = Math.floor(Math.random() * 4);
    const num1 = (Math.random() * (900 - 0.003) + 0.003).toFixed(
      decimalPlacesNum1
    );
    const num2 = (Math.random() * (900 - 0.003) + 0.003).toFixed(
      decimalPlacesNum2
    );

    // Ensure num1 is always larger to avoid negative results
    const larger = Math.max(parseFloat(num1), parseFloat(num2));
    const smaller = Math.min(parseFloat(num1), parseFloat(num2));

    return {
      question: `${larger} - ${smaller}`,
      answer: (larger - smaller).toFixed(3),
    };
  }

  generateMultiplicationQuestion(): MathQuestion {
    const num1 = Math.floor(Math.random() * 80) + 15;
    const num2 = Math.floor(Math.random() * 80) + 15;
    const answer = num1 * num2;

    return {
      question: `${num1} × ${num2}`,
      answer: answer.toString(),
    };
  }

  generateTranslateQuestion(): MathQuestion {
    const num1 = Math.floor(Math.random() * 50) + 5; // Generate a random number between 5 and 54
    const num2 = Math.floor(Math.random() * 50) + 5; // Generate a random number between 5 and 54
    const questionType = Math.floor(Math.random() * 15) + 1; // Randomly choose the type of problem

    let question: string;
    let answer: string;

    switch (questionType) {
      case 1:
        question = `The sum of a number and ${num1} is ${num2}.  <br> Use n as the variable`;
        answer = `n + ${num1} = ${num2}`;
        break;
      case 2:
        question = `${num1} more than a number is ${num2}.  <br> Use n as the variable`;
        answer = `n + ${num1} = ${num2}`;
        break;
      case 3:
        question = `Increasing a number by ${num1} gives ${num2}.  <br> Use n as the variable`;
        answer = `n + ${num1} = ${num2}`;
        break;
      case 4:
        question = `${num1} added to a number equals ${num2}.  <br> Use n as the variable`;
        answer = `n + ${num1} = ${num2}`;
        break;
      case 5:
        question = `${num1} less than a number equals ${num2}.  <br> Use n as the variable`;
        answer = `n - ${num1} = ${num2}`;
        break;
      case 6:
        question = `The difference between a number and ${num1} is ${num2}.  <br> Use n as the variable`;
        answer = `n - ${num1} = ${num2}`;
        break;
      case 7:
        question = `Subtracting ${num1} from a number leaves ${num2}.  <br> Use n as the variable`;
        answer = `n - ${num1} = ${num2}`;
        break;
      case 8:
        question = `${num1} subtracted from a number results in ${num2}.  <br> Use n as the variable`;
        answer = `n - ${num1} = ${num2}`;
        break;
      case 9:
        question = `The product of a number and ${num1} gives ${num2}.  <br> Use n as the variable`;
        answer = `${num1}n = ${num2}`;
        break;
      case 10:
        question = `${num1} times a number is ${num2}.  <br> Use n as the variable`;
        answer = `${num1}n = ${num2}`;
        break;
      case 11:
        question = `Dividing a number by ${num1} is ${num2}.  <br> Use n as the variable`;
        answer = `n/${num1} = ${num2}`;
        break;
      case 12:
        question = `When a number is divided by ${num1}, the result is ${num2}.  <br> Use n as the variable`;
        answer = `n/${num1} = ${num2}`;
        break;
      case 13:
        question = `${num1} divided by a number equals ${num2}.  <br> Use n as the variable`;
        answer = `${num1}/n = ${num2}`;
        break;
      case 14:
        question = `${num1} divided by ${num2} equals n.  <br> Use n as the variable`;
        answer = `${num1}/${num2} = n`;
        break;
      default:
        question = `A number n divided by ${num1}.  <br> Use n as the variable`;
        answer = `n / ${num1}`;
        break;
    }

    return {
      question,
      answer,
    };
  }
}
