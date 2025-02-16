import { shuffleArray } from '../../src';

describe('shuffleArray', () => {
	it('should return the same array if it is empty', () => {
		expect(shuffleArray([])).toEqual([]);
	});

	it('should return the same array if it contains only empty values', () => {
		const emptyValues = [null, undefined, {}, []];
		expect(shuffleArray(emptyValues)).toEqual(emptyValues);
	});

	it('should return the same array if it is not an array (isValidEmptyArray check)', () => {
		expect(shuffleArray([] as any)).toEqual([]);
		expect(shuffleArray(null as any)).toEqual(null);
		expect(shuffleArray(undefined as any)).toEqual(undefined);
		expect(shuffleArray({} as any)).toEqual({});
	});

	it('should shuffle the array but keep the same elements', () => {
		const array = [1, 2, 3, 4, 5];
		const shuffled = shuffleArray(array);
		expect(shuffled).toHaveLength(array.length);
		expect(shuffled.sort()).toEqual(array.sort()); // Elements remain the same
	});

	it('should not modify the original array', () => {
		const array = [1, 2, 3, 4, 5];
		const originalCopy = [...array];
		shuffleArray(array);
		expect(array).toEqual(originalCopy);
	});

	it('should handle arrays with different data types', () => {
		const array = [1, 'a', null, { key: 'value' }, [1, 2]];
		const shuffled = shuffleArray(array);
		expect(shuffled).toHaveLength(array.length);
		expect(
			shuffled.sort((a, b) => (String(a) > String(b) ? 1 : -1)),
		).toEqual(array.sort((a, b) => (String(a) > String(b) ? 1 : -1)));
	});
});
