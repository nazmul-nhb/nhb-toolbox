import type {
	CURRENCY_CODES,
	CURRENCY_LOCALES,
	LOCALE_CODES,
	PREFIX_MULTIPLIERS,
	SUPPORTED_CURRENCIES,
	UNITS,
} from './constants';
import type { Unit } from './Unit';

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
export type NumberType =
	| 'any'
	| 'natural'
	| 'odd'
	| 'even'
	| 'prime'
	| 'random';

/** - Options for generating numbers in a range */
export interface RangeOptions<T extends boolean = false>
	extends RandomNumberOptions {
	/** Separator for the string format if `getAsString` is `'true'`. Defaults to `, `. */
	separator?: T extends true ? string : never;
	/** The multiples of which number to consider in the result. */
	multiplesOf?: number;
	/** The format for the result - `{ getAsString: true }` returns strings with custom separator and `false` returns array of numbers. Default is `false`. */
	getAsString?: T;
}

/** - The return type of the `getNumbersInRange` function */
export type RangedNumbers<T extends boolean = false> =
	T extends true ? string : number[];

/** List of ISO 4217 currency codes. */
export type CurrencyCode =
	| keyof typeof CURRENCY_LOCALES
	| (typeof CURRENCY_CODES)[number];

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
export type PercentageOptions =
	| GetPercentOptions
	| GetValueOptions
	| GetOriginalOptions
	| GetChangeOptions
	| ApplyChangeOptions
	| GetDifferenceOptions
	| InversePercentageOptions;

/** * Static methods from `Unit` class that accept a single number argument and return a number. */
export type UnitNumberMethods = {
	[K in keyof typeof Unit]: (typeof Unit)[K] extends (
		(value: number) => number
	) ?
		K
	:	never;
}[keyof typeof Unit];

/** - Short forms of units */
export type UnitKey = keyof typeof UNITS;

/** - Labels for the units */
export type UnitLabel = (typeof UNITS)[UnitKey];

/** - Prefixes for SI units */
export type SIPrefix = keyof typeof PREFIX_MULTIPLIERS;
