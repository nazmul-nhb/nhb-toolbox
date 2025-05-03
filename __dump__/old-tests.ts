// const result1 = capitalizeString(`mo mOm`, {
// 	capitalizeEachFirst: true,
// 	capitalizeAll: true,
// });

// const result2 = truncateString(`momOm`, 3);

// const result3 = generateRandomID({ caseOption: 'upper' });

// const result4 = getColorForFirstCharacter([5, [45, 75, ['a', 2, 'd']]], 30);

// const result5 = flattenArray([5, [45, 75, ['a', { a: 2 }, 'd']]]);

// const users = [
// 	{ id: 1, NaME: { firST: 'Alice', sec: 2 }, city: { a: null } },
// 	{ id: 4, name: { first: 'Bob' }, city: 'Banguland' },
// 	{ id: 2, NAME: { first: 'abul' }, city: 'Banguland' },
// 	{ id: 3, name: { first: 'true' }, city: 'Hell' },
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

// console.info(result6);

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

// const result13 = flattenObjectDotNotation(obj1);

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

// const hex = convertHslToHex(..._extractSolidColorValues(hsl));

// const colors = convertColorCode(hsl);

// console.info(hsl, hex, colors, generateRandomColorInHexRGB());

// console.info(truncateString('abh', 2));

// console.info(generateRandomID({ caseOption: 'upper' }));

// console.info(convertToDecimal(2));

// console.info(
// 	getNumbersInRange('prime', {
// 		getAs: 'array',
// 		min: -55,
// 		max: 7,
// 		multiples: 2,
// 	}),
// );

// console.info(convertStringCase('i want my labour*back', 'camelCase'));
// const test5 = [
// 	[1, 2, [3, 4]],
// 	[1, 2, [3, 4]],
// 	[2, 3, [4, 5]],
// ];
// console.info(removeDuplicatesFromArray(test5)); // Expected: [[1, 2, [3, 4]], [2, 3, [4, 5]]]

// const test6 = [
// 	{ id: 1, name: 'John' },
// 	{ id: 1, name: 'John' },
// 	{ id: 2, name: 'Jane' },
// ];
// const r6 = removeDuplicatesFromArray(test6);
// console.info(r6); // Expected: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]

// const color = new Color('#3c694544').applyOpacity(50);

// console.info(color);
// generateQueryParams({ filters: { category: 'laptop', price: [1,2,3] } });

// console.info(
// 	generateQueryParams({
// 		filters: { category: 'laptop elo', price: [1, 2, 3] },
// 	}),
// );

// const res = replaceAllInString('abul Hassan', 'a', 'o');
// console.info(replaceAllInString('test 123 test', /\d/, '*'));

// const debounced = debounceAction((string: string) => {
// 	return string?.toLocaleLowerCase();
// }, 1000);

// const throttled = throttleAction((string: string) => {
// 	return string?.toLocaleLowerCase();
// }, 1000);

// const resultd = debounced('Hello');
// const resultt = throttled('Hello');

// console.info(resultd);
// console.info(resultt);

// console.info(res);

// console.info(calculateHCF(60, 12, 6, -18, 24));
// console.info(calculateHCF(-18, 6));
// console.info(calculateLCM(4, 5, 6, 8));
// console.info(calculateLCM(0));
// console.info(calculateLCM(-7, 14));

// console.info(isEven(33));
// console.info(isOdd(0));
// console.info(isEven(0));
// console.info(isOdd(32));

// console.info(getNumbersInRange('even', { max: 105, min: 77 }));

// console.info(convertStringCase('"lmlkmLKMLKJDOI:WJF:nck"', 'camelCase'));

// const r = convertToDecimal('6.35465', { isString: true, decimalPlaces: 20 });

// console.info(truncateString(r, 5));

// const users2 = [
// 	{ id: 1, name: 'Alice', details: { age: 30, score: 95 } },
// 	{ id: 3, name: 'Charlie', details: { age: 35, score: 92 } },
// 	{ id: 2, name: 'Bob', details: { age: 25, score: 88 } },
// ];

// Sort by a nested field
// const sortedByAge = sortAnArray(users2, {
// 	sortByField: 'id',
// 	sortOrder: 'desc',
// });

// console.info(sortedByAge);
// console.info(users2);

// const r = convertStringCase('6money chai', 'kebab-case');

// console.info(r);

// interface User {
// 	id: number;
// 	file: File | null;
// 	name: {
// 		first: string;
// 		second: number[];
// 		third?: string;
// 		lo: Record<string, unknown>;
// 	};
// 	city: object;
// 	man: boolean;
// 	money: string;
// }

// const r2 = createControlledFormData(user);
// console.info(Object.fromEntries(r2.entries()));

// isValidEmptyArray(user);

// const r3 = sanitizeData("5");

// const r4 = extractUpdatedFields(user, user);
// const id = Symbol('user_id');
// console.info(id); // Symbol(user_id)

// console.info(isSymbol(6));

// const user2 = {
// 	name: 'John',
// 	[Symbol('id')]: 1234, // Symbol as a key
// };

// console.info(user2.name); // ✅ "John"
// console.info(user2['id']); // ❌ undefined (not accessible like normal keys)
// console.info(Object.keys(user2)); // ✅ ["name"], does NOT show symbols

// const c = convertColorCode('#FFF122' as Hex8).hsla;

// console.info(c);

// convertHex8ToRgba('#fddgdfg' as Hex8);

// const c2 = new Colour().applyOpacity(50).hex8;

// console.info(c2);

// const sl = getNumbersInRange('any', { multiplesOf: 46, max: 5000 });

// formatCurrency('555');

// console.info(sl);

// const l = createControlledFormData(user, {
// 	requiredKeys: ['name.lo.n.boo'],
// 	dotNotateNested: [],
// });

// console.info(isDateString('12:25'));

// const arr = [true, false, false, true, true];

// console.info(sortAnArray(arr, { sortOrder: 'desc' }));

// const color = new Color();

// console.info(color);

// console.info(new Date('2025'));

// console.info(chronos().toArray());
// console.info(Chronos.utc(new Date()).add(33, 'month').clone());

// const abul = {
// 	name: 'Abul',
// 	age: 36,
// 	school: 'N/A',
// };

// console.info(
// 	remapFields<typeof abul, { honey: string; money: number }>(abul, {
// 		honey: 'school',
// 		money: 'name',
// 	}),
// );

// const fruits = ['Banana', 'apple', 'Cherry', 'apple10', 'apple2'];
// const sortedFruitsAsc = sortAnArray(fruits); // Default ascending
// const sortedFruitsDesc = sortAnArray(fruits, { sortOrder: 'desc' });

// console.info('ASC:', sortedFruitsAsc);
// console.info('DESC:', sortedFruitsDesc);

// const users = [
// 	{ name: 'John', age: 30 },
// 	{ name: 'alice', age: 25 },
// 	{ name: 'Bob', age: 40 },
// 	{ name: 'bob', age: 20 },
// 	{ name: 'Alice', age: 22 },
// ];

// const sortedUsersByNameAsc = sortAnArray(users, {
// 	sortByField: 'name',
// 	sortOrder: 'asc',
// });

// const sortedUsersByNameDesc = sortAnArray(users, {
// 	sortByField: 'name',
// 	sortOrder: 'desc',
// });

// console.info('Sorted by name ASC:', sortedUsersByNameAsc);
// console.info('Sorted by name DESC:', sortedUsersByNameDesc);

// console.info(chronos().formatStrict('ddd, mmmm Do yy, hh:mm:ss A'));
// console.info(getOrdinal('507'));

// console.info(
// 	chronos().timeZone('IST-IN').formatStrict('yyyy/MM/DD; hh:mm:ss A'),
// );

// console.info(Chronos.utc(2025));
// const d = chronos().toLocalISOString();
// const c = chronos();
// console.info(d.split(c));
// console.info(c, d);

// const a = { a: 1, b: 'halum', c: true };

// const fd = createFormData({ a: { l: 1, x: [5] }, b: 'halum', c: true });

// const qs = formatQueryParams({ a: { l: 1, x: [5] }, b: 'halum', c: true });

// const pdf = parseFormData(fd);
// const pdq = parseFormData(qs, false);

// console.info(pickObjectFieldsByCondition(a, (_b, d) => typeof d === 'boolean'));
// console.info(parseStringifiedValues(pdf));
// const obj = { name: 'John', age: 30, city: 'New York' };
// const picked = pickObjectFieldsByCondition(obj, (key) => key === 'city');
// { name: 'John', city: 'New York' }
// console.info(picked);

// console.info(chronos().round('week', 16));
// console.info(getAverageOfNumbers(1, 2, 3, 4, 5, 6, '8'));
// console.info(
// 	calculatePercentage({ mode: 'get-percent', part: 20, total: 393 }),
// );
// console.info(
// 	calculatePercentage({
// 		mode: 'get-original',
// 		percentage: 90,
// 		value: 100000,
// 	}),
// );
// console.info(
// 	calculatePercentage({ mode: 'get-value', percentage: 0, total: 111111 }),
// );

// console.dir(getClassDetails(Chronos).instanceNames.toString());

// console.info(
// 	calculatePercentage({
// 		mode: 'apply-percent-change',
// 		baseValue: 20,
// 		percentage: 25,
// 	}),
// );

// console.info(chronos().isBusinessHour());
// console.info(getClassDetails(Color));

// const samples: unknown[][] = [
// 	// Primitives
// 	[1, 2, 3, 2, 4, 1], // → [1, 2]

// 	// Strings
// 	['a', 'b', 'a', 'c', 'b'], // → ['a', 'b']

// 	// Nested arrays
// 	[[1, 2], [3, 4], [1, 2], [5]], // → [[1, 2]]

// 	// Nested objects
// 	[
// 		{ a: 1, b: 2 },
// 		{ a: 1, b: 2 },
// 		{ a: 1, b: 3 },
// 		{ a: 1, b: 3 },
// 		{ a: 2, b: 4 },
// 	], // → [{ a: 1, b: 2 }, { a: 1, b: 3 }]

// 	// Mixed types
// 	[1, 'a', [1, 2], { x: 1 }, [1, 2], { x: 1 }, 1], // → [[1, 2], { x: 1 }, 1]

// 	// Deep nesting
// 	[{ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }, { a: [1, { b: 3 }] }], // → [{ a: [1, { b: 2 }] }]
// ];

// // Run and info results
// samples.forEach((input, idx) => {
// 	console.info(`Test ${idx + 1}:`, JSON.stringify(getDuplicates(input)));
// });

// const arr1 = [1, 2, { x: 3 }, [4, 5]];
// const arr2 = [{ x: 3 }, [4, 5], 6];

// console.info(findMissingElements(arr1, arr2, 'from-first'));
// // → [1, 2]

// console.info(findMissingElements(arr1, arr2, 'from-second'));
// // → [6]

// console.info(
// 	wordCount('hello world!'), // 2
// 	wordCount('আমি বাংলায় গান গাই sdlkl 5865&^$^ *$&^ fslljsli'), // 4
// 	wordCount("C'est la vie."), // 3
// 	wordCount('你好，世界'), // 2
// 	wordCount('مرحبا بالعالم'), // 2
// );

// const c = new Color('#25D3BC');
// console.info(c.blendWith('#2593D3', 0.1));
// #25B3C8
// #2599D1
// #25B9C5 #25CDBE
// {
//   hex: '#D32593',
//   hex8: '#25D3BC',
//   rgb: 'rgb(130, 149, 127)',
//   rgba: 'rgba(130, 149, 127, 1)',
//   hsl: 'hsl(112, 9.4%, 54.12%)',
//   hsla: 'hsla(112, 9.4%, 54.12%, 1)'
// }
// ['#25D3BC', '#25D365', '#2593D3'];

// console.info(parseQueryString('?a=1&a=2&b=true&c=hello&d=10'));

// const data = [
// 	{ id: 1, name: 'Alice', isActive: true },
// 	{ id: 2, name: 'Bob', isActive: false },
// 	{ id: 3, name: 'Charlie     ', isActive: undefined },
// 	{ id: 3, name: 'Charlie     ', mamu: { mama: 1 } },
// ];

// const result15 = sanitizeData(
// 	{
// 		id: 0,
// 		name: 'Charlie     ',
// 		isActive: [
// 			{
// 				money: false,
// 				office: [],
// 				mama: { hama: 'k  ', kaka: 0 },
// 			},
// 		],
// 	},
// 	{ ignoreFalsy: true },
// );

// const result16 = sanitizeData(data, {
// 	ignoreNullish: true,
// 	keysToIgnore: ['name'],
// 	ignoreFalsy: true,
// });

// const result17 = sanitizeData({ name: 'uuu' }, { keysToIgnore: ['name'] });
// const result18 = sanitizeData(['kj   dada     ']);

// const testArray = [
// 	{
// 		name: '  Alice  ',
// 		hobbies: [' Reading', 'Gaming ', [' Hiking ', '']],
// 		social: {
// 			twitter: [],
// 			links: [{ type: 'github', url: ' github.com/alice ' }, {}],
// 		},
// 	},
// 	{
// 		name: '  Bob ',
// 		hobbies: [' ', null, false, ['Coding', null]],
// 		social: {
// 			twitter: null,
// 			links: [],
// 		},
// 	},
// 	'  plain string  ',
// 	['  nested string  ', [' another ', undefined]],
// ];

// const testObject = {
// 	user: {
// 		firstName: '  Charlie ',
// 		lastName: '  Smith ',
// 		addresses: [
// 			{
// 				street: ' 123 Main St ',
// 				city: '  New York ',
// 				tags: ['  home ', '  primary ', null],
// 			},
// 			{
// 				street: '',
// 				city: null,
// 				tags: [],
// 			},
// 		],
// 	},
// 	meta: {
// 		active: true,
// 		roles: [],
// 		nested: {
// 			info: {
// 				notes: ['   ', ' Note 1  '],
// 			},
// 		},
// 	},
// 	extra: null,
// };

// const r = sanitizeData(testArray, {
// 	ignoreFalsy: true,
// 	ignoreEmpty: true,
// 	// requiredKeys: ['social.twitter'],
// });

// console.info(JSON.stringify(r));

// const b = sanitizeData(testObject, {
// 	ignoreFalsy: true,
// 	ignoreEmpty: true,
// 	requiredKeys: ['meta.roles'],
// });

// console.info(JSON.stringify(b));

// const c = new Color('#25CDBE');
// console.info(c.blendWith('#BF25CD'));
// Color {
//   hex: '#7279C6',
//   hex8: '#7279C6FF',
//   rgb: 'rgb(114, 121, 198)',
//   rgba: 'rgba(114, 121, 198, 1)',
//   hsl: 'hsl(235, 42.42%, 61.18%)',
//   hsla: 'hsla(235, 42.42%, 61.18%, 1)'
// }
// Color {
//   hex: '#93C955',
//   hex8: '#93C955B3',
//   rgb: 'rgb(147, 201, 85)',
//   rgba: 'rgba(147, 201, 85, 0.7)',
//   hsl: 'hsl(88, 51.79%, 56.08%)',
//   hsla: 'hsla(88, 51.79%, 56.08%, 0.7)'
// }
// Color {
//   hex: '#72C679',
//   hex8: '#72C679FF',
//   rgb: 'rgb(114, 198, 121)',
//   rgba: 'rgba(114, 198, 121, 1)',
//   hsl: 'hsl(125, 42.42%, 61.18%)',
//   hsla: 'hsla(125, 42.42%, 61.18%, 1)'
// }

// console.info(countWordsInString('I love ১২'));

// (async () => {
// 	const price1 = new Currency(100, 'USD');
// 	const value1 = await price1.convert('INR');
// 	// const price2 = new Currency(205, 'AUD');
// 	// const value2 = await price2.convert('EUR');
// 	console.info(value1);
// })();

// const u = new Unit(1600, 'kb');

// console.info(u.toString());
// console.info(u.convert('kbToMb'));
// console.info(getStaticMethodsCount(Unit));
// console.info(Unit.convertByPrefix(777, 'k', 'G'));
// console.info(Unit.convertFromTo(7500, 'kb', 'b'));

// console.info(new Color('white').applyDarkness(50));
// Color {
//   hex: '#808080',
//   hex8: '#808080FF',
//   rgb: 'rgb(128, 128, 128)',
//   rgba: 'rgba(128, 128, 128, 1)',
//   hsl: 'hsl(0, 0%, 50%)',
//   hsla: 'hsla(0, 0%, 50%, 1)'
// }

// console.info(Object.keys(CSS_COLORS).length);

// type User = {
// 	id: number[];
// 	username: string;
// 	email: string;
// };

// const users: User[] = [
// 	{ id: [1], username: 'alice', email: 'alice@example.com' },
// 	{ id: [2], username: 'bob', email: 'bob@example.com' },
// 	{ id: [3], username: 'ALICE', email: 'alice@another.com' },
// 	{ id: [4], username: 'charlie', email: 'charlie@example.com' },
// ];

// const sss = ['s', 's', 'ppp'];

// const f = new Finder(sss);

// console.info(f.findOne('p', '2'));

// const finder = new Finder(users);

// // 🔍 findAll by username (case-insensitive match)
// const allAlice = finder.findAll('alice', 'username');
// console.info('findAll alice:', allAlice);

// // 🔍 findAll (force binary search)
// const binarySearchResult = finder.findAll('bob', 'username', {
// 	forceBinary: true,
// });
// console.info('binary search:', binarySearchResult);

// // 🔍 findAll (fuzzy search)
// const fuzzyMatch = finder.findAll('ali', 'username', { fuzzy: true });
// console.info('fuzzy findAll (ali):', fuzzyMatch);

// // 🔍 findOne match (case-insensitive)
// const oneUser = finder.findOne('charlie', 'username');
// console.info('findOne charlie:', oneUser);

// // 🔍 findOne (fuzzy)
// const fuzzyOne = finder.findOne('chr', 'username', { fuzzy: true });
// console.info('fuzzy findOne chr:', fuzzyOne);

// 🔍 async findAllAsync
// const allAsync = await finder.findAllAsync(
// 	async () => users,
// 	'bob',
// 	(user) => user.username,
// );
// console.info('findAllAsync bob:', allAsync);

// 🔍 async findOneAsync
// const oneAsync = await finder.findOneAsync(
// 	async () => users,
// 	'alice',
// 	(user) => user.username,
// );
// console.info('findOneAsync alice:', oneAsync);

// 🔍 binarySearch (manually sorted input)
// const sortedUsers = [...users].sort((a, b) =>
// 	a.username.localeCompare(b.username),
// );
// const binaryDirect = finder.binarySearch(
// 	sortedUsers,
// 	'charlie',
// 	(u) => u.username,
// 	true,
// );
// console.info('manual binarySearch charlie:', binaryDirect);

// // 🔍 fuzzySearch manual
// const fuzzyDirect = finder.fuzzySearch(users, 'ae', (u) => u.username, true);
// console.info('manual fuzzySearch ae:', fuzzyDirect);

// // 🔄 clear specific cache (noop since we didn’t use cacheKey above)
// finder.clearCache('some-key');

// // 🔄 clear all cache
// finder.clearCache();
// console.info(getClassDetails(Chronos));

// const paginate = new Paginator({ totalItems: 1000, currentPage: 50 });
// console.info(paginate.pageList({ siblingCount: 5 }));

// new Chronos().timeZone('UTC');

// const str1 = '{"name":"Alice","age":"30"}';
// const str2 = '["true", "false", "42"]';
// const str3 = '5';

// console.info(parseJSON<Record<string, string | number>>(str1)); // ✅ parses stringified object
// console.info(parseJSON(str2)); // ✅ parses array
// console.info(parseJSON(str3)); // ✅ parses string

// console.info(parseJsonToObject(str1)); // ✅ returns { name: 'Alice', age: 30 }
// console.info(parseJsonToObject(str2)); // ❌ returns {} (not an object)
// console.info(parseJsonToObject(str3)); // ❌ returns {} (not an object)
// console.info(parseObjectValues({ name: 'Alice', age: '30' }));

// console.info(getClassDetails(Chronos));
// console.info(new Chronos('2025-05-02 00:00:00').formatStrict());
// console.info(chronos().timeZone('GMT').duration('2025-05-02').days);

// // console.info(numberToWords(10e20));

// console.info(roundToNearest('42.3', 0.5));
// const user = {
// 	userId: 123,
// 	fullName: 'John Doe',
// 	emailAddress: 'john@example.com',
// 	isMarried: true,
// };

// const mappedUser = remapFields(user, {
// 	id: 'userId',
// 	name: 'fullName',
// 	email: 'emailAddress',
// });

// console.info(mappedUser);
// // Returns { id: 123, name: 'John Doe', email: 'john@example.com' }
// const a = sanitizeData(user, { keysToIgnore: ['emailAddress'] });

// console.info(a);
