import { Problem } from '../problem.model';
import { gcd, lcm, simplifyFraction, fracHtml, calculateGCF } from './helpers';

// ---------------------------------------------------------------------------
// Simplify Fractions
// ---------------------------------------------------------------------------

export function generateSimplifyProblem(): Problem {
  const num1 = Math.floor(Math.random() * 10) + 2;
  const num2 = Math.floor(Math.random() * 10) + 2;
  const num3 = Math.floor(Math.random() * 10) + 2;
  const num4 = num1 * num2;
  const num5 = num1 * num3;

  const commonFactor = calculateGCF(num4, num5);
  const simplifiedNumerator = num4 / commonFactor;
  const simplifiedDenominator = num5 / commonFactor;

  const question = `Simplify: ${fracHtml(num4, num5)} don't convert to a mixed number`;
  const answer = simplifiedNumerator + '/' + simplifiedDenominator;

  const hint = `<table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>
           GCF of ${num4} and ${num5} = ${commonFactor}
        </td>
        <td>
            Find the greatest common factor (GCF) of ${num4} and ${num5}.
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            ${fracHtml(num4, num5)} &divide;${fracHtml(commonFactor, commonFactor)} = ${fracHtml(num4 / commonFactor, num5 / commonFactor)}
        </td>
        <td>
            Divide the numerator and denominator by ${commonFactor}(GCF)
        </td>
    </tr>
    <tr>
        <td>3</td>
        <td>
            Simplified answer = ${fracHtml(simplifiedNumerator, simplifiedDenominator)}
        </td>
        <td>
            Finally, express the simplified fraction
        </td>
    </tr>
    ${simplifiedDenominator === 1 ? `
    <tr>
        <td>4</td>
        <td>
            ${simplifiedNumerator} = ${simplifiedNumerator}
        </td>
        <td>
            If the denominator is 1, the simplified result is simply the numerator
        </td>
    </tr>` : ''}
</table>`;

  const validate = (userInput: string): boolean => {
    const standardizedInput = userInput.trim().replace(/\s+/g, '');
    const [userNumerator, userDenominator] = standardizedInput.split('/').map(Number);

    const isFractionCorrect =
      userNumerator === simplifiedNumerator &&
      (simplifiedDenominator === 1 ? true : userDenominator === simplifiedDenominator);

    const isWholeNumberCorrect =
      simplifiedDenominator === 1 &&
      userNumerator === simplifiedNumerator &&
      (standardizedInput === `${simplifiedNumerator}` || userDenominator === undefined);

    return isFractionCorrect || isWholeNumberCorrect;
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// Add / Subtract Mixed Numbers (common denominators)
// ---------------------------------------------------------------------------

export function generateAddSubtractMixedProblem(): Problem {
  const isAddition = Math.random() < 0.5;
  let whole1 = Math.floor(Math.random() * 8) + 3;
  const fractionNumerator1 = Math.floor(Math.random() * 7) + 1;
  const fractionDenominator1 =
    fractionNumerator1 + Math.floor(Math.random() * (7 - fractionNumerator1)) + 1;

  const originalWhole1 = whole1;

  const whole2 = Math.floor(Math.random() * (whole1 - 1)) + 1;
  const fractionNumerator2 = Math.floor(Math.random() * 7) + 1;
  const fractionDenominator2 =
    fractionNumerator2 + Math.floor(Math.random() * (7 - fractionNumerator2)) + 1;

  const commonDenominator = lcm(fractionDenominator1, fractionDenominator2);
  let adjustedNumerator1 = fractionNumerator1 * (commonDenominator / fractionDenominator1);
  const originaladjustedNumerator1 = adjustedNumerator1;
  const adjustedNumerator2 = fractionNumerator2 * (commonDenominator / fractionDenominator2);

  let resultFractionNumerator: number;
  if (isAddition) {
    const totalNumerator = adjustedNumerator1 + adjustedNumerator2;
    if (totalNumerator >= commonDenominator) {
      whole1 += Math.floor(totalNumerator / commonDenominator);
      resultFractionNumerator = totalNumerator % commonDenominator;
    } else {
      resultFractionNumerator = totalNumerator;
    }
  } else {
    if (adjustedNumerator1 < adjustedNumerator2) {
      whole1 -= 1;
      adjustedNumerator1 += commonDenominator;
    }
    resultFractionNumerator = adjustedNumerator1 - adjustedNumerator2;
  }

  const gcdResult = calculateGCF(resultFractionNumerator, commonDenominator);
  const simplifiedNumerator = resultFractionNumerator / gcdResult;
  const simplifiedDenominator = commonDenominator / gcdResult;

  const resultWhole = isAddition ? whole1 + whole2 : whole1 - whole2;

  const finalGcd = calculateGCF(simplifiedNumerator, simplifiedDenominator);
  let finalNumerator = simplifiedNumerator / finalGcd;
  const finalDenominator = simplifiedDenominator / finalGcd;

  const finalWholePart = Math.floor(finalNumerator / finalDenominator);
  finalNumerator %= finalDenominator;

  let answer: string;
  if (finalNumerator === 0) {
    answer = `${resultWhole}`;
  } else {
    answer = `${resultWhole > 0 ? resultWhole + ' ' : ''}${finalNumerator}/${finalDenominator}`;
  }

  const question = `${originalWhole1}${fracHtml(fractionNumerator1, fractionDenominator1)}${isAddition ? ' + ' : ' - '} ${whole2}${fracHtml(fractionNumerator2, fractionDenominator2)}   Simplify your answer`;

  let hint = `<table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step:</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>
             Given ${originalWhole1}${fracHtml(fractionNumerator1, fractionDenominator1)} and  ${whole2}${fracHtml(fractionNumerator2, fractionDenominator2)} <br> LCM =  ${commonDenominator}
        </td>
        <td>
            Find a common denominator for ${fractionDenominator1} and ${fractionDenominator2} <br> LCM = ${commonDenominator}
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
             Adjust fractions to have a common denominator:<br>
             ${originalWhole1}${fracHtml(fractionNumerator1 + '  &bull;  ' + (commonDenominator / fractionDenominator1), fractionDenominator1 + '  &bull;  ' + (commonDenominator / fractionDenominator1))} = ${originalWhole1}${fracHtml(originaladjustedNumerator1, commonDenominator)} <br><br>
             ${whole2}${fracHtml(fractionNumerator2 + '  &bull;  ' + (commonDenominator / fractionDenominator2), fractionDenominator2 + '  &bull;  ' + (commonDenominator / fractionDenominator2))} = ${whole2}${fracHtml(adjustedNumerator2, commonDenominator)}
        <td>
           Multiply the numerator and denominator of each fraction so the denominator is ${commonDenominator}
        </td>
    </tr>`;

  if (!isAddition) {
    if (originaladjustedNumerator1 < adjustedNumerator2) {
      hint += `<tr>
        <td>3</td>
        <td>
            Borrow from the whole number, adjusting the numerator accordingly:<br>
            ${originalWhole1} ${fracHtml(originaladjustedNumerator1, commonDenominator)} =  ${originalWhole1 - 1} ${fracHtml(adjustedNumerator1, commonDenominator)} <br><br>
            ${originalWhole1 - 1} ${fracHtml(adjustedNumerator1, commonDenominator)} - ${whole2}${fracHtml(adjustedNumerator2, commonDenominator)} = ${originalWhole1 - whole2 - 1}${fracHtml(adjustedNumerator1 - adjustedNumerator2, commonDenominator)}
        </td>
        <td>
            Adjust for borrowing before subtracting the fractions.
        </td>
    </tr>`;
    } else {
      hint += `<tr>
        <td>3</td>
        <td>
            Subtract the fractions directly:<br>
            ${originalWhole1}${fracHtml(adjustedNumerator1, commonDenominator)} - ${whole2}${fracHtml(adjustedNumerator2, commonDenominator)}
            = ${originalWhole1 - whole2}${fracHtml(resultFractionNumerator, commonDenominator)}
        </td>
        <td>
            Subtract the numerators, while the denominator remains the same.
        </td>
    </tr>`;
    }
  } else {
    if (originaladjustedNumerator1 + adjustedNumerator2 >= commonDenominator) {
      hint += `<tr>
        <td>3</td>
        <td>
            ${originalWhole1}${fracHtml(originaladjustedNumerator1, commonDenominator)} +
            ${whole2}${fracHtml(adjustedNumerator2, commonDenominator)} = ${originalWhole1 + whole2} ${fracHtml(originaladjustedNumerator1 + adjustedNumerator2, commonDenominator)} = ${originalWhole1 + whole2 + 1} ${fracHtml(originaladjustedNumerator1 + adjustedNumerator2 - commonDenominator, commonDenominator)}
        </td>
        <td>
            Convert excess fraction part into a whole number, adjusting the numerator accordingly.
        </td>
    </tr>`;
    } else {
      hint += `<tr>
        <td>3</td>
        <td>
            Add the fractions directly:<br>
            ${originalWhole1}${fracHtml(adjustedNumerator1, commonDenominator)} + ${whole2}${fracHtml(adjustedNumerator2, commonDenominator)}
            = ${originalWhole1 + whole2}${fracHtml(resultFractionNumerator, commonDenominator)}
        </td>
        <td>
            Add the numerators, while the denominator remains the same.
        </td>
    </tr>`;
    }
  }

  hint += `<tr>
    <td>4</td>
    <td>
         Simplify the result, if possible. <br>
        ${resultWhole}${fracHtml(resultFractionNumerator, commonDenominator * finalGcd)} = ${resultWhole}${fracHtml(finalNumerator, finalDenominator)}
    </td>
    <td>
        The result of the operation is simplified, ensuring the fraction is in its simplest form. This makes it easier to understand and work with.
    </td>
</tr>`;

  if (finalNumerator === 0) {
    hint += `<tr>
        <td>5</td>
        <td>
            ${resultWhole}${fracHtml(finalNumerator, finalDenominator)} = ${resultWhole}.
        </td>
        <td>
            Since the final numerator is 0, the fraction reduces to just the whole number value, simplifying the result.
        </td>
    </tr>`;
  }

  hint += `</table></table>`;

  const validate = (userInput: string): boolean => {
    return userInput.trim() === answer;
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// Mixed Number -> Improper Fraction
// ---------------------------------------------------------------------------

export function generateMixedToImproperProblem(): Problem {
  const whole = Math.floor(Math.random() * 5) + 1;
  const fractionNumerator = Math.floor(Math.random() * 8) + 1;
  const fractionDenominator =
    Math.floor(Math.random() * (8 - fractionNumerator)) + fractionNumerator + 1;
  const improperNumerator = whole * fractionDenominator + fractionNumerator;

  const simplified = simplifyFraction(improperNumerator, fractionDenominator);
  const needsSimplification =
    simplified.numerator !== improperNumerator || simplified.denominator !== fractionDenominator;

  const question = `Convert ${whole}${fracHtml(fractionNumerator, fractionDenominator)} to a simplified improper fraction`;

  let hint = `<table border="0" cellpadding="1">
    <tr>
       <td></td>
        <td style="text-align: center; ">${whole}</td>
        <td>+</td>
        <td>${fracHtml(fractionNumerator, fractionDenominator)}</td>
        <td>
    </tr>
    <tr>
       <td></td>
        <td style="text-align: center; ">&#8595;</td>
        <td></td>
        <td> &#8595;</td>
        <td>
    </tr>
    <tr>
        <td></td>
        <td style="text-align: center; ">${fracHtml(whole * fractionDenominator, fractionDenominator)}</td>
        <td>+</td>
        <td>${fracHtml(fractionNumerator, fractionDenominator)}= ${fracHtml(improperNumerator, fractionDenominator)}</td>
    </tr>`;

  if (needsSimplification) {
    hint += `<tr>
        <td colspan="3" style="text-align: center;">&#8595;</td>
    </tr>
    <tr>
        <td>4</td>
        <td>
            ${fracHtml(improperNumerator, fractionDenominator)} = ${fracHtml(simplified.numerator, simplified.denominator)}
        </td>
        <td>
            Simplify the fraction if possible.
        </td>
    </tr>
</table>`;
  }

  const answer = `${simplified.numerator}/${simplified.denominator}`;

  const validate = (userInput: string): boolean => {
    const inputFraction = userInput.trim().split('/');
    const inputNumerator = parseInt(inputFraction[0], 10);
    const inputDenominator = inputFraction.length > 1 ? parseInt(inputFraction[1], 10) : 1;

    return inputNumerator === simplified.numerator && inputDenominator === simplified.denominator;
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// Improper Fraction -> Mixed Number
// ---------------------------------------------------------------------------

export function generateImproperToMixedProblem(): Problem {
  const denominator = Math.floor(Math.random() * 9) + 2;
  let numerator = Math.floor(Math.random() * 30) + 10;
  let remainingNumerator = numerator % denominator;

  if (remainingNumerator === 0) {
    numerator += 1;
    remainingNumerator = numerator % denominator;
  }

  const wholePart = Math.floor(numerator / denominator);

  const question = `Convert ${fracHtml(numerator, denominator)} to a mixed number`;
  const answer = `${wholePart} ${remainingNumerator}/${denominator}`;

  const hint = `Divide the fraction <br><br>
      <table cellspacing="0">
    <tr>
        <td></td>
        <td style="text-align: right;">${wholePart}</td>
        <td>Whole</td>
    </tr>
    <tr>
        <td>${denominator}</td>
        <td style="border-left: 1px solid black; border-top: 1px solid black;">${numerator}</td>
        <td></td>
    </tr>
    <tr>
        <td style="border-top: none;"></td>
        <td style="text-align: right;border-bottom: 1px solid black;">${wholePart * denominator}</td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td style="text-align: right;">${numerator - wholePart * denominator}</td>
        <td>New numerator</td>
    </tr>
</table>

<br>This gives you ${wholePart}${fracHtml(remainingNumerator, denominator)} as the mixed number
`;

  const validate = (userInput: string): boolean => {
    return userInput.trim() === answer;
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// Whole Number x Mixed Fraction
// ---------------------------------------------------------------------------

export function generateWholeTimesMixedProblem(): Problem {
  const wholeNumberM = Math.floor(Math.random() * 9) + 2;

  const mixedWhole = Math.floor(Math.random() * 5) + 1;
  const mixedFractionNumerator = Math.floor(Math.random() * 7) + 1;
  const mixedFractionDenominator =
    mixedFractionNumerator + Math.floor(Math.random() * (8 - mixedFractionNumerator)) + 1;

  const productWholePart = wholeNumberM * mixedWhole;
  const productFractionNumerator = wholeNumberM * mixedFractionNumerator;
  const productFractionDenominator = mixedFractionDenominator;

  const greatestCommonDivisorM = calculateGCF(productFractionNumerator, productFractionDenominator);
  const simplifiedNumeratorM = productFractionNumerator / greatestCommonDivisorM;
  const simplifiedDenominatorM = productFractionDenominator / greatestCommonDivisorM;

  const additionalWholePart = Math.floor(simplifiedNumeratorM / simplifiedDenominatorM);
  const remainingNumeratorM = simplifiedNumeratorM % simplifiedDenominatorM;
  const totalWholePart = productWholePart + additionalWholePart;
  const finalAnswer =
    remainingNumeratorM > 0
      ? `${totalWholePart} ${remainingNumeratorM}/${simplifiedDenominatorM}`
      : `${totalWholePart}`;

  const question = `Multiply the whole number by the mixed fraction: ${wholeNumberM} \u00D7 ${mixedWhole}${fracHtml(mixedFractionNumerator, mixedFractionDenominator)}`;

  const hint = `<table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>
            ${wholeNumberM}&bull;${mixedWhole}${fracHtml(mixedFractionNumerator, mixedFractionDenominator)}
        </td>
        <td>
            Break apart the mixed number.
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            ${wholeNumberM}(${mixedWhole} + ${fracHtml(mixedFractionNumerator, mixedFractionDenominator)})
        </td>
        <td>
            Distribute the multiplication over the mixed number.
        </td>
    </tr>
    <tr>
        <td>3</td>
        <td>
            ${wholeNumberM}&bull;${mixedWhole} + ${wholeNumberM}&bull;${fracHtml(mixedFractionNumerator, mixedFractionDenominator)}
        </td>
        <td>
            Multiply each part of the mixed number by the whole number.
        </td>
    </tr>
    <tr>
        <td>4</td>
        <td>
            ${productWholePart} + ${fracHtml(productFractionNumerator, productFractionDenominator)}
        </td>
        <td>
            Multiply to find the product of the whole number and the mixed number parts.
        </td>
    </tr>
    <tr>
        <td>5</td>
        <td>
            ${productWholePart} + ${additionalWholePart} ${remainingNumeratorM ? fracHtml(remainingNumeratorM, simplifiedDenominatorM) : ''}
        </td>
        <td>
            Convert the improper fraction to a mixed number and simplify if possible. ${remainingNumeratorM ? '' : 'No fractional part remains.'}
        </td>
    </tr>
    <tr>
        <td>6</td>
        <td>
            ${productWholePart + additionalWholePart} ${remainingNumeratorM ? fracHtml(remainingNumeratorM, simplifiedDenominatorM) : ''}
        </td>
        <td>
            Add the whole numbers to complete the multiplication. ${remainingNumeratorM ? '' : 'No fractional part remains.'}
        </td>
    </tr>
</table>
`;

  const validate = (userInput: string): boolean => {
    const inputRegex = /^(\d+)(?:\s+(\d+)\/(\d+))?$/;
    const match = userInput.match(inputRegex);

    if (!match) {
      return false;
    }

    const inputWholeNumber = parseInt(match[1], 10);
    const inputNumerator = match[2] ? parseInt(match[2], 10) : 0;
    const inputDenominator = match[3] ? parseInt(match[3], 10) : 1;

    return (
      inputWholeNumber === totalWholePart &&
      inputNumerator === remainingNumeratorM &&
      inputDenominator === simplifiedDenominatorM
    );
  };

  return { question, answer: finalAnswer, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// Divide Fractions (keep-change-flip)
// ---------------------------------------------------------------------------

export function generateDivideFractionsProblem(): Problem {
  const numerator1 = Math.floor(Math.random() * 8) + 1;
  const denominator1 = Math.floor(Math.random() * (8 - numerator1)) + numerator1 + 1;

  const numerator2 = Math.floor(Math.random() * 8) + 1;
  const denominator2 = Math.floor(Math.random() * (8 - numerator2)) + numerator2 + 1;

  const productNumerator = numerator1 * denominator2;
  const productDenominator = denominator1 * numerator2;

  const simplifiedAnswer = simplifyFraction(productNumerator, productDenominator);

  const wholePart = Math.floor(simplifiedAnswer.numerator / simplifiedAnswer.denominator);
  const remainingNumerator = simplifiedAnswer.numerator % simplifiedAnswer.denominator;

  let answer: string;
  if (wholePart > 0 && remainingNumerator > 0) {
    answer = `${wholePart} ${remainingNumerator}/${simplifiedAnswer.denominator}`;
  } else if (wholePart > 0) {
    answer = `${wholePart}`;
  } else {
    answer = `${simplifiedAnswer.numerator}/${simplifiedAnswer.denominator}`;
  }

  const question = `Divide ${fracHtml(numerator1, denominator1)} &divide; ${fracHtml(numerator2, denominator2)}, and write your answer as a simplified fraction or a mixed number.`;

  let hint = `<table border="1" cellpadding="5">
<tr>
    <td colspan="2">Step</td>
    <td>Explanation</td>
</tr>
<tr>
    <td>1</td>
    <td>
        ${fracHtml(numerator1, denominator1)} &divide;
        ${fracHtml(numerator2, denominator2)}
    </td>
    <td>
        Starting expression for division of fractions.
    </td>
</tr>
<tr>
    <td>2</td>
    <td>
        ${fracHtml(numerator1, denominator1)} &bull;
        ${fracHtml(denominator2, numerator2)}
    </td>
    <td>
        Multiply by the reciprocal of the second fraction.
    </td>
</tr>
<tr>
    <td>3</td>
    <td>
        ${fracHtml(numerator1 + ' &bull; ' + denominator2, denominator1 + ' &bull; ' + numerator2)} =
        ${fracHtml(productNumerator, productDenominator)}
    </td>
    <td>
        Perform the multiplication to find the product.
    </td>
</tr>
<tr>
    <td>4</td>
    <td>
        ${fracHtml(productNumerator, productDenominator)} =
        ${fracHtml(simplifiedAnswer.numerator, simplifiedAnswer.denominator)}
    </td>
    <td>
        Simplify the fraction if possible.
    </td>
</tr>
`;
  if (simplifiedAnswer.denominator === 1) {
    hint += `<tr>
    <td>5</td>
    <td>${simplifiedAnswer.numerator}</td>
    <td>The denominator is 1, indicating the value is a whole number.</td>
</tr>`;
  }
  if (wholePart > 0 && remainingNumerator > 0) {
    hint += `<tr>
    <td>5</td>
    <td>
        ${fracHtml(simplifiedAnswer.numerator, simplifiedAnswer.denominator)} = ${answer}
    </td>
    <td>
        Convert to a mixed number if the fraction is improper.
    </td>
</tr>`;
  }
  hint += `</table>`;

  const validate = (userInput: string): boolean => {
    return userInput.trim() === answer;
  };

  return { question, answer, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// Divide Mixed Numbers
// ---------------------------------------------------------------------------

export function generateDivideMixedNumbersProblem(): Problem {
  const whole1 = Math.floor(Math.random() * 4) + 1;
  const fractionDenominator1 = Math.floor(Math.random() * 7) + 3;
  const fractionNumerator1 = Math.floor(Math.random() * (fractionDenominator1 - 2)) + 1;

  const whole2 = Math.floor(Math.random() * 3) + 1;
  const fractionDenominator2 = Math.floor(Math.random() * 7) + 3;
  const fractionNumerator2 = Math.floor(Math.random() * (fractionDenominator2 - 2)) + 1;

  const improperNumerator1 = whole1 * fractionDenominator1 + fractionNumerator1;
  const improperDenominator1 = fractionDenominator1;
  const improperNumerator2 = whole2 * fractionDenominator2 + fractionNumerator2;
  const improperDenominator2 = fractionDenominator2;

  const answerNumerator = improperNumerator1 * improperDenominator2;
  const answerDenominator = improperDenominator1 * improperNumerator2;
  const simplifiedAnswer = simplifyFraction(answerNumerator, answerDenominator);

  const question = `Divide the mixed numbers: ${whole1}${fracHtml(fractionNumerator1, fractionDenominator1)} \u00F7 ${whole2}${fracHtml(fractionNumerator2, fractionDenominator2)}`;

  const hint = `<table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>
            Convert ${whole1}${fracHtml(fractionNumerator1, fractionDenominator1)} to ${fracHtml(improperNumerator1, improperDenominator1)}   <br>
            Convert ${whole2}${fracHtml(fractionNumerator2, fractionDenominator2)} to ${fracHtml(improperNumerator2, improperDenominator2)}
        </td>
        <td>
            First, convert the mixed numbers to improper fractions.
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            ${fracHtml(improperNumerator1, improperDenominator1)} &bull; ${fracHtml(improperDenominator2, improperNumerator2)}
        </td>
        <td>
            Then, flip the second fraction and multiply.
        </td>
    </tr>
    <tr>
        <td>3</td>
        <td>
           ${fracHtml(improperNumerator1 + '&bull;' + improperDenominator2, improperDenominator1 + '&bull;' + improperNumerator2)} = ${fracHtml(answerNumerator, answerDenominator)}
        </td>
        <td>
            Calculate the multiplication to get the preliminary answer.
        </td>
    </tr>
    <tr>
        <td>4</td>
        <td>
            ${fracHtml(answerNumerator, answerDenominator)} = ${fracHtml(simplifiedAnswer.numerator, simplifiedAnswer.denominator)}
        </td>
        <td>
            Finally, simplify the result.
        </td>
    </tr>
</table>
`;

  const validate = (userInput: string): boolean => {
    let userNumerator: number;
    let userDenominator: number;
    let wholePart = 0;

    const parts = userInput.split(' ');

    if (parts.length === 1) {
      const [numStr, denStr] = parts[0].split('/').map(Number);
      userNumerator = numStr;
      userDenominator = denStr;
    } else if (parts.length === 2) {
      wholePart = parseInt(parts[0], 10);
      const [numStr, denStr] = parts[1].split('/').map(Number);
      userNumerator = numStr;
      userDenominator = denStr;
    } else {
      return false;
    }

    // Convert mixed number to improper fraction
    userNumerator = userNumerator + wholePart * userDenominator;

    return (
      userNumerator === simplifiedAnswer.numerator &&
      userDenominator === simplifiedAnswer.denominator
    );
  };

  return {
    question,
    answer: `${simplifiedAnswer.numerator}/${simplifiedAnswer.denominator}`,
    hint,
    validate,
    needsExtraInput: false,
  };
}

// ---------------------------------------------------------------------------
// Fraction -> Decimal
// ---------------------------------------------------------------------------

export function generateFractionToDecimalProblem(): Problem {
  const whole = Math.floor(Math.random() * 10) + 1;
  const denom = Math.random() < 0.5 ? 10 : 100;
  const numer = Math.floor(Math.random() * (denom - 1)) + 1;

  const decimalPart =
    denom === 10 ? String(numer).padStart(1, '0') : String(numer).padStart(2, '0');

  const decimalAnswer = `${whole}.${decimalPart}`;
  const question = `Write the mixed number as a decimal: ${whole} ${fracHtml(numer, denom)}`;

  const placeName = denom === 10 ? 'tenths' : 'hundredths';
  const underlined =
    denom === 10
      ? `<u>${decimalPart[0]}</u>`
      : `<u>${decimalPart[0]}</u>${decimalPart[1] ? decimalPart[1] : ''}`;

  const hint = `
  Convert the fractional part to decimal using place value:<br><br>
  <table border="1" cellpadding="6" style="border-collapse:collapse; text-align:center;">
    <tr><th>Step</th><th>Work</th><th>Why</th></tr>
    <tr>
      <td>1</td>
      <td>${fracHtml(numer, denom)} = ${denom === 10 ? (numer / 10).toFixed(1) : (numer / 100).toFixed(2)}</td>
      <td>Denominator ${denom} means ${placeName} place.</td>
    </tr>
    <tr>
      <td>2</td>
      <td>${whole} + ${denom === 10 ? (numer / 10).toFixed(1) : (numer / 100).toFixed(2)} = <strong>${decimalAnswer}</strong></td>
      <td>Write the mixed number as a decimal.</td>
    </tr>
    <tr>
      <td>3</td>
      <td style="white-space:nowrap">${whole}.<span style="border:1px solid #000; padding:2px">${underlined}</span>${denom === 100 && decimalPart[1] ? `<span>${decimalPart[1]}</span>` : ''}</td>
      <td>The digit(s) after the decimal go to the ${placeName}.</td>
    </tr>
  </table>`;

  const validate = (userInput: string): boolean => {
    const cleaned = (userInput || '').trim();
    return !isNaN(Number(cleaned)) && parseFloat(cleaned) === parseFloat(decimalAnswer);
  };

  return { question, answer: decimalAnswer, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// Decimal -> Fraction
// ---------------------------------------------------------------------------

export function generateDecimalToFractionProblem(): Problem {
  const denominator = Math.random() < 0.5 ? 10 : 100;
  const wholeNumber = Math.floor(Math.random() * 10) + 1;
  const numerator = Math.floor(Math.random() * denominator);

  const rawFraction =
    numerator === 0 ? `${wholeNumber}` : `${wholeNumber} ${numerator}/${denominator}`;

  const g = gcd(numerator, denominator);
  const simpNum = numerator / g;
  const simpDen = denominator / g;

  const simplifiedFraction =
    numerator === 0
      ? `${wholeNumber}`
      : simpDen === 1
        ? `${wholeNumber + simpNum}`
        : `${wholeNumber} ${simpNum}/${simpDen}`;

  const decimalValue = (wholeNumber + numerator / denominator).toFixed(
    denominator === 10 ? 1 : 2,
  );

  const question = `Write ${decimalValue} as a fraction (simplify if possible).`;

  const hint = `
  <table border="1" cellpadding="5">
    <tr><td>Step</td><td>Explanation</td></tr>
    <tr>
      <td>${decimalValue}</td>
      <td>Look at the place value. Digits after the decimal give the numerator, and denominator is ${denominator}.</td>
    </tr>
    <tr>
      <td>${rawFraction}</td>
      <td>That's the raw fraction form.</td>
    </tr>
    <tr>
      <td>${simplifiedFraction}</td>
      <td>Now simplify by dividing top and bottom by ${g}.</td>
    </tr>
  </table>
  `;

  const validate = (userInput: string): boolean => {
    const standardized = userInput.trim().replace(/\s+/g, '');
    const correctRaw = rawFraction.replace(/\s+/g, '');
    const correctSimp = simplifiedFraction.replace(/\s+/g, '');

    return standardized === correctRaw || standardized === correctSimp;
  };

  return { question, answer: simplifiedFraction, hint, validate, needsExtraInput: false };
}

// ---------------------------------------------------------------------------
// Aggregated export
// ---------------------------------------------------------------------------

export const FRACTIONS_GENERATORS = {
  simplify: { generate: generateSimplifyProblem },
  addsubtractmixed: { generate: generateAddSubtractMixedProblem },
  mixedtoimproper: { generate: generateMixedToImproperProblem },
  impropertomixed: { generate: generateImproperToMixedProblem },
  wholetimesmixed: { generate: generateWholeTimesMixedProblem },
  dividefractions: { generate: generateDivideFractionsProblem },
  dividemixednumbers: { generate: generateDivideMixedNumbersProblem },
  fractiontodecimal: { generate: generateFractionToDecimalProblem },
  decimaltofraction: { generate: generateDecimalToFractionProblem },
};
