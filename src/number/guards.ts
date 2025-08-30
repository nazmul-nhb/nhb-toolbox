/**
 * * Check if a number is even or not.
 *
 * @param input The number to check.
 * @returns Boolean: `true` if even and `false` if not even.
 */
export const isEven = (input: number): boolean => {
	return input % 2 === 0;
};

/**
 * * Checks if a number is odd or not.
 *
 * @param input The number to check.
 * @returns Boolean: `true` if odd and `false` if not odd.
 */
export const isOdd = (input: number): boolean => {
	return input % 2 !== 0;
};

/**
 * * Checks if a number is a multiple of another number.
 *
 * @param input - The number to check.
 * @param multipleOf - The number to check against.
 * @returns `true` if `input` is a multiple of `multipleOf`, otherwise `false`.
 */
export const isMultiple = (input: number, multipleOf: number): boolean => {
	return input % multipleOf === 0;
};

/**
 * * Checks if a number is a perfect square.
 *
 * @param num The number to check.
 * @returns `true` if the number is a perfect square, otherwise `false`.
 */
export function isPerfectSquare(num: number): boolean {
	return Number.isInteger(Math.sqrt(num));
}

/**
 * * Checks if a number is part of the Fibonacci sequence.
 *
 * @param num The number to check.
 * @returns `true` if the number is a Fibonacci number, otherwise `false`.
 */
export function isFibonacci(num: number): boolean {
	return isPerfectSquare(5 * num * num + 4) || isPerfectSquare(5 * num * num - 4);
}

/**
 * * Checks whether any input is not a finite number.
 *
 * @param numbers - The list of numbers to validate.
 * @returns `true` if any input is not finite.
 */
export function areInvalidNumbers(...numbers: number[]): boolean {
	return numbers?.some((n) => !Number.isFinite(n));
}
