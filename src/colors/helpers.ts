import type { Percent } from '../number/types';
import type { AlphaValue, Hex, Hex8, HSL } from './types';

/**
 * * Converts percentage (0-100) to a 2-digit hex string.
 *
 * @param percent - The percentage (0-100) value.
 * @returns A 2-digit hex string representing the percentage (0-100) value.
 */
export const _percentToHex = (percent: Percent): string => {
	// Ensure opacity is between 0 and 100
	const validOpacity = Math.min(100, Math.max(0, percent));
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
export const _isSimilarToLast = (recentColors: string[], newColor: string): boolean => {
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

	return hueDifference < 48 && saturationDifference < 24 && lightnessDifference < 16;
};

/**
 * @private Checks if a number is valid alpha value.
 *
 * @param value Alpha value to check.
 * @returns `true` if it's a valid alpha value, `false` if not.
 */
export function _isValidAlpha(value: number): value is AlphaValue {
	return value >= 0 && value <= 1 && !isNaN(value);
}

/** @private Validates RGB component (0–255). */
export function _isValidRGBComponent(value: number): boolean {
	return value >= 0 && value <= 255;
}

/** @private Validates HSL hue (0–360). */
export function _isValidHue(value: number): boolean {
	return value >= 0 && value <= 360;
}

/** @private Validates HSL percentage components (0–100). */
export function _isValidPercentage(value: number): boolean {
	return value >= 0 && value <= 100;
}
