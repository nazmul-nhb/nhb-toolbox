import type { Numeric } from '../types/index';
import type { ClockTime, HourMinutes, UTCOffSet } from './types';

/**
 * * Extracts the hour and minute from a time string in `HH:MM` or `-HH:MM` format.
 *
 * @param time - The time string to extract from.
 * @return The extracted hour and minute as number tuple.
 */
export function extractHourMinute(
	time: `-${ClockTime}` | ClockTime,
): [number, number] {
	const [hour, minute] = time.split(':').map(Number);

	return [hour, minute];
}

/**
 * * Converts a time string `HH:MM` or `-HH:MM` into total minutes from `00:00`.
 *
 * @param time - The time in `HH:MM` or `-HH:MM` format.
 * @returns The total minutes elapsed since `00:00`.
 */
export function getTotalMinutes(time: `-${ClockTime}` | ClockTime): number {
	const isNegative = time.startsWith('-');

	const [h, m] = extractHourMinute(
		isNegative ? (time.slice(1) as ClockTime) : time,
	);

	const total = h * 60 + m;

	return isNegative ? -total : total;
}

/**
 * * Returns the current date and time as `Date` object.
 * - All the methods and properties of `new Date()` are accessible.
 *
 * @returns The current date and time as a `Date` object.
 */
export function getCurrentDateTime(): Date {
	return new Date();
}

/**
 * * Extract Time in `HH:MM` format from given UTC value.
 *
 * @param utc UTC value in `UTC-01:30` or `UTC+01:30` format.
 * @returns The UTC value in `HH:MM` format.
 */
export function extractTimeFromUTC(
	utc: UTCOffSet,
): `-${ClockTime}` | ClockTime {
	return utc.replace(/^UTC[+]?/g, '') as `-${ClockTime}` | ClockTime;
}

/**
 * * Converts a UTC value in `UTC-01:30` or `UTC+01:30` format into total minutes in number.
 *
 * @param time - UTC value in `UTC-01:30` or `UTC+01:30` format.
 * @returns The total minutes elapsed since `00:00`.
 */
export function extractMinutesFromUTC(utc: UTCOffSet): number {
	return getTotalMinutes(extractTimeFromUTC(utc));
}

/**
 * * Converts a number of minutes into a time string in "HH:MM" format.
 *
 * @param minutes - The number of minutes to convert. Can be a number or a numeric string.
 * @returns A string representing the time in "HH:MM" format.
 *
 * @remarks Always returns the absolute value of the minutes, ignoring the sign if they are negative.
 *
 * @example
 * convertMinutesToTime(75); // "1:15"
 * convertMinutesToTime(-45); // "0:45"
 */
export function convertMinutesToTime(minutes: Numeric): HourMinutes {
	const numMIn = Math.abs(
		typeof minutes === 'number' ? minutes : Number(minutes),
	);

	return `${String(Math.floor(numMIn / 60))}:${String(numMIn % 60).padStart(2, '0')}` as HourMinutes;
}

/**
 * * Converts a minute-based offset to a UTC offset string in the format `UTC±HH:MM`.
 *
 * @param minutes - The offset in minutes (positive or negative).
 * @returns A formatted UTC offset string like `UTC+05:30` or `UTC-04:00`.
 */
export function formatUTCOffset(minutes: Numeric): UTCOffSet {
	const numMIn = typeof minutes === 'number' ? minutes : Number(minutes);

	const sign = numMIn < 0 ? '-' : '+';
	const abs = Math.abs(numMIn);
	const hours = String(Math.floor(abs / 60)).padStart(2, '0');
	const mins = String(abs % 60).padStart(2, '0');

	return `UTC${sign}${hours}:${mins}` as UTCOffSet;
}
