import {
	// capitalizeString,
	// createSelectOptions,
	// flattenArray,
	// generateRandomID,
	// truncateString,
	// getColorForFirstCharacter,
	generateQueryParams,
} from './src';

// const result1 = capitalizeString(`mo mOm`, {
// 	capitalizeEachFirst: true,
// 	capitalizeAll: true,
// });

// const result2 = truncateString(`momOm`, 3);

// const result3 = generateRandomID({ caseOption: 'upper' });

// const result4 = getColorForFirstCharacter([5, [45, 75, ['a', 2, 'd']]], 30);

// const result5 = flattenArray([5, [45, 75, ['a', { a: 2 }, 'd']]]);

// const users = [
// 	{ id: 1, name: 'Alice', city: 'Banguland' },
// 	{ id: 2, name: null, city: 'Banguland' },
// 	{ id: 3, name: undefined, city: undefined },
// 	{ id: null, name: 'Bob', city: 'Banguland' },
// ];

// const result6 = createSelectOptions(users, 'id', 'city');

const result7 = generateQueryParams({ key1: ['value1', 'value2'], key2: 42 });

console.info(result7);
