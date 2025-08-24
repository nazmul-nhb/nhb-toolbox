import type { Percent } from '../number/types';
import type {
	AlphaValue,
	Hex,
	Hex6,
	Hex8,
	HSL,
	HSLA,
	RGB,
	RGBA,
} from './types';

/**
 * * Converts opacity percentage (0-100) to a 2-digit hex string.
 *
 * @param opacity - The opacity value as a percentage (0-100).
 * @returns A 2-digit hex string representing the alpha value.
 */
export const _convertOpacityToHex = (opacity: Percent): string => {
	// Ensure opacity is between 0 and 100
	const validOpacity = Math.min(100, Math.max(0, opacity));
	// Convert to a value between 0 and 255, then to a hex string
	const alpha = Math.round((validOpacity / 100) * 255);
	// Ensure it's 2 digits (e.g., 0x0A instead of 0xA)
	return alpha.toString(16).padStart(2, '0').toUpperCase();
};

/**
 * * Applies an opacity value to a color string.
 * @param color The color string in hex to apply opacity to.
 * @param opacity The opacity value as a percentage (0-100).
 * @returns The color string with the opacity value applied.
 */
export const _applyOpacity = (color: Hex, opacity: string): Hex8 => {
	return color?.slice(0, 7).concat(opacity) as Hex8;
};

/**
 * * Helper function to generate a random HSL color.
 *
 * @returns A random HSL color string.
 */
export const _generateRandomHSL = (): HSL => {
	const hue = Math.floor(Math.random() * 360);
	const saturation = 75 + Math.floor(Math.random() * 25);
	const lightness = 50 + Math.floor(Math.random() * 15);
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * * Helper function to check if the new color is visually too similar to the previous one.
 * * It compares the hue, saturation, and lightness difference between the new color and the last one generated.
 *
 * @param recentColors - Array of recently generated colors.
 * @param newColor - The new color to compare.
 * @returns `Boolean` : `true` if the new color is similar to the previous one.
 */
export const _isSimilarToLast = (
	recentColors: string[],
	newColor: string
): boolean => {
	if (recentColors?.length === 0) return false;

	const newHSL = newColor.match(/hsl\((\d+), (\d+)%, (\d+)%\)/);
	const lastHSL = recentColors[recentColors?.length - 1].match(
		/hsl\((\d+), (\d+)%, (\d+)%\)/
	);

	if (!newHSL || !lastHSL) return false;

	const newHue = parseInt(newHSL[1], 10);
	const newSaturation = parseInt(newHSL[2], 10);
	const newLightness = parseInt(newHSL[3], 10);

	const lastHue = parseInt(lastHSL[1], 10);
	const lastSaturation = parseInt(lastHSL[2], 10);
	const lastLightness = parseInt(lastHSL[3], 10);

	const hueDifference = Math.abs(newHue - lastHue);
	const saturationDifference = Math.abs(newSaturation - lastSaturation);
	const lightnessDifference = Math.abs(newLightness - lastLightness);

	return (
		hueDifference < 48 &&
		saturationDifference < 24 &&
		lightnessDifference < 16
	);
};

/**
 * @private Checks if a color is in `Hex` format.
 *
 * @param color Color to check.
 * @returns Boolean: `true` if it's a `Hex` color, `false` if not.
 */
export function _isHex6(color: string): color is Hex6 {
	return /^#[0-9A-Fa-f]{6}$/.test(color?.trim());
}

/**
 * @private Checks if a color is in `Hex8` format.
 *
 * @param color Color to check.
 * @returns Boolean: `true` if it's a `Hex8` color, `false` if not.
 */
export function _isHex8(color: string): color is Hex8 {
	return /^#[0-9A-Fa-f]{8}$/.test(color?.trim());
}

/**
 * @private Checks if a color is in `RGB` format and within valid ranges.
 *
 * @param color Color to check.
 * @returns `true` if it's a `RGB` color, `false` if not.
 */
export function _isRGB(color: string): color is RGB {
	const match = color
		?.trim()
		?.match(
			/^rgb\(\s*(\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?)\s*\)$/
		);
	if (!match) return false;
	const [r, g, b] = match.slice(1).map(Number);
	return (
		_isValidRGBComponent(r) &&
		_isValidRGBComponent(g) &&
		_isValidRGBComponent(b)
	);
}

/**
 * @private Checks if a color is in `RGBA` format and within valid ranges.
 *
 * @param color Color to check.
 * @returns `true` if it's a `RGBA` color, `false` if not.
 */
export function _isRGBA(color: string): color is RGBA {
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
 * @private Checks if a color is in `HSL` format and within valid ranges.
 *
 * @param color Color to check.
 * @returns `true` if it's a `HSL` color, `false` if not.
 */
export function _isHSL(color: string): color is HSL {
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
 * @private Checks if a color is in `HSLA` format and within valid ranges.
 *
 * @param color Color to check.
 * @returns `true` if it's a `HSLA` color, `false` if not.
 */
export function _isHSLA(color: string): color is HSLA {
	const match = color
		?.trim()
		.match(
			/^hsla\(\s*(\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?)%,\s*(\d{1,3}(?:\.\d+)?)%,\s*(0|1|0?\.\d+)\s*\)$/
		);
	if (!match) return false;
	const [h, s, l, a] = match.slice(1).map(Number);
	return (
		_isValidHue(h) &&
		_isValidPercentage(s) &&
		_isValidPercentage(l) &&
		_isValidAlpha(a)
	);
}

/**
 * @private Checks if a number is valid alpha value.
 *
 * @param value Alpha value to check.
 * @returns `true` if it's a valid alpha value, `false` if not.
 */
export function _isValidAlpha(value: number): value is AlphaValue {
	return value >= 0 && value <= 1 && !isNaN(value);
}

/** * @private Validates RGB component (0–255). */
export function _isValidRGBComponent(value: number): boolean {
	return value >= 0 && value <= 255;
}

/** * @private Validates HSL hue (0–360). */
export function _isValidHue(value: number): boolean {
	return value >= 0 && value <= 360;
}

/** * @private Validates HSL percentage components (0–100). */
export function _isValidPercentage(value: number): boolean {
	return value >= 0 && value <= 100;
}
