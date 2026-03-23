/** Shared math helper functions for problem generators */

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function simplifyFraction(num: number, den: number): { numerator: number; denominator: number } {
  const d = gcd(Math.abs(num), Math.abs(den));
  return { numerator: num / d, denominator: den / d };
}

export function simplifyRatio(a: number, b: number): string {
  const d = gcd(a, b);
  return `${a / d}:${b / d}`;
}

export function calculateGCF(a: number, b: number): number {
  return gcd(a, b);
}

export function calculateLCM(a: number, b: number): number {
  return lcm(a, b);
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickTwo<T>(items: T[]): [T, T] {
  const i1 = Math.floor(Math.random() * items.length);
  let i2: number;
  do {
    i2 = Math.floor(Math.random() * items.length);
  } while (i1 === i2);
  return [items[i1], items[i2]];
}

export function pickThreeFromList<T>(lists: T[][]): [T, T, T] {
  const list = lists[Math.floor(Math.random() * lists.length)];
  const i1 = Math.floor(Math.random() * list.length);
  let i2: number, i3: number;
  do { i2 = Math.floor(Math.random() * list.length); } while (i2 === i1);
  do { i3 = Math.floor(Math.random() * list.length); } while (i3 === i1 || i3 === i2);
  return [list[i1], list[i2], list[i3]];
}

/** Fraction HTML helper: renders a fraction as inline HTML */
export function fracHtml(num: number | string, den: number | string): string {
  return `<span class="frac"><sup>${num}</sup><span>&frasl;</span><sub>${den}</sub></span>`;
}

/** Compute integer power of a fraction, returning simplified numerator/denominator */
export function fractionPower(num: number, den: number, exp: number): { numerator: number; denominator: number } {
  const { rn, rd } = Array.from({ length: exp }).reduce<{ rn: number; rd: number }>(
    (acc) => ({ rn: acc.rn * num, rd: acc.rd * den }),
    { rn: 1, rd: 1 },
  );
  const d = gcd(Math.abs(rn), Math.abs(rd));
  return { numerator: rn / d, denominator: rd / d };
}
