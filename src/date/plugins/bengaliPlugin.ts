import { digitToBangla } from '../../number/convert';
import { BN_DAYS, BN_MONTH_TABLES, BN_MONTHS, BN_SEASONS, INTERNALS } from '../constants';
import { isLeapYear } from '../guards';
import { _formatDateCore } from '../helpers';
import type {
	$BanglaMonth,
	$BanglaMonthDate,
	$BanglaYear,
	$BnEn,
	$Chronos,
	BanglaDate,
	BanglaDateOptions,
	BanglaDayName,
	BanglaMonthName,
	BanglaSeasonName,
	BnCalendarConfig,
	BnCalendarVariant,
	StrictFormat,
} from '../types';

const YEAR_OFFSET = 593;
const MS_PER_DAY = 86400000;

const floorAndAbs = (num: number) => {
	return Math.abs(Math.floor(num));
};

const getSeason = <L extends $BnEn = 'bn'>(month: number, locale?: L | $BnEn) => {
	const season = BN_SEASONS[floorAndAbs(month / 2)];

	return (locale === 'en' ? season.en : season.bn) as BanglaSeasonName<L>;
};

// const BN_REFORM_DATE_UTC = Date.UTC(2019, 3, 14); // 14 April 2019

// const isPost2019Bangla = (timestamp: number): boolean => {
// 	return timestamp >= BN_REFORM_DATE_UTC;
// };

declare module '../Chronos' {
	interface Chronos {
		toBangla<Locale extends $BnEn = 'bn'>(
			options?: BanglaDateOptions<Locale>
		): BanglaDate<Locale>;

		formatBangla(format: StrictFormat, options?: BnCalendarConfig): string;

		getBanglaYear<Locale extends $BnEn = 'bn'>(locale?: Locale): $BanglaYear<Locale>;

		getBanglaMonth<Locale extends $BnEn = 'bn'>(
			options?: BanglaDateOptions<Locale>
		): $BanglaMonth<Locale>;

		getBanglaDay<Locale extends $BnEn = 'bn'>(
			options?: BanglaDateOptions<Locale>
		): $BanglaMonthDate<Locale>;

		getBanglaDayName<Locale extends $BnEn = 'bn'>(locale?: Locale): BanglaDayName<Locale>;

		getBanglaMonthName<Locale extends $BnEn = 'bn'>(
			options?: BanglaDateOptions<Locale>
		): BanglaMonthName<Locale>;

		getBanglaSeasonName<Locale extends $BnEn = 'bn'>(
			options?: BanglaDateOptions<Locale>
		): BanglaSeasonName<Locale>;

		startOfBanglaMonth(): Chronos;
		endOfBanglaMonth(): Chronos;

		startOfBanglaYear(): Chronos;
		endOfBanglaYear(): Chronos;
	}
}

/** * Plugin to inject methods related to `Bengali` date system */
export const bengaliPlugin = ($Chronos: $Chronos): void => {
	const { internalDate: $Date } = $Chronos[INTERNALS];

	const isWeirdLeapYear = (year: number) => {
		return year % 4 === 2;
	};

	const extractDateUnits = (date: Date) => {
		const month = date.getMonth();

		return {
			gy: date.getFullYear(),
			$gm: month,
			gm: month + 1,
			gd: date.getDate(),
		};
	};

	const getGregBaseYear = (date: Date): number => {
		const { gy, gm, gd } = extractDateUnits(date);

		return gm < 4 || (gm === 4 && gd < 14) ? gy - 1 : gy;
	};

	const getBnYear = (date: Date): number => {
		return getGregBaseYear(date) - YEAR_OFFSET;
	};

	const getUtcTs = (date: Date): number => {
		const { gy, $gm, gd } = extractDateUnits(date);

		return Date.UTC(gy, $gm, gd);
	};

	const getElapsedDays = (date: Date): number => {
		return Math.floor(
			(getUtcTs(date) - Date.UTC(getGregBaseYear(date), 3, 14)) / MS_PER_DAY
		);
	};

	const bnDaysMonthIdx = (date: Date, v: BnCalendarVariant = 'revised-2019') => {
		const isLeap =
			v === 'revised-1966' ?
				isWeirdLeapYear(getBnYear(date))
			:	isLeapYear(date.getFullYear());

		const table = isLeap ? BN_MONTH_TABLES?.[v].leap : BN_MONTH_TABLES?.[v].normal;

		let days = getElapsedDays(date);
		let month = 0;

		while (days >= table[month]) {
			days -= table[month];
			month++;
		}

		return { days, month };
	};

	$Chronos.prototype.getBanglaYear = function <L extends $BnEn>(locale = 'bn' as L) {
		const bnYear = getBnYear($Date(this));

		return (locale === 'en' ? bnYear : digitToBangla(bnYear)) as $BanglaYear<L>;
	};

	$Chronos.prototype.getBanglaMonth = function <L extends $BnEn>(
		options?: BanglaDateOptions<L>
	) {
		const { locale = 'bn', variant } = options ?? {};

		const isoMonth = bnDaysMonthIdx($Date(this), variant).month + 1;

		return (locale === 'en' ? isoMonth : digitToBangla(isoMonth)) as $BanglaMonth<L>;
	};

	$Chronos.prototype.getBanglaDay = function <L extends $BnEn>(
		options?: BanglaDateOptions<L>
	) {
		const { locale = 'bn', variant } = options ?? {};

		const date = bnDaysMonthIdx($Date(this), variant).days + 1;

		return (locale === 'en' ? date : digitToBangla(date)) as $BanglaMonthDate<L>;
	};

	$Chronos.prototype.getBanglaDayName = function <L extends $BnEn>(locale = 'bn' as L) {
		const DAY = BN_DAYS[this.weekDay];

		return (locale === 'en' ? DAY.en : DAY.bn) as BanglaDayName<L>;
	};

	$Chronos.prototype.getBanglaMonthName = function <L extends $BnEn>(
		options?: BanglaDateOptions<L>
	) {
		const { locale = 'bn', variant } = options ?? {};

		const MONTH = BN_MONTHS[bnDaysMonthIdx($Date(this), variant).month];

		return (locale === 'en' ? MONTH.en : MONTH.bn) as BanglaMonthName<L>;
	};

	$Chronos.prototype.getBanglaSeasonName = function (options) {
		const { locale, variant } = options ?? {};

		return getSeason(bnDaysMonthIdx($Date(this), variant).month, locale);
	};

	$Chronos.prototype.toBangla = function <L extends $BnEn>(options?: BanglaDateOptions<L>) {
		return {
			year: this.getBanglaYear(options?.locale),
			month: this.getBanglaMonth(options),
			date: this.getBanglaDay(options),
			monthName: this.getBanglaMonthName(options),
			dayName: this.getBanglaDayName(options?.locale),
			seasonName: this.getBanglaSeasonName(options),
			isLeapYear: this.isLeapYear(),
		} as BanglaDate<L>;
	};

	$Chronos.prototype.formatBangla = function (fmt) {
		const { hour, minute, second, millisecond } = this.toObject();

		const DAY = BN_DAYS[this.weekDay];
		const MONTH = BN_MONTHS[bnDaysMonthIdx($Date(this)).month];

		const month = this.getBanglaMonth();
		const year = this.getBanglaYear();
		const date = this.getBanglaDay();
		const seasonName = this.getBanglaSeasonName();

		const offset = digitToBangla(this.getTimeZoneOffset());

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
			SS: seasonName + 'কাল',
		};

		return _formatDateCore(fmt, dateComponents);
	};
};
