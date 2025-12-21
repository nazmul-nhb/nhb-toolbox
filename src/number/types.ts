import type { Maybe } from '../types/index';
import type { LooseLiteral } from '../utils/types';
import type {
	CURRENCY_CODES,
	CURRENCY_LOCALES,
	FRANKFURTER_CURRENCIES,
	LOCALE_CODES,
	PREFIX_MULTIPLIERS,
	UNITS,
} from './constants';
import type { Unit } from './Unit';
import type { BN_DIGITS } from './constants';

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
export interface DecimalOptions<T extends Maybe<boolean> = false> {
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
export type FrankFurterCurrency = (typeof FRANKFURTER_CURRENCIES)[number];

export type { FrankFurterCurrency as SupportedCurrency };

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
	base: FrankFurterCurrency;
	date: string;
	rates: Record<FrankFurterCurrency, number>;
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

/** Roman numerals representing only the thousand (1000, 2000 and 3000) */
type $Thousands = '' | 'M' | 'MM' | 'MMM';
/** Roman numerals representing only the hundreds (100, 200, ... 900) */
type $Hundreds = '' | 'C' | 'CC' | 'CCC' | 'CD' | 'D' | 'DC' | 'DCC' | 'DCCC' | 'CM';
/** Roman numerals representing only the tens (10, 20, ... 90) */
type $Tens = '' | 'X' | 'XX' | 'XXX' | 'XL' | 'L' | 'LX' | 'LXX' | 'LXXX' | 'XC';
/** Roman numerals representing only the ones (1-9) */
type $Ones = '' | 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'VIII' | 'IX';
/** Roman numerals representing the combination of thousands, hundreds, tens and ones */
type $RawRoman = `${$Thousands}${$Hundreds}${$Tens}${$Ones}`;

/**
 * * Literal type representing every valid Roman numeral (uppercase) from 1 to 3999 (I .. MMMCMXCIX).
 *
 * @example
 *   const a: RomanCapital = "MMXXV"; // ✅ OK
 *   const b: RomanCapital = "MMMM";  // 🛑 Error (4000 not allowed)
 *   const c: RomanCapital = "";      // 🛑 Error (0 not allowed)
 */
export type RomanCapital = Exclude<$RawRoman, ''>;

/**
 * * Strict Roman numeral in both literal lower and uppercase (1-3999).
 *
 * @example
 * 	const a: RomanNumeral = 'xiv';   // ✅ Lowercase: OK
 * 	const b: RomanNumeral = 'MMX';   // ✅ Uppercase: OK
 * 	const c: RomanNumeral = 'xyz';   // 🛑 Invalid: Error (xyz not allowed)
 */
export type RomanNumeral = RomanCapital | Lowercase<RomanCapital>;

/**
 * * Comprehensive valid Roman numeral in both literal lower and uppercase (1-3999) & any string type.
 *
 * @example
 * const a: LooseRomanNumeral = 'xiv';   // ✅ IntelliSense suggests Roman letters
 * const b: LooseRomanNumeral = 'MMX';   // ✅ Supported
 * const c: LooseRomanNumeral = 'xyz';   // ⚠️ Allowed only via LooseLiteral fallback
 *
 * @remarks
 * - Combines {@link RomanCapital} and its lowercase variants, see {@link RomanNumeral}.
 * - The {@link LooseLiteral} wrapper allows non-literal strings (e.g., variables) without losing IntelliSense for literals.
 */
export type LooseRomanNumeral = LooseLiteral<RomanNumeral>;

/** Bangla digits from `০-৯` */
export type BanglaDigit = keyof typeof BN_DIGITS;

/** Bangla digits from `১-৯` */
export type $BnExcludeZero = Exclude<BanglaDigit, '০'>;

/** Result type for Bangla digit conversion based on `force` flag */
export type BnDigitResult<Force extends boolean> =
	Force extends true ? number : number | string;
