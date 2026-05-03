import { createOptionsArray } from '../../src';

describe('createOptionsArray', () => {
	// it('should return an empty array when input data is empty', () => {
	// 	const result = createOptionsArray([], {
	// 		// @ts-expect-error
	// 		firstFieldKey: 'id',
	// 		// @ts-expect-error
	// 		secondFieldKey: 'name',
	// 	});
	// 	expect(result).toEqual([]);
	// });

	it('should map default value and label keys when no renaming is provided', () => {
		const data = [
			{ id: 1, name: 'Item A' },
			{ id: 2, name: 'Item B' },
		];

		const result = createOptionsArray(data, {
			firstFieldKey: 'id',
			secondFieldKey: 'name',
		});

		expect(result).toEqual([
			{ value: '1', label: 'Item A' },
			{ value: '2', label: 'Item B' },
		]);
	});

	it('should map with custom field names when specified', () => {
		const data = [
			{ id: 101, name: 'Alpha' },
			{ id: 102, name: 'Beta' },
		];

		const result = createOptionsArray(data, {
			firstFieldKey: 'id',
			secondFieldKey: 'name',
			firstFieldName: 'key',
			secondFieldName: 'text',
		});

		expect(result).toEqual([
			{ key: '101', text: 'Alpha' },
			{ key: '102', text: 'Beta' },
		]);
	});

	it('should handle missing object fields gracefully', () => {
		const data = [{ id: 1 }, { name: 'Only Name' }, {}];

		const result = createOptionsArray(data, {
			firstFieldKey: 'id',
			secondFieldKey: 'name',
		});

		expect(result).toEqual([
			{ value: '1', label: '' },
			{ value: '', label: 'Only Name' },
			{ value: '', label: '' },
		]);
	});

	it('should convert non-string values to strings', () => {
		const data = [
			{ id: 123, name: 'Item X' },
			{ id: true, name: false },
		];

		const result = createOptionsArray(data, {
			firstFieldKey: 'id',
			secondFieldKey: 'name',
		});

		expect(result).toEqual([
			{ value: '123', label: 'Item X' },
			{ value: 'true', label: 'false' },
		]);
	});
});
