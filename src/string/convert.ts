import { trimString } from './basics';
import { LOWERCASE } from './constants';
import type { CaseFormat, MaskOptions } from './types';

/**
 * * Converts a string to a specified case format such as `camelCase`, `snake_case`, `kebab-case`, `PascalCase`, `Title Case`, `lowercase`, or `UPPERCASE`.
 *
 * - This function handles non-alphanumeric characters (e.g., spaces, hyphens, underscores, dots, slashes) as word delimiters. For `Title Case`, prepositions, articles, conjunctions, and auxiliary verbs are not capitalized unless they appear at the start of the title.
 * - You can also convert the string to `lowercase` or `UPPERCASE`, but it's recommended to use default string methods like `string.toLowerCase()` and `string.toUpperCase()` for these cases.
 *
 * @param string The input string to be converted. The string should have words separated by non-alphanumeric characters (e.g., spaces, hyphens, underscores, etc.).
 * @param format The format to convert the string to. The available formats are:
 *   - `'camelCase'`: Converts to camelCase (e.g., `myVariableName`).
 *   - `'snake_case'`: Converts to snake_case (e.g., `my_variable_name`).
 *   - `'kebab-case'`: Converts to kebab-case (e.g., `my-variable-name`).
 *   - `'PascalCase'`: Converts to PascalCase (e.g., `MyVariableName`).
 *   - `'Title Case'`: Converts to Title Case (e.g., `My Variable Name`), where certain words like `prepositions, articles, conjunctions and auxiliary verbs` are not capitalized unless at the start.
 *   - `'lowercase'`: Converts the string to all lowercase characters.
 *   - `'UPPERCASE'`: Converts the string to all uppercase characters.
 * @returns The formatted string in the specified case format.
 * @example
 * convertStringCase('my-example_string', 'camelCase'); // returns 'myExampleString'
 * convertStringCase('my-example_string', 'snake_case'); // returns 'my_example_string'
 * convertStringCase('my-example_string', 'kebab-case'); // returns 'my-example-string'
 * convertStringCase('my example string', 'Title Case'); // returns 'My Example String'
 * convertStringCase('my example string', 'lowercase'); // returns 'my example string'
 * convertStringCase('my example string', 'UPPERCASE'); // returns 'MY EXAMPLE STRING'
 */
export function convertStringCase(string: string, format: CaseFormat): string {
	if (!string || typeof string !== 'string') return '';

	const start = string?.match(/^[^\d\w\s]+/)?.[0] || '';
	const end = string?.match(/[^\d\w\s]+$/)?.[0] || '';
	const core = string?.replace(/^[^\d\w\s]+|[^\w\s]+$/g, '').trim();

	const titleCase = core
		?.split(/\s+/g)
		?.map((part) => {
			const startSymbol = part.match(/^[^\d\w\s]+/)?.[0] || ''; // Capture leading symbols
			const endSymbol = part.match(/[^\d\w\s]+$/)?.[0] || ''; // Capture trailing symbols
			const coreWord = part.replace(/^[^\d\w\s]+|[^\d\w\s]+$/g, ''); // Remove them for processing

			if (LOWERCASE.includes(coreWord?.toLowerCase())) {
				return startSymbol + coreWord?.toLowerCase() + endSymbol;
			}

			return (
				startSymbol +
				coreWord?.charAt(0)?.toUpperCase() +
				coreWord?.slice(1)?.toLowerCase() +
				endSymbol
			);
		})
		.join(' ');

	const formattedString = string?.replace(
		/[^a-zA-Z0-9]+(.)?/g,
		(_, chr: string) => (chr ? chr?.toUpperCase() : ''),
	);

	if (!formattedString) return '';

	switch (format) {
		case 'camelCase':
			// return formattedString.replace(/[A-Z]/g, (letter, index) =>
			// 	index === 0 ? letter.toUpperCase() : letter.toLowerCase(),
			// );
			return (
				formattedString.charAt(0).toLowerCase() +
				formattedString.slice(1)
			);

		case 'snake_case':
			return /[^a-zA-Z0-9]/.test(string) ?
					string.split(/\W+/g).join('_').toLowerCase()
				:	formattedString.replace(/[A-Z]/g, (letter, index) =>
						index === 0 ?
							letter.toLowerCase()
						:	`_${letter.toLowerCase()}`,
					);

		case 'kebab-case':
			return /[^a-zA-Z0-9]/.test(string) ?
					string.split(/\W+/g).join('-').toLowerCase()
				:	formattedString.replace(/[A-Z]/g, (letter, index) =>
						index === 0 ?
							letter.toLowerCase()
						:	`-${letter.toLowerCase()}`,
					);

		case 'PascalCase':
			return (
				formattedString.charAt(0).toUpperCase() +
				formattedString.slice(1)
			);

		case 'Title Case':
			return (
				start +
				titleCase.charAt(0).toUpperCase() +
				titleCase.slice(1) +
				end
			);

		case 'lowercase':
			return start + core.toLowerCase() + end;

		case 'UPPERCASE':
			return start + core.toUpperCase() + end;

		default:
			return formattedString;
	}
}

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
	replace: string,
): string => {
	const trimmedString = trimString(input);

	const regex =
		typeof find === 'string' ?
			new RegExp(find, 'g')
		:	new RegExp(
				find,
				find?.flags.includes('g') ? find?.flags : find?.flags + 'g',
			);

	return trimmedString?.replace(regex, replace);
};

/**
 * * Converts a string into a URL-friendly slug.
 * @param input - The string to be converted.
 * @returns The slugified string.
 */
export const slugifyString = (input: string): Lowercase<string> => {
	return trimString(input)
		?.toLowerCase()
		?.replace(/[^a-z0-9]+/g, '-')
		?.replace(/^-+|-+$/g, '') as Lowercase<string>;
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
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * * Extracts all email addresses from a string.
 * @param str The input string.
 * @returns An array of extracted email addresses.
 */
export function extractEmails(str: string): string[] {
	return str.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
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
 * @param count The numeric value to determine singular or plural.
 * @param unit The unit name (e.g., "day", "hour").
 * @param withNumber Whether to prefix the count before the unit. Defaults to `true`.
 * @returns Formatted unit string like `"1 day"`, `"2 months"`, or `"hour"`.
 */
export function formatUnitWithPlural(
	count: number,
	unit: string,
	withNumber = true,
): string {
	const abs = Math.abs(count);
	const pluralized = abs === 1 ? unit : `${unit}s`;

	return withNumber ? `${count} ${pluralized}` : pluralized;
}
