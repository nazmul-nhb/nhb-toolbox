import type { AdvancedTypes, NormalPrimitive } from '../types/index';

/** - Generic object with `unknown` value */
export type StrictObject = Record<string, unknown>;

/** - Generic object but with `any` value */
export type GenericObject = Record<string, any>;

/** - A tuple of generic objects */
export type Objects = readonly [GenericObject, ...GenericObject[]];

/**
 * - Prettify all object properties into a readable form.
 *
 * @note It is recommended to use it only with `MergeAll<T>`, `FlattenValue<T>` and/or `FlattenLeafValue<T>`. For other other cases use {@link https://toolbox.nazmul-nhb.dev/docs/types/utility-types#prettifyt Prettify<T>}
 */
export type Expand<T> =
	T extends AdvancedTypes ? T
	: T extends GenericObject ? { [K in keyof T]: Expand<T[K]> }
	: T;

/** - Converts a union type to an intersection type. */
type UnionToIntersection<U> =
	(U extends unknown ? (arg: U) => void : never) extends (
		(arg: infer I) => void
	) ?
		I
	:	never;

/** - Merges all properties of the input objects into a single object type. */
export type MergeAll<T extends readonly GenericObject[]> = {
	[K in keyof UnionToIntersection<T[number]>]: UnionToIntersection<
		T[number]
	>[K];
};

/** - Dot-notation keys for flattened nested objects with `any` value (including optional properties) */
export type FlattenKey<T> =
	T extends AdvancedTypes ? never
	: T extends GenericObject ?
		{
			[K in keyof T & string]: T[K] extends Function ? never
			: T[K] extends AdvancedTypes ? K
			: T[K] extends GenericObject ? `${K}.${FlattenKey<T[K]>}`
			: `${K}`;
		}[keyof T & string]
	:	never;

/** - Gets the value at a dot-notation key path */
export type DotValue<T, K extends string> =
	K extends `${infer P}.${infer Rest}` ?
		P extends keyof T ?
			DotValue<T[P], Rest>
		:	never
	: K extends keyof T ? T[K]
	: never;

/** - Flattens the values of a nested object into a single level against the dot-notation key */
export type FlattenValue<T> = {
	[K in FlattenKey<T>]: DotValue<T, K>;
};

/** - Extracts only leaf-level key names (excluding objects/functions) */
export type FlattenLeafKey<T> =
	T extends AdvancedTypes ? never
	: T extends GenericObject ?
		{
			[K in keyof T & string]: T[K] extends Function ? never
			: T[K] extends AdvancedTypes ? K
			: T[K] extends GenericObject ? FlattenLeafKey<T[K]>
			: K;
		}[keyof T & string]
	:	never;

/** - Gets value for a flat leaf key (assumes no there are duplicates! Duplicates are merged into one), */
export type LeafValue<T, K extends string> =
	K extends keyof T ? T[K]
	: T extends GenericObject ?
		{
			[P in keyof T & string]: T[P] extends GenericObject ?
				LeafValue<T[P], K>
			:	never;
		}[keyof T & string]
	:	never;

/** - Final flattened object with only leaf keys */
export type FlattenLeafValue<T> = {
	[K in FlattenLeafKey<T>]: LeafValue<T, K>;
};

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
			[K in keyof T & string]: T[K] extends Function ? never
			: T[K] extends StrictObject ?
				`${K}` | `${K}.${DotNotationKey<T[K]>}`
			:	`${K}`;
		}[keyof T & string]
	:	never;

/** - Dot-notation keys for nested objects with `any` value (including optional properties) */
export type DotNotationKey<T> =
	T extends AdvancedTypes ? never
	: T extends GenericObject ?
		{
			[K in keyof T & string]: T[K] extends Function ? never
			: T[K] extends GenericObject ?
				`${K}` | `${K}.${DotNotationKey<T[K]>}`
			:	`${K}`;
		}[keyof T & string]
	:	never;

/** - Object keys where the value is an array (including optional properties) */
export type KeyForArray<T> =
	T extends GenericObject ?
		{
			[K in keyof T & string]: T[K] extends Function ? never
			: T[K] extends Array<unknown> ? K
			: never;
		}[keyof T & string]
	:	never;

/** - Object keys where the value is a non-array/non-advanced type object (including optional properties) */
export type KeyForObject<T> =
	T extends AdvancedTypes ? never
	: T extends GenericObject ?
		{
			[K in keyof T & string]: T[K] extends Function ? never
			: T[K] extends GenericObject ?
				T[K] extends AdvancedTypes ?
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
			[K in keyof T & string]: T[K] extends Function ? never
			: T[K] extends string ? K
			: T[K] extends GenericObject ? `${K}.${NestedKeyString<T[K]>}`
			: never;
		}[keyof T & string]
	:	never;

/** - Extract only primitive keys from an object, including nested dot-notation keys. */
export type NestedPrimitiveKey<T> =
	T extends AdvancedTypes ? never
	: T extends GenericObject ?
		{
			[K in keyof T & string]: T[K] extends Function ? never
			: T[K] extends NormalPrimitive ? K
			: T[K] extends GenericObject ? `${K}.${NestedPrimitiveKey<T[K]>}`
			: never;
		}[keyof T & string]
	:	never;

/** Extract only number, string, undefined and null keys from an object, including nested dot-notation keys.  */
export type NumericDotKey<T> =
	T extends AdvancedTypes ? never
	: T extends GenericObject ?
		{
			[K in keyof T & string]: T[K] extends Function ? never
			: T[K] extends Exclude<NormalPrimitive, boolean> ? K
			: T[K] extends GenericObject ? `${K}.${NumericDotKey<T[K]>}`
			: never;
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
