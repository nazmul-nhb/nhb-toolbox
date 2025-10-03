import type { AdvancedTypes, NormalPrimitive, ValidArray } from '../types/index';
import type { Prettify, Split } from '../utils/types';

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
	(U extends unknown ? (arg: U) => void : never) extends (arg: infer I) => void ? I : never;

/** - Merges all properties of the input objects into a single object type. */
export type MergeAll<T extends readonly GenericObject[]> = {
	[K in keyof UnionToIntersection<T[number]>]: UnionToIntersection<T[number]>[K];
};

/** - Dot-notation keys for flattened nested objects with `any` value (including optional properties) */
export type FlattenDotKey<T> =
	T extends AdvancedTypes ? never
	: T extends GenericObject ?
		{
			[K in keyof T & string]: NonNullable<T[K]> extends Function ? never
			: NonNullable<T[K]> extends AdvancedTypes ? K
			: NonNullable<T[K]> extends GenericObject ?
				`${K}.${FlattenDotKey<NonNullable<T[K]>>}`
			:	`${K}`;
		}[keyof T & string]
	:	never;

/** - Gets the value at a dot-notation key path */
export type DotValue<T, K extends string> =
	K extends `${infer P}.${infer Rest}` ?
		P extends keyof T ?
			undefined extends T[P] ?
				DotValue<NonNullable<T[P]>, Rest> | undefined
			:	DotValue<T[P], Rest>
		:	never
	: K extends keyof T ? T[K]
	: never;

/** - Flattens the values of a nested object into a single level against the dot-notation key */
export type FlattenDotValue<T> = {
	[K in FlattenDotKey<T>]?: DotValue<T, K>;
};

/** - Extracts only leaf-level key names (excluding objects/functions) */
export type FlattenLeafKey<T> =
	T extends AdvancedTypes ? never
	: T extends GenericObject ?
		{
			[K in keyof T & string]: NonNullable<T[K]> extends Function ? never
			: NonNullable<T[K]> extends AdvancedTypes ? K
			: NonNullable<T[K]> extends GenericObject ? FlattenLeafKey<T[K]>
			: K;
		}[keyof T & string]
	:	never;

/** - Gets value for a flat leaf key (assumes there are no duplicates! Duplicates are merged into one), */
export type LeafValue<T, K extends string> =
	K extends keyof T ? T[K]
	: T extends GenericObject ?
		{
			[P in keyof T & string]: NonNullable<T[P]> extends GenericObject ?
				LeafValue<NonNullable<T[P]>, K>
			:	never;
		}[keyof T & string]
	:	never;

/** - Final flattened object with only leaf keys */
export type FlattenLeafValue<T> = {
	[K in FlattenLeafKey<T>]?: LeafValue<T, K>;
};

/**
 * * Represents a value that can be used in a query object.
 * - Can be a primitive, an array of primitives, or a nested query object.
 */
export type QueryObjectValue = NormalPrimitive | NormalPrimitive[] | QueryObject;

/**
 * * Represents a query object with string keys and `QueryObjectValue` values.
 * - Supports nested objects and arrays.
 */
export type QueryObject = { [key: string]: QueryObjectValue };

/** Generic query object type */
export type ParsedQueryGeneric = Record<string, NormalPrimitive | NormalPrimitive[]>;

type QueryPairs<Q extends string> = Split<Q extends `?${infer Rest}` ? Rest : Q, '&'>;

type ValuesOfKey<Pairs extends string[], K extends string> =
	Pairs extends [infer Head extends string, ...infer Tail extends string[]] ?
		Head extends `${K}=${infer V}` ?
			[V, ...ValuesOfKey<Tail, K>]
		:	ValuesOfKey<Tail, K>
	:	[];

/** Query object parsed from a literal string */
export type ParsedQuery<Q extends string> = Prettify<{
	[K in QueryPairs<Q>[number] extends `${infer Key}=${string}` ? Key : never]: ValuesOfKey<
		QueryPairs<Q>,
		K
	> extends [infer Only] ?
		Only
	:	ValuesOfKey<QueryPairs<Q>, K>;
}>;

/** - Object type with string or number or boolean as value for each key. */
export type GenericObjectPrimitive = Record<string, string | number | boolean>;

/** - Dot-notation keys for nested objects with unknown value (including optional properties) */
export type DotNotationKeyStrict<T> =
	T extends AdvancedTypes ? never
	: T extends StrictObject ?
		{
			[K in keyof T & string]: T[K] extends Function ? never
			: T[K] extends StrictObject ? `${K}` | `${K}.${DotNotationKey<T[K]>}`
			: `${K}`;
		}[keyof T & string]
	:	never;

/** - Dot-notation keys for nested objects with `any` value (including optional properties) */
export type DotNotationKey<T> =
	T extends AdvancedTypes ? never
	: T extends GenericObject ?
		{
			[K in keyof T & string]: T[K] extends Function ? never
			: T[K] extends GenericObject ? `${K}` | `${K}.${DotNotationKey<T[K]>}`
			: `${K}`;
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

/** Options for `convertObjectValues` utility */
export interface ConvertObjectOptions<
	T extends GenericObject,
	Key extends NumericDotKey<T>,
	C extends 'string' | 'number',
> {
	/** Array of keys (properties) to convert to `number` or `string` */
	keys: ValidArray<Key>;
	/** Convert selected keys to target type: `number` or `string` */
	convertTo: C;
}

/** Transform a single property */
type ConvertProp<V, C extends 'string' | 'number'> =
	C extends 'string' ?
		V extends string | number ?
			string
		:	V
	: C extends 'number' ?
		V extends string ?
			number
		:	V
	:	V;

/** Extract sub-keys after prefix like `"props."` */
type SubKey<S extends string, P extends string> = S extends `${P}.${infer Rest}` ? Rest : never;

/** Transformed shape of the return type of `convertObjectValues` */
export type ConvertedObject<T, Keys extends string, C extends 'string' | 'number'> = Prettify<{
	[K in Extract<keyof T, string>]: K extends Keys ? ConvertProp<T[K], C>
	: T[K] extends AdvancedTypes ? T[K]
	: T[K] extends GenericObject ? ConvertedObject<T[K], SubKey<Keys, K>, C>
	: T[K];
}>;
