import type { AdvancedTypes, Numeric } from '../types/index';

/** Options to initialize Paginator */
export interface PaginatorOptions {
	/** The total number of items. */
	totalItems: Numeric;
	/** Number of items per page. (Default is `10`). */
	itemsPerPage?: Numeric;
	/** Current active page. (Default is `1`). */
	currentPage?: Numeric;
}

/** Paginator metadata */
export interface PaginatorMeta {
	/** Total number of items in the dataset. */
	totalItems: number;
	/** The current page number in the pagination. */
	currentPage: number;
	/** The number of items per page in the pagination. */
	itemsPerPage: number;
	/** The total number of pages based on the totalItems and itemsPerPage. */
	totalPages: number;
	/** Whether the current page has a previous page. */
	hasPrev: boolean;
	/** Whether the current page has a next page. */
	hasNext: boolean;
	/** Whether the current page is the first page. */
	isFirst: boolean;
	/** Whether the current page is the last page. */
	isLast: boolean;
	/** The number of items to skip (the offset) for the current page. */
	offset: number;
}

/** Options for `fromMeta` method. */
export type FromMetaOptions = Pick<
	PaginatorMeta,
	'totalItems' | 'itemsPerPage' | 'currentPage'
>;

/** Options for pageList method. */
export interface PageListOptions {
	/** Number of edge pages to always show (default 1). */
	edgeCount?: number;
	/** Number of siblings pages to show around the current page (default 1). */
	siblingCount?: number;
}

// ! UTILITY TYPES FOR GENERAL PURPOSE

/**
 * * Extracts the union of all property value types from a given object type.
 *
 * @example
 * type Colors = { primary: string; secondary: string; id: number; };
 * type ColorValues = ValueOf<Colors>; // string | number
 */
export type ValueOf<T> = T[keyof T];

/**
 * * Gets all keys from a union of object types.
 *
 * @example
 * type A = { a: string };
 * type B = { b: number };
 * type Union = A | B;
 * type Keys = KeysOfUnion<Union>; // "a" | "b"
 */
export type KeysOfUnion<T> = T extends T ? keyof T : never;

/**
 * * Recursively makes all properties in an object type optional.
 *
 * @example
 * type Config = { a: string; nested: { b: number } };
 * type PartialConfig = DeepPartial<Config>;
 * // { a?: string; nested?: { b?: number } }
 */
export type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * * Removes `readonly` modifiers from all properties of an object type.
 *
 * @example
 * type ReadonlyObj = { readonly id: number };
 * type WritableObj = Mutable<ReadonlyObj>;
 * // { id: number }
 */
export type Mutable<T> = {
	-readonly [K in keyof T]: T[K];
};

/**
 * * Recursively adds `readonly` to all properties of an object type.
 *
 * @example
 * type State = { user: { id: number } };
 * type ReadonlyState = Immutable<State>;
 * // { readonly user: { readonly id: number } }
 */
export type Immutable<T> = {
	readonly [K in keyof T]: Immutable<T[K]>;
};

/**
 * * Combines two object types. In case of conflicts, keys from `U` override `T`.
 *
 * @example
 * type A = { id: number; name: string };
 * type B = { name: boolean; active: boolean };
 * type Merged = Merge<A, B>;
 * // { id: number; name: boolean; active: boolean }
 */
export type Merge<T, U> = {
	[K in keyof T | keyof U]: K extends keyof U ? U[K]
	: K extends keyof T ? T[K]
	: never;
};

/**
 * * Omits properties from an object type whose value types match `ValueType`.
 *
 * @example
 * type Model = { id: number; name: string; hidden: boolean };
 * type VisibleModel = OmitByValue<Model, boolean>;
 * // { id: number; name: string }
 */
export type OmitByValue<T, ValueType> = {
	[K in keyof T as T[K] extends ValueType ? never : K]: T[K];
};

/**
 * * Makes only the specified keys in a type required; others remain optional.
 *
 * @example
 * type User = { id?: number; name?: string };
 * type UserWithId = RequireOnly<User, 'id'>;
 * // { id: number; name?: string }
 */
export type RequireOnly<T, K extends keyof T> = Partial<T> &
	Required<Pick<T, K>>;

/**
 * * Forces TypeScript to simplify a complex or inferred type into a more readable flat object.
 *
 * *Useful when working with utility types like `Merge`, `Omit`, etc., that produce deeply nested or unresolved intersections.*
 *
 * @example
 * type A = { a: number };
 * type B = { b: string };
 * type Merged = A & B;
 * type Pretty = Prettify<Merged>;
 * // Type will now display as: { a: number; b: string }
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/**
 * * Broadens a literal union (typically `string` or `number`) to also accept any other value of the base type, without losing IntelliSense autocomplete for the provided literals.
 *
 * *This is especially useful in API design where you want to provide suggestions for common options but still allow flexibility for custom user-defined values.*
 *
 * @example
 * // ✅ String literal usage
 * type Variant = LooseLiteral<'primary' | 'secondary'>;
 * const v1: Variant = 'primary';  // suggested
 * const v2: Variant = 'custom';   // also valid
 *
 * // ✅ Number literal usage
 * type StatusCode = LooseLiteral<200 | 404 | 500>;
 * const s1: StatusCode = 200;     // suggested
 * const s2: StatusCode = 999;     // also valid
 *
 * // ✅ Mixed literal
 * type Mixed = LooseLiteral<'one' | 2>;
 * const m1: Mixed = 'one';        // ✅
 * const m2: Mixed = 2;            // ✅
 * const m3: Mixed = 'anything';   // ✅
 * const m4: Mixed = 123;          // ✅
 *
 * @note Technically, this uses intersection with primitive base types (`string & {}` or `number & {}`) to retain IntelliSense while avoiding type narrowing.
 */
export type LooseLiteral<T extends string | number> =
	| T
	| (T extends string ? string & {} : number & {});

/**
 * * Extracts an object type containing only the optional keys from `T`.
 *
 * @template T - The original object type
 * @returns A new object type with only optional keys from `T`
 * @example
 * type Example = { a: string; b?: number; c?: boolean };
 * type OptionalPart = ExtractOptional<Example>;
 * // { b?: number; c?: boolean }
 */
export type ExtractOptional<T> = {
	[K in keyof T as {} extends Pick<T, K> ? K : never]?: T[K];
};

/**
 * * Extracts an object type containing only the required keys from `T`.
 *
 * @template T - The original object type
 * @returns A new object type with only required keys from `T`
 * @example
 * type Example = { a: string; b?: number; c: boolean };
 * type RequiredPart = ExtractRequired<Example>;
 * // { a: string; c: boolean }
 */
export type ExtractRequired<T> = {
	[K in keyof T as {} extends Pick<T, K> ? never : K]: T[K];
};

/**
 * * Converts a readonly tuple to a union of its element types.
 *
 * @template T - A tuple type (must be readonly if using `as const`)
 * @example
 * const roles = ['admin', 'user', 'guest'] as const;
 * type Role = TupleToUnion<typeof roles>; // "admin" | "user" | "guest"
 */
export type TupleToUnion<T extends readonly unknown[]> = T[number];

/**
 * * Creates a tuple type of a given length with elements of type T
 *
 * 📝 **Notes**:
 * - This works recursively to build a tuple of exact length N.
 *
 * - N must be a literal number, not just number. You can’t pass a general number type because recursion can't compute unbounded lengths
 * - You can use as const or mapped types when initializing values with this shape
 *
 * @example
 * type FiveStrings = TupleOf<string, 5>; // [string, string, string, string, string]
 * type EmptyTuple = TupleOf<boolean, 0>; // []
 */
export type TupleOf<T, N extends number, R extends unknown[] = []> =
	R['length'] extends N ? R : TupleOf<T, N, [...R, T]>;

/**
 * * Makes selected or all properties of an object type optional (only the values, not the keys).
 *
 * If `K` is provided, only those properties' values become optional (keys remain required).
 * If `K` is omitted, all property values become optional.
 *
 * @template O - The original object type.
 * @template K - Optional union of keys in `O` whose values should become optional.
 *
 * @example
 * type A = { name: string; age: number };
 * type B = ValueOptional<A, 'name'>;
 * // Equivalent to: { name: string | undefined; age: number }
 *
 * @example
 * type C = ValueOptional<A>;
 * // Equivalent to: { name: string | undefined; age: number | undefined }
 */
export type ValueOptional<O, K extends keyof O = keyof O> = {
	[P in keyof O]: P extends K ? O[P] | undefined : O[P];
};

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * * Creates a type that is either `T` or `U`, but not both at the same time.
 * * This is useful for defining types that can be one of two options, but not both.
 * * @template T - First type option.
 * @template U - Second type option.
 * @example
 * type A = { a: string };
 * type B = { b: number };
 * type Exclusive = OneOf<A, B>;
 * // Equivalent to: { a: string } | { b: number }
 */
export type OneOf<T, U> = (T & Without<U, T>) | (U & Without<T, U>);

/**
 * * Checks whether a type is a strict object (excluding functions).
 *
 * @template T - The type to test.
 *
 * @example
 * type A = IsStrictObject<{}>;          // true
 * type B = IsStrictObject<() => void>;  // false
 * type C = IsStrictObject<string>;      // false
 */
export type IsStrictObject<T> =
	T extends object ?
		T extends AdvancedTypes ? false
		: T extends Array<unknown> ? false
		: true
	:	false;

/**
 * * Returns the keyof `T` only if `T` is a non-function object, otherwise `null`.
 * * Prevents extracting keys from primitives or functions.
 *
 * @template T - The input type.
 *
 * @example
 * type A = Keyof<{ x: number }>; // "x"
 * type B = Keyof<number>;        // null
 */
export type Keyof<T> = IsStrictObject<T> extends true ? keyof T : null;

/**
 * * Recursively generates dot-separated keys from a nested object.
 *
 * @template T - The input nested object type.
 *
 * @example
 * type Obj = { user: { name: string; meta: { id: number } } };
 * type Keys = DeepKeyof<Obj>;
 * // "user" | "user.name" | "user.meta" | "user.meta.id"
 */
export type DeepKeyof<T> =
	IsStrictObject<T> extends true ?
		{
			[K in keyof T]: K extends string ?
				IsStrictObject<T[K]> extends true ?
					K | `${K}.${DeepKeyof<T[K]>}`
				:	K
			:	never;
		}[keyof T]
	:	never;

/**
 * * Creates a new type by picking properties from `T` whose values extend type `V`.
 *
 * @template T - The object type.
 * @template V - The value type to filter by.
 *
 * @example
 * type T = { name: string; age: number; active: boolean };
 * type StringsOnly = PickByValue<T, string>; // { name: string }
 */
export type PickByValue<T, V> = {
	[K in keyof T as T[K] extends V ? K : never]: T[K];
};

/**
 * * Maps all values of object `T` to a fixed type `R`, keeping original keys.
 *
 * @template T - The source object type.
 * @template R - The replacement value type.
 *
 * @example
 * type T = { name: string; age: number };
 * type BooleanMapped = MapObjectValues<T, boolean>; // { name: boolean; age: boolean }
 */
export type MapObjectValues<T, R> = {
	[K in keyof T]: R;
};

/**
 * * Removes properties from object `T` whose type is `never`.
 * * Typically useful after conditional filtering.
 *
 * @template T - The input object type.
 *
 * @example
 * type T = { a: string; b: never; c: number };
 * type Cleaned = RemoveNever<T>; // { a: string; c: number }
 */
export type RemoveNever<T> = {
	[K in keyof T as T[K] extends never ? never : K]: T[K];
};

/**
 * * Renames the keys of `T` using the mapping `R`.
 *
 * @template T - Original object type.
 * @template R - Mapping from original keys to new key names.
 *
 * @example
 * type Original = { first: string; last: string };
 * type Mapped = RenameKeys<Original, { first: "firstName"; last: "lastName" }>;
 * // Result: { firstName: string; lastName: string }
 */
export type RenameKeys<T, R extends Record<keyof T, string>> = {
	[K in keyof T as R[K]]: T[K];
};
