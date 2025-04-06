import { Chronos } from './Chronos';
import type { Time, UTCOffSet } from './types';

/**
 * * Extracts the hour and minute from a time string in `HH:MM` or `-HH:MM` format.
 *
 * @param time - The time string to extract from.
 * @return The extracted hour and minute as number tuple.
 */
export function extractHourMinute(time: `-${Time}` | Time): [number, number] {
	const [hour, minute] = time.split(':').map(Number);

	return [hour, minute];
}

/**
 * * Converts a time string `HH:MM` or `-HH:MM` into total minutes from `00:00`.
 *
 * @param time - The time in `HH:MM` or `-HH:MM` format.
 * @returns The total minutes elapsed since `00:00`.
 */
export function getTotalMinutes(time: `-${Time}` | Time): number {
	const isNegative = time.startsWith('-');

	const [h, m] = extractHourMinute(
		isNegative ? (time.slice(1) as Time) : time,
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
 * * Converts a date into a Chronos object.
 *
 * @param date - A date value. It can be a `string`, `number`, `Date`, or `Chronos` object.
 * - If a string is provided, it should be in a format that can be parsed by the Date constructor.
 * - If a number is provided, it should be a timestamp (milliseconds since the Unix epoch).
 * - If a Date object is provided, it will be used as is.
 * - If a Chronos object is provided, it will be converted to a Date object.
 * @returns A new Chronos object representing the provided date.
 */
export function chronos(date?: number | string | Date | Chronos) {
	return new Chronos(date);
}

/**
 * * Extract Time in `HH:MM` format from given UTC value.
 *
 * @param utc UTC value in `UTC-01:30` or `UTC+01:30` format.
 * @returns The UTC value in `HH:MM` format.
 */
export function extractTimeFromUTC(utc: UTCOffSet): `-${Time}` | Time {
	return utc.replace(/^UTC[+]?/g, '') as `-${Time}` | Time;
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
