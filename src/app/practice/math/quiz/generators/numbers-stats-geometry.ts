import { Problem } from '../problem.model';
import { gcd, calculateGCF, calculateLCM, randInt } from './helpers';

// ── Numbers ──────────────────────────────────────────────────────────

export function generateAbsoluteValueProblem(): Problem {
  const num = randInt(-10, 10);
  const isNegated = Math.random() < 0.5;

  const question = `What is ${isNegated ? '-' : ''}|${num}|?`;
  const answer = isNegated ? -Math.abs(num) : Math.abs(num);

  let hint =
    'The absolute value of a number is its distance from 0 on the number line, regardless of direction.<br><br>';

  if (isNegated) {
    hint += `1. The question shows -|${num}|, which means we take the negative of the absolute value of ${num}.<br>`;
    hint += `2. The absolute value of ${num} is ${Math.abs(num)}, because it's ${Math.abs(num)} units away from 0 on the number line.<br>`;
    hint += `3. Since we're taking the negative of the absolute value, the answer is -${Math.abs(num)}.`;
  } else {
    hint += `1. The question shows |${num}|, which is asking for the absolute value of ${num}.<br>`;
    hint += `2. The absolute value of ${num} is ${Math.abs(num)}, because it's ${Math.abs(num)} units away from 0 on the number line, without considering direction.<br>`;
    hint += `3. So, the answer is ${Math.abs(num)}, which is the absolute distance from 0.`;
  }

  const validate = (userInput: string): boolean => {
    return parseFloat(userInput) === answer;
  };

  return { question, answer: answer.toString(), hint, validate, needsExtraInput: false };
}

export function generateOppositesProblem(): Problem {
  const num = randInt(-10, 10);
  const questionType: 'opposite' | 'opposite of the opposite' =
    Math.random() < 0.5 ? 'opposite' : 'opposite of the opposite';

  let hint = '';
  if (questionType === 'opposite') {
    hint += `The opposite of a number is the same distance from 0 on the number line, but in the opposite direction. `;
    hint += `So, the opposite of ${num} is ${-num}.`;
  } else {
    hint += `First, find the opposite of ${num}, which is ${-num}. <br>`;
    hint += `Then, to find the opposite of the opposite, you just go back to the original number. <br>`;
    hint += `Think of it as taking two steps in one direction and then two steps back to where you started. <br>`;
    hint += `So, the opposite of the opposite of ${num} is back to ${num} itself.`;
  }

  const question = `What is the ${questionType === 'opposite' ? 'opposite' : 'opposite of the opposite'} of ${num}?`;
  const answer = questionType === 'opposite' ? -num : num;

  const validate = (userInput: string): boolean => {
    return parseFloat(userInput) === answer;
  };

  return { question, answer: answer.toString(), hint, validate, needsExtraInput: false };
}

export function generateLCMProblem(): Problem {
  let num1 = randInt(2, 11);
  let num2 = randInt(2, 12);

  while (num1 === num2) {
    num2 = randInt(2, 12);
  }

  const lcmValue = calculateLCM(num1, num2);

  const multiplesOfNum1: number[] = [];
  const multiplesOfNum2: number[] = [];
  let index = 1;

  while (!multiplesOfNum1.includes(lcmValue) || !multiplesOfNum2.includes(lcmValue)) {
    const multiple1 = num1 * index;
    const multiple2 = num2 * index;

    if (multiple1 <= lcmValue || multiplesOfNum1.length < 5) {
      multiplesOfNum1.push(multiple1);
    }
    if (multiple2 <= lcmValue || multiplesOfNum2.length < 5) {
      multiplesOfNum2.push(multiple2);
    }

    index++;
  }

  const hint = `
<p>To find the LCM of ${num1} and ${num2}, list the multiples of each number.</p>
<table border="1" cellpadding="5">
    <tr>
        <td colspan="2">Step</td>
        <td>Explanation</td>
    </tr>
    <tr>
        <td>1</td>
        <td>
            Multiples of ${num1}: ${multiplesOfNum1.join(', ')}
        </td>
        <td>
            List all multiples of ${num1} up to a certain limit or until the LCM is found.
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            Multiples of ${num2}: ${multiplesOfNum2.join(', ')}
        </td>
        <td>
            List all multiples of ${num2} up to a certain limit or until the LCM is found.
        </td>
    </tr>
    <tr>
        <td>3</td>
        <td>
            LCM: ${lcmValue}
        </td>
        <td>
            The smallest number that is a multiple of both ${num1} and ${num2} is their LCM.
        </td>
    </tr>
</table>`;

  const validate = (userInput: string): boolean => {
    return parseInt(userInput, 10) === lcmValue;
  };

  return {
    question: `Find the LCM of ${num1} and ${num2}`,
    answer: lcmValue.toString(),
    hint,
    validate,
    needsExtraInput: false,
  };
}

export function generateGCFProblem(): Problem {
  const gcfCalc = (a: number, b: number): number => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  let numA: number;
  let numB: number;
  let gcfValue: number;
  let attempts = 0;

  const patternChoice = Math.random() < 1 / 3 ? 'random' : 'factorized';

  if (patternChoice === 'random') {
    do {
      numA = randInt(10, 40);
      numB = randInt(10, 80);
    } while (numA === numB);
    gcfValue = gcfCalc(numA, numB);
  } else {
    do {
      attempts++;

      const n1 = randInt(2, 9);
      const n2 = randInt(1, 8);
      const n3 = randInt(1, 5);
      const n4 = n3 + 1;

      numA = n1 * n2 * n3;
      numB = n1 * n2 * n4;

      gcfValue = gcfCalc(numA, numB);

      while (Math.abs(numB - numA) === gcfValue && numB <= 100) {
        numB += gcfValue;
        gcfValue = gcfCalc(numA, numB);
      }

      if (attempts > 10) {
        break;
      }
    } while (numA > 100 || numB > 100 || gcfValue === 1);
  }

  const originalNumA = numA!;
  const originalNumB = numB!;
  const finalGcf = gcfValue!;

  // Build the step-by-step division hint
  const hint = (() => {
    const steps: Array<{ divisor: number; factorA: number; factorB: number }> = [];
    let remainingA = originalNumA;
    let remainingB = originalNumB;
    let divisor = 2;
    const divisors: number[] = [];

    while (divisor <= Math.min(remainingA, remainingB)) {
      if (remainingA % divisor === 0 && remainingB % divisor === 0) {
        divisors.push(divisor);
        steps.push({
          divisor,
          factorA: remainingA / divisor,
          factorB: remainingB / divisor,
        });
        remainingA /= divisor;
        remainingB /= divisor;
      } else {
        divisor++;
      }
    }

    let hintA = originalNumA;
    let hintB = originalNumB;

    let hintHTML = `
<p>Find the Greatest Common Factor (GCF) of the numbers by determining common factors.</p>
<table border="1" cellpadding="5">
    <tr>
        <td>Step</td>
        <td>Calculation</td>
        <td>Explanation</td>
    </tr>`;

    steps.forEach((step, i) => {
      hintHTML += `
    <tr>
        <td>${i + 1}</td>
        <td>
            ${hintA} \u00F7 ${step.divisor} = ${step.factorA}<br>
            ${hintB} \u00F7 ${step.divisor} = ${step.factorB}
        </td>
        <td>
            Divide both numbers by ${step.divisor}, a common factor.
        </td>
    </tr>`;
      hintA = step.factorA;
      hintB = step.factorB;
    });

    hintHTML += `
    <tr>
        <td>${steps.length + 1}</td>
        <td>
            Remaining numbers: ${remainingA}, ${remainingB}
        </td>
        <td>
            No further common factors exist. The divisors were: ${divisors.join(' \u00D7 ')}.<br>
            Multiply these to find the GCF: ${divisors.join(' \u00D7 ')} = ${finalGcf}.
        </td>
    </tr>
    <tr>
        <td>Final</td>
        <td>
            GCF = ${finalGcf}
        </td>
        <td>
            The Greatest Common Factor of the original numbers is ${finalGcf}.
        </td>
    </tr>
</table>`;

    return hintHTML;
  })();

  const validate = (userInput: string): boolean => {
    return parseInt(userInput, 10) === finalGcf;
  };

  return {
    question: `Find the GCF of ${originalNumA} and ${originalNumB}`,
    answer: finalGcf.toString(),
    hint,
    validate,
    needsExtraInput: false,
  };
}

// ── Statistics ────────────────────────────────────────────────────────

export function generateMeanProblem(): Problem {
  const numbers = Array.from(
    { length: 5 + Math.floor(Math.random() * 5) },
    () => randInt(1, 20)
  );
  const total = numbers.reduce((a, b) => a + b, 0);
  const mean = total / numbers.length;

  const hint =
    `To find the mean (average) of a set of numbers:<br>` +
    `1. Add all the numbers together.<br>` +
    `2. Divide the total by the number of items in the set.<br>` +
    `For example, for these numbers: ${numbers.join(', ')},<br>` +
    `1. Total = ${total}.<br>` +
    `2. Number of items = ${numbers.length}.<br>` +
    `3. Mean is the Total / Number of items: ${total} / ${numbers.length} = ${mean}.`;

  const validate = (userInput: string): boolean => {
    return parseFloat(userInput).toFixed(2) === mean.toFixed(2);
  };

  return {
    question: `Find the mean of these numbers: ${numbers.join(', ')}. Round your answer to the nearest hundredth.`,
    answer: mean.toFixed(2),
    hint,
    validate,
    needsExtraInput: false,
  };
}

export function generateMedianProblem(): Problem {
  const numbers = Array.from(
    { length: 5 + Math.floor(Math.random() * 5) },
    () => randInt(1, 20)
  );

  const sorted = [...numbers].sort((a, b) => a - b);
  const isEven = sorted.length % 2 === 0;
  const midIndex = Math.floor(sorted.length / 2);
  const median = isEven
    ? (sorted[midIndex - 1] + sorted[midIndex]) / 2
    : sorted[midIndex];

  const hint =
    `To find the median:<br>` +
    `1. Arrange the numbers in ascending order. For example, sort the numbers:<br>` +
    `&nbsp;&nbsp;&nbsp;Unsorted: ${numbers.join(', ')}<br>` +
    `&nbsp;&nbsp;&nbsp;Sorted: ${sorted.join(', ')}<br>` +
    `2. If there's an odd number of items, the median is the middle number.<br>` +
    `3. If there's an even number of items, the median is the average of the two middle numbers.<br>` +
    `4. This set is ${isEven ? 'even' : 'odd'}, so ${isEven ? `average the two middle numbers (${sorted[midIndex - 1]} and ${sorted[midIndex]})` : `the middle number is ${sorted[midIndex]}`}.<br>` +
    `5. ${isEven ? `(${sorted[midIndex - 1]} + ${sorted[midIndex]}) / 2 = ${median}` : `The median is ${median}`}.`;

  const validate = (userInput: string): boolean => {
    const userAnswer = parseFloat(userInput);
    if (numbers.length % 2 !== 0) {
      return userAnswer === median;
    }
    return userAnswer.toFixed(2) === median.toFixed(2);
  };

  return {
    question: `Find the median of these numbers: ${numbers.join(', ')}.`,
    answer: median.toFixed(2),
    hint,
    validate,
    needsExtraInput: false,
  };
}

export function generateModeProblem(): Problem {
  const numbers = Array.from(
    { length: 5 + Math.floor(Math.random() * 5) },
    () => randInt(1, 20)
  );

  const frequency: Record<number, number> = {};
  let maxFreq = 0;

  numbers.forEach((num) => {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFreq) {
      maxFreq = frequency[num];
    }
  });

  let mode: number[] = Object.entries(frequency)
    .filter(([, freq]) => freq === maxFreq)
    .map(([num]) => Number(num));

  // If every number appears the same number of times, there is no mode
  const allSameFrequency = Object.values(frequency).every((f) => f === maxFreq);
  if (allSameFrequency && mode.length === Object.keys(frequency).length) {
    mode = [];
  }

  mode.sort((a, b) => a - b);

  const hint =
    `To find the mode, determine which number(s) appear most frequently. If no number appears more frequently than others, there is no mode.`;

  const validate = (userInput: string): boolean => {
    const userAnswers = userInput
      .split(',')
      .map((s) => s.trim())
      .sort();
    const correctAnswers = mode.length ? mode.map(String).sort() : ['none'];
    return (
      userAnswers.length === correctAnswers.length &&
      userAnswers.every((value, i) => value === correctAnswers[i])
    );
  };

  return {
    question: `Find the mode of these numbers: ${numbers.join(', ')}. If there is no mode, type 'none'.`,
    answer: mode.length ? mode.join(', ') : 'none',
    hint,
    validate,
    needsExtraInput: false,
  };
}

export function generateRangeProblem(): Problem {
  const numbers = Array.from(
    { length: 5 + Math.floor(Math.random() * 5) },
    () => randInt(1, 20)
  );
  const minNum = Math.min(...numbers);
  const maxNum = Math.max(...numbers);
  const range = maxNum - minNum;

  const hint =
    `To find the range, identify the smallest and largest numbers in the set.<br>` +
    `For your numbers: ${numbers.join(', ')},<br>` +
    `The smallest number is ${minNum}, and the largest number is ${maxNum}.<br>` +
    `Subtract the smallest number from the largest number to find the range: ${maxNum} - ${minNum} = ${range}.`;

  const validate = (userInput: string): boolean => {
    return parseInt(userInput, 10) === range;
  };

  return {
    question: `Find the range of these numbers: ${numbers.join(', ')}.`,
    answer: range.toString(),
    hint,
    validate,
    needsExtraInput: false,
  };
}

export function generateFirstQuartileProblem(): Problem {
  const numbers = Array.from(
    { length: 7 + Math.floor(Math.random() * 5) },
    () => randInt(1, 20)
  );

  const sorted = [...numbers].sort((a, b) => a - b);
  const q1Index = Math.floor((sorted.length - 1) / 4);
  const q1 = sorted[q1Index];

  const hint =
    `To find the first quartile (Q1), first arrange the numbers in ascending order. ` +
    `Then divide the dataset into four equal parts. ` +
    `Q1 is the median of the first half of the dataset.<br>` +
    `For your numbers (sorted): ${sorted.join(', ')},<br>` +
    `Q1 is the value at the ${Math.floor(sorted.length / 4) + 1}th position when sorted, ` +
    `which is ${q1}.`;

  const validate = (userInput: string): boolean => {
    return parseFloat(userInput) === q1;
  };

  return {
    question: `Find the first quartile (Q1) of these numbers: ${numbers.join(', ')}.`,
    answer: q1.toString(),
    hint,
    validate,
    needsExtraInput: false,
  };
}

export function generateThirdQuartileProblem(): Problem {
  const numbers = Array.from(
    { length: 7 + Math.floor(Math.random() * 5) },
    () => randInt(1, 20)
  );

  const sorted = [...numbers].sort((a, b) => a - b);
  const q3Index = Math.ceil((3 * (sorted.length - 1)) / 4);
  const q3 = sorted[q3Index];

  const hint =
    `To find the third quartile (Q3), first arrange the numbers in ascending order. ` +
    `Then divide the dataset into four equal parts. ` +
    `Q3 is the median of the second half of the dataset.<br>` +
    `For your numbers (sorted): ${sorted.join(', ')},<br>` +
    `Q3 is the value at the ${q3Index + 1}th position (in a sorted list), which is ${q3}.`;

  const validate = (userInput: string): boolean => {
    return parseFloat(userInput) === q3;
  };

  return {
    question: `Find the third quartile (Q3) of these numbers: ${numbers.join(', ')}.`,
    answer: q3.toString(),
    hint,
    validate,
    needsExtraInput: false,
  };
}

export function generateInterquartileRangeProblem(): Problem {
  const numbers = Array.from(
    { length: 7 + Math.floor(Math.random() * 5) },
    () => randInt(1, 20)
  );

  const sorted = [...numbers].sort((a, b) => a - b);
  const q1Index = Math.floor((sorted.length - 1) / 4);
  const q3Index = Math.ceil((3 * (sorted.length - 1)) / 4);
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  const iqr = q3 - q1;

  const hint =
    `The interquartile range (IQR) is the difference between the third quartile (Q3) and the first quartile (Q1). ` +
    `First, arrange the numbers in ascending order. ` +
    `For your numbers (sorted): ${sorted.join(', ')},<br>` +
    `Q1 is located at the ${q1Index + 1}th position and Q3 at the ${q3Index + 1}th position in the sorted list. ` +
    `Thus, IQR = Q3 - Q1 = ${q3} - ${q1} = ${iqr}.`;

  const validate = (userInput: string): boolean => {
    return parseFloat(userInput) === iqr;
  };

  return {
    question: `Calculate the interquartile range (IQR) of these numbers: ${numbers.join(', ')}.`,
    answer: iqr.toString(),
    hint,
    validate,
    needsExtraInput: false,
  };
}

// ── Geometry ──────────────────────────────────────────────────────────

export function generateTriangleProblem(): Problem {
  const base = randInt(5, 15);
  const height = randInt(4, 12);
  const area = 0.5 * base * height;

  const question = `Given a triangle with base length of ${base} units and height of ${height} units, calculate the area of the triangle.`;
  const hint = `The formula for the area of a triangle is (base * height) / 2. Substitute the given values into this formula to find the area.`;

  const validate = (userInput: string): boolean => {
    return parseFloat(userInput).toFixed(3) === area.toFixed(3);
  };

  return {
    question,
    answer: area.toFixed(3),
    hint,
    validate,
    needsExtraInput: false,
  };
}

export function generateTrapezoidProblem(): Problem {
  const base1 = randInt(5, 10);
  const base2 = randInt(10, 15);
  const height = randInt(4, 8);
  const area = ((base1 + base2) / 2) * height;

  const question = `Given a trapezoid with bases of lengths ${base1} units and ${base2} units, and height of ${height} units, calculate the area of the trapezoid.`;
  const hint = `The formula for the area of a trapezoid is (base1 + base2) / 2 * height. Substitute the given values into this formula to find the area.`;

  const validate = (userInput: string): boolean => {
    return parseFloat(userInput).toFixed(3) === area.toFixed(3);
  };

  return {
    question,
    answer: area.toFixed(3),
    hint,
    validate,
    needsExtraInput: false,
  };
}

// ── Export map ────────────────────────────────────────────────────────

export const NUMBERS_STATS_GEOMETRY_GENERATORS = {
  absolutevalue: { generate: generateAbsoluteValueProblem },
  opposites: { generate: generateOppositesProblem },
  lcm: { generate: generateLCMProblem },
  gcf: { generate: generateGCFProblem },
  mean: { generate: generateMeanProblem },
  median: { generate: generateMedianProblem },
  mode: { generate: generateModeProblem },
  range: { generate: generateRangeProblem },
  firstquartile: { generate: generateFirstQuartileProblem },
  thirdquartile: { generate: generateThirdQuartileProblem },
  interquartilerange: { generate: generateInterquartileRangeProblem },
  triangle: { generate: generateTriangleProblem },
  trapezoid: { generate: generateTrapezoidProblem },
};
