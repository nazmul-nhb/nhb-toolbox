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
