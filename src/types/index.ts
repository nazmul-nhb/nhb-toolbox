/** Uncontrolled any to use for edge cases */
export type UncontrolledAny = any;

declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };

/** Create a branded type. */
export type Branded<T, B> = T & Brand<B>;

/** Utility type to flatten Partial type */
export type FlattenPartial<T> = Partial<{ [K in keyof T]: T[K] }>;

/** Utility type to flatten Partial type */
// export type FlattenPartial<T> = T extends Partial<infer U> ? Partial<U> : Partial<T> & {};

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

/** Generic function type */
export type GenericFn = (...args: any[]) => void;

/** Debounced function type after certain delay */
export type DelayedFn<T extends GenericFn> = (...args: Parameters<T>) => void;

/** Throttled function type after specific delay */
export type ThrottledFn<T extends GenericFn> = (...args: Parameters<T>) => void;
