/**
 * * Checks if a number is prime.
 *
 * @param number The number to check.
 * @returns Boolean: `true` if the number is prime, otherwise `false`.
 */
export const isPrime = (number: number): boolean => {
	if (number < 2) return false;
	if (number === 2 || number === 3) return true;
	if (number % 2 === 0 || number % 3 === 0) return false;

	for (let i = 5; i * i <= number; i += 6) {
		if (number % i === 0 || number % (i + 2) === 0) return false;
	}

	return true;
};

/**
 * * Find prime numbers in a given range.
 *
 * @param start The starting number of the range. Default is `1`.
 * @param end The ending number of the range. Default is `1000`.
 * @returns An array of prime numbers within the range (inclusive).
 */
export const findPrimeNumbers = (start = 1, end = 1000): number[] => {
	let startNumber = start,
		endNumber = end;

	if (start > end) {
		[startNumber, endNumber] = [end, start];
	}

	return Array.from(
		{ length: endNumber - startNumber + 1 },
		(_, i) => startNumber + i
	).filter(isPrime);
};
