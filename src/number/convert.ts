import { isNumber } from '../guards/primitives';
import { isNumericString } from '../guards/specials';
import type { Numeric } from '../types/index';
import { ORDINAL_UNDER_TEEN, THOUSANDS } from './constants';
import { _convertLessThanThousand } from './helpers';

/**
 * * Converts a numeric value into its corresponding English word representation.
 * @warning ***Supports numeric values up to `10e19` or `10^20` (one hundred quintillion).***
 * @warning ***Decimal values are ignored; only the integer part is converted.***
 * @param number - The number to convert into words.
 * @returns The number converted in words.
 */
export function numberToWords(num: Numeric): string {
	let number = Math.trunc(Number(num));

	if (!Number.isFinite(number) || isNaN(number)) {
		return 'Invalid Number!';
	}

	const isNegative = number < 0;

	if (number === 0) return 'zero';

	number = Math.abs(number);

	let i = 0;
	let result = '';

	while (number > 0) {
		if (i >= THOUSANDS.length) {
			return `Number exceeds supported range (max is 10e19 aka 10^20)`;
		}

		if (number % 1000 !== 0) {
			const isLastGroup = i === 0 && number % 100 < 100;
			const prefix = _convertLessThanThousand(number % 1000, isLastGroup);

			result = `${prefix} ${THOUSANDS[i]} ${result}`;
		}

		number = Math.floor(number / 1000);

		i++;
	}

	const finalResult = result.trim().replace(/\s+/g, ' ');

	return isNegative ? `minus ${finalResult}` : finalResult;
}

/**
 * * Converts a number to a Roman numeral.
 * @param num - The number to convert. Number must be `between 1 and 3999`.
 * @returns The Roman numeral representation.
 *
 * @example convertToRomanNumerals(29) → "XXIX"
 */
export const convertToRomanNumerals = (num: Numeric): string => {
	let number = Number(num);

	if (number <= 0 || number >= 4000)
		throw new RangeError('Number must be between 1 and 3999');

	const romanMap: [number, string][] = [
		[1000, 'M'],
		[900, 'CM'],
		[500, 'D'],
		[400, 'CD'],
		[100, 'C'],
		[90, 'XC'],
		[50, 'L'],
		[40, 'XL'],
		[10, 'X'],
		[9, 'IX'],
		[5, 'V'],
		[4, 'IV'],
		[1, 'I'],
	];

	let result = '';
	for (const [value, numeral] of romanMap) {
		while (number >= value) {
			result += numeral;
			number -= value;
		}
	}
	return result;
};

/**
 * * Converts a number, numeric string, or cardinal word string into its ordinal word representation.
 *
 * @param number - A number (e.g. `42`), numeric string (e.g. `"42"`), or cardinal word (e.g. `"forty-two"`).
 * @returns The ordinal word form (always in lowercase) of the input.
 *
 * @example
 * numberToWordsOrdinal(1); // "first"
 * numberToWordsOrdinal("23"); // "twenty-third"
 * numberToWordsOrdinal("twenty-three"); // "twenty-third"
 */
export function numberToWordsOrdinal(number: Numeric | string) {
	const TEEN_OR_HUNDRED = /(teen|hundred|thousand|(m|b|tr|quadr)illion)$/;
	const UNDER_TEEN =
		/(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)$/;

	const _fixUnderTeen = (cardinal: string): string => {
		return ORDINAL_UNDER_TEEN[cardinal];
	};

	const wordNumber =
		isNumericString(number) || isNumber(number) ?
			numberToWords(number)
		:	number?.trim()?.toLowerCase();

	if (TEEN_OR_HUNDRED.test(wordNumber)) {
		return wordNumber + 'th';
	} else if (/y$/.test(wordNumber)) {
		return wordNumber.replace(/y$/, 'ieth');
	} else if (UNDER_TEEN.test(wordNumber)) {
		return wordNumber.replace(UNDER_TEEN, _fixUnderTeen);
	} else {
		return wordNumber;
	}
}
