import { Problem } from '../problem.model';
import { gcd, calculateGCF, fracHtml, fractionPower, randInt } from './helpers';

// ---------------------------------------------------------------------------
// generateTranslationProblem — translate word problems into equations (15 types)
// ---------------------------------------------------------------------------
export function generateTranslationProblem(): Problem {
  const num1 = Math.floor(Math.random() * 50) + 5;
  const num2 = Math.floor(Math.random() * 50) + 5;
  const questionType = Math.floor(Math.random() * 15) + 1;

  let question = '';
  let answer = '';
  let answer2: string | undefined;

  switch (questionType) {
    case 1:
      question = `The sum of a number and ${num1} is ${num2}.  <br> Use n as the variable`;
      answer = `n + ${num1} = ${num2}`;
      answer2 = `${num1} + n = ${num2}`;
      break;
    case 2:
      question = `${num1} more than a number is ${num2}.  <br> Use n as the variable`;
      answer = `n + ${num1} = ${num2}`;
      answer2 = `${num1} + n  = ${num2}`;
      break;
    case 3:
      question = `Increasing a number by ${num1} gives ${num2}.  <br> Use n as the variable`;
      answer = `n + ${num1} = ${num2}`;
      answer2 = `${num1} + n  = ${num2}`;
      break;
    case 4:
      question = `${num1} added to a number equals ${num2}.  <br> Use n as the variable`;
      answer = `n + ${num1} = ${num2}`;
      answer2 = `${num1} + n  = ${num2}`;
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
      answer2 = `n${num1} = ${num2}`;
      break;
    case 10:
      question = `${num1} times a number is ${num2}.  <br> Use n as the variable`;
      answer = `${num1}n = ${num2}`;
      answer2 = `n${num1} = ${num2}`;
      break;
    case 11:
      question = `Dividing a number by ${num1} is ${num2}.  <br> Use n as the variable`;
      answer = `n / ${num1} = ${num2}`;
      break;
    case 12:
      question = `When a number is divided by ${num1}, the result is ${num2}.  <br> Use n as the variable`;
      answer = `n / ${num1} = ${num2}`;
      break;
    case 13:
      question = `${num1} divided by a number equals ${num2}.  <br> Use n as the variable`;
      answer = `${num1} / n = ${num2}`;
      break;
    case 14:
      question = `${num1} divided by ${num2} = n.  <br> Use n as the variable`;
      answer = `${num1} / ${num2} = n`;
      break;
    case 15:
      question = `A number n divided by ${num1} = ${num2}.  <br> Use n as the variable`;
      answer = `n / ${num1} = ${num2}`;
      break;
  }

  const hint = answer;

  const validate = (userInput: string): boolean => {
    const normalizedUserInput = userInput.replace(/\s+/g, '').toLowerCase();
    const normalizedCorrectAnswer1 = answer.replace(/\s+/g, '').toLowerCase();
    let isCorrect = normalizedUserInput === normalizedCorrectAnswer1;

    if (!isCorrect && answer2) {
      const normalizedCorrectAnswer2 = answer2.replace(/\s+/g, '').toLowerCase();
      isCorrect = normalizedUserInput === normalizedCorrectAnswer2;
    }

    return isCorrect;
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// generateUnknownProblem — distributive property with missing value (4 types)
// ---------------------------------------------------------------------------

function generateHintForUnknownType(type: number, num1: number, num2: number, num3: number): string {
  let hint = '';
  switch (type) {
    case 1:
      hint += `${num3} x ${num1 + num2} = ${num3} x (${num2} + _________)<br>
      Balance the sides:<br> Both sides have ${num3} x <br> First side is ${num3} x ${num1 + num2}<br> Second side is ${num3} x (${num2} + _________)<br> ${num1 + num2} needs to equal ${num1 + num2}<br>, you need to multiply by the same number  ${num1 + num2} = (${num2} + _________)  `;
      break;
    case 2:
      hint += `${num3} x ${num1 + num2} = (${num3} x ${num2}) + (${num3} x _______)First, calculate ${num3} x ${num2} to find part of the total. `;
      hint += `Then subtract this from the total (${num3} x ${num1 + num2}) to find the missing part. `;
      hint += `This missing part divided by ${num3} is the missing number.`;
      break;
    case 3:
      hint += `${num3} x (${num1} + ${num2}) = ${num3} x _________To solve, you divide the total (${num3} x (${num1} + ${num2})) by ${num3}. `;
      hint += `This tells you the combined total of ${num1} and ${num2} before multiplying by ${num3}.`;
      break;
    case 4:
      hint += `${num1} x (${num2} + ${num3}) = _________(${num2} + ${num3}) = ${num2 + num3} add first since it's in parentheses. <br>`;
      hint += `Then, multiply ${num2 + num3} × ${num1} to find the total. `;
      break;
  }
  return hint;
}

export function generateUnknownProblem(): Problem {
  let num1 = 0, num2 = 0, num3 = 0;
  let question = '';
  let answer = '';
  const type = Math.floor(Math.random() * 4) + 1;

  switch (type) {
    case 1:
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * 9) + 2;
      num3 = Math.floor(Math.random() * 9) + 2;
      question = `${num3} x ${num1 + num2} = ${num3} x (${num2} + _________)`;
      answer = num1.toString();
      break;
    case 2:
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * 9) + 2;
      num3 = Math.floor(Math.random() * 9) + 2;
      question = `${num3} x ${num1 + num2} = (${num3} x ${num2}) + (${num3} x _______)`;
      answer = num1.toString();
      break;
    case 3:
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * 9) + 2;
      num3 = Math.floor(Math.random() * 9) + 2;
      question = `${num3} x (${num1} + ${num2}) = ${num3} x _________`;
      answer = (num1 + num2).toString();
      break;
    case 4:
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * 6) + 2;
      num3 = Math.floor(Math.random() * 6) + 2;
      question = `${num1} x (${num2} + ${num3}) = _________`;
      answer = (num1 * (num2 + num3)).toString();
      break;
  }

  const hint = generateHintForUnknownType(type, num1, num2, num3);

  const validate = (userInput: string): boolean => {
    return userInput.trim() === answer;
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// generateFactorProblem — factor expressions using GCF
// ---------------------------------------------------------------------------
export function generateFactorProblem(): Problem {
  let num1: number, num2: number, num3: number;
  let question: string;
  let answer: string;
  let hint: string;

  const isFactoring = Math.random() < 0.5;

  if (isFactoring) {
    num3 = Math.floor(Math.random() * 3) + 2;
    num1 = num3 * (Math.floor(Math.random() * 20) + 2);
    num2 = num3 * (Math.floor(Math.random() * 20) + 2);
    const commonFactor = calculateGCF(num1, num2);
    const isAddition = Math.random() < 0.5;
    const sign = isAddition ? '+' : '-';

    question = `Factor: ${num1}n ${sign} ${num2}`;
    answer = `${commonFactor}( ${num1 / commonFactor}n ${isAddition ? '+' : '-'} ${num2 / commonFactor} )`;

    hint = `Practice GCF question first:
<table border="1" cellpadding="5">
  <tr>
    <td colspan="2">Step</td>
    <td>Explanation</td>
  </tr>
  <tr>
    <td>1</td>
    <td>${num1}n ${sign} ${num2}</td>
    <td>Original expression</td>
  </tr>
  <tr>
    <td>2</td>
    <td>GCF: ${commonFactor}</td>
    <td>Identify the Greatest Common Factor (GCF)</td>
  </tr>
  <tr>
    <td>3</td>
    <td>${commonFactor}&bull;${num1 / commonFactor}n ${sign} ${commonFactor}&bull;${num2 / commonFactor}</td>
    <td>Pull the GCF out of each term</td>
  </tr>
  <tr>
    <td>4</td>
    <td>${commonFactor}(${num1 / commonFactor}n ${sign} ${num2 / commonFactor})</td>
    <td>Place the GCF outside the parentheses</td>
  </tr>
</table>`;
  } else {
    num3 = Math.floor(Math.random() * 3) + 2;
    num1 = num3 * (Math.floor(Math.random() * 20) + 2);
    num2 = num3 * (Math.floor(Math.random() * 20) + 2);
    const commonFactor = calculateGCF(num1, num2);
    const isAddition = Math.random() < 0.5;
    const sign = isAddition ? '+' : '-';

    question = `Use the GCF to simplify: ${num1} ${sign} ${num2}`;
    answer = `${commonFactor}( ${num1 / commonFactor} ${isAddition ? '+' : '-'} ${num2 / commonFactor} )`;

    hint = `Practice GCF question first:
<table border="1" cellpadding="5">
  <tr>
    <td colspan="2">Step</td>
    <td>Explanation</td>
  </tr>
  <tr>
    <td>1</td>
    <td>${num1} ${sign} ${num2}</td>
    <td>Original expression</td>
  </tr>
  <tr>
    <td>2</td>
    <td>GCF: ${commonFactor}</td>
    <td>Identify the Greatest Common Factor (GCF)</td>
  </tr>
  <tr>
    <td>3</td>
    <td>${commonFactor}&bull;${num1 / commonFactor} ${sign} ${commonFactor}&bull;${num2 / commonFactor}</td>
    <td>Pull the GCF out of each term</td>
  </tr>
  <tr>
    <td>4</td>
    <td>${commonFactor}(${num1 / commonFactor} ${sign} ${num2 / commonFactor})</td>
    <td>Place the GCF outside the parentheses</td>
  </tr>
</table>`;
  }

  const validate = (userInput: string): boolean => {
    const standardizedInput = userInput.replace(/\s+/g, '').toLowerCase();
    const normalizedCorrectAnswer = answer.replace(/\s+/g, '').toLowerCase();
    return standardizedInput === normalizedCorrectAnswer || standardizedInput === answer.toLowerCase();
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// generateSubstituteProblem — substitute value into expression
// ---------------------------------------------------------------------------
export function generateSubstituteProblem(): Problem {
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  const num3 = Math.floor(Math.random() * 9) + 1;
  const operation = Math.random() < 0.5 ? '+' : '-';

  const question = `Evaluate: ${num1}x ${operation} ${num3} <br>Given that x = ${num2}.`;
  const numericAnswer = operation === '+' ? (num1 * num2 + num3) : (num1 * num2 - num3);
  const answer = numericAnswer.toString();

  const hint = `
<table border="1" cellpadding="5">
  <tr>
    <td colspan="2">Step</td>
    <td>Explanation</td>
  </tr>
  <tr>
    <td>1</td>
    <td>
      ${num1}x ${operation} ${num3} = <br>
      ${num1}(${num2}) ${operation} ${num3}
    </td>
    <td>Substitute x with ${num2} into the equation</td>
  </tr>
  <tr>
    <td>2</td>
    <td>
      ${num1}(${num2}) ${operation} ${num3} = <br>
      ${num1}&bull;${num2} ${operation} ${num3} = <br>
      ${num1 * num2} ${operation} ${num3}
    </td>
    <td>Perform the multiplication:</td>
  </tr>
  <tr>
    <td>3</td>
    <td>
      ${operation === '+' ? num1 * num2 + ' + ' + num3 : num1 * num2 + ' - ' + num3} = ${numericAnswer}.
    </td>
    <td>Complete the ${operation === '+' ? 'addition' : 'subtraction'}:</td>
  </tr>
</table>`;

  const validate = (userInput: string): boolean => {
    const parsedInput = parseFloat(userInput);
    return parsedInput === numericAnswer;
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// generateSubstituteAdvancedProblem — substitute with squared terms and two variables
// ---------------------------------------------------------------------------
export function generateSubstituteAdvancedProblem(): Problem {
  const letters = ['x', 'y', 'z', 'a', 'b', 'c', 'm', 'n', 'p', 'q', 'r', 't', 'u', 'v', 'w'];
  const i = Math.floor(Math.random() * letters.length);
  let j = Math.floor(Math.random() * (letters.length - 1));
  if (j >= i) j += 1;
  const var1 = letters[i];
  const var2 = letters[j];

  const constant = Math.floor(Math.random() * 1501) + 300;
  const coef1 = Math.floor(Math.random() * 12) + 1;
  const coef2 = Math.floor(Math.random() * 14) + 2;
  const val1 = Math.floor(Math.random() * 8) + 2;
  const val2 = Math.floor(Math.random() * 8) + 2;

  const term = (c: number, v: string): string =>
    c === 1 ? `${v}<sup>2</sup>` : `${c}${v}<sup>2</sup>`;

  const question =
    `Evaluate: ${constant} + ${term(coef1, var1)} + ${term(coef2, var2)} <br>` +
    `Given that ${var1} = ${val1}, ${var2} = ${val2}.`;

  const var1Sq = val1 * val1;
  const var2Sq = val2 * val2;
  const part1 = coef1 * var1Sq;
  const part2 = coef2 * var2Sq;
  const numericAnswer = constant + part1 + part2;
  const answer = numericAnswer.toString();

  const hint = `
<table border="1" cellpadding="5">
  <tr>
    <td colspan="2">Step</td>
    <td>Explanation</td>
  </tr>
  <tr>
    <td>1</td>
    <td>
      ${constant} + ${term(coef1, var1)} + ${term(coef2, var2)} =<br>
      ${constant} + ${coef1 === 1 ? `(${val1})<sup>2</sup>` : `${coef1}(${val1})<sup>2</sup>`}
      + ${coef2 === 1 ? `(${val2})<sup>2</sup>` : `${coef2}(${val2})<sup>2</sup>`}
    </td>
    <td>Substitute ${var1} = ${val1} and ${var2} = ${val2}.</td>
  </tr>
  <tr>
    <td>2</td>
    <td>
      ${constant} + ${coef1 === 1 ? `(${val1})<sup>2</sup>` : `${coef1}(${val1})<sup>2</sup>`}
      + ${coef2 === 1 ? `(${val2})<sup>2</sup>` : `${coef2}(${val2})<sup>2</sup>`} =<br>
      ${constant} + ${coef1 === 1 ? `${val1}&bull;${val1}` : `${coef1}(${val1}&bull;${val1})`}
      + ${coef2 === 1 ? `${val2}&bull;${val2}` : `${coef2}(${val2}&bull;${val2})`} =<br>
      ${constant} + ${coef1 === 1 ? `${var1Sq}` : `${coef1}(${var1Sq})`}
      + ${coef2 === 1 ? `${var2Sq}` : `${coef2}(${var2Sq})`}
    </td>
    <td>Evaluate the exponents (square each variable).</td>
  </tr>
  <tr>
    <td>3</td>
    <td>
      ${constant} + ${coef1 === 1 ? `${var1Sq}` : `${coef1}(${var1Sq})`}
      + ${coef2 === 1 ? `${var2Sq}` : `${coef2}(${var2Sq})`} =<br>
      ${constant} + ${part1} + ${part2}
    </td>
    <td>Multiply each square by its coefficient.</td>
  </tr>
  <tr>
    <td>4</td>
    <td>
      ${constant} + ${part1} + ${part2} = ${numericAnswer}.
    </td>
    <td>Add the terms.</td>
  </tr>
</table>`;

  const validate = (userInput: string): boolean => {
    const parsedInput = parseFloat(userInput);
    return parsedInput === numericAnswer;
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// generateDistributeProblem — distribute coefficient across parentheses
// ---------------------------------------------------------------------------
export function generateDistributeProblem(): Problem {
  const coefficient = Math.floor(Math.random() * 5) + 2;
  const term1 = Math.floor(Math.random() * 10) + 1;
  const term2 = Math.floor(Math.random() * 10) + 1;
  const question = `${coefficient}(${term1}n - ${term2})`;
  const answer = `${coefficient * term1}n - ${coefficient * term2}`;

  const hint = `To distribute, multiply the number outside the parentheses by each term inside the parentheses:
<table border="1" cellpadding="5">
  <tr>
    <td colspan="2">Step</td>
    <td>Explanation</td>
  </tr>
  <tr>
    <td>1</td>
    <td>
      ${coefficient}(${term1}n-${term2}) = <br>
      ${coefficient}&bull;${term1}n - ${coefficient}&bull;${term2}
    </td>
    <td>Multiply (${coefficient}) by the terms (${term1}n) and (${term2}) inside the parentheses</td>
  </tr>
  <tr>
    <td>2</td>
    <td>
      ${coefficient}&bull;${term1}n - ${coefficient}&bull;${term2} = <br>
      ${coefficient * term1}n - ${coefficient * term2}
    </td>
    <td>Perform the multiplication</td>
  </tr>
  <tr>
    <td>3</td>
    <td>${coefficient * term1}n - ${coefficient * term2}</td>
    <td>Remember to keep the sign</td>
  </tr>
</table>`;

  // The original used eval() — replaced with proper numerical comparison.
  // The answer form is "An - B" so we extract the coefficient of n and the constant.
  const expectedNCoeff = coefficient * term1;
  const expectedConst = coefficient * term2;

  const validate = (userInput: string): boolean => {
    const standardizedInput = userInput.trim().replace(/\s+/g, '');
    // Match patterns like "20n-12" or "20n - 12"
    const match = standardizedInput.match(/^(\d+)n-(\d+)$/);
    if (!match) {
      return standardizedInput === answer.replace(/\s+/g, '');
    }
    const inputNCoeff = parseInt(match[1], 10);
    const inputConst = parseInt(match[2], 10);
    return inputNCoeff === expectedNCoeff && inputConst === expectedConst;
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// generateSolveForXProblem — solve one-step and two-step equations (6 types)
// ---------------------------------------------------------------------------
export function generateSolveForXProblem(): Problem {
  let question = '';
  let numericAnswer = 0;
  let hint = '';
  const questionType = Math.floor(Math.random() * 6) + 1;

  switch (questionType) {
    case 1: {
      const addNum = Math.floor(Math.random() * 10) + 1;
      numericAnswer = Math.floor(Math.random() * 10) + 1;
      question = `x + ${addNum} = ${numericAnswer + addNum}`;
      hint = `Subtract ${addNum} from both sides of the equation to solve for x.<br>
      x = ${numericAnswer}`;
      break;
    }
    case 2: {
      const subNum = Math.floor(Math.random() * 10) + 1;
      numericAnswer = Math.floor(Math.random() * 10) + 1;
      question = `x - ${subNum} = ${numericAnswer - subNum}`;
      hint = `Add ${subNum} to both sides of the equation to solve for x. <br>
      x = ${numericAnswer}`;
      break;
    }
    case 3: {
      const multNum = Math.floor(Math.random() * 10) + 1;
      numericAnswer = Math.floor(Math.random() * 10) + 1;
      question = `${multNum}x = ${numericAnswer * multNum}`;
      hint = `Divide both sides by ${multNum} to solve for x.
      <br>x = ${numericAnswer}`;
      break;
    }
    case 4: {
      const divNum = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      numericAnswer = num2 * divNum;
      question = `x / ${divNum} = ${num2}`;
      hint = `Multiply both sides by ${divNum} to solve for x.
      <br>x = ${numericAnswer}`;
      break;
    }
    case 5: {
      const addMixNum = Math.floor(Math.random() * 10) + 1;
      const multMixNum = Math.floor(Math.random() * 5) + 2;
      numericAnswer = Math.floor(Math.random() * 10) + 1;
      question = `${multMixNum}(x + ${addMixNum}) = ${multMixNum * (numericAnswer + addMixNum)}`;
      hint = `First, divide both sides by ${multMixNum}, then subtract ${addMixNum} from both sides to solve for x.
      <br>x = ${numericAnswer}`;
      break;
    }
    case 6: {
      const subMixNum = Math.floor(Math.random() * 10) + 1;
      const divMixNum = Math.floor(Math.random() * 5) + 2;
      const num2 = Math.floor(Math.random() * 10) + 1;
      numericAnswer = num2 * divMixNum + subMixNum;
      question = `${fracHtml(`(x - ${subMixNum})`, divMixNum)} = ${num2}`;
      hint = `First, multiply both sides by ${divMixNum}, then add ${subMixNum} to both sides to solve for x.
      <br>x = ${numericAnswer}`;
      break;
    }
  }

  const answer = numericAnswer.toString();

  const validate = (userInput: string): boolean => {
    const parsedInput = parseFloat(userInput);
    return parsedInput === numericAnswer;
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// generateExponentProblem — calculate base^exponent
// ---------------------------------------------------------------------------
export function generateExponentProblem(): Problem {
  const num1 = Math.floor(Math.random() * 8) + 2;
  let exponent: number;
  if (num1 > 5) {
    exponent = Math.floor(Math.random() * 3) + 2;
  } else {
    exponent = Math.floor(Math.random() * 4) + 2;
  }

  let multiplicationSequence = `${num1}`;
  for (let i = 1; i < exponent; i++) {
    multiplicationSequence += ` \u00D7 ${num1}`;
  }

  const question = `Calculate ${num1}<sup>${exponent}</sup>`;
  const numericAnswer = Math.pow(num1, exponent);
  const answer = numericAnswer.toString();

  const hint = `
<table border="1" cellpadding="5">
  <tr>
    <td colspan="2">Step</td>
    <td>Explanation</td>
  </tr>
  <tr>
    <td>1</td>
    <td>${num1}<sup>${exponent}</sup></td>
    <td>Calculate ${num1}<sup>${exponent}</sup> using exponentiation</td>
  </tr>
  <tr>
    <td>2</td>
    <td>Base: ${num1}<br>Exponent: ${exponent}</td>
    <td>Display base and exponent</td>
  </tr>
  <tr>
    <td>3</td>
    <td>${multiplicationSequence} = ${numericAnswer}</td>
    <td>Multiply the base ${num1} by itself ${exponent} times</td>
  </tr>
</table>`;

  const validate = (userInput: string): boolean => {
    const parsedInput = parseFloat(userInput);
    return parsedInput === numericAnswer;
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// generateExponent2Problem — exponent with fractions or decimals
// ---------------------------------------------------------------------------
export function generateExponent2Problem(): Problem {
  let base: string;
  let exponent: number;
  let answer: string;
  let hint: string;

  const wasFraction = Math.random() < 0.5;

  if (wasFraction) {
    const numerator = Math.floor(Math.random() * 8) + 1;
    const denominator = Math.floor(Math.random() * (8 - numerator)) + numerator + 1;

    const g = gcd(numerator, denominator);
    const simpNum = numerator / g;
    const simpDen = denominator / g;

    exponent = Math.floor(Math.random() * 3) + 2;
    base = `(${fracHtml(numerator, denominator)})`;
    const hintbase = `(${fracHtml(simpNum, simpDen)})`;

    // Use fractionPower helper instead of math.js
    const result = fractionPower(simpNum, simpDen, exponent);
    answer = `${result.numerator}/${result.denominator}`;

    const steps: string[] = [];

    if (g !== 1) {
      steps.push(`
    <tr>
      <td>1</td>
      <td>Simplify the fraction. <br> ${base} = ${hintbase}</td>
      <td>If possible, simplify the fraction by finding the greatest common divisor (GCD) between the numerator and denominator</td>
    </tr>`);
    }

    steps.push(`
    <tr>
      <td>${steps.length + 1}</td>
      <td>${hintbase}<sup>${exponent}</sup></td>
      <td>Calculate ${hintbase}<sup>${exponent}</sup> using exponentiation</td>
    </tr>`);

    steps.push(`
    <tr>
      <td>${steps.length + 1}</td>
      <td>${Array.from({ length: exponent }, () => hintbase).join(' * ')}</td>
      <td>Multiply ${hintbase} by itself ${exponent} times</td>
    </tr>`);

    steps.push(`
    <tr>
      <td>${steps.length + 1}</td>
      <td>Answer: ${answer}</td>
      <td>Simplify the fraction if possible</td>
    </tr>`);

    hint = `
<table border="1" cellpadding="5">
  <tr>
    <td colspan="2">Step</td>
    <td>Explanation</td>
  </tr>
  ${steps.join('')}
</table>`;
  } else {
    const countDecimals = (num: number): number => {
      if (Math.floor(num) === num) return 0;
      return num.toString().split('.')[1].length || 0;
    };

    const baseNum = (Math.floor(Math.random() * 20) + 1) * 0.01;
    exponent = Math.floor(Math.random() * 3) + 2;
    base = baseNum.toString();

    const decimalCount = countDecimals(baseNum);

    let result = 1;
    for (let i = 0; i < exponent; i++) {
      result *= baseNum;
    }
    answer = result.toFixed(decimalCount * exponent);

    hint = `
<table border="1" cellpadding="5">
  <tr>
    <td colspan="2">Step</td>
    <td>Explanation</td>
  </tr>
  <tr>
    <td>1</td>
    <td>${baseNum}<sup>${exponent}</sup></td>
    <td>Calculate ${baseNum}<sup>${exponent}</sup> using exponentiation</td>
  </tr>
  <tr>
    <td>2</td>
    <td>${Array(exponent).fill(baseNum).join(' * ')}</td>
    <td>Multiply ${baseNum} by itself ${exponent} times</td>
  </tr>
  <tr>
    <td>3</td>
    <td>Answer: ${answer}</td>
    <td>Display the result of the calculation</td>
  </tr>
</table>`;
  }

  const question = `Calculate ${base}<sup>${exponent}</sup>, keeping the answer as a fraction if the base is a fraction.`;

  const validate = (userInput: string): boolean => {
    return userInput.trim() === answer;
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// generateWriteEquationProblem — write equation from input/output table
// ---------------------------------------------------------------------------
export function generateWriteEquationProblem(): Problem {
  const input1 = Math.floor(Math.random() * 9) + 2;
  const operation1 = Math.floor(Math.random() * 3); // 0=addition, 1=subtraction, 2=multiplication
  const stepValue = Math.floor(Math.random() * 10) + 1;

  let output1: number, output2: number, output3: number;
  if (operation1 === 0) {
    output1 = input1 + stepValue;
    output2 = input1 * 2 + stepValue;
    output3 = input1 * 3 + stepValue;
  } else if (operation1 === 1) {
    output1 = input1 - stepValue;
    output2 = input1 * 2 - stepValue;
    output3 = input1 * 3 - stepValue;
  } else {
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
<table border="1" cellpadding="5" style="border-collapse:collapse;text-align:center;">
  <tr>
    <th>n</th>
    <th>&nbsp; Rule &nbsp;</th>
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

  const hint = `To solve, decide how y is changing per change in n.<br>
${output2} - (${output1}) = ${output2 - output1}     This is the change per n<br>
${output2 - output1}n                 Times the change per n <br>
${equation}`;

  const validate = (userInput: string): boolean => {
    const standardizedInput = userInput.replace(/\s+/g, '').toLowerCase();
    const standardizedAnswer = equation.replace(/\s+/g, '').toLowerCase();
    return standardizedInput === standardizedAnswer;
  };

  return { question, answer: equation, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------
export const EQUATIONS_GENERATORS = {
  translation: { generate: generateTranslationProblem },
  unknown: { generate: generateUnknownProblem },
  factor: { generate: generateFactorProblem },
  substitute: { generate: generateSubstituteProblem },
  substituteadvanced: { generate: generateSubstituteAdvancedProblem },
  distribute: { generate: generateDistributeProblem },
  solveforx: { generate: generateSolveForXProblem },
  exponent: { generate: generateExponentProblem },
  exponent2: { generate: generateExponent2Problem },
  writeequation: { generate: generateWriteEquationProblem },
};
