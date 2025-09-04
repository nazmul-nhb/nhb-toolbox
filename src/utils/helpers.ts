import { isArrayOfType } from '../guards/non-primitives';
import { isNumber, isString } from '../guards/primitives';
import { CSS_16_COLORS } from './constants';

import type { CSSColor, Hex6 } from '../colors/types';
import type { Ansi16Color, Ansi16Value, AnsiSequence, BGColor, CSS16Color } from './stylog';

/**
 * * Extract the CSS color name from a background-prefixed style key.
 *
 * @param bgColor Style key starting with `bg` (e.g. `"bgRed"`).
 * @returns Extracted CSS color name.
 */
export function _extractColorName(bgColor: BGColor): CSSColor {
	return bgColor.slice(2).toLowerCase() as CSSColor;
}

/** * Check if a string represents a valid `AnsiSequence`. */
export function _isAnsiSequence(seq: unknown): seq is AnsiSequence {
	return (
		isArrayOfType(seq, isString) &&
		seq?.length === 2 &&
		(seq[0].startsWith('\x1b[48') || seq[0].startsWith('\x1b[38')) &&
		(seq[1].startsWith('\x1b[49') || seq[1].startsWith('\x1b[39'))
	);
}

/** * Check if a value represents a valid `Ansi16Value`. */
export function _isAnsi16ColorValue(value: unknown): value is Ansi16Value {
	return (
		isArrayOfType(value, isNumber) &&
		value?.length === 2 &&
		value[0] >= 30 &&
		value[0] <= 107 &&
		(value[1] === 39 || value[1] === 49)
	);
}

/** * Check if a value represents a valid `CSS16Color` against `Ansi16Value`. */
export function _isCSS16Color(value: string): value is CSS16Color {
	return value?.startsWith('css-') && value?.replace('css-', '') in CSS_16_COLORS;
}

/**
 * * Convert a `CSS16Color` value in `Hex6` format
 *
 * @param value `CSS16Color` value to convert
 * @returns Converted `CSS16Color` value in `Hex6` format
 */
export function _css16ToHex(value: CSS16Color): Hex6 {
	return CSS_16_COLORS?.[value?.replace('css-', '') as Ansi16Color];
}
