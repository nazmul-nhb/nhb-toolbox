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

export function _isAnsiSequence(seq: unknown): seq is AnsiSequence {
	return (
		isArrayOfType(seq, isString) &&
		seq?.length === 2 &&
		(seq[0].startsWith('\x1b[48') || seq[0].startsWith('\x1b[38')) &&
		(seq[1].startsWith('\x1b[49') || seq[1].startsWith('\x1b[39'))
	);
}

export function _isAnsi16ColorValue(value: unknown): value is Ansi16Value {
	return (
		isArrayOfType(value, isNumber) &&
		value?.length === 2 &&
		value[0] >= 30 &&
		value[0] <= 107 &&
		(value[1] === 39 || value[1] === 49)
	);
}

export function _isCSS16Color(value: string): value is CSS16Color {
	return value?.startsWith('css-') && value?.replace('css-', '') in CSS_16_COLORS;
}

export function _css16ToHex(value: CSS16Color): Hex6 {
	return CSS_16_COLORS?.[value?.replace('css-', '') as Ansi16Color];
}
