import { isNonEmptyString } from '../guards/primitives';
import { LOWERCASE } from './constants';
import type {
	$LowerCaseWord,
	CamelCase,
	CapitalizeOptions,
	CaseFormat,
	ConstantCase,
	DotCase,
	KebabCase,
	PascalCase,
	PascalSnakeCase,
	PathCase,
	SentenceCase,
	SnakeCase,
	StringCaseOptions,
	TitleCase,
	TrainCase,
} from './types';

/** Lowercase words set for fast lookup */
const smallSet = /* @__PURE__ */ new Set(LOWERCASE);

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
 *   - `'Sentence case'` → Sentence case (e.g., `My variable name`)
 *   - `'lowercase'` → all lowercase [ It is recommended to use built-in string method `string.toLowerCase()` ]
 *   - `'UPPERCASE'` → all uppercase [ It is recommended to use built-in string method `string.toUpperCase()` ]
 * @param options - Optional configuration options for more control.
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
 * convertStringCase('my example string', 'Sentence case');
 * // Returns: 'My example string'
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
	if (!value || typeof value !== 'string') return '';

	const { preserveAcronyms = false } = options ?? {};

	// Unicode-aware regexes
	const LEADING_PUNCTUATION = /^[^\p{L}\p{N}\s]+/u;
	const TRAILING_PUNCTUATION = /[^\p{L}\p{N}\s]+$/u;
	const SEPARATOR = format === 'Title Case' ? /[^\p{L}\p{N}-]+/gu : /[^\p{L}\p{N}]+/gu;
	const CAMEL_BOUNDARY = /(?<=[\p{Ll}\p{N}])(?=\p{Lu})|(?<=[\p{Lu}])(?=\p{Lu}[\p{Ll}])/u;
	const LETTER_NUMBER_BOUNDARY = /(?<=[\p{L}])(?=\p{N})|(?<=[\p{N}])(?=\p{L})/u;

	// preserve leading/trailing punctuation (but not spaces)
	const start = value.match(LEADING_PUNCTUATION)?.[0] ?? '';
	const end = value.match(TRAILING_PUNCTUATION)?.[0] ?? '';
	// core trimmed of leading/trailing punctuation (but keep internal separators)
	const core = value.replace(/^[^\p{L}\p{N}\s]+|[^\p{L}\p{N}\s]+$/gu, '').trim();

	const lowerCase = (s: string) => s.toLowerCase();
	const isAcronym = (s: string) => s.length >= 2 && /^[\p{Lu}]+$/u.test(s);
	const capitalize = (s: string) => (s.length === 0 ? '' : _capitalize(s));

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

	switch (format) {
		case 'camelCase': {
			const middle = tokens
				.slice(1)
				.map((token) => {
					if (preserveAcronyms && isAcronym(token)) {
						return token; // preserve acronym as-is
					}
					return capitalize(token);
				})
				.join('');
			return start.concat(lowerCase(tokens[0]).concat(middle), end);
		}

		case 'PascalCase': {
			const body = tokens
				.map((token) => {
					if (preserveAcronyms && isAcronym(token)) return token;
					return capitalize(token);
				})
				.join('');
			return start.concat(body, end);
		}

		case 'snake_case': {
			const body = tokens.map((token) => lowerCase(token)).join('_');
			return start.concat(body, end);
		}

		case 'kebab-case': {
			const body = tokens.map((token) => lowerCase(token)).join('-');
			return start.concat(body, end);
		}

		case 'Title Case': {
			const title = tokens
				.map((token, idx, self) => {
					const tokenLower = token.toLowerCase() as $LowerCaseWord;
					// keep small words lowercase unless first or last
					if (idx !== 0 && idx !== self.length - 1 && smallSet.has(tokenLower)) {
						return tokenLower;
					}
					// If preserveAcronyms is enabled, preserve acronym-like subparts inside hyphenated tokens.
					// Example: "XML-HTTP" -> ["XML","HTTP"] -> preserved -> "XML-HTTP"
					if (preserveAcronyms && token.includes('-')) {
						return token
							.split('-')
							.map((sub) => (isAcronym(sub) ? sub : capitalize(sub)))
							.join('-');
					}
					if (preserveAcronyms && isAcronym(token)) {
						return token.split('-');
					}
					return capitalize(token);
				})
				.join(' ');

			return start.concat(title, end);
		}

		case 'Sentence case': {
			const word = tokens
				.map((token, idx) => {
					if (preserveAcronyms && token.includes('-')) {
						return token
							.split('-')
							.map((sub) =>
								isAcronym(sub) ? sub
								: idx === 0 ? capitalize(sub)
								: sub.toLowerCase()
							)
							.join('-');
					}

					if (preserveAcronyms && isAcronym(token)) {
						return token.split('-');
					}

					return idx === 0 ? capitalize(token) : token.toLowerCase();
				})
				.join(' ');

			return start.concat(word, end);
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
/**
 * * Utility to convert the first letter of any string to uppercase and the rest lowercase (unless specified).
 * * Handles surrounding symbols like quotes or parentheses.
 *
 * @param string String to be capitalized.
 * @param options Options to customize the capitalization.
 * @returns Capitalized string or fully uppercased string depending on `capitalizeAll` option.
 */
export function capitalizeString(string: string, options?: CapitalizeOptions): string {
	if (typeof string !== 'string' || !string) return '';

	const trimmedString = string.trim();
	if (!trimmedString) return '';

	const {
		capitalizeAll = false,
		capitalizeEachFirst = false,
		lowerCaseRest = true,
	} = options || {};

	if (capitalizeAll) {
		return trimmedString.toUpperCase();
	}

	if (capitalizeEachFirst) {
		return trimmedString
			?.split(/\s+/)
			?.map((word) => capitalizeString(word, { lowerCaseRest }))
			?.join(' ');
	}

	const matchArray = trimmedString.match(/^(\W*)(\w)(.*)$/);

	if (matchArray && matchArray?.length === 4) {
		const [_, leadingSymbols, firstLetter, rest] = matchArray;
		return leadingSymbols
			.concat(firstLetter.toUpperCase())
			.concat(lowerCaseRest ? rest.toLowerCase() : rest);
	}

	return trimmedString
		.charAt(0)
		.toUpperCase()
		.concat(lowerCaseRest ? trimmedString.slice(1).toLowerCase() : trimmedString.slice(1));
}

/** Cache to store regex for delimiters */
const REGEX_CACHE = /* @__PURE__ */ new Map<string, RegExp>();

/** Get delimiter regex from cache if already built the regex in previous call */
function _getDelimiterRegex(delims: string[]) {
	const key = delims.sort().join('');

	if (!REGEX_CACHE.has(key)) {
		REGEX_CACHE.set(key, new RegExp(`[-_./${delims.join('')}]`, 'g'));
	}

	return REGEX_CACHE.get(key)!;
}

/** Normalizes delimiters + splits the string */
function _normalizeDelimiters(str: string, delims: string[]): string[] {
	const delRegExp = _getDelimiterRegex(delims);

	return str
		.replace(/(\p{Ll}?\d+|(?<=\p{Lu}))(\p{Lu})/gu, '$1 $2')
		.replace(delRegExp, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.split(' ')
		.filter(Boolean);
}

/** Capitalize a string (first letter capital, rest lowercase) */
function _capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * * Converts a string into `camelCase`, using the optional custom delimiters in addition to the default delimiters.
 *
 * @remarks
 * - This utility returns appropriate type IntelliSense with string literal. For general purpose use {@link convertStringCase}.
 * - At the type level, TypeScript supports `up to 45 characters` for reliable literal inference.
 *   - This limitation does not affect runtime behavior but shows TypeScript compiler error.
 * - Use it for short literal strings (`up to 45 characters`) for best performance.
 * - It does not handle ACRONYMS properly, so be cautious when the string has ACRONYMS or use {@link convertStringCase}.
 * - Custom delimiters are merged with the default set: `space`, `.`, `-`, `_`, `/`.
 *
 * @example
 * toCamelCase("hello world")            // "helloWorld"
 * toCamelCase("my-awesome_string")      // "myAwesomeString"
 * toCamelCase("value*with+custom", "*+") // "valueWithCustom"
 *
 * @param str The input string to convert.
 * @param del Additional delimiter characters to recognize.
 * @returns The `camelCase` formatted string.
 */
export function toCamelCase<Str extends string, Del extends string = ''>(
	str: Str,
	...del: Del[]
): CamelCase<Str, Del> {
	if (!isNonEmptyString(str)) return '' as CamelCase<Str, Del>;

	const parts = _normalizeDelimiters(str, del);

	return (parts[0].toLowerCase() + parts.slice(1).map(_capitalize).join('')) as CamelCase<
		Str,
		Del
	>;
}

/**
 * * Converts a string into `PascalCase`, using the optional custom delimiters in addition to the default delimiters.
 *
 * @remarks
 * - This utility returns appropriate type IntelliSense with string literal. For general purpose use {@link convertStringCase}.
 * - At the type level, TypeScript supports `up to 45 characters` for reliable literal inference.
 *   - This limitation does not affect runtime behavior but shows TypeScript compiler error.
 * - Use it for short literal strings (`up to 45 characters`) for best performance.
 * - It does not handle ACRONYMS properly, so be cautious when the string has ACRONYMS or use {@link convertStringCase}.
 * - Custom delimiters are merged with the default set: `space`, `.`, `-`, `_`, `/`.
 *
 * @example
 * toPascalCase("hello world")            // "HelloWorld"
 * toPascalCase("my-awesome_string")      // "MyAwesomeString"
 * toPascalCase("value*with+custom", "*+") // "ValueWithCustom"
 *
 * @param str The input string to convert.
 * @param del Additional delimiter characters to recognize.
 * @returns The `PascalCase` formatted string.
 */
export function toPascalCase<Str extends string, Del extends string = ''>(
	str: Str,
	...del: Del[]
): PascalCase<Str, Del> {
	return (
		isNonEmptyString(str) ?
			_normalizeDelimiters(str, del).map(_capitalize).join('')
		:	'') as PascalCase<Str>;
}

/**
 * * Converts a string into `snake_case`, using the optional custom delimiters in addition to the default delimiters.
 *
 * @remarks
 * - This utility returns appropriate type IntelliSense with string literal. For general purpose use {@link convertStringCase}.
 * - At the type level, TypeScript supports `up to 45 characters` for reliable literal inference.
 *   - This limitation does not affect runtime behavior but shows TypeScript compiler error.
 * - Use it for short literal strings (`up to 45 characters`) for best performance.
 * - Custom delimiters are merged with the default set: `space`, `.`, `-`, `_`, `/`.
 *
 * @example
 * toSnakeCase("hello world")            // "hello_world"
 * toSnakeCase("my-awesome_string")      // "my_awesome_string"
 * toSnakeCase("value*with+custom", "*+") // "value_with_custom"
 *
 * @param str The input string to convert.
 * @param del Additional delimiter characters to recognize.
 * @returns The `snake_case` formatted string.
 */
export function toSnakeCase<Str extends string, Del extends string = ''>(
	str: Str,
	...del: Del[]
): SnakeCase<Str, Del> {
	return (
		isNonEmptyString(str) ?
			_normalizeDelimiters(str, del)
				.map((w) => w.toLowerCase())
				.join('_')
		:	'') as SnakeCase<Str, Del>;
}

/**
 * * Converts a string into `kebab-case`, using the optional custom delimiters in addition to the default delimiters.
 *
 * @remarks
 * - This utility returns appropriate type IntelliSense with string literal. For general purpose use {@link convertStringCase}.
 * - At the type level, TypeScript supports `up to 45 characters` for reliable literal inference.
 *   - This limitation does not affect runtime behavior but shows TypeScript compiler error.
 * - Use it for short literal strings (`up to 45 characters`) for best performance.
 * - Custom delimiters are merged with the default set: `space`, `.`, `-`, `_`, `/`.
 *
 * @example
 * toKebabCase("hello world")            // "hello-world"
 * toKebabCase("my-awesome_string")      // "my-awesome-string"
 * toKebabCase("value*with+custom", "*+") // "value-with-custom"
 *
 * @param str The input string to convert.
 * @param del Additional delimiter characters to recognize.
 * @returns The `kebab-case` formatted string.
 */
export function toKebabCase<Str extends string, Del extends string = ''>(
	str: Str,
	...del: Del[]
): KebabCase<Str, Del> {
	return (
		isNonEmptyString(str) ?
			_normalizeDelimiters(str, del)
				.map((w) => w.toLowerCase())
				.join('-')
		:	'') as KebabCase<Str, Del>;
}

/**
 * * Converts a string into `Train-Case`, using the optional custom delimiters in addition to the default delimiters.
 *
 * @remarks
 * - At the type level, TypeScript supports `up to 45 characters` for reliable literal inference.
 *   - This limitation does not affect runtime behavior but shows TypeScript compiler error.
 * - Use it for short literal strings (`up to 45 characters`) for best performance.
 * - Custom delimiters are merged with the default set: `space`, `.`, `-`, `_`, `/`.
 *
 * @example
 * toTrainCase("hello world")            // "Hello-World"
 * toTrainCase("my-awesome_string")      // "My-Awesome-String"
 * toTrainCase("value*with+custom", "*+") // "Value-With-Custom"
 *
 * @param str The input string to convert.
 * @param del Additional delimiter characters to recognize.
 * @returns The `Train-Case` formatted string.
 */
export function toTrainCase<Str extends string, Del extends string = ''>(
	str: Str,
	...del: Del[]
): TrainCase<Str, Del> {
	return (
		isNonEmptyString(str) ?
			_normalizeDelimiters(str, del).map(_capitalize).join('-')
		:	'') as TrainCase<Str, Del>;
}

/**
 * * Converts a string into `dot.case`, using the optional custom delimiters in addition to the default delimiters.
 *
 * @remarks
 * - At the type level, TypeScript supports `up to 45 characters` for reliable literal inference.
 *   - This limitation does not affect runtime behavior but shows TypeScript compiler error.
 * - Use it for short literal strings (`up to 45 characters`) for best performance.
 * - Custom delimiters are merged with the default set: `space`, `.`, `-`, `_`, `/`.
 *
 * @example
 * toDotCase("hello world")            // "hello.world"
 * toDotCase("my-awesome_string")      // "my.awesome.string"
 * toDotCase("value*with+custom", "*+") // "value.with.custom"
 *
 * @param str The input string to convert.
 * @param del Additional delimiter characters to recognize.
 * @returns The `dot.case` formatted string.
 */
export function toDotCase<Str extends string, Del extends string = ''>(
	str: Str,
	...del: Del[]
): DotCase<Str, Del> {
	return (isNonEmptyString(str) ? _normalizeDelimiters(str, del).join('.') : '') as DotCase<
		Str,
		Del
	>;
}

/**
 * * Converts a string into `path/case`, using the optional custom delimiters in addition to the default delimiters.
 *
 * @remarks
 * - At the type level, TypeScript supports `up to 45 characters` for reliable literal inference.
 *   - This limitation does not affect runtime behavior but shows TypeScript compiler error.
 * - Use it for short literal strings (`up to 45 characters`) for best performance.
 * - Custom delimiters are merged with the default set: `space`, `.`, `-`, `_`, `/`.
 *
 * @example
 * toPathCase("hello world")            // "hello/world"
 * toPathCase("my-awesome_string")      // "my/awesome/string"
 * toPathCase("value*with+custom", "*+") // "value/with/custom"
 *
 * @param str The input string to convert.
 * @param del Additional delimiter characters to recognize.
 * @returns The `path/case` formatted string.
 */
export function toPathCase<Str extends string, Del extends string = ''>(
	str: Str,
	...del: Del[]
): PathCase<Str, Del> {
	return (
		isNonEmptyString(str) ?
			_normalizeDelimiters(str, del)
				.map((w) => w.toLowerCase())
				.join('/')
		:	'') as PathCase<Str, Del>;
}

/**
 * * Converts a string into `CONSTANT_CASE`, using the optional custom delimiters in addition to the default delimiters.
 *
 * @remarks
 * - At the type level, TypeScript supports `up to 45 characters` for reliable literal inference.
 *   - This limitation does not affect runtime behavior but shows TypeScript compiler error.
 * - Use it for short literal strings (`up to 45 characters`) for best performance.
 * - Custom delimiters are merged with the default set: `space`, `.`, `-`, `_`, `/`.
 *
 * @example
 * toConstantCase("hello world")            // "HELLO_WORLD"
 * toConstantCase("my-awesome_string")      // "MY_AWESOME_STRING"
 * toConstantCase("value*with+custom", "*+") // "VALUE_WITH_CUSTOM"
 *
 * @param str The input string to convert.
 * @param del Additional delimiter characters to recognize.
 * @returns The `CONSTANT_CASE` formatted string.
 */
export function toConstantCase<Str extends string, Del extends string = ''>(
	str: Str,
	...del: Del[]
): ConstantCase<Str, Del> {
	return (
		isNonEmptyString(str) ?
			_normalizeDelimiters(str, del)
				.map((w) => w.toUpperCase())
				.join('_')
		:	'') as ConstantCase<Str, Del>;
}

/**
 * * Converts a string into `Pascal_Snake_Case`, using the optional custom delimiters in addition to the default delimiters.
 *
 * @remarks
 * - At the type level, TypeScript supports `up to 45 characters` for reliable literal inference.
 *   - This limitation does not affect runtime behavior but shows TypeScript compiler error.
 * - Use it for short literal strings (`up to 45 characters`) for best performance.
 * - Custom delimiters are merged with the default set: `space`, `.`, `-`, `_`, `/`.
 *
 * @example
 * toPascalSnakeCase("hello world")            // "Hello_World"
 * toPascalSnakeCase("my-awesome_string")      // "My_Awesome_String"
 * toPascalSnakeCase("value*with+custom", "*+") // "Value_With_Custom"
 *
 * @param str The input string to convert.
 * @param del Additional delimiter characters to recognize.
 * @returns The `Pascal_Snake_Case` formatted string.
 */
export function toPascalSnakeCase<Str extends string, Del extends string = ''>(
	str: Str,
	...del: Del[]
): PascalSnakeCase<Str, Del> {
	return (
		isNonEmptyString(str) ?
			_normalizeDelimiters(str, del).map(_capitalize).join('_')
		:	'') as PascalSnakeCase<Str, Del>;
}

/**
 * * Converts a string into `Title Case`, using the optional custom delimiters in addition to the default delimiters.
 *
 * @remarks
 * - This utility returns appropriate type IntelliSense with string literal. For general purpose use {@link convertStringCase}.
 * - At the type level, TypeScript supports `up to 45 characters` for reliable literal inference.
 *   - This limitation does not affect runtime behavior but shows TypeScript compiler error.
 * - Use it for short literal strings (`up to 45 characters`) for best performance.
 * - It does not handle ACRONYMS properly, so be cautious when the string has ACRONYMS or use {@link convertStringCase}.
 * - Custom delimiters are merged with the default set: `space`, `.`, `-`, `_`, `/`.
 *
 * @example
 * toTitleCase("hello world")            // "Hello World"
 * toTitleCase("my-awesome_string")      // "My Awesome String"
 * toTitleCase("value*with+custom", "*+") // "Value with Custom"
 *
 * @param str The input string to convert.
 * @param del Additional delimiter characters to recognize.
 * @returns The `Title Case` formatted string.
 */
export function toTitleCase<Str extends string, Del extends string = ''>(
	str: Str,
	...del: Del[]
): TitleCase<Str, Del> {
	return (
		isNonEmptyString(str) ?
			_normalizeDelimiters(str, del)
				.map((w, i) =>
					i !== 0 && smallSet.has(w as $LowerCaseWord) ?
						w.toLowerCase()
					:	_capitalize(w)
				)
				.join(' ')
		:	'') as TitleCase<Str, Del>;
}

/**
 * * Converts a string into `Sentence case`, using the optional custom delimiters in addition to the default delimiters.
 *
 * @remarks
 * - This utility returns appropriate type IntelliSense with string literal. For general purpose use {@link convertStringCase}.
 * - At the type level, TypeScript supports `up to 45 characters` for reliable literal inference.
 *   - This limitation does not affect runtime behavior but shows TypeScript compiler error.
 * - Use it for short literal strings (`up to 45 characters`) for best performance.
 * - It does not handle ACRONYMS properly, so be cautious when the string has ACRONYMS or use {@link convertStringCase}.
 * - Custom delimiters are merged with the default set: `space`, `.`, `-`, `_`, `/`.
 *
 * @example
 * toSentenceCase("hello world")            // "Hello world"
 * toSentenceCase("my-awesome_string")      // "My awesome string"
 * toSentenceCase("value*with+custom", "*+") // "Value with custom"
 *
 * @param str The input string to convert.
 * @param del Additional delimiter characters to recognize.
 * @returns The `Sentence case` formatted string.
 */
export function toSentenceCase<Str extends string, Del extends string = ''>(
	str: Str,
	...del: Del[]
): SentenceCase<Str, Del> {
	return (
		isNonEmptyString(str) ?
			_normalizeDelimiters(str, del)
				.map((w, i) => (i === 0 ? _capitalize(w) : w.toLowerCase()))
				.join(' ')
		:	'') as SentenceCase<Str, Del>;
}
