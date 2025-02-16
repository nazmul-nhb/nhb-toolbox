import { filterArrayOfObjects } from '../../src';

describe('filterArrayOfObjects', () => {
	const sampleData = [
		{ id: 1, name: 'Alice', age: 25, active: true },
		{ id: 2, name: 'Bob', age: 30, active: false },
		{ id: 3, name: 'Charlie', age: 35, active: true },
		{ id: 4, name: 'David', age: 40, active: false },
	];

	it('should filter objects based on a single condition', () => {
		const result = filterArrayOfObjects(sampleData, {
			age: (age) => age! > 30,
		});
		expect(result).toEqual([
			{ id: 3, name: 'Charlie', age: 35, active: true },
			{ id: 4, name: 'David', age: 40, active: false },
		]);
	});

	it('should filter objects based on multiple conditions', () => {
		const result = filterArrayOfObjects(sampleData, {
			age: (age) => age! > 25,
			active: (active) => active === true,
		});
		expect(result).toEqual([
			{ id: 3, name: 'Charlie', age: 35, active: true },
		]);
	});

	it('should return all objects if conditions object is empty', () => {
		const result = filterArrayOfObjects(sampleData, {});
		expect(result).toEqual(sampleData);
	});

	it('should return an empty array if no objects match the condition', () => {
		const result = filterArrayOfObjects(sampleData, {
			age: (age) => age! > 50,
		});
		expect(result).toEqual([]);
	});

	it('should handle missing properties in objects', () => {
		const mixedData = [
			{ id: 1, name: 'Alice', age: 25 },
			{ id: 2, name: 'Bob' }, // Missing age
		];
		const result = filterArrayOfObjects(mixedData, {
			age: (age) => (age ?? 0) > 20,
		});
		expect(result).toEqual([{ id: 1, name: 'Alice', age: 25 }]);
	});

	it('should throw an error if input is not an array', () => {
		// @ts-expect-error Intentional wrong input for test
		expect(() => filterArrayOfObjects(null, {})).toThrow(
			'The provided input is not a valid array!',
		);
	});
});
