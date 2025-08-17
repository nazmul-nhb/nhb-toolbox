import { isNumber } from '../guards/primitives';
import { isNumericString } from '../guards/specials';
import type { Numeric } from '../types/index';
import {
	ONES,
	ORDINAL_TO_CARDINAL,
	ORDINAL_UNDER_TEEN,
	TEENS,
	TENS,
	THOUSANDS,
} from './constants';
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

/**
 * * Convert an English cardinal/ordinal word string into a number.
 *
 * - Accepts hyphenated words, "and", ordinals (first, second, ...), negatives, and large scales (thousand, million etc.).
 *
 * @example
 * wordsToNumber('forty-two') // 42
 * wordsToNumber('one hundred and seven') // 107
 * wordsToNumber('two thousand three hundred') // 2300
 * wordsToNumber('twenty-first') // 21
 * wordsToNumber('negative five') // -5
 *
 * @param word - human readable number (cardinal or ordinal)
 * @returns numeric value or NaN if cannot parse
 */
export function wordsToNumber(word: string): number {
	if (!word || typeof word !== 'string') return NaN;

	// allow numeric strings directly
	const trimmed = word.trim();
	if (/^[+-]?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);

	let input = trimmed.toLowerCase();

	// handle negative prefix words
	let negative = false;
	input = input.replace(/^\s*(minus|negative)\s+/, () => {
		negative = true;
		return '';
	});

	// normalize: replace hyphens, commas; remove "and"
	input = input
		.replace(/[-,]/g, ' ')
		.replace(/\band\b/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

	if (!input) return NaN;

	// build lookup maps from your arrays
	const onesMap = new Map<string, number>(ONES.map((w, i) => [w, i]));
	const teensMap = new Map<string, number>(TEENS.map((w, i) => [w, 10 + i]));
	const tensMap = new Map<string, number>(TENS.map((w, i) => [w, i * 10]));
	const scalesMap = new Map<string, number>(
		THOUSANDS.map((w, i) => [w, i === 0 ? 1 : 1000 ** i])
	);

	// tokenize and normalize ordinal suffixes like "twenty-first" -> "twenty first"
	const tokens = input
		.split(' ')
		.map((token) => {
			// strip ordinal suffixes like "th", "st", "nd", "rd" on plain numbers (e.g., "fiftieth" handled below)
			const tokenStripped = token.replace(
				/(first|second|third|eleventh|twelfth)$/i,
				(m) => m.toLowerCase()
			);

			const ORDINAL_SUFFIXES = /(teenth|tieth|ieth|th|st|nd|rd)$/i;

			// if token is an ordinal word known in map, convert to cardinal word
			if (ORDINAL_TO_CARDINAL[tokenStripped])
				return ORDINAL_TO_CARDINAL[tokenStripped];
			// remove simple ordinal suffix (fiftieth -> fifty? handle common pattern)
			if (ORDINAL_SUFFIXES.test(tokenStripped)) {
				// convert xyth -> xy by removing trailing 'th'/'st' etc (best-effort)
				return tokenStripped.replace(ORDINAL_SUFFIXES, '');
			}
			return tokenStripped;
		})
		.filter(Boolean);

	if (tokens.length === 0) return NaN;

	let total = 0;
	let current = 0;
	let seenAny = false;

	for (const raw of tokens) {
		const token = raw?.toLowerCase();

		// direct maps
		if (onesMap.has(token)) {
			current += onesMap.get(token)!;
			seenAny = true;
			continue;
		}
		if (teensMap.has(token)) {
			current += teensMap.get(token)!;
			seenAny = true;
			continue;
		}
		if (tensMap.has(token)) {
			current += tensMap.get(token)!;
			seenAny = true;
			continue;
		}

		// 'hundred' multiplier
		if (token === 'hundred') {
			// if nothing before 'hundred', assume 1 hundred
			current = (current || 1) * 100;
			seenAny = true;
			continue;
		}

		// scales like thousand, million, ...
		if (scalesMap.has(token)) {
			const scale = scalesMap.get(token)!;
			if (scale === 1) {
				// ignore empty scale token (shouldn't happen for '')
				continue;
			}
			// multiply current (or 1) by scale and add to total
			const toAdd = (current || 1) * scale;
			total += toAdd;
			current = 0;
			seenAny = true;
			continue;
		}

		// try to parse token as numeric (defensive)
		if (/^\d+$/.test(token)) {
			current += Number(token);
			seenAny = true;
			continue;
		}

		// unknown token -> fail parsing
		return NaN;
	}

	const result = total + current;
	if (!seenAny || Number.isNaN(result)) return NaN;

	return negative ? -result : result;
}
