export function calculateGCF(a: number, b: number): number {
  return b === 0 ? a : calculateGCF(b, a % b);
}

export function gcd(a: number, b: number): number {
  if (!b) return a;
  return gcd(b, a % b);
}

export function calculateLCM(a: number, b: number) {
  // const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
  return (a * b) / gcd(a, b);
}

export const compareFractions = (
  num1: number,
  denom1: number,
  num2: number,
  denom2: number
) => {
  const value1 = num1 / denom1;
  const value2 = num2 / denom2;
  if (value1 > value2) {
    return '>';
  }
  if (value1 < value2) {
    return '<';
  }
  return '=';
};

export function simplifyFraction(numerator: number, denominator: number) {
  const greatestCommonDivisor = gcd(numerator, denominator);
  return {
    numerator: numerator / greatestCommonDivisor,
    denominator: denominator / greatestCommonDivisor,
  };
}

export function lcm(a: number, b: number) {
  return Math.abs(a * b) / gcd(a, b);
}
