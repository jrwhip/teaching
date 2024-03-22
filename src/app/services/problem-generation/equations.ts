import * as helper from '../helper.utils';
import { Problem } from '../../models/problem.model';

export function generateSolveForXProblem() {
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  const num3 = Math.floor(Math.random() * 9) + 1;
  const operation = Math.random() < 0.5 ? '+' : '-';

  const question = `Solve for x: ${num1}x ${operation} ${num3} <br>Given that x = ${num2}.`;
  const answer = operation === '+' ? num1 * num2 + num3 : num1 * num2 - num3;

  const hint =
    `1. Substitute x with ${num2} into the equation: ${num1}(${num2}) ${operation} ${num3}.<br>` +
    `2. Perform the multiplication: ${num1 * num2} ${operation} ${num3}.<br>` +
    `3. Complete the ${operation === '+' ? 'addition' : 'subtraction'}: ` +
    `${
      operation === '+'
        ? `${num1 * num2} + ${num3}`
        : `${num1 * num2} - ${num3}`
    } = ${answer}.`;

  // Ensure validateFn uses the standardized way of handling input and comparing with the answer
  const validateFn = (userInput: string) => {
    const parsedInput = parseFloat(userInput);
    const isCorrect = parsedInput === answer;

    return isCorrect;
  };

  return new Problem(question, answer.toString(), validateFn, hint);
}

export function generateExponentProblem() {
  const num1 = Math.floor(Math.random() * 8) + 2; // Base between 2 and 9
  let exponent;
  if (num1 > 5) {
    exponent = Math.floor(Math.random() * 3) + 2; // Exponent between 2 and 4
  } else {
    exponent = Math.floor(Math.random() * 4) + 2; // Exponent between 2 and 5
  }

  let multiplicationSequence = `${num1}`;
  // for (let i = 1; i < exponent; i++) {
  //   multiplicationSequence += ` × ${num1}`;
  // }

  Array.from({ length: exponent - 1 }).forEach(() => {
    multiplicationSequence += ` × ${num1}`;
  });

  const question = `Calculate ${num1}<sup>${exponent}</sup>`;
  const answer = num1 ** exponent;
  const hint =
    `To calculate ${num1}<sup>${exponent}</sup>, multiply ${num1} by itself ${exponent} times. ` +
    `For example: ${multiplicationSequence} = ${answer}. ` +
    `<br>Base: ${num1}<br>Exponent: ${exponent}`;

  // Ensure validateFn handles user input correctly
  const validateFn = (userInput: string) => {
    const parsedInput = parseFloat(userInput);
    const isCorrect = parsedInput === answer;

    return isCorrect;
  };

  return new Problem(question, answer.toString(), validateFn, hint);
}

export function generateUnknownProblem() {
  let num1;
  let num2;
  let num3;
  let question;
  let answer: string;
  let hint;
  const type = Math.floor(Math.random() * 4) + 1; // Choose a random type between 1 and 4

  switch (type) {
    case 1:
      num1 = Math.floor(Math.random() * 9) + 2; // Random number for multiplication
      num2 = Math.floor(Math.random() * 9) + 2;
      num3 = Math.floor(Math.random() * 9) + 2; // Random number for addition
      question = `${num3} x ${num1 + num2} = ${num3} x (${num2} + _________)`;
      answer = num1.toString(); // Calculate the missing number
      hint = `To find the missing number, divide both sides of the equation by ${num3}.
        This will give you ${num1 + num2} = ${num2} + _________.
        Then, subtract ${num2} from both sides to find the missing number.`;
      break;
    case 2:
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * 9) + 2;
      num3 = Math.floor(Math.random() * 9) + 2;
      question = `${num3} x ${
        num1 + num2
      } = (${num3} x ${num2}) + (${num3} x _______)`;
      answer = num1.toString();
      hint = `First, calculate ${num3} x ${num2} to find part of the total.
        Then subtract this from the total (${num3} x ${
        num1 + num2
      }) to find the missing part.
        This missing part divided by ${num3} is the missing number.`;
      break;
    case 3:
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * 9) + 2;
      num3 = Math.floor(Math.random() * 9) + 2;
      question = `${num3} x (${num1} + ${num2}) = ${num3} x _________`;
      answer = (num1 + num2).toString();
      hint = `To solve, you divide the total (${num3} x (${num1} + ${num2})) by ${num3}.
        This tells you the combined total of ${num1} and ${num2} before multiplying by ${num3}.`;
      break;
    case 4:
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * 6) + 2;
      num3 = Math.floor(Math.random() * 6) + 2;
      question = `${num1} x (${num2} + ${num3}) = _________`;
      answer = (num1 * (num2 + num3)).toString();
      hint = `(${num2} + ${num3}) = ${
        num2 + num3
      } add first since it's in parentheses.
        Then, multiply ${num2 + num3} × ${num1} to find the total.`;
      break;
    default:
      num1 = 0;
      num2 = 0;
      num3 = 0;
      question = 'No question available';
      answer = 'No answer available';
      hint = 'No hint available';
  }

  const validateFn = (userInput: string) => {
    const isCorrect = userInput.trim() === answer;

    return isCorrect;
  };

  return new Problem(question, answer, validateFn, hint);
}

export function generateFactorProblem() {
  let num1;
  let num2;
  let num3;
  let question;
  let answer: string;
  let hint;
  const isFactoring = Math.random() < 0.5; // Randomly decide between factoring and distributing

  if (isFactoring) {
    // Factoring problem
    num3 = Math.floor(Math.random() * 3) + 2;
    num1 = num3 * (Math.floor(Math.random() * 20) + 2);
    num2 = num3 * (Math.floor(Math.random() * 20) + 2);
    const commonFactor = helper.calculateGCF(num1, num2);
    question = `Factor: ${commonFactor * num1}n - ${commonFactor * num2}`;
    answer = `${commonFactor}( ${num1 / commonFactor}n - ${
      num2 / commonFactor
    } )`;
    hint = `To factor the expression, first identify the greatest common factor (GCF) of the coefficients. 
            \nFor ${commonFactor * num1}n and ${
      commonFactor * num2
    }, the GCF is ${commonFactor}. 
            \nThen divide each term by the GCF and express the original expression as the product of the GCF and the simplified expression: 
            \n${commonFactor}(${num1 / commonFactor}n - ${
      num2 / commonFactor
    }).`;
  } else {
    // Distributing problem, similar setup as factoring but phrased differently
    num3 = Math.floor(Math.random() * 3) + 2;
    num1 = num3 * (Math.floor(Math.random() * 20) + 2);
    num2 = num3 * (Math.floor(Math.random() * 20) + 2);
    const commonFactor = helper.calculateGCF(num1, num2);
    question = `Use the GCF to simplify: ${commonFactor * num1} + ${
      commonFactor * num2
    }`;
    answer = `${commonFactor}( ${num1 / commonFactor} + ${
      num2 / commonFactor
    } )`;
    hint = `Simplify by identifying the GCF of the terms, which is ${commonFactor}. Then express the sum as a product of the GCF and a simplified expression: 
            \n${commonFactor}(${num1 / commonFactor} + ${
      num2 / commonFactor
    }).`;
  }

  const validateFn = (userInput: string) => {
    const standardizedInput = userInput.trim().replace(/\s+/g, '');
    const isCorrect = standardizedInput === answer.replace(/\s+/g, '');

    return isCorrect;
  };

  return new Problem(question, answer, validateFn, hint);
}

export function generateDistributeProblem() {
  const coefficient = Math.floor(Math.random() * 5) + 2; // Coefficient between 2 and 6
  const term1 = Math.floor(Math.random() * 10) + 1;
  const term2 = Math.floor(Math.random() * 10) + 1;
  const question = `${coefficient}(${term1}n - ${term2})`;
  const answer = `${coefficient * term1}n - ${coefficient * term2}`;
  const hint =
    `To distribute, multiply the number outside the parentheses by each term inside the parentheses: ` +
    `<br>    ${coefficient}(${term1}n-${term2})        Multiply (${coefficient}) by the terms (${term1}n) and (${term2}) inside the parentheses` +
    `<br>    ${coefficient}&bull;${term1}n - ${coefficient}&bull;${term2}` +
    `<br>    ${coefficient * term1}n - ${
      coefficient * term2
    }.    Remember to keep the sign.`;

  const validateFn = (userInput: string) => {
    const standardizedInput = userInput.trim().replace(/\s+/g, '');
    // Simplify the input answer to compare with simplified correct answer
    const simplifiedInput = standardizedInput.replace(/n/g, ''); // Remove 'n' for numerical comparison
    const simplifiedAnswer = answer.replace(/n/g, ''); // Remove 'n' from the correct answer for comparison
    // Split by operator
    const [inputNum1, inputNum2] = simplifiedInput.split('-').map(Number);
    const [answerNum1, answerNum2] = simplifiedAnswer.split('-').map(Number);

    // Perform operation and compare
    const isCorrect = inputNum1 - inputNum2 === answerNum1 - answerNum2;

    return isCorrect;
  };

  return new Problem(question, answer, validateFn, hint);
}

export function generateSolveXProblem() {
  let question;
  let answer: number;
  let hint;
  const questionType = Math.floor(Math.random() * 6) + 1; // Choose a problem type at random

  if (questionType === 1) {
    // Simple addition, e.g., x + 3 = 10
    const addNum = Math.floor(Math.random() * 10) + 1;
    answer = Math.floor(Math.random() * 10) + 1;
    question = `x + ${addNum} = ${answer + addNum}`;
    hint = `Subtract ${addNum} from both sides of the equation to solve for x.`;
  } else if (questionType === 2) {
    // Simple subtraction, e.g., x - 2 = 5
    const subNum = Math.floor(Math.random() * 10) + 1;
    answer = Math.floor(Math.random() * 10) + 1;
    question = `x - ${subNum} = ${answer - subNum}`;
    hint = `Add ${subNum} to both sides of the equation to solve for x.`;
  } else if (questionType === 3) {
    // Simple multiplication, e.g., 3x = 15
    const multNum = Math.floor(Math.random() * 10) + 1;
    answer = Math.floor(Math.random() * 10) + 1;
    question = `${multNum}x = ${answer * multNum}`;
    hint = `Divide both sides by ${multNum} to solve for x.`;
  } else if (questionType === 4) {
    // Simple division, e.g., x/4 = 2
    const divNum = Math.floor(Math.random() * 10) + 1;
    answer = Math.floor(Math.random() * 10) + 1;
    question = `x / ${divNum} = ${answer}`;
    hint = `Multiply both sides by ${divNum} to solve for x.`;
  } else if (questionType === 5) {
    // Mixed operations with addition and multiplication
    const addMixNum = Math.floor(Math.random() * 10) + 1;
    const multMixNum = Math.floor(Math.random() * 5) + 2;
    answer = Math.floor(Math.random() * 10) + 1;
    question = `${multMixNum}(x + ${addMixNum}) = ${
      multMixNum * (answer + addMixNum)
    }`;
    hint = `First, divide both sides by ${multMixNum}, then subtract ${addMixNum} from both sides to solve for x.`;
  } else if (questionType === 6) {
    // Mixed operations with subtraction and division
    const subMixNum = Math.floor(Math.random() * 10) + 1;
    const divMixNum = Math.floor(Math.random() * 5) + 2;
    answer = Math.floor(Math.random() * 10) + 1;
    question = `(x - ${subMixNum}) / ${divMixNum} = ${answer}`;
    hint = `First, multiply both sides by ${divMixNum}, then add ${subMixNum} to both sides to solve for x.`;
  } else {
    question = 'No question available';
    answer = 0;
    hint = 'No hint available';
  }
  // Adjust the validateFn to properly compare the user's input against the correct answer
  const validateFn = (userInput: string) => {
    const parsedInput = parseFloat(userInput);
    const isCorrect = parsedInput === answer; // Ensure comparison is correct

    return isCorrect;
  };

  return new Problem(question, answer.toString(), validateFn, hint);
}

export function generateTranslationProblem() {
  const num1 = Math.floor(Math.random() * 50) + 5; // Generate a random number between 5 and 54
  const num2 = Math.floor(Math.random() * 50) + 5; // Generate a random number between 5 and 54
  const questionType = Math.floor(Math.random() * 15) + 1; // Randomly choose the type of problem

  let question;
  let answer: string;
  let hint;

  switch (questionType) {
    case 1: // Addition
      question = `The sum of a number and ${num1} is ${num2}.  <br> Use n as the variable`;
      answer = `n + ${num1} = ${num2}`;
      break;
    case 2: // Subtraction
      question = `${num1} more than a number is ${num2}.  <br> Use n as the variable`;
      answer = `n - ${num1} = ${num2}`;
      answer = `${num2} - n = ${num1}`;
      break;
    case 3: // Addition
      question = `Increasing a number by ${num1} gives ${num2}.  <br> Use n as the variable`;
      answer = `n + ${num1} = ${num2}`;
      break;
    case 4: // Addition
      question = `${num1} added to a number equals ${num2}.  <br> Use n as the variable`;
      answer = `n + ${num1} = ${num2}`;
      break;
    case 5: // Subtraction
      question = `${num1} less than a number equals ${num2}.  <br> Use n as the variable`;
      answer = `n - ${num1} = ${num2}`;
      break;
    case 6: // Multiplication
      question = `The difference between a number and ${num1} is ${num2}.  <br> Use n as the variable`;
      answer = `n - ${num1} = ${num2}`;
      break;
    case 7: // Addition
      question = `Subtracting ${num1} from a number leaves ${num2}.  <br> Use n as the variable`;
      answer = `n - ${num1} = ${num2}`;
      break;
    case 8: // Subtraction
      question = `${num1} subtracted from a number results in ${num2}.  <br> Use n as the variable`;
      answer = `n - ${num1} = ${num2}`;
      break;
    case 9: // Multiplication
      question = `The product of a number and ${num1} gives ${num2}.  <br> Use n as the variable`;
      answer = `${num1}n = ${num2}`;
      break;
    case 10: // Addition
      question = `${num1} times a number is ${num2}.  <br> Use n as the variable`;
      answer = `${num1}n = ${num2}`;
      break;
    case 11: // Subtraction
      question = `Dividing a number by ${num1} is ${num2}.  <br> Use n as the variable`;
      answer = `n / ${num1} = ${num2}`;
      break;
    case 12: // Multiplication
      question = `When a number is divided by ${num1}, the result is ${num2}.  <br> Use n as the variable`;
      answer = `n / ${num1} = ${num2}`;
      break;
    case 13: // Subtraction
      question = `${num1} divided by a number equals ${num2}.  <br> Use n as the variable`;
      answer = `${num1} / n = ${num2}`;
      break;
    case 14: // Multiplication
      question = `${num1} divided by ${num2} = n.  <br> Use n as the variable`;
      answer = `${num1} / ${num2} = n~${num2} / ${num1} = n`;
      break;
    case 15: // Division
      question = `A number n divided by ${num1} = ${num2}.  <br> Use n as the variable`;
      answer = `n / ${num1} = ${num2}`;
      break;
    default:
      question = `Type winner`;
      answer = `winner`;
  }
  // Validation function
  const validateFn = (userInput: string) => {
    const normalizedInput = userInput.replace(/\s/g, '').toLowerCase();
    const normalizedAnswer = answer.replace(/\s/g, '').toLowerCase();
    const splitAnswer = normalizedAnswer.split('~');
    if (splitAnswer.length > 1) {
      return normalizedInput === splitAnswer[0] || userInput === splitAnswer[1];
    }
    const isCorrect = userInput === answer;
    return isCorrect;
  };
  const splitAnswer = answer.split('~');
  if (splitAnswer.length > 1) {
    hint = `The answer is either ${splitAnswer[0]} or ${splitAnswer[1]}`;
  } else {
    hint = `The equation is: ${answer}`;
  }

  // Return the generated problem
  return new Problem(question, answer, validateFn, hint);
}
