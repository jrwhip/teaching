import * as helper from '../helper.utils';
import { Problem } from '../../models/problem.model';

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
