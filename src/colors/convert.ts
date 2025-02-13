import { _isHex, _isHSL, _isRGB, extractNumbersFromColor } from './helpers';
import type { ColorType, ConvertedColors, Hex, HSL, RGB } from './types';

/**
 * * Converts HSL to RGB color format.
 *
 * @param h - The hue component of the HSL color, in degrees (0 to 360).
 * @param s - The saturation component of the HSL color, as a percentage (0 to 100).
 * @param l - The lightness component of the HSL color, as a percentage (0 to 100).
 * @returns A string representing the color in RGB format (e.g., `rgb(255, 0, 0)`).
 */
export const convertHslToRgb = (h: number, s: number, l: number): RGB => {
	// Normalize the HSL values
	s /= 100;
	l /= 100;

	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;

	let r = 0,
		g = 0,
		b = 0;
	if (h >= 0 && h < 60) [r, g] = [c, x];
	else if (h >= 60 && h < 120) [r, g] = [x, c];
	else if (h >= 120 && h < 180) [g, b] = [c, x];
	else if (h >= 180 && h < 240) [g, b] = [x, c];
	else if (h >= 240 && h < 300) [r, b] = [x, c];
	else if (h >= 300 && h < 360) [r, b] = [c, x];

	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return `rgb(${r}, ${g}, ${b})`;
};

/**
 * * Converts RGB to HSL color format.
 *
 * @param r - The red component of the RGB color, in the range 0 to 255.
 * @param g - The green component of the RGB color, in the range 0 to 255.
 * @param b - The blue component of the RGB color, in the range 0 to 255.
 * @returns A string representing the color in HSL format (e.g., `hsl(0, 100%, 50%)`).
 */
export const convertRgbToHsl = (r: number, g: number, b: number): HSL => {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);

	let h = 0,
		s = 0;

	const l = (max + min) / 2;

	if (max !== min) {
		const diff = max - min;

		s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

		switch (max) {
			case r:
				h = (g - b) / diff + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / diff + 2;
				break;
			case b:
				h = (r - g) / diff + 4;
				break;
		}

		h *= 60;
	}

	return `hsl(${Math.round(h)}, ${Number((s * 100).toFixed(2))}%, ${Number((l * 100).toFixed(2))}%)`;
};

/**
 * * Converts HSL to Hex color format.
 *
 * @param h - The hue component of the HSL color, in degrees (0 to 360).
 * @param s - The saturation component of the HSL color, as a percentage (0 to 100).
 * @param l - The lightness component of the HSL color, as a percentage (0 to 100).
 * @returns A string representing the color in Hex format (e.g., `#FF0000`).
 */
export const convertHslToHex = (h: number, s: number, l: number): Hex => {
	const rgb = convertHslToRgb(h, s, l).match(/\d+/g)!.map(Number);

	return convertRgbToHex(rgb[0], rgb[1], rgb[2]);
};

/**
 * * Converts Hex to HSL color format.
 *
 * @param hex - A string representing the color in Hex format (e.g., `#FF0000`).
 * @returns A string representing the color in HSL format (e.g., `hsl(0, 100%, 50%)`).
 */
export const convertHexToHsl = (hex: Hex | string): HSL => {
	let newHex = hex.replace('#', '');

	if (newHex.length === 3) {
		newHex = newHex
			.split('')
			.map((char) => char + char)
			.join('');
	}

	const r = parseInt(newHex.slice(0, 2), 16);
	const g = parseInt(newHex.slice(2, 4), 16);
	const b = parseInt(newHex.slice(4, 6), 16);

	return convertRgbToHsl(r, g, b);
};

/**
 * * Converts RGB to Hex color format.
 *
 * @param r - The red component of the RGB color, in the range 0 to 255.
 * @param g - The green component of the RGB color, in the range 0 to 255.
 * @param b - The blue component of the RGB color, in the range 0 to 255.
 * @param a - The alpha opacity of the RGB color, in the range 0 to 255.
 * @returns A string representing the color in Hex format (e.g., `#FF0000`).
 */
export const convertRgbToHex = (
	r: number,
	g: number,
	b: number,
	a?: number,
): Hex => {
	let hex = [r, g, b]
		.map((v) => v.toString(16).padStart(2, '0'))
		.join('')
		.toUpperCase();

	if (a !== undefined) {
		const alphaHex = Math.round(a * 255)
			.toString(16)
			.padStart(2, '0');
		hex += alphaHex;
	}

	return `#${hex}`;
};

/**
 * * Converts Hex to RGB color format.
 *
 * @param hex - A string representing the color in Hex format (e.g., `#FF0000`).
 * @returns A string representing the color in RGB format (e.g., `rgb(255, 0, 0)`).
 */
export const convertHexToRgb = (hex: Hex | string): RGB => {
	// Remove the # if present
	let newHex = hex.replace('#', '');

	if (newHex.length === 3) {
		newHex = newHex
			.split('')
			.map((char) => char + char)
			.join('');
	}

	const r = parseInt(newHex.slice(0, 2), 16);
	const g = parseInt(newHex.slice(2, 4), 16);
	const b = parseInt(newHex.slice(4, 6), 16);

	return `rgb(${r}, ${g}, ${b})`;
};

/**
 * * Converts a `Hex` color code to `RGB` and `HSL` formats.
 *
 * @param color The `Hex` color code (e.g., `#3c6945`).
 * @returns An object containing the `RGB` and `HSL` formats of the given `Hex` color.
 */
export function convertColorCode(color: Hex): {
	rgb: RGB;
	hsl: HSL;
};

/**
 * * Converts an `RGB` color to `Hex` and `HSL` formats.
 *
 * @param color The `RGB` color string (e.g., `rgb(60, 105, 69)`).
 * @returns An object containing the `Hex` and `HSL` formats of the given `RGB` color.
 */
export function convertColorCode(color: RGB): {
	hex: Hex;
	hsl: HSL;
};

/**
 * * Converts an `HSL` color to `Hex` and `RGB` formats.
 *
 * @param color The `HSL` color string (e.g., `hsl(132, 27.27%, 32.35%)`).
 * @returns An object containing the `Hex` and `RGB` formats of the given `HSL` color.
 */
export function convertColorCode(color: HSL): {
	hex: Hex;
	rgb: RGB;
};

/**
 * * Converts a color from `Hex`, `RGB`, or `HSL` format to its equivalent representations.
 *
 * @param color The color string in `Hex`, `RGB`, or `HSL` format.
 * @returns The converted color representations excluding the input format.
 * @throws If the color format is unrecognized throws `Error`.
 */
export function convertColorCode(color: ColorType): ConvertedColors<ColorType> {
	if (_isHex(color)) {
		return {
			rgb: convertHexToRgb(color),
			hsl: convertHexToHsl(color),
		} as ConvertedColors<Hex>;
	}

	if (_isRGB(color)) {
		return {
			hex: convertRgbToHex(...extractNumbersFromColor(color as RGB)),
			hsl: convertRgbToHsl(...extractNumbersFromColor(color as RGB)),
		} as ConvertedColors<RGB>;
	}

	if (_isHSL(color)) {
		return {
			hex: convertHslToHex(...extractNumbersFromColor(color as HSL)),
			rgb: convertHslToRgb(...extractNumbersFromColor(color as HSL)),
		} as ConvertedColors<HSL>;
	}

	throw new Error(`Unrecognized Color Format: ${color}`);
}
