// Decimals of π (the digits after "3."), indexed from 0.
// First 100 decimals — extend this string to practice further.
const PI_DECIMALS =
  '1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';

export const PI_DIGITS: readonly string[] = PI_DECIMALS.split('');

// Number of decimals we quiz on.
export const PI_LENGTH = PI_DIGITS.length;

// True when `digit` (a single character) is the correct decimal at `index`.
export function isDigitCorrect(digit: string, index: number): boolean {
  return digit === PI_DIGITS[index];
}
