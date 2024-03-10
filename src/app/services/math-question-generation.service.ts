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

    const operation = questionType <= 8 ? 'n' : '';
    let question;
    let answer;
    let operator;

    switch (true) {
      case questionType <= 4:
        operator = '+';
        break;
      case questionType <= 8:
        operator = '-';
        break;
      case questionType <= 10:
        operator = '*';
        break;
      default:
        operator = '/';
    }

    const rightSide = questionType === 14 ? 'n' : `${num2}`;
    const variablePart =
      questionType >= 9 && questionType <= 12
        ? `${num1}n`
        : `n ${operator} ${num1}`;

    if (questionType <= 8) {
      question = `
        ${num1} ${questionType % 2 === 0 ? 'more than ' : ''}
        ${operation} a number ${questionType > 4 ? 'less ' : ''}
        equals ${num2}.
        <br> Use n as the variable
      `;
      answer = `${variablePart} = ${rightSide}`;
    } else if (questionType <= 12) {
      question = `
        A number ${operator === '*' ? 'times' : 'divided by'}
        ${num1} ${questionType % 2 === 0 ? 'is' : 'gives'} ${num2}.
        <br> Use n as the variable
      `;
      answer = `${variablePart} = ${rightSide}`;
    } else if (questionType === 13) {
      question = `${num1} divided by a number equals ${num2}. <br> Use n as the variable`;
      answer = `${num1}/n = ${num2}`;
    } else if (questionType === 14) {
      question = `${num1} divided by ${num2} equals n. <br> Use n as the variable`;
      answer = `${num1} / ${num2} = n`;
    } else {
      question = `A number n divided by ${num1}. <br> Use n as the variable`;
      answer = `n / ${num1}`;
    }

    return {
      question,
      answer,
    };
  }
}
