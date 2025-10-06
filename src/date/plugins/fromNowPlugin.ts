import { formatUnitWithPlural } from '../../string/convert';
import { INTERNALS } from '../constants';
import type { ChronosInput, TimeUnit } from '../types';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Returns full time difference from now (or a specified time) down to a given level.
		 *
		 * @param level Determines the smallest unit to include in the output (e.g., 'minute' will show up to minutes, ignoring seconds). Defaults to `minute`.
		 * @param withSuffixPrefix If `true`, adds `"in"` or `"ago"` depending on whether the time is in the future or past. Defaults to `true`.
		 * @param time An optional time value to compare with (`string`, `number`, `Date`, or `Chronos` instance). Defaults to `now`.
		 * @returns The difference as a human-readable string, e.g., `2 years 1 month 9 days 18 hours 56 minutes ago`.
		 */
		fromNow(
			level: Exclude<TimeUnit, 'millisecond'>,
			withSuffixPrefix: boolean,
			time?: ChronosInput
		): string;
	}
}

/** * Plugin to inject `fromNow` method */
export const fromNowPlugin = (ChronosClass: MainChronos): void => {
	const internal = ChronosClass[INTERNALS];

	ChronosClass.prototype.fromNow = function (
		this: ChronosConstructor,
		level: Exclude<TimeUnit, 'millisecond'> = 'minute',
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
		let weeks = 0;
		let hours = to.getHours() - from.getHours();
		let minutes = to.getMinutes() - from.getMinutes();
		let seconds = to.getSeconds() - from.getSeconds();

		// Adjust negative values
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

		if (level === 'week' || level === 'day') {
			weeks = Math.floor(days / 7);
			days = days % 7;
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

		const unitOrder = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'] as const;

		const lvlIdx = unitOrder.indexOf(level);

		const parts: string[] = [];

		if (lvlIdx >= 0 && years > 0 && lvlIdx >= unitOrder.indexOf('year')) {
			parts?.push(formatUnitWithPlural(years, 'year'));
		}
		if (lvlIdx >= unitOrder.indexOf('month') && months > 0) {
			parts?.push(formatUnitWithPlural(months, 'month'));
		}
		if (lvlIdx >= unitOrder.indexOf('week') && weeks > 0) {
			parts?.push(formatUnitWithPlural(weeks, 'week'));
		}
		if (lvlIdx >= unitOrder.indexOf('day') && days > 0) {
			parts?.push(formatUnitWithPlural(days, 'day'));
		}
		if (lvlIdx >= unitOrder.indexOf('hour') && hours > 0) {
			parts?.push(formatUnitWithPlural(hours, 'hour'));
		}
		if (lvlIdx >= unitOrder.indexOf('minute') && minutes > 0) {
			parts?.push(formatUnitWithPlural(minutes, 'minute'));
		}
		if (lvlIdx >= unitOrder.indexOf('second') && (seconds > 0 || parts?.length === 0)) {
			parts?.push(formatUnitWithPlural(seconds, 'second'));
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

		return `${prefix}${parts?.join(' ')}${suffix}`;
	};
};
