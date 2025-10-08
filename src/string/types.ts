import type { $Countries } from '../object/types';
import type { LooseLiteral } from '../utils/types';

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

/** - Options for generating anagrams. */
export interface AnagramOptions {
	/** Limit the anagrams output. Default is `100`. */
	limit?: number | 'all';
	/** Whether to lookup in the dictionary. Default is `false`. */
	validWords?: boolean;
}

/** - Case formats for converting a string */
export type CaseFormat =
	| 'camelCase'
	| 'snake_case'
	| 'kebab-case'
	| 'PascalCase'
	| 'Title Case'
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
