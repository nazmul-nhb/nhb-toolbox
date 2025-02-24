/** Uncontrolled any to use for edge cases */
export type UncontrolledAny = any;

declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };

/** Create a branded type. */
export type Branded<T, B> = T & Brand<B>;

/** Union of Primitive Types */
export type Primitive = string | number | boolean | null | undefined;

/** Generic function type */
export type GenericFn = (...args: any[]) => void;

/** Debounced function type after certain delay */
export type DelayedFn<T extends GenericFn> = (...args: Parameters<T>) => void;

/** Throttled function type after specific delay */
export type ThrottledFn<T extends GenericFn> = (...args: Parameters<T>) => void;
