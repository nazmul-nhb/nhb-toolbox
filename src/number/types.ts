import type { LooseLiteral, Repeat } from '../utils/types';
import type {
	CURRENCY_CODES,
	CURRENCY_LOCALES,
	LOCALE_CODES,
	PREFIX_MULTIPLIERS,
	SUPPORTED_CURRENCIES,
	UNITS,
} from './constants';
import type { Unit } from './Unit';

/** Enumerate & Enumerate Internal: builds a union of all numbers from 0 to N - 1 */
type $EnumerateInternal<N extends number, Acc extends number[] = []> =
	Acc['length'] extends N ? Acc[number] : $EnumerateInternal<N, [...Acc, Acc['length']]>;

/**
 * * Builds a union of numeric literals from `0` to `N - 1`.
 *
 * @remarks
 * - This utility supports ranges up to 998 due to TypeScript recursion limits.
 *
 * @example
 * type U = Enumerate<3>; // 0 | 1 | 2
 */
export type Enumerate<N extends number> = $EnumerateInternal<N>;

/** Helper: Add 1 to a number */
type $AddOne<N extends number, Acc extends unknown[] = []> =
	Acc['length'] extends N ? [...Acc, unknown]['length'] : $AddOne<N, [...Acc, unknown]>;

/**
 *
 * * Creates a union type of all numeric literals starting from `From` up to `To`.
 *
 * @example
 * type R = NumberRange<2, 5>; // 2 | 3 | 4  5
 * type N = NumberRange<0, 998>; // 0 | 1 | 2 | ... | 998
 *
 * @remarks
 * - This utility supports ranges up to 998 due to TypeScript recursion limits.
 * - `From` and `To` both are inclusive, — so `NumberRange<0, 998>` generates `0` to `998`.
 * - Result is a union type, not a tuple or array.
 *
 * @generic From - A number from 0-998, start of the range.
 * @generic To - A number from 1-998, end of the range.
 * @returns A union of numeric literal types from `From` to `To - 1`.
 */
export type NumberRange<From extends number, To extends number> = Exclude<
	Enumerate<$AddOne<To>>,
	Enumerate<From>
>;

/** - Number value in percentage `(0% - 100%)` without `%` symbol. */
export type Percent = Enumerate<101>;

/** - Options for random number generator */
export interface RandomNumberOptions {
	/** Minimum number to start with. */
	min?: number;
	/** Maximum number to end with. */
	max?: number;
	/** Whether to include the minimum number. */
	includeMin?: boolean;
	/** Whether to include the maximum number. */
	includeMax?: boolean;
}

/** - Decimal options for converting to decimal */
export interface DecimalOptions<T extends boolean | undefined = false> {
	/** Number of decimal places to round to. Defaults to `2`. */
	decimalPlaces?: number;
	/** If the return value is in `string` or `number`. Defaults to `false`. */
	isString?: T;
}

/** - Converted decimal type either `number` or `string`. */
export type ConvertedDecimal<T> = T extends true ? `${number}` : number;

/** - Type of numbers to generate */
export type NumberType = 'any' | 'natural' | 'odd' | 'even' | 'prime' | 'random';

/** - Options for generating numbers in a range */
export interface RangeOptions<T extends boolean = false> extends RandomNumberOptions {
	/** Separator for the string format if `getAsString` is `true`. Defaults to `", "`. */
	separator?: T extends true ? string : never;
	/** The multiples of which number to consider in the result. */
	multiplesOf?: number;
	/** The format for the result - `{ getAsString: true }` returns strings with custom separator and `false` returns array of numbers. Default is `false`. */
	getAsString?: T;
}

/** - The return type of the `getNumbersInRange` function */
export type RangedNumbers<T extends boolean = false> = T extends true ? string : number[];

/** List of ISO 4217 currency codes. */
export type CurrencyCode = keyof typeof CURRENCY_LOCALES | (typeof CURRENCY_CODES)[number];

/** - List of all supported BCP 47 locales */
export type LocaleCode =
	| (typeof CURRENCY_LOCALES)[keyof typeof CURRENCY_LOCALES]
	| (typeof LOCALE_CODES)[number];

/** * Fiat currencies supported by Frankfurter API */
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

/** - Options for `convert` method in `Currency` class */
export interface ConvertOptions {
	/** A manual exchange rate to use if the API call fails. */
	fallbackRate?: number;
	/**  If true, bypasses the cache and fetches fresh rate. */
	forceRefresh?: boolean;
}

/** Type Interface for API Response from `api.frankfurter.app` */
export interface FrankFurter {
	amount: number;
	base: CurrencyCode;
	date: string;
	rates: Record<CurrencyCode, number>;
}

/** * Options to calculate what percentage a `part` is of a `total`. */
export interface GetPercentOptions {
	/** Mode to calculate percentage from `part` and `total` */
	mode: 'get-percent';
	/** The part value (e.g., 25 out of 100) */
	part: number;
	/** The total value representing 100% */
	total: number;
}

/** * Options to calculate a value from a `percentage` of a `total`. */
export interface GetValueOptions {
	/** Mode to calculate value from `percentage` and `total` */
	mode: 'get-value';
	/** The percentage (e.g., 25%) */
	percentage: number;
	/** The total value representing 100% */
	total: number;
}

/** * Options to calculate the original total from a known `value` and `percentage`. */
export interface GetOriginalOptions {
	/** Mode to calculate original total from `value` and `percentage` */
	mode: 'get-original';
	/** The percentage the `value` represents */
	percentage: number;
	/** The known value that is a percentage of the original total */
	value: number;
}

/** * Calculates the percentage change from `oldValue` to `newValue`. */
export interface GetChangeOptions {
	/** Mode to calculate percentage change from `oldValue` to `newValue` */
	mode: 'get-change-percent';
	/** The original value before the change */
	oldValue: number;
	/** The new value after the change */
	newValue: number;
}

/** * Applies a percentage increase or decrease to a `baseValue`. */
export interface ApplyChangeOptions {
	/** Mode to apply percentage change to `baseValue` */
	mode: 'apply-percent-change';
	/** The base value to apply the percentage change to */
	baseValue: number;
	/** The percentage change to apply (positive or negative) */
	percentage: number;
}

/** * Calculates the absolute percentage difference between two values. */
export interface GetDifferenceOptions {
	/** Mode to calculate percentage difference between `value1` and `value2` */
	mode: 'get-percent-difference';
	/** The first value to compare */
	value1: number;
	/** The second value to compare */
	value2: number;
}

/** * Calculates the inverse percentage: what percent `total` is of `part`. */
export interface InversePercentageOptions {
	/** Mode to calculate inverse percentage from `part` and `total` */
	mode: 'inverse-percent';
	/** The part value to calculate inverse percentage from */
	part: number;
	/** The total value to calculate inverse percentage of */
	total: number;
}

/** * Options for calculating percentages and related values. */
export type PercentageOptions = (
	| GetPercentOptions
	| GetValueOptions
	| GetOriginalOptions
	| GetChangeOptions
	| ApplyChangeOptions
	| GetDifferenceOptions
	| InversePercentageOptions
) & {
	/** The number of decimal places to round the result to. Defaults to `3`. */
	roundTo?: number;
};

/** * Static methods from `Unit` class that accept a single number argument and return a number. */
export type UnitNumberMethods = {
	[K in keyof typeof Unit]: (typeof Unit)[K] extends (value: number) => number ? K : never;
}[keyof typeof Unit];

/** - Short forms of units */
export type UnitKey = keyof typeof UNITS;

/** - Labels for the units */
export type UnitLabel = (typeof UNITS)[UnitKey];

/** - Prefixes for SI units */
export type SIPrefix = keyof typeof PREFIX_MULTIPLIERS;

/**
 * * Roman numeral base letters (upper-case only).
 *
 * Includes:
 * - `I` → 1
 * - `V` → 5
 * - `X` → 10
 * - `L` → 50
 * - `C` → 100
 * - `D` → 500
 * - `M` → 1000
 */
export type $RomanBase = 'I' | 'V' | 'X' | 'L' | 'C' | 'D' | 'M';

/**
 * * Represents repeated Roman numeral sequences (1–5 characters long), enabling IntelliSense autocompletion for sequential Roman characters.
 *
 * - Suggests Roman base letters after each character.
 * - Supports up to 5-character combinations for performance.
 * - Does **not** validate Roman numeral correctness (e.g., `VVVV` is allowed).
 *
 * @example
 * ```ts
 * // ✅ Valid according to type (even if not a real Roman numeral)
 * const a: $RomanRepeated = 'MMXII';
 * const b: $RomanRepeated = 'VVVV';
 * ```
 *
 * @remarks
 * **Limitations:**
 * - Only supports up to **5-character** combinations (`Repeat<$RomanBase, 5>`) using {@link Repeat}.
 * - Increasing beyond 5 leads to TypeScript recursion/union complexity issues.
 * - Designed purely for **editor IntelliSense**, not runtime validation.
 */

export type $RomanNumeralCap =
	| $RomanBase
	| Repeat<$RomanBase, 2>
	| Repeat<$RomanBase, 3>
	| Repeat<$RomanBase, 4>
	| Repeat<$RomanBase, 5>;

/** * Represents repeated Roman numeral sequences (1–5 characters long) in uppercase letters and any string */
export type RomanNumeralCap = Uppercase<LooseLiteral<$RomanNumeralCap>>;

/**
 * * Comprehensive Roman numeral string type.
 *
 * Includes both upper and lowercase Roman letters, with support for loose
 * literal fallbacks (via {@link LooseLiteral}) to accept arbitrary strings
 * while still providing IntelliSense suggestions for known Roman combinations.
 *
 * @example
 * ```ts
 * const a: RomanNumeral = 'xiv';   // ✅ IntelliSense suggests Roman letters
 * const b: RomanNumeral = 'MMX';   // ✅ Supported
 * const c: RomanNumeral = 'xyz';   // ⚠️ Allowed only via LooseLiteral fallback
 * ```
 *
 * @remarks
 * - Combines {@link $RomanNumeralCap} and its lowercase variants.
 * - The {@link LooseLiteral} wrapper allows non-literal strings (e.g., variables) without losing IntelliSense for literals.
 * - Does not enforce valid Roman numeral formation.
 */
export type RomanNumeral = LooseLiteral<$RomanNumeralCap | Lowercase<$RomanNumeralCap>>;
