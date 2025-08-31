// import {
// 	avgByField,
// 	calculatePercentage,
// 	Chronos,
// 	chronos,
// 	Color,
// 	convertArrayToString,
// 	convertMinutesToTime,
// 	createFormData,
// 	Currency,
// 	extractUpdatedFields,
// 	flattenObjectDotNotation,
// 	flattenObjectKeyValue,
// 	groupAndSumByField,
// 	isNumericString,
// 	mergeAndFlattenObjects,
// 	mergeObjects,
// 	numberToWordsOrdinal,
// 	removeObjectFields,
// 	sanitizeData,
// 	splitArrayByProperty,
// 	sumByField,
// 	sumFieldDifference,
// } from './src';

// import { dayPartPlugin } from './src/date/plugins/dayPartPlugin';
// import { relativeTimePlugin } from './src/date/plugins/relativeTimePlugin';
// import { seasonPlugin } from './src/date/plugins/seasonPlugin';
// import { zodiacPlugin } from './src/date/plugins/zodiacPlugin';

// Chronos.use(dayPartPlugin);
// Chronos.use(seasonPlugin);
// Chronos.use(zodiacPlugin);

// // console.info(
// // 	chronos()
// // 		.timeZone('UTC+06:00')
// // 		.timeZone('IST-IN')
// // 		.timeZone('BDT')
// // 		.timeZone('UTC')
// // 		.toLocal()
// // 		.timeZone('UTC+05:30')
// // 		.timeZone('EST')
// // 		// .toLocal()
// // 		// .getUTCOffset(),
// // 		// .toUTC()
// // 		.getTimeZoneOffsetMinutes(),
// // 	// .formatUTC(),
// // 	// .format(undefined, true),
// // 	// .toISOString(),
// // );

// // console.info(chronos.utc());

// // console.info(
// // 	new Chronos('2025-05-09T13:50:26.990+05:00').format('YYYY-MM-DD HH:mm:ss'),
// // );

// // console.info(chronos.formatTimePart('12:30+05:30'));

// console.info(chronos.getDatesForDay('Saturday', { span: 2, unit: 'day' }));
// console.info(
// 	Chronos.getDatesForDay('Thursday', {
// 		format: 'utc',
// 		span: 8,
// 		unit: 'day',
// 	}),
// );

// // console.info(Chronos.getDatesForDay('Friday', { span: 7, unit: 'month' }));

// // console.info(new Color().applyOpacity(100));

// // console.info(new Chronos().timeZone('IST-IN'));

// const dbRecord = { id: 1, content: 'Hello', meta: { views: 0 } };
// const update = { content: 'Updated', meta: { views: 1 } };
// console.info(extractUpdatedFields(dbRecord, update));

// console.info(
// 	calculatePercentage({
// 		mode: 'get-change-percent',
// 		oldValue: 100,
// 		newValue: 150,
// 	}),
// );

// console.info(chronos().format('YYYY-DD-MM [at] hh:mm:ss.mssZZ', true));
// console.info(chronos().format('[Today is] ddd'));

// console.info(
// 	new Chronos().getZodiacSign({ birthDate: '01-18', preset: 'vedic' }),
// );

// chronos.use(relativeTimePlugin);

// // console.info(chronos().getRelativeDay('1992-01-18'));

// console.info(chronos().toArray());

// // const num: Exclude<
// // 	MonthDateString,
// // 	'02-30' | '02-31' | '04-31' | '06-31' | '09-31' | '11-31'
// // > = '02-28';

// // console.info(num);

// /** * Creates a tuple type of a given length with elements of type T */
// export type TupleOf<T, N extends number, R extends unknown[] = []> =
// 	R['length'] extends N ? R : TupleOf<T, N, [...R, T]>;

// type TripleNumber = TupleOf<number, 3>; // [number, number, number]

// const n: TripleNumber = [5, 6, 3];

// console.info(n);

// // type FiveStrings = TupleOf<string, 5>; // [string, string, string, string, string]

// // type EmptyTuple = TupleOf<boolean, 0>; // []
// // 📝 Notes
// // This works recursively to build a tuple of exact length N.

// // N must be a literal number, not just number. You can’t pass a general number type because recursion can't compute unbounded lengths.

// // You can use as const or mapped types when initializing values with this shape.

// // const strings = ['banana', 'apple', 'cherry'];
// // console.info(sortAnArray(strings)); // ["apple", "banana", "cherry"]

// // const numbers = [3, 1, 4, 1, 5, 9];
// // console.info(sortAnArray(numbers, { sortOrder: 'desc' })); // [9, 5, 4, 3, 1, 1]

// // interface P {
// // 	id: number;
// // 	name?: string;
// // }
// // const objects: P[] = [
// // 	{ id: 3, name: 'Banana' },
// // 	{ id: 1, name: 'Apple' },
// // 	{ id: 2, name: 'Cherry' },
// // ];
// // console.info(sortAnArray(objects, { sortByField: 'name' }));

// // const users = [
// // 	{ name: 'Alice', active: true },
// // 	{ name: 'Bob', active: false },
// // 	{ name: 'Charlie', active: true },
// // ];
// // console.info(sortAnArray(users, { sortOrder: 'asc', sortByField: 'active' }));
// // console.info(sortAnArray([data], { sortOrder: 'asc', sortByField: 'remarks' }));

// console.info(numberToWordsOrdinal('my thirteen'));

// export interface Data {
// 	folio_id: number | null;
// 	amount: { base: { number: number }; more: number[] };
// 	acc_id: number[];
// 	payment_date: Chronos;
// 	remarks?: string;
// }

// const data = {
// 	acc_id: [6],
// 	amount: { base: { number: 55 }, more: [5, 6] },
// 	folio_id: null,
// 	payment_date: new Chronos(),
// 	remarks: '666',
// };

// console.info(
// 	sanitizeData(data, { keysToIgnore: ['acc_id'], requiredKeys: [] }),
// );
// console.info(
// 	createFormData(data, {
// 		breakArray: ['acc_id'],
// 		lowerCaseKeys: ['remarks'],
// 		dotNotateNested: ['amount'],
// 		ignoreKeys: ['folio_id'],
// 		lowerCaseValues: [],
// 		requiredKeys: [],
// 		stringifyNested: [],
// 		// trimStrings: true,
// 	}),
// );

// // ! issues with trimString
// // ! add new option to ignore truthy/falsy optional

// interface User {
// 	name: string;
// 	age: Chronos;
// 	address?: { city: string; zip: Chronos };
// 	tags?: Date | string | null;
// }

// const user: User = {
// 	name: '  John Doe  ',
// 	age: new Chronos(),
// 	address: { city: '  NYC  ', zip: new Chronos() },
// 	tags: new Date(),
// };

// console.info(
// 	createFormData(user, {
// 		// trimStrings: true,
// 		// lowerCaseValues: ['address.city'],
// 	}),
// );

// const sUser = sanitizeData(user, {
// 	trimStrings: false,
// 	// keysToIgnore: ['address.zip', 'tags'],
// });

// console.info(
// 	{ sUser },
// 	sanitizeData(
// 		[
// 			{ name: ' Alice ', age: null },
// 			'  test  ',
// 			['  foo  ', null, { empty: new File([], 'file.txt') }],
// 		],
// 		{
// 			trimStrings: true,
// 			ignoreNullish: true,
// 			ignoreEmpty: true,
// 		},
// 	),
// );

// console.info(numberToWordsOrdinal(' six '));
// const usd = new Currency(100, 'USD');
// console.info(usd.currency); // "$100.00"
// console.info(usd.format('ja-JP', 'JPY')); // "￥ 100"

// const eur = usd.convertSync('EUR', 0.92);
// console.info(eur.currency);

// // (async () => {
// // 	console.info((await usd.convert('JPY')).currency); // "$100"
// // })();

// console.info(convertMinutesToTime('330'));

// // convertMinutesToTime,
// // convertMinutesToTime as convertMinutesToHourMinutes,
// // convertMinutesToTime as getHourMinutesFromMinutes,
// // convertMinutesToTime as getTimeFromMinutes,

// console.info(
// 	chronos().getDatesInRange({
// 		skipDays: [5, 4],
// 		onlyDays: [],
// 		to: '2025-06-30',
// 		// format: 'utc',
// 		roundDate: true,
// 	}),
// );

// const rUser = removeObjectFields(user, ['address', 'tags']);

// console.info(rUser);

// // console.info(getClassDetails(Chronos));

// const result12 = mergeObjects(
// 	{ a: 1, b: 2 },
// 	{ p: { c: 3 }, d: 4 },
// 	{ p: { e: 5 }, f: 6 },
// );

// console.info(result12);

// const obj3 = { a: 1, b: { x: 10 } };
// const obj4 = { b: { y: 20 }, c: 3 };
// const merged = mergeObjects(obj3, obj4);
// console.info(merged); // { a: 1, b: { x: 10, y: 20 }, c: 3 }

// const obj1 = { a: 1, b: { c: 2 } };
// const obj2 = { b: { d: 3 }, e: new Date() };
// const result = mergeAndFlattenObjects(obj1, obj2);
// // Returns { 'a': 1, 'b.c': 2, 'b.d': 3, 'e': 4 }
// const test = result['b.d'];
// console.info(test);

// const nested = {
// 	user: {
// 		details: {
// 			name: 'John',
// 			age: 30,
// 			color: new Color(),
// 			a: { b: 5, c: { date: new Chronos() } },
// 		},
// 	},
// 	money: 500,
// 	date: new Date(),
// 	taka: '55',
// };
// const flat = flattenObjectKeyValue(nested);
// // Returns { name: 'John', age: 30 }
// const test2 = flat.date.getMonth();

// console.info(test2, flat);

// const flat2 = flattenObjectDotNotation(nested);
// const test3 = flat2['user.details.a.c.date'].origin;
// const test4 = flat2['user.details.color.hsla'];

// console.info(test3, flat2, test4);

// console.info(nested['user']['details']);

// const sample = [
// 	{
// 		name: 'Thamun',
// 		isMarried: true,
// 		income: { tax: '30' },
// 		profit: 100,
// 	},
// 	{
// 		name: 'Mamun',
// 		isMarried: true,
// 		income: { tax: '30' },
// 		profit: 100,
// 	},
// 	{
// 		name: 'Thamun',
// 		isMarried: false,
// 		income: { tax: '70' },
// 		profit: 500,
// 	},
// 	{
// 		name: 'Mamun',
// 		isMarried: true,
// 		income: { tax: '30' },
// 		profit: 100,
// 	},
// 	{
// 		name: 'Hello',
// 		isMarried: false,
// 		income: { tax: '30' },
// 		profit: 100,
// 	},
// 	{
// 		name: 'Mamun',
// 		isMarried: true,
// 		income: { tax: '30', x: [1, 23] },
// 		profit: 100,
// 	},
// ];

// const diff = sumFieldDifference(sample, 'profit', 'income.tax');
// const sum = sumByField(sample, 'profit');
// const avg = avgByField(sample, 'profit');

// const group = groupAndSumByField(sample, 'isMarried', 'income.tax');

// console.info({ diff, sum, avg, group });
// console.info(group[0].true);

// const dummy = [
// 	{ name: 'Shift A', money: 101 },
// 	{ name: 'Shift B', money: 102 },
// 	{ name: 'Shift B', money: 103 },
// 	{ name: 'Shift A', money: 104 },
// 	{ name: 'Shift D', money: 105 },
// 	{ name: 'Shift A', money: 106 },
// 	{ name: false, money: 107 },
// 	{ name: 'Shift A', money: 108 },
// 	{ name: 'Shift C', money: 109 },
// 	{ name: true, money: 110 },
// 	{ name: null, money: 111 },
// 	{ name: 0, money: 112 },
// 	{ name: 'Shift D', money: 113 },
// 	{ name: undefined, money: 114 },
// ];

// const split = splitArrayByProperty(dummy, 'name');

// console.info(split, flat);

// const users = [
// 	{ id: 1, name: { first: 'Alice' }, city: 'Bangu', date: true },
// 	{ id: 4, name: { first: 'Bob' }, city: 'Banguland', date: true },
// 	{ id: 2, name: { first: 'abul' }, city: 'Banguland', date: true },
// 	{ id: 3, name: { first: 'true' }, city: 'Hell', date: true },
// ];

// console.info(convertArrayToString(users, { target: 'date', separator: ' | ' }));
// console.info(
// 	convertArrayToString(['users,', 'hello', 9], { separator: ' | ' }),
// );

// console.info(convertArrayToString([], { separator: ';' }));

// const words = [
// 	// ✅ Irregular classical plurals
// 	'appendix', // → appendices
// 	'codex', // → codices
// 	'matrix', // → matrices
// 	'index', // → indices
// 	'vertex', // → vertices

// 	// ✅ Latin/Greek classical endings
// 	'alumna', // → alumnae
// 	'alga', // → algae
// 	'vertebra', // → vertebrae
// 	'phenomenon', // → phenomena
// 	'criterion', // → criteria
// 	'prolegomenon', // → prolegomena
// 	'automaton', // → automata
// 	'stigma', // → stigmata
// 	'stoma', // → stomata
// 	'lemma', // → lemmata

// 	// ✅ -um to -a
// 	'bacterium', // → bacteria
// 	'curriculum', // → curricula
// 	'datum', // → data
// 	'millennium', // → millennia
// 	'candelabrum', // → candelabra
// 	'erratum', // → errata
// 	'ovum', // → ova
// 	'symposium', // → symposia

// 	// ✅ -us to -i
// 	'octopus', // → octopi (edge classical vs English debate)
// 	'cactus', // → cacti
// 	'fungus', // → fungi
// 	'focus', // → foci
// 	'nucleus', // → nuclei
// 	'radius', // → radii
// 	'stimulus', // → stimuli
// 	'terminus', // → termini
// 	'bacillus', // → bacilli
// 	'uterus', // → uteri (weird but valid)
// 	'locus', // → loci
// 	'stratus', // → strati

// 	// ✅ -is to -es
// 	'analysis', // → analyses
// 	'basis', // → bases
// 	'crisis', // → crises
// 	'diagnosis', // → diagnoses
// 	'parenthesis', // → parentheses
// 	'thesis', // → theses
// 	'synopsis', // → synopses
// 	'emphasis', // → emphases
// 	'neurosis', // → neuroses

// 	// ✅ -on to -a
// 	'noumenon', // → noumena
// 	'organon', // → organa
// 	'hedron', // → hedra

// 	// ✅ English irregulars
// 	'child', // → children
// 	'person', // → people
// 	'man', // → men
// 	'woman', // → women
// 	'tooth', // → teeth
// 	'foot', // → feet
// 	'goose', // → geese
// 	'mouse', // → mice
// 	'ox', // → oxen

// 	// ✅ Edge endings
// 	'quiz', // → quizzes
// 	'bus', // → buses
// 	'hero', // → heroes
// 	'potato', // → potatoes
// 	'tomato', // → tomatoes
// 	'echo', // → echoes
// 	'torpedo', // → torpedoes
// 	'veto', // → vetoes

// 	// ✅ -y to -ies
// 	'fly', // → flies
// 	'puppy', // → puppies
// 	'cherry', // → cherries

// 	// ✅ -f / -fe to -ves
// 	'leaf', // → leaves
// 	'wolf', // → wolves
// 	'knife', // → knives
// 	'life', // → lives
// 	'shelf', // → shelves
// 	'thief', // → thieves
// 	'calf', // → calves
// 	'loaf', // → loaves
// 	'elf', // → elves
// 	'half', // → halves

// 	// ✅ Exceptions that stay -s
// 	'chief', // → chiefs
// 	'roof', // → roofs
// 	'cliff', // → cliffs
// 	'belief', // → beliefs
// 	'reef', // → reefs

// 	// ✅ Already plural/uncountable
// 	'series', // → series
// 	'species', // → species
// 	'news', // → news
// 	'equipment', // → equipment
// 	'information', // → information
// ];
