import { formatUnitWithPlural } from '../../string/convert';
import { INTERNALS } from '../constants';
import type { ChronosInput, FromNowUnit } from '../types';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Returns full time difference from now (or a specified time) down to a given level.
		 *
		 * @param level Determines the smallest unit to include in the output (e.g., 'minute' will show up to minutes, ignoring seconds). Defaults to `second`.
		 * @param withSuffixPrefix If `true`, adds `"in"` or `"ago"` depending on whether the time is in the future or past. Defaults to `true`.
		 * @param time An optional time value to compare with (`string`, `number`, `Date`, or `Chronos` instance). Defaults to `now`.
		 * @returns The difference as a human-readable string, e.g., `2 years 1 month 9 days 18 hours 56 minutes ago`.
		 *
		 *  @remarks
		 * - This method calculates the **elapsed time difference** (exclusive of the end day), consistent with libraries like `Day.js` and `Luxon`.
		 * - If you need an *inclusive calendar-style* difference (counting both start and end days), adjust one day manually before calling `fromNow()`.
		 */
		fromNow(level?: FromNowUnit, withSuffixPrefix?: boolean, time?: ChronosInput): string;
	}
}

/** * Plugin to inject `fromNow` method */
export const fromNowPlugin = (ChronosClass: MainChronos): void => {
	const internal = ChronosClass[INTERNALS];

	ChronosClass.prototype.fromNow = function (
		this: ChronosConstructor,
		level: FromNowUnit = 'second',
		withSuffixPrefix: boolean = true,
		time?: ChronosInput
	): string {
		const now = internal.toNewDate(this, time);
		const target = internal.internalDate(this);

		const isFuture = target > now;

		const from = isFuture ? now : target;
		const to = isFuture ? target : now;

		let years = to.getFullYear() - from.getFullYear();
		let months = to.getMonth() - from.getMonth();
		let days = to.getDate() - from.getDate();
		let hours = to.getHours() - from.getHours();
		let minutes = to.getMinutes() - from.getMinutes();
		let seconds = to.getSeconds() - from.getSeconds();
		let milliseconds = to.getMilliseconds() - from.getMilliseconds();

		// Adjust negative values
		if (milliseconds < 0) {
			milliseconds += 1000;
			seconds--;
		}

		if (seconds < 0) {
			seconds += 60;
			minutes--;
		}

		if (minutes < 0) {
			minutes += 60;
			hours--;
		}

		if (hours < 0) {
			hours += 24;
			days--;
		}

		if (days < 0) {
			const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);

			days += prevMonth.getDate();
			months--;
		}

		if (months < 0) {
			months += 12;
			years--;
		}

		const unitOrder: Array<FromNowUnit> = [
			'year',
			'month',
			'day',
			'hour',
			'minute',
			'second',
			'millisecond',
		];

		const lvlIdx = unitOrder.indexOf(level);

		const parts: string[] = [];

		/** Push value-unit string to `parts` array */
		const _pushToParts = (value: number, unit: FromNowUnit) => {
			parts.push(formatUnitWithPlural(value, unit));
		};

		/** Check if a unit level is required */
		const _isLevelRequired = (unit: FromNowUnit) => {
			return lvlIdx >= unitOrder.indexOf(unit);
		};

		if (years > 0) {
			_pushToParts(years, 'year');
		}
		if (_isLevelRequired('month') && months > 0) {
			_pushToParts(months, 'month');
		}
		if (_isLevelRequired('day') && days > 0) {
			_pushToParts(days, 'day');
		}
		if (_isLevelRequired('hour') && hours > 0) {
			_pushToParts(hours, 'hour');
		}
		if (_isLevelRequired('minute') && minutes > 0) {
			_pushToParts(minutes, 'minute');
		}
		if (_isLevelRequired('second') && seconds > 0) {
			_pushToParts(seconds, 'second');
		}
		if (_isLevelRequired('millisecond') && (milliseconds > 0 || parts?.length === 0)) {
			_pushToParts(milliseconds, 'millisecond');
		}

		let prefix = '';
		let suffix = '';

		if (withSuffixPrefix) {
			if (isFuture) {
				prefix = 'in ';
			} else {
				suffix = ' ago';
			}
		}

		return `${prefix}${parts.length ? parts?.join(' ') : `0 ${level}`}${suffix}`;
	};
};
