import { isObjectWithKeys } from '../guards/non-primitives';
import { isInteger, isNonEmptyString, isNumber } from '../guards/primitives';
import { isDateString } from '../guards/specials';
import { banglaToDigit, digitToBangla } from '../number/convert';
import type { NumberRange } from '../number/types';
import { BN_MONTH_TABLES, BN_YEAR_OFFSET, MS_PER_DAY } from './constants';
import { _bnDaysMonthIdx, _extractDateUnits, _getBnYear, _isBnLeapYear } from './helpers';
import type {
	BanglaDate,
	BanglaMonth,
	BanglaYear,
	BnCalendarConfig,
	BnCalendarVariant,
} from './types';

export class BanglaCalendar {
	/** Bangla calendar variant */
	readonly variant: BnCalendarVariant;

	/** Bangla year */
	readonly year: Readonly<{
		/** Bangla year in Bangla digit */
		bn: BanglaYear;
		/** Bangla year in Latin digit */
		en: number;
	}>;

	/** Bangla month */
	readonly month: Readonly<{
		/** Bangla month in Bangla digit */
		bn: BanglaMonth;
		/** Bangla month in Latin digit */
		en: NumberRange<1, 12>;
	}>;

	/** Bangla day of the month */
	readonly day: Readonly<{
		/** Bangla day of the month in Bangla digit */
		bn: BanglaDate;
		/** Bangla day of the month in Latin digit */
		en: NumberRange<1, 31>;
	}>;

	/** Gregorian equivalent of the current bangla date */
	readonly gregorian: Readonly<{
		/** Gregorian year in Latin digit */
		year: number;
		/** Gregorian month in Latin digit (`1-12`) */
		month: NumberRange<1, 12>;
		/** Gregorian day of the month in Latin digit (`1-31`) */
		day: NumberRange<1, 31>;
	}>;

	constructor(config?: BnCalendarConfig);

	constructor(date: string | Date, config?: BnCalendarConfig);

	constructor(tsOrBnYear: number, config?: BnCalendarConfig);

	constructor(bnYear: number, bnMonth: NumberRange<1, 12>, config?: BnCalendarConfig);

	constructor(
		bnYear: number,
		bnMonth: NumberRange<1, 12>,
		bnDay: NumberRange<1, 31>,
		config?: BnCalendarConfig
	);

	constructor(bnYear: BanglaYear, config?: BnCalendarConfig);

	constructor(bnYear: BanglaYear, bnMonth: BanglaMonth, config?: BnCalendarConfig);

	constructor(
		bnYear: BanglaYear,
		bnMonth: BanglaMonth,
		bnDay: BanglaDate,
		config?: BnCalendarConfig
	);

	constructor(
		dbnyv?: string | number | Date | BanglaYear | BnCalendarConfig,
		bnmv?: BanglaMonth | NumberRange<1, 12> | BnCalendarConfig,
		bndv?: BanglaDate | NumberRange<1, 31> | BnCalendarConfig,
		config?: BnCalendarConfig
	) {
		this.variant = this.#processVariants(dbnyv, bnmv, bndv, config);

		let date =
			dbnyv instanceof Date ? dbnyv : (
				new Date(
					isDateString(dbnyv) ? dbnyv
					: isNumber(dbnyv) && !BanglaCalendar.isBanglaYearEn(dbnyv) ? dbnyv
					: Date.now()
				)
			);

		if (isNaN(date.getTime())) {
			date = new Date();
		}

		const { year, month, monthDate } = this.#processDate(date);

		this.year =
			BanglaCalendar.isBanglaYear(dbnyv) ? { bn: dbnyv, en: banglaToDigit(dbnyv) }
			: isNumber(dbnyv) && BanglaCalendar.isBanglaYearEn(dbnyv) ?
				{ bn: digitToBangla(dbnyv) as BanglaYear, en: dbnyv }
			:	year;

		this.month =
			BanglaCalendar.isBanglaMonth(bnmv) ?
				{ bn: bnmv, en: banglaToDigit(bnmv) as NumberRange<1, 12> }
			: BanglaCalendar.isBanglaMonthEn(bnmv) ?
				{ bn: digitToBangla(bnmv) as BanglaMonth, en: bnmv }
			:	month;

		this.day =
			BanglaCalendar.isBanglaDate(bndv) ?
				{ bn: bndv, en: banglaToDigit(bndv) as NumberRange<1, 31> }
			: BanglaCalendar.isBanglaDateEn(bndv) ?
				{ bn: digitToBangla(bndv) as BanglaDate, en: bndv }
			:	monthDate;

		const { gy, gm, gd } = _extractDateUnits(this.toDate());

		this.gregorian = { year: gy, month: gm, day: gd };
	}

	isLeapYear(): boolean {
		return this.#getGregYearBnMonthTable().isBnLeapYear;
	}

	toDate(): Date {
		const { baseGregYear, bnMonthTable } = this.#getGregYearBnMonthTable();

		const epoch = Date.UTC(baseGregYear, 3, 13);

		let days = this.day.en;
		for (let i = 0; i < this.month.en - 1; i++) {
			days += bnMonthTable[i];
		}

		return new Date(days * MS_PER_DAY + epoch);
	}

	#getGregYearBnMonthTable() {
		const baseGregYear = this.year.en + BN_YEAR_OFFSET;

		const gregYear = this.month.en > 10 ? baseGregYear + 1 : baseGregYear;

		const isBnLeapYear = _isBnLeapYear(this.year.en, gregYear, this.variant);

		const bnMonthTable =
			isBnLeapYear ?
				BN_MONTH_TABLES?.[this.variant].leap
			:	BN_MONTH_TABLES?.[this.variant].normal;

		return { baseGregYear, gregYear, bnMonthTable, isBnLeapYear };
	}

	#processVariants(v1: unknown, v2: unknown, v3: unknown, v4: unknown) {
		return (
			this.#isConfig(v1) ? v1.variant
			: this.#isConfig(v2) ? v2.variant
			: this.#isConfig(v3) ? v3.variant
			: this.#isConfig(v4) ? v4.variant
			: 'revised-2019'
		);
	}

	#processDate(date: Date) {
		const bnYear = _getBnYear(date);

		const { days, monthIdx } = _bnDaysMonthIdx(date, this.variant);

		return {
			year: { bn: digitToBangla(bnYear) as BanglaYear, en: bnYear },
			month: { bn: digitToBangla(monthIdx + 1), en: monthIdx + 1 } as {
				bn: BanglaMonth;
				en: NumberRange<1, 12>;
			},
			monthDate: { bn: digitToBangla(days + 1), en: days + 1 } as {
				bn: BanglaDate;
				en: NumberRange<1, 31>;
			},
		};
	}

	#isConfig(value: unknown): value is Required<BnCalendarConfig> {
		return (
			isObjectWithKeys(value, ['variant']) &&
			isNonEmptyString(value.variant) &&
			(value.variant === 'revised-1966' || value.variant === 'revised-2019')
		);
	}

	/**
	 * @static Checks whether a value is a valid Bangla year (`০–৯৯৯৯`)
	 * @param value Value to check
	 */
	static isBanglaYear(value: unknown): value is BanglaYear {
		// /^[০-৯]{1,4}$/
		return isNonEmptyString(value) && /^(?:০|[১-৯][০-৯]{0,3})$/.test(value);
	}

	/**
	 * @static Checks whether a value is a valid Bangla year (`0–9999`)
	 * @param value Value to check
	 */
	static isBanglaYearEn(value: number): boolean {
		return isInteger(value) && value >= 0 && value <= 9999;
	}

	/**
	 * @static Checks whether a value is a valid Bangla month (`১–১২`)
	 * @param value Value to check
	 */
	static isBanglaMonth(value: unknown): value is BanglaMonth {
		return isNonEmptyString(value) && /^(?:[১-৯]|১০|১১|১২)$/.test(value);
	}

	/**
	 * @static Checks whether a value is a valid Bangla month (`1-12`)
	 * @param value Value to check
	 */
	static isBanglaMonthEn(value: unknown): value is NumberRange<1, 12> {
		return isInteger(value) && value >= 1 && value <= 12;
	}

	/**
	 * @static Checks whether a value is a valid Bangla date of month (`১–৩১`)
	 * @param value Value to check
	 */
	static isBanglaDate(value: unknown): value is BanglaDate {
		return isNonEmptyString(value) && /^(?:[১-৯]|[১২][০-৯]|৩০|৩১)$/.test(value);
	}

	/**
	 * @static Checks whether a value is a valid Bangla date of month (`১–৩১`)
	 * @param value Value to check
	 */
	static isBanglaDateEn(value: unknown): value is NumberRange<1, 31> {
		return isInteger(value) && value >= 1 && value <= 31;
	}
}
