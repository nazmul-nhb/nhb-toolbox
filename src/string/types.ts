import type { $Countries } from '../object/types';
import type { Join, LooseLiteral, Split } from '../utils/types';
import type { LOWERCASE } from './constants';

/** - Options for generating anagrams. */
export interface AnagramOptions {
	/** Limit the anagrams output. Default is `100`. */
	limit?: number | 'all';
	/**
	 * - Dictionary data (array of strings). Default is `false`.
	 * 	 - If an array of strings is passed only the anagrams found in that dictionary will be returned.
	 */
	dictionary?: false | string[];
}

/** - Options for `capitalizeString` function. */
export interface CapitalizeOptions {
	/** If true, capitalizes the first letter of each word (space separated). Defaults to `false`. */
	capitalizeEachFirst?: boolean;
	/** If true, ensures that the whole string is capitalized. Defaults to `false`. */
	capitalizeAll?: boolean;
	/** If true, ensures that the rest of the string is lowercase. Defaults to `true`. */
	lowerCaseRest?: boolean;
}

/** - Configuration options for ID generation. */
export interface RandomIdOptions {
	/** A string to prepend to the ID. Default is an empty string. */
	prefix?: string;

	/** A string to append to the ID. Default is an empty string.*/
	suffix?: string;

	/** Whether to include the current timestamp in the ID. Default is `false`. */
	timeStamp?: boolean;

	/** The length of the random alphanumeric string. Default is `16`. */
	length?: number;

	/** The separator to use between parts of the ID. Default is an empty string. */
	separator?: string;

	/** Specifies the case for the random alphanumeric string. Default is `null`. */
	caseOption?: 'upper' | 'lower' | null;
}

/** - Case formats for converting a string */
export type CaseFormat =
	| 'camelCase'
	| 'snake_case'
	| 'kebab-case'
	| 'PascalCase'
	| 'Title Case'
	| 'Sentence case'
	| 'UPPERCASE'
	| 'lowercase';

/** * Options for `convertStringCase`. */
export interface StringCaseOptions {
	/**
	 * Preserve acronym-like tokens (tokens that are ALL UPPERCASE with length >= 2)
	 * when converting to PascalCase / Title Case / camelCase (mid tokens).
	 *
	 * Behavior summary:
	 * - PascalCase: keep acronyms intact (API -> API).
	 * - camelCase: first token acronyms are lowercased entirely (API -> api),
	 *   subsequent token acronyms are preserved (API -> API).
	 * - Title Case: acronym tokens are preserved (API).
	 * - snake_case / kebab-case: tokens are lowercased (xml-http-request).
	 */
	preserveAcronyms?: boolean;
}

/** Options for masking a string. */
export interface MaskOptions {
	/** Number of characters to keep at the start. Defaults to `1`. */
	start?: number;
	/** Number of characters to keep at the end. Defaults to `1`. */
	end?: number;
	/** Character to use for masking. Defaults to `*`. */
	maskCharacter?: string;
}

/** Formatted query string as `?${string}` = `?key=value&...` or empty string. */
export type QueryString = `?${string}` | '';

/** Full country name */
export type CountryName = $Countries['country_name'];

/** Country code, e.g. `"880" | "973" | "994" | "1-242" ...` */
export type CountryCode = $Countries['country_code'];

/** ISO country country codes (3-character), e.g. `"BGD" | "BRB" | "BLR" ...` */
export type CountryISO = $Countries['iso_code'];

/** ISO country country codes (2-character), e.g. `"BD" | "BB" | "BY" ...` */
export type CountryShortISO = $Countries['iso_code_short'];

/** ISO 2 character country code or any string */
export type Country = LooseLiteral<CountryShortISO>;

/** Lowercase prepositions, articles, conjunctions, and auxiliary verbs ({@link LOWERCASE}) */
export type $LowerCaseWord = (typeof LOWERCASE)[number];

// ! ======= Utility Types ======= ! //

/** Ensure early inference and string constraint. */
export type $EnsureString<Str> = Str extends string ? Str : never;

/** Check if a string literal `Str` contains a substring `SubStr` */
export type Includes<Str extends string, SubStr extends string> =
	Str extends `${string}${SubStr}${string}` ? true : false;

/** Trim leading space from a string literal */
export type $TrimLeft<Str extends string> = Str extends ` ${infer R}` ? $TrimLeft<R> : Str;

/** Trim trailing space from a string literal */
export type $TrimRight<Str extends string> = Str extends `${infer L} ` ? $TrimRight<L> : Str;

/** Trim leading and trailing spaces from a string literal */
export type Trim<Str extends string> = $TrimRight<$TrimLeft<Str>>;

/** Default delimiter characters */
type $DefaultDelimiters = ' ' | '-' | '_' | '.' | '/';

/** Turn user delim string like "*+," into '*, +, ,' union */
type $UserDelimiters<Del extends string> =
	Del extends '' ? never
	: Del extends `${infer C}${infer R}` ? C | $UserDelimiters<R>
	: never;

/** Is char `C` a delimiter (either default or user-provided)? */
type $IsDelimiter<C extends string, Del extends string> =
	C extends $DefaultDelimiters ? true
	: C extends $UserDelimiters<Del> ? true
	: false;

/** Insert space before capital letters: "helloWorld" -> "hello World" */
type $SpaceBeforeCaps<Str extends string> =
	Str extends `${infer F}${infer R}` ?
		R extends Uncapitalize<R> ?
			`${F}${$SpaceBeforeCaps<R>}`
		:	`${F} ${$SpaceBeforeCaps<R>}`
	:	Str;

/** Replace delimiter(s) with space(s) */
type $ReplaceDelimiters<
	Str extends string,
	Del extends string,
	Acc extends string = '',
	LastWasSpace extends boolean = false,
> =
	Str extends `${infer F}${infer R}` ?
		$IsDelimiter<F, Del> extends true ?
			$ReplaceDelimiters<
				R,
				Del,
				Acc extends '' ? ' '
				: LastWasSpace extends true ? Acc
				: `${Acc} `,
				true
			>
		:	$ReplaceDelimiters<R, Del, `${Acc}${F}`, false>
	:	Acc;

/** Normalize {@link $DefaultDelimiters} or {@link $UserDelimiters} `Del` in a string literal `Str` with space(s) */
export type $NormalizeString<Str extends string, Del extends string = ''> = Trim<
	$ReplaceDelimiters<$SpaceBeforeCaps<Str>, Del, '', false>
>;

/** Lowercase all the words in a tuple */
export type $LowercaseWords<T extends readonly string[]> =
	T extends [infer H extends string, ...infer R extends string[]] ?
		[Lowercase<H>, ...$LowercaseWords<R>]
	:	[];

/** Uppercase all the words in a tuple */
export type $UppercaseWords<T extends readonly string[]> =
	T extends [infer H extends string, ...infer R extends string[]] ?
		[Uppercase<Lowercase<H>>, ...$UppercaseWords<R>]
	:	[];

/** Capitalize (first letter capital) all the words in a tuple */
export type $CapitalizeWords<T extends readonly string[]> =
	T extends [infer H extends string, ...infer R extends string[]] ?
		[Capitalize<Lowercase<H>>, ...$CapitalizeWords<R>]
	:	[];

/** Capitalize (first letter capital) all the words in a tuple */
export type $TitleCaseWords<T extends readonly string[]> =
	T extends [infer H extends string, ...infer R extends string[]] ?
		[
			H extends $LowerCaseWord ? Lowercase<H> : Capitalize<Lowercase<H>>,
			...$TitleCaseWords<R>,
		]
	:	[];

/**
 * - Converts a string literal `Str` into `camelCase`, using optional custom delimiters `Del` alongside {@link $DefaultDelimiters}.
 * @remarks TypeScript supports up to ~45 characters for reliable literal inference.
 */
export type CamelCase<Str extends string, Del extends string = ''> =
	Split<$NormalizeString<Str, Del>, ' '> extends (
		[infer F extends string, ...infer R extends string[]]
	) ?
		`${Lowercase<F>}${Join<$CapitalizeWords<R>, ''>}`
	:	'';

/**
 * - Converts a string literal `Str` into `snake_case`, using optional custom delimiters `Del` alongside {@link $DefaultDelimiters}.
 * @remarks TypeScript supports up to ~45 characters for reliable literal inference.
 */
export type SnakeCase<Str extends string, Del extends string = ''> = Join<
	$LowercaseWords<Split<$NormalizeString<Str, Del>, ' '>>,
	'_'
>;

/**
 * - Converts a string literal `Str` into `kebab-case`, using optional custom delimiters `Del` alongside {@link $DefaultDelimiters}.
 * @remarks TypeScript supports up to ~45 characters for reliable literal inference.
 */
export type KebabCase<Str extends string, Del extends string = ''> = Join<
	$LowercaseWords<Split<$NormalizeString<Str, Del>, ' '>>,
	'-'
>;

/**
 * - Converts a string literal `Str` into `PascalCase`, using optional custom delimiters `Del` alongside {@link $DefaultDelimiters}.
 * @remarks TypeScript supports up to ~45 characters for reliable literal inference.
 */
export type PascalCase<Str extends string, Del extends string = ''> = Join<
	$CapitalizeWords<Split<$NormalizeString<Str, Del>, ' '>>,
	''
>;

/**
 * - Converts a string literal `Str` into `Pascal_Snake_Case`, using optional custom delimiters `Del` alongside {@link $DefaultDelimiters}.
 * @remarks TypeScript supports up to ~45 characters for reliable literal inference.
 */
export type PascalSnakeCase<Str extends string, Del extends string = ''> = Join<
	$CapitalizeWords<Split<$NormalizeString<Str, Del>, ' '>>,
	'_'
>;

/**
 * - Converts a string literal `Str` into `CONSTANT_CASE`, using optional custom delimiters `Del` alongside {@link $DefaultDelimiters}.
 * @remarks TypeScript supports up to ~45 characters for reliable literal inference.
 */
export type ConstantCase<Str extends string, Del extends string = ''> = Join<
	$UppercaseWords<Split<$NormalizeString<Str, Del>, ' '>>,
	'_'
>;

/**
 * - Converts a string literal `Str` into `Train-Case`, using optional custom delimiters `Del` alongside {@link $DefaultDelimiters}.
 * @remarks TypeScript supports up to ~45 characters for reliable literal inference.
 */
export type TrainCase<Str extends string, Del extends string = ''> = Join<
	$CapitalizeWords<Split<$NormalizeString<Str, Del>, ' '>>,
	'-'
>;

/**
 * - Converts a string literal `Str` into `Dot.Case`/`dot.case`, using optional custom delimiters `Del` alongside {@link $DefaultDelimiters}.
 * @remarks TypeScript supports up to ~45 characters for reliable literal inference.
 */
export type DotCase<Str extends string, Del extends string = ''> = Join<
	Split<$NormalizeString<Str, Del>, ' '>,
	'.'
>;

/**
 * - Converts a string literal `Str` into `path/case`, using optional custom delimiters `Del` alongside {@link $DefaultDelimiters}.
 * @remarks TypeScript supports up to ~45 characters for reliable literal inference.
 */
export type PathCase<Str extends string, Del extends string = ''> = Join<
	$LowercaseWords<Split<$NormalizeString<Str, Del>, ' '>>,
	'/'
>;

/**
 * - Converts a string literal `Str` into `Title Case`, using optional custom delimiters `Del` alongside {@link $DefaultDelimiters}.
 * @remarks
 * - TypeScript supports up to ~45 characters for reliable literal inference.
 * - Lowercase auxiliaries, prepositions, articles and conjunctions unless they are at the beginning.
 */
export type TitleCase<Str extends string, Del extends string = ''> =
	Split<$NormalizeString<Str, Del>, ' '> extends (
		[infer F extends string, ...infer R extends string[]]
	) ?
		`${Capitalize<Lowercase<F>>} ${Join<$TitleCaseWords<R>, ' '>}`
	:	' ';

/**
 * - Converts a string literal `Str` into `Sentence case`, using optional custom delimiters `Del` alongside {@link $DefaultDelimiters}.
 * @remarks It will lowercase: auxiliaries, prepositions, articles and conjunctions unless they are at the beginning.
 */
export type SentenceCase<Str extends string, Del extends string = ''> =
	Split<$NormalizeString<Str, Del>, ' '> extends (
		[infer F extends string, ...infer R extends string[]]
	) ?
		`${Capitalize<Lowercase<F>>} ${Join<$LowercaseWords<R>, ' '>}`
	:	' ';
