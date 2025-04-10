/** Uncontrolled any to use for edge cases */
export type Any = any;

declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };

/** Create a branded type. */
export type Branded<T, B> = T & Brand<B>;

/** Utility type to extract only method names from a class.
 * ! Unused
 */
export type ClassMethodNames<T> = {
	[K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];

/**
 * Extracts instance method names from a class constructor.
 * ! Unused
 */
export type InstanceMethodNames<T extends abstract new (...args: any) => any> =
	{
		[K in keyof InstanceType<T>]: InstanceType<T>[K] extends (
			(...args: unknown[]) => unknown
		) ?
			K
		:	never;
	}[keyof InstanceType<T>];

/**
 * Extracts static method names from a class constructor.
 * ! Unused
 */
export type StaticMethodNames<T extends abstract new (...args: any) => any> = {
	[K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];

/**
 * Extracts all method names (instance + static) from a class constructor.
 * ! Unused
 */
export type MethodNames<T extends abstract new (...args: any) => any> =
	| InstanceMethodNames<T>
	| StaticMethodNames<T>;

/**
 * Maps all instance method names to their method types from the class prototype.
 * ! Unused
 */
export type MethodMap<T extends abstract new (...args: any) => any> = {
	[K in InstanceMethodNames<T>]: InstanceType<T>[K];
};

/** Utility type to flatten Partial type */
export type FlattenPartial<T> = Partial<{ [K in keyof T]: T[K] }>;

/** Utility type to flatten Partial type */
// export type FlattenPartial<T> = T extends Partial<infer U> ? Partial<U> : Partial<T> & {};

/** Union of `number` and numeric string */
export type Numeric = number | `${number}`;

/** Union of Primitive Types */
export type Primitive = string | number | boolean | null | undefined;

/** Extract primitive key(s) from an object */
export type PrimitiveKey<T> = {
	[K in keyof T]: T[K] extends Primitive ? K : never;
}[keyof T];

/** Extract primitive (string, number or boolean) key(s) from an object */
export type NonNullishPrimitiveKey<T> = {
	[K in keyof T]: T[K] extends string | number | boolean ? K : never;
}[keyof T];

/** Falsy primitive type  */
export type FalsyPrimitive = false | 0 | '' | null | undefined;

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

/** Advanced non-primitive types */
export type AdvancedTypes =
	| Array<unknown>
	| File
	| FileList
	| Blob
	| Date
	| RegExp
	| WeakMap<WeakKey, unknown>
	| WeakSet<WeakKey>
	| Map<unknown, unknown>
	| Set<unknown>
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
