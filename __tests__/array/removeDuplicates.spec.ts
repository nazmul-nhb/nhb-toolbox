import { removeDuplicatesFromArray } from '../../src';

describe('removeDuplicatesFromArray', () => {
	it('should remove duplicate numbers', () => {
		const input = [1, 2, 2, 3, 3, 3, 4];
		const result = removeDuplicatesFromArray(input);
		expect(result).toEqual([1, 2, 3, 4]);
	});

	it('should remove duplicate strings', () => {
		const input = ['apple', 'banana', 'apple', 'orange', 'banana'];
		const result = removeDuplicatesFromArray(input);
		expect(result).toEqual(['apple', 'banana', 'orange']);
	});

	it('should remove duplicate objects', () => {
		const input = [
			{ id: 1, name: 'Item A' },
			{ id: 2, name: 'Item B' },
			{ id: 1, name: 'Item A' },
		];
		const result = removeDuplicatesFromArray(input);
		expect(result).toEqual([
			{ id: 1, name: 'Item A' },
			{ id: 2, name: 'Item B' },
		]);
	});

	it('should remove duplicate nested arrays', () => {
		const input = [
			[1, 2],
			[1, 2], // duplicate sub-array
			[3, 4],
		];
		const result = removeDuplicatesFromArray(input);
		expect(result).toEqual([
			[1, 2],
			[3, 4],
		]);
	});

	it('should remove duplicate mixed array (numbers, strings, objects)', () => {
		const input = [
			1,
			'banana',
			{ id: 1, name: 'Item A' },
			1, // duplicate primitive
			{ id: 1, name: 'Item A' }, // duplicate object
		];
		const result = removeDuplicatesFromArray(input);
		expect(result).toEqual([1, 'banana', { id: 1, name: 'Item A' }]);
	});

	it('should return an empty array for an empty input array', () => {
		const input: number[] = [];
		const result = removeDuplicatesFromArray(input);
		expect(result).toEqual([]);
	});

	it('should remove duplicate deeply nested objects', () => {
		const input = [
			{ id: 1, details: { name: 'Item A', price: 10 } },
			{ id: 2, details: { name: 'Item B', price: 20 } },
			{ id: 1, details: { name: 'Item A', price: 10 } }, // duplicate nested object
		];
		const result = removeDuplicatesFromArray(input);
		expect(result).toEqual([
			{ id: 1, details: { name: 'Item A', price: 10 } },
			{ id: 2, details: { name: 'Item B', price: 20 } },
		]);
	});

	it('should handle complex data types (Date)', () => {
		const input = [
			{ id: 1, date: new Date('2022-01-01') },
			{ id: 2, date: new Date('2022-01-02') },
			{ id: 1, date: new Date('2022-01-01') }, // duplicate date object
		];
		const result = removeDuplicatesFromArray(input);
		expect(result).toEqual([
			{ id: 1, date: new Date('2022-01-01') },
			{ id: 2, date: new Date('2022-01-02') },
		]);
	});
});
