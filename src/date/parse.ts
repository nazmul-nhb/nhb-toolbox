import { isNonEmptyString, isNumber } from '../guards/primitives';
import { isNumericString } from '../guards/specials';
import type { Numeric } from '../types/index';
import { MS_MAP, TIME_REGEX } from './constants';
import { isTimeWithUnit } from './guards';
import type { $UnitLower, TimeWithUnit } from './types';

/**
 * * Parse the given value to milliseconds.
 *
 * @param value - The string (with unit) or number (or numeric string) to convert.
 * @returns The given value parsed in milliseconds.
 */
export function parseMs(value: TimeWithUnit | Numeric): number {
	if (isNumericString(value)) {
		return _parse(`${value}s`);
	} else if (isTimeWithUnit(value)) {
		return _parse(value);
	} else if (isNumber(value)) {
		return _parse(`${value}ms`);
	}

	return NaN;
}

/**
 * * Parse the given time string and return milliseconds.
 *
 * @param str - A time string to parse to milliseconds.
 * @returns The parsed value in milliseconds, or `NaN` if the string can't be parsed.
 */
function _parse(str: TimeWithUnit): number {
	if (!isNonEmptyString(str) || str.length > 100) {
		throw new RangeError(`Value must be a string with length between 1 and 99!`);
	}

	const match = TIME_REGEX.exec(str);

	if (!match?.groups) return NaN;

	const unit = (match.groups.unit ?? 'ms').toLowerCase<$UnitLower>();

	const multiplier = MS_MAP[unit];

	if (!multiplier) throw new RangeError(`Unknown unit "${unit}"!`);

	return parseFloat(match.groups.value) * multiplier;
}
