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
