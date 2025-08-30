import { isNumber } from '../guards/primitives';
import { isNumericString } from '../guards/specials';
import type { Numeric } from '../types/index';
import { CURRENCY_LOCALES } from './constants';
import type { CurrencyCode, LocaleCode } from './types';

/**
 * * Rounds a number to the nearest specified interval.
 * @param value - The number to round.
 * @param interval - The interval to round to. Defaults to `5`.
 * @returns The number rounded to the nearest interval.
 * @example roundToNearest(27, 5) → 25
 */
export const roundToNearest = (value: Numeric, interval = 5): number => {
	return Math.round(Number(value) / interval) * interval;
};

/**
 * * Formats a number as a currency string.
 * @param value - The number to format.
 * @param currency - The currency code (default: `USD`).
 * @param locale - The locale for formatting (default: matching currency locale).
 * @returns A formatted currency string.
 * @example formatCurrency(1234.56) → "$1,234.56"
 * @example formatCurrency(1234.56, "USD") → "$1,234.56"
 * @example formatCurrency(1234.56, "USD", "en-US") → "$1,234.56"
 */
export const formatCurrency = (
	value: Numeric,
	currency: CurrencyCode = 'USD',
	locale?: LocaleCode
): string => {
	const selectedLocale: LocaleCode = locale ? locale : CURRENCY_LOCALES[currency];

	return new Intl.NumberFormat(selectedLocale, {
		style: 'currency',
		currency,
	}).format(value);
};

/**
 * * Clamps a number within a specified range.
 * @param value - The number to clamp.
 * @param min - The minimum allowed value.
 * @param max - The maximum allowed value.
 * @returns The clamped number.
 * @example clampNumber(15, 10, 20) → 15
 * @example clampNumber(5, 10, 20) → 10
 * @example clampNumber(25, 10, 20) → 20
 */
export const clampNumber = (value: number, min: number, max: number): number => {
	return Math.max(min, Math.min(value, max));
};

/**
 * * Generates a random floating-point number within a range.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns A random floating-point number between min and max.
 * @example randomFloat(1.5, 3.5) → 2.84623
 */
export const getRandomFloat = (min: Numeric, max: Numeric): number => {
	return Math.random() * (Number(max) - Number(min)) + Number(min);
};

/**
 * * Returns the ordinal suffix for a given number (e.g., 1 -> 'st', 2 -> 'nd', 3 -> 'rd', 4 -> 'th' etc.).
 * @description The function handles special cases for 11, 12, and 13, which all use 'th' despite the last digit.
 * If the `withNumber` parameter is `true`, the function returns the number along with its ordinal suffix (e.g., "1st").
 * Otherwise, it returns only the ordinal suffix (e.g., "st").
 *
 * @param num - The number or number string to get the ordinal suffix for.
 * @param withNumber - Whether to include the number along with its ordinal suffix (defaults to `true`).
 * @returns The appropriate ordinal suffix, optionally with the number (e.g., '1st' or 'st`, '2nd' or 'nd' and so on.).
 */
export const getOrdinal = (num: Numeric, withNumber = true): string => {
	const remainder10 = Number(num) % 10;
	const remainder100 = Number(num) % 100;

	let suffix: string;

	if (remainder10 === 1 && remainder100 !== 11) {
		suffix = 'st';
	} else if (remainder10 === 2 && remainder100 !== 12) {
		suffix = 'nd';
	} else if (remainder10 === 3 && remainder100 !== 13) {
		suffix = 'rd';
	} else {
		suffix = 'th';
	}

	return withNumber ? String(num).concat(suffix) : suffix;
};

/**
 * * Normalize a number or numeric string to a number.
 * @description
 * This function checks if the input is a number or a numeric string and converts it to a number.
 * If the input is not a valid number or numeric string, it returns undefined.
 * @param num - The number to normalize.
 * @returns The normalized number or undefined if the input is not a valid number or numeric string.
 */
export const normalizeNumber = (num: unknown) => {
	return (
		isNumber(num) ? num
		: isNumericString(num) ? Number(num)
		: undefined
	);
};
