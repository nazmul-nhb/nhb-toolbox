import { INTERNALS } from '../constants';
import type { ChronosInput, TimeUnit } from '../types';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Returns the number of full years between the input date and now.
		 * @param time Optional time to compare with the `Chronos` date/time.
		 * @returns The difference in number, negative when `Chronos` time is a past time else positive.
		 */
		getRelativeYear(time?: ChronosInput): number;

		/**
		 * @instance Returns the number of full months between the input date and now.
		 * @param time Optional time to compare with the `Chronos` date/time.
		 * @returns The difference in number, negative when `Chronos` time is a past time else positive.
		 */
		getRelativeMonth(time?: ChronosInput): number;

		/**
		 * @instance Determines if the given date is today, tomorrow, yesterday or any relative day.
		 * @param date - The date to compare (Date object).
		 * @param time Optional time to compare with the `Chronos` date/time.
		 * @returns
		 *  - `-1` if the date is yesterday.
		 *  - `0` if the date is today.
		 *  - `1` if the date is tomorrow.
		 *  - Other positive or negative numbers for other relative days (e.g., `-2` for two days ago, `2` for two days ahead).
		 */
		getRelativeWeek(time?: ChronosInput): number;

		/**
		 * @instance Returns the number of full hours between the input date and now.
		 * @param time Optional time to compare with the `Chronos` date/time.
		 * @returns The difference in number, negative when `Chronos` time is a past time else positive.
		 */
		getRelativeDay(time?: ChronosInput): number;

		/**
		 * @instance Determines how many full weeks apart the input date is from the `Chronos` instance.
		 * @param time Optional time to compare with the `Chronos` date/time.
		 * @returns Difference in weeks; negative if past, positive if future.
		 */
		getRelativeHour(time?: ChronosInput): number;

		/**
		 * @instance Returns the number of full minutes between the input date and now.
		 * @param time Optional time to compare with the `Chronos` date/time.
		 * @returns The difference in number, negative when `Chronos` time is a past time else positive.
		 */
		getRelativeMinute(time?: ChronosInput): number;

		/**
		 * @instance Returns the number of full seconds between the input date and now.
		 * @param time Optional time to compare with the `Chronos` date/time.
		 * @returns The difference in number, negative when `Chronos` time is a past time else positive.
		 */
		getRelativeSecond(time?: ChronosInput): number;

		/**
		 * @instance Returns the number of milliseconds between the input date and now.
		 * @param time Optional time to compare with the `Chronos` date/time.
		 * @returns The difference in number, negative when `Chronos` time is a past time else positive.
		 */
		getRelativeMilliSecond(time?: ChronosInput): number;

		/**
		 * @instance Compares the stored date with now, returning the difference in the specified unit.
		 *
		 * @param unit The time unit to compare by. Defaults to 'minute'.
		 * @param time Optional time to compare with the `Chronos` date/time.
		 * @returns The difference in number, negative when `Chronos` time is a past time else positive.
		 */
		compare(unit?: TimeUnit, time?: ChronosInput): number;

		/** @instance Checks if the current date is today. */
		isToday(): boolean;

		/** @instance Checks if the current date is tomorrow. */
		isTomorrow(): boolean;

		/** @instance Checks if the current date is yesterday. */
		isYesterday(): boolean;
	}
}

/** * Plugin to inject `relative time` related methods */
export const relativeTimePlugin = (ChronosClass: MainChronos): void => {
	ChronosClass.prototype.getRelativeYear = function (
		this: ChronosConstructor,
		time?: ChronosInput
	): number {
		const inputDate = ChronosClass[INTERNALS].internalDate(this);

		const now = ChronosClass[INTERNALS].toNewDate(this, time);

		let years = inputDate.getFullYear() - now.getFullYear();

		const noYearMonthDay =
			now.getMonth() < inputDate.getMonth() ||
			(now.getMonth() === inputDate.getMonth() && now.getDate() < inputDate.getDate());

		if (noYearMonthDay) {
			years--;
		}

		return years;
	};

	ChronosClass.prototype.getRelativeMonth = function (
		this: ChronosConstructor,
		time?: ChronosInput
	): number {
		const now = ChronosClass[INTERNALS].toNewDate(this, time);
		const inputDate = ChronosClass[INTERNALS].internalDate(this);

		let months =
			(inputDate.getFullYear() - now.getFullYear()) * 12 +
			(inputDate.getMonth() - now.getMonth());

		const hasNotHadMonthDay = now.getDate() < inputDate.getDate();

		if (hasNotHadMonthDay) {
			months--;
		}

		return months;
	};

	ChronosClass.prototype.getRelativeWeek = function (
		this: ChronosConstructor,
		time?: ChronosInput
	): number {
		const relativeDays = this.getRelativeDay(time);
		return Math.floor(relativeDays / 7);
	};

	ChronosClass.prototype.getRelativeDay = function (
		this: ChronosConstructor,
		time?: ChronosInput
	): number {
		const today = ChronosClass[INTERNALS].toNewDate(this, time);
		// Set the time of today to 00:00:00 for comparison purposes
		today.setHours(0, 0, 0, 0);

		// Normalize the input date to 00:00:00
		const inputDate = ChronosClass[INTERNALS].internalDate(this);
		inputDate.setHours(0, 0, 0, 0);

		const diffTime = inputDate.getTime() - today.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		return diffDays;
	};

	ChronosClass.prototype.getRelativeHour = function (
		this: ChronosConstructor,
		time?: ChronosInput
	): number {
		const diff =
			ChronosClass[INTERNALS].internalDate(this).getTime() -
			ChronosClass[INTERNALS].toNewDate(this, time).getTime();

		return Math.floor(diff / (1000 * 60 * 60));
	};

	ChronosClass.prototype.getRelativeMinute = function (
		this: ChronosConstructor,
		time?: ChronosInput
	): number {
		const diff =
			ChronosClass[INTERNALS].internalDate(this).getTime() -
			ChronosClass[INTERNALS].toNewDate(this, time).getTime();

		return Math.floor(diff / (1000 * 60));
	};

	ChronosClass.prototype.getRelativeSecond = function (
		this: ChronosConstructor,
		time?: ChronosInput
	): number {
		const diff =
			ChronosClass[INTERNALS].internalDate(this).getTime() -
			ChronosClass[INTERNALS].toNewDate(this, time).getTime();
		return Math.floor(diff / 1000);
	};

	ChronosClass.prototype.getRelativeMilliSecond = function (
		this: ChronosConstructor,
		time?: ChronosInput
	): number {
		return (
			ChronosClass[INTERNALS].internalDate(this).getTime() -
			ChronosClass[INTERNALS].toNewDate(this, time).getTime()
		);
	};

	ChronosClass.prototype.compare = function (
		this: ChronosConstructor,
		unit: TimeUnit = 'minute',
		time?: ChronosInput
	): number {
		switch (unit) {
			case 'year':
				return this.getRelativeYear(time);
			case 'month':
				return this.getRelativeMonth(time);
			case 'day':
				return this.getRelativeDay(time);
			case 'week':
				return this.getRelativeWeek(time);
			case 'hour':
				return this.getRelativeHour(time);
			case 'minute':
				return this.getRelativeMinute(time);
			case 'second':
				return this.getRelativeSecond(time);
			case 'millisecond':
				return this.getRelativeMilliSecond(time);
			default:
				throw new Error(`Unsupported time unit: ${unit}`);
		}
	};

	ChronosClass.prototype.isToday = function (this: ChronosConstructor): boolean {
		return this.getRelativeDay() === 0;
	};

	ChronosClass.prototype.isTomorrow = function (this: ChronosConstructor): boolean {
		return this.getRelativeDay() === 1;
	};

	ChronosClass.prototype.isYesterday = function (this: ChronosConstructor): boolean {
		return this.getRelativeDay() === -1;
	};
};
