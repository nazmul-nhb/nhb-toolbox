import type { Color } from '../colors/Color';
import type { Chronos } from '../date/Chronos';

/** Uncontrolled any to use for edge cases */
export type Any = any;

declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };

/** Create a branded type. */
export type Branded<T, B> = T & Brand<B>;

/** Utility type to flatten Partial type */
export type FlattenPartial<T> = Partial<{ [K in keyof T]: T[K] }>;

/** Union of `number` and numeric string */
export type Numeric = number | `${number}`;

/** Union of All Primitive Types (i.e. `string | number | boolean | symbol | bigint | null | undefined`) */
export type Primitive =
	| string
	| number
	| boolean
	| symbol
	| bigint
	| null
	| undefined;

/** Union of Normal Primitive Types (i.e. `string | number | boolean | null | undefined`) */
export type NormalPrimitive = string | number | boolean | null | undefined;

/** Extract normal primitive key(s) (i.e. `string | number | boolean | null | undefined`) from an object */
export type NormalPrimitiveKey<T> = {
	[K in keyof T]: T[K] extends NormalPrimitive ? K : never;
}[keyof T];

/**
 * * Keys of an object that are part of the object type itself.
 * This excludes keys that are inherited from the prototype chain.
 * This type is useful for extracting keys that are part of the object's own properties.
 * It is used in the `OwnKeys` type to filter out keys that are not part of the object properties.
 */
export type OwnKeys<T> = {
	[K in keyof T]: {} extends Pick<T, K> ? never : K;
}[keyof T];

/** Extract primitive (string, number or boolean) key(s) from an object */
export type NonNullishPrimitiveKey<T> = {
	[K in keyof T]: T[K] extends string | number | boolean ? K : never;
}[keyof T];

/** Falsy primitive type  */
export type FalsyPrimitive = false | 0 | '' | null | undefined;

/** A generic class constructor */
export type Constructor = new (...args: any[]) => unknown;

/** Generic function type */
export type GenericFn = (...args: unknown[]) => unknown;

/** Generic function type that returns `void` */
export type VoidFunction = (...args: any[]) => void;

/** Debounced function type after certain delay */
export type DelayedFn<T extends VoidFunction> = (
	...args: Parameters<T>
) => void;

/** Throttled function type after specific delay */
export type ThrottledFn<T extends VoidFunction> = (
	...args: Parameters<T>
) => void;

/** Asynchronous function type */
export type AsyncFunction<T> = (...args: unknown[]) => Promise<T>;

/**
 * Represents an object that has at least one method property,
 * but other keys can be anything.
 */
export type ObjectWithMethods =
	{
		[key: string]: unknown;
	} & { [key: string]: (...args: any[]) => unknown } extends infer O ?
		{ [K in keyof O]: O[K] }
	:	never;

/** Advanced non-primitive types */
export type AdvancedTypes =
	| Array<unknown>
	| File
	| FileList
	| Chronos
	| Color
	| Blob
	| Date
	| RegExp
	| WeakMap<WeakKey, unknown>
	| WeakSet<WeakKey>
	| Map<unknown, unknown>
	| Set<unknown>
	| Function
	| GenericFn
	| VoidFunction
	| AsyncFunction<unknown>
	| Promise<unknown>
	| Error
	| EvalError
	| RangeError
	| ReferenceError
	| SyntaxError
	| TypeError
	| URIError
	| bigint
	| symbol;

/** Helper to detect if a type has methods */
export type HasMethods<T> =
	{
		[K in keyof T]: T[K] extends Function ? true : never;
	}[keyof T] extends never ?
		false
	:	true;

/** * Represents detailed information about a class's methods. */
export interface ClassDetails {
	/** * List of instance method names defined directly on the class prototype. */
	instanceNames: string[];

	/** * List of static method names defined directly on the class constructor. */
	staticNames: string[];

	/** * Number of instance methods. */
	instances: number;

	/** * Number of static methods. */
	statics: number;

	/** * Total number of instance and static methods combined. */
	total: number;
}

/** Literal type for `partial` and `required` */
export type PartialOrRequired = 'partial' | 'required';
