import { thousands } from './constants';
import { _convertLessThanThousand } from './helpers';

/**
 * * Converts a number to words
 * @param number - The number to convert into words.
 * @returns The number converted in words.
 */
export function numberToWords(number: number): string {
	const isNegative = number < 0;

	if (number === 0) return 'zero';

	number = Math.abs(number);

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
