import {
	_isValidAlpha,
	_isValidHue,
	_isValidPercentage,
	_isValidRGBComponent,
} from './helpers';
import type { Hex6, Hex8, HSL, HSLA, RGB, RGBA } from './types';

/**
 * Checks if a color is in `Hex` format.
 *
 * @param color Color to check.
 * @returns Boolean: `true` if it's a `Hex` color, `false` if not.
 */
export function isHex6(color: string): color is Hex6 {
	return /^#[0-9A-Fa-f]{6}$/.test(color?.trim());
}

/**
 * Checks if a color is in `Hex8` format.
 *
 * @param color Color to check.
 * @returns Boolean: `true` if it's a `Hex8` color, `false` if not.
 */
export function isHex8(color: string): color is Hex8 {
	return /^#[0-9A-Fa-f]{8}$/.test(color?.trim());
}

/**
 * Checks if a color is in `RGB` format and within valid ranges.
 *
 * @param color Color to check.
 * @returns `true` if it's a `RGB` color, `false` if not.
 */
export function isRGB(color: string): color is RGB {
	const match = color
		?.trim()
		?.match(
			/^rgb\(\s*(\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?)\s*\)$/
		);

	if (!match) return false;

	const [r, g, b] = match.slice(1).map(Number);

	return _isValidRGBComponent(r) && _isValidRGBComponent(g) && _isValidRGBComponent(b);
}

/**
 * Checks if a color is in `RGBA` format and within valid ranges.
 *
 * @param color Color to check.
 * @returns `true` if it's a `RGBA` color, `false` if not.
 */
export function isRGBA(color: string): color is RGBA {
	const match = color
		?.trim()
		?.match(
			/^rgba\(\s*(\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?),\s*(0|1|0?\.\d+)\s*\)$/
		);
	if (!match) return false;

	const [r, g, b, a] = match.slice(1).map(Number);

	return (
		_isValidRGBComponent(r) &&
		_isValidRGBComponent(g) &&
		_isValidRGBComponent(b) &&
		_isValidAlpha(a)
	);
}

/**
 * Checks if a color is in `HSL` format and within valid ranges.
 *
 * @param color Color to check.
 * @returns `true` if it's a `HSL` color, `false` if not.
 */
export function isHSL(color: string): color is HSL {
	const match = color
		?.trim()
		?.match(
			/^hsl\(\s*(\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?)%,\s*(\d{1,3}(?:\.\d+)?)%\s*\)$/
		);

	if (!match) return false;

	const [h, s, l] = match.slice(1).map(Number);

	return _isValidHue(h) && _isValidPercentage(s) && _isValidPercentage(l);
}

/**
 * Checks if a color is in `HSLA` format and within valid ranges.
 *
 * @param color Color to check.
 * @returns `true` if it's a `HSLA` color, `false` if not.
 */
export function isHSLA(color: string): color is HSLA {
	const match = color
		?.trim()
		.match(
			/^hsla\(\s*(\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?)%,\s*(\d{1,3}(?:\.\d+)?)%,\s*(0|1|0?\.\d+)\s*\)$/
		);

	if (!match) return false;

	const [h, s, l, a] = match.slice(1).map(Number);

	return _isValidHue(h) && _isValidPercentage(s) && _isValidPercentage(l) && _isValidAlpha(a);
}
