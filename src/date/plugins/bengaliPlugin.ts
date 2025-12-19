import { INTERNALS } from '../Chronos';
import { _formatDateCore } from '../helpers';
import type { $Chronos, ChronosFormat, StrictFormat } from '../types';

type BanglaDate = {
	year: string;
	month: string;
	date: string; // 1–31
	dayName: (typeof BN_DAYS)[number]['full']; // সোমবার
	dayNameShort: (typeof BN_DAYS)[number]['short'];
	monthName: (typeof BN_MONTHS)[number]['full']; // বৈশাখ
	monthNameShort: (typeof BN_MONTHS)[number]['short'];
	season: string; // গ্রীষ্ম
	isLeapYear: boolean;
	// bnISOString: string;
};

const BN_SEASONS = ['গ্রীষ্ম', 'বর্ষা', 'শরৎ', 'হেমন্ত', 'শীত', 'বসন্ত'] as const;

const BN_DAYS = [
	{ full: 'রবিবার', short: 'র' },
	{ full: 'সোমবার', short: 'সো' },
	{ full: 'মঙ্গলবার', short: 'ম' },
	{ full: 'বুধবার', short: 'বু' },
	{ full: 'বৃহস্পতিবার', short: 'বৃ' },
	{ full: 'শুক্রবার', short: 'শু' },
	{ full: 'শনিবার', short: 'শ' },
] as const;

const BN_MONTHS = [
	{ full: 'বৈশাখ', short: 'বৈ' },
	{ full: 'জ্যৈষ্ঠ', short: 'জ্য' },
	{ full: 'আষাঢ়', short: 'আ' },
	{ full: 'শ্রাবণ', short: 'শ্রা' },
	{ full: 'ভাদ্র', short: 'ভা' },
	{ full: 'আশ্বিন', short: 'আ' },
	{ full: 'কার্তিক', short: 'কা' },
	{ full: 'অগ্রহায়ণ', short: 'অ' },
	{ full: 'পৌষ', short: 'পৌ' },
	{ full: 'মাঘ', short: 'মা' },
	{ full: 'ফাল্গুন', short: 'ফা' },
	{ full: 'চৈত্র', short: 'চৈ' },
] as const;

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'] as const;

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

const digitToBangla = (dig: number | string) => {
	return String(dig).replace(/\d/g, (digit) => BN_DIGITS[Number(digit)]);
};

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

const seasonName = (month: number) => BN_SEASONS[Math.floor((month - 1) / 2)];

const YEAR0 = 593;
const MILLISECONDS_PER_DAY = 86400000;
const monthDaysNorm = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30];
const monthDaysLeap = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 31, 30];

const toEpoch = (year: number) => Date.UTC(year, 3, 13);

declare module '../Chronos' {
	interface Chronos {
		toBangla(): BanglaDate;

		formatBangla(format: StrictFormat): string;

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

		const dateInMs = internalDate(this).getTime();

		let days = Math.floor((dateInMs - toEpoch(_year)) / MILLISECONDS_PER_DAY);

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
			monthEn: month,
			date: digitToBangla(days),
			monthName: BN_MONTHS[month - 1].full,
			monthNameShort: BN_MONTHS[month - 1].short,
			dayName: BN_DAYS[this.weekDay].full,
			dayNameShort: BN_DAYS[this.weekDay].short,
			season: seasonName(month + 1),
			isLeapYear: this.isLeapYear(),
			// bnISOString: this.formatBangla('YYYY-MM-DDTHH:mm:ss.mssZZ'),
		};
	};

	$Chronos.prototype.formatBangla = function (fmt) {
		const { year, month, date, monthName, monthNameShort } = this.toBangla();

		const { hour, minute, second, millisecond } = this.toObject();

		const DAY = BN_DAYS[this.weekDay];

		const dateComponents: Record<ChronosFormat, string> = {
			YYYY: year,
			YY: year.slice(-2),
			yyyy: year,
			yy: year.slice(-2),
			M: month,
			MM: month.padStart(2, '০'),
			mmm: monthNameShort,
			mmmm: monthName,
			d: DAY.short,
			dd: DAY.full.replace('বার', ''),
			ddd: DAY.full,
			D: date,
			DD: date.padStart(2, '০'),
			Do: date,
			H: digitToBangla(hour),
			HH: digitToBangla(hour).padStart(2, '০'),
			h: digitToBangla(hour % 12 || 12),
			hh: digitToBangla(hour % 12 || 12).padStart(2, '০'),
			m: digitToBangla(minute),
			mm: digitToBangla(minute).padStart(2, '০'),
			s: digitToBangla(second),
			ss: digitToBangla(second).padStart(2, '০'),
			ms: digitToBangla(millisecond),
			mss: digitToBangla(millisecond).padStart(3, '০'),
			a: hour < 12 ? 'পূর্বাহ্ণ' : 'অপরাহ্ণ',
			A: hour < 12 ? 'পূর্বাহ্ণ' : 'অপরাহ্ণ',
			ZZ: this.getTimeZoneOffset().replace(/\d/g, (dig) => digitToBangla(dig)),
		};

		return _formatDateCore(fmt, dateComponents);
	};
};
