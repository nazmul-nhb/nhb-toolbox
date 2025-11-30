import { isNonEmptyString, isNumber, isString } from '../guards/primitives';
import { isNumericString } from '../guards/specials';
import type { $Unit, TimeWithUnit } from './types';

const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const y = d * 365.25;
const mo = y / 12;

/**
 * Parse the given value to milliseconds.
 *
 * @param value - The string or number to convert
 * @param options - Options for the conversion
 * @throws Error if `value` is not a non-empty string or a number
 */
export function toMilliseconds(value: TimeWithUnit | number): number {
	if (isNumericString(value)) {
		return parse(`${value}s`);
	} else if (isString(value)) {
		return parse(value);
	} else if (isNumber(value)) {
		return parse(`${value}ms`);
	}

	throw new Error(`Value must be a string or number. value=${JSON.stringify(value)}`);
}

/**
 * Parse the given string and return milliseconds.
 *
 * @param str - A string to parse to milliseconds
 * @returns The parsed value in milliseconds, or `NaN` if the string can't be
 * parsed
 */
export function parse(str: TimeWithUnit): number {
	if (!isNonEmptyString(str) || str.length > 100) {
		throw new Error(
			`Value must be a string with length between 1 and 99. value=${JSON.stringify(str)}`
		);
	}

	const match =
		/^(?<value>-?\d*\.?\d+) *(?<unit>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)?$/i.exec(
			str
		);

	if (!match?.groups) {
		return NaN;
	}

	const { value, unit = 'ms' } = match.groups as {
		value: string;
		unit: $Unit | undefined;
	};

	const $value = parseFloat(value);

	const matchUnit = unit.toLowerCase() as Lowercase<$Unit>;

	/* istanbul ignore next - istanbul doesn't understand, but thankfully the TypeScript the exhaustiveness check in the default case keeps us type safe here */
	switch (matchUnit) {
		case 'years':
		case 'year':
		case 'yrs':
		case 'yr':
		case 'y':
			return $value * y;
		case 'months':
		case 'month':
		case 'mo':
			return $value * mo;
		case 'weeks':
		case 'week':
		case 'w':
			return $value * w;
		case 'days':
		case 'day':
		case 'd':
			return $value * d;
		case 'hours':
		case 'hour':
		case 'hrs':
		case 'hr':
		case 'h':
			return $value * h;
		case 'minutes':
		case 'minute':
		case 'mins':
		case 'min':
		case 'm':
			return $value * m;
		case 'seconds':
		case 'second':
		case 'secs':
		case 'sec':
		case 's':
			return $value * s;
		case 'milliseconds':
		case 'millisecond':
		case 'msecs':
		case 'msec':
		case 'ms':
			return $value;
		default:
			throw new Error(`Unknown unit "${matchUnit}"! value=${JSON.stringify(str)}`);
	}
}
