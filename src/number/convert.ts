import { ones, teens, tens, thousands } from './constants';

/**
 * * Converts a number to words
 * @param number - The number to convert into words.
 * @returns The number converted in words.
 */
export function numberToWords(number: number): string {
	const isNegative = number < 0;

	if (number === 0) return 'zero';

	number = Math.abs(number);

	/**
	 * - Converts a number less than 1000 to words.
	 * @param num - The number to convert (less than 1000).
	 * @param isLast - Whether this is the last group (thousands, millions, etc.).
	 * @returns Numbers less than 1000 in words.
	 */
	function _convertLessThanThousand(num: number, isLast: boolean): string {
		if (num < 10) return ones[num];

		if (num < 20) return teens[num - 10];

		let result = tens[Math.floor(num / 10)];

		const remainder = num % 10;

		if (remainder > 0) result += `-${ones[remainder]}`;

		if (num >= 100) {
			const hundredsPart = `${ones[Math.floor(num / 100)]} hundred`;

			return num % 100 === 0 ?
					hundredsPart
				:	`${hundredsPart} ${isLast ? 'and' : ''} ${_convertLessThanThousand(num % 100, false)}`;
		}

		return result;
	}

	let i = 0;
	let result = '';

	while (number > 0) {
		if (number % 1000 !== 0) {
			const isLastGroup = i === 0 && number % 100 < 100;
			const prefix = _convertLessThanThousand(number % 1000, isLastGroup);

			result = `${prefix} ${thousands[i]} ${result}`;
		}

		number = Math.floor(number / 1000);

		i++;
	}

	const finalResult = result.trim().replace(/\s+/g, ' ');

	return isNegative ? `minus ${finalResult}` : finalResult;
}
