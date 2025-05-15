import { ONES, TEENS, TENS } from './constants';

/**
 * Apply multiples of a number if there is any.
 * @param array Array of numbers to apply the condition on.
 * @param multiples The multiples of which number.
 * @returns Array of multiples of the desired number
 */
export const _applyMultiples = (
	array: number[],
	multiples?: number,
): number[] => {
	if (!multiples) return array;
	return array?.filter((n) => n % multiples === 0);
};

/**
 * - Converts a number less than 1000 to words.
 * @param num - The number to convert (less than 1000).
 * @param isLast - Whether this is the last group (thousands, millions, etc.).
 * @returns Numbers less than 1000 in words.
 */
export function _convertLessThanThousand(num: number, isLast: boolean): string {
	if (num < 10) return ONES[num];

	if (num < 20) return TEENS[num - 10];

	let result = TENS[Math.floor(num / 10)];

	const remainder = num % 10;

	if (remainder > 0) result += `-${ONES[remainder]}`;

	if (num >= 100) {
		const hundredsPart = `${ONES[Math.floor(num / 100)]} hundred`;

		return num % 100 === 0 ?
				hundredsPart
			:	`${hundredsPart} ${isLast ? 'and' : ''} ${_convertLessThanThousand(num % 100, false)}`;
	}

	return result;
}

/**
 * * Calculate the HCF (Highest Common Factor) of two numbers using the Euclidean algorithm.
 *
 * @param a - First number.
 * @param b - Second number.
 * @returns The HCF of the two numbers.
 */
export const _find2NumbersHCF = (a: number, b: number): number => {
	let x = Math.abs(a);
	let y = Math.abs(b);

	while (y !== 0) {
		const temp = y;

		y = x % y;
		x = temp;
	}

	return x;
};

/**
 * * Calculate the LCM (Least Common Multiple) of two numbers using the Euclidean algorithm.
 *
 * @param a - First number.
 * @param b - Second number.
 * @returns The LCM of the two numbers.
 */
export const _find2NumbersLCM = (a: number, b: number): number => {
	const x = Math.abs(a);
	const y = Math.abs(b);

	return (x * y) / _find2NumbersHCF(x, y);
};
