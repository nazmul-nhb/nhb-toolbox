import { generateColorHSL, isSimilarToLast } from './helpers';

/** Track previously generated colors. */
const generatedColors = new Set<string>();

/** Array of recently generated colors */
const recentColors: string[] = [];

/**
 * * Utility to generate a unique random HSL color.
 * @param maxColors - The maximum number of recent colors to store in memory.
 * @returns Generated unique random color.
 */
export const generateRandomColor = (maxColors: number = 16): string => {
	let color: string;

	// Keep generating until a unique color is found that is also different from the last one
	do {
		color = generateColorHSL();
	} while (
		generatedColors.has(color) ||
		isSimilarToLast(recentColors, color)
	);

	// Add the newly generated color to the set and recent colors
	generatedColors.add(color);
	recentColors.push(color);

	// Limit the recent colors to the last `maxColors` to avoid excessive memory usage
	if (recentColors.length > maxColors) {
		recentColors.shift();
	}

	return color;
};
