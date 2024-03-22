import * as helper from '../helper.utils';
import { Problem } from '../../models/problem.model';

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
