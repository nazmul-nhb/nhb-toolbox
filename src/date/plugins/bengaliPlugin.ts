import { _formatDateCore } from '../helpers';
import type {
	$BanglaMonth,
	$BanglaMonthDate,
	$BanglaYear,
	$Chronos,
	$BnEn,
	BanglaDate,
	BanglaDayName,
	BanglaMonthName,
	BanglaSeasonName,
	BnCalendarVariant,
	StrictFormat,
} from '../types';
import { BN_DAYS, BN_MONTH_TABLES, BN_MONTHS, BN_SEASONS, INTERNALS } from '../constants';
import { isLeapYear } from '../guards';
import { digitToBangla } from '../../number/convert';

const YEAR_OFFSET = 593;
const MS_PER_DAY = 86400000;

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

		getBanglaYear<Locale extends $BnEn = 'bn'>(locale?: Locale): $BanglaYear<Locale>;

		getBanglaMonth<Locale extends $BnEn = 'bn'>(locale?: Locale): $BanglaMonth<Locale>;

		getBanglaDay<Locale extends $BnEn = 'bn'>(locale?: Locale): $BanglaMonthDate<Locale>;

		getBanglaDayName<Locale extends $BnEn = 'bn'>(locale?: Locale): BanglaDayName<Locale>;

		getBanglaMonthName<Locale extends $BnEn = 'bn'>(
			locale?: Locale
		): BanglaMonthName<Locale>;

		getBanglaSeasonName<Locale extends $BnEn = 'bn'>(
			locale?: Locale
		): BanglaSeasonName<Locale>;

		startOfBanglaMonth(): Chronos;
		endOfBanglaMonth(): Chronos;

		startOfBanglaYear(): Chronos;
		endOfBanglaYear(): Chronos;
	}
}

/** Get unit value for {@link Date} for specific unit in local or UTC time */
// const _getUnitValue = (suffix: $DateUnit): number => {
// 	return useUTC ? $date[`getUTC${suffix}`]() : $date[`get${suffix}`]();
// };

/** * Plugin to inject `Bengali` date system in `Chronos` */
export const bengaliPlugin = ($Chronos: $Chronos): void => {
	const { internalDate: $Date } = $Chronos[INTERNALS];

	const extractDateUnits = (date: Date) => {
		const month = date.getMonth();

		return {
			gy: date.getFullYear(),
			$gm: month,
			gm: month + 1,
			gd: date.getDate(),
		};
	};

	const getBaseYear = (date: Date): number => {
		const { gy, gm, gd } = extractDateUnits(date);

		return gm < 4 || (gm === 4 && gd < 14) ? gy - 1 : gy;
	};

	const getUtcTs = (date: Date): number => {
		const { gy, $gm, gd } = extractDateUnits(date);

		return Date.UTC(gy, $gm, gd);
	};

	const getElapsedDays = (date: Date) => {
		return Math.floor((getUtcTs(date) - Date.UTC(getBaseYear(date), 3, 14)) / MS_PER_DAY);
	};

	const bnDaysMonthIdx = (date: Date, variant: BnCalendarVariant = 'latest') => {
		const monthTable =
			isLeapYear(date.getFullYear()) ?
				BN_MONTH_TABLES?.[variant].leap
			:	BN_MONTH_TABLES?.[variant].normal;

		let days = getElapsedDays(date);
		let month = 0;

		while (days >= monthTable[month]) {
			days -= monthTable[month];
			month++;
		}

		return { days, month };
	};

	$Chronos.prototype.getBanglaYear = function <L extends $BnEn>(locale?: L) {
		const baseYear = getBaseYear($Date(this));

		const bnYear = baseYear - YEAR_OFFSET;

		return (locale === 'en' ? bnYear : digitToBangla(bnYear)) as $BanglaYear<L>;
	};

	$Chronos.prototype.getBanglaMonth = function <L extends $BnEn>(locale?: L) {
		const isoMonth = bnDaysMonthIdx($Date(this)).month + 1;

		return (locale === 'en' ? isoMonth : digitToBangla(isoMonth)) as $BanglaMonth<L>;
	};

	$Chronos.prototype.getBanglaDay = function <L extends $BnEn>(locale?: L) {
		const date = bnDaysMonthIdx($Date(this)).days + 1;

		return (locale === 'en' ? date : digitToBangla(date)) as $BanglaMonthDate<L>;
	};

	$Chronos.prototype.getBanglaDayName = function <L extends $BnEn>(locale?: L) {
		const DAY = BN_DAYS[this.weekDay];

		return (locale === 'en' ? DAY.en : DAY.bn) as BanglaDayName<L>;
	};

	$Chronos.prototype.getBanglaMonthName = function <L extends $BnEn>(locale?: L) {
		const MONTH = BN_MONTHS[bnDaysMonthIdx($Date(this)).month];

		return (locale === 'en' ? MONTH.en : MONTH.bn) as BanglaMonthName<L>;
	};

	$Chronos.prototype.getBanglaSeasonName = function <L extends $BnEn>(locale?: L) {
		return getSeason(bnDaysMonthIdx($Date(this)).month, locale);
	};

	$Chronos.prototype.toBangla = function <L extends $BnEn>(locale?: L) {
		return {
			year: this.getBanglaYear(locale),
			month: this.getBanglaMonth(locale),
			date: this.getBanglaDay(locale),
			monthName: this.getBanglaMonthName(locale),
			dayName: this.getBanglaDayName(locale),
			seasonName: this.getBanglaSeasonName(locale),
			isLeapYear: this.isLeapYear(),
		} as BanglaDate<L>;
	};

	$Chronos.prototype.formatBangla = function (fmt) {
		const { hour, minute, second, millisecond } = this.toObject();

		const DAY = BN_DAYS[this.weekDay];
		const MONTH = BN_MONTHS[bnDaysMonthIdx($Date(this)).month];

		const month = this.getBanglaMonth('bn');
		const year = this.getBanglaYear('bn');
		const date = this.getBanglaDay('bn');
		const seasonName = this.getBanglaSeasonName('bn');

		const offset = digitToBangla(this.getTimeZoneOffset(), true);

		const dateComponents: Record<string, string> = {
			YYYY: year,
			YY: year.slice(-2),
			yyyy: year,
			yy: year.slice(-2),
			M: month,
			MM: month.padStart(2, '০'),
			mmm: MONTH.short,
			mmmm: MONTH.bn,
			d: DAY.short,
			dd: DAY.bn.replace('বার', ''),
			ddd: DAY.bn,
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
			Z: offset,
			ZZ: offset,
			S: seasonName,
			SS: seasonName,
		};

		return _formatDateCore(fmt, dateComponents);
	};
};
