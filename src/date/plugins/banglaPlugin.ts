import { digitToBangla } from '../../number/convert';
import { BN_DAYS, BN_MONTHS, INTERNALS } from '../constants';
import {
	_bnDaysMonthIdx,
	_formatDateCore,
	_getBnSeason,
	_getBnYear,
	_isBnLeapYear,
} from '../helpers';
import type {
	$BanglaMonth,
	$BanglaMonthDate,
	$BanglaYear,
	$BnEn,
	$Chronos,
	BanglaDateObject,
	BanglaDateOptions,
	BanglaDayName,
	BanglaMonthName,
	BanglaSeasonName,
	BnCalendarConfig,
	BnCalendarVariant,
	StrictFormat,
} from '../types';

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Converts the current date to a complete Bangla calendar date object.
		 *
		 * @param options - Configuration options for the Bangla date output
		 * @returns A complete Bangla date object containing year, month, date, names, and leap year status
		 *
		 * @example
		 * Chronos.register(banglaPlugin);
		 *
		 * const chronos = new Chronos('2023-04-14');
		 * const banglaDate = chronos.toBangla();
		 * // Returns: {
		 * //   year: '১৪৩০',
		 * //   month: '১',
		 * //   date: '১',
		 * //   monthName: 'বৈশাখ',
		 * //   dayName: 'শুক্রবার',
		 * //   seasonName: 'গ্রীষ্ম',
		 * //   isLeapYear: false
		 * // }
		 *
		 * const banglaDateEn = chronos.toBangla({ locale: 'en' });
		 * // Returns: {
		 * //   year: 1430,
		 * //   month: 1,
		 * //   date: 1,
		 * //   monthName: 'Boishakh',
		 * //   dayName: 'Shukrobar (Friday)',
		 * //   seasonName: 'Grisma (Summer)',
		 * //   isLeapYear: false
		 * // }
		 *
		 * @remarks
		 * - The method uses the default calendar variant unless specified in options.
		 * - The locale option determines whether values are returned in Bangla or Latin format.
		 */
		toBangla<Locale extends $BnEn = 'bn'>(
			options?: BanglaDateOptions<Locale>
		): BanglaDateObject<Locale>;

		/**
		 * @instance Formats the current date as a Bangla calendar date string using customizable tokens.
		 *
		 * @param format - Format string using tokens (default: `'ddd, DD mmmm (SS), YYYY বঙ্গাব্দ - hh:mm:ss (A)'`)
		 * @param options - Calendar configuration options
		 * @returns Formatted Bangla date string according to the specified format
		 *
		 * @example
		 * const chronos = new Chronos('2023-04-14 14:30:00');
		 * chronos.formatBangla();
		 * // Returns: 'শুক্রবার, বৈশাখ ০১ (গ্রীষ্মকাল), ১৪৩০ বঙ্গাব্দ - ০২:৩০:০০ (অপরাহ্ণ)'
		 *
		 * chronos.formatBangla('YYYY-MM-DD');
		 * // Returns: '১৪৩০-০১-০১'
		 *
		 * chronos.formatBangla('mmmm DD, YYYY');
		 * // Returns: 'বৈশাখ ০১, ১৪৩০'
		 *
		 * chronos.formatBangla('hh:mm:ss A');
		 * // Returns: '০২:৩০:০০ অপরাহ্ণ'
		 *
		 * @remarks
		 *- Supported format tokens include: `YYYY`, `YY`, `mmmm`, `mmm`, `MM`, `M`, `DD`, `D`, `dd`, `ddd`, `Do`, `HH`, `H`, `hh`, `h`, `mm`, `m`, `ss`, `s`, `ms`, `mss`, `a`, `A`, `ZZ`, `Z`. `SS`, `S` and.
		 *   - **Year**: `YYYY/yyyy` (full year), `YY/yy` (last 2 digits)
		 *   - **Month**: `M/MM`(padded), `mmm` (short name), `mmmm` (full name)
		 *   - **Day**: `D/DD`(padded), Do (results same as cardinal for Bangla dates)
		 *   - **Weekday**: `d` (short), `dd` (without 'বার'), `ddd` (full)
		 *   - **Time**: `H/HH` (24h), `h/hh` (12h), `m/mm` (minute), `s/ss` (second), `ms/mss` (millisecond)
		 *   - **Period**: `a/A` (am/pm => পূর্বাহ্ণ/অপরাহ্ণ )
		 *   - **Timezone**: `Z/ZZ` (offset)
		 *   - **Season**: `S` (season), `SS` (season with 'কাল' suffix)
		 * - To output raw text (i.e., not interpreted as a date token), wrap it in square brackets.
		 * - For example, `[আজ] ddd` results in `আজ রবিবার`, and `[year ]YYYY` results in `year ২০২৫`.
		 * - *Any token not wrapped in brackets will be parsed and replaced with its corresponding date component.*
		 */
		formatBangla(format?: StrictFormat, options?: BnCalendarConfig): string;

		/**
		 * @instance Gets the Bangla calendar year for the current date.
		 *
		 * @param locale - Output locale ('bn' for Bangla digits, 'en' for Latin digits)
		 * @returns Bangla year in the specified locale format
		 *
		 * @example
		 * const chronos = new Chronos('2023-04-14');
		 * chronos.getBanglaYear(); // Returns: '১৪৩০'
		 * chronos.getBanglaYear('en'); // Returns: 1430
		 *
		 * @remarks
		 * - The Bangla year starts on April 14th in the Gregorian calendar.
		 * - Year 0 corresponds to 593 CE in the Gregorian calendar.
		 */
		getBanglaYear<Locale extends $BnEn = 'bn'>(locale?: Locale): $BanglaYear<Locale>;

		/**
		 * @instance Gets the Bangla calendar month for the current date.
		 *
		 * @param options - Configuration options including locale and calendar variant
		 * @returns Bangla month in the specified locale format (1-12)
		 *
		 * @example
		 * const chronos = new Chronos('2023-04-14');
		 * chronos.getBanglaMonth(); // Returns: '১' (বৈশাখ)
		 * chronos.getBanglaMonth({ locale: 'en' }); // Returns: 1
		 * chronos.getBanglaMonth({ variant: 'revised-1966' }); // Returns: '১' with 1966 variant
		 *
		 * @remarks
		 * - Month 1 corresponds to বৈশাখ (mid-April to mid-May).
		 * - The result may vary slightly between calendar variants for dates near month boundaries.
		 */
		getBanglaMonth<Locale extends $BnEn = 'bn'>(
			options?: BanglaDateOptions<Locale>
		): $BanglaMonth<Locale>;

		/**
		 * @instance Gets the Bangla calendar day of the month for the current date.
		 *
		 * @param options - Configuration options including locale and calendar variant
		 * @returns Bangla day of month in the specified locale format (1-31)
		 *
		 * @example
		 * const chronos = new Chronos('2023-04-14');
		 * chronos.getBanglaDay(); // Returns: '১'
		 * chronos.getBanglaDay({ locale: 'en' }); // Returns: 1
		 * chronos.getBanglaDay({ variant: 'revised-1966' }); // Returns: '১' with 1966 variant
		 *
		 * @remarks
		 * - The day number is 1-based (১ = first day of the month).
		 * - Different calendar variants may have different month lengths for leap years.
		 */
		getBanglaDay<Locale extends $BnEn = 'bn'>(
			options?: BanglaDateOptions<Locale>
		): $BanglaMonthDate<Locale>;

		/**
		 * @instance Gets the Bangla name of the weekday for the current date.
		 *
		 * @param locale - Output locale ('bn' for Bengali, 'en' for English)
		 * @returns Name of the weekday in the specified locale
		 *
		 * @example
		 * const chronos = new Chronos('2023-04-14'); // Friday
		 * chronos.getBanglaDayName(); // Returns: 'শুক্রবার'
		 * chronos.getBanglaDayName('en'); // Returns: 'Shukrobar (Friday)'
		 *
		 * @remarks
		 * - Weekday names follow the standard Bengali naming convention ending with 'বার'.
		 * - English names are the Latin transliterations of the Bangla names with standard English weekday names.
		 */
		getBanglaDayName<Locale extends $BnEn = 'bn'>(locale?: Locale): BanglaDayName<Locale>;

		/**
		 * @instance Gets the Bangla name of the month for the current date.
		 *
		 * @param options - Configuration options including locale and calendar variant
		 * @returns Name of the month in the specified locale
		 *
		 * @example
		 * const chronos = new Chronos('2023-04-14');
		 * chronos.getBanglaMonthName(); // Returns: 'বৈশাখ'
		 * chronos.getBanglaMonthName({ locale: 'en' }); // Returns: 'Boishakh'
		 * chronos.getBanglaMonthName({ variant: 'revised-1966' }); // Returns: 'বৈশাখ' with 1966 variant
		 *
		 * @remarks
		 * - Month names follow traditional Bengali naming conventions.
		 * - English names are transliterated versions of the Bengali names.
		 * - Month determination may vary slightly between calendar variants near month boundaries.
		 */
		getBanglaMonthName<Locale extends $BnEn = 'bn'>(
			options?: BanglaDateOptions<Locale>
		): BanglaMonthName<Locale>;

		/**
		 * @instance Gets the Bangla season name for the current date.
		 *
		 * @param options - Configuration options including locale and calendar variant
		 * @returns Name of the season in the specified locale
		 *
		 * @example
		 * const chronos = new Chronos('2023-04-14');
		 * chronos.getBanglaSeasonName(); // Returns: 'গ্রীষ্ম'
		 * chronos.getBanglaSeasonName({ locale: 'en' }); // Returns: 'Grisma (Summer)'
		 *
		 * @remarks
		 * Bangla calendar is traditionally divided into 6 seasons (ঋতু):
		 * - গ্রীষ্ম (Summer): Mid-April to Mid-June
		 * - বর্ষা (Monsoon): Mid-June to Mid-August
		 * - শরৎ (Autumn): Mid-August to Mid-October
		 * - হেমন্ত (Late Autumn): Mid-October to Mid-December
		 * - শীত (Winter): Mid-December to Mid-February
		 * - বসন্ত (Spring): Mid-February to Mid-April
		 */
		getBanglaSeasonName<Locale extends $BnEn = 'bn'>(
			options?: BanglaDateOptions<Locale>
		): BanglaSeasonName<Locale>;

		/**
		 * @instance Sets the default Bangla calendar variant globally for all `Chronos` instances.
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

/** * Plugin to inject methods related to Bangla calendar system (`Bongabdo`) */
export const banglaPlugin = ($Chronos: $Chronos): void => {
	const { internalDate: $Date } = $Chronos[INTERNALS];

	const DEFAULT_CONFIG = new Map<'config', BnCalendarConfig>();

	function $bnDaysMonthIdx(date: Date, variant?: BnCalendarVariant) {
		return _bnDaysMonthIdx(date, variant ?? DEFAULT_CONFIG.get('config')?.variant);
	}

	$Chronos.prototype.configureBanglaCalendar = function (configs) {
		DEFAULT_CONFIG.set('config', configs);
	};

	$Chronos.prototype.getBanglaYear = function <L extends $BnEn>(locale = 'bn' as L) {
		const bnYear = _getBnYear($Date(this));

		return (locale === 'en' ? bnYear : digitToBangla(bnYear)) as $BanglaYear<L>;
	};

	$Chronos.prototype.getBanglaMonth = function <L extends $BnEn>(
		options?: BanglaDateOptions<L>
	) {
		const { locale = 'bn', variant } = options ?? {};

		const isoMonth = $bnDaysMonthIdx($Date(this), variant).monthIdx + 1;

		return (locale === 'en' ? isoMonth : digitToBangla(isoMonth)) as $BanglaMonth<L>;
	};

	$Chronos.prototype.getBanglaDay = function <L extends $BnEn>(
		options?: BanglaDateOptions<L>
	) {
		const { locale = 'bn', variant } = options ?? {};

		const date = $bnDaysMonthIdx($Date(this), variant).days + 1;

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

		const { monthIdx } = $bnDaysMonthIdx($Date(this), variant);
		const MONTH = BN_MONTHS[monthIdx];

		return (locale === 'en' ? MONTH.en : MONTH.bn) as BanglaMonthName<L>;
	};

	$Chronos.prototype.getBanglaSeasonName = function (options) {
		const { locale, variant } = options ?? {};
		const { monthIdx } = $bnDaysMonthIdx($Date(this), variant);
		return _getBnSeason(monthIdx, locale);
	};

	$Chronos.prototype.toBangla = function <L extends $BnEn>(opts?: BanglaDateOptions<L>) {
		return {
			year: this.getBanglaYear(opts?.locale),
			month: this.getBanglaMonth(opts),
			date: this.getBanglaDay(opts),
			monthName: this.getBanglaMonthName(opts),
			dayName: this.getBanglaDayName(opts?.locale),
			seasonName: this.getBanglaSeasonName(opts),
			isLeapYear: _isBnLeapYear(_getBnYear($Date(this)), this.year, opts?.variant),
		} as BanglaDateObject<L>;
	};

	$Chronos.prototype.formatBangla = function (fmt, opts) {
		const { hour, minute, second, millisecond } = this.toObject();

		const D_NAME = BN_DAYS[this.weekDay];

		const { monthIdx } = $bnDaysMonthIdx($Date(this), opts?.variant);
		const M_NAME = BN_MONTHS[monthIdx];

		const month = this.getBanglaMonth();
		const year = this.getBanglaYear().padStart(4, '০');
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
			fmt || 'ddd, DD mmmm (SS), YYYY বঙ্গাব্দ - hh:mm:ss (A)',
			dateComponents
		);
	};
};
