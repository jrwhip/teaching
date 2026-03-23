import { Problem } from '../problem.model';
import { randInt, gcd, lcm, fracHtml } from './helpers';

// ---------------------------------------------------------------------------
// Shared local helpers
// ---------------------------------------------------------------------------

interface DigitPositions {
  hundreds: string;
  tens: string;
  ones: string;
  tenths: string;
  hundredths: string;
  thousandths: string;
}

function extractDigits(num: string, maxDecimals: number): DigitPositions {
  const parts = num.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : '';

  return {
    hundreds: integerPart.length > 2 ? integerPart[integerPart.length - 3] : ' ',
    tens: integerPart.length > 1 ? integerPart[integerPart.length - 2] : ' ',
    ones: integerPart.length > 0 ? integerPart[integerPart.length - 1] : ' ',
    tenths: decimalPart.length > 0 && maxDecimals >= 1 ? decimalPart[0] : ' ',
    hundredths: decimalPart.length > 1 && maxDecimals >= 2 ? decimalPart[1] : ' ',
    thousandths: decimalPart.length > 2 && maxDecimals >= 3 ? decimalPart[2] : ' ',
  };
}

function calculateCarry(a: string, b: string, c: string): string {
  const av = a.trim() === '' ? 0 : parseInt(a, 10);
  const bv = b.trim() === '' ? 0 : parseInt(b, 10);
  const cv = c.trim() === '' ? 0 : parseInt(c, 10);
  const carry = Math.floor((av + bv + cv) / 10);
  return carry > 0 ? carry.toString() : '';
}

function roundToDecimalPlace(number: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round((number + Number.EPSILON) * factor) / factor;
}

function roundNumber(number: number, type: string): number {
  switch (type) {
    case 'tens':
      return Math.round(number / 10) * 10;
    case 'hundreds':
      return Math.round(number / 100) * 100;
    case 'thousands':
      return Math.round(number / 1000) * 1000;
    case 'tenths':
      return roundToDecimalPlace(number, 1);
    case 'hundredths':
      return roundToDecimalPlace(number, 2);
    default:
      return number;
  }
}

// ---------------------------------------------------------------------------
// Addition
// ---------------------------------------------------------------------------

export function generateAdditionProblem(): Problem {
  const decimalPlacesNum1 = Math.floor(Math.random() * 4);
  const decimalPlacesNum2 = Math.floor(Math.random() * 4);

  let num1 = (Math.random() * (900 - 0.003) + 0.003).toFixed(decimalPlacesNum1);
  let num2 = (Math.random() * (90 - 0.003) + 0.003).toFixed(decimalPlacesNum2);

  num1 += num1.includes('.') ? '' : '.';
  num2 += num2.includes('.') ? '' : '.';

  const maxDecimalPlaces = Math.max(decimalPlacesNum1, decimalPlacesNum2);
  const sum = parseFloat((parseFloat(num1) + parseFloat(num2)).toFixed(maxDecimalPlaces));

  const num1Padded = num1.padEnd(num1.indexOf('.') + 1 + maxDecimalPlaces, '0');
  const num2Padded = num2.padEnd(num2.indexOf('.') + 1 + maxDecimalPlaces, '0');
  const sumPadded = sum.toFixed(maxDecimalPlaces);

  const digitsNum1 = extractDigits(num1, maxDecimalPlaces);
  const digitsNum2 = extractDigits(num2, maxDecimalPlaces);
  const digitsSum = extractDigits(sumPadded, maxDecimalPlaces);

  const carry = {
    thousandths: '',
    hundredths: '',
    tenths: '',
    ones: '',
    tens: '',
    hundreds: '',
  };

  carry.thousandths = calculateCarry(digitsNum1.thousandths, digitsNum2.thousandths, '');
  carry.hundredths = calculateCarry(digitsNum1.hundredths, digitsNum2.hundredths, carry.thousandths);
  carry.tenths = calculateCarry(digitsNum1.tenths, digitsNum2.tenths, carry.hundredths);
  carry.ones = calculateCarry(digitsNum1.ones, digitsNum2.ones, carry.tenths);
  carry.tens = calculateCarry(digitsNum1.tens, digitsNum2.tens, carry.ones);
  carry.hundreds = calculateCarry(digitsNum1.hundreds, digitsNum2.hundreds, carry.tens);

  const hint = `Add them step by step:<br>
1. Write the numbers vertically, aligning the decimal points:
<br>2. If a column's total is 10 or more, carry over to the next column.<br>
3. Write down the sum with the decimal point aligned
<br><br><table style="border-collapse: collapse;">
  <tr>
    <td style="color: red;">${carry.hundreds}</td>
    <td style="color: red;">${carry.tens}</td>
    <td style="color: red;">${carry.ones}</td>
    <td style="color: red;">${carry.tenths}</td>
    <td></td>
    <td style="color: red;">${carry.hundredths}</td>
    <td style="color: red;">${carry.thousandths}</td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td>${digitsNum1.hundreds}</td>
    <td>${digitsNum1.tens}</td>
    <td>${digitsNum1.ones}</td>
    <td>.</td>
    <td>${digitsNum1.tenths}</td>
    <td>${digitsNum1.hundredths}</td>
    <td>${digitsNum1.thousandths}</td>
  </tr>
  <tr style="border-bottom: 2px solid black;">
    <td>+</td>
    <td>${digitsNum2.hundreds}</td>
    <td>${digitsNum2.tens}</td>
    <td>${digitsNum2.ones}</td>
    <td>.</td>
    <td>${digitsNum2.tenths}</td>
    <td>${digitsNum2.hundredths}</td>
    <td>${digitsNum2.thousandths}</td>
  </tr>
  <tr>
    <td></td>
    <td>${digitsSum.hundreds}</td>
    <td>${digitsSum.tens}</td>
    <td>${digitsSum.ones}</td>
    <td>.</td>
    <td>${digitsSum.tenths}</td>
    <td>${digitsSum.hundredths}</td>
    <td>${digitsSum.thousandths}</td>
  </tr>
</table>`;

  const validate = (userInput: string): boolean => {
    return parseFloat(userInput) === sum;
  };

  return {
    question: `${num1} + ${num2}`,
    answer: sum.toString(),
    hint,
    validate,
    needsExtraInput: false,
  };
}

// ---------------------------------------------------------------------------
// Subtraction
// ---------------------------------------------------------------------------

export function generateSubtractionProblem(): Problem {
  let num1: number;
  let num2: number;
  let decimalPlacesNum1: number;
  let decimalPlacesNum2: number;

  do {
    decimalPlacesNum1 = Math.floor(Math.random() * 4);
    decimalPlacesNum2 = Math.floor(Math.random() * 4);

    num1 = parseFloat((Math.random() * (900 - 0.003) + 0.003).toFixed(decimalPlacesNum1));
    num2 = parseFloat((Math.random() * (90 - 0.003) + 0.003).toFixed(decimalPlacesNum2));
  } while (num1 < num2);

  const maxDecimalPlaces = Math.max(decimalPlacesNum1, decimalPlacesNum2);
  const difference = parseFloat((num1 - num2).toFixed(maxDecimalPlaces));

  const num1Padded = num1.toFixed(maxDecimalPlaces);
  const num2Padded = num2.toFixed(maxDecimalPlaces);
  const differencePadded = difference.toFixed(maxDecimalPlaces);

  const hint = `Let's subtract them step by step:<br>
1. Write the numbers vertically, aligning the decimal points.<br>
2. Subtract each column from right to left.<br>
3. Write down the difference with the decimal point aligned.<br><br>
<table style="border-collapse: collapse; text-align: right;">
  <tr>
    <td> </td>
    <td>${extractDigits(num1Padded, maxDecimalPlaces).hundreds}</td>
    <td>${extractDigits(num1Padded, maxDecimalPlaces).tens}</td>
    <td>${extractDigits(num1Padded, maxDecimalPlaces).ones}</td>
    <td>.</td>
    <td>${extractDigits(num1Padded, maxDecimalPlaces).tenths}</td>
    <td>${extractDigits(num1Padded, maxDecimalPlaces).hundredths}</td>
    <td>${extractDigits(num1Padded, maxDecimalPlaces).thousandths}</td>
  </tr>
  <tr style="border-bottom: 2px solid black;">
    <td>-</td>
    <td>${extractDigits(num2Padded, maxDecimalPlaces).hundreds}</td>
    <td>${extractDigits(num2Padded, maxDecimalPlaces).tens}</td>
    <td>${extractDigits(num2Padded, maxDecimalPlaces).ones}</td>
    <td>.</td>
    <td>${extractDigits(num2Padded, maxDecimalPlaces).tenths}</td>
    <td>${extractDigits(num2Padded, maxDecimalPlaces).hundredths}</td>
    <td>${extractDigits(num2Padded, maxDecimalPlaces).thousandths}</td>
  </tr>
  <tr>
    <td> </td>
    <td>${extractDigits(differencePadded, maxDecimalPlaces).hundreds}</td>
    <td>${extractDigits(differencePadded, maxDecimalPlaces).tens}</td>
    <td>${extractDigits(differencePadded, maxDecimalPlaces).ones}</td>
    <td>.</td>
    <td>${extractDigits(differencePadded, maxDecimalPlaces).tenths}</td>
    <td>${extractDigits(differencePadded, maxDecimalPlaces).hundredths}</td>
    <td>${extractDigits(differencePadded, maxDecimalPlaces).thousandths}</td>
  </tr>
</table>`;

  const validate = (userInput: string): boolean => {
    return parseFloat(userInput) === difference;
  };

  return {
    question: `${num1} - ${num2}`,
    answer: difference.toString(),
    hint,
    validate,
    needsExtraInput: false,
  };
}

// ---------------------------------------------------------------------------
// Multiplication
// ---------------------------------------------------------------------------

export function generateMultiplicationProblem(): Problem {
  const num1 = Math.floor(Math.random() * 80) + 15;
  const num2 = Math.floor(Math.random() * 80) + 15;
  const product = num1 * num2;

  const onesPlaceNum1 = num1 % 10;
  const onesPlaceNum2 = num2 % 10;
  const tensPlaceNum2 = Math.floor(num2 / 10) % 10;
  const multiplicationStep1 = num1 * onesPlaceNum2;
  const multiplicationStep2 = num1 * tensPlaceNum2;

  const onesPlaceProduct = onesPlaceNum1 * onesPlaceNum2;
  const tensDigitOfOnesPlaceProduct =
    onesPlaceProduct >= 10 ? Math.floor((onesPlaceProduct / 10) % 10) : '';

  const tensPlaceProduct = onesPlaceNum1 * tensPlaceNum2;
  const tensDigitOfTensPlaceProduct =
    tensPlaceProduct >= 10 ? Math.floor((tensPlaceProduct / 10) % 10) : '';

  const hint = `Let's break down the multiplication: <br>
Given: ${num1} \u00D7 ${num2}<br><br>
<style>
  .blue { color: blue; }
  .bright-blue { color: #8800eb; }
  .dark-blue { color: #00008B; }
  .dark-green { color: #006400; }
  .red { color: red; }
  .black { color: black; }
</style>
<table style="border-collapse: collapse;">
  <tr>
    <th style="text-align: right;">Times the <br>ones place</th>
    <td style="text-align: right;">&nbsp;</td>
    <th style="text-align: right;">Times the <br>tens place</th>
    <td style="text-align: right;">&nbsp;</td>
    <th style="text-align: right;">Add the <br>Products</th>
  </tr>
  <tr>
    <td class="blue" style="text-align: right;"></td>
    <td style="text-align: right;">&nbsp;</td>
    <td class="red" style="text-align: right;"></td>
    <td style="text-align: right;">&nbsp;</td>
    <td class="red" style="text-align: right;">${tensDigitOfTensPlaceProduct}&nbsp;&nbsp;</td>
  </tr>
  <tr>
    <td class="bright-blue" style="text-align: right;">${tensDigitOfOnesPlaceProduct}&nbsp;&nbsp;</td>
    <td style="text-align: right;">&nbsp;</td>
    <td class="red" style="text-align: right;">${tensDigitOfTensPlaceProduct}&nbsp;&nbsp;</td>
    <td style="text-align: right;">&nbsp;</td>
    <td class="blue" style="text-align: right;">${tensDigitOfOnesPlaceProduct}&nbsp;&nbsp;</td>
  </tr>
  <tr>
    <td class="black" style="text-align: right;">${num1}</td>
    <td style="text-align: right;">&nbsp;</td>
    <td class="black" style="text-align: right;">${num1}</td>
    <td style="text-align: right;">&nbsp;</td>
    <td class="black" style="text-align: right;">${num1}</td>
  </tr>
  <tr>
    <td class="blue" style="text-align: right; border-bottom: 1px solid black;">\u00D7 <span class="blue">${onesPlaceNum2}</span></td>
    <td style="text-align: right;">&nbsp;</td>
    <td class="red" style="text-align: right; border-bottom: 1px solid black;">\u00D7 <span class="red">${tensPlaceNum2}0</span></td>
    <td style="text-align: right;">&nbsp;</td>
    <td class="black" style="text-align: right; border-bottom: 1px solid black;">\u00D7 <span class="red">${tensPlaceNum2}</span><span class="blue">${onesPlaceNum2}</span></td>
  </tr>
  <tr>
    <td class="blue" style="text-align: right;">${multiplicationStep1}</td>
    <td style="text-align: right;">&nbsp;</td>
    <td class="red" style="text-align: right;">${multiplicationStep2 * 10}</td>
    <td style="text-align: right;">&nbsp;</td>
    <td class="blue" style="text-align: right;">${multiplicationStep1}</td>
  </tr>
  <tr>
    <td style="text-align: right;">&nbsp;</td>
    <td style="text-align: right;">&nbsp;</td>
    <td style="text-align: right;">&nbsp;</td>
    <td style="text-align: right;">&nbsp;</td>
    <td class="red" style="text-align: right; border-bottom: 1px solid black;">+ ${multiplicationStep2 * 10}</td>
  </tr>
  <tr>
    <td style="text-align: right;">&nbsp;</td>
    <td style="text-align: right;">&nbsp;</td>
    <td style="text-align: right;">&nbsp;</td>
    <td style="text-align: right;">&nbsp;</td>
    <td class="black" style="text-align: right;">${multiplicationStep1 + multiplicationStep2 * 10}</td>
  </tr>
</table>`;

  const validate = (userInput: string): boolean => {
    return parseFloat(userInput) === product;
  };

  return {
    question: `${num1} \u00D7 ${num2}`,
    answer: product.toString(),
    hint,
    validate,
    needsExtraInput: false,
  };
}

// ---------------------------------------------------------------------------
// Division
// ---------------------------------------------------------------------------

export function generateDivisionProblem(): Problem {
  const num1 = Math.floor(Math.random() * 899) + 100; // 100..998
  const num2 = Math.floor(Math.random() * 14) + 5;    // 5..18

  const roundingType = Math.floor(Math.random() * 2); // 0 = tenth, 1 = hundredth
  let answer: number;
  let roundingInstruction: string;

  if (roundingType === 0) {
    answer = parseFloat((num1 / num2).toFixed(1));
    roundingInstruction = 'Round your answer to the nearest tenth.';
  } else {
    answer = parseFloat((num1 / num2).toFixed(2));
    roundingInstruction = 'Round your answer to the nearest hundredth.';
  }

  const question = `What is ${num1} divided by ${num2}? ${roundingInstruction}`;

  const wholeNumberPart = Math.floor(num1 / num2);
  const fractionalPart = num1 / num2 - wholeNumberPart;
  const roundingPrecision = roundingType === 0 ? 1 : 2;
  const roundedFractionalPart = parseFloat(fractionalPart.toFixed(roundingPrecision));
  const fractionalString =
    roundedFractionalPart === 0 ? '' : roundedFractionalPart.toString().slice(1);

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
  <tr></tr>
</table>
<br> ${roundingInstruction}`;

  const validate = (userInput: string): boolean => {
    const parsedInput = parseFloat(userInput);
    const comparisonPrecision = roundingType === 0 ? 1 : 2;
    return parsedInput.toFixed(comparisonPrecision) === answer.toFixed(comparisonPrecision);
  };

  return {
    question,
    answer: answer.toString(),
    hint,
    validate,
    needsExtraInput: false,
  };
}

// ---------------------------------------------------------------------------
// Rounding
// ---------------------------------------------------------------------------

export function generateRoundingProblem(): Problem {
  const roundTypes = ['tens', 'hundreds', 'thousands', 'tenths', 'hundredths'];
  const roundType = roundTypes[Math.floor(Math.random() * roundTypes.length)];

  let num: number;

  if (roundType === 'hundreds' || roundType === 'thousands' || roundType === 'tens') {
    num = Math.floor(Math.random() * 9000) + 1000; // 1000..9999
  } else {
    const decimalPlaces = roundType === 'tenths' ? 2 : 3;
    num = +(Math.random() * 10).toFixed(decimalPlaces);
  }

  const numStr = num.toString();
  let placeValueDigit = '';
  let nextDigit = '';
  let roundingPosition: number;

  switch (roundType) {
    case 'tens':
      roundingPosition = numStr.indexOf('.') >= 0 ? numStr.indexOf('.') - 1 : numStr.length - 2;
      break;
    case 'hundreds':
      roundingPosition = numStr.indexOf('.') >= 0 ? numStr.indexOf('.') - 2 : numStr.length - 3;
      break;
    case 'thousands':
      roundingPosition = numStr.indexOf('.') >= 0 ? numStr.indexOf('.') - 3 : numStr.length - 4;
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

  const roundedNum = roundNumber(num, roundType).toString();
  const question = `Round ${num} to the nearest ${roundType}`;

  let hint: string;

  if (numStr === roundedNum) {
    hint = `There are no digits smaller than the ${roundType} place (${placeValueDigit}) in the number ${num}.<br> The number stays the same`;
  } else {
    hint = `To round ${num} to the nearest ${roundType}: <br><br>
<table border="1" cellpadding="5">
  <tr>
    <td colspan="2">Step</td>
    <td>Explanation</td>
  </tr>
  <tr>
    <td>1</td>
    <td>
      ${numStr.slice(0, roundingPosition)}<span style="border: 1px solid black; padding: 3px;">${numStr[roundingPosition] || ''}</span><u style="color: red;">${numStr.slice(roundingPosition + 1, roundingPosition + 2) || ''}</u>${numStr.slice(roundingPosition + 2)}
    </td>
    <td>
      Circle the digit in the ${roundType} place and underline the next digit to the right.
    </td>
  </tr>
  <tr>
    <td>2</td>
    <td>
      ${numStr.slice(0, roundingPosition)}<span style="border: 1px solid black; padding: 3px;">${numStr[roundingPosition] || ''}</span><u style="color: red;">${numStr.slice(roundingPosition + 1, roundingPosition + 2) || ''}</u>${numStr.slice(roundingPosition + 2)} \u2248 ${roundedNum}
    </td>
    <td>
      ${nextDigit ? `With ${nextDigit} to the right, ` : 'No digit to the right, '}${
      nextDigit
        ? nextDigit >= '5'
          ? 'we round up.'
          : 'we round down.'
        : "The number is already at the correct place; it doesn't change."
    }
    </td>
  </tr>
</table>`;
  }

  const validate = (userInput: string): boolean => {
    const standardizedInput = userInput.replace(/,/g, '').trim();
    const standardizedRoundedNum = roundedNum.replace(/,/g, '');
    return standardizedInput === standardizedRoundedNum;
  };

  return {
    question,
    answer: roundedNum,
    hint,
    validate,
    needsExtraInput: false,
  };
}

// ---------------------------------------------------------------------------
// Fact Family
// ---------------------------------------------------------------------------

export function generateFactFamilyProblem(): Problem {
  const a = Math.floor(Math.random() * 12) + 1;
  const b = Math.floor(Math.random() * 12) + 1;
  const c = a * b;

  const format = Math.floor(Math.random() * 12) + 1;

  let questionText = '';
  let answerValue: number;

  switch (format) {
    case 1:
      questionText = `${a} x ${b} = _______`;
      answerValue = c;
      break;
    case 2:
      questionText = `${a} x _______ = ${c}`;
      answerValue = b;
      break;
    case 3:
      questionText = `_______ x ${a} = ${c}`;
      answerValue = b;
      break;
    case 4:
      questionText = `${c} \u00F7 ${a} = _______`;
      answerValue = b;
      break;
    case 5:
      questionText = `${c} \u00F7 _______ = ${a}`;
      answerValue = b;
      break;
    case 6:
      questionText = `_______ \u00F7 ${a} = ${b}`;
      answerValue = c;
      break;
    case 7:
      questionText = `_______ = ${a} x ${b}`;
      answerValue = c;
      break;
    case 8:
      questionText = `${c} = ${a} x _______`;
      answerValue = b;
      break;
    case 9:
      questionText = `${c} = _______ x ${a}`;
      answerValue = b;
      break;
    case 10:
      questionText = `_______ = ${c} \u00F7 ${a}`;
      answerValue = b;
      break;
    case 11:
      questionText = `${a} = ${c} \u00F7 _______`;
      answerValue = b;
      break;
    default: // 12
      questionText = `${a} = _______ \u00F7 ${b}`;
      answerValue = c;
      break;
  }

  const hint = `
<table border="1" cellpadding="6" style="border-collapse:collapse">
  <tr><th>Fact Family</th></tr>
  <tr><td>${a} \u00D7 ${b} = ${c}</td></tr>
  <tr><td>${b} \u00D7 ${a} = ${c}</td></tr>
  <tr><td>${c} \u00F7 ${a} = ${b}</td></tr>
  <tr><td>${c} \u00F7 ${b} = ${a}</td></tr>
</table>
<br>Fill in the blank with the single missing number.`;

  const validate = (userInput: string): boolean => {
    const n = Number(userInput);
    return !Number.isNaN(n) && n === answerValue;
  };

  return {
    question: questionText,
    answer: String(answerValue),
    hint,
    validate,
    needsExtraInput: false,
  };
}

// ---------------------------------------------------------------------------
// Aggregated export
// ---------------------------------------------------------------------------

export const BASICS_GENERATORS = {
  addition: { generate: generateAdditionProblem },
  subtraction: { generate: generateSubtractionProblem },
  multiplication: { generate: generateMultiplicationProblem },
  division: { generate: generateDivisionProblem },
  rounding: { generate: generateRoundingProblem },
  factfamily: { generate: generateFactFamilyProblem },
};
