import * as helper from '../helper.utils';
import { Problem } from '../../models/problem.model';

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
