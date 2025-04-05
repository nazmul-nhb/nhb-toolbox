import { isString } from '../guards/primitives';
import { isNumericString } from '../guards/specials';
import type { Time, UTCOffSet } from './types';

/**
 * * Checks if the provided value is a valid time string in "HH:MM" format.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a valid time string, `false` otherwise.
 */
export function isValidTime(value: unknown): value is Time {
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
