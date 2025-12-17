import type { LocaleCode } from '../src/number/types';
import type { DateTimeFormatOptions } from '../src/date/types';
type DateTimePreset = 'date' | 'dateTime' | 'time' | 'short' | 'long' | 'isoLike';

/**
 * Format date/time using only the Intl API with easy presets.
 *
 * @param  value - Date object, timestamp, or date string.
 * @param preset - Output format preset.
 * @param overrides - Optional Intl overrides.
 * @param locale - Locale(s) to use.
 * @returns Formatted date/time string.
 */
export function formatDateTime(
	value: Date | number | string,
	preset: DateTimePreset = 'date',
	overrides?: DateTimeFormatOptions,
	locale: LocaleCode | LocaleCode[] = 'en-GB'
) {
	const date = value instanceof Date ? value : new Date(value);

	const presets: Record<DateTimePreset, Intl.DateTimeFormatOptions> = {
		date: {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		},
		time: {
			hour: '2-digit',
			minute: '2-digit',
		},
		dateTime: {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		},
		short: {
			day: '2-digit',
			month: 'numeric',
			year: '2-digit',
		},
		long: {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		},
		isoLike: {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		},
	};

	const options = {
		...presets[preset],
		...overrides,
	};

	return Intl.DateTimeFormat(locale, options).format(date);
}
