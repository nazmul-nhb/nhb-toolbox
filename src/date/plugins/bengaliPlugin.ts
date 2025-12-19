import type { $Chronos } from '../types';
import { INTERNALS } from '../Chronos';

type BanglaDate = {
	year: string;
	month: string; // 1–12
	date: string; // 1–31
	weekDay: string;
	monthName: string; // বৈশাখ
	season: string; // গ্রীষ্ম
	isLeapYear: boolean;
	time: string;
};

const monthNames = [
	'বৈশাখ',
	'জ্যৈষ্ঠ',
	'আষাঢ়',
	'শ্রাবণ',
	'ভাদ্র',
	'আশ্বিন',
	'কার্তিক',
	'অগ্রহায়ণ',
	'পৌষ',
	'মাঘ',
	'ফাল্গুন',
	'চৈত্র',
];
const weekDays = [
	'রবিবার',
	'সোমবার',
	'মঙ্গলবার',
	'বুধবার',
	'বৃহস্পতিবার',
	'শুক্রবার',
	'শনিবার',
];
const seasonNames = ['গ্রীষ্ম', 'বর্ষা', 'শরৎ', 'হেমন্ত', 'শীত', 'বসন্ত'];

const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

// let banglaObj: Record<string, number>;

// const createBanglaObj = () => {
// 	banglaObj = digits.reduce(
// 		(o, c, i) => {
// 			o[c] = i;
// 			return o;
// 		},
// 		{} as Record<string, number>
// 	);
// };

const digitToBangla = (dig: number) =>
	String(dig).replace(/\d/g, (digit) => digits[Number(digit)]);

// const banglaToDigit = (bangla: string) => {
// 	if (!banglaObj) createBanglaObj(); // memoize
// 	const month = monthNames.indexOf(bangla);
// 	const str =
// 		month !== -1 ?
// 			month + 1
// 		:	String(bangla).replace(/./g, (bn) => {
// 				const r = String(banglaObj[bn]);
// 				return r !== undefined ? r : bn;
// 			});
// 	return Number(str);
// };

// const weekDay = (day: number) => weekDays[day];

// const monthName = (month: number) => monthNames[month - 1];

const seasonName = (month: number) => seasonNames[Math.floor((month - 1) / 2)];

const YEAR0 = 593;
const MILLISECONDS_PER_DAY = 86400000;
const monthDaysNorm = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30];
const monthDaysLeap = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 31, 30];

// const UTC6 = 6; // timezone offset UTC+6
const toEpoch = (year: number) => Date.UTC(year, 3, 13);

declare module '../Chronos' {
	interface Chronos {
		toBangla(): BanglaDate;

		formatBangla(format: string): string;

		getBanglaYear(): number;
		getBanglaMonth(): number;
		getBanglaDay(): number;

		getBanglaMonthName(): string;
		getBanglaMonthLength(): number;
		getBanglaSeason(): string;

		isBanglaLeapYear(): boolean;

		addBanglaMonths(n: number): Chronos;
		addBanglaYears(n: number): Chronos;

		startOfBanglaMonth(): Chronos;
		endOfBanglaMonth(): Chronos;

		startOfBanglaYear(): Chronos;
		endOfBanglaYear(): Chronos;
	}
}

/** * Plugin to inject `Bengali` date system in `Chronos` */
export const bengaliPlugin = ($Chronos: $Chronos): void => {
	const { internalDate } = $Chronos[INTERNALS];

	$Chronos.prototype.toBangla = function () {
		const monthDays = this.isLeapYear() ? monthDaysLeap : monthDaysNorm;

		let _year = this.year;
		if (this.isoMonth < 4 || (this.isoMonth === 4 && this.date < 14)) {
			_year -= 1;
		}

		const date = internalDate(this).getTime();

		let days = Math.floor((date - toEpoch(_year)) / MILLISECONDS_PER_DAY);

		let month = 0;

		for (let i = 0; i < monthDays.length; i++) {
			if (days <= monthDays[i]) {
				month = i + 1;
				break;
			}
			days -= monthDays[i];
		}

		return {
			year: digitToBangla(_year - YEAR0),
			month: digitToBangla(month),
			date: digitToBangla(days),
			monthName: monthNames[month - 1],
			weekDay: weekDays[this.weekDay],
			season: seasonName(month + 1),
			isLeapYear: this.isLeapYear(),
			time: this.format('HH:mm:ss').replace(/\d/g, (digit) => digits[Number(digit)]),
		};
	};

	$Chronos.prototype.formatBangla = function (fmt) {
		const banglaDate = this.toBangla();

		const replacements: Record<string, string> = {
			YYYY: banglaDate.year,
			MM: banglaDate.month.padStart(2, '০'),
			DD: banglaDate.date.padStart(2, '০'),
			MMMM: banglaDate.monthName,
			dddd: banglaDate.weekDay,
			SSSS: banglaDate.season,
			'HH:mm:ss': banglaDate.time,
		};

		let result = fmt;

		for (const [key, value] of Object.entries(replacements)) {
			result = result.replace(key, value);
		}

		// const enFormatted = this.format(fmt);

		// let result = enFormatted;

		// for (const [key, value] of Object.entries(replacements)) {
		// 	result = result.replace(key, value);
		// }

		return result;
	};
};
