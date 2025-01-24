import {
	sanitizeData,
	// filterArrayOfObjects,
	// trimString,
	// createOptionsArray,
	// sortAnArray,
	// convertToDecimal,
	// cloneObject,
	// isDeepEqual,
	// mergeObjects,
	// flattenObject,
	// isEmptyObject,
	// countObjectFields,
	// mergeAndFlattenObjects,
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

// const result6 = createOptionsArray(users, {
// 	firstFieldKey: 'id',
// 	secondFieldKey: 'city',
// 	// firstFieldName: 'abul',
// 	// secondFieldName: 'babul',
// });

// const result7 = generateQueryParams({ key1: ['value1', 'value2'], key2: 42 });

// const result8 = generateRandomColor();

// const hslColor = 'hsl(120, 50%, 60%)';
// const rgbColor = 'rgb(60, 150, 60)';
// const hexColor = '#3c963c';

// HSL to RGB
// const rgbFromHsl = convertHslToRgb(120, 50, 60);
// console.info({ rgbFromHsl }); // rgb(60, 150, 60)

// // RGB to HSL
// const hslFromRgb = convertRgbToHsl(60, 150, 60);
// console.info({ hslFromRgb }); // hsl(120, 50%, 60%)

// // HSL to Hex
// const hexFromHsl = convertHslToHex(120, 50, 60);
// console.info({ hexFromHsl }); // #3C963C

// // Hex to HSL
// const hslFromHex = convertHexToHsl(hexColor);
// console.info({ hslFromHex }); // hsl(120, 50%, 60%)

// // RGB to Hex
// const hexFromRgb = convertRgbToHex(60, 150, 60);
// console.info({ hexFromRgb }); // #3C963C

// // Hex to RGB
// const rgbFromHex = convertHexToRgb(hexColor);
// console.info({ rgbFromHex }); // rgb(60, 150, 60)

// const result9 = getRandomNumber({ min: 20, max: 10 });

// const result10 = convertToDecimal(8, { decimalPlaces: 4, isString: true });

// // Arrays
// console.info(deepEqual([1, 2, 3], [1, 2, 3])); // true
// console.info(deepEqual([1, 2, 3], [3, 2, 1])); // false

// // Objects
// console.info(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })); // true
// console.info(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })); // true
// console.info(deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })); // false

// // Primitive values
// console.info(deepEqual(5, 5)); // true
// console.info(deepEqual('hello', 'world')); // false

// const result11 = deepClone({ a: 1, b: 2 },);

// const result12 = mergeObjects(
// 	{ a: 1, b: 2 },
// 	{ p: { c: 3 }, d: 4 },
// 	{ e: 5, f: 6 },
// );

// const result14 = isEmptyObject({a:1});
// const result15 = countObjectFields({ p: { c: 3 }, d: 4 });

// const obj1 = {
// 	user: {
// 		name: 'Nazmul',
// 		location: { city: 'Sirajganj', country: 'Bangladesh' },
// 	},
// 	role: 'Developer',
// };

// const obj2 = {
// 	user: {
// 		name: 'Nazmul',
// 	},
// 	role: 'Teacher',
// };

// const result13 = flattenObject(obj1);

// const flattened = mergeAndFlattenObjects(obj1, obj2);

// const strings = ['banana', 'apple', 'cherry'];
// console.info(sortAnArray(strings)); // ["apple", "banana", "cherry"]

// const numbers = [3, 1, 4, 1, 5, 9];
// console.info(sortAnArray(numbers, { sortOrder: 'desc' })); // [9, 5, 4, 3, 1, 1]

// const objects = [
// 	{ id: 3, name: 'Banana' },
// 	{ id: 1, name: 'Apple' },
// 	{ id: 2, name: 'Cherry' },
// ];
// console.info(sortAnArray(objects, { sortByField: 'name' }));

// const users = [
// 	{ name: 'Alice', active: true },
// 	{ name: 'Bob', active: false },
// 	{ name: 'Charlie', active: true },
// ];
// console.info(sortAnArray(users, { sortOrder: 'asc', sortByField: 'active' }));

const data = [
	{ id: 1, name: 'Alice', isActive: true },
	{ id: 2, name: 'Bob', isActive: false },
	{ id: 3, name: 'Charlie     ', isActive: undefined },
	{ id: 3, name: 'Charlie     ', mamu: undefined },
];

// // Filter objects where `isActive` is true
// const activeUsers = filterArrayOfObjects(data, { isActive: (v) => !v });
// console.info(activeUsers);
// // Output: [{ id: 2, name: 'Bob', isActive: false }]

// // Filter objects where `name` starts with 'A'
// const namesStartingWithA = filterArrayOfObjects(data, {
// 	name: (v) => v.startsWith('A'),
// });
// console.info(namesStartingWithA);
// Output: [{ id: 1, name: 'Alice', isActive: true }]

// const result14 = trimString([' Hello  World!  ', 'mellow world']);

const result15 = sanitizeData({
	id: 3,
	name: 'Charlie     ',
	isActive: { money: 200, office: 'Dhaka ', mama: { hama: 'k  ' } },
});

const result16 = sanitizeData(data);

console.info({ result15: JSON.stringify(result15), result16 });
