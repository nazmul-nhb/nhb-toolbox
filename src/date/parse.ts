import { isNonEmptyString, isNumber } from '../guards/primitives';
import { isNumericString } from '../guards/specials';
import type { Numeric } from '../types/index';
import { MS_MAP, TIME_UNIT_REGEX } from './constants';
import { isTimeWithUnit } from './guards';
import type { $TimeUnitVar, TimeWithUnit } from './types';

/**
 * * Parse the given value to milliseconds or seconds.
 *
 * @param value - The string (with unit) or number (or numeric string) to convert.
 * @param sec - Whether to return the value in seconds. Defaults to `false`.
 * @returns The given value parsed in milliseconds (or seconds if specified).
 */
export function parseMSec(value: TimeWithUnit | Numeric, sec = false): number {
	if (isNumericString(value)) {
		return _parse(`${value}s`, sec);
	} else if (isTimeWithUnit(value)) {
		return _parse(value, sec);
	} else if (isNumber(value)) {
		return _parse(`${value}ms`, sec);
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

	const match = TIME_UNIT_REGEX.exec(str);

	if (!match?.groups) return NaN;

	const unit = (match.groups.unit ?? 'ms').toLowerCase<$TimeUnitVar>();

	const multiplier = MS_MAP[unit];

	if (!multiplier) throw new RangeError(`Unknown unit "${unit}"!`);

	const ms = parseFloat(match.groups.value) * multiplier;

	return !sec ? ms : ms / 1000;
}
