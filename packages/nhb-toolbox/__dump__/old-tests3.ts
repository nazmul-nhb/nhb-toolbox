// import {
// 	Chronos,
// 	chronos,
// 	Color,
// 	convertStringCase,
// 	flattenObjectDotNotation,
// 	flattenObjectKeyValue,
// 	getColorForInitial,
// 	numberToWords,
// 	numberToWordsOrdinal,
// 	pluralizer,
// 	wordsToNumber,
// } from './src';

// import { businessPlugin } from './src/date/plugins/businessPlugin';
// import { dayPartPlugin } from './src/date/plugins/dayPartPlugin';
// import { fromNowPlugin } from './src/date/plugins/fromNowPlugin';
// import { palindromePlugin } from './src/date/plugins/palindromePlugin';
// import { relativeTimePlugin } from './src/date/plugins/relativeTimePlugin';
// import { seasonPlugin } from './src/date/plugins/seasonPlugin';
// import { timeZonePlugin } from './src/date/plugins/timeZonePlugin';
// import { zodiacPlugin } from './src/date/plugins/zodiacPlugin';
// import { HTTP_STATUS_CODES } from './src/http-status/constants';
// import { HttpStatus } from './src/http-status/HttpStatus';
// import type { Branded } from './src/types/index';
// import { LogStyler, Stylog } from './src/utils/stylog';
// import type { DeepPartial } from './src/utils/types';

// Chronos.use(timeZonePlugin);
// Chronos.use(zodiacPlugin);
// Chronos.use(dayPartPlugin);
// Chronos.use(seasonPlugin);
// Chronos.use(relativeTimePlugin);
// Chronos.use(businessPlugin);
// Chronos.use(fromNowPlugin);
// Chronos.use(palindromePlugin);

// const words = [
// 	// ✅ Irregular classical plurals
// 	'appendix', // → appendices
// 	'codex', // → codices
// 	'matrix', // → matrices
// 	'index', // → indices
// 	'vertex', // → vertices
// ];

// for (const word of words) {
// 	const plural = pluralizer.toPlural(word);
// 	const back = pluralizer.toSingular(plural);
// 	console.info(
// 		`${word} -> ${plural}: ${pluralizer.isPlural(plural)} -> ${back}: ${pluralizer.isSingular(back)}`
// 	);
// }

// console.info(pluralizer.toPlural('people'));
// console.info(pluralizer.isPlural('blood'));
// console.info(pluralizer.toSingular('persons'));

// chronos().timeZone('ACDT');
// console.info(chronos().timeZone('UTC+06:00').getTimeZoneNameShort());
// console.info(chronos().getTimeZoneName());

// console.info(new Chronos().toDate().getTime() === new Date().getTime());

// console.info(numberToWordsOrdinal('hello twenty-three'));

// console.table(new Chronos().toObject());

// // for (const c of new Chronos()) {
// // 	console.info(c);
// // }

// console.info(
// 	new Chronos().getZodiacSign({
// 		birthDate: '02-29',
// 		preset: 'vedic',
// 	})
// );

// // console.info(getClassDetails(Chronos));

// const httpStatus = new HttpStatus();

// httpStatus.setMessage(200, 'Hello World!');

// console.info(HttpStatus.Groups);

// console.info(httpStatus.getByName('UNAUTHORIZED')?.message);

// console.info(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);

// console.info(
// 	convertStringCase('XML-HTTP_request', 'Title Case', {
// 		preserveAcronyms: true,
// 	})
// );

// console.info(numberToWords(wordsToNumber('69')));

// console.info(new Color(getColorForInitial('nhb')));

// console.info('#4682B4FF'.slice(0, 7));

// export interface IAlumnus {
// 	personal_info: IPersonalInfo;
// 	contact_info: IContactInfo;
// 	academic_info: IAcademicInfo;
// 	employment_info?: IEmploymentInfo;
// 	interest: string;
// }

// export interface IPersonalInfo {
// 	full_name: string;
// 	date_of_birth: string;
// 	image: string;
// 	nationality: string;
// }

// export interface IContactInfo {
// 	email: Branded<string, 'email'>;
// 	phone: `${number}`;
// 	current_address?: string;
// }

// export interface IAcademicInfo {
// 	student_id?: `${number}`;
// 	graduation_year: number;
// 	focus_area?: string;
// 	interest: boolean;
// }

// export interface IEmploymentInfo {
// 	current_employer: string;
// 	job_title: string;
// 	sector: string;
// 	work_location: string;
// }

// export function testFunc(payload: DeepPartial<IAlumnus>) {
// 	const result1 = flattenObjectDotNotation(payload);
// 	const result2 = flattenObjectKeyValue(payload);

// 	return result1['employment_info.current_employer'] || result2.current_employer;
// }

// Stylog.cornflowerblue.bold.log({ name: 'Nazmul' }, true);

// const styled = new LogStyler(['warning', 'bold']);
// styled.log('Hello World');

// new LogStyler().style('blue').style('bgYellow').style('underline').log('Styled message');

// console.info(chronos().getTimeZoneName());

// console.info(new Chronos().toDate().getTime() === new Date().getTime());

// console.info(numberToWordsOrdinal('hello twenty-three'));

// console.table(new Chronos().toObject());

// for (const c of new Chronos()) {
// 	console.info(c);
// }

// console.info(
// 	new Chronos().getZodiacSign({
// 		birthDate: '02-29',
// 		preset: 'vedic',
// 	})
// );

// console.info(getClassDetails(Chronos));

// const httpStatus = new HttpStatus();

// httpStatus.setMessage(200, 'Hello World!');

// console.info(httpStatus.getByName('UNAUTHORIZED')?.message);

// console.info(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);

// console.info(
// 	convertStringCase('XML-HTTP_request', 'Title Case', {
// 		preserveAcronyms: true,
// 	})
// );

// console.info(numberToWords(wordsToNumber('69')));

// console.info(new Color(getColorForInitial('nhb')).hex);

// console.info('#4682B4FF'.slice(0, 7));

// Stylog.cornflowerblue.bold.log({ name: 'Nazmul' }, true);

// const styled = Stylog.bold.italic;

// styled.magenta.log(Chronos.with({ month: 11, hour: 23, date: 31 }).format());
// styled.success.log(new Chronos().toUTC().toDate());
// styled.warning.log(chronos());
// styled.error.log(chronos().timeZone('IST-IN'));
// styled.bgAquamarine.log(` ${chronos.with({ month: 12 })} `);

// const ex1 = Stylog.red.toANSI('Hello');
// const ex2 = Stylog.blue.toANSI('World');

// console.info(ex1 + ' ' + ex2);

// console.info(detectColorSupport());
// console.info(process.stdout.getMaxListeners());

// console.info(Stylog.hex('#4682B4').bold.toANSI('Hello Custom Hex'));
// console.info(Stylog.bgHex('4682B4').toANSI(' Hello Custom Hex BG '));
// console.info(Stylog.rgb(11, 45, 1).toANSI('Tetsing RGB'));
// console.info(Stylog.bgRGB(225, 169, 196).toANSI(' Tetsing RGB BG '));
// console.info(Stylog.hsl('50 80.5% 40%').toANSI('Testing HSL'));
// console.info(Stylog.bgHSL('hsl(50 80.5% 40%)').bold.toANSI(' Testing HSL BG '));

// console.info(Stylog.bgHSL('hsl(50 80.5% 40%)').bold.applyStyles(' Testing HSL BG '));
// console.info(new Color('hsl(50, 80.5%, 40%)'));

// console.info(Stylog.ansi16('redBright').bold.italic.toANSI('hi ansi16'));
// console.info(Stylog.ansi16('purple').bold.toANSI('Purple'));
// console.info(Stylog.ansi16('purpleBright').bold.toANSI('Purple Bright'));

// Stylog.gray.log({ hello: 'Hello'.toLowerCase() }, true);

// registerStringMethods();

// console.info('my name is nazmul hassan'.convertCase('Title Case', {}));

// Stylog.yellowgreen.log(verbalizer.toPast('go'));
// Stylog.red.log(verbalizer.toParticiple('bear'));
// Stylog.yellow.log(verbalizer.toPast('post'));
// Stylog.purple.log(verbalizer.toPast('get'));

// console.info(verbalizer.isParticiple('run'));
// console.info(verbalizer.isParticiple('put'));
// console.info(verbalizer.toParticiple('mummify'));
// console.info(verbalizer.toParticiple('lie'));
// console.info(verbalizer.toBase('lied'));
// console.info(verbalizer.toBase('denied'));
// console.info(verbalizer.toBase('baked'));

// 'hello world'.typedSplit('o ');

// console.info(`${5 | 3}`);

// const productFinder = new Finder([{ a: 'products' }]);

// const laptop = productFinder.findOne('laptop', 'a', {
// 	fuzzy: true,
// 	caseInsensitive: false,
// });

// const order = {
// 	id: '1001',
// 	total: '199.99',
// 	items: [
// 		{ id: '1', price: '49.99' },
// 		{ id: '2', price: '59.99' },
// 	],
// 	customer: {
// 		id: 5001,
// 		loyaltyPoints: '1000',
// 	},
// };

// // Convert numbers throughout structure
// const result = convertObjectValues(order, {
// 	keys: ['total'],
// 	convertTo: 'number',
// });

// console.log(result);

// type Test = {
// 	sku?: string;
// 	price?: string;
// 	hello: {
// 		t?: string;
// 	};
// };

// const items: Array<Test> = [
// 	{ sku: 'A100', price: '25', hello: { t: '55' } },
// 	{ sku: 'B200', price: '50', hello: { t: '60' } },
// ];

// const resultArr = convertObjectValues(items, {
// 	keys: ['price'],
// 	convertTo: 'number',
// });

// console.log(resultArr);

// Chronos.use(greetingPlugin);

// console.log(new Chronos().getGreeting());

// const original = {
// 	name: 'John',
// 	address: {
// 		city: 'New York',
// 		h: ['s'],
// 	},
// 	// Age: { file2: { file10: 5 } },
// };
// console.log(isDeepEqual(original, original)); // false
// const res1 = extractKeys(original);
// const res2 = extractKeys(original, true);
// const res3 = extractKeysDeep(original);

// console.log(res1);
// console.log(res2);
// console.log(res3);

// const ex: unknown = {};

// if (isObjectWithKeys(ex, ['my', 'name', 'is'])) {
// 	console.log(ex);
// }

// if (isArray<string>(ex)) {
// 	console.log(ex);
// }

// console.log(new Chronos().isWorkday(2));
// console.log(
// 	new Chronos('2025-10-07T16:30:00.000+06:00').isBusinessHour({ weekendDays: [0, 1, 0, 5] })
// );
// console.log(new Chronos('2025-06-05').toFiscalQuarter());
// console.log(factorial(5.5));
// console.log(new Date('2025-01-18'));

// console.log(romanToInteger('lv'));
// console.log(romanToInteger('MMMCMXCIX'));
// console.log(numericToRoman(77) === 'LXXVII');

// console.log(new Chronos('2020-03-16').fromNow('day'));
// console.log(new Chronos('2025-10-01').diff('2020-03-16', 'day'));
// console.log(new Chronos().startOf('second'));
// console.log(new Chronos().endOf('hour'));
// console.log(new Chronos('2025-10-13'));
// console.log(new Chronos().diff('1992-01-18', 'day'));
// console.log(new Chronos().diff('2025-10-01', 'week'));
// // console.log(new Chronos('2020-03-16').duration('2025-10-01'));
// console.log(new Chronos().round('day'));
// console.log(new Chronos().toUTC().toString());
// console.log(new Chronos().timeZone('UTC+08:00').toString());
// console.log(new Chronos().getTimeZoneNameShort());

// import { generateRandomColor, generateRandomColorInHexRGB } from './src/colors/random';
// import { Converter } from './src/converter/Converter';
// import { $Data } from './src/converter/data';

// console.log(new $Data(1, 'gigabyte').toJSON());
// console.log(new DataConverter(1, 'gigabyte').toJSON());
// console.log(Converter(1, 'light-year').formatTo('foot'));
// console.log(Converter(200, 'liter').formatTo('pint', { style: 'compact' }));

// const cr = Converter(27 * 40, 'hectare').supportedUnits('volume');
// const [a, b, c, d, e, f, g, h, i, j, k, l, m, n] = cr;
// console.log(n, h, b);
// console.log(Converter(50, 'year').formatTo('decade'));
// console.log(Converter(1024, 'square-inch').formatTo('square-foot'));
