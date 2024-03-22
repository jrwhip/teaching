import * as helper from '../helper.utils';
import { Problem } from '../../models/problem.model';

export function generateAbsoluteValueProblem() {
  const num = Math.floor(Math.random() * 21) - 10; // Number between -10 and 10
  const isNegated = Math.random() < 0.5; // Randomly decide whether to negate

  const question = `What is ${isNegated ? '-' : ''}|${num}|?`;
  const answer = isNegated ? -Math.abs(num) : Math.abs(num);
  let hint =
    'The absolute value of a number is its distance from 0 on the number line, regardless of direction.<br><br>';

  if (isNegated) {
    hint += `1. The question shows -|${num}|, which means we take the negative of the absolute value of ${num}.<br>`;
    hint += `2. The absolute value of ${num} is ${Math.abs(
      num
    )}, because it's ${Math.abs(
      num
    )} units away from 0 on the number line.<br>`;
    hint += `3. Since we're taking the negative of the absolute value, the answer is -${Math.abs(
      num
    )}.`;
  } else {
    hint += `1. The question shows |${num}|, which is asking for the absolute value of ${num}.<br>`;
    hint += `2. The absolute value of ${num} is ${Math.abs(
      num
    )}, because it's ${Math.abs(
      num
    )} units away from 0 on the number line, without considering direction.<br>`;
    hint += `3. So, the answer is ${Math.abs(
      num
    )}, which is the absolute distance from 0.`;
  }

  // Validation function to handle user input
  const validateFn = (userInput: string) => {
    const parsedInput = parseFloat(userInput);
    const isCorrect = parsedInput === answer;

    return isCorrect;
  };

  return new Problem(question, answer.toString(), validateFn, hint);
}

export function generateOppositesProblem() {
  const num = Math.floor(Math.random() * 21) - 10; // Number between -10 and 10
  const questionType =
    Math.random() < 0.5 ? 'opposite' : 'opposite of the opposite';
  let hint = '';

  if (questionType === 'opposite') {
    hint = `The opposite of a number is the same distance from 0 on the number line, but in the opposite direction.
    So, the opposite of ${num} is ${-num}.`;
  } else {
    // Opposite of the opposite
    hint = `First, find the opposite of ${num}, which is ${-num}. <br>
    Then, to find the opposite of the opposite, you just go back to the original number. <br>
    Think of it as taking two steps in one direction and then two steps back to where you started. <br>
    So, the opposite of the opposite of ${num} is back to ${num} itself.`;
  }

  const question = `What is the ${
    questionType === 'opposite' ? 'opposite' : 'opposite of the opposite'
  } of ${num}?`;
  const answer = questionType === 'opposite' ? -num : num;

  // Validation function to handle user input
  const validateFn = (userInput: string) => {
    const parsedInput = parseFloat(userInput);
    const isCorrect = parsedInput === answer;

    return isCorrect;
  };

  return new Problem(question, answer.toString(), validateFn, hint);
}

export function generateLCMProblem() {
  const num1 = Math.floor(Math.random() * 10) + 2;
  let num2 = Math.floor(Math.random() * 11) + 2;

  while (num1 === num2) {
    num2 = Math.floor(Math.random() * 11) + 2;
  }

  const hint = `The Least Common Multiple (LCM) of two numbers is the smallest number that is a multiple of both. For ${num1} and ${num2}, find the smallest common multiple.`;

  const validateFn = (userInput: string) => {
    const parsedInput = parseInt(userInput, 10);
    const isCorrect = parsedInput === helper.calculateLCM(num1, num2);

    return isCorrect;
  };

  return new Problem(
    `Find the LCM of ${num1} and ${num2}`,
    helper.lcm.toString(),
    validateFn,
    hint
  );
}

export function generateGCFProblem() {
  let num1;
  let num2;
  let num3;
  let num4;
  do {
    num1 = Math.floor(Math.random() * 8) + 2;
    num2 = Math.floor(Math.random() * 8) + 1;
    num3 = Math.floor(Math.random() * 5) + 1;
    num4 = num3 + 1;
  } while (num1 * num2 * num3 > 100 || num1 * num2 * num4 > 100);

  const gcf = helper.calculateGCF(num1 * num2 * num3, num1 * num2 * num4);

  const hint = `The Greatest Common Factor (GCF) of two numbers is the largest number that divides both of them without leaving a remainder. For ${
    num1 * num2 * num3
  } and ${num1 * num2 * num4}, first identify the common factors.`;

  const validateFn = (userInput: string) => {
    const parsedInput = parseInt(userInput, 10);
    const isCorrect = parsedInput === gcf;

    return isCorrect;
  };

  return new Problem(
    `Find the GCF of ${num1 * num2 * num3} and ${num1 * num2 * num4}`,
    gcf.toString(),
    validateFn,
    hint
  );
}
