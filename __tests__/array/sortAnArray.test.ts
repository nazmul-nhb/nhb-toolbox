import { sortAnArray } from '../../src';

describe('sortAnArray', () => {
	test('should return empty array if given an empty array', () => {
		expect(sortAnArray([])).toEqual([]);
	});

	test('should sort an array of strings in ascending order (default)', () => {
		expect(sortAnArray(['banana', 'apple', 'cherry'])).toEqual([
			'apple',
			'banana',
			'cherry',
		]);
	});

	test('should sort an array of strings in descending order', () => {
		expect(
			sortAnArray(['banana', 'apple', 'cherry'], { sortOrder: 'desc' }),
		).toEqual(['cherry', 'banana', 'apple']);
	});

	test('should sort an array of numbers in ascending order (default)', () => {
		expect(sortAnArray([3, 1, 2])).toEqual([1, 2, 3]);
	});

	test('should sort an array of numbers in descending order', () => {
		expect(sortAnArray([3, 1, 2], { sortOrder: 'desc' })).toEqual([
			3, 2, 1,
		]);
	});

	test('should sort an array of booleans in ascending order (false -> true)', () => {
		expect(sortAnArray([true, false, true, false])).toEqual([
			false,
			false,
			true,
			true,
		]);
	});

	test('should sort an array of booleans in descending order (true -> false)', () => {
		expect(
			sortAnArray([true, false, true, false], { sortOrder: 'desc' }),
		).toEqual([true, true, false, false]);
	});

	test('should sort an array of objects by a string field in ascending order (default)', () => {
		const data = [
			{ name: 'John', age: 25 },
			{ name: 'Alice', age: 30 },
			{ name: 'Bob', age: 22 },
		];

		expect(sortAnArray(data, { sortByField: 'name' })).toEqual([
			{ name: 'Alice', age: 30 },
			{ name: 'Bob', age: 22 },
			{ name: 'John', age: 25 },
		]);
	});

	test('should sort an array of objects by a string field in descending order', () => {
		const data = [
			{ name: 'John', age: 25 },
			{ name: 'Alice', age: 30 },
			{ name: 'Bob', age: 22 },
		];

		expect(
			sortAnArray(data, { sortByField: 'name', sortOrder: 'desc' }),
		).toEqual([
			{ name: 'John', age: 25 },
			{ name: 'Bob', age: 22 },
			{ name: 'Alice', age: 30 },
		]);
	});

	test('should sort an array of objects by a number field in ascending order', () => {
		const data = [
			{ name: 'John', age: 25 },
			{ name: 'Alice', age: 30 },
			{ name: 'Bob', age: 22 },
		];

		expect(sortAnArray(data, { sortByField: 'age' })).toEqual([
			{ name: 'Bob', age: 22 },
			{ name: 'John', age: 25 },
			{ name: 'Alice', age: 30 },
		]);
	});

	test('should sort an array of objects by a number field in descending order', () => {
		const data = [
			{ name: 'John', age: 25 },
			{ name: 'Alice', age: 30 },
			{ name: 'Bob', age: 22 },
		];

		expect(
			sortAnArray(data, {
				sortByField: 'age',
				sortOrder: 'desc',
			}),
		).toEqual([
			{ name: 'Alice', age: 30 },
			{ name: 'John', age: 25 },
			{ name: 'Bob', age: 22 },
		]);
	});

	// test('should throw an error if sortByField is missing for object sorting', () => {
	// 	const data = [
	// 		{ name: 'John', age: 25 },
	// 		{ name: 'Alice', age: 30 },
	// 	];

	// 	// @ts-expect-error
	// 	expect(() => sortAnArray(data, {})).toThrowError(
	// 		'Invalid array or missing "sortByField" for objects.',
	// 	);
	// });

	// test('should throw an error if sorting non-string/number/boolean fields in objects', () => {
	// 	const data = [
	// 		{ name: 'John', age: 25, meta: { level: 1 } },
	// 		{ name: 'Alice', age: 30, meta: { level: 2 } },
	// 	];

	// 	expect(() =>
	// 		//@ts-expect-error
	// 		sortAnArray(data, {
	// 			sortByField: 'meta',
	// 		}),
	// 	).toThrowError(
	// 		'Cannot compare non-string/non-number/non-boolean properties.',
	// 	);
	// });

	test('should return the same array if input is not an array', () => {
		expect(sortAnArray(null as unknown as string[])).toBe(null);
		expect(sortAnArray(undefined as unknown as string[])).toBe(undefined);
		expect(sortAnArray(123 as unknown as string[])).toBe(123);
	});
});
