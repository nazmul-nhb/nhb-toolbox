import { trimString } from './basics';
import type { MaskOptions } from './types';

/**
 * * Replaces all occurrences of a string or pattern in the given input string.
 *
 * - If `find` is a string, it is converted into a global regular expression (`/find/g`).
 * - If `find` is a `RegExp`, the global (`g`) flag is ensured.
 * - Trims the input before performing replacements.
 *
 * @param input - The string in which replacements should be performed.
 * @param find - The substring or regex pattern to search for.
 * @param replace - The string to replace matches with.
 * @returns The modified/refined string with replacements applied.
 */
export const replaceAllInString = (
	input: string,
	find: string | RegExp,
	replace: string
): string => {
	const trimmedString = trimString(input);

	const regex =
		typeof find === 'string' ?
			new RegExp(find, 'g')
		:	new RegExp(find, find?.flags.includes('g') ? find?.flags : find?.flags + 'g');

	return trimmedString?.replace(regex, replace);
};

/**
 * * Converts a string into a URL-friendly slug.
 * @param input - The string to be converted.
 * @returns The slugified string.
 */
export const slugifyString = (input: string): string => {
	return trimString(normalizeString(input))
		?.toLowerCase()
		?.replace(/[^a-z0-9]+/g, '-')
		?.replace(/^-+|-+$/g, '');
};

/**
 * * Masks part of a string for privacy.
 * @param input - The string to mask.
 * @param options - Options for masking a string.
 * @returns The masked string.
 */
export const maskString = (input: string, options?: MaskOptions): string => {
	const { start = 1, end = 1, maskCharacter: maskChar = '*' } = options || {};

	const trimmedString = trimString(input);

	if (trimmedString?.length <= start + end) {
		return maskChar?.repeat(trimmedString?.length);
	}

	return (
		trimmedString.slice(0, start) +
		maskChar?.repeat(trimmedString?.length - start - end) +
		(end > 0 ? trimmedString.slice(-end) : '')
	);
};

/**
 * * Reverses a given string.
 * @param input - The string to reverse.
 * @returns The reversed string.
 */
export const reverseString = (input: string): string => {
	const trimmedString = trimString(input);

	return trimmedString?.split('')?.reverse()?.join('');
};

/**
 * * Normalizes a string by removing diacritics (accents).
 * @param str The input string.
 * @returns The normalized string.
 */
export function normalizeString(str: string): string {
	return str?.normalize('NFD')?.replace(/[\u0300-\u036f]/g, '');
}

/**
 * * Extracts all email addresses from a string.
 * @param str The input string.
 * @returns An array of extracted email addresses.
 */
export function extractEmails(str: string): string[] {
	return str?.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
}

/**
 * * Extracts all URLs from a string.
 * @param str The input string.
 * @returns An array of extracted URLs.
 */
export function extractURLs(str: string): string[] {
	return str?.match(/https?:\/\/[^\s/$.?#].[^\s]*/g) || [];
}

/**
 * * Returns a grammatically correct unit string, optionally prefixed with the number.
 *
 * @remarks For complex and versatile pluralization, please refer to {@link https://toolbox.nazmul-nhb.dev/docs/utilities/string/pluralizer pluralizer} or {@link https://toolbox.nazmul-nhb.dev/docs/classes/Pluralizer Pluralizer Class} instead.
 *
 * @param count The numeric value to determine singular or plural.
 * @param unit The unit name (e.g., "day", "hour").
 * @param withNumber Whether to prefix the count before the unit. Defaults to `true`.
 * @returns Formatted unit string like `"1 day"`, `"2 months"`, or `"hour"`.
 */
export function formatUnitWithPlural(count: number, unit: string, withNumber = true): string {
	const abs = Math.abs(count);
	const pluralized = abs === 1 ? unit : `${unit}s`;

	return withNumber ? `${count} ${pluralized}` : pluralized;
}
