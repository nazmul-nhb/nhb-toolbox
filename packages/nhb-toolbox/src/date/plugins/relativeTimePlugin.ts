import { INTERNALS } from '../constants';
import type { $Chronos, ChronosInput, TimeUnit } from '../types';

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Returns the number of full years between the input date and now.
		 * @param time Optional time to compare with the `Chronos` date/time. Defaults to current time.
		 * @returns The difference in number, negative when `Chronos` time is a past time else positive.
		 */
		getRelativeYear(time?: ChronosInput): number;

		/**
		 * @instance Returns the number of full months between the input date and now.
		 * @param time Optional time to compare with the `Chronos` date/time. Defaults to current time.
		 * @returns The difference in number, negative when `Chronos` time is a past time else positive.
		 */
		getRelativeMonth(time?: ChronosInput): number;

		/**
		 * @instance Determines if the given date is today, tomorrow, yesterday or any relative day.
		 * @param date - The date to compare (Date object).
		 * @param time Optional time to compare with the `Chronos` date/time. Defaults to current time.
		 * @returns
		 *  - `-1` if the date is yesterday.
		 *  - `0` if the date is today.
		 *  - `1` if the date is tomorrow.
		 *  - Other positive or negative numbers for other relative days (e.g., `-2` for two days ago, `2` for two days ahead).
		 */
		getRelativeWeek(time?: ChronosInput): number;

		/**
		 * @instance Returns the number of full hours between the input date and now.
		 * @param time Optional time to compare with the `Chronos` date/time. Defaults to current time.
		 * @returns The difference in number, negative when `Chronos` time is a past time else positive.
		 */
		getRelativeDay(time?: ChronosInput): number;

		/**
		 * @instance Determines how many full weeks apart the input date is from the `Chronos` instance.
		 * @param time Optional time to compare with the `Chronos` date/time. Defaults to current time.
		 * @returns Difference in weeks; negative if past, positive if future.
		 */
		getRelativeHour(time?: ChronosInput): number;

		/**
		 * @instance Returns the number of full minutes between the input date and now.
		 * @param time Optional time to compare with the `Chronos` date/time. Defaults to current time.
		 * @returns The difference in number, negative when `Chronos` time is a past time else positive.
		 */
		getRelativeMinute(time?: ChronosInput): number;

		/**
		 * @instance Returns the number of full seconds between the input date and now.
		 * @param time Optional time to compare with the `Chronos` date/time. Defaults to current time.
		 * @returns The difference in number, negative when `Chronos` time is a past time else positive.
		 */
		getRelativeSecond(time?: ChronosInput): number;

		/**
		 * @instance Returns the number of milliseconds between the input date and now.
		 * @param time Optional time to compare with the `Chronos` date/time. Defaults to current time.
		 * @returns The difference in number, negative when `Chronos` time is a past time else positive.
		 */
		getRelativeMilliSecond(time?: ChronosInput): number;

		/**
		 * @instance Compares the stored date with now, returning the relative difference in the specified unit.
		 *
		 * @remarks
		 * - Internally uses {@link getRelativeYear}, {@link getRelativeMonth}, {@link getRelativeWeek}, {@link getRelativeDay}, {@link getRelativeHour}, {@link getRelativeMinute}, {@link getRelativeSecond} and {@link getRelativeMilliSecond} and rounds the result.
		 * - To calculate accurate difference use {@link diff} method.
		 *
		 * @param unit The time unit to compare by. Defaults to `'minute'`.
		 * @param time Optional time to compare with the `Chronos` date/time. Defaults to current time.
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
export const relativeTimePlugin = ($Chronos: $Chronos): void => {
	const { toNewDate } = $Chronos[INTERNALS];

	$Chronos.prototype.getRelativeYear = function (time) {
		const $date = this.toDate();
		const now = toNewDate(this, time);

		let years = $date.getFullYear() - now.getFullYear();

		const noYearMonthDay =
			now.getMonth() < $date.getMonth() ||
			(now.getMonth() === $date.getMonth() && now.getDate() < $date.getDate());

		if (noYearMonthDay) {
			years--;
		}

		return years;
	};

	$Chronos.prototype.getRelativeMonth = function (time) {
		const $date = this.toDate();
		const now = toNewDate(this, time);

		let months =
			($date.getFullYear() - now.getFullYear()) * 12 +
			($date.getMonth() - now.getMonth());

		const hasNotHadMonthDay = now.getDate() < $date.getDate();

		if (hasNotHadMonthDay) {
			months--;
		}

		return months;
	};

	$Chronos.prototype.getRelativeWeek = function (time) {
		const relativeDays = this.getRelativeDay(time);
		return Math.floor(relativeDays / 7);
	};

	$Chronos.prototype.getRelativeDay = function (time) {
		const now = toNewDate(this, time);
		// Set the time of today to 00:00:00 for comparison purposes
		now.setHours(0, 0, 0, 0);

		// Normalize the input date to 00:00:00
		const $date = new Date(this.toDate());
		$date.setHours(0, 0, 0, 0);

		const diffTime = $date.getTime() - now.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		return diffDays;
	};

	$Chronos.prototype.getRelativeHour = function (time) {
		const diff = this.getTimeStamp() - toNewDate(this, time).getTime();

		return Math.floor(diff / (1000 * 60 * 60));
	};

	$Chronos.prototype.getRelativeMinute = function (time) {
		const diff = this.getTimeStamp() - toNewDate(this, time).getTime();

		return Math.floor(diff / (1000 * 60));
	};

	$Chronos.prototype.getRelativeSecond = function (time) {
		const diff = this.getTimeStamp() - toNewDate(this, time).getTime();
		return Math.floor(diff / 1000);
	};

	$Chronos.prototype.getRelativeMilliSecond = function (time) {
		return this.getTimeStamp() - toNewDate(this, time).getTime();
	};

	$Chronos.prototype.compare = function (unit: TimeUnit = 'minute', time) {
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
				throw new RangeError(`Unsupported time unit: ${unit}`);
		}
	};

	$Chronos.prototype.isToday = function (this) {
		return this.getRelativeDay() === 0;
	};

	$Chronos.prototype.isTomorrow = function (this) {
		return this.getRelativeDay() === 1;
	};

	$Chronos.prototype.isYesterday = function (this) {
		return this.getRelativeDay() === -1;
	};
};
