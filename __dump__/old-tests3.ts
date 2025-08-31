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
