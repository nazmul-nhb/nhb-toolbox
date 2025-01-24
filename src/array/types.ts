/** - Flatten Array */
export type Flattened<T> = T extends (infer U)[] ? Flattened<U> : T;

/**  */
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
