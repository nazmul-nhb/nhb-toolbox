import { getNumbersInRange } from './src';

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
// 	{ id: 3, name: true, city: undefined },
// 	{ id: null, name: 'Bob', city: 'Banguland' },
// ];

// const sanitized = convertObjectValues(users, {
// 	keys: ['city'],
// 	convertTo: 'number',
// });

// console.info({ users, sanitized });

// const result6 = createOptionsArray(users, {
// 	firstFieldKey: 'id',
// 	secondFieldKey: 'city',
// 	// firstFieldName: 'abul',
// 	// secondFieldName: 'babul',
// });

// const result7 = generateQueryParams({ key1: ['value1', 'value2'], key2: 42 });

// const result8 = generateRandomColor();

// // * HSL to RGB
// // const hslColor = 'hsl(125, 22%, 33%)';
// const rgbFromHsl = convertHslToRgb(125, 22, 33);
// console.info({ rgbFromHsl }); // rgb(66, 103, 69)

// // ! RGB to HSL
// // const rgbColor = 'rgb(66, 103, 69)';
// const hslFromRgb = convertRgbToHsl(66, 103, 69);
// console.info({ hslFromRgb }); // expected: hsl(125, 21.90%, 33.10%) got: hsl(125, 21.89%, 33.14%)

// // ! HSL to Hex
// // const hsl = 'hsl(125, 50%, 60%)';
// const hexFromHsl = convertHslToHex(125, 50, 60);
// console.info({ hexFromHsl }); // expected: #66cc6e got: #66CC6F

// // ! Hex to HSL
// const hexColor = '#3c963c';
// const hslFromHex = convertHexToHsl(hexColor);
// console.info({ hslFromHex }); // expected: hsl(120, 42.90%, 41.20%) got: hsl(120, 42.86%, 41.18%)

// // * RGB to Hex
// // const rgbColor = 'rgb(66, 103, 69)';
// // const rgbColor = 'rgb(60, 105, 69)';
// const hexFromRgb1 = convertRgbToHex(66, 103, 69);
// const hexFromRgb2 = convertRgbToHex(60, 105, 69);
// console.info({ hexFromRgb1, hexFromRgb2 }); // #426745 & #3c6945

// // * Hex to RGB
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

// const data = [
// 	{ id: 1, name: 'Alice', isActive: true },
// 	{ id: 2, name: 'Bob', isActive: false },
// 	{ id: 3, name: 'Charlie     ', isActive: undefined },
// 	{ id: 3, name: 'Charlie     ', mamu: { mama: 1 } },
// ];

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

// const result15 = sanitizeData(
// 	{
// 		id: 3,
// 		name: 'Charlie     ',
// 		isActive: {
// 			money: '200',
// 			office: 'Dhaka ',
// 			mama: { hama: 'k  ', kaka: 75 },
// 		},
// 	},
// );

// const result16 = sanitizeData(data, {
// 	ignoreNullish: true,
// 	keysToIgnore: ['mamu.mama'],
// });

// const result17 = sanitizeData({ name: 'uuu' }, { keysToIgnore: ['name'] });
// const result18 = sanitizeData(['kj   dada     ']);

// console.info(
// 	// result17,
// 	// result16,
// 	// result18,
// 	result15);

// console.info(isEmptyObject({ a: 2 }));

// const res1 = generateQueryParams({ key1: 'value1', key2: 42 });
// // Output: "?key1=value1&key2=42"

// const res2 = generateQueryParams({ key1: ['value1', 'value2'], key2: 42 });
// // Output: "?key1=value1&key1=value2&key2=42"

// const res3 = generateQueryParams({ key1: '   6', key2: null, key3: 'valid   ' });
// // Output: "?key3=valid"

// const res4 = generateQueryParams({
// 	key1: null,
// 	key2: '',
// });
// // Output: ""

// console.info({ res1, res2, res3, res4 });

// console.info(generateAnagrams('listen', 800).length);

// console.info(isPrime(19));
// console.info(findPrimeNumbers(37, 79));

// const baseObject = {
// 	name: 'John Doe',
// 	age: 30,
// 	country: 'USA',
// 	address: {
// 		city: 'New York',
// 		zip: 10001,
// 	},
// };

// const updatedObject = {
// 	name: 'John Doe',
// 	age: 31, // Changed
// 	country: 'USA',
// 	profession: 'Software Engineer', // New key
// 	address: {
// 		city: 'Nevada', // Changed inside nested object
// 		zip: 1002, // Changed inside nested object
// 		hola: 'moo',
// 	},
// 	manush: { man: 'mortal', ii: { boom: true } },
// };

// // Test extractUpdatedFields
// console.info(extractUpdatedFields(baseObject, updatedObject));
// // Expected Output: { age: 31, address: { city: 'Nevada', zip: 1002 } }

// // Test extractNewFields
// console.info(extractNewFields(baseObject, updatedObject));
// // Expected Output:
// // {
// //   profession: 'Software Engineer',
// //   address: { hola: 'moo' },
// //   manush: { man: 'mortal', ii: { boom: true } }
// // }

// // Test extractUpdatedAndNewFields
// console.info(extractUpdatedAndNewFields(baseObject, updatedObject));
// // Expected Output:
// // {
// //   age: 31,
// //   address: { city: 'Nevada', zip: 1002, hola: 'moo' },
// //   profession: 'Software Engineer',
// //   manush: { man: 'mortal', ii: { boom: true } }
// // }

// const hsl = generateRandomHSLColor();

// const hex = convertHslToHex(...extractNumbersFromColor(hsl));

// const colors = convertColorCode(hsl);

// console.info(hsl, hex, colors, generateRandomColorInHexRGB());

// console.info(truncateString('abh', 2));

// console.info(generateRandomID({ caseOption: 'upper' }));

// console.info(convertToDecimal(2));

console.info(
	getNumbersInRange('prime', {
		getAs: 'array',
		min: -55,
		max: 7,
		multiples: 2,
	}),
);
