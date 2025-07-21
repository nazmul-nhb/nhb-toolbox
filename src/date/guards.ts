import { isString } from '../guards/primitives';
import { isNumericString } from '../guards/specials';
import type { Numeric } from '../types/index';
import type { ClockTime, UTCOffSet } from './types';

/**
 * * Checks if the provided value is a valid time string in "HH:MM" format.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a valid time string, `false` otherwise.
 */
export function isValidTime(value: unknown): value is ClockTime {
	if (!isString(value)) return false;

	const [hourStr, minuteStr] = value.split(':');

	if (!isNumericString(hourStr) || !isNumericString(minuteStr)) return false;

	const hour = Number(hourStr);
	const minute = Number(minuteStr);

	return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

/**
 * * Checks if the provided value is a valid UTCOffSet (e.g. `UTC-01:30`).
 *
 * @param value - The value to check.
 * @returns `true` if the value is a valid utc offset, `false` otherwise.
 */
export function isValidUTCOffSet(value: unknown): value is UTCOffSet {
	if (!isString(value)) return false;

	return /^UTC[+-]?\d{1,2}:\d{2}$/.test(value);
}

/**
 * * Checks if the year is a leap year.
 *
 * - A year is a leap year if it is divisible by 4, but not divisible by 100, unless it is also divisible by 400.
 * - For example, 2000 and 2400 are leap years, but 1900 and 2100 are not.
 * @param year The year to check.
 * @returns `true` if the year is a leap year, `false` otherwise.
 */
export function isLeapYear(year: Numeric): boolean {
	return (
		(Number(year) % 4 === 0 && Number(year) % 100 !== 0) ||
		Number(year) % 400 === 0
	);
}

/**
 * * Checks if a value is a date-like object from `Date`, `Chronos`, `Moment.js`, `Day.js`, `Luxon`, `JS-Joda`, or `Temporal`
 * @param value Value to check if it is date-like object.
 * @returns `true` if the value is date-like object, otherwise `false`.
 */
export function isDateLike(value: unknown): boolean {
	if (value instanceof Date) return true;

	if (value && typeof value === 'object') {
		const v = value as Record<string, unknown>;

		// Chronos, Moment or Day.js
		if (
			typeof v.format === 'function' &&
			typeof v.toJSON === 'function' &&
			typeof v.toISOString === 'function'
		) {
			return true;
		}

		// Luxon
		if (
			typeof v.toISO === 'function' &&
			typeof v.toFormat === 'function' &&
			typeof v.isValid === 'boolean'
		) {
			return true;
		}

		// JS-Joda
		if (
			typeof v.plus === 'function' &&
			typeof v.minus === 'function' &&
			typeof v.equals === 'function' &&
			typeof v.getClass === 'function'
		) {
			return true;
		}

		// Temporal
		if (
			typeof v.toJSON === 'function' &&
			typeof v.toString === 'function' &&
			['PlainDate', 'ZonedDateTime', 'Instant'].includes(
				v.constructor?.name ?? ''
			)
		) {
			return true;
		}
	}

	return false;
}
