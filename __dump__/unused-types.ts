/** - Data after sanitization.
 * ! Unused
 */
// export type SanitizedData<T> = {
// 	[P in keyof T]?: T[P] extends GenericObject ? SanitizedData<T[P]> : T[P];
// };

/**
 * - Dot-notation keys for nested objects.
 * ! Unused
 */
// export type KeyConversion<T> =
// 	T extends StrictObject ?
// 		{
// 			[K in keyof T & string]: K extends string ?
// 				T[K] extends StrictObject ?
// 					`${K}` | `${K}.${KeyConversion<T[K]>}`
// 				:	`${K}`
// 			:	never;
// 		}[keyof T & string]
// 	:	never;

/**
 * ! Unused
 * * Determines the return type of `convertObjectValues` based on the `ConvertTo` type.
 */
// export type ConvertedData<T, C extends 'string' | 'number'> =
// 	C extends 'string' ? Stringified<T> | Stringified<T>[] : T | T[];

/** * Utility type to exclude ignored keys and make remaining properties Partial */
// export type SanitizedData<T, IgnoredKeys extends string> = {
// 	[K in keyof T as K extends IgnoredKeys ? never : K]?: T[K];
// };

// type ExtractNestedKeys<Keys extends string, CurrentKey extends string> =
// 	Keys extends `${CurrentKey}.${infer Rest}` ? Rest : never;

// type SanitizedData<
// 	T,
// 	IgnoredKeys extends string,
// 	RequiredKeys extends string,
// > = {
// 	[K in keyof T as K extends IgnoredKeys ? never : K]: T[K] extends (
// 		GenericObject
// 	) ?
// 		SanitizedData<
// 			T[K],
// 			ExtractNestedKeys<IgnoredKeys, K & string>,
// 			ExtractNestedKeys<RequiredKeys, K & string>
// 		>
// 	: K extends RequiredKeys ? Required<T>[K]
// 	: T[K];
// };

// Handle the '*' case for requiredKeys
// export type ProcessRequiredKeys<T, R extends '*' | DotNotationKey<T>> =
// 	R extends '*' ? { [K in keyof T]-?: T[K] }
// 	: R extends DotNotationKey<T> ? SanitizedData<T, DotNotationKey<T>, R>
// 	: never;

// export type SanitizedResult<
// 	T,
// 	Ignored extends string,
// 	Required extends string,
// > = {
// 	[K in keyof T as K extends Ignored ? never : K]: K extends Required ?
// 		T[K] extends object ?
// 			SanitizedResult<T[K], never, never>
// 		:	T[K]
// 	: T[K] extends object ? SanitizedResult<T[K], never, never>
// 	: T[K];
// };

// export type Simplify<T> = T extends any ? { [K in keyof T]: T[K] } : never;

// export type FilterIgnoredKeys<T, Ignored extends string> = {
// 	[K in keyof T as K extends Ignored ? never : K]: T[K];
// };

/** - Capitalizes the first letter of each word. */
// type CapitalizeWords<T extends string, LowerCaseRest extends boolean> =
// 	T extends `${infer First} ${infer Rest}` ?
// 		`${Capitalize<First>} ${CapitalizeWords<Rest, LowerCaseRest>}`
// 	:	Capitalize<T>;

/** - Determines the correct return type based on the provided options. */
// ! Unused
// export type CapitalizeResult<T extends string, O extends CapitalizeOptions> =
// 	O['capitalizeAll'] extends true ? Uppercase<T>
// 	: O['capitalizeEachFirst'] extends true ?
// 		CapitalizeWords<
// 			O['lowerCaseRest'] extends false ? T : Lowercase<T>,
// 			O['lowerCaseRest'] extends boolean ? O['lowerCaseRest'] : true
// 		>
// 	: O['lowerCaseRest'] extends false ? Capitalize<T>
// 	: Capitalize<Lowercase<T>>;

/** Utility type to extract only method names from a class.
 * ! Unused
 */
// export type ClassMethodNames<T> = {
// 	[K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
// }[keyof T];

/**
 * Extracts instance method names from a class constructor.
 * ! Unused
 */
// export type InstanceMethodNames<T extends abstract new (...args: any) => any> =
// 	{
// 		[K in keyof InstanceType<T>]: InstanceType<T>[K] extends (
// 			(...args: unknown[]) => unknown
// 		) ?
// 			K
// 		:	never;
// 	}[keyof InstanceType<T>];

/**
 * Extracts static method names from a class constructor.
 * ! Unused
 */
// export type StaticMethodNames<T extends abstract new (...args: any) => any> = {
// 	[K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
// }[keyof T];

/**
 * Extracts all method names (instance + static) from a class constructor.
 * ! Unused
 */
// export type MethodNames<T extends abstract new (...args: any) => any> =
// 	| InstanceMethodNames<T>
// 	| StaticMethodNames<T>;

/**
 * Maps all instance method names to their method types from the class prototype.
 * ! Unused
 */
// export type MethodMap<T extends abstract new (...args: any) => any> = {
// 	[K in InstanceMethodNames<T>]: InstanceType<T>[K];
// };

/** Utility type to flatten Partial type */
// export type FlattenPartial<T> = T extends Partial<infer U> ? Partial<U> : Partial<T> & {};

/** - Type for mapped object fields to be created from another object interface/type */
// export type MappedFields<
// 	Source,
// 	Target extends Record<string, keyof Source>,
// > = {
// 	[Key in keyof Target]: Source[Target[Key]];
// };

/** * Infers the real primitive type from a stringified version. */
// export type ParsedPrimitive<T> =
// 	T extends string ?
// 		T extends `${number}` ? number
// 		: T extends 'true' | 'false' ? boolean
// 		: T extends 'null' ? null
// 		: T extends 'undefined' ? undefined
// 		: T
// 	:	T;

// type ParsePrimitive<T extends string> =
// 	T extends 'true' ? true
// 	: T extends 'false' ? false
// 	: T extends 'null' ? null
// 	: T extends 'undefined' ? undefined
// 	: T extends `${number}` ? number
// 	: T;

// export type ParseJSON<T extends string> =
// 	T extends `[${infer Items}]` ? ParseArray<Items>
// 	: T extends `{${infer Props}}` ? ParseObject<Props>
// 	: ParsePrimitive<T>;

// type ParseArray<T extends string> =
// 	T extends `${infer First},${infer Rest}` ?
// 		[ParseJSON<First>, ...ParseArray<Rest>]
// 	: T extends '' ? []
// 	: [ParseJSON<T>];

// type ParseObject<T extends string> =
// 	T extends `${infer Key}":${infer Value},${infer Rest}` ?
// 		ParseObjectProperty<Key, Value> & ParseObject<Rest>
// 	: T extends `${infer Key}":${infer Value}}` ?
// 		ParseObjectProperty<Key, Value>
// 	:	{};

// type ParseObjectProperty<K extends string, V extends string> = {
// 	[P in K extends `"${infer Key}"` ? Key : never]: ParseJSON<V>;
// };

/** - Output format for the generated numbers */
// export type GetAs = 'array' | 'string';

// export type ParsedObject<T extends GenericObject> = { [K in keyof T]: Any };

// /** Type for first field key */
// export type FirstFieldKey<
//     T extends GenericObject,
//     K1 extends string = 'value',
//     K2 extends string = 'label',
//     V extends boolean = false,
// > = T[OptionsConfig<T, K1, K2, V>['firstFieldKey']];

// /** TYpe for first field value */
// export type FirstFieldValue<
//     T extends GenericObject,
//     K1 extends string = 'value',
//     K2 extends string = 'label',
//     V extends boolean = false,
// > = V extends true ? FirstFieldKey<T, K1, K2, V> : string;

// /** Type of an option in `OptionsArray` */
// export type Option<
//     T extends GenericObject,
//     K1 extends string = 'value',
//     K2 extends string = 'label',
//     V extends boolean = false,
// > = { [P in K1 | K2]: P extends K1 ? FirstFieldValue<T, K1, K2, V> : string };


// // * Helper: Add 1 to a number
// type AddOne<N extends number, Acc extends unknown[] = []> =
//     Acc['length'] extends N ? [...Acc, unknown]['length']
//     :	AddOne<N, [...Acc, unknown]>;

// // * Enumerate & Enumerate Internal: builds a union of all numbers from 0 to N - 1
// type EnumerateInternal<N extends number, Acc extends number[] = []> =
//     Acc['length'] extends N ? Acc[number]
//     :	EnumerateInternal<N, [...Acc, Acc['length']]>;

// type Enumerate<N extends number> = EnumerateInternal<N>;

// /** Utility type to create literal type with numbers (from `0-998` for TypeScript limitation) */
// export type NumberRange<From extends number, To extends number> = Exclude<
//     Enumerate<To>,
//     Enumerate<From>
// >;


type B = "a" | "b" | "c" | ( string & {})

const b: B = ""