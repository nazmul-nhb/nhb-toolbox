import { isValidArray } from '../../guards/non-primitives';
import type { Enumerate, NumberRange } from '../../number/types';
import type { TupleOf } from '../../utils/types';
import { INTERNALS } from '../constants';
import type { BusinessHourOptions, Quarter } from '../types';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Checks if the current date falls on a weekend.
		 *
		 * @param weekStartsOn Optional. The day index (0–6) that the week starts on. Default is `0` (Sunday).
		 * @param weekendLength Optional. The number of consecutive days at the end of the week considered as weekend. Must be between 1 and 4. Default is `2`.
		 * @param weekendDays Optional. A tuple of custom weekend day indices (0–6). Its length must match `weekendLength`. If provided, this overrides `weekStartsOn` + `weekendLength` calculation.
		 * @returns `true` if the current date is a weekend day according to the provided parameters; otherwise `false`.
		 *
		 * @description
		 * Determines whether the current date is considered part of the weekend.
		 *
		 * Behavior:
		 * - By default (`weekStartsOn = 0`, `weekendLength = 2`), Saturday (6) and Friday (5) are considered weekend.
		 * - `weekStartsOn` sets the start of the week for calculating weekend days.
		 * - `weekendLength` sets how many days at the end of the week are treated as weekend.
		 * - `weekendDays`, if provided, is used directly as the weekend days instead of calculating from `weekStartsOn` + `weekendLength`.
		 *
		 * @example
		 * // Default: Saturday & Sunday
		 * new Chronos().isWeekend();
		 *
		 * // Custom week start (Monday) with 2-day weekend (Saturday & Sunday)
		 * new Chronos().isWeekend(1, 2);
		 *
		 * // Custom 3-day weekend (Friday–Sunday)
		 * new Chronos().isWeekend(1, 3);
		 *
		 * // Fully custom weekend days (Sunday, Friday, Saturday)
		 * new Chronos().isWeekend(0, 3, [0, 5, 6]);
		 */
		isWeekend<Length extends NumberRange<1, 4>>(
			weekStartsOn?: Enumerate<7>,
			weekendLength?: Length,
			weekendDays?: TupleOf<Enumerate<7>, Length>
		): boolean;

		/**
		 * @instance Checks if the current date is a workday (non-weekend day).
		 *
		 * @param weekStartsOn Optional. The day index (0–6) that the week starts on. Default is `0` (Sunday).
		 * @param weekendLength Optional. The number of consecutive days at the end of the week considered as weekend. Must be between 1 and 4. Default is `2`.
		 * @param weekendDays Optional. A tuple of custom weekend day indices (0–6). Its length must match `weekendLength`. If provided, this overrides `weekStartsOn` + `weekendLength` calculation.
		 * @returns `true` if the current date is a work day according to the provided parameters; otherwise `false`.
		 *
		 * @description
		 * Determines whether the current date is considered as workday. Internally uses {@link isWeekend} method.
		 *
		 * Behavior:
		 * - By default (`weekStartsOn = 0`, `weekendLength = 2`), Saturday (6) and Friday (5) are considered weekend.
		 * - `weekStartsOn` sets the start of the week for calculating weekend days.
		 * - `weekendLength` sets how many days at the end of the week are treated as weekend.
		 * - `weekendDays`, if provided, is used directly as the weekend days instead of calculating from `weekStartsOn` + `weekendLength`.
		 *
		 * @remarks Please, refer to {@link isWeekend} method.
		 */
		isWorkday<Length extends NumberRange<1, 4>>(
			weekStartsOn?: Enumerate<7>,
			weekendLength?: Length,
			weekendDays?: TupleOf<Enumerate<7>, Length>
		): boolean;

		/**
		 * @instance Checks if the current date and time fall within business hours.
		 *
		 * @param options Options to configure business hour
		 *
		 * @returns Whether the current time is within business hours.
		 *
		 * @remarks
		 * - Business hours are typically 9 AM to 5 PM on weekdays.
		 * - Supports standard and overnight business hours. Overnight means `end < start`.
		 * - Example: `businessStartHour = 22`, `businessEndHour = 6` will cover 10 PM to 6 AM next day.
		 *
		 * * *Weekends are determined by `weekStartsOn` and `weekendLength` or `weekdays` array if provided using the {@link isWeekend()} method.*
		 */
		isBusinessHour<Length extends NumberRange<1, 4>>(
			options?: BusinessHourOptions<Length>
		): boolean;

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

		countBusinessDays(): number;
	}
}

/** * Plugin to inject `business` related methods */
export const businessPlugin = (ChronosClass: MainChronos): void => {
	const internalDate = ChronosClass[INTERNALS].internalDate;

	ChronosClass.prototype.isWeekend = function <Length extends NumberRange<1, 4>>(
		this: ChronosConstructor,
		weekStartsOn: Enumerate<7> = 0,
		weekendLength: Length = 2 as Length,
		weekendDays?: TupleOf<Enumerate<7>, Length>
	): boolean {
		const day = internalDate(this).getDay() as Enumerate<7>;

		// Use custom weekend days if provided
		if (isValidArray<Enumerate<7>>(weekendDays)) {
			return (weekendDays as TupleOf<Enumerate<7>, 4>).includes(day);
		}

		// Auto-calculate weekend days from start & length
		const lastDayOfWeek = (weekStartsOn + 6) % 7;

		const computedWeekendDays = Array.from(
			{ length: weekendLength },
			(_, i) => (lastDayOfWeek - i + 7) % 7
		);

		return computedWeekendDays.includes(day);
	};

	ChronosClass.prototype.isWorkday = function <Length extends NumberRange<1, 4>>(
		this: ChronosConstructor,
		weekStartsOn: Enumerate<7> = 0,
		weekendLength: Length = 2 as Length,
		weekendDays?: TupleOf<Enumerate<7>, Length>
	): boolean {
		return !this.isWeekend(weekStartsOn, weekendLength, weekendDays);
	};

	ChronosClass.prototype.isBusinessHour = function <Length extends NumberRange<1, 4>>(
		this: ChronosConstructor,
		options?: BusinessHourOptions<Length>
	): boolean {
		const {
			businessStartHour = 9,
			businessEndHour = 17,
			weekStartsOn = 0,
			weekendLength = 2 as Length,
			weekendDays,
		} = options ?? {};

		if (this.isWeekend(weekStartsOn, weekendLength, weekendDays)) {
			return false;
		}

		const hour = internalDate(this).getHours();

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
		startMonth: NumberRange<1, 12> = 7
	): Quarter {
		const month = internalDate(this).getMonth() + 1;
		const adjusted = (month - startMonth + 12) % 12;
		return (Math.floor(adjusted / 3) + 1) as Quarter;
	};

	ChronosClass.prototype.toAcademicYear = function (
		this: ChronosConstructor
	): `${number}-${number}` {
		const year = internalDate(this).getFullYear();
		const month = internalDate(this).getMonth();

		if (month >= 6) {
			return `${year}-${year + 1}`;
		} else {
			return `${year - 1}-${year}`;
		}
	};
};
