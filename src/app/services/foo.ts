import * as helper from './helper.utils';
import { Problem } from '../models/problem.model';

export function generateSimplifyProblem() {
  const num1 = Math.floor(Math.random() * 10) + 2; // Random number between 2 and 11
  const num2 = Math.floor(Math.random() * 10) + 2; // Random number between 2 and 11
  const num3 = Math.floor(Math.random() * 10) + 2; // Random number between 2 and 11
  const num4 = num1 * num2; // Creates a composite number ensuring a common factor
  const num5 = num1 * num3; // Creates another composite number with a common factor

  const commonFactor = helper.calculateGCF(num4, num5);
  const simplifiedNumerator = num4 / commonFactor;
  const simplifiedDenominator = num5 / commonFactor;

  const question = `Simplify: <span class="frac"><sup>${num4}</sup><span>&frasl;</span><sub>${num5}</sub></span> don't convert to a mixed number`;
  const answer = `${simplifiedNumerator} / ${simplifiedDenominator}`;
  const hint =
    `Divide numerator and denominator by the greatest common factor, which is ${commonFactor}.` +
    `<br><span class="frac"><sup>${num4} ÷ ${commonFactor}</sup><span>&frasl;</span><sub>${num5} ÷ ${commonFactor}</sub></span> = <span class="frac"><sup>${simplifiedNumerator}</sup><span>&frasl;</span><sub>${simplifiedDenominator}</sub></span>`;

  // Adjust the validateFn to properly compare the user's input against the correct answer
  const validateFn = (userInput: string) => {
    // Trim and remove any spaces to standardize the input
    const standardizedInput = userInput.trim().replace(/\s+/g, '');

    // Convert both parts of the answer to numbers for a numerical comparison
    const [userNumerator, userDenominator] = standardizedInput
      .split('/')
      .map(Number);

    // Check if the input is in fraction format and correctly simplified
    const isFractionCorrect =
      userNumerator === simplifiedNumerator &&
      (simplifiedDenominator === 1
        ? true
        : userDenominator === simplifiedDenominator);

    // Check if the input is a whole number and the simplified denominator is 1, implying a whole number answer
    const isWholeNumberCorrect =
      simplifiedDenominator === 1 &&
      userNumerator === simplifiedNumerator &&
      (standardizedInput === `${simplifiedNumerator}` ||
        userDenominator === undefined);

    const isCorrect = isFractionCorrect || isWholeNumberCorrect;

    return isCorrect;
  };

  return new Problem(question, answer, validateFn, hint);
}

export function generateAdditionProblem() {
  // Generate random decimal places between 0 and 3 for both numbers
  const decimalPlacesNum1 = Math.floor(Math.random() * 4);
  const decimalPlacesNum2 = Math.floor(Math.random() * 4);

  // Generate random decimal numbers between 0.003 and 900 for num1 and 0.003 and 90 for num2
  let num1 = (Math.random() * (900 - 0.003) + 0.003).toFixed(decimalPlacesNum1);
  let num2 = (Math.random() * (90 - 0.003) + 0.003).toFixed(decimalPlacesNum2);

  // Ensure both numbers have a decimal point for consistent processing
  num1 += num1.includes('.') ? '' : '.';
  num2 += num2.includes('.') ? '' : '.';

  // Calculate the sum and format it
  const sum = parseFloat((parseFloat(num1) + parseFloat(num2)).toFixed(3));

  // Create a visual representation of the addition, aligning the decimal points
  const maxDecimalPlaces = Math.max(decimalPlacesNum1, decimalPlacesNum2);
  const num1Padded = num1.padEnd(num1.indexOf('.') + 1 + maxDecimalPlaces, '0');
  const num2Padded = num2.padEnd(num2.indexOf('.') + 1 + maxDecimalPlaces, '0');
  const sumPadded = sum.toFixed(maxDecimalPlaces);

  // Constructing the hint
  const hint = `Lets add them step by step:<br>

1. Write the numbers vertically, aligning the decimal points:<style>
    table {
        border-collapse: collapse;
    }
    table, th, td {
        text-align: right; /* Ensure right alignment */
    }
</style>
<table>
    <tr>
        <td> </td>
        <td>${num1Padded}</td>
    </tr>
    <tr>
        <td> </td>
        <!-- Apply a bottom border to this cell only -->
        <td style="border-bottom: 1px solid black;">+ ${num2Padded}</td>
    </tr>
    <tr>
        <td> </td>
        <td>${sumPadded}</td>
    </tr>
</table>2. If a column's total is 10 or more, carry over to the next column.<br>
3. Write down the sum with the decimal point aligned`;

  // Define the validate function
  const validateFn = (userInput: string) => {
    const isCorrect = parseFloat(userInput) === sum;
    return isCorrect;
  };

  // Return a new Problem object with the question, answer, and validate function
  return new Problem(`${num1} + ${num2}`, sum.toString(), validateFn, hint);
}

export function generateSubtractionProblem() {
  let num1;
  let num2;
  do {
    // Generate random decimal places between 0 and 3 for both numbers
    const decimalPlacesNum1 = Math.floor(Math.random() * 4);
    const decimalPlacesNum2 = Math.floor(Math.random() * 4);

    // Generate random decimal numbers between 0.003 and 900 for num1 and 0.003 and 90 for num2
    num1 = (Math.random() * (900 - 0.003) + 0.003).toFixed(decimalPlacesNum1);
    num2 = (Math.random() * (90 - 0.003) + 0.003).toFixed(decimalPlacesNum2);

    // Convert the numbers to floats
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
  } while (num1 < num2); // Ensure num1 is larger than num2

  // Determine the number of decimal places in num1 and num2
  const num1Decimals = (num1.toString().split('.')[1] || '').length;
  const num2Decimals = (num2.toString().split('.')[1] || '').length;
  const maxDecimalPlaces = Math.max(num1Decimals, num2Decimals);

  // Calculate the difference and round to the maximum number of decimal places found in num1 or num2
  const difference = Number((num1 - num2).toFixed(maxDecimalPlaces));

  // Pad the numbers for hint alignment if necessary
  const num1Padded = num1.toFixed(maxDecimalPlaces);
  const num2Padded = num2.toFixed(maxDecimalPlaces);

  // Construct the hint
  const hint = `Let's subtract them step by step:
    1. Write the numbers vertically, aligning the decimal points:
    <style>
      table {
        border-collapse: collapse;
      }
      table, th, td {
        text-align: right; /* Ensure right alignment */
      }
    </style>
    <table>
      <tr>
        <td> </td>
        <td>${num1Padded}</td>
      </tr>
      <tr>
        <td> </td>
        <!-- Apply a bottom border to this cell only -->
        <td style="border-bottom: 1px solid black;">- ${num2Padded}</td>
      </tr>
      <tr>
        <td> </td>
        <td>${difference}</td>
      </tr>
    </table>
    2. Subtract each column starting from the right.
    3. Write down the difference with the decimal point aligned.`;

  // Define the validate function
  const validateFn = (userInput: string) => {
    const isCorrect = parseFloat(userInput) === difference;
    return isCorrect;
  };

  // Return the generated problem with unpadded numbers for the question
  return new Problem(
    `${num1} - ${num2}`,
    difference.toString(),
    validateFn,
    hint
  );
}

export function generateMultiplicationProblem() {
  const num1 = Math.floor(Math.random() * 80) + 15;
  const num2 = Math.floor(Math.random() * 80) + 15;
  const onesPlaceNum2 = num2 % 10; // Digit in the ones place of num2
  const tensPlaceNum2 = Math.floor(num2 / 10) % 10; // Digit in the tens place of num2
  const multiplicationStep1 = num1 * onesPlaceNum2;
  const multiplicationStep2 = num1 * tensPlaceNum2;

  // Hint construction with visual representation in a table format
  const hint = `Let's break down the multiplication: <br>
    Given: ${num1} × ${num2}<br><br>
    <table style="border-collapse: collapse;">
      <tr>
        <th style="text-align: right;">Times the <br>ones place</th>
         <td style="text-align: right;">&nbsp;</td>
        <th style="text-align: right;">Times the <br>tens place</th>
         <td style="text-align: right;">&nbsp;</td>
        <th style="text-align: right;">Add the <br>Products</th>
      </tr>
      <tr>
        <td style="text-align: right;">${num1}</td>
        <td style="text-align: right;">&nbsp;</td>
        <td style="text-align: right;">${num1}</td>
         <td style="text-align: right;">&nbsp;</td>
        <td style="text-align: right;">${num1}</td>
      </tr>
      <tr>
        <td style="text-align: right; border-bottom: 1px solid black;">× ${onesPlaceNum2}</td>
         <td style="text-align: right;">&nbsp;</td>
        <td style="text-align: right; border-bottom: 1px solid black;">× ${tensPlaceNum2}0</td>
         <td style="text-align: right;">&nbsp;</td>
        <td style="text-align: right; border-bottom: 1px solid black;">x ${num2}</td>
      </tr>
      <tr>
        <td style="text-align: right;">${multiplicationStep1}</td>
         <td style="text-align: right;">&nbsp;</td>
        <td style="text-align: right;">${multiplicationStep2}0</td>
         <td style="text-align: right;">&nbsp;</td>
        <td style="text-align: right;">${multiplicationStep1}</td>
      </tr>
      <tr>
        <td style="text-align: right;">&nbsp;</td>
        <td style="text-align: right;">&nbsp;</td>
        <td style="text-align: right;">&nbsp;</td>
        <td style="text-align: right;">&nbsp;</td>
        <td style="text-align: right; border-bottom: 1px solid black;">+ ${multiplicationStep2}0</td>
      </tr>
      <tr>
       
        <td style="text-align: right;">&nbsp;</td>
         <td style="text-align: right;">&nbsp;</td>
         <td style="text-align: right;">&nbsp;</td>
        <td style="text-align: right;">&nbsp;</td>
        <td style="text-align: right;">${
          multiplicationStep1 + multiplicationStep2 * 10
        }</td>
      </tr>
    </table>`;

  const product = num1 * num2;

  const validateFn = (userInput: string) => {
    const isCorrect = parseFloat(userInput) === product;

    return isCorrect;
  };

  return new Problem(`${num1} × ${num2}`, product.toString(), validateFn, hint);
}

export function generateDivisionProblem() {
  const num1 = Math.floor(Math.random() * 899) + 100; // Random number between 100 and 998
  const num2 = Math.floor(Math.random() * 14) + 5; // Random number between 5 and 18

  // Randomly decide to round to the nearest tenth or hundredth
  const roundingType = Math.floor(Math.random() * 2); // 0 for tenth, 1 for hundredth
  let answer: number;
  let roundingInstruction;

  if (roundingType === 0) {
    // Round to the nearest tenth
    answer = parseFloat((num1 / num2).toFixed(1));
    roundingInstruction = 'Round your answer to the nearest tenth.';
  } else {
    // Round to the nearest hundredth
    answer = parseFloat((num1 / num2).toFixed(2));
    roundingInstruction = 'Round your answer to the nearest hundredth.';
  }

  const question = `What is ${num1} divided by ${num2}? ${roundingInstruction}`;
  // Calculate the whole number part of the division
  const wholeNumberPart = Math.floor(num1 / num2);

  // Calculate the fractional part of the division
  const fractionalPart = num1 / num2 - wholeNumberPart;

  // Determine the rounding precision based on the rounding type
  const roundingPrecision = roundingType === 0 ? 1 : 2;

  // Round the fractional part to the correct precision
  const roundedFractionalPart = parseFloat(
    fractionalPart.toFixed(roundingPrecision)
  );

  // Convert the fractional part to a string without a leading zero
  const fractionalString =
    roundedFractionalPart === 0
      ? ''
      : roundedFractionalPart.toString().slice(1);

  const hint = `
    <table style="border-collapse: collapse;">
        <tr>
            <td style="text-align: right;">&nbsp;</td>
            <td style="text-align: right;">${wholeNumberPart}</td>
            <td style="text-align: left;">${fractionalString}</td>
                
                
                
            </tr>
            <tr>
                <td style="border-right: 1px solid black;">${num2}</td>
                <td style="border-top: 1px solid black;">${num1}</td>
                
               
            </tr>
            <tr>
                
        </table>
       <br> ${roundingInstruction}
    `;

  // Adjust the validateFn to properly handle both correct and incorrect answers
  const validateFn = (userInput: string) => {
    const parsedInput = parseFloat(userInput);
    const comparisonPrecision = roundingType === 0 ? 1 : 2; // Determine the precision based on the rounding type
    const isCorrect =
      parsedInput.toFixed(comparisonPrecision) ===
      answer.toFixed(comparisonPrecision);

    return isCorrect;
  };

  return new Problem(question, answer.toString(), validateFn, hint);
}

export function generateWholeTimesMixedProblem() {
  // Generate a whole number between 2 and 10
  const wholeNumberM = Math.floor(Math.random() * 9) + 2;

  // Generate components of the mixed fraction
  const mixedWhole = Math.floor(Math.random() * 5) + 1; // Whole part of mixed fraction
  const mixedFractionNumerator = Math.floor(Math.random() * 7) + 1; // Numerator
  // Ensure the denominator is greater than the numerator
  const mixedFractionDenominator =
    mixedFractionNumerator +
    Math.floor(Math.random() * (8 - mixedFractionNumerator)) +
    1;

  // Calculate the product of the whole number and the mixed fraction
  const productWholePart = wholeNumberM * mixedWhole;
  const productFractionNumerator = wholeNumberM * mixedFractionNumerator;
  const productFractionDenominator = mixedFractionDenominator;

  // Simplify the fraction part of the product
  const greatestCommonDivisorM = helper.calculateGCF(
    productFractionNumerator,
    productFractionDenominator
  );
  const simplifiedNumeratorM =
    productFractionNumerator / greatestCommonDivisorM;
  const simplifiedDenominatorM =
    productFractionDenominator / greatestCommonDivisorM;

  // Convert to a mixed number if the numerator is greater than the denominator
  const additionalWholePart = Math.floor(
    simplifiedNumeratorM / simplifiedDenominatorM
  );
  const remainingNumeratorM = simplifiedNumeratorM % simplifiedDenominatorM;
  // Correctly calculate the total whole part by adding the productWholePart with additionalWholePart only once
  const totalWholePart = productWholePart + additionalWholePart;
  const finalAnswer =
    remainingNumeratorM > 0
      ? `${totalWholePart} ${remainingNumeratorM}/${simplifiedDenominatorM}`
      : `${totalWholePart}`;

  // Construct the question using the provided variables
  const questionM = `Multiply the whole number by the mixed fraction: ${wholeNumberM} × ${mixedWhole}<span class="frac"><sup>${mixedFractionNumerator}</sup><span>&frasl;</span><sub>${mixedFractionDenominator}</sub></span>`;

  // Update hint to include conversion and simplification steps
  const hintM = `<table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>
            ${wholeNumberM}&bull;${mixedWhole}<span class="frac"><sup>${mixedFractionNumerator}</sup><span>&frasl;</span><sub>${mixedFractionDenominator}</sub></span>
        </td>
        <td>
            Break apart the mixed number.
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            ${wholeNumberM}(${mixedWhole} + <span class="frac"><sup>${mixedFractionNumerator}</sup><span>&frasl;</span><sub>${mixedFractionDenominator}</sub></span>)
        </td>
        <td>
            Distribute the multiplication over the mixed number.
        </td>
    </tr>
    <tr>
        <td>3</td>
        <td>
            ${wholeNumberM}&bull;${mixedWhole} + ${wholeNumberM}&bull;<span class="frac"><sup>${mixedFractionNumerator}</sup><span>&frasl;</span><sub>${mixedFractionDenominator}</sub></span>
        </td>
        <td>
            Multiply each part of the mixed number by the whole number.
        </td>
    </tr>
    <tr>
        <td>4</td>
        <td>
            ${productWholePart} + <span class="frac"><sup>${productFractionNumerator}</sup><span>&frasl;</span><sub>${productFractionDenominator}</sub></span>
        </td>
        <td>
            Multiply to find the product of the whole number and the mixed number parts.
        </td>
    </tr>
    <tr>
        <td>5</td>
        <td>
            ${productWholePart} + ${additionalWholePart}<span class="frac"><sup>${remainingNumeratorM}</sup><span>&frasl;</span><sub>${simplifiedDenominatorM}</sub></span>
        </td>
        <td>
            Convert the improper fraction to a mixed number and simplify if possible.
        </td>
    </tr>
    <tr>
        <td>6</td>
        <td>
            ${
              productWholePart + additionalWholePart
            } + <span class="frac"><sup>${remainingNumeratorM}</sup><span>&frasl;</span><sub>${simplifiedDenominatorM}</sub></span>
        </td>
        <td>
            Add the whole numbers to complete the multiplication.
        </td>
    </tr>
</table>
`;

  // Validation function to check the user's answer
  const validateFn = (userInput: string) => {
    // Standardize user input and define regex to extract potential whole number and fraction parts
    const inputRegex = /^(\d+)(?:\s+(\d+)\/(\d+))?$/;
    const match = userInput.match(inputRegex);

    // Ensure the input matches expected format
    if (!match) {
      return false;
    }

    const inputWholeNumber = parseInt(match[1], 10);
    const inputNumerator = match[2] ? parseInt(match[2], 10) : 0;
    const inputDenominator = match[3] ? parseInt(match[3], 10) : 1;

    // Compute the validity of the user's input
    const isCorrect =
      inputWholeNumber === totalWholePart &&
      inputNumerator === remainingNumeratorM &&
      inputDenominator === simplifiedDenominatorM;

    // Provide feedback based on the correctness of the answer

    return isCorrect;
  };

  return new Problem(questionM, finalAnswer, validateFn, hintM);
}

// TODO: This function is not correctly structured
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

export function generateMeanProblem() {
  const numbersForMean = Array.from(
    {
      length: 5 + Math.floor(Math.random() * 5),
    },
    () => Math.floor(Math.random() * 20) + 1
  );
  const mean =
    numbersForMean.reduce((a, b) => a + b, 0) / numbersForMean.length;

  const hint = `To find the mean (average) of a set of numbers, add all the numbers together and then divide by the number of numbers.`;

  const validateFn = (userInput: string) => {
    const userAnswer = parseFloat(userInput).toFixed(2);
    const correctAnswer = mean.toFixed(2);
    const isCorrect = userAnswer === correctAnswer;

    return isCorrect;
  };

  const question = `Find the mean of these numbers: ${numbersForMean.join(
    ', '
  )}. Round your answer to the nearest hundredth.`;
  const answer = mean.toFixed(2);

  return new Problem(question, answer, validateFn, hint);
}

export function generateMedianProblem() {
  const numbersForMedian = Array.from(
    {
      length: 5 + Math.floor(Math.random() * 5),
    },
    () => Math.floor(Math.random() * 20) + 1
  ).sort((a, b) => a - b);
  const midIndex = Math.floor(numbersForMedian.length / 2);
  const median =
    numbersForMedian.length % 2 !== 0
      ? numbersForMedian[midIndex]
      : (numbersForMedian[midIndex - 1] + numbersForMedian[midIndex]) / 2;

  const hint = `To find the median, sort the numbers and find the middle value (or the average of the two middle values if there's an even number of numbers).`;

  const validateFn = (userInput: string) => {
    const userAnswer = parseFloat(userInput);
    const isCorrect =
      numbersForMedian.length % 2 !== 0
        ? userAnswer === median
        : userAnswer.toFixed(2) === median.toFixed(2);

    return isCorrect;
  };

  const question = `Find the median of these numbers: ${numbersForMedian.join(
    ', '
  )}.`;
  const answer = median.toFixed(2);

  return new Problem(question, answer, validateFn, hint);
}

export function generateModeProblem() {
  const numbersForMode = Array.from(
    {
      length: 5 + Math.floor(Math.random() * 5),
    },
    () => Math.floor(Math.random() * 20) + 1
  );

  const frequency = numbersForMode.reduce(
    (acc: { [key: number]: number }, num: number) => {
      acc[num] = (acc[num] || 0) + 1;
      return acc;
    },
    {}
  );

  const maxFreq = Math.max(...Object.values(frequency));

  const mode = Object.keys(frequency).filter(
    (num) => frequency[+num] === maxFreq
  );

  const hint = `To find the mode, determine which number(s) appear most frequently.`;

  const validateFn = (userInput: string) => {
    const userAnswers = userInput.split(',').map((num) => num.trim());
    const correctAnswers = mode.map(String).sort();
    const isCorrect =
      userAnswers.length === correctAnswers.length &&
      userAnswers.every((value, index) => value === correctAnswers[index]);

    return isCorrect;
  };

  const question = `Find the mode of these numbers: ${numbersForMode.join(
    ', '
  )}.`;
  const answer = mode.join(', ');

  return new Problem(question, answer, validateFn, hint);
}

export function generateRangeProblem() {
  const numbersForRange = Array.from(
    {
      length: 5 + Math.floor(Math.random() * 5),
    },
    () => Math.floor(Math.random() * 20) + 1
  );
  const minNum = Math.min(...numbersForRange);
  const maxNum = Math.max(...numbersForRange);
  const range = maxNum - minNum;

  const hint = `The range of a set of numbers is the difference between the largest and smallest numbers.`;

  const validateFn = (userInput: string) => {
    const userAnswer = parseInt(userInput, 10);
    const isCorrect = userAnswer === range;

    return isCorrect;
  };

  const question = `Find the range of these numbers: ${numbersForRange.join(
    ', '
  )}.`;
  const answer = range.toString();

  return new Problem(question, answer, validateFn, hint);
}

export function generateFirstQuartileProblem() {
  const numbersForQ1 = Array.from(
    {
      length: 7 + Math.floor(Math.random() * 5),
    },
    () => Math.floor(Math.random() * 20) + 1
  ).sort((a, b) => a - b);
  const q1Index = Math.floor((numbersForQ1.length - 1) / 4);
  const q1 = numbersForQ1[q1Index];

  const hint = `Q1 is the median of the lower half of the data set (not including the median if the number of observations is odd).`;

  const validateFn = (userInput: string) => {
    const userAnswer = parseFloat(userInput);
    const isCorrect = userAnswer === q1;

    return isCorrect;
  };

  const question = `Find the first quartile (Q1) of these numbers: ${numbersForQ1.join(
    ', '
  )}.`;
  const answer = q1.toString();

  return new Problem(question, answer, validateFn, hint);
}

export function generateThirdQuartileProblem() {
  const numbersForQ3 = Array.from(
    {
      length: 7 + Math.floor(Math.random() * 5),
    },
    () => Math.floor(Math.random() * 20) + 1
  ).sort((a, b) => a - b);
  const q3Index = Math.ceil((3 * (numbersForQ3.length - 1)) / 4);
  const q3 = numbersForQ3[q3Index];

  const hint = `Q3 is the median of the upper half of the data set (not including the median if the number of observations is odd).`;

  const validateFn = (userInput: string) => {
    const userAnswer = parseFloat(userInput);
    const isCorrect = userAnswer === q3;

    return isCorrect;
  };

  const question = `Find the third quartile (Q3) of these numbers: ${numbersForQ3.join(
    ', '
  )}.`;
  const answer = q3.toString();

  return new Problem(question, answer, validateFn, hint);
}

export function generateInterquartileRangeProblem() {
  const numbersForIQR = Array.from(
    {
      length: 7 + Math.floor(Math.random() * 5),
    },
    () => Math.floor(Math.random() * 20) + 1
  ).sort((a, b) => a - b);
  const q1Index = Math.floor((numbersForIQR.length - 1) / 4);
  const q3Index = Math.ceil((3 * (numbersForIQR.length - 1)) / 4);
  const q1 = numbersForIQR[q1Index];
  const q3 = numbersForIQR[q3Index];
  const iqr = q3 - q1;

  const hint = `The interquartile range (IQR) is the difference between the third quartile (Q3) and the first quartile (Q1).`;

  const validateFn = (userInput: string) => {
    const userAnswer = parseFloat(userInput);
    const isCorrect = userAnswer === iqr;

    return isCorrect;
  };

  const question = `Find the interquartile range (IQR) of these numbers: ${numbersForIQR.join(
    ', '
  )}.`;
  const answer = iqr.toString();

  return new Problem(question, answer, validateFn, hint);
}

export function generateRoundingProblem() {
  const roundTypes = ['tens', 'hundreds', 'thousands', 'tenths', 'hundredths'];
  const roundType = roundTypes[Math.floor(Math.random() * roundTypes.length)];

  let num;

  if (
    roundType === 'hundreds' ||
    roundType === 'thousands' ||
    roundType === 'tens'
  ) {
    num = Math.floor(Math.random() * 9000) + 1000; // Ensuring a sufficiently large number for rounding
  } else {
    const decimalPlaces = roundType === 'tenths' ? 1 : 2; // Decide on decimal places based on the rounding type
    num = +(Math.random() * 10).toFixed(decimalPlaces);
  }

  const numStr = num.toString();
  let placeValueDigit = '';
  let nextDigit = '';
  let roundingPosition;

  switch (roundType) {
    case 'tens':
      roundingPosition = numStr.length - 2;
      break;
    case 'hundreds':
      roundingPosition = numStr.length - 3;
      break;
    case 'thousands':
      roundingPosition = numStr.length - 4;
      break;
    case 'tenths':
      roundingPosition = numStr.indexOf('.') + 1;
      break;
    case 'hundredths':
      roundingPosition = numStr.indexOf('.') + 2;
      break;
    default:
      roundingPosition = -1;
  }

  if (roundingPosition >= 0 && roundingPosition < numStr.length) {
    placeValueDigit = numStr[roundingPosition];
    nextDigit =
      roundingPosition + 1 < numStr.length ? numStr[roundingPosition + 1] : '0';
  }

  function roundNumber(number: number, type: string) {
    switch (type) {
      case 'tens':
        return Math.round(number / 10) * 10;
      case 'hundreds':
        return Math.round(number / 100) * 100;
      case 'thousands':
        return Math.round(number / 1000) * 1000;
      case 'tenths':
        return Number(number).toFixed(1);
      case 'hundredths':
        return Number(number).toFixed(2);
      default:
        return number; // No rounding if type is not recognized
    }
  }

  const roundedNum = roundNumber(num, roundType).toString();
  const question = `Round ${num} to the nearest ${roundType}`;

  const hint =
    `1. Identify the place value you're rounding to.<br>` +
    `2. Look at the next digit to the right. If it's 5 or more, round up. If it's less than 5, round down.<br>` +
    `3. Replace the digits to the right of the place value with zeros.<br>` +
    `<br>In ${num}, the digit in the ${roundType} place is ${placeValueDigit}, and the next digit is ${nextDigit} ` +
    `Rounding ${num} to the nearest ${roundType} gives ${roundedNum}.`;

  const validateFn = (userInput: string) => {
    const standardizedInput = userInput.trim();
    const isCorrect = standardizedInput === roundedNum;
    // Updates UI based on correctness
    return isCorrect;
  };

  return new Problem(question, roundedNum, validateFn, hint);
}

export function generatePercentDecimalQuestion() {
  const convertToDecimal = Math.random() < 0.5;
  let question;
  let answer: string;
  let hint;

  if (convertToDecimal) {
    const percent = Math.floor(Math.random() * 200) + 1;
    question = `Convert ${percent}% to decimal`;
    answer = (percent / 100).toFixed(2);
    hint = `To convert a percent to a decimal, divide by 100
          <br><br> ${percent}%&divide;100 = ${answer}.`;
  } else {
    const decimal = Number((Math.random() * 1).toFixed(2));
    question = `Convert ${decimal} to percent`;
    answer = `${(decimal * 100).toFixed(0)}%`;
    hint = `To convert a decimal to a percent, multiply by 100.
          <br><br> ${decimal} &bull; 100 = ${answer}.`;
  }

  // Validation function to compare user input with the answer
  const validateFn = (userInput: string) => {
    const standardizedInput = convertToDecimal
      ? parseFloat(userInput).toFixed(2)
      : userInput.trim();
    const isCorrect = standardizedInput === answer;
    // Make sure to call this for incorrect answers too
    return isCorrect;
  };

  return new Problem(question, answer, validateFn, hint);
}

export function generateConvertQuestion() {
  const convertToFraction = Math.random() < 0.5;
  let question;
  let answer: string;
  let answerType: string;
  let hint;

  if (convertToFraction) {
    const decimal = parseFloat(Math.random().toFixed(2));
    const placeValue = decimal.toString().split('.')[1].length;
    const denominator = 10 ** placeValue;
    const numerator = Math.round(decimal * denominator);
    const simplified = helper.simplifyFraction(numerator, denominator);
    question = `Convert ${decimal} to a fraction`;
    answer = `${simplified.numerator}/${simplified.denominator}`;
    answerType = 'fraction';
    // Modified hint to format the answer in the question style
    hint = `<table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>
            ${decimal} = <span class="frac"><sup>${numerator}</sup><span>&frasl;</span><sub>${denominator}</sub></span>
        </td>
        <td>
        Recognize that the farthest digit in ${decimal} is in the ${
      denominator === 100 ? 'hundredths' : 'tenths'
    } place.
            
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            <span class="frac"><sup>${numerator}</sup><span>&frasl;</span><sub>${denominator}</sub></span> = <span class="frac"><sup>${
      simplified.numerator
    }</sup><span>&frasl;</span><sub>${simplified.denominator}</sub></span>
        </td>
        <td>
            Simplify the fraction if possible.
        </td>
    </tr>
</table>`;
  } else {
    const denominator = Math.floor(Math.random() * 9) + 2; // Ensure denominator is not 1
    const numerator = Math.floor(Math.random() * (denominator - 1)) + 1; // Ensure numerator is less than denominator
    question = `Convert <span class="frac"><sup>${numerator}</sup><span>&frasl;</span><sub>${denominator}</sub></span> to a decimal`;
    answer = (numerator / denominator).toFixed(2);
    answerType = 'decimal';
    hint = `Hint: To convert the fraction <span class="frac"><sup>${numerator}</sup><span>&frasl;</span><sub>${denominator}</sub></span> to a decimal, divide the numerator (${numerator}) by the denominator (${denominator}). The result is ${answer}.`;
  }

  // Validation function to compare user input with the answer
  const validateFn = (userInput: string) => {
    const isCorrect =
      answerType === 'decimal'
        ? parseFloat(userInput).toFixed(2) === answer
        : userInput.trim() === answer;

    return isCorrect;
  };

  return new Problem(question, answer, validateFn, hint);
}

// Simplify fraction utility function

export function generatePercentOfNumberProblem() {
  const percent = Math.floor(Math.random() * 125) + 1; // 1 to 125 percent
  const number = Math.floor(Math.random() * 100) + 1; // 1 to 100 for number
  const answer = parseFloat(((percent / 100) * number).toFixed(2));

  // Hint explaining the steps to find the percentage of a number
  const hint = `To find ${percent}% of ${number}: <br><br><table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>
            ${percent}% &divide; 100 = ${percent / 100}
        </td>
        <td>
            Convert the percent to a decimal.
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            ${percent / 100} &bull; ${number} = ${answer}
        </td>
        <td>
            Multiply the decimal by the number to find ${percent}% of ${number}.
        </td>
    </tr>
</table>
`;

  // Validation function to compare user input with the correct answer
  const validateFn = (userInput: string) => {
    const isCorrect = parseFloat(userInput).toFixed(2) === answer.toString();

    return isCorrect;
  };

  const question = `What is ${percent}% of ${number}?`;

  return new Problem(question, answer.toString(), validateFn, hint);
}

export function generateComparisonQuestion() {
  const currentType = Math.random() < 0.5 ? 'fraction' : 'decimal';
  let question;
  let answer: string;

  // Helper functions for comparing fractions and decimals

  // eslint-disable-next-line no-nested-ternary
  const compareDecimals = (num1: number, num2: number): string => {
    if (num1 > num2) {
      return '>';
    } if (num1 < num2) {
      return '<';
    } 
      return '=';
  };

  if (currentType === 'fraction') {
    const numerator = Math.floor(Math.random() * 9) + 1;
    const denominator = Math.floor(Math.random() * (9 - numerator)) + numerator; // Ensure fraction is <= 1
    const numerator2 = Math.floor(Math.random() * 9) + 1;
    const denominator2 =
      Math.floor(Math.random() * (9 - numerator2)) + numerator2;
    question = `Choose >, <, or =: <span class="frac"><sup>${numerator}</sup><span>&frasl;</span><sub>${denominator}</sub></span> ____ <span class="frac"><sup>${numerator2}</sup><span>&frasl;</span><sub>${denominator2}</sub></span>`;
    answer = helper.compareFractions(
      numerator,
      denominator,
      numerator2,
      denominator2
    );
  } else {
    const num1 = parseFloat(Math.random().toFixed(2));
    const num2 = parseFloat(Math.random().toFixed(2));
    question = `Choose >, <, or =: ${num1} ____ ${num2}`;
    answer = compareDecimals(num1, num2);
  }

  const hint = `Consider converting fractions to decimals for an easier comparison, or directly compare the decimal values.`;
  // Validation function to check user's input
  const validateFn = (userInput: string) => {
    const isCorrect = userInput === answer;

    return isCorrect;
  };

  return new Problem(question, answer, validateFn, hint);
}

export function generateDivideFractionsProblem() {
  const numerator1 = Math.floor(Math.random() * 8) + 1; // 1 to 8
  const denominator1 =
    Math.floor(Math.random() * (8 - numerator1)) + numerator1 + 1; // Ensuring fraction is < 1

  const numerator2 = Math.floor(Math.random() * 8) + 1; // 1 to 8
  const denominator2 =
    Math.floor(Math.random() * (8 - numerator2)) + numerator2 + 1; // Ensuring fraction is < 1

  // Multiply the first fraction by the reciprocal of the second
  const productNumerator = numerator1 * denominator2;
  const productDenominator = denominator1 * numerator2;

  // Simplify the fraction
  const simplifiedAnswer = helper.simplifyFraction(
    productNumerator,
    productDenominator
  );

  // Check if it's an improper fraction and convert to mixed number if necessary
  const wholePart = Math.floor(
    simplifiedAnswer.numerator / simplifiedAnswer.denominator
  );
  const remainingNumerator =
    simplifiedAnswer.numerator % simplifiedAnswer.denominator;
  let answer: string;
  if (wholePart > 0 && remainingNumerator > 0) {
    answer = `${wholePart} ${remainingNumerator}/${simplifiedAnswer.denominator}`;
  } else if (wholePart > 0) {
    answer = `${wholePart}`;
  } else {
    answer = `${simplifiedAnswer.numerator}/${simplifiedAnswer.denominator}`;
  }

  const question = `Divide <span class="frac"><sup>${numerator1}</sup><span>&frasl;</span><sub>${denominator1}</sub></span> &divide; <span class="frac"><sup>${numerator2}</sup><span>&frasl;</span><sub>${denominator2}</sub></span>, and write your answer as a simplified fraction or a mixed number.`;

  // Include conversion to mixed number in the hint if applicable
  let hint = `<table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>
            <span class="frac"><sup>${numerator1}</sup><span>&frasl;</span><sub>${denominator1}</sub></span> &divide; 
            <span class="frac"><sup>${numerator2}</sup><span>&frasl;</span><sub>${denominator2}</sub></span>
        </td>
        <td>
            Starting expression for division of fractions.
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            <span class="frac"><sup>${numerator1}</sup><span>&frasl;</span><sub>${denominator1}</sub></span> &bull; 
            <span class="frac"><sup>${denominator2}</sup><span>&frasl;</span><sub>${numerator2}</sub></span>
        </td>
        <td>
            Multiply by the reciprocal of the second fraction.
        </td>
    </tr>
    <tr>
        <td>3</td>
        <td>
            <span class="frac"><sup>${numerator1} &bull; ${denominator2}</sup><span>&frasl;</span><sub>${denominator1} &bull; ${numerator2}</sub></span> = 
            <span class="frac"><sup>${
              numerator1 * denominator2
            }</sup><span>&frasl;</span><sub>${
    denominator1 * numerator2
  }</sub></span>
        </td>
        <td>
            Perform the multiplication to find the product.
        </td>
    </tr>
    <tr>
        <td>4</td>
        <td>
            <span class="frac"><sup>${
              numerator1 * denominator2
            }</sup><span>&frasl;</span><sub>${
    denominator1 * numerator2
  }</sub></span> = 
            <span class="frac"><sup>${
              simplifiedAnswer.numerator
            }</sup><span>&frasl;</span><sub>${
    simplifiedAnswer.denominator
  }</sub></span>
        </td>
        <td>
            Simplify the fraction if possible.
        </td>
    </tr>
`;
  if (wholePart > 0 && remainingNumerator > 0) {
    hint += `<tr>
        <td>5</td>
        <td>
            <span class="frac"><sup>${simplifiedAnswer.numerator}</sup><span>&frasl;</span><sub>${simplifiedAnswer.denominator}</sub></span> = ${answer}
        </td>
        <td>
            Convert to a mixed number if the fraction is improper.
        </td>
    </tr>
</table>`;
  }

  const validateFn = (userInput: string) => {
    const isCorrect = userInput.trim() === answer;

    return isCorrect;
  };

  return new Problem(question, answer, validateFn, hint);
}

export function generateMixedToImproperProblem() {
  const whole = Math.floor(Math.random() * 5) + 1;
  const fractionNumerator = Math.floor(Math.random() * 8) + 1;
  const fractionDenominator =
    Math.floor(Math.random() * (8 - fractionNumerator)) + fractionNumerator + 1;
  const improperNumerator = whole * fractionDenominator + fractionNumerator;

  // Assume simplifyFraction function returns an object with the simplified fraction and a flag indicating if simplification was done
  const simplified = helper.simplifyFraction(
    improperNumerator,
    fractionDenominator
  );
  const needsSimplification =
    simplified.numerator !== improperNumerator ||
    simplified.denominator !== fractionDenominator;

  const question = `Convert ${whole}<span class="frac"><sup>${fractionNumerator}</sup><span>&frasl;</span><sub>${fractionDenominator}</sub></span> to a simplified improper fraction`;

  let hint = `<table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>
            ${whole} = <span class="frac"><sup>${
    whole * fractionDenominator
  }</sup><span>&frasl;</span><sub>${fractionDenominator}</sub></span>
        </td>
        <td>
            Convert the whole number to a fraction.
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            <span class="frac"><sup>${
              whole * fractionDenominator
            }</sup><span>&frasl;</span><sub>${fractionDenominator}</sub></span>+<span class="frac"><sup>${fractionNumerator}</sup><span>&frasl;</span><sub>${fractionDenominator}</sub></span> = <span class="frac"><sup>${improperNumerator}</sup><span>&frasl;</span><sub>${fractionDenominator}</sub></span>
        </td>
        <td>
            Add the fractions.
        </td>
    </tr>
    <tr>
        <td>3</td>
        <td>
            <span class="frac"><sup>${improperNumerator}</sup><span>&frasl;</span><sub>${fractionDenominator}</sub></span>
        </td>
        <td>
            The result is an improper fraction.
        </td>
    </tr>
`;

  if (needsSimplification) {
    hint += `<tr>
        <td>4</td>
        <td>
            <span class="frac"><sup>${improperNumerator}</sup><span>&frasl;</span><sub>${fractionDenominator}</sub></span>=<span class="frac"><sup>${simplified.numerator}</sup><span>&frasl;</span><sub>${simplified.denominator}</sub></span>
        </td>
        <td>
            Simplify the fraction if possible.
        </td>
    </tr>
</table>`;
  }

  const answer = `${simplified.numerator}/${simplified.denominator}`;

  const validateFn = (userInput: string) => {
    // Enhance validation to accept simplified answers
    const inputFraction = userInput.trim().split('/');
    const simplifiedInput = helper.simplifyFraction(
      parseInt(inputFraction[0], 10),
      parseInt(inputFraction[1], 10)
    );
    const isCorrect =
      simplifiedInput.numerator === simplified.numerator &&
      simplifiedInput.denominator === simplified.denominator;

    return isCorrect;
  };

  return new Problem(question, answer, validateFn, hint);
}

export function generateImproperToMixedProblem() {
  const denominator = Math.floor(Math.random() * 9) + 1;
  let numerator;
  let remainingNumerator;
  do {
    numerator = Math.floor(Math.random() * 30) + 10;
    remainingNumerator = numerator % denominator;
  } while (remainingNumerator === 0);

  const wholePart = Math.floor(numerator / denominator);

  const question = `Convert <span class="frac"><sup>${numerator}</sup><span>&frasl;</span><sub>${denominator}</sub></span> to a mixed number`;
  const answer = `${wholePart} ${remainingNumerator}/${denominator}`;
  const hint = `
        <table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>
            <div style="text-align: center;">
                ${numerator} ÷ ${denominator}
            </div>
            <div style="border-top: 1px solid black; margin-top: 5px; text-align: center;">
                ${Math.floor(numerator / denominator)}
            </div>
        </td>
        <td>
            Divide the numerator (${numerator}) by the denominator (${denominator}).<br>
            How many whole groups of (${denominator}) can you make with (${numerator}) parts.
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            Remainder: ${numerator % denominator}
        </td>
        <td>
            The quotient is the whole number part, and the remainder is the new numerator over the original denominator.<br>
            How many of the (${numerator}) parts are left after making whole groups gives you the fractional part.
        </td>
    </tr>
</table>
`;

  const validateFn = (userInput: string) => {
    // Enhance this function as needed to accurately validate user input
    const isCorrect = userInput.trim() === answer;

    return isCorrect;
  };

  return new Problem(question, answer, validateFn, hint);
}

export function generateAddSubtractMixedProblem() {
  const isAddition = Math.random() < 0.5;
  let whole1 = Math.floor(Math.random() * 8) + 3;
  const fractionNumerator1 = Math.floor(Math.random() * 7) + 1;
  const fractionDenominator1 =
    fractionNumerator1 +
    Math.floor(Math.random() * (7 - fractionNumerator1)) +
    1;
  const originalWhole1 = whole1;

  const whole2 = Math.floor(Math.random() * (whole1 - 1)) + 1;
  const fractionNumerator2 = Math.floor(Math.random() * 7) + 1;
  const fractionDenominator2 =
    fractionNumerator2 +
    Math.floor(Math.random() * (7 - fractionNumerator2)) +
    1;

  // Calculate the improper numerators for the fractions
  const improperNumerator1 = whole1 * fractionDenominator1 + fractionNumerator1;
  const improperNumerator2 = whole2 * fractionDenominator2 + fractionNumerator2;

  const commonDenominator = helper.lcm(
    fractionDenominator1,
    fractionDenominator2
  );
  let adjustedNumerator1 =
    fractionNumerator1 * (commonDenominator / fractionDenominator1);
  const originaladjustedNumerator1 = adjustedNumerator1;
  const adjustedNumerator2 =
    fractionNumerator2 * (commonDenominator / fractionDenominator2);

  if (!isAddition && adjustedNumerator1 < adjustedNumerator2) {
    whole1 -= 1;
    adjustedNumerator1 += commonDenominator;
  }

  const resultFractionNumerator = isAddition
    ? adjustedNumerator1 + adjustedNumerator2
    : adjustedNumerator1 - adjustedNumerator2;

  const gcdResult = helper.calculateGCF(
    resultFractionNumerator,
    commonDenominator
  );
  const simplifiedNumerator = resultFractionNumerator / gcdResult;
  const simplifiedDenominator = commonDenominator / gcdResult;

  const resultWhole = isAddition ? whole1 + whole2 : whole1 - whole2;

  // Calculate the final gcd for further simplification if needed
  const finalGcd = helper.calculateGCF(
    simplifiedNumerator,
    simplifiedDenominator
  );
  let finalNumerator = simplifiedNumerator / finalGcd;
  const finalDenominator = simplifiedDenominator / finalGcd;

  // Determine if there's a whole part in the final answer
  const finalWholePart = Math.floor(finalNumerator / finalDenominator);
  finalNumerator %= finalDenominator;

  // Adjust answer formatting based on whether the numerator is 0
  let answer: string;
  if (finalNumerator === 0) {
    answer = `${resultWhole}`;
  } else {
    const resultWholeAndSpace = `${resultWhole} `;
    answer = `${
      resultWhole > 0 ? resultWholeAndSpace : ''
    }${finalNumerator}/${finalDenominator}`;
  }

  const question = `${originalWhole1}<sup>${fractionNumerator1}</sup>/<sub>${fractionDenominator1}</sub> ${
    isAddition ? '+' : '-'
  } ${whole2}<sup>${fractionNumerator2}</sup>/<sub>${fractionDenominator2}</sub>`;

  function getNumeratorMessage(): string {
    if (isAddition) {
      return '';
    }
    if (originaladjustedNumerator1 < adjustedNumerator2) {
      return `Borrow from the whole and add it to the numerator <br><br>${originalWhole1} :`;
    }
    return '';
  }

  // Usage in a template string

  const hint = `<table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step ${
          originaladjustedNumerator1 < adjustedNumerator2 && !isAddition
            ? '5'
            : '4'
        }</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>
             Given <span class="frac"><sup>${fractionNumerator1}</sup><span>&frasl;</span><sub>${fractionDenominator1}</sub></span> and
              <span class="frac"><sup>${fractionNumerator2}</sup><span>&frasl;</span><sub>${fractionDenominator2}</sub></span> <br> LCM =  ${commonDenominator}
        </td>
        <td>
            Find a common denominator for ${fractionDenominator1} and ${fractionDenominator2} <br> LCM = ${commonDenominator} 
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
             <span class="frac"><sup>${fractionNumerator1}  &bull;  ${
    commonDenominator / fractionDenominator1
  }</sup><span>&frasl;</span><sub>${fractionDenominator1}  &bull;  ${
    commonDenominator / fractionDenominator1
  }</sub></span> = <span class="frac"><sup>${originaladjustedNumerator1}</sup><span>&frasl;</span><sub>${commonDenominator}</sub></span> <br><br>
             <span class="frac"><sup>${fractionNumerator2}  &bull;  ${
    commonDenominator / fractionDenominator2
  }</sup><span>&frasl;</span><sub>${fractionDenominator2}  &bull;  ${
    commonDenominator / fractionDenominator2
  }</sub></span> = <span class="frac"><sup>${adjustedNumerator2}</sup><span>&frasl;</span><sub>${commonDenominator}</sub></span>
        <td>
           Multiply the numerator and denominator of each fraction so the denominator is ${commonDenominator}
        </td>
    </tr>
    <tr>
        <td>3</td>
        <td>
            ${
              // eslint-disable-next-line no-nested-ternary
              isAddition
                ? ''
                : originaladjustedNumerator1 < adjustedNumerator2
                ? `Borrow from the whole and add it to the numerator <br><br>${originalWhole1} :`
                : ''
            }
            <br>
            <span class="frac"><sup>${adjustedNumerator1}</sup><span>&frasl;</span><sub>${commonDenominator}</sub></span> ${
    isAddition ? '+' : '-'
  } <span class="frac"><sup>${adjustedNumerator2}</sup><span>&frasl;</span><sub>${commonDenominator}</sub></span>
        </td>
        <td>
            ${
              isAddition ? 'Add' : 'Subtract'
            } the numerators, while the denominator remains the same.
        </td>
    </tr>
    ${
      originaladjustedNumerator1 < adjustedNumerator2 && !isAddition
        ? `
    <tr>
        <td>4</td>
        <td>${getNumeratorMessage()}</td>
    </tr>`
        : ``
    }
    <tr>
        <td>${originaladjustedNumerator1 < adjustedNumerator2 ? '5' : '4'}</td>
        <td>
            Simplified result:<br>
            <span class="frac"><sup>${simplifiedNumerator}</sup><span>&frasl;</span><sub>${commonDenominator}</sub></span>
        </td>
        <td>
            The result of the operation is then simplified, if possible. This step ensures the fraction is in its simplest form, making it easier to understand and work with.
        </td>
    </tr>
</table>





`;

  const validateFn = (userInput: string) => {
    const isCorrect = userInput.trim() === answer;
    return isCorrect;
  };

  return new Problem(question, answer, validateFn, hint);
}

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

// Function to generate hints based on question type
// TODO: Insists on undefined type: fix

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

export function generateWriteEquationProblem() {
  const input1 = Math.floor(Math.random() * 9) + 2;
  const operation1 = Math.floor(Math.random() * 3); // 0 for addition, 1 for subtraction, 2 for multiplication
  const stepValue = Math.floor(Math.random() * 10) + 1;

  let output1;
  let output2;
  let output3;
  if (operation1 === 0) {
    // Addition
    output1 = input1 + stepValue;
    output2 = input1 * 2 + stepValue;
    output3 = input1 * 3 + stepValue;
  } else if (operation1 === 1) {
    // Subtraction
    output1 = input1 - stepValue;
    output2 = input1 * 2 - stepValue;
    output3 = input1 * 3 - stepValue;
  } else {
    // Multiplication
    output1 = stepValue;
    output2 = 2 * stepValue;
    output3 = 3 * stepValue;
  }

  let equation: string;
  if (operation1 === 0 || operation1 === 1) {
    equation = `${input1}n ${operation1 === 0 ? '+' : '-'} ${stepValue} = y`;
  } else {
    equation = `${stepValue}n = y`;
  }

  const question = `
  <style>
      table {
          border-collapse: collapse;
      }
      table, th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: center;
      }
  </style>
  <table>
      <tr>
          <th>n</th>
          <th>  &nbsp; Rule &nbsp;  </th>
          <th>y</th>
      </tr>
      <tr>
          <td>1</td>
          <td></td>
          <td>${output1}</td>
      </tr>
      <tr>
          <td>2</td>
          <td></td>
          <td>${output2}</td>
      </tr>
      <tr>
          <td>3</td>
          <td></td>
          <td>${output3}</td>
      </tr>
  </table>
  Write an equation`;

  const hint = `To solve, decide how y is changing per change in n.
  ${output2} - (${output1}) = ${output2 - output1}     This is the change per n
  ${output2 - output1}n                 Times the change per n `;

  const validateFn = (userInput: string) => {
    // Trim and standardize input for comparison
    const standardizedInput = userInput.replace(/\s+/g, '').toLowerCase();
    const standardizedAnswer = equation.replace(/\s+/g, '').toLowerCase();

    const isCorrect = standardizedInput === standardizedAnswer;

    return isCorrect;
  };

  return new Problem(question, equation, validateFn, hint);
}

export function generateSolveRatioTableProblem() {
  // Generate random numbers for the ratio table
  let num1: number;
  let num2: number;
  let num3;
  let num4: number;
  let num5: number;
  do {
    num1 = Math.floor(Math.random() * 9) + 2;
    num2 = Math.floor(Math.random() * 9) + 2;
    num3 = Math.floor(Math.random() * 9) + 2;
    num4 = Math.floor(Math.random() * 9) + 2;
    num5 = Math.floor(Math.random() * 9) + 2;
  } while (new Set([num1, num2, num3, num4, num5]).size !== 5); // Ensure all numbers are unique

  // Fill in the first column with the generated numbers
  const column1 = [num1 * num3, num2 * num3];

  // Calculate the values for the top spot in columns 2 and 3
  const bottomSpotCol2 = num2 * num4;
  const topSpotCol3 = num1 * num5;

  const question = `
  <style>
      table {
          border-collapse: collapse;
      }
      table, th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: center;
      }
  </style>
  <table>
      <tr>
          <th>Column 10</th>
          <th>Column 2</th>
          <th>Column 3</th>
      </tr>
      <tr>
          <td>${column1[0]}</td>
          <td></td>
          <td>${topSpotCol3}</td>
      </tr>
      <tr>
          <td>${column1[1]}</td>
          <td>${bottomSpotCol2}</td>
          <td></td>
      </tr>
  </table>
  Write the answer for column 2 then column 3 separated by a comma`;

  const answer = `${num1 * num4}, ${num2 * num5}`; // Provide the correct answer in the format "column2,column3"

  const hint = `Treat the columns as equivalent fractions
  <span class="frac"><sup>${column1[0]}</sup><span>&frasl;</span><sub>${column1[1]}</sub></span> = <span class="frac"><sup>__</sup><span>&frasl;</span><sub>${bottomSpotCol2}</sub></span> = <span class="frac"><sup>${topSpotCol3}</sup><span>&frasl;</span><sub>__</sub></span>.
  Find the pattern or ratio that fits these columns to solve for the missing numbers.`;

  const validateFn = (userInput: string) => {
    const parsedInput = userInput.split(',').map((part) => part.trim());
    const isCorrect =
      parsedInput.length === 2 &&
      parsedInput[0] === (num1 * num4).toString() &&
      parsedInput[1] === (num2 * num5).toString();

    return isCorrect;
  };

  return new Problem(question, answer, validateFn, hint);
}

export function generateDivideMixedNumbersProblem() {
  // Generate mixed numbers
  const whole1 = Math.floor(Math.random() * 5) + 1;
  const fractionNumerator1 = Math.floor(Math.random() * 7) + 1;
  const fractionDenominator1 =
    fractionNumerator1 + Math.floor(Math.random() * 8) + 1;

  const whole2 = Math.floor(Math.random() * 5) + 1;
  const fractionNumerator2 = Math.floor(Math.random() * 7) + 1;
  const fractionDenominator2 =
    fractionNumerator2 + Math.floor(Math.random() * 8) + 1;

  // Convert mixed numbers to improper fractions
  const improperNumerator1 = whole1 * fractionDenominator1 + fractionNumerator1;
  const improperDenominator1 = fractionDenominator1;
  const improperNumerator2 = whole2 * fractionDenominator2 + fractionNumerator2;
  const improperDenominator2 = fractionDenominator2;

  // Calculate the result of division
  const answerNumerator = improperNumerator1 * improperDenominator2;
  const answerDenominator = improperDenominator1 * improperNumerator2;
  const simplifiedAnswer = helper.simplifyFraction(
    answerNumerator,
    answerDenominator
  );

  // Question and hint construction
  const question = `Divide the mixed numbers: ${whole1}<span class="frac"><sup>${fractionNumerator1}</sup><span>&frasl;</span><sub>${fractionDenominator1}</sub></span> ÷ ${whole2}<span class="frac"><sup>${fractionNumerator2}</sup><span>&frasl;</span><sub>${fractionDenominator2}</sub></span>`;
  const hint = `<table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>
            Convert ${whole1}<span class="frac"><sup>${fractionNumerator1}</sup><span>&frasl;</span><sub>${fractionDenominator1}</sub></span> to <span class="frac"><sup>${improperNumerator1}</sup><span>&frasl;</span><sub>${improperDenominator1}</sub></span>   <br>
            Convert ${whole2}<span class="frac"><sup>${fractionNumerator2}</sup><span>&frasl;</span><sub>${fractionDenominator2}</sub></span> to <span class="frac"><sup>${improperNumerator2}</sup><span>&frasl;</span><sub>${improperDenominator2}</sub></span>     
        </td>
        <td>
            First, convert the mixed numbers to improper fractions.
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            <span class="frac"><sup>${improperNumerator1}</sup><span>&frasl;</span><sub>${improperDenominator1}</sub></span> &bull; <span class="frac"><sup>${improperDenominator2}</sup><span>&frasl;</span><sub>${improperNumerator2}</sub></span> 
        </td>
        <td>
            Then, flip the second fraction and multiply.
        </td>
    </tr>
    <tr>
        <td>3</td>
        <td>
           <span class="frac"><sup>${improperNumerator1}&bull;${improperDenominator2}</sup><span>&frasl;</span><sub>${improperDenominator1}&bull;${improperNumerator2}</sub></span> = <span class="frac"><sup>${answerNumerator}</sup><span>&frasl;</span><sub>${answerDenominator}</sub></span>      
        </td>
        <td>
            Calculate the multiplication to get the preliminary answer.
        </td>
    </tr>
    <tr>
        <td>4</td>
        <td>
            <span class="frac"><sup>${answerNumerator}</sup><span>&frasl;</span><sub>${answerDenominator}</sub></span> to <span class="frac"><sup>${simplifiedAnswer.numerator}</sup><span>&frasl;</span><sub>${simplifiedAnswer.denominator}</sub></span>         
        </td>
        <td>
            Finally, simplify the result.
        </td>
    </tr>
</table>
`;

  // Validate function tailored to your application
  const validateFn = (userInput: string) => {
    const [userNumerator, userDenominator] = userInput.split('/').map(Number);
    const isCorrect =
      userNumerator === simplifiedAnswer.numerator &&
      userDenominator === simplifiedAnswer.denominator;
    // Adjust according to your feedback mechanism
    return isCorrect;
  };

  return new Problem(
    question,
    `${simplifiedAnswer.numerator}/${simplifiedAnswer.denominator}`,
    validateFn,
    hint
  );
}

export function generateExponent2Problem() {
  let base;
  let numerator;
  let denominator;
  let exponent;
  let answer: string;
  let hint;
  const wasFraction = Math.random() < 0.5;

  if (wasFraction) {
    numerator = Math.floor(Math.random() * 8) + 1;
    denominator = Math.floor(Math.random() * (8 - numerator)) + numerator + 1;
    exponent = Math.floor(Math.random() * 3) + 2;
    const numeratorExponentiated = numerator ** exponent;
    const denominatorExponentiated = denominator ** exponent;
    const simplifiedFraction = helper.simplifyFraction(
      numeratorExponentiated,
      denominatorExponentiated
    );
    base = `${numerator}/${denominator}`;
    answer = `${simplifiedFraction.numerator}/${simplifiedFraction.denominator}`;
    hint = `To calculate ${base}<sup>${exponent}</sup>, raise both the numerator and denominator to the power of ${exponent}, then simplify the fraction if possible.`;
  } else {
    base = (Math.random() * 0.1).toFixed(3);
    exponent = Math.floor(Math.random() * 3) + 2;
    answer = (parseFloat(base) ** exponent).toString();
    hint = `To calculate ${base}<sup>${exponent}</sup>, multiply ${base} by itself ${
      exponent - 1
    } times. Remember, the exponent tells you how many times to use the base as a factor.`;
  }

  const question = `Calculate ${base}<sup>${exponent}</sup>, keeping the answer as a fraction if the base is a fraction.`;

  // Function to simplify fractions

  const validateFn = (userInput: string) => {
    // Comparing strings to avoid floating-point precision issues for decimals
    // For fractions, you may want to parse userInput to compare numerator and denominator separately
    const isCorrect = userInput.trim() === answer;
    // Ensure this function correctly displays hints and updates problem state
    return isCorrect;
  };

  return new Problem(question, answer, validateFn, hint);
}

// Define an object mapping problem types to their generation functions

// TODO: Use as a reference for generating video IDs probably in the Problem class
const problemGenerators = {
  addition: {
    generate: generateAdditionProblem,
    teachingVideoId: 'WwKLA-6S-e0',
    exampleVideoId: '1xXibPhF3bw',
  },
  subtraction: {
    generate: generateSubtractionProblem,
    teachingVideoId: 'a8tCGNB-vOk',
    exampleVideoId: 'w6LfGwslhlw',
  },
  translation: {
    generate: generateTranslationProblem,
    teachingVideoId: 'w6LfGwslhlw',
    exampleVideoId: 'w6LfGwslhlw',
  },
  simplify: {
    generate: generateSimplifyProblem,
    teachingVideoId: '4CKDqvddhhg',
    exampleVideoId: '',
  },
  wholetimesmixed: {
    generate: generateWholeTimesMixedProblem,
    teachingVideoId: '4JV6fPXZPXA',
    exampleVideoId: '',
  },
  dividefractions: {
    generate: generateDivideFractionsProblem,
    teachingVideoId: '1YWyTdtofdE',
    exampleVideoId: 'cARsEw-s8Fg',
  },
  mean: {
    generate: generateMeanProblem,
    teachingVideoId: 'H7u0Zrra060',
    exampleVideoId: '',
  },
  median: {
    generate: generateMedianProblem,
    teachingVideoId: 'Y7M_KNwIZvw',
    exampleVideoId: '',
  },
  mode: {
    generate: generateModeProblem,
    teachingVideoId: 'dyQ-leIVuRI',
    exampleVideoId: '',
  },
  range: {
    generate: generateRangeProblem,
    teachingVideoId: '0HS1P3vhNBU',
    exampleVideoId: '',
  },
  firstquartile: {
    generate: generateFirstQuartileProblem,
    teachingVideoId: 'oPw2OpIZ4DY',
    exampleVideoId: '',
  },
  thirdquartile: {
    generate: generateThirdQuartileProblem,
    teachingVideoId: 'oPw2OpIZ4DY',
    exampleVideoId: '',
  },
  interquartilerange: {
    generate: generateInterquartileRangeProblem,
    teachingVideoId: 'VABsJBw1JqA',
    exampleVideoId: '',
  },
  comparison: {
    generate: generateComparisonQuestion,
    teachingVideoId: 'u_QTuWj107o',
    exampleVideoId: '',
  },
  division: {
    generate: generateDivisionProblem,
    teachingVideoId: 'lGEdO4cr_TA',
    exampleVideoId: 'rXjV74suB68',
  },
  solvex: {
    generate: generateSolveXProblem,
    teachingVideoId: 'Qa-MCLDrSlI',
    exampleVideoId: '',
  },
  factor: {
    generate: generateFactorProblem,
    teachingVideoId: '-y0-vf0zsMg',
    exampleVideoId: '',
  },
  distribute: {
    generate: generateDistributeProblem,
    teachingVideoId: 'CTw40jSAUx0',
    exampleVideoId: '',
  },
  rounding: {
    generate: generateRoundingProblem,
    teachingVideoId: 'KqBJBMEqrZc',
    exampleVideoId: '',
  },
  exponent: {
    generate: generateExponentProblem,
    teachingVideoId: 'NS4vHqJIPiE',
    exampleVideoId: '',
  },
  exponent2: {
    generate: generateExponent2Problem,
    teachingVideoId: 'CTw40jSAUx0',
    exampleVideoId: 'MP3viJTn-e4',
  },
  lcm: {
    generate: generateLCMProblem,
    teachingVideoId: '53Ed5yjBELc',
    exampleVideoId: '',
  },
  gcf: {
    generate: generateGCFProblem,
    teachingVideoId: 'crWLFqOQtBA',
    exampleVideoId: '',
  },
  opposites: {
    generate: generateOppositesProblem,
    teachingVideoId: 'GJTI6y0ZKWE',
    exampleVideoId: '',
  },
  absolutevalue: {
    generate: generateAbsoluteValueProblem,
    teachingVideoId: 'NNsdEV0jJqM',
    exampleVideoId: '',
  },
  solveratiotable: {
    generate: generateSolveRatioTableProblem,
    teachingVideoId: '6uwnkOC5hLI',
    exampleVideoId: '',
  },
  addsubtractmixed: {
    generate: generateAddSubtractMixedProblem,
    teachingVideoId: 'h7Vs7uUPZrE', // Updated video ID
    exampleVideoId: '',
  },
  dividemixednumbers: {
    generate: generateDivideMixedNumbersProblem,
    teachingVideoId: 'cARsEw-s8Fg',
    exampleVideoId: '',
  },
  percentDecimal: {
    generate: generatePercentDecimalQuestion,
    teachingVideoId: 'jPmno8_2zi0',
    exampleVideoId: '',
  },
  percentofnumber: {
    generate: generatePercentOfNumberProblem,
    teachingVideoId: 'AL0-0f9azNo',
    exampleVideoId: '',
  },
  'mixed-to-improper': {
    generate: generateMixedToImproperProblem,
    teachingVideoId: '96NOYcnmThU',
    exampleVideoId: '',
  },
  'improper-to-mixed': {
    generate: generateImproperToMixedProblem,
    teachingVideoId: 'EpXCr2iax5E',
    exampleVideoId: '',
  },
  convert: {
    generate: generateConvertQuestion,
    teachingVideoId: 'guBVW5PiHLs',
    exampleVideoId: '',
  },
  unknown: {
    generate: generateUnknownProblem,
    teachingVideoId: '',
    exampleVideoId: '',
  },
  solveforx: {
    generate: generateSolveForXProblem,
    teachingVideoId: 'Qa-MCLDrSlI',
    exampleVideoId: '',
  },
  writeequation: {
    generate: generateWriteEquationProblem,
    teachingVideoId: 'o_Ubm7OI8t4',
    exampleVideoId: '',
  },
  multiplication: {
    generate: generateMultiplicationProblem,
    teachingVideoId: 'PZjIT9CH6bM',
    exampleVideoId: 'hV3RstrYGEA',
  },
};
