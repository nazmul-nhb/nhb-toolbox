import type { Chronos } from '../date/Chronos';
import type { DateLike } from '../date/types';

/** Uncontrolled any to use for edge cases */
export type Any = any;

declare const __brand: unique symbol;
type $Brand<B> = { [__brand]: B };

/** Create a branded type */
export type Branded<T, B> = T & $Brand<B>;

/** Represents a value that may or may not be present. */
export type Maybe<T> = T | undefined;

/** Utility type to flatten Partial type */
export type FlattenPartial<T> = Partial<{ [K in keyof T]: T[K] }>;

/** Union of `number` and numeric string */
export type Numeric = number | `${number}`;

/** Union of All Primitive Types (i.e. `string | number | boolean | symbol | bigint | null | undefined`) */
export type Primitive = Maybe<string | number | boolean | symbol | bigint | null>;

/** Union of Normal Primitive Types (i.e. `string | number | boolean | null | undefined`) */
export type NormalPrimitive = Maybe<string | number | boolean | null>;

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
export type FalsyPrimitive = Maybe<false | 0 | '' | null>;

/** A generic class constructor */
export type Constructor = new (...args: any[]) => any;

/** Generic function type */
export type GenericFn = (...args: any[]) => any;

/** Generic function type that returns `void` */
export type VoidFunction = (...args: any[]) => void;

/** Debounced function type after certain delay */
export type DelayedFn<T extends VoidFunction> = (...args: Parameters<T>) => void;

/** Throttled function type after specific delay */
export type ThrottledFn<T extends VoidFunction> = (...args: Parameters<T>) => void;

/** Asynchronous function type */
export type AsyncFunction<T> = (...args: any[]) => Promise<T>;

/** Advanced types to exclude from counting as object key */
export type AdvancedTypes =
	| Array<unknown>
	| File
	| FileList
	| Chronos
	| DateLike
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
	instanceMethods: string[];

	/** * List of static method names defined directly on the class constructor. */
	staticMethods: string[];

	/** * List of instance getter names defined directly on the class prototype. */
	instanceGetters: string[];

	/** * List of static getter names defined directly on the class constructor. */
	staticGetters: string[];

	/** * Number of instance methods. */
	instanceCount: number;

	/** * Number of static methods. */
	staticCount: number;

	/** * Total number of instance and static getters combined. */
	totalGetters: number;

	/** * Total number of instance and static methods combined. */
	totalMethods: number;
}

/** Literal type for `partial` and `required` */
export type PartialOrRequired = 'partial' | 'required';

/**
 * - Utility type to assert that a given type condition evaluates to `true`.
 *
 * @remarks
 * - This type is mainly used in **type-level tests** to enforce that a condition (usually produced by {@link Equal}) is satisfied.
 * - If the condition is not `true`, TypeScript will raise an error at compile time.
 *
 * @example
 * // Passes ✅
 * type Test1 = Expect<true>;
 *
 * // Fails ❌ - will cause a type error
 * type Test2 = Expect<false>;
 */
export type Expect<T extends true> = T;

/**
 * * Utility type that checks whether two types `X` and `Y` are strictly equal.
 *
 * @remarks
 * - This type uses conditional types and generic inference tricks to compare whether two types are identical.
 * - It resolves to `true` if `X` and `Y` are the same type, otherwise `false`.
 *
 * _Typically used together with {@link Expect} for type-level assertions in tests._
 *
 * @example
 * type Test1 = Equal<string, string>; // true
 * type Test2 = Equal<string, number>; // false
 *
 * // Example with Expect
 * type Check = Expect<Equal<'a', 'a'>>; // ✅ Compiles
 * type Fail  = Expect<Equal<'a', 'b'>>; // ❌ Type error
 */
export type Equal<X, Y> =
	(<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

/**
 * * Ensures that an array has **at least one element**.
 *
 * @remarks
 * - This type enforces non-empty arrays by requiring the first element `T`, followed by zero or more additional `T`s.
 *
 * @example
 * type NonEmpty = ValidArray<number>; 	// [number, ...number[]]
 * const arr1: NonEmpty = [1];       	// ✅ OK
 * const arr2: NonEmpty = [];        	// ❌ Error (empty array not allowed)
 */
export type ValidArray<T> = [T, ...Array<T>];

/**
 * * A readonly array of elements of type `T`.
 *
 * @remarks
 * - Shorthand for `ReadonlyArray<T>`. Used to represent immutable lists.
 *
 * @example
 * type Numbers = List<number>;	// readonly number[]
 * const arr: Numbers = [1, 2, 3];	// ✅ OK
 * arr.push(4);                   	// ❌ Error (readonly)
 */
export type List<T = any> = ReadonlyArray<T>;

/** Function type for serializing a value of type `T` to a string. */
export type Serializer<T> = (value: T) => string;

/** Function type for deserializing a string to a value of type `T`. */
export type Deserializer<T> = (value: string) => T;
