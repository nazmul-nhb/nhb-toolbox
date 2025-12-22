import { isNonEmptyString, isNumber } from '../guards/primitives';
import { isDateString } from '../guards/specials';
import { banglaToDigit, digitToBangla } from '../number/convert';
import type { NumberRange } from '../number/types';
import { _bnDaysMonthIdx, _getBnYear } from './helpers';
import type { BanglaDate, BanglaMonth, BanglaYear, BnCalendarVariant } from './types';

export class BanglaCalendar {
	readonly year: { bn: BanglaYear; en: number };
	readonly month: { bn: BanglaMonth; en: NumberRange<1, 12> };
	readonly date: { bn: BanglaDate; en: NumberRange<1, 31> };

	readonly variant: BnCalendarVariant;

	#date: Date;

	constructor(variant?: BnCalendarVariant);

	constructor(date: string | number | Date, variant?: BnCalendarVariant);

	constructor(bnYear: BanglaYear, variant?: BnCalendarVariant);

	constructor(bnYear: BanglaYear, bnMonth: BanglaMonth, variant?: BnCalendarVariant);

	constructor(
		bnYear: BanglaYear,
		bnMonth: BanglaMonth,
		bnDate: BanglaDate,
		variant?: BnCalendarVariant
	);

	constructor(
		dbnyv?: string | number | Date | BanglaYear | BnCalendarVariant,
		bnmv?: BanglaMonth | BnCalendarVariant,
		bndv?: BanglaDate | BnCalendarVariant,
		variant?: BnCalendarVariant
	) {
		this.variant = this.#processVariants(dbnyv, bnmv, bndv, variant);

		const date =
			dbnyv instanceof Date ? dbnyv : (
				new Date(
					isDateString(dbnyv) ? dbnyv
					: isNumber(dbnyv) ? dbnyv
					: Date.now()
				)
			);

		if (!isNaN(date.getTime())) {
			this.#date = date;
		} else {
			this.#date = new Date();
		}

		const { year, month, monthDate } = this.#processDate();

		this.year =
			BanglaCalendar.isBanglaYear(dbnyv) ? { bn: dbnyv, en: banglaToDigit(dbnyv) } : year;

		this.month =
			BanglaCalendar.isBanglaMonth(bnmv) ?
				{ bn: bnmv, en: banglaToDigit(bnmv) as NumberRange<1, 12> }
			:	month;

		this.date =
			BanglaCalendar.isBanglaDate(bndv) ?
				{ bn: bndv, en: banglaToDigit(bndv) as NumberRange<1, 31> }
			:	monthDate;
	}

	#processVariants(v1: unknown, v2: unknown, v3: unknown, v4: unknown) {
		return (
			this.#isCalendarVariant(v1) ? v1
			: this.#isCalendarVariant(v2) ? v2
			: this.#isCalendarVariant(v3) ? v3
			: this.#isCalendarVariant(v4) ? v4
			: 'revised-2019'
		);
	}

	#processDate() {
		const bnYear = _getBnYear(this.#date);

		const { days, monthIdx } = _bnDaysMonthIdx(this.#date, this.variant);

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

	#isCalendarVariant(value: unknown): value is BnCalendarVariant {
		return (
			(isNonEmptyString(value) && value === 'revised-1966') || value === 'revised-2019'
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
	 * @static Checks whether a value is a valid Bangla month (`১–১২`)
	 * @param value Value to check
	 */
	static isBanglaMonth(value: unknown): value is BanglaMonth {
		return isNonEmptyString(value) && /^(?:[১-৯]|১০|১১|১২)$/.test(value);
	}

	/**
	 * @static Checks whether a value is a valid Bangla date of month (`১–৩১`)
	 * @param value Value to check
	 */
	static isBanglaDate(value: unknown): value is BanglaDate {
		return isNonEmptyString(value) && /^(?:[১-৯]|[১২][০-৯]|৩০|৩১)$/.test(value);
	}
}
