import * as helper from '../helper.utils';
import { Problem } from '../../models/problem.model';

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
