import { isValidArray } from '../guards/non-primitives';
import { roundNumber } from '../number/basics';
import type { GenericObject, NestedPrimitiveKey, NumericDotKey } from '../object/types';
import type { Maybe } from '../types/index';
import { _getNumericProp, _resolveNestedKey } from './helpers';
import { splitArrayByProperty } from './transform';

/**
 * * Calculates the sum of differences between two numeric fields for each item in the array.
 *
 * @param data - The array of objects to process.
 * @param first - The field name to subtract **from** (minuend), supports nested dot notation.
 * @param second - The field name to subtract (subtrahend), supports nested dot notation.
 * @param roundTo - Decimal places to round the result to. Defaults to 2.
 * @returns The total sum of differences between the two fields across all items.
 *
 * @example
 * sumFieldDifference([{ buy: 10, sell: 3 }, { buy: 8, sell: 5 }], 'buy', 'sell');
 * // => 10
 */
export function sumFieldDifference<T extends GenericObject, P extends NumericDotKey<T>>(
	data: Maybe<T[]>,
	first: P,
	second: P,
	roundTo = 2
): number {
	if (!isValidArray(data)) return 0;

	const total = data?.reduce((acc, item) => {
		return acc + (_getNumericProp(item, first) - _getNumericProp(item, second));
	}, 0);

	return roundNumber(total, roundTo);
}

/**
 * * Calculates the total sum of a numeric field across all items.
 *
 * @param data - The array of objects to process.
 * @param field - The field to sum values from. Supports nested dot notation.
 * @param roundTo - Decimal places to round the result to. Defaults to 2.
 * @returns The rounded total sum.
 *
 * @example
 * sumByField([{ a: 5 }, { a: 3 }], 'a');
 * // => 8
 */
export function sumByField<T extends GenericObject>(
	data: Maybe<T[]>,
	field: NumericDotKey<T>,
	roundTo = 2
): number {
	if (!isValidArray(data)) return 0;

	const total = data?.reduce((acc, item) => acc + _getNumericProp(item, field), 0);

	return roundNumber(total, roundTo);
}

/**
 * * Calculates the average of a numeric field across all items.
 *
 * @param data - The array of objects to process.
 * @param field - The field to calculate the average from. Supports nested dot notation.
 * @param roundTo - Decimal places to round the result to. Defaults to 2.
 * @returns The rounded average.
 *
 * @example
 * averageByField([{ a: 4 }, { a: 6 }], 'a');
 * // => 5
 */
export function averageByField<T extends GenericObject>(
	data: Maybe<T[]>,
	field: NumericDotKey<T>,
	roundTo = 2
): number {
	if (!isValidArray(data)) return 0;

	const total = data?.reduce((acc, item) => acc + _getNumericProp(item, field), 0);

	return roundNumber(total / data.length, roundTo);
}

/**
 * * Groups an array of objects by a primitive field and sums another numeric field per group.
 *
 * @param data - The array of objects to group.
 * @param groupBy - The field to group by. Supports nested dot notation.
 * @param sumBy - The numeric field to sum within each group. Supports nested dot notation.
 * @param roundTo - Decimal places to round each group’s result to. Defaults to 2.
 * @returns An array of records, each with the group key and its corresponding summed value.
 *
 * @example
 * groupAndSumByField([{ type: 'A', val: 2 }, { type: 'A', val: 3 }, { type: 'B', val: 1 }], 'type', 'val');
 * // => [{ A: 5 }, { B: 1 }]
 */
export function groupAndSumByField<T extends GenericObject>(
	data: Maybe<T[]>,
	groupBy: NestedPrimitiveKey<T>,
	sumBy: NumericDotKey<T>,
	roundTo = 2
): Array<Record<string, number>> {
	if (!isValidArray(data)) return [];

	const groups = splitArrayByProperty(data, groupBy);

	const result = groups.map((group) => ({
		[`${_resolveNestedKey(group[0], groupBy)}`]: sumByField(group, sumBy, roundTo),
	}));

	return result;
}

/**
 * * Groups an array of objects by a primitive field and averages another numeric field per group.
 *
 * @param data - The array of objects to group.
 * @param groupBy - The field to group by. Supports nested dot notation.
 * @param averageBy - The numeric field to average within each group. Supports nested dot notation.
 * @param roundTo - Decimal places to round each group’s average to. Defaults to 2.
 * @returns An array of records, each with the group key and its corresponding average value.
 *
 * @example
 * groupAndAverageByField([{ type: 'A', val: 2 }, { type: 'A', val: 4 }, { type: 'B', val: 6 }], 'type', 'val');
 * // => [{ A: 3 }, { B: 6 }]
 */
export function groupAndAverageByField<T extends GenericObject>(
	data: Maybe<T[]>,
	groupBy: NestedPrimitiveKey<T>,
	averageBy: NumericDotKey<T>,
	roundTo = 2
): Array<Record<string, number>> {
	if (!isValidArray(data)) return [];

	const groups = splitArrayByProperty(data, groupBy);

	const result = groups.map((group) => ({
		[`${_resolveNestedKey(group[0], groupBy)}`]: averageByField(group, averageBy, roundTo),
	}));

	return result;
}
