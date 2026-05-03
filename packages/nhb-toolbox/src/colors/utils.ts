import { isNonEmptyString, isNumber } from '../guards/primitives';
import type { Percent } from '../number/types';
import { isHex6, isHex8, isHSL, isHSLA, isRGB, isRGBA } from './guards';
import { _applyOpacity } from './helpers';
import type { AlphaValues, Hex, Hex8, HSL, HSLA, RGB, RGBA, SolidValues } from './types';

/**
 * * Extracts numbers from a color string like `rgb(66, 103, 69)` or `hsl(120, 42.86%, 41.18%)`.
 * * Converts percentage values to decimal (e.g., `42.86%` → `42.86`).
 *
 * @param color The color string in RGB or HSL format.
 * @returns A tuple of 3 extracted numbers. `[number, number, number]`
 *
 * @remarks If the input color is not in `HSL` or `RGB` format, it will return `[0, 0, 0]`
 */
export function extractSolidColorValues(color: HSL | RGB): SolidValues {
	if (isHSL(color) || isRGB(color)) {
		return (color?.trim()?.match(/[\d.]+%?/g) || [])?.map((value) =>
			parseFloat(value)
		) as SolidValues;
	}

	return [0, 0, 0];
}

/**
 * * Extracts numbers from a color string like `rgba(66, 103, 69, 0.6)` or `hsla(120, 42.86%, 41.18%, 0.9)`.
 * * Converts percentage values to decimal (e.g., `42.86%` → `42.86`).
 *
 * @param color The color string in RGBA or HSLA format.
 * @returns A tuple of 4 extracted numbers. `[number, number, number, number]`
 *
 * @remarks If the input color is not in `HSLA` or `RGBA` format, it will return `[0, 0, 0, 0]`
 */
export function extractAlphaColorValues(color: HSLA | RGBA): AlphaValues {
	if (isHSLA(color) || isRGBA(color)) {
		return (color?.trim()?.match(/[\d.]+%?/g) || [])?.map((value) =>
			parseFloat(value)
		) as AlphaValues;
	}

	return [0, 0, 0, 0];
}

/**
 * * Converts percentage (0-100) to a 2-digit hex string.
 *
 * @param percent - The percentage (0-100) value.
 * @returns A 2-digit hex string representing the percentage (0-100) value.
 *
 * @remarks
 * - This function ensures that the percentage value is clamped between 0 and 100, converts it to a value between 0 and 255, and then formats it as a 2-digit hexadecimal string.
 * - The resulting hex string is in uppercase for consistency with common hex color formats.
 *
 * @example
 * percentToHex(0);    // Returns "00"
 * percentToHex(50);   // Returns "7F"
 * percentToHex(100);  // Returns "FF"
 * percentToHex(150);  // Returns "FF" (ts compiler error and clamped to 100)
 * percentToHex(-20);  // Returns "00" (ts compiler error and clamped to 0)
 */
export function percentToHex(percent: Percent): string {
	// Ensure opacity is between 0 and 100
	const validOpacity = Math.min(100, Math.max(0, percent));
	// Convert to a value between 0 and 255, then to a hex string
	const alpha = Math.round((validOpacity / 100) * 255);
	// Ensure it's 2 digits (e.g., 0x0A instead of 0xA)
	return alpha.toString(16).padStart(2, '0').toUpperCase();
}

/**
 * * Applies an opacity value to a hex color string.
 *
 * @param color - The hex color string in the format `#RRGGBB` or `#RRGGBBAA`.
 * @param opacity - The opacity value as a percentage (0-100).
 * @returns The hex color string with the applied opacity in `#RRGGBBAA` format.
 *
 * @throws - {@link TypeError} If the provided color is not a valid hex color string.
 *
 * @remarks
 * - If the input color is in `#RRGGBB` format, the function will append the opacity value to create a `#RRGGBBAA` string.
 * - If the input color is already in `#RRGGBBAA` format, it will replace the existing alpha value with the new one.
 * - The function validates that the input color is a valid hex color string and that the opacity value is a valid percentage before applying the opacity.
 * - If the opacity value is invalid, it defaults to 100% opacity (i.e., "FF").
 * - The resulting hex color string is in uppercase for consistency with common hex color formats.
 *
 * @example
 * applyOpacityToHex("#FF5733", 50);   // Returns "#FF573380"
 * applyOpacityToHex("#FF573380", 25);   // Returns "#FF573340"
 */
export function applyOpacityToHex(color: Hex, opacity: Percent): Hex8;

/**
 * * Applies an opacity value to a hex color string.
 *
 * @param color - The hex color string in the format `#RRGGBB` or `#RRGGBBAA`.
 * @param opacity - The opacity value as a 2-digit hex string.
 * @returns The hex color string with the applied opacity in `#RRGGBBAA` format.
 *
 * @throws - {@link TypeError} If the provided color is not a valid hex color string.
 *
 * @remarks
 * - If the input color is in `#RRGGBB` format, the function will append the opacity value to create a `#RRGGBBAA` string.
 * - If the input color is already in `#RRGGBBAA` format, it will replace the existing alpha value with the new one.
 * - The function validates that the input color is a valid hex color string and that the opacity value is a valid a 2-digit hex string before applying the opacity.
 * - If the opacity value is invalid, it defaults to 100% opacity (i.e., "FF").
 * - The resulting hex color string is in uppercase for consistency with common hex color formats.
 *
 * @example
 * applyOpacityToHex("#FF5733", "80"); // Returns "#FF573380"
 * applyOpacityToHex("#FF573380", "40"); // Returns "#FF573340"
 */
export function applyOpacityToHex(color: Hex, opacity: string): Hex8;

/**
 * * Applies an opacity value to a hex color string.
 *
 * @param color - The hex color string in the format `#RRGGBB` or `#RRGGBBAA`.
 * @param opacity - The opacity value as a percentage (0-100) or a 2-digit hex string.
 * @returns The hex color string with the applied opacity in `#RRGGBBAA` format.
 */
export function applyOpacityToHex(color: Hex, opacity: string | Percent): Hex8 {
	if (isHex6(color) || isHex8(color)) {
		const upperColor = color.toUpperCase<Uppercase<Hex>>();

		if (isNumber(opacity)) {
			return _applyOpacity(upperColor, percentToHex(opacity));
		} else if (isNonEmptyString(opacity) && /^[0-9A-Fa-f]{2}$/.test(opacity)) {
			return _applyOpacity(upperColor, opacity.toUpperCase());
		} else {
			return _applyOpacity(upperColor, percentToHex(100));
		}
	} else {
		throw new TypeError('Invalid color value!', {
			cause: 'Value must be a hex color string in the format #RRGGBB or #RRGGBBAA.',
		});
	}
}
