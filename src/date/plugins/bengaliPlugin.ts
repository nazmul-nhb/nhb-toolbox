import { INTERNALS } from '../Chronos';
import { _formatDateCore } from '../helpers';
import type { $Chronos, ChronosFormat, StrictFormat } from '../types';
import { DAYS } from '../constants';
import { BANGLADESH_SEASONS } from '../seasons';

type BanglaDate<Locale extends 'bn' | 'en' = 'bn'> = {
	year: Locale extends 'en' ? number : string;
	month: Locale extends 'en' ? number : string;
	date: Locale extends 'en' ? number : string;
	dayName: string;
	dayNameShort: string;
	monthName: string;
	monthNameShort: string;
	seasonName: string;
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
	{ full: 'বৈশাখ', en: 'Boishakh', short: 'বৈ' },
	{ full: 'জ্যৈষ্ঠ', en: 'Joishtho', short: 'জ্য' },
	{ full: 'আষাঢ়', en: 'Asharh', short: 'আ' },
	{ full: 'শ্রাবণ', en: 'Srabon', short: 'শ্রা' },
	{ full: 'ভাদ্র', en: 'Bhadro', short: 'ভা' },
	{ full: 'আশ্বিন', en: 'Ashwin', short: 'আ' },
	{ full: 'কার্তিক', en: 'Kartik', short: 'কা' },
	{ full: 'অগ্রহায়ণ', en: 'Ogrohayon', short: 'অ' },
	{ full: 'পৌষ', en: 'Poush', short: 'পৌ' },
	{ full: 'মাঘ', en: 'Magh', short: 'মা' },
	{ full: 'ফাল্গুন', en: 'Falgun', short: 'ফা' },
	{ full: 'চৈত্র', en: 'Choitro', short: 'চৈ' },
] as const;

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'] as const;

// type BanglaDigit = (typeof BN_DIGITS)[number];
// type BanglaDayName = (typeof BN_DAYS)[number]['full'];
// type BanglaMonthName = (typeof BN_MONTHS)[number]['full'];
// type BanglaSeasonName = (typeof BN_SEASONS)[number];

// const BANGLA_DIGIT_MAP = {
// 	'০': 0,
// 	'১': 1,
// 	'২': 2,
// 	'৩': 3,
// 	'৪': 4,
// 	'৫': 5,
// 	'৬': 6,
// 	'৭': 7,
// 	'৮': 8,
// 	'৯': 9,
// } as const;

const digitToBangla = (dig: number | string) => {
	return String(dig).replace(/\d/g, (digit) => BN_DIGITS[Number(digit)]);
};

// const banglaToDigit = (bnDigit: BanglaDigit) => {
// 	return BANGLA_DIGIT_MAP[bnDigit];
// };

const seasonName = (month: number) => BN_SEASONS[Math.floor((month - 1) / 2)];

const toEpoch = (year: number) => Date.UTC(year, 3, 13);

const YEAR0 = 593;
const MILLISECONDS_PER_DAY = 86400000;
const monthDaysNorm = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30] as const;
const monthDaysLeap = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 31, 30] as const;

declare module '../Chronos' {
	interface Chronos {
		toBangla<Locale extends 'bn' | 'en' = 'bn'>(locale?: Locale): BanglaDate<Locale>;

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

	$Chronos.prototype.toBangla = function <Locale extends 'bn' | 'en'>(locale?: Locale) {
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

		switch (locale) {
			case 'en':
				return {
					year: _year - YEAR0,
					month: month,
					date: days,
					monthName: BN_MONTHS[month - 1].en,
					monthNameShort: BN_MONTHS[month - 1].en.slice(0, 3),
					dayName: DAYS[this.weekDay],
					dayNameShort: DAYS[this.weekDay].slice(0, 3),
					seasonName: BANGLADESH_SEASONS[Math.floor((month - 1) / 2)].name,
					isLeapYear: this.isLeapYear(),
				} as BanglaDate<Locale>;

			default:
				return {
					year: digitToBangla(_year - YEAR0),
					month: digitToBangla(month),
					date: digitToBangla(days),
					monthName: BN_MONTHS[month - 1].full,
					monthNameShort: BN_MONTHS[month - 1].short,
					dayName: BN_DAYS[this.weekDay].full,
					dayNameShort: BN_DAYS[this.weekDay].short,
					seasonName: seasonName(month + 1),
					isLeapYear: this.isLeapYear(),
				} as BanglaDate<Locale>;
		}
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
