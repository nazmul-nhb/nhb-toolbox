import type { Time } from './types';

/**
 * * Extracts the hour and minute from a time string in `HH:MM` format.
 *
 * @param time - The time string to extract from.
 * @return The extracted hour and minute as number tuple.
 */
export function extractHourMinute(time: Time): [number, number] {
	const [hour, minute] = time.split(':').map(Number);

	return [hour, minute];
}

/**
 * * Converts a time string `HH:MM` into total minutes from `00:00`.
 *
 * @param time - The time in `HH:MM` format.
 * @returns The total minutes elapsed since `00:00`.
 */
export function getTotalMinutes(time: Time): number {
	const [h, m] = extractHourMinute(time);

	return h * 60 + m;
}
