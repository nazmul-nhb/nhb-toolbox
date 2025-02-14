import type {
	AlphaValue,
	ColorNumbers,
	ColorNumbersAlpha,
	Hex6,
	Hex8,
	HSL,
	HSLA,
	OpacityValue,
	RGB,
	RGBA,
} from './types';

/**
 * * Converts opacity percentage (0-100) to a 2-digit hex string.
 *
 * @param opacity - The opacity value as a percentage (0-100).
 * @returns A 2-digit hex string representing the alpha value.
 */
export const _convertOpacityToHex = (opacity: OpacityValue): string => {
	// Ensure opacity is between 0 and 100
	const validOpacity = Math.min(100, Math.max(0, opacity));
	// Convert to a value between 0 and 255, then to a hex string
	const alpha = Math.round((validOpacity / 100) * 255);
	// Ensure it's 2 digits (e.g., 0x0A instead of 0xA)
	return alpha.toString(16).padStart(2, '0').toUpperCase();
};

/**
 * * Applies an opacity value to a color string.
 * @param color The color string to apply opacity to.
 * @param opacity The opacity value as a percentage (0-100).
 * @returns The color string with the opacity value applied.
 */
export const _applyOpacity = (color: string, opacity: string): string => {
	return color.concat(opacity);
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
	newColor: string,
): boolean => {
	if (recentColors.length === 0) return false;

	const newHSL = newColor.match(/hsl\((\d+), (\d+)%, (\d+)%\)/);
	const lastHSL = recentColors[recentColors.length - 1].match(
		/hsl\((\d+), (\d+)%, (\d+)%\)/,
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
 * * Extracts numbers from a color string like `rgb(66, 103, 69)` or `hsl(120, 42.86%, 41.18%)`.
 * * Converts percentage values to decimal (e.g., `42.86%` → `42.86`).
 *
 * @param colorString The color string in RGB or HSL format.
 * @returns An array of extracted numbers.
 */
export const _extractSolidColorValues = (
	colorString: HSL | RGB,
): ColorNumbers => {
	return (colorString.match(/[\d.]+%?/g) || []).map((value) =>
		parseFloat(value),
	) as ColorNumbers;
};

/**
 * * Extracts numbers from a color string like `rgba(66, 103, 69, 0.6)` or `hsla(120, 42.86%, 41.18%, 0.9)`.
 * * Converts percentage values to decimal (e.g., `42.86%` → `42.86`).
 *
 * @param colorString The color string in RGB or HSL format.
 * @returns An array of extracted numbers.
 */
export const _extractAlphaColorValues = (
	colorString: HSLA | RGBA,
): ColorNumbersAlpha => {
	return (colorString.match(/[\d.]+%?/g) || []).map((value) =>
		parseFloat(value),
	) as ColorNumbersAlpha;
};

/**
 * * Checks if a color is in `Hex` format.
 *
 * @param color Color to check.
 * @returns Boolean: `true` if it's a `Hex` color, `false` if not.
 */
export function _isHex6(color: string): color is Hex6 {
	return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * * Checks if a color is in `RGB` format.
 *
 * @param color Color to check.
 * @returns Boolean: `true` if it's an `RGB` color, `false` if not.
 */
export function _isRGB(color: string): color is RGB {
	return /^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/.test(color);
}

/**
 * * Checks if a color is in `HSL` format.
 *
 * @param color Color to check.
 * @returns Boolean: `true` if it's an `HSL` color, `false` if not.
 */
export function _isHSL(color: string): color is HSL {
	return /^hsl\(\d{1,3}, \d{1,3}%, \d{1,3}%\)$/.test(color);
}

/**
 * @static
 * Checks if a color is in `Hex8` format.
 *
 * @param color Color to check.
 * @returns Boolean: `true` if it's a `Hex8` color, `false` if not.
 */
export function _isHex8(color: string): color is Hex8 {
	return /^#[0-9A-Fa-f]{8}$/.test(color);
}

/**
 * @static
 * Checks if a color is in `RGBA` format.
 *
 * @param color Color to check.
 * @returns Boolean: `true` if it's an `RGBA` color, `false` if not.
 */
export function _isRGBA(color: string): color is RGBA {
	return /^rgba\(\d{1,3}, \d{1,3}, \d{1,3}, (0|1|0?\.\d+)\)$/.test(color);
}

/**
 * @static
 * Checks if a color is in `HSLA` format.
 *
 * @param color Color to check.
 * @returns Boolean: `true` if it's an `HSLA` color, `false` if not.
 */
export function _isHSLA(color: string): color is HSLA {
	return /^hsla\(\d{1,3}, \d{1,3}%, \d{1,3}%, (0|1|0?\.\d+)\)$/.test(color);
}

/**
 * * Type guard to validate alpha value.
 * @param value Alpha value to check.
 * @returns Boolean: `true` if it's a valid alpha value, `false` if not.
 */
export function _isValidAlpha(value: number): value is AlphaValue {
	return value >= 0 && value <= 1 && !isNaN(value);
}
