import {
	_convertOpacityToHex,
	_extractAlphaColorValues,
	_extractSolidColorValues,
	_isHex6,
	_isHex8,
	_isHSL,
	_isHSLA,
	_isRGB,
	_isRGBA,
	_isValidAlpha,
} from './helpers';
import type {
	ColorType,
	ConvertedColors,
	Hex6,
	Hex8,
	HSL,
	HSLA,
	OpacityValue,
	RGB,
	RGBA,
} from './types';

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
export const convertHslToHex = (h: number, s: number, l: number): Hex6 => {
	const rgb = convertHslToRgb(h, s, l).match(/\d+/g)!.map(Number);

	return convertRgbToHex(rgb[0], rgb[1], rgb[2]);
};

/**
 * * Converts Hex to HSL color format.
 *
 * @param hex - A string representing the color in Hex format (e.g., `#FF0000`).
 * @returns A string representing the color in HSL format (e.g., `hsl(0, 100%, 50%)`).
 */
export const convertHexToHsl = (hex: Hex6 | string): HSL => {
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
 * @returns A string representing the color in Hex format (e.g., `#FF0000`).
 */
export const convertRgbToHex = (r: number, g: number, b: number): Hex6 => {
	const hex = [r, g, b]
		.map((v) => v.toString(16).padStart(2, '0'))
		.join('')
		.toUpperCase();

	return `#${hex}` as Hex6;
};

/**
 * * Converts Hex to RGB color format.
 *
 * @param hex - A string representing the color in Hex format (e.g., `#FF0000`).
 * @returns A string representing the color in RGB format (e.g., `rgb(255, 0, 0)`).
 */
export const convertHexToRgb = (hex: Hex6 | string): RGB => {
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
 * * Converts RGB to RGBA format, adding alpha (opacity).
 *
 * @param r - The red component of the RGB color, in the range 0 to 255.
 * @param g - The green component of the RGB color, in the range 0 to 255.
 * @param b - The blue component of the RGB color, in the range 0 to 255.
 * @param a - The alpha (opacity) value, in the range 0 to 1.
 * @returns A string representing the color in RGBA format (e.g., `rgba(255, 0, 0, 0.5)`).
 */
export const convertRgbToRgba = (
	r: number,
	g: number,
	b: number,
	a: number = 1,
): RGBA => {
	let newAlpha = a;

	if (!_isValidAlpha(a)) {
		newAlpha = 1;

		console.warn(`Alpha value must be between 0-1, ${a} converted to 1!`);
	}

	return `rgba(${r}, ${g}, ${b}, ${parseFloat(newAlpha.toFixed(1))})`;
};

/**
 * * Converts RGBA to Hex format, including alpha channel as part of Hex8.
 *
 * @param r - The red component of the RGB color, in the range 0 to 255.
 * @param g - The green component of the RGB color, in the range 0 to 255.
 * @param b - The blue component of the RGB color, in the range 0 to 255.
 * @param a - The alpha (opacity) value, in the range 0 to 1.
 * @returns A string representing the color in Hex8 format (e.g., `#FF000080`).
 */
export const convertRgbaToHex8 = (
	r: number,
	g: number,
	b: number,
	a: number = 1,
): Hex8 => {
	let newAlpha = a;

	if (!_isValidAlpha(a)) {
		newAlpha = 1;

		console.warn(`Alpha value must be between 0-1, ${a} converted to 1!`);
	}

	const hex = convertRgbToHex(r, g, b);

	const alphaHex = _convertOpacityToHex(
		Math.round(newAlpha * 100) as OpacityValue,
	);

	return `#${hex}${alphaHex}` as Hex8;
};

/**
 * * Converts HSLA to RGBA color format, including alpha channel.
 *
 * @param h - The hue component of the HSL color, in degrees (0 to 360).
 * @param s - The saturation component of the HSL color, as a percentage (0 to 100).
 * @param l - The lightness component of the HSL color, as a percentage (0 to 100).
 * @param a - The alpha (opacity) value, in the range 0 to 1.
 * @returns A string representing the color in RGBA format (e.g., `rgba(255, 0, 0, 0.5)`).
 */
export const convertHslaToRgba = (
	h: number,
	s: number,
	l: number,
	a: number = 1,
): RGBA => {
	let newAlpha = a;

	if (!_isValidAlpha(a)) {
		newAlpha = 1;

		console.warn(`Alpha value must be between 0-1, ${a} converted to 1!`);
	}

	const rgb = convertHslToRgb(h, s, l);
	const rgbNumbers = _extractSolidColorValues(rgb);

	return convertRgbToRgba(
		rgbNumbers[0],
		rgbNumbers[1],
		rgbNumbers[2],
		parseFloat(newAlpha.toFixed(1)),
	);
};

/**
 * * Converts RGBA to HSLA color format, including alpha channel.
 *
 * @param r - The red component of the RGB color, in the range 0 to 255.
 * @param g - The green component of the RGB color, in the range 0 to 255.
 * @param b - The blue component of the RGB color, in the range 0 to 255.
 * @param a - The alpha (opacity) value, in the range 0 to 1.
 * @returns A string representing the color in HSLA format (e.g., `hsla(0, 100%, 50%, 0.5)`).
 */
export const convertRgbaToHsla = (
	r: number,
	g: number,
	b: number,
	a: number = 1,
): HSLA => {
	let newAlpha = a;

	if (!_isValidAlpha(a)) {
		newAlpha = 1;

		console.warn(`Alpha value must be between 0-1, ${a} converted to 1!`);
	}

	const hsl = convertRgbToHsl(r, g, b);
	const hslNumbers = _extractSolidColorValues(hsl);

	return `hsla(${hslNumbers[0]}, ${hslNumbers[1]}%, ${hslNumbers[2]}%, ${parseFloat(newAlpha.toFixed(1))})`;
};

/**
 * * Converts Hex8 to RGBA color format, including alpha channel.
 *
 * @param hex8 - A string representing the color in Hex8 format (e.g., `#FF000080`).
 * @returns A string representing the color in RGBA format (e.g., `rgba(255, 0, 0, 0.5)`).
 */
export const convertHex8ToRgba = (hex8: Hex8): RGBA => {
	const hex = hex8.replace('#', '');
	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);
	const a = parseInt(hex.slice(6, 8), 16) / 255;

	return `rgba(${r}, ${g}, ${b}, ${parseFloat(a.toFixed(1))})`;
};

/**
 * * Converts HSLA to Hex8 color format, including alpha channel.
 *
 * @param h - The hue component of the HSL color, in degrees (0 to 360).
 * @param s - The saturation component of the HSL color, as a percentage (0 to 100).
 * @param l - The lightness component of the HSL color, as a percentage (0 to 100).
 * @param a - The alpha (opacity) value, in the range 0 to 1.
 * @returns A string representing the color in Hex8 format (e.g., `#658789DF`).
 */
export const convertHslaToHex8 = (
	h: number,
	s: number,
	l: number,
	a: number = 1,
): Hex8 => {
	let newAlpha = a;

	if (!_isValidAlpha(a)) {
		newAlpha = 1;

		console.warn(`Alpha value must be between 0-1, ${a} converted to 1!`);
	}

	const hex = convertHslToHex(h, s, l);

	const alphaHex = _convertOpacityToHex(
		Math.round(newAlpha * 100) as OpacityValue,
	);

	return `#${hex}${alphaHex}` as Hex8;
};

/**
 * * Converts Hex8 to HSLA color format.
 *
 * @param hex - A string representing the color in Hex format (e.g., `#FF0000DE`).
 * @returns A string representing the color in HSLA format..
 */
export const convertHex8ToHsla = (hex8: Hex8): HSLA => {
	const rgba = convertHex8ToRgba(hex8);

	return convertRgbaToHsla(..._extractAlphaColorValues(rgba as RGBA));
};

/**
 * * Converts a `Hex` color code to `RGB` and `HSL` formats.
 *
 * @param color The `Hex` color code (e.g., `#3c6945`).
 * @returns An object containing the `RGB` and `HSL` formats of the given `Hex` color.
 */
export function convertColorCode(color: Hex6): {
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
	hex: Hex6;
	hsl: HSL;
};

/**
 * * Converts an `HSL` color to `Hex` and `RGB` formats.
 *
 * @param color The `HSL` color string (e.g., `hsl(132, 27.27%, 32.35%)`).
 * @returns An object containing the `Hex` and `RGB` formats of the given `HSL` color.
 */
export function convertColorCode(color: HSL): {
	hex: Hex6;
	rgb: RGB;
};

/**
 * * Converts a `Hex8` color code to `RGB` and `HSL` formats.
 *
 * @param color The `Hex8` color code (e.g., `#3c6945`).
 * @returns An object containing the `RGB` and `HSL` formats of the given `Hex8` color.
 */
export function convertColorCode(color: Hex8): {
	rgba: RGBA;
	hsla: HSLA;
};

/**
 * * Converts an `RGBA` color to `Hex8` and `HSLA` formats.
 *
 * @param color The `RGBA` color string (e.g., `rgb(60, 105, 69)`).
 * @returns An object containing the `Hex8` and `HSLA` formats of the given `RGBA` color.
 */
export function convertColorCode(color: RGBA): {
	hex8: Hex8;
	hsla: HSLA;
};

/**
 * * Converts an `HSLA` color to `Hex8` and `RGBA` formats.
 *
 * @param color The `HSLA` color string (e.g., `hsl(132, 27.27%, 32.35%)`).
 * @returns An object containing the `Hex8` and `RGBA` formats of the given `HSLA` color.
 */
export function convertColorCode(color: HSLA): {
	hex8: Hex8;
	rgba: RGBA;
};

/**
 * * Converts a color from `Hex`, `RGB`, or `HSL` format to its equivalent representations.
 *
 * @param color The color string in `Hex`, `RGB`, or `HSL` format.
 * @returns The converted color representations excluding the input format.
 * @throws If the color format is unrecognized throws `Error`.
 */
export function convertColorCode(color: ColorType): ConvertedColors<ColorType> {
	if (_isHex6(color)) {
		return {
			rgb: convertHexToRgb(color),
			hsl: convertHexToHsl(color),
		} as ConvertedColors<Hex6>;
	}

	if (_isRGB(color)) {
		const rgbValues = _extractSolidColorValues(color as RGB);

		return {
			hex: convertRgbToHex(...rgbValues),
			hsl: convertRgbToHsl(...rgbValues),
		} as ConvertedColors<RGB>;
	}

	if (_isHSL(color)) {
		const hslValues = _extractSolidColorValues(color as HSL);

		return {
			hex: convertHslToHex(...hslValues),
			rgb: convertHslToRgb(...hslValues),
		} as ConvertedColors<HSL>;
	}

	if (_isHex8(color)) {
		return {
			rgba: convertHex8ToRgba(color),
			hsla: convertHex8ToHsla(color),
		} as ConvertedColors<Hex8>;
	}

	if (_isRGBA(color)) {
		const rgbaValues = _extractAlphaColorValues(color as RGBA);

		return {
			hex8: convertRgbaToHex8(...rgbaValues),
			hsla: convertRgbaToHsla(...rgbaValues),
		} as ConvertedColors<RGBA>;
	}

	if (_isHSLA(color)) {
		const hslaValues = _extractAlphaColorValues(color as HSLA);

		return {
			hex8: convertHslaToHex8(...hslaValues),
			rgba: convertHslaToRgba(...hslaValues),
		} as ConvertedColors<HSLA>;
	}

	throw new Error(`Unrecognized Color Format! ${color}`);
}
