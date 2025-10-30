import { convertColorCode, convertHslToHex, convertHslToRgb } from './convert';
import { _generateRandomHSL, _isSimilarToLast } from './helpers';
import type { $ColorType, HSL, RandomColor, RandomColorOptions, RandomHexRGB } from './types';
import { extractSolidColorValues } from './utils';

/** @__PURE__ Track previously generated colors. */
const generatedColors = /* @__PURE__ */ new Set<HSL>();

/** @__PURE__ Array of recently generated colors. */
const recentColors: HSL[] = /* @__PURE__ */ [];

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
	} while (generatedColors.has(color) || _isSimilarToLast(recentColors, color));

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
 * @deprecated For better performance and flexible use, please use {@link generateRandomColor}!
 *
 * * Utility to generate a unique random color in Hex6 and RGB format.
 *
 * @param maxColors - The maximum number of recent colors to store in memory. Default is `16`.
 * @returns An object of generated unique random color in both `Hex` and `RGB` formats.
 */
export const generateRandomColorInHexRGB = (maxColors = 16): RandomHexRGB => {
	return convertColorCode(generateRandomHSLColor(maxColors));
};

/**
 * * Generates a random color in one of three formats: `Hex6`, `RGB`, or `HSL`.
 *
 * @remarks
 * - If no `options` or `colorType` option is provided, the function defaults to returning a color in `Hex6` format.
 * - The `colorType` option determines the return type:
 *   - `'hex'` → returns a `Hex6` string e.g. `'#34E2EF'`
 *   - `'rgb'` → returns an `RGB` string e.g. `'hsl(223, 96%, 53%)'`
 *   - `'hsl'` → returns an `HSL` string e.g. `'rgb(235, 159, 45)'`
 * - The `maxColors` option controls how many recently generated colors are kept in memory to prevent repetition.
 *   By default, this value is `16`. Increasing it allows more unique color variations before repeating.
 *
 * @param options - Configuration options for random color generation, including `colorType` and `maxColors`.
 * @returns A random color in the specified format (`Hex6`, `RGB`, or `HSL`).
 *
 * @example
 * ```ts
 * const hex = generateRandomColor();
 * // inferred: Hex6
 *
 * const rgb = generateRandomColor({ colorType: 'rgb' });
 * // inferred: RGB
 *
 * const hsl = generateRandomColor({ colorType: 'hsl', maxColors: 32 });
 * // inferred: HSL, with a larger unique color memory pool
 * ```
 */
export function generateRandomColor<C extends $ColorType | undefined = undefined>(
	options?: RandomColorOptions<C>
): RandomColor<C> {
	const { colorType = 'hex', maxColors = 16 } = options ?? {};

	const hsl = generateRandomHSLColor(maxColors);

	const hslValues = extractSolidColorValues(hsl);

	switch (colorType) {
		case 'hsl':
			return hsl as RandomColor<C>;
		case 'rgb':
			return convertHslToRgb(...hslValues) as RandomColor<C>;
		case 'hex':
		default:
			return convertHslToHex(...hslValues) as RandomColor<C>;
	}
}
