import type { GenericObject, NestedPrimitiveKey } from '../object/types';
import type { NormalPrimitiveKey } from '../types/index';

/** * Flatten Array or Wrap in Array */
export type Flattened<T> = T extends (infer U)[] ? Flattened<U> : T;

// ! ======== TYPES FOR OPTIONS ARRAY START ======== //
/**
 * * Configuration for `createOptionsArray`.
 * - Defines the mapping between keys in the input objects and the keys in the output options.
 *
 * @typeParam T - The type of the objects in the input array.
 * @typeParam K1 - The name of the key for the first field in the output (default: `'value'`).
 * @typeParam K2 - The name of the key for the second field in the output (default: `'label'`).
 * @typeParam V - Whether to keep the `value` field as number if it is a number. Defaults to `false`.
 */
export interface OptionsConfig<T, K1, K2, V extends boolean = false> {
	/**
	 * - The key in the input objects to use for the first field of the option. Only primitive values (`string | number | boolean | null | undefined`) are accepted.
	 * @example
	 * // If the input objects have an `id` field and you want to use it as the `value` field in the output:
	 * createOptionsArray(data, {firstFieldKey: 'id'}).
	 */
	firstFieldKey: NormalPrimitiveKey<T>;

	/**
	 * - The key in the input objects to use for the second field of the option. Only primitive values (`string | number | boolean | null | undefined`) are accepted.
	 * @example
	 * // If the input objects have a `name` field and you want to use it as the `label` field in the output:
	 * createOptionsArray(data, {firstFieldKey: 'id', secondFieldKey: 'name'}).
	 */
	secondFieldKey: NormalPrimitiveKey<T>;

	/**
	 * - The name of the first field in the output object.
	 * - Defaults to `'value'`.
	 * @example
	 * // If you want the output field to be named `'key'` instead of `'value'`:
	 * createOptionsArray(data, {firstFieldKey: 'id', secondFieldKey: 'name', firstFieldName: 'key'}).
	 */
	firstFieldName?: K1;

	/**
	 * - The name of the second field in the output object.
	 * - Defaults to `'label'`.
	 * @example
	 * // If you want the output field to be named `'title'` instead of `'label'`:
	 * createOptionsArray(data, {firstFieldKey: 'id', secondFieldKey: 'name', firstFieldName: 'key', secondFieldName: 'title'}).
	 */
	secondFieldName?: K2;

	/**
	 * - If `true`, numeric values from `firstFieldKey` will remain as numbers.
	 * - All other values (including booleans, null, undefined) will be converted to strings.
	 * - When `false` (default), all values are converted to strings.
	 * - Defaults to `false`.
	 * @example
	 * // Numeric IDs remain as numbers
	 * createOptionsArray(data, {
	 *   firstFieldKey: 'id',
	 *   secondFieldKey: 'name',
	 *   retainNumberValue: true
	 * });
	 *
	 * // All values become strings (default behavior)
	 * createOptionsArray(data, {
	 *   firstFieldKey: 'id',
	 *   secondFieldKey: 'name'
	 * });
	 */
	retainNumberValue?: V;
}

/** Type for first field key */
export type FirstFieldKey<
	T extends GenericObject,
	K1 extends string = 'value',
	K2 extends string = 'label',
	V extends boolean = false,
> = T[OptionsConfig<T, K1, K2, V>['firstFieldKey']];

/** Type for firs field value */
export type FirstFieldValue<
	T extends GenericObject,
	K1 extends string = 'value',
	K2 extends string = 'label',
	V extends boolean = false,
> =
	V extends true ?
		FirstFieldKey<T, K1, K2, V> extends (
			Exclude<FirstFieldKey<T, K1, K2, V>, number>
		) ?
			string
		:	number
	:	string;

/** Type of values for the option fields */
export type FieldValue<
	P extends K1 | K2,
	T extends GenericObject,
	K1 extends string = 'value',
	K2 extends string = 'label',
	V extends boolean = false,
> = P extends K1 ? FirstFieldValue<T, K1, K2, V> : string;

/** Type of an option in `OptionsArray` */
export type Option<
	T extends GenericObject,
	K1 extends string = 'value',
	K2 extends string = 'label',
	V extends boolean = false,
> = { [P in K1 | K2]: FieldValue<P, T, K1, K2, V> };

// ! ========= TYPES FOR OPTIONS ARRAY END ========= //

/** * Option for sorting order. */
export interface OrderOption {
	/**
	 * * The order in which to sort the array. Defaults to `'asc'`.
	 * - `'asc'`: Sort in ascending order.
	 * - `'desc'`: Sort in descending order.
	 */
	sortOrder?: 'asc' | 'desc';
}

/** * Options for setting sortByField for sorting an array of objects. */
export interface SortByOption<T extends GenericObject> extends OrderOption {
	/** The field by which to sort the objects in the array. */
	sortByField: NestedPrimitiveKey<T>;
}

/** * Options for sorting array. */
export type SortOptions<T> =
	T extends GenericObject ? SortByOption<T> : OrderOption;

/** Optional settings to configure comparison behavior. */
export interface SortNature {
	/** If true, compares string chunks without case sensitivity. Defaults to `true`. */
	caseInsensitive?: boolean;
	/** If true, uses localeCompare for string chunk comparisons. Defaults to `false`. */
	localeAware?: boolean;
}

/** * Options for customizing the search behavior. */
export interface FindOptions<T = unknown> {
	/** * Enables fuzzy matching when exact match fails. Defaults to `false`. */
	fuzzy?: boolean;
	/** * Optional key for caching the result. Defaults to `finder-cache` */
	cacheKey?: string;
	/** * Forces binary search even for small datasets. Defaults to `false`. */
	forceBinary?: boolean;
	/** * If true, matcher and keys will be normalized to lowercase. Defaults to `true`. */
	caseInsensitive?: boolean;
	/** * If true, uses built in `Array.sort()`. Defaults to `true`. Pass `false` if data is already sorted. */
	needSorting?: boolean;
	/** * Optional data source to use instead of constructor items. */
	data?: T[] | (() => T[]);
}
