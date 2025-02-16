import { flattenArray } from '../../src';

describe('flattenArray', () => {
	test('should flatten a deeply nested array', () => {
		expect(flattenArray([1, [2, [3, [4, 5]]]])).toEqual([1, 2, 3, 4, 5]);
	});

	test('should return the same array if already flat', () => {
		expect(flattenArray([1, 2, 3])).toEqual([1, 2, 3]);
	});

	test('should wrap a non-array value in an array', () => {
		expect(flattenArray(42)).toEqual([42]);
	});

	test('should handle an empty array', () => {
		expect(flattenArray([])).toEqual([]);
	});

	test('should handle mixed data types', () => {
		expect(
			flattenArray([1, 'a', [true, [null, [{ key: 'value' }]]]]),
		).toEqual([1, 'a', true, null, { key: 'value' }]);
	});

	test('should handle an array with a single element', () => {
		expect(flattenArray([5])).toEqual([5]);
	});

	test('should handle an array with multiple empty arrays', () => {
		expect(flattenArray([[], [[], [[]]]])).toEqual([]);
	});
});
