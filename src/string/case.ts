import { LOWERCASE } from './constants';
import type { CaseFormat, StringCaseOptions } from './types';

/**
 * * Converts a string to a specified case format with advanced handling for word boundaries, punctuation, acronyms, and Unicode characters.
 *
 * @remarks
 * - This function is Unicode-aware, treats non-alphanumeric characters (spaces, underscores, dots, slashes, etc.) as word boundaries, and optionally preserves internal acronyms.
 * - `Title Case` formatting respects small words such as prepositions, articles, conjunctions, and auxiliary verbs (defined in `LOWERCASE`) — these are not capitalized unless they appear at the start or end of the string.
 * - Leading and trailing punctuation (non-letter/number characters) is preserved in the result.
 *
 * @param value - The input string to convert. Can contain letters, numbers, punctuation,
 *   spaces, underscores, dashes, etc.
 * @param format - The target case format:
 *   - `'camelCase'` → camelCase (e.g., `myVariableName`)
 *   - `'PascalCase'` → PascalCase (e.g., `MyVariableName`)
 *   - `'snake_case'` → snake_case (e.g., `my_variable_name`)
 *   - `'kebab-case'` → kebab-case (e.g., `my-variable-name`)
 *   - `'Title Case'` → Title Case (e.g., `My Variable Name`)
 *   - `'lowercase'` → all lowercase [ It is recommended to use built-in string method `string.toLowerCase()` ]
 *   - `'UPPERCASE'` → all uppercase [ It is recommended to use built-in string method `string.toUpperCase()` ]
 * @param options - Optional configuration settings.
 *
 * @returns The converted string, with leading/trailing punctuation preserved.
 *
 * @example
 * // Basic usage
 * convertStringCase('my-example_string', 'camelCase');
 * // Returns: 'myExampleString'
 *
 * convertStringCase('my-example_string', 'snake_case');
 * // Returns: 'my_example_string'
 *
 * convertStringCase('my-example_string', 'kebab-case');
 * // Returns: 'my-example-string'
 *
 * convertStringCase('my example string', 'Title Case');
 * // Returns: 'My Example String'
 *
 * convertStringCase('My example String', 'lowercase');
 * // Returns: 'my example string'
 *
 * convertStringCase('my example string', 'UPPERCASE');
 * // Returns: 'MY EXAMPLE STRING'
 *
 * @example
 * // Preserve acronyms
 * convertStringCase('get API response', 'camelCase', { preserveAcronyms: true });
 * // Returns: 'getAPIResponse'
 *
 * convertStringCase('get API response', 'PascalCase', { preserveAcronyms: true });
 * // Returns: 'GetAPIResponse'
 *
 * convertStringCase('the API of things', 'Title Case', { preserveAcronyms: true });
 * // Returns: 'The API of Things'
 *
 * @example
 * // Leading/trailing punctuation is preserved
 * convertStringCase('++hello_world++', 'PascalCase');
 * // Returns: '++HelloWorld++'
 *
 * @example
 * // Dashes are preserved in Title Case
 * convertStringCase('xml-http_request', 'Title Case');
 * // Returns: 'Xml-http Request'
 *
 * @example
 * // Empty string returns empty
 * convertStringCase('', 'camelCase');
 * // Returns: ''
 *
 * @example
 * // Single token is capitalized properly
 * convertStringCase('api', 'PascalCase');
 * // Returns: 'Api'
 */
export function convertStringCase(
	value: string,
	format: CaseFormat,
	options?: StringCaseOptions
): string {
	/** Lowercase prepositions, articles, conjunctions, and auxiliary verbs */ type Lower =
		(typeof LOWERCASE)[number];

	if (!value || typeof value !== 'string') return '';

	const { preserveAcronyms = false } = options ?? {};

	// Unicode-aware regexes
	const LEADING_PUNCTUATION = /^[^\p{L}\p{N}\s]+/u;
	const TRAILING_PUNCTUATION = /[^\p{L}\p{N}\s]+$/u;
	const SEPARATOR =
		format === 'Title Case' ? /[^\p{L}\p{N}-]+/gu : /[^\p{L}\p{N}]+/gu;
	const CAMEL_BOUNDARY =
		/(?<=[\p{Ll}\p{N}])(?=\p{Lu})|(?<=[\p{Lu}])(?=\p{Lu}[\p{Ll}])/u;
	const LETTER_NUMBER_BOUNDARY =
		/(?<=[\p{L}])(?=\p{N})|(?<=[\p{N}])(?=\p{L})/u;

	// preserve leading/trailing punctuation (but not spaces)
	const start = value.match(LEADING_PUNCTUATION)?.[0] ?? '';
	const end = value.match(TRAILING_PUNCTUATION)?.[0] ?? '';
	// core trimmed of leading/trailing punctuation (but keep internal separators)
	const core = value
		.replace(/^[^\p{L}\p{N}\s]+|[^\p{L}\p{N}\s]+$/gu, '')
		.trim();

	const lower = (s: string) => s.toLowerCase();
	const isAcronym = (s: string) => s.length >= 2 && /^[\p{Lu}]+$/u.test(s);
	const capitalize = (s: string) =>
		s.length === 0 ?
			''
		:	s.charAt(0).toUpperCase().concat(s.slice(1).toLowerCase());

	// Tokenize into logical words:
	// 1) split on explicit separators (space, underscore, dash, punctuation)
	// 2) if result is single token, try splitting camel/pascal boundaries
	// 3) also try splitting letter<->number boundaries
	let tokens = core.length > 0 ? core.split(SEPARATOR).filter(Boolean) : [];

	if (tokens.length <= 1 && core.length > 0) {
		if (CAMEL_BOUNDARY.test(core)) {
			tokens = core.split(CAMEL_BOUNDARY).filter(Boolean);
		} else if (LETTER_NUMBER_BOUNDARY.test(core)) {
			tokens = core.split(LETTER_NUMBER_BOUNDARY).filter(Boolean);
		} else {
			tokens = [core];
		}
	}

	if (tokens.length === 0) {
		// nothing meaningful to do — return only punctuation (if any)
		return start.concat(end);
	}

	// Title-case small words set for fast lookup
	const smallSet = new Set(LOWERCASE);

	switch (format) {
		case 'camelCase': {
			const firstToken = tokens[0];
			const first = lower(firstToken);

			const rest = tokens
				.slice(1)
				.map((t) => {
					if (preserveAcronyms && isAcronym(t)) {
						return t; // preserve acronym as-is
					}
					return capitalize(t);
				})
				.join('');
			return start.concat(first.concat(rest), end);
		}

		case 'PascalCase': {
			const body = tokens
				.map((t) => {
					if (preserveAcronyms && isAcronym(t)) return t;
					return capitalize(t);
				})
				.join('');
			return start.concat(body, end);
		}

		case 'snake_case': {
			const body = tokens.map((t) => lower(t)).join('_');
			return start.concat(body, end);
		}

		case 'kebab-case': {
			const body = tokens.map((t) => lower(t)).join('-');
			return start.concat(body, end);
		}

		case 'Title Case': {
			const title = tokens
				.map((t, i, arr) => {
					const tlc = t.toLowerCase() as Lower;
					// keep small words lowercase unless first or last
					if (i !== 0 && i !== arr.length - 1 && smallSet.has(tlc)) {
						return tlc;
					}
					if (preserveAcronyms && isAcronym(t)) {
						return t;
					}
					return capitalize(t);
				})
				.join(' ');
			return start.concat(title, end);
		}

		case 'lowercase': {
			return start.concat(core.toLowerCase(), end);
		}

		case 'UPPERCASE': {
			return start.concat(core.toUpperCase(), end);
		}

		default: {
			return start.concat(core, end);
		}
	}
}
