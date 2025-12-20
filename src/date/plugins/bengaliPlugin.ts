// import { INTERNALS } from '../Chronos';
import { _formatDateCore } from '../helpers';
import type { $Chronos, $BnEn, BanglaDate, BanglaSeasonName, StrictFormat } from '../types';
import { BN_DAYS, BN_DIGITS, BN_MONTHS, BN_SEASONS } from '../constants';

const YEAR_OFFSET = 593;
const MS_PER_DAY = 86400000;

const BN_POST_2019_NORMAL = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 29, 30] as const;
const BN_POST_2019_LEAP = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30] as const;

// const BN_PRE_2019_NORMAL = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30] as const;
// const BN_PRE_2019_LEAP = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 31, 30] as const;

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

// const banglaToDigit = (bnDigit: BanglaDigit) => {
// 	return BANGLA_DIGIT_MAP[bnDigit];
// };

const digitToBangla = (dig: number | string) => {
	return String(dig).replace(/\d/g, (digit) => BN_DIGITS[Number(digit)]);
};

const floorAndAbs = (num: number) => {
	return Math.abs(Math.floor(num));
};

const getSeason = <L extends $BnEn = 'bn'>(month: number, locale?: L): BanglaSeasonName<L> => {
	const season = BN_SEASONS[floorAndAbs(month / 2)];

	return (locale === 'en' ? season.en : season.bn) as BanglaSeasonName<L>;
};

// const BN_REFORM_DATE_UTC = Date.UTC(2019, 3, 14); // 14 April 2019

// const isPost2019Bangla = (timestamp: number): boolean => {
// 	return timestamp >= BN_REFORM_DATE_UTC;
// };

declare module '../Chronos' {
	interface Chronos {
		toBangla<Locale extends $BnEn = 'bn'>(locale?: Locale): BanglaDate<Locale>;

		formatBangla(format: StrictFormat): string;

		getBanglaYear(): number;
		getBanglaMonth(): number;
		getBanglaDay(): number;

		getBanglaMonthName(): string;
		getBanglaMonthLength(): number;
		getBanglaSeason(): string;

		isBanglaLeapYear(): boolean;

		startOfBanglaMonth(): Chronos;
		endOfBanglaMonth(): Chronos;

		startOfBanglaYear(): Chronos;
		endOfBanglaYear(): Chronos;
	}
}

/** * Plugin to inject `Bengali` date system in `Chronos` */
export const bengaliPlugin = ($Chronos: $Chronos): void => {
	// const { internalDate } = $Chronos[INTERNALS];

	$Chronos.prototype.toBangla = function <Locale extends $BnEn>(locale?: Locale) {
		const gy = this.year;
		const gm = this.isoMonth;
		const gd = this.date;

		const utcTs = Date.UTC(gy, gm - 1, gd);

		const bnYearBase = gm < 4 || (gm === 4 && gd < 14) ? gy - 1 : gy;

		const monthTable = this.isLeapYear() ? BN_POST_2019_LEAP : BN_POST_2019_NORMAL;

		let days = Math.floor((utcTs - Date.UTC(bnYearBase, 3, 14)) / MS_PER_DAY);
		let month = 0;

		while (days >= monthTable[month]) {
			days -= monthTable[month];
			month++;
		}

		const date = days + 1;
		const isoMonth = month + 1;
		const bnYear = bnYearBase - YEAR_OFFSET;

		const DAY = BN_DAYS[this.weekDay];
		const MONTH = BN_MONTHS[month];

		switch (locale) {
			case 'en':
				return {
					year: bnYear,
					month: isoMonth,
					date: date,
					monthName: MONTH.en,
					dayName: DAY.en,
					seasonName: getSeason(month, 'en'),
					isLeapYear: this.isLeapYear(),
				} as BanglaDate<Locale>;

			default:
				return {
					year: digitToBangla(bnYear),
					month: digitToBangla(isoMonth),
					date: digitToBangla(date),
					monthName: MONTH.bn,
					dayName: DAY.bn,
					seasonName: getSeason(month),
					isLeapYear: this.isLeapYear(),
				} as BanglaDate<Locale>;
		}
	};

	$Chronos.prototype.formatBangla = function (fmt) {
		const { year, month, date } = this.toBangla('en');

		const { hour, minute, second, millisecond } = this.toObject();

		const DAY = BN_DAYS[this.weekDay];
		const MONTH = BN_MONTHS[month - 1];

		const $year = digitToBangla(year);
		const offset = this.getTimeZoneOffset().replace(/\d/g, (dig) => digitToBangla(dig));

		const dateComponents: Record<string, string> = {
			YYYY: $year,
			YY: $year.slice(-2),
			yyyy: $year,
			yy: $year.slice(-2),
			M: digitToBangla(month),
			MM: digitToBangla(month).padStart(2, '০'),
			mmm: MONTH.short,
			mmmm: MONTH.bn,
			d: DAY.short,
			dd: DAY.bn.replace('বার', ''),
			ddd: DAY.bn,
			D: digitToBangla(date),
			DD: digitToBangla(date).padStart(2, '০'),
			Do: digitToBangla(date),
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
			Z: offset,
			ZZ: offset,
			S: getSeason(month),
			SS: getSeason(month),
		};

		return _formatDateCore(fmt, dateComponents);
	};
};
