import type { AdvancedTypes, Primitive } from '../types';

/** - Generic object with `unknown` value */
export type StrictObject = Record<string, unknown>;

/** - Generic object but with `any` value */
export type GenericObject = Record<string, any>;

/**
 * * Represents a value that can be used in a query object.
 * - Can be a primitive, an array of primitives, or a nested query object.
 */
export type QueryObjectValue = Primitive | Primitive[] | QueryObject;

/**
 * * Represents a query object with string keys and `QueryObjectValue` values.
 * - Supports nested objects and arrays.
 */
export type QueryObject = { [key: string]: QueryObjectValue };

/** - Object type with string or number or boolean as value for each key. */
export type GenericObjectPrimitive = Record<string, string | number | boolean>;

/** - Dot-notation keys for nested objects with unknown value (including optional properties) */
export type DotNotationKeyStrict<T> =
	T extends AdvancedTypes ? never
	: T extends StrictObject ?
		{
			[K in keyof T & string]: NonNullable<T[K]> extends StrictObject ?
				`${K}` | `${K}.${DotNotationKey<NonNullable<T[K]>>}`
			:	`${K}`;
		}[keyof T & string]
	:	never;

/** - Dot-notation keys for nested objects with `any` value (including optional properties) */
export type DotNotationKey<T> =
	T extends AdvancedTypes ? never
	: T extends GenericObject ?
		{
			[K in keyof T & string]: NonNullable<T[K]> extends GenericObject ?
				`${K}` | `${K}.${DotNotationKey<NonNullable<T[K]>>}`
			:	`${K}`;
		}[keyof T & string]
	:	never;

/** - Object keys where the value is an array (including optional properties) */
export type KeyForArray<T> =
	T extends GenericObject ?
		{
			[K in keyof T & string]: NonNullable<T[K]> extends Array<unknown> ?
				K
			:	never;
		}[keyof T & string]
	:	never;

/** - Object keys where the value is a non-array/non-advanced type object (including optional properties) */
export type KeyForObject<T> =
	T extends AdvancedTypes ? never
	: T extends GenericObject ?
		{
			[K in keyof T & string]: NonNullable<T[K]> extends GenericObject ?
				NonNullable<T[K]> extends AdvancedTypes ?
					never
				:	K
			:	never;
		}[keyof T & string]
	:	never;

/** - Extract only keys with string values from an object, including nested dot-notation keys. */
export type NestedKeyString<T> =
	T extends AdvancedTypes ? never
	: T extends GenericObject ?
		{
			[K in keyof T & string]: NonNullable<T[K]> extends string ? K
			: NonNullable<T[K]> extends GenericObject ?
				`${K}.${NestedKeyString<NonNullable<T[K]>>}`
			:	never;
		}[keyof T & string]
	:	never;

/** - Extract only primitive keys from an object, including nested dot-notation keys. */
export type NestedPrimitiveKey<T> =
	T extends AdvancedTypes ? never
	: T extends GenericObject ?
		{
			[K in keyof T & string]: NonNullable<T[K]> extends Primitive ? K
			: NonNullable<T[K]> extends GenericObject ?
				`${K}.${NestedPrimitiveKey<NonNullable<T[K]>>}`
			:	never;
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

/** - Data after sanitization.
 * ! Unused
 */
export type SanitizedData<T> = {
	[P in keyof T]?: T[P] extends GenericObject ? SanitizedData<T[P]> : T[P];
};

/**
 * - Dot-notation keys for nested objects.
 * ! Unused
 */
export type KeyConversion<T> =
	T extends StrictObject ?
		{
			[K in keyof T & string]: K extends string ?
				T[K] extends StrictObject ?
					`${K}` | `${K}.${KeyConversion<T[K]>}`
				:	`${K}`
			:	never;
		}[keyof T & string]
	:	never;

/**
 * ! Unused
 * * Determines the return type of `convertObjectValues` based on the `ConvertTo` type.
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

/** - Type for mapped object fields to be created from another object interface/type */
export type FieldMap<Source, Target> = {
	[K in keyof Partial<Target>]: keyof Partial<Source>;
};
