import { isFunction, isObject } from '../guards/non-primitives';
import { isBoolean, isNonEmptyString, isString } from '../guards/primitives';
import { isNumericString } from '../guards/specials';
import { normalizeNumber } from '../number/utilities';
import type { Numeric } from '../types/index';
import { IANA_TZ_IDS, NATIVE_TZ_IDS } from './timezone';
import type {
	$TimeZoneIdentifier,
	ClockTime,
	TimeWithUnit,
	TimeZoneIdNative,
	UTCOffset,
} from './types';

/**
 * * Checks if the provided value is a valid time string in "HH:MM" format.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a valid time string, `false` otherwise.
 */
export function isValidTime(value: unknown): value is ClockTime {
	if (!isNonEmptyString(value)) return false;

	const [hourStr, minuteStr] = value.split(':');

	if (!isNumericString(hourStr) || !isNumericString(minuteStr)) return false;

	const hour = Number(hourStr);
	const minute = Number(minuteStr);

	return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

/**
 * * Checks if the provided value is a valid `UTCOffset` (e.g. `UTC-01:30`).
 *
 * @param value - The value to check.
 * @returns `true` if the value is a valid utc offset, `false` otherwise.
 */
export function isValidUTCOffset(value: unknown): value is UTCOffset {
	return isString(value) ? /^UTC[+-]?\d{1,2}:\d{2}$/.test(value) : false;
}

/**
 * * Validates whether the provided value is a recognized IANA time zone identifier (excluding `"Factory"`), based on the {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones IANA TZ Database}.
 *
 * @remarks
 * - Relies on a large constant map of time zone identifiers, which can increase bundle size in browser environments. Matches against `597` identifiers.
 * - Prefer {@link isNativeTimeZoneId} when you want a lightweight, native-only validation approach. Matches against `418` identifiers.
 *
 * @param value Time zone identifier to validate.
 * @returns `true` if the value is a valid IANA time zone identifier, otherwise `false`.
 */
export function isValidTimeZoneId(value: unknown): value is $TimeZoneIdentifier {
	return isNonEmptyString(value) ? new Set([...IANA_TZ_IDS] as string[]).has(value) : false;
}

/**
 * * Validates whether the provided value is a supported time zone identifier using the native JavaScript API (`Intl.supportedValuesOf('timeZone')`).
 *
 * @remarks
 * - Uses only native {@link Intl} capabilities—minimal code footprint, highly performant. Matches against `418` identifiers.
 * - Prefer {@link isValidTimeZoneId} when validation must align strictly with the full
 *   {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones IANA TZ Database}. Matches against `597` identifiers.
 *
 * @param value Time zone identifier to validate.
 * @returns `true` if the value is a valid native JS-supported time zone identifier, otherwise `false`.
 */
export function isNativeTimeZoneId(value: unknown): value is TimeZoneIdNative {
	return isNonEmptyString(value) ? new Set<string>(NATIVE_TZ_IDS).has(value) : false;
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
	const $year = normalizeNumber(year);

	return $year ? ($year % 4 === 0 && $year % 100 !== 0) || $year % 400 === 0 : false;
}

/**
 * * Checks if a value is a date-like object from `Date`, `Chronos`, `Moment.js`, `Day.js`, `Luxon`, `JS-Joda`, or `Temporal`
 * @param value Value to check if it is date-like object.
 * @returns `true` if the value is date-like object, otherwise `false`.
 */
export function isDateLike(value: unknown): boolean {
	if (value instanceof Date) return true;

	if (isObject(value)) {
		// Chronos, Moment or Day.js
		if (
			isFunction(value.format) &&
			isFunction(value.toJSON) &&
			isFunction(value.toISOString)
		) {
			return true;
		}

		// Luxon
		if (isFunction(value.toISO) && isFunction(value.toFormat) && isBoolean(value.isValid)) {
			return true;
		}

		// JS-Joda
		if (
			isFunction(value.plus) &&
			isFunction(value.minus) &&
			isFunction(value.equals) &&
			isFunction(value.getClass)
		) {
			return true;
		}

		// Temporal
		if (
			isFunction(value.toJSON) &&
			isFunction(value.toString) &&
			['PlainDate', 'ZonedDateTime', 'Instant'].includes(value.constructor?.name ?? '')
		) {
			return true;
		}
	}

	return false;
}

/** Checks if a value represents time value (number) with different forms of {@link TimeWithUnit units} */
export function isTimeWithUnit(value: unknown): value is TimeWithUnit {
	return (
		isNonEmptyString(value) &&
		/^-?\d*\.?\d+ *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)?$/i.test(
			value
		)
	);
}
