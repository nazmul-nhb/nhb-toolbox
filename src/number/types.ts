import type {
	CURRENCY_CODES,
	CURRENCY_LOCALES,
	LOCALE_CODES,
} from './constants';

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

/** - Output format for the generated numbers */
export type GetAs = 'array' | 'string';

/** - Options for generating numbers in a range */
export interface RangeOptions<T extends GetAs> extends RandomNumberOptions {
	/** Separator for the string format if `getAs` is `'string'`. Defaults to `,`. */
	separator?: string;
	/** The multiples of which number to consider in the result. */
	multiplesOf?: number;
	/** The format for the result - either `'array'` or `'string'`. Default is `array` */
	getAs?: T;
}

/** - The return type of the `getNumbersInRange` function */
export type RangedNumbers<T extends GetAs> =
	T extends 'array' ? number[] : string;

/** List of ISO 4217 currency codes. */
export type CurrencyCode =
	| keyof typeof CURRENCY_LOCALES
	| (typeof CURRENCY_CODES)[number];

/** - List of all supported BCP 47 locales */
export type LocaleCode =
	| (typeof CURRENCY_LOCALES)[keyof typeof CURRENCY_LOCALES]
	| (typeof LOCALE_CODES)[number];
