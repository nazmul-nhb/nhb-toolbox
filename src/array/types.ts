import type { GenericObject, NestedPrimitiveKey } from '../object/types';
import type { PrimitiveKey } from '../types';

/** * Flatten Array or Wrap in Array */
export type Flattened<T> = T extends (infer U)[] ? Flattened<U> : T;

/**
 * * Configuration for `createOptionsArray`.
 * - Defines the mapping between keys in the input objects and the keys in the output options.
 *
 * @typeParam T - The type of the objects in the input array.
 * @typeParam K1 - The name of the key for the first field in the output (default: `'value'`).
 * @typeParam K2 - The name of the key for the second field in the output (default: `'label'`).
 */
export interface OptionsConfig<T, K1, K2> {
	/**
	 * - The key in the input objects to use for the first field of the option.
	 * @example If the input objects have an `id` field and you want to use it as the `value` field in the output, set createOptionsArray(data, {firstFieldKey: 'id'}).
	 */
	firstFieldKey: PrimitiveKey<T>;

	/**
	 * - The key in the input objects to use for the second field of the option.
	 * @example If the input objects have a `name` field and you want to use it as the `label` field in the output, set createOptionsArray(data, {firstFieldKey: 'id', secondFieldKey: 'name'}).
	 */
	secondFieldKey: PrimitiveKey<T>;

	/**
	 * - The name of the first field in the output object.
	 * - Defaults to `'value'`.
	 * @example If you want the output field to be named `'key'` instead of `'value'`, set createOptionsArray(data, {firstFieldKey: 'id', secondFieldKey: 'name', firstFieldName: 'key'}).
	 */
	firstFieldName?: K1;

	/**
	 * - The name of the second field in the output object.
	 * - Defaults to `'label'`.
	 * @example If you want the output field to be named `'title'` instead of `'label'`, set createOptionsArray(data, {firstFieldKey: 'id', secondFieldKey: 'name', firstFieldName: 'key', secondFieldName: 'title'}).
	 */
	secondFieldName?: K2;
}

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
