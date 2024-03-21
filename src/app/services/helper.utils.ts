export function calculateGCF(a: number, b: number): number {
    return b === 0 ? a : calculateGCF(b, a % b);
}

export function calculateLCM(a: number, b: number) {
    const gcd = (x: number, y: number): number => !y ? x : gcd(y, x % y);
    return (a * b) / gcd(a, b);
}
