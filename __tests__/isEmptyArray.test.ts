import { isValidEmptyArray } from '../src'; // Adjust path as needed

describe('isValidEmptyArray', () => {
	test('should return true for an empty array', () => {
		expect(isValidEmptyArray([])).toBe(true);
	});

	test('should return true for a non-array value', () => {
		expect(isValidEmptyArray(null)).toBe(true);
		expect(isValidEmptyArray(undefined)).toBe(true);
		expect(isValidEmptyArray(42)).toBe(true);
		expect(isValidEmptyArray('hello')).toBe(true);
		expect(isValidEmptyArray(false)).toBe(true);
		expect(isValidEmptyArray({})).toBe(true);
		expect(isValidEmptyArray(() => {})).toBe(true);
	});

	test('should return true for an array with only null or undefined', () => {
		expect(isValidEmptyArray([null, undefined])).toBe(true);
	});

	test('should return true for an array with only empty objects', () => {
		expect(isValidEmptyArray([{}, {}])).toBe(true);
	});

	test('should return true for an array with only empty arrays', () => {
		expect(isValidEmptyArray([[], []])).toBe(true);
	});

	test('should return true for a mix of empty objects, empty arrays, null, and undefined', () => {
		expect(isValidEmptyArray([null, undefined, {}, []])).toBe(true);
	});

	test('should return false for a non-empty array with valid elements', () => {
		expect(isValidEmptyArray([1, 2, 3])).toBe(false);
		expect(isValidEmptyArray(['hello'])).toBe(false);
		expect(isValidEmptyArray([{ key: 'value' }])).toBe(false);
		expect(isValidEmptyArray([[1]])).toBe(false);
		expect(isValidEmptyArray([true])).toBe(false);
	});

	test('should return false for an array with at least one meaningful value', () => {
		expect(isValidEmptyArray([null, undefined, {}, [], 'valid'])).toBe(
			false,
		);
	});
});
