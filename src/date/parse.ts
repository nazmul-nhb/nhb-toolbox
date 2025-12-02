import { isNonEmptyString, isNumber } from '../guards/primitives';
import { isNumericString } from '../guards/specials';
import type { Numeric } from '../types/index';
import { MS_MAP } from './constants';
import { isTimeWithUnit } from './guards';
import type { $TimeUnitVar, TimeWithUnit } from './types';

/**
 * * Parse the given value to milliseconds or optionally to seconds.
 *
 * @param value - The string (with unit) or number (or numeric string) to convert.
 * @param sec - Whether to return the value in seconds. Defaults to `false`.
 * @returns The given value parsed in milliseconds (or seconds if specified).
 *
 * @remarks
 * - A numeric value (number or numeric string ({@link Numeric})) is interpreted as seconds count, e.g., `120` or `'120'` will be treated as `'120 seconds'`.
 * - If you use time value with unit ({@link TimeWithUnit}) be sure you provide the time units (days, hours, etc.), otherwise it will return `NaN`, e.g., `'120 unknown'` will return `NaN`.
 */
export function parseMSec(value: TimeWithUnit | Numeric, sec = false): number {
	if (isNumericString(value)) {
		return _parse(`${value}s`, sec);
	} else if (isTimeWithUnit(value)) {
		return _parse(value, sec);
	} else if (isNumber(value)) {
		return _parse(`${value}s`, sec);
	}

	return NaN;
}

/**
 * * Parse the given time string and return milliseconds or seconds.
 *
 * @param str - A time string to parse to milliseconds.
 * @param sec - Whether to return the value in seconds. Defaults to `false`.
 * @returns The parsed value in milliseconds (or seconds if specified), or `NaN` if the string can't be parsed.
 */
function _parse(str: TimeWithUnit, sec = false): number {
	if (!isNonEmptyString(str) || str.length > 100) {
		throw new RangeError(`Value must be a string with length between 1 and 99!`);
	}

	const match =
		/^(?<value>-?\d*\.?\d+) *(?<unit>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)?$/i.exec(
			str
		);

	if (!match?.groups) return NaN;

	const unit = (match.groups.unit ?? 'ms').toLowerCase<$TimeUnitVar>();

	const multiplier = MS_MAP[unit];

	if (!multiplier) throw new RangeError(`Unknown unit "${unit}"!`);

	const ms = parseFloat(match.groups.value) * multiplier;

	return sec ? ms / 1000 : ms;
}
