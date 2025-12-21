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

// const BN_REFORM_DATE_UTC = Date.UTC(2019, 3, 14); // 14 April 2019

// const isPost2019Bangla = (timestamp: number): boolean => {
// 	return timestamp >= BN_REFORM_DATE_UTC;
// };

// const floorAndAbs = (num: number) => {
// 	return Math.abs(Math.floor(num));
// };

declare module '../Chronos' {
	interface Chronos {
		toBangla<Locale extends $BnEn = 'bn'>(
			options?: BanglaDateOptions<Locale>
		): BanglaDate<Locale>;

		formatBangla(format?: StrictFormat, options?: BnCalendarConfig): string;

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

		/**
		 * Sets the default Bangla calendar variant globally for all `Chronos` instances.
		 *
		 * @param options Configuration object containing the default Bangla calendar variant.
		 *
		 * This configuration is applied as the default variant for all Bangla-related methods
		 * (like {@link getBanglaMonth}, {@link getBanglaDay}, {@link toBangla}, etc.) across all instances of `Chronos`,
		 * unless a specific `variant` is provided in the method options.
		 *
		 * @remarks
		 * - If this method is not called, the default variant is 'revised-2019'.
		 * - Calling this method overrides the default globally for **all instances**, both existing and future.
		 * - Per-call overrides using the `variant` option will always take precedence over this global default.
		 * - Valid variants are `'revised-1966'` and `'revised-2019'`.
		 *
		 * **Notes**
		 * - This method **does not modify the instance**, only sets the default calendar variant.
		 *
		 * @example
		 * const c1 = new Chronos();
		 * const c2 = new Chronos();
		 *
		 * // Before calling the method, all instances use the 2019 variant by default
		 * c1.getBanglaMonth(); // uses 'revised-2019'
		 * c2.getBanglaMonth(); // uses 'revised-2019'
		 *
		 * // Set the global default to 1966 variant
		 * c1.configureBanglaCalendar({ variant: 'revised-1966' });
		 *
		 * c1.getBanglaMonth(); // now uses 'revised-1966'
		 * c2.getBanglaMonth(); // also uses 'revised-1966'
		 *
		 * // Per-call override still works
		 * c1.getBanglaMonth({ variant: 'revised-2019' }); // uses 'revised-2019' just for this call
		 */
		configureBanglaCalendar(options: BnCalendarConfig): void;
	}
}

/** * Plugin to inject methods related to `Bengali` date system */
export const bengaliPlugin = ($Chronos: $Chronos): void => {
	const { internalDate: $Date } = $Chronos[INTERNALS];

	const YEAR_OFFSET = 593;
	const MS_PER_DAY = 86400000;

	const DEFAULT_CONFIG = new Map<'config', BnCalendarConfig>();

	const getSeason = <L extends $BnEn = 'bn'>(month: number, locale?: L | $BnEn) => {
		const season = BN_SEASONS[Math.floor(month / 2)];

		return (locale === 'en' ? season.en : season.bn) as BanglaSeasonName<L>;
	};

	const isBnLeapYear = (by: number, gy: number, v?: BnCalendarVariant) => {
		return v === 'revised-1966' ? by % 4 === 2 : isLeapYear(gy);
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

	const bnDaysMonthIdx = (date: Date, variant?: BnCalendarVariant) => {
		const v = variant ?? DEFAULT_CONFIG.get('config')?.variant ?? 'revised-2019';

		const table =
			isBnLeapYear(getBnYear(date), date.getFullYear(), v) ?
				BN_MONTH_TABLES?.[v].leap
			:	BN_MONTH_TABLES?.[v].normal;

		let days = getElapsedDays(date);
		let month = 0;

		while (days >= table[month]) {
			days -= table[month];
			month++;
		}

		return { days, month };
	};

	$Chronos.prototype.configureBanglaCalendar = function (configs) {
		DEFAULT_CONFIG.set('config', configs);
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

	$Chronos.prototype.toBangla = function <L extends $BnEn>(opts?: BanglaDateOptions<L>) {
		return {
			year: this.getBanglaYear(opts?.locale),
			month: this.getBanglaMonth(opts),
			date: this.getBanglaDay(opts),
			monthName: this.getBanglaMonthName(opts),
			dayName: this.getBanglaDayName(opts?.locale),
			seasonName: this.getBanglaSeasonName(opts),
			isLeapYear: isBnLeapYear(getBnYear($Date(this)), this.year, opts?.variant),
		} as BanglaDate<L>;
	};

	$Chronos.prototype.formatBangla = function (fmt, opts) {
		const { hour, minute, second, millisecond } = this.toObject();

		const D_NAME = BN_DAYS[this.weekDay];
		const M_NAME = BN_MONTHS[bnDaysMonthIdx($Date(this), opts?.variant).month];

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
			mmm: M_NAME.short,
			mmmm: M_NAME.bn,
			d: D_NAME.short,
			dd: D_NAME.bn.replace('বার', ''),
			ddd: D_NAME.bn,
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

		return _formatDateCore(
			fmt || 'ddd, mmmm DD (SS), YYYY বঙ্গাব্দ - hh:mm:ss (A)',
			dateComponents
		);
	};
};
