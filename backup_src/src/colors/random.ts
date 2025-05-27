import { convertColorCode } from './convert';
import { _generateRandomHSL, _isSimilarToLast } from './helpers';
import type { Hex6, HSL, RGB } from './types';

/** Track previously generated colors. */
const generatedColors = new Set<string>();

/** Array of recently generated colors */
const recentColors: string[] = [];

/**
 * * Utility to generate a unique random HSL color.
 *
 * @param maxColors - The maximum number of recent colors to store in memory. Default is `16`.
 * @returns Generated unique random color in `HSL` format.
 */
export const generateRandomHSLColor = (maxColors: number = 16): HSL => {
	let color: HSL;

	// Keep generating until a unique color is found that is also different from the last one
	do {
		color = _generateRandomHSL();
	} while (
		generatedColors.has(color) ||
		_isSimilarToLast(recentColors, color)
	);

	// Add the newly generated color to the set and recent colors
	generatedColors.add(color);
	recentColors.push(color);

	// Limit the recent colors to the last `maxColors` to avoid excessive memory usage
	if (recentColors?.length > maxColors) {
		recentColors?.shift();
	}

	return color;
};

/**
 * * Utility to generate a unique random color in Hex and RGB format.
 *
 * @param maxColors - The maximum number of recent colors to store in memory. Default is `16`.
 * @returns An object of generated unique random color in both `Hex` and `RGB` formats.
 */
export const generateRandomColorInHexRGB = (
	maxColors: number = 16,
): {
	hex: Hex6;
	rgb: RGB;
} => {
	return convertColorCode(generateRandomHSLColor(maxColors));
};
