import type { AdvancedTypes, NormalPrimitive } from '../types/index';

/** - Generic object with `unknown` value */
export type StrictObject = Record<string, unknown>;

/** - Generic object but with `any` value */
export type GenericObject = Record<string, any>;

/**
 * * Represents a value that can be used in a query object.
 * - Can be a primitive, an array of primitives, or a nested query object.
 */
export type QueryObjectValue =
	| NormalPrimitive
	| NormalPrimitive[]
	| QueryObject;

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
			[K in keyof T & string]: NonNullable<T[K]> extends NormalPrimitive ?
				K
			: NonNullable<T[K]> extends GenericObject ?
				`${K}.${NestedPrimitiveKey<NonNullable<T[K]>>}`
			:	never;
		}[keyof T & string]
	:	never;

/** - Options for `sanitizeData` utility. */
export interface SanitizeOptions<T> {
	/**
	 * An array of dot-notation keys to exclude from the sanitized output.
	 * This is only applicable when sanitizing plain objects or arrays of objects.
	 * When applied to nested or irregular array structures, behavior may be inconsistent or partially ignored.
	 */
	keysToIgnore?: DotNotationKey<T>[];

	/** Whether to trim string values. Defaults to `true`. */
	trimStrings?: boolean;

	/** Whether to exclude nullish (`null` or `undefined`) values. Defaults to `false`. */
	ignoreNullish?: boolean;

	/** Whether to exclude all falsy values (`false`, `0`, `empty string: ''`, `null`, `undefined`. Defaults to `false`. */
	ignoreFalsy?: boolean;

	/** Whether to exclude empty object(s) and array(s) (`{}`, `[]`). Defaults to `false`. */
	ignoreEmpty?: boolean;

	/**
	 * An array of dot-notation key paths that must be preserved in the sanitized output.
	 * Use `"*"` to retain all keys. This applies primarily to plain or nested objects and arrays of objects.
	 * When applied to nested or irregular array structures, behavior may be inconsistent or partially ignored.
	 */
	requiredKeys?: '*' | DotNotationKey<T>[];
}

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
