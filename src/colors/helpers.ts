import type { OpacityValue } from './types';

/**
 * * Converts opacity percentage (0-100) to a 2-digit hex string.
 *
 * @param opacity - The opacity value as a percentage (0-100).
 * @returns A 2-digit hex string representing the alpha value.
 */
export const convertOpacityToHex = (opacity: OpacityValue): string => {
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
export const applyOpacity = (color: string, opacity: string): string => {
	return color.concat(opacity);
};
