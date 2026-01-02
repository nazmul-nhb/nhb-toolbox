import { isHSL, isHSLA, isRGB, isRGBA } from './guards';
import type { AlphaValues, HSL, HSLA, RGB, RGBA, SolidValues } from './types';

/**
 * * Extracts numbers from a color string like `rgb(66, 103, 69)` or `hsl(120, 42.86%, 41.18%)`.
 * * Converts percentage values to decimal (e.g., `42.86%` → `42.86`).
 *
 * @param color The color string in RGB or HSL format.
 * @returns A tuple of 3 extracted numbers. `[number, number, number]`
 *
 * @remarks If the input color is not in `HSL` or `RGB` format, it will return `[0, 0, 0]`
 */
export const extractSolidColorValues = (color: HSL | RGB): SolidValues => {
	if (isHSL(color) || isRGB(color)) {
		return (color?.trim()?.match(/[\d.]+%?/g) || [])?.map((value) =>
			parseFloat(value)
		) as SolidValues;
	}

	return [0, 0, 0];
};

/**
 * * Extracts numbers from a color string like `rgba(66, 103, 69, 0.6)` or `hsla(120, 42.86%, 41.18%, 0.9)`.
 * * Converts percentage values to decimal (e.g., `42.86%` → `42.86`).
 *
 * @param color The color string in RGBA or HSLA format.
 * @returns A tuple of 4 extracted numbers. `[number, number, number, number]`
 *
 * @remarks If the input color is not in `HSLA` or `RGBA` format, it will return `[0, 0, 0, 0]`
 */
export const extractAlphaColorValues = (color: HSLA | RGBA): AlphaValues => {
	if (isHSLA(color) || isRGBA(color)) {
		return (color?.trim()?.match(/[\d.]+%?/g) || [])?.map((value) =>
			parseFloat(value)
		) as AlphaValues;
	}

	return [0, 0, 0, 0];
};
