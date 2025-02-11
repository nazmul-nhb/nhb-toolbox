/** - Generic object with `unknown` value */
export type GenericObject = Record<string, unknown>;

/** - Generic object but with `any` value */
export type LooseObject = Record<string, any>;

/** - Query object type `Record<string, string | number | string[] | number[]` */
export type QueryObject = Record<
	string,
	string | number | null | undefined | (string | number | null | undefined)[]
>;

/** - Dot-notation keys for nested objects */
export type DotNotationKey<T> =
	T extends GenericObject ?
		{
			[K in keyof T & string]: T[K] extends GenericObject ?
				`${K}` | `${K}.${DotNotationKey<T[K]>}`
			:	`${K}`;
		}[keyof T & string]
	:	never;

/** - Options for `sanitizeData` */
export interface SanitizeOptions<T extends GenericObject> {
	/** Keys to ignore */
	keysToIgnore?: DotNotationKey<T>[];
	/** Whether to trim string values. Defaults to `true` */
	trimStrings?: boolean;
	/** Whether to exclude nullish (null or undefined) values. Defaults to `false` */
	ignoreNullish?: boolean;
}

/** - Data after sanitization. */
export type SanitizedData<T> = {
	[P in keyof T]?: T[P] extends GenericObject ? SanitizedData<T[P]> : T[P];
};

/**
 * - Dot-notation keys for nested objects.
 * ! Unused
 */
export type KeyConversion<T> =
	T extends GenericObject ?
		{
			[K in keyof T & string]: K extends string ?
				T[K] extends GenericObject ?
					`${K}` | `${K}.${KeyConversion<T[K]>}`
				:	`${K}`
			:	never;
		}[keyof T & string]
	:	never;

/**
 * ! Unused
 * * Determines the return type of `convertObjectValues` based on the `ConvertTo` type.
 * @template T The object type.
 * @template C The conversion type, either "string" or "number".
 */
export type ConvertedData<T, C extends 'string' | 'number'> =
	C extends 'string' ? Stringified<T> | Stringified<T>[] : T | T[];

/** - Type of data value converted to `string` */
export type Stringified<T> = {
	[K in keyof T]: T[K] extends (infer U)[] ? Stringified<U>[]
	: T[K] extends object | null | undefined ? Stringified<T[K]>
	: T[K] extends string | number ? string
	: T[K];
};

/** - Type of data value converted to `number` */
export type Numberified<T> = {
	[K in keyof T]: T[K] extends (infer U)[] ? Numberified<U>[]
	: T[K] extends object | null | undefined ? Numberified<T[K]>
	: T[K] extends string ? number
	: T[K] extends number ? T[K]
	: number;
};
