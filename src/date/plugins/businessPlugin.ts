import { isValidArray } from '../../guards/non-primitives';
import { isUndefined } from '../../guards/primitives';
import type { Enumerate, NumberRange } from '../../number/types';
import type { RangeTuple } from '../../utils/types';
import { INTERNALS } from '../constants';
import type {
	$BusinessHourOptions,
	AcademicYear,
	BusinessOptionsBasic,
	BusinessOptionsWeekends,
	Quarter,
} from '../types';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Checks if the current date falls on a weekend using week start day and weekend length.
		 *
		 * @param weekStartsOn Optional. The day index (0–6) that the week starts on. Default is `0` (Sunday).
		 * @param weekendLength Optional. The number of consecutive days at the end of the week considered as weekend. Must be between 1 and 4. Default is `2`.
		 * @returns `true` if the current date is a weekend day according to the provided parameters; otherwise `false`.
		 *
		 * @description
		 * Determines whether the current date is considered part of the weekend.
		 *
		 * **Behavior:**
		 * - By default (`weekStartsOn = 0`, `weekendLength = 2`), Saturday (6) and Friday (5) are considered weekend.
		 * - `weekStartsOn` sets the start of the week for calculating weekend days.
		 * - `weekendLength` sets how many days at the end of the week are treated as weekend.
		 *
		 * @example
		 * // Default: Saturday & Friday are weekend
		 * new Chronos().isWeekend();
		 *
		 * // Custom week start (Monday) with 2-day weekend (Saturday & Sunday)
		 * new Chronos().isWeekend(1, 2);
		 *
		 * // Custom 3-day weekend (Friday, Saturday, Sunday)
		 * new Chronos().isWeekend(1, 3);
		 */
		isWeekend(weekStartsOn?: Enumerate<7>, weekendLength?: NumberRange<1, 4>): boolean;

		/**
		 * @instance Checks if the current date falls on a weekend using indices of weekend days.
		 *
		 * @param weekendDays A tuple of custom weekend day indices (0–6). Can pass only 1-4 elements.
		 * @returns `true` if the current date is a weekend day according to the provided `weekendDays`; otherwise `false`.
		 *
		 * @description
		 * Determines whether the current date is considered part of the weekend.
		 *
		 * **Behavior:**
		 * - `weekendDays` is used directly as the weekend days instead of calculating from `weekStartsOn` + `weekendLength`.
		 *
		 * @example
		 * // Fully custom weekend days (Sunday, Friday, Saturday)
		 * new Chronos().isWeekend([0, 5, 6]);
		 */
		isWeekend(weekendDays: RangeTuple<Enumerate<7>, 1, 4>): boolean;

		/**
		 * @instance Checks if the current date is a workday (non-weekend day) using week start day and weekend length.
		 *
		 * @param weekStartsOn Optional. The day index (0–6) that the week starts on. Default is `0` (Sunday).
		 * @param weekendLength Optional. The number of consecutive days at the end of the week considered as weekend. Must be between 1 and 4. Default is `2`.
		 * @returns `true` if the current date is a work day according to the provided parameters; otherwise `false`.
		 *
		 * @description
		 * Determines whether the current date is considered as workday. Internally uses {@link isWeekend} method.
		 *
		 * **Behavior:**
		 * - By default (`weekStartsOn = 0`, `weekendLength = 2`), Saturday (6) and Friday (5) are considered weekend.
		 * - `weekStartsOn` sets the start of the week for calculating weekend days.
		 * - `weekendLength` sets how many days at the end of the week are treated as weekend.
		 */
		isWorkday(weekStartsOn?: Enumerate<7>, weekendLength?: NumberRange<1, 4>): boolean;

		/**
		 * @instance Checks if the current date is a workday (non-weekend day) using indices of weekend days.
		 *
		 * @param weekendDays A tuple of custom weekend day indices (0–6). Can pass only 1-4 elements.
		 * @returns `true` if the current date is a work day according to the provided `weekendDays`; otherwise `false`.
		 *
		 * @description
		 * Determines whether the current date is considered as workday. Internally uses {@link isWeekend} method.
		 *
		 * **Behavior:**
		 * - `weekendDays` is used directly as the weekend days instead of calculating from `weekStartsOn` + `weekendLength`.
		 */
		isWorkday(weekendDays: RangeTuple<Enumerate<7>, 1, 4>): boolean;

		/**
		 * @instance Checks if the current date and time fall within business hours using week start day and weekend length & other options.
		 *
		 * @param options Options to configure business hour and weekends.
		 *
		 * @returns Whether the current time is within business hours.
		 *
		 * @remarks
		 * - Business hours are typically 9 AM to 5 PM on weekdays.
		 * - Supports standard and overnight business hours. Overnight means `end < start`.
		 * - Example: `businessStartHour = 22`, `businessEndHour = 6` will cover 10 PM to 6 AM next day.
		 *
		 * * *Weekends are determined by `weekStartsOn` and `weekendLength` using the {@link isWorkday} method.*
		 */
		isBusinessHour(options?: BusinessOptionsBasic): boolean;

		/**
		 * @instance Checks if the current date and time fall within business hours using indices of weekend days & other options.
		 *
		 * @param options Options to configure business hour and weekends.
		 *
		 * @returns Whether the current time is within business hours.
		 *
		 * @remarks
		 * - Business hours are typically 9 AM to 5 PM on weekdays.
		 * - Supports standard and overnight business hours. Overnight means `end < start`.
		 * - Example: `businessStartHour = 22`, `businessEndHour = 6` will cover 10 PM to 6 AM next day.
		 *
		 * * *Weekends are determined by `weekendDays` tuple using the {@link isWorkday} method.*
		 */
		isBusinessHour(options?: BusinessOptionsWeekends): boolean;

		/**
		 * @instance Returns the academic year based on a typical start in `July` and end in `June`.
		 * @returns The academic year in format `YYYY-YYYY`.
		 */
		toAcademicYear(): AcademicYear;

		/**
		 * @instance Returns the fiscal quarter based on custom fiscal year start (defaults to July).
		 * @param startMonth - The fiscal year start month (1-12), default is July (`7`).
		 * @returns The fiscal quarter (1-4).
		 */
		toFiscalQuarter(startMonth?: NumberRange<1, 12>): Quarter;
	}
}

/** * Plugin to inject `business` related methods */
export const businessPlugin = (ChronosClass: MainChronos): void => {
	const { internalDate } = ChronosClass[INTERNALS];

	ChronosClass.prototype.isWeekend = function (
		this: ChronosConstructor,
		determiner: Enumerate<7> | RangeTuple<Enumerate<7>, 1, 4> = 0,
		weekendLength: NumberRange<1, 4> = 2
	): boolean {
		const day = internalDate(this).getDay() as Enumerate<7>;

		// Use custom weekend days if provided
		if (isValidArray<Enumerate<7>>(determiner)) {
			return determiner.includes(day);
		}

		// Auto-calculate weekend days from start & length
		const lastDayOfWeek = (determiner + 6) % 7;

		const computedWeekendDays = Array.from(
			{ length: weekendLength },
			(_, i) => (lastDayOfWeek - i + 7) % 7
		);

		return computedWeekendDays.includes(day);
	};

	ChronosClass.prototype.isWorkday = function (
		this: ChronosConstructor,
		determiner: Enumerate<7> | RangeTuple<Enumerate<7>, 1, 4> = 0,
		weekendLength: NumberRange<1, 4> = 2
	): boolean {
		if (isValidArray<Enumerate<7>>(determiner)) {
			return !this.isWeekend(determiner);
		}

		return !this.isWeekend(determiner, weekendLength);
	};

	ChronosClass.prototype.isBusinessHour = function (
		this: ChronosConstructor,
		options?: $BusinessHourOptions
	): boolean {
		const _isBusinessHour = (): boolean => {
			const { businessStartHour = 9, businessEndHour = 17 } = options ?? {};

			if (businessStartHour === businessEndHour) {
				return false;
			}

			const hour = internalDate(this).getHours();

			if (businessStartHour < businessEndHour) {
				// Normal range, e.g. 9 → 17
				return hour >= businessStartHour && hour < businessEndHour;
			} else {
				// Overnight shift, e.g. 22 → 6
				return hour >= businessStartHour || hour < businessEndHour;
			}
		};

		if (options && 'weekendDays' in options && !isUndefined(options?.weekendDays)) {
			return this.isWorkday(options?.weekendDays) && _isBusinessHour();
		}

		const { weekStartsOn = 0, weekendLength = 2 } = (options ?? {}) as BusinessOptionsBasic;

		return this.isWorkday(weekStartsOn, weekendLength) && _isBusinessHour();
	};

	ChronosClass.prototype.toFiscalQuarter = function (
		this: ChronosConstructor,
		startMonth: NumberRange<1, 12> = 7
	): Quarter {
		const month = internalDate(this).getMonth() + 1;
		const adjusted = (month - startMonth + 12) % 12;

		return (Math.floor(adjusted / 3) + 1) as Quarter;
	};

	ChronosClass.prototype.toAcademicYear = function (this: ChronosConstructor): AcademicYear {
		const year = internalDate(this).getFullYear();
		const month = internalDate(this).getMonth();

		if (month >= 6) {
			return `${year}-${year + 1}`;
		} else {
			return `${year - 1}-${year}`;
		}
	};
};
