/**
 *  * Flatten Array or Wrap in Array
 *
 *  @template T - The type of the input, which can be a nested array or a non-array value.
 *  */
export type Flattened<T> = T extends (infer U)[] ? Flattened<U> : T;

/** - Input for `createOptionsArray`. */
export type OptionInput = Record<string, string | number | null | undefined>;

/**
 * - Configuration for `createOptionsArray`.
 * - Defines the mapping between keys in the input objects and the keys in the output options.
 *
 * @typeParam T - The type of the objects in the input array.
 * @typeParam K1 - The name of the key for the first field in the output (default: `'value'`).
 * @typeParam K2 - The name of the key for the second field in the output (default: `'label'`).
 */
export interface ConfigOptions<
	T extends Record<string, string | number | null | undefined>,
	K1 extends string = 'value',
	K2 extends string = 'label',
> {
	/**
	 * - The key in the input objects to use for the first field of the option.
	 * @example If the input objects have an `id` field and you want to use it as the `value` field in the output, set createOptionsArray(data, {firstFieldKey: 'id'}).
	 */
	firstFieldKey: keyof T;

	/**
	 * - The key in the input objects to use for the second field of the option.
	 * @example If the input objects have a `name` field and you want to use it as the `label` field in the output, set createOptionsArray(data, {firstFieldKey: 'id', secondFieldKey: 'name'}).
	 */
	secondFieldKey: keyof T;

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

/** - Object type with string or number as value for each key. */
export type InputObject = Record<string, string | number | boolean>;

/** - Option for sorting order. */
export interface OrderOption {
	/**
	 * * The order in which to sort the array. Defaults to `'asc'`.
	 * - `'asc'`: Sort in ascending order.
	 * - `'desc'`: Sort in descending order.
	 */
	sortOrder?: 'asc' | 'desc';
}

/**
 * - Options for sorting an array of objects.
 * @template T - The type of objects in the array.
 */
export interface SortOptions<T extends InputObject> extends OrderOption {
	/** The field by which to sort the objects in the array. */
	sortByField?: keyof T;
}
