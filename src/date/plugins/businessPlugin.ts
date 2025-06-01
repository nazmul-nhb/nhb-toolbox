import type { Enumerate, NumberRange } from '../../number/types';
import { INTERNALS } from '../constants';
import type { BusinessHourOptions, Quarter } from '../types';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Checks if the current date falls on a weekend.
		 *
		 * @param weekStartsOn Optional day the week starts on (0–6). Default is `0` (Sunday).
		 * @param weekendLength Optional length of the weekend (1 or 2). Default is `2`.
		 * @returns Whether the date is a weekend.
		 *
		 * @description
		 * Weekend is determined based on `weekStartsOn` and `weekendLength`.
		 *
		 * - `weekStartsOn` is a 0-based index (0 = Sunday, 1 = Monday, ..., 6 = Saturday).
		 * - `weekendLength` defines how many days are considered weekend (1 or 2). Default is 2.
		 *   If 1, only the last day of the week is treated as weekend.
		 *   If 2, the last two days are treated as weekend.
		 */
		isWeekend(weekStartsOn?: Enumerate<7>, weekendLength?: 1 | 2): boolean;
		/**
		 * @instance Checks if the current date is a workday (non-weekend day).
		 *
		 * @param weekStartsOn Optional day the week starts on (0–6). Default is `0` (Sunday).
		 * @param weekendLength Optional length of the weekend (1 or 2). Default is `2`.
		 * @returns Whether the date is a workday.
		 *
		 * @description
		 * Weekends are determined by `weekStartsOn` and `weekendLength`.
		 *
		 * - `weekStartsOn` is a 0-based index (0 = Sunday, 1 = Monday, ..., 6 = Saturday).
		 * - `weekendLength` defines how many days are considered weekend (1 or 2). Default is 2.
		 */
		isWorkday(weekStartsOn?: Enumerate<7>, weekendLength?: 1 | 2): boolean;
		/**
		 * @instance Checks if the current date and time fall within business hours.
		 *
		 * @param options Options to configure business hour
		 *
		 * @returns Whether the current time is within business hours.
		 *
		 * @remarks
		 * * Business hours are typically 9 AM to 5 PM on weekdays.
		 * * Supports standard and overnight business hours. Overnight means `end < start`.
		 * * Example: `businessStartHour = 22`, `businessEndHour = 6` will cover 10 PM to 6 AM next day.
		 *
		 * * *Weekends are determined by `weekStartsOn` and `weekendLength` using the `isWeekend()` method.*
		 *
		 * - Business hours are `[businessStartHour, businessEndHour)`.
		 * - If `weekendLength` is `1`, only the last day of the week is treated as weekend.
		 * - If `weekendLength` is `2`, the last two days are treated as weekend.
		 */
		isBusinessHour(options?: BusinessHourOptions): boolean;

		/**
		 * @instance Returns the academic year based on a typical start in July and end in June.
		 * @returns The academic year in format `YYYY-YYYY`.
		 */
		toAcademicYear(): `${number}-${number}`;

		/**
		 * @instance Returns the fiscal quarter based on custom fiscal year start (defaults to July).
		 * @param startMonth - The fiscal year start month (1-12), default is July (7).
		 * @returns The fiscal quarter (1-4).
		 */
		toFiscalQuarter(startMonth?: NumberRange<1, 12>): Quarter;
	}
}

/** * Plugin to inject `business` related methods */
export const businessPlugin = (ChronosClass: MainChronos): void => {
	ChronosClass.prototype.isWeekend = function (
		this: ChronosConstructor,
		weekStartsOn: Enumerate<7> = 0,
		weekendLength: 1 | 2 = 2,
	): boolean {
		const day = ChronosClass[INTERNALS].internalDate(this).getDay();
		const lastDayOfWeek = (weekStartsOn + 6) % 7;
		const secondLastDay = (weekStartsOn + 5) % 7;

		if (weekendLength === 1) {
			return day === lastDayOfWeek;
		}

		return day === lastDayOfWeek || day === secondLastDay;
	};

	ChronosClass.prototype.isWorkday = function (
		this: ChronosConstructor,
		weekStartsOn: Enumerate<7> = 0,
		weekendLength: 1 | 2 = 2,
	): boolean {
		return !this.isWeekend(weekStartsOn, weekendLength);
	};

	ChronosClass.prototype.isBusinessHour = function (
		this: ChronosConstructor,
		options?: BusinessHourOptions,
	): boolean {
		const {
			businessStartHour = 9,
			businessEndHour = 17,
			weekStartsOn = 0,
			weekendLength = 2,
		} = options ?? {};

		if (this.isWeekend(weekStartsOn, weekendLength)) {
			return false;
		}

		const hour = ChronosClass[INTERNALS].internalDate(this).getHours();

		if (businessStartHour === businessEndHour) {
			return false;
		}

		if (businessStartHour < businessEndHour) {
			// Normal range, e.g. 9 → 17
			return hour >= businessStartHour && hour < businessEndHour;
		} else {
			// Overnight shift, e.g. 22 → 6
			return hour >= businessStartHour || hour < businessEndHour;
		}
	};

	ChronosClass.prototype.toFiscalQuarter = function (
		this: ChronosConstructor,
		startMonth: NumberRange<1, 12> = 7,
	): Quarter {
		const month = ChronosClass[INTERNALS].internalDate(this).getMonth() + 1;
		const adjusted = (month - startMonth + 12) % 12;
		return (Math.floor(adjusted / 3) + 1) as Quarter;
	};

	ChronosClass.prototype.toAcademicYear = function (
		this: ChronosConstructor,
	): `${number}-${number}` {
		const year = ChronosClass[INTERNALS].internalDate(this).getFullYear();
		const month = ChronosClass[INTERNALS].internalDate(this).getMonth();

		if (month >= 6) {
			return `${year}-${year + 1}`;
		} else {
			return `${year - 1}-${year}`;
		}
	};
};
