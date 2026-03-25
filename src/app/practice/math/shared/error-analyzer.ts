export interface ErrorAnalysis {
  errorType: string;
  description: string;
}

/**
 * Analyze a wrong answer and return the likely error, or null if unclassifiable.
 * Pure function — no side effects, no service dependencies.
 */
export function analyzeError(
  problemType: string,
  question: string,
  correctAnswer: string,
  studentAnswer: string,
): ErrorAnalysis | null {
  const sa = studentAnswer.trim();
  const ca = correctAnswer.trim();

  if (sa === ca) return null; // shouldn't happen, but guard

  switch (problemType) {
    case 'addition':
      return analyzeAddition(question, ca, sa);
    case 'subtraction':
      return analyzeSubtraction(question, ca, sa);
    case 'multiplication':
      return analyzeMultiplication(question, ca, sa);
    case 'division':
      return analyzeDivision(question, ca, sa);
    case 'rounding':
      return analyzeRounding(question, ca, sa);

    case 'simplify':
    case 'addsubtractmixed':
    case 'mixedtoimproper':
    case 'impropertomixed':
    case 'wholetimesmixed':
    case 'dividefractions':
    case 'dividemixednumbers':
    case 'fractiontodecimal':
    case 'decimaltofraction':
      return analyzeFraction(problemType, question, ca, sa);

    case 'comparefractions':
    case 'comparison':
    case 'compareintegers':
      return analyzeComparison(ca, sa);

    case 'substitute':
    case 'substituteadvanced':
    case 'distribute':
    case 'solveforx':
    case 'unknown':
      return analyzeEquation(problemType, question, ca, sa);

    case 'mean':
    case 'median':
    case 'mode':
    case 'range':
    case 'firstquartile':
    case 'thirdquartile':
    case 'interquartilerange':
      return analyzeStatistics(problemType, question, ca, sa);

    case 'exponent':
    case 'exponent2':
      return analyzeExponent(question, ca, sa);

    default:
      return null;
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function num(s: string): number {
  return parseFloat(s);
}

function isClose(a: number, b: number, tolerance = 0.001): boolean {
  return Math.abs(a - b) < tolerance;
}

/** Strip HTML tags from a string */
function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, '');
}

/** Parse two numeric operands from "A op B" where op is +, -, ×, etc. */
function parseArithOperands(question: string): { a: number; b: number } | null {
  const cleaned = stripHtml(question);
  // Match patterns like "123.45 + 67.89" or "45 × 67"
  const m = cleaned.match(/([\d.]+)\s*[+\-×÷]\s*([\d.]+)/);
  if (!m) return null;
  return { a: parseFloat(m[1]), b: parseFloat(m[2]) };
}

// ── Arithmetic Analyzers ────────────────────────────────────────────────────

function analyzeAddition(question: string, ca: string, sa: string): ErrorAnalysis | null {
  const ops = parseArithOperands(question);
  if (!ops) return null;
  const { a, b } = ops;
  const correct = num(ca);
  const student = num(sa);
  if (isNaN(student)) return null;

  const diff = student - correct;

  // Operation confusion: subtracted instead of added
  if (isClose(student, a - b) || isClose(student, b - a)) {
    return { errorType: 'operation-confusion', description: 'Subtracted instead of adding' };
  }
  // Carrying error: off by exactly 10, 100, etc. in one column
  if ([10, 100, 1000, -10, -100, -1000].some(v => isClose(diff, v))) {
    return { errorType: 'carrying-error', description: 'Forgot to carry or carried incorrectly' };
  }
  // Place value error: off by a factor of 10
  if (correct !== 0 && (isClose(student, correct * 10) || isClose(student, correct / 10))) {
    return { errorType: 'place-value-error', description: 'Misaligned decimal point' };
  }
  // Off by one
  if (Math.abs(diff) === 1) {
    return { errorType: 'off-by-one', description: 'Answer is off by 1' };
  }

  return null;
}

function analyzeSubtraction(question: string, ca: string, sa: string): ErrorAnalysis | null {
  const ops = parseArithOperands(question);
  if (!ops) return null;
  const { a, b } = ops;
  const correct = num(ca);
  const student = num(sa);
  if (isNaN(student)) return null;

  const diff = student - correct;

  // Sign error: got the right magnitude but wrong sign (subtracted in reverse)
  if (isClose(student, -(a - b)) || isClose(student, b - a)) {
    return { errorType: 'sign-error', description: 'Subtracted in the wrong order' };
  }
  // Operation confusion: added instead of subtracted
  if (isClose(student, a + b)) {
    return { errorType: 'operation-confusion', description: 'Added instead of subtracting' };
  }
  // Carrying error
  if ([10, 100, 1000, -10, -100, -1000].some(v => isClose(diff, v))) {
    return { errorType: 'carrying-error', description: 'Borrowing error in subtraction' };
  }
  // Place value error
  if (correct !== 0 && (isClose(student, correct * 10) || isClose(student, correct / 10))) {
    return { errorType: 'place-value-error', description: 'Misaligned decimal point' };
  }
  // Off by one
  if (Math.abs(diff) === 1) {
    return { errorType: 'off-by-one', description: 'Answer is off by 1' };
  }

  return null;
}

function analyzeMultiplication(question: string, ca: string, sa: string): ErrorAnalysis | null {
  const ops = parseArithOperands(question);
  if (!ops) return null;
  const { a, b } = ops;
  const correct = num(ca);
  const student = num(sa);
  if (isNaN(student)) return null;

  // Operation confusion: added instead of multiplied
  if (isClose(student, a + b)) {
    return { errorType: 'operation-confusion', description: 'Added instead of multiplying' };
  }
  // Place value error: off by factor of 10
  if (correct !== 0 && (isClose(student, correct * 10) || isClose(student, correct / 10))) {
    return { errorType: 'place-value-error', description: 'Misaligned a digit in multiplication' };
  }
  // Carrying error
  const diff = student - correct;
  if ([10, 100, 1000, -10, -100, -1000].some(v => isClose(diff, v))) {
    return { errorType: 'carrying-error', description: 'Carrying error in multiplication' };
  }

  return null;
}

function analyzeDivision(question: string, ca: string, sa: string): ErrorAnalysis | null {
  // Question format: "What is X divided by Y? Round your answer to the nearest ..."
  const m = question.match(/What is (\d+) divided by (\d+)/i);
  if (!m) return null;
  const dividend = parseInt(m[1], 10);
  const divisor = parseInt(m[2], 10);
  const correct = num(ca);
  const student = num(sa);
  if (isNaN(student)) return null;

  // Operation confusion: multiplied instead
  if (isClose(student, dividend * divisor)) {
    return { errorType: 'operation-confusion', description: 'Multiplied instead of dividing' };
  }
  // Inverted division: divided in wrong order
  if (divisor !== 0 && isClose(student, divisor / dividend, 0.01)) {
    return { errorType: 'sign-error', description: 'Divided in the wrong order' };
  }
  // Rounding direction error
  const exactResult = dividend / divisor;
  const isRoundToTenth = question.includes('tenth');
  const precision = isRoundToTenth ? 1 : 2;
  const truncated = Math.floor(exactResult * Math.pow(10, precision)) / Math.pow(10, precision);
  const roundedUp = Math.ceil(exactResult * Math.pow(10, precision)) / Math.pow(10, precision);
  if (isClose(student, truncated) && !isClose(truncated, correct)) {
    return { errorType: 'rounding-direction', description: 'Truncated instead of rounding correctly' };
  }
  if (isClose(student, roundedUp) && !isClose(roundedUp, correct)) {
    return { errorType: 'rounding-direction', description: 'Rounded in the wrong direction' };
  }
  // Place value error
  if (correct !== 0 && (isClose(student, correct * 10) || isClose(student, correct / 10))) {
    return { errorType: 'place-value-error', description: 'Misaligned decimal point in division' };
  }

  return null;
}

// ── Rounding Analyzer ───────────────────────────────────────────────────────

function analyzeRounding(question: string, ca: string, sa: string): ErrorAnalysis | null {
  // Question format: "Round X to the nearest TYPE"
  const m = question.match(/Round ([\d.]+) to the nearest (\w+)/i);
  if (!m) return null;
  const original = parseFloat(m[1]);
  const placeType = m[2].toLowerCase();
  const correct = num(ca);
  const student = num(sa);
  if (isNaN(student)) return null;

  // Wrong direction: rounded up when should have rounded down or vice versa
  const placeMap: Record<string, number> = {
    tens: 10, hundreds: 100, thousands: 1000, tenths: 0.1, hundredths: 0.01,
  };
  const placeValue = placeMap[placeType];
  if (placeValue) {
    const floorVal = Math.floor(original / placeValue) * placeValue;
    const ceilVal = Math.ceil(original / placeValue) * placeValue;
    // Student gave the "other" rounded value
    if (isClose(correct, floorVal) && isClose(student, ceilVal) && !isClose(floorVal, ceilVal)) {
      return { errorType: 'wrong-direction', description: 'Rounded up instead of down' };
    }
    if (isClose(correct, ceilVal) && isClose(student, floorVal) && !isClose(floorVal, ceilVal)) {
      return { errorType: 'wrong-direction', description: 'Rounded down instead of up' };
    }
  }

  // Wrong place value: correctly rounded but to the wrong place
  const otherPlaces = ['tens', 'hundreds', 'thousands', 'tenths', 'hundredths'].filter(p => p !== placeType);
  const wrongPlace = otherPlaces.find(place => {
    const pv = placeMap[place];
    if (!pv) return false;
    const roundedToOtherPlace = Math.round(original / pv) * pv;
    const fixedOther = parseFloat(roundedToOtherPlace.toPrecision(10));
    return isClose(student, fixedOther) && !isClose(student, correct);
  });
  if (wrongPlace) {
    return { errorType: 'wrong-place-value', description: `Rounded to the ${wrongPlace} place instead of ${placeType}` };
  }

  // Truncated: just chopped off digits
  if (placeValue && placeValue < 1) {
    const decimals = placeType === 'tenths' ? 1 : 2;
    const truncated = Math.trunc(original * Math.pow(10, decimals)) / Math.pow(10, decimals);
    if (isClose(student, truncated) && !isClose(truncated, correct)) {
      return { errorType: 'truncated', description: 'Truncated instead of rounding' };
    }
  }

  return null;
}

// ── Fraction Analyzers ──────────────────────────────────────────────────────

function parseFraction(s: string): { whole: number; num: number; den: number } | null {
  const cleaned = s.trim();
  // Match "W N/D" or "N/D" or "W"
  const mixed = cleaned.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return { whole: parseInt(mixed[1], 10), num: parseInt(mixed[2], 10), den: parseInt(mixed[3], 10) };
  const frac = cleaned.match(/^(-?\d+)\/(\d+)$/);
  if (frac) return { whole: 0, num: parseInt(frac[1], 10), den: parseInt(frac[2], 10) };
  const whole = cleaned.match(/^(-?\d+)$/);
  if (whole) return { whole: parseInt(whole[1], 10), num: 0, den: 1 };
  return null;
}

function fractionToDecimal(f: { whole: number; num: number; den: number }): number {
  return f.whole + (f.den !== 0 ? f.num / f.den : 0);
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function analyzeFraction(
  problemType: string,
  question: string,
  ca: string,
  sa: string,
): ErrorAnalysis | null {
  const correctFrac = parseFraction(ca);
  const studentFrac = parseFraction(sa);

  if (!correctFrac || !studentFrac) return null;

  const correctVal = fractionToDecimal(correctFrac);
  const studentVal = fractionToDecimal(studentFrac);

  // Unsimplified: same value but not in simplest form
  if (isClose(correctVal, studentVal) && !isClose(correctVal, studentVal, 0)) {
    // They're equal but strings differ — likely unsimplified
    if (studentFrac.den > 1) {
      const g = gcd(studentFrac.num, studentFrac.den);
      if (g > 1) {
        return { errorType: 'unsimplified', description: 'Correct value but not simplified' };
      }
    }
  }

  // For add/subtract mixed: check if student added denominators
  if (problemType === 'addsubtractmixed') {
    // Hard to parse operands from HTML question, but we can check the error pattern
    if (studentFrac.den > 0 && correctFrac.den > 0 && studentFrac.den !== correctFrac.den) {
      // If student's denominator looks like the sum of the original denominators, flag it
      // Without parsing the question HTML, we do a simpler check
      if (Math.abs(studentVal - correctVal) > 1) {
        return { errorType: 'no-common-denominator', description: 'May not have found a common denominator' };
      }
    }
  }

  // For divide fractions: check if they multiplied straight across instead of flipping
  if (problemType === 'dividefractions' || problemType === 'dividemixednumbers') {
    // If student's answer is way off, they might have multiplied instead of using the reciprocal
    if (studentVal !== 0 && correctVal !== 0) {
      // If student's answer is the reciprocal of the correct answer
      if (isClose(studentVal * correctVal, 1, 0.01)) {
        return { errorType: 'inverted-operation', description: 'Multiplied instead of dividing (forgot to flip)' };
      }
    }
  }

  // For mixed to improper: check if whole number was ignored
  if (problemType === 'mixedtoimproper') {
    if (correctFrac.den > 0 && studentFrac.den === correctFrac.den &&
        studentFrac.num < correctFrac.num) {
      return { errorType: 'whole-number-ignored', description: 'Forgot to include the whole number part' };
    }
  }

  // For improper to mixed: check conversion errors
  if (problemType === 'impropertomixed') {
    if (studentFrac.whole !== correctFrac.whole && studentFrac.den === correctFrac.den) {
      return { errorType: 'improper-conversion-error', description: 'Wrong whole number in the conversion' };
    }
    if (studentFrac.whole === correctFrac.whole && studentFrac.num !== correctFrac.num) {
      return { errorType: 'improper-conversion-error', description: 'Wrong remainder in the conversion' };
    }
  }

  return null;
}

// ── Comparison Analyzer ─────────────────────────────────────────────────────

function analyzeComparison(ca: string, sa: string): ErrorAnalysis | null {
  const validSymbols = ['<', '>', '='];
  if (!validSymbols.includes(ca) || !validSymbols.includes(sa)) return null;

  // Reversed direction
  if ((ca === '<' && sa === '>') || (ca === '>' && sa === '<')) {
    return { errorType: 'direction-reversed', description: 'Used the wrong comparison direction' };
  }

  return null;
}

// ── Equation Analyzers ──────────────────────────────────────────────────────

function analyzeEquation(
  problemType: string,
  question: string,
  ca: string,
  sa: string,
): ErrorAnalysis | null {
  const correct = num(ca);
  const student = num(sa);
  if (isNaN(correct) || isNaN(student)) return null;

  if (problemType === 'solveforx') {
    // Sign error: correct magnitude, wrong sign
    if (isClose(student, -correct) && correct !== 0) {
      return { errorType: 'wrong-inverse-operation', description: 'Applied the wrong inverse operation (sign is flipped)' };
    }
  }

  if (problemType === 'distribute') {
    // Parse "C(An - B)" -> check if only distributed to one term
    const cleaned = stripHtml(question);
    const m = cleaned.match(/^(\d+)\((\d+)n\s*-\s*(\d+)\)$/);
    if (m) {
      const coef = parseInt(m[1], 10);
      const term1 = parseInt(m[2], 10);
      const term2 = parseInt(m[3], 10);
      // Check if student only multiplied one term
      const partialA = `${coef * term1}n - ${term2}`;
      const partialB = `${term1}n - ${coef * term2}`;
      const normalizedSa = sa.replace(/\s+/g, '');
      if (normalizedSa === partialA.replace(/\s+/g, '') || normalizedSa === partialB.replace(/\s+/g, '')) {
        return { errorType: 'distribution-error', description: 'Only distributed to one of the two terms' };
      }
    }
  }

  // Generic off-by-one
  if (Math.abs(student - correct) === 1) {
    return { errorType: 'off-by-one', description: 'Answer is off by 1' };
  }

  // Sign error
  if (isClose(student, -correct) && correct !== 0) {
    return { errorType: 'sign-error', description: 'Correct magnitude but wrong sign' };
  }

  return null;
}

// ── Statistics Analyzers ────────────────────────────────────────────────────

function analyzeStatistics(
  problemType: string,
  question: string,
  ca: string,
  sa: string,
): ErrorAnalysis | null {
  const correct = num(ca);
  const student = num(sa);
  if (isNaN(correct) || isNaN(student)) return null;

  // Extract numbers from question like "Find the mean of these numbers: 3, 7, 12, 5, 9"
  const numbersMatch = question.match(/numbers?:\s*([\d,\s.]+)/i);
  if (!numbersMatch) return null;

  const numbers = numbersMatch[1]
    .split(',')
    .map(s => parseFloat(s.trim()))
    .filter(n => !isNaN(n));

  if (numbers.length === 0) return null;

  const sorted = [...numbers].sort((a, b) => a - b);
  const total = numbers.reduce((a, b) => a + b, 0);
  const mean = total / numbers.length;
  const midIndex = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? (sorted[midIndex - 1] + sorted[midIndex]) / 2
    : sorted[midIndex];

  if (problemType === 'mean') {
    // Confused mean and median
    if (isClose(student, median) && !isClose(mean, median)) {
      return { errorType: 'confused-mean-median', description: 'Gave the median instead of the mean' };
    }
    // Off-by-one count: divided by wrong number
    if (numbers.length > 1) {
      const wrongCountUp = total / (numbers.length + 1);
      const wrongCountDown = total / (numbers.length - 1);
      if (isClose(student, wrongCountUp, 0.01)) {
        return { errorType: 'off-by-one-count', description: 'Divided by too many items when computing the mean' };
      }
      if (isClose(student, wrongCountDown, 0.01)) {
        return { errorType: 'off-by-one-count', description: 'Divided by too few items when computing the mean' };
      }
    }
  }

  if (problemType === 'median') {
    // Confused median and mean
    if (isClose(student, mean) && !isClose(mean, median)) {
      return { errorType: 'confused-mean-median', description: 'Gave the mean instead of the median' };
    }
    // Unsorted median: found middle of unsorted list
    const unsortedMid = numbers.length % 2 === 0
      ? (numbers[midIndex - 1] + numbers[midIndex]) / 2
      : numbers[midIndex];
    if (isClose(student, unsortedMid) && !isClose(unsortedMid, median)) {
      return { errorType: 'unsorted-median', description: 'Found the middle value without sorting first' };
    }
  }

  if (problemType === 'range') {
    // Common error: used min instead of max-min, or max instead of max-min
    const maxN = Math.max(...numbers);
    const minN = Math.min(...numbers);
    if (isClose(student, maxN)) {
      return { errorType: 'off-by-one', description: 'Gave the max value instead of max minus min' };
    }
    if (isClose(student, minN)) {
      return { errorType: 'off-by-one', description: 'Gave the min value instead of max minus min' };
    }
  }

  return null;
}

// ── Exponent Analyzer ───────────────────────────────────────────────────────

function analyzeExponent(question: string, ca: string, sa: string): ErrorAnalysis | null {
  const correct = num(ca);
  const student = num(sa);
  if (isNaN(correct) || isNaN(student)) return null;

  // Parse "Calculate X^Y" from HTML like "Calculate 5<sup>3</sup>"
  const cleaned = stripHtml(question);
  const m = cleaned.match(/Calculate\s+([\d.]+)\s*(\d+)/);
  if (!m) return null;

  const base = parseFloat(m[1]);
  const exp = parseInt(m[2], 10);

  // Operation confusion: multiplied base × exponent instead of exponentiation
  if (isClose(student, base * exp)) {
    return { errorType: 'operation-confusion', description: 'Multiplied base times exponent instead of raising to the power' };
  }
  // Off by one power
  if (exp > 1 && isClose(student, Math.pow(base, exp - 1))) {
    return { errorType: 'off-by-one', description: 'Computed one fewer multiplication than needed' };
  }
  if (isClose(student, Math.pow(base, exp + 1))) {
    return { errorType: 'off-by-one', description: 'Computed one extra multiplication' };
  }

  return null;
}
