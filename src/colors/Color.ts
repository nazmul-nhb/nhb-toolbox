import { convertColorCode } from './convert';
import {
	_convertOpacityToHex,
	_extractAlphaColorValues,
	_extractSolidColorValues,
} from './helpers';
import { generateRandomHSLColor } from './random';
import type {
	AlphaColors,
	ColorType,
	Hex6,
	Hex8,
	HSL,
	HSLA,
	OpacityValue,
	RGB,
	RGBA,
	SolidColors,
} from './types';

const hsl = generateRandomHSLColor();
const hexRGB = convertColorCode(hsl);

/**
 * * Class representing a color and its conversions among `Hex`, `Hex8` `RGB`, `RGBA`, `HSL` and `HSLA` formats.
 * * It has 1 instance method `applyOpacity()` to apply opacity to `Hex`, `Hex8` `RGB`, `RGBA`, `HSL` or `HSLA` color.
 * * It has 6 static methods that can be used to check if a color is in `Hex`, `Hex8` `RGB`, `RGBA`, `HSL` or `HSLA` format.
 *
 * @property {Hex} hex - The color in `Hex` format.
 * @property {Hex8} hex8 - The color in `Hex8` format.
 * @property {RGB} rgb - The color in `RGB` format.
 * @property {RGBA} rgba - The color in `RGBA` format.
 * @property {HSL} hsl - The color in `HSL` format.
 * @property {HSLA} hsla - The color in `HSLA` format.
 *
 * @example
 * const color = new Color("#ff5733"); // Accepts a color in `Hex`, `Hex8` `RGB`, `RGBA`, `HSL` or `HSLA` format.
 * console.log(color.hex); // Get Hex equivalent
 * console.log(color.hex8); // Get Hex8 equivalent
 * console.log(color.rgb); // Get RGB equivalent
 * console.log(color.rgba); // Get RGBA equivalent
 * console.log(color.hsl); // Get HSL equivalent
 * console.log(color.hsla); // Get HSLA equivalent
 *
 * @example
 * const randomColor = new Color(); // Generate a random color
 * console.log(randomColor.hex, randomColor.rgb, randomColor.hsl, randomColor.hex8, randomColor.rgba, randomColor.hsla); // Get RGBA and HSLA equivalent
 */
export class Color {
	public hex: Hex6;
	public hex8: Hex8;
	public rgb: RGB;
	public rgba: RGBA;
	public hsl: HSL;
	public hsla: HSLA;

	/** - Iterates over the color representations (Hex, RGB, HSL). */
	*[Symbol.iterator]() {
		yield this.hex;
		yield this.hex8;
		yield this.rgb;
		yield this.rgba;
		yield this.hsl;
		yield this.hsla;
	}

	/**
	 * * Creates a new `Color` instance, optionally converts an input color to other 5 different color formats.
	 *
	 * @param toConvert - The color to convert. If not provided, a random color is generated.
	 */
	constructor(toConvert?: ColorType) {
		if (toConvert) {
			const colors = this._convertColorToOthers(toConvert);

			if ('hex8' in colors) {
				// Extract alpha color values (Hex8, RGBA, HSLA)
				const rgbaValues = _extractAlphaColorValues(colors.rgba);
				const hslaValues = _extractAlphaColorValues(colors.hsla);

				this.hex = colors.hex8.slice(0, 7) as Hex6;
				this.hex8 = colors.hex8;
				this.rgb = `rgb(${rgbaValues[0]}, ${rgbaValues[1]}, ${rgbaValues[2]})`;
				this.rgba = colors.rgba;
				this.hsl = `hsl(${hslaValues[0]}, ${hslaValues[1]}%, ${hslaValues[2]}%)`;
				this.hsla = colors.hsla;
			} else {
				// Extract solid color values (Hex, RGB, HSL)
				const rgbValues = _extractSolidColorValues(colors.rgb);
				const hslValues = _extractSolidColorValues(colors.hsl);

				this.hex = colors.hex;
				this.hex8 = `${colors.hex}${_convertOpacityToHex(100)}` as Hex8;
				this.rgb = colors.rgb;
				this.rgba = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 1)`;
				this.hsl = colors.hsl;
				this.hsla = `hsla(${hslValues[0]}, ${hslValues[1]}%, ${hslValues[2]}%, 1)`;
			}
		} else {
			const rgbValues = _extractSolidColorValues(hexRGB.rgb);
			const hslValues = _extractSolidColorValues(hsl);

			// Generate random colors
			this.hex = hexRGB.hex;
			this.hex8 = `${hexRGB.hex}${_convertOpacityToHex(100)}` as Hex8;
			this.rgb = hexRGB.rgb;
			this.rgba = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 1)`;
			this.hsl = hsl;
			this.hsla = `hsla(${hslValues[0]}, ${hslValues[1]}%, ${hslValues[2]}%, 1)`;
		}
	}

	/**
	 * * Applies or modifies the opacity of a color.
	 * - For solid colors (Hex6/RGB/HSL): Adds an alpha channel with the specified opacity
	 * - For alpha colors (Hex8/RGBA/HSLA): Updates the existing alpha channel
	 *
	 * @param opacity - A number between 0-100 representing the opacity percentage
	 * @returns An object containing all color formats with the applied opacity
	 *
	 * @example
	 * const color = new Color("#ff0000");
	 * const alpha50 = color.applyOpacity(50); // 50% opacity
	 * console.log(alpha50.rgba); // rgba(255, 0, 0, 0.5)
	 *
	 * @example
	 * const alphaColor = new Color("#ff000080"); // Color with 50% opacity
	 * const alpha75 = alphaColor.applyOpacity(75); // Change to 75% opacity
	 * console.log(alpha75.hex8); // #ff0000bf
	 */
	applyOpacity(opacity: OpacityValue): SolidColors & AlphaColors {
		const validOpacity = Math.min(100, Math.max(0, opacity));
		const alphaHex = _convertOpacityToHex(opacity);
		const alphaDecimal = validOpacity / 100;

		if (Color.isHex8(this.hex8)) {
			const rgbaValues = _extractAlphaColorValues(this.rgba);
			const hslaValues = _extractAlphaColorValues(this.hsla);

			return {
				hex: this.hex8.slice(0, 7) as Hex6,
				hex8: `${this.hex8.slice(0, 7)}${alphaHex}` as Hex8,
				rgb: `rgb(${rgbaValues[0]}, ${rgbaValues[1]}, ${rgbaValues[2]})` as RGB,
				rgba: `rgba(${rgbaValues[0]}, ${rgbaValues[1]}, ${rgbaValues[2]}, ${alphaDecimal})` as RGBA,
				hsl: `hsl(${hslaValues[0]}, ${hslaValues[1]}%, ${hslaValues[2]}%)` as HSL,
				hsla: `hsla(${hslaValues[0]}, ${hslaValues[1]}%, ${hslaValues[2]}%, ${alphaDecimal})` as HSLA,
			};
		}

		const rgbValues = _extractSolidColorValues(this.rgb);
		const hslValues = _extractSolidColorValues(this.hsl);

		return {
			hex: this.hex.slice(0, 7) as Hex6,
			hex8: `${this.hex.slice(0, 7)}${alphaHex}` as Hex8,
			rgb: `rgb(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]})` as RGB,
			rgba: `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${alphaDecimal})` as RGBA,
			hsl: `hsl(${hslValues[0]}, ${hslValues[1]}%, ${hslValues[2]}%)` as HSL,
			hsla: `hsla(${hslValues[0]}, ${hslValues[1]}%, ${hslValues[2]}%, ${alphaDecimal})` as HSLA,
		};
	}

	/**
	 * @static Checks if a color is in `Hex6` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's a `Hex6` color, `false` if not.
	 */
	public static isHex6(color: string): color is Hex6 {
		return /^#[0-9A-Fa-f]{6}$/.test(color);
	}

	/**
	 * @static Checks if a color is in `Hex8` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's a `Hex8` color, `false` if not.
	 */
	public static isHex8(color: string): color is Hex8 {
		return /^#[0-9A-Fa-f]{8}$/.test(color);
	}

	/**
	 * @static Checks if a color is in `RGB` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's an `RGB` color, `false` if not.
	 */
	public static isRGB(color: string): color is RGB {
		return /^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/.test(color);
	}

	/**
	 * @static Checks if a color is in `RGBA` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's an `RGBA` color, `false` if not.
	 */
	public static isRGBA(color: string): color is RGBA {
		return /^rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*(0|1|0?\.\d+)\)$/.test(
			color,
		);
	}

	/**
	 * @static Checks if a color is in `HSL` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's an `HSL` color, `false` if not.
	 */
	public static isHSL(color: string): color is HSL {
		return /^hsl\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%\)$/.test(color);
	}

	/**
	 * @static Checks if a color is in `HSLA` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's an `HSLA` color, `false` if not.
	 */
	public static isHSLA(color: string): color is HSLA {
		return /^hsla\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%,\s*(0|1|0?\.\d+)\)$/.test(
			color,
		);
	}

	/**
	 * @private Converts the given color to all other formats while preserving the original.
	 *
	 * @param color - The color to convert.
	 * @returns An object containing Hex, RGB, and HSL representations.
	 */
	private _convertColorToOthers(color: ColorType): SolidColors | AlphaColors {
		if (Color.isHex6(color)) {
			const { rgb, hsl } = convertColorCode(color);
			return { hex: color, rgb, hsl };
		} else if (Color.isRGB(color)) {
			const { hex, hsl } = convertColorCode(color);
			return { hex, rgb: color, hsl };
		} else if (Color.isHSL(color)) {
			const { hex, rgb } = convertColorCode(color);
			return { hex, rgb, hsl: color };
		} else if (Color.isHex8(color)) {
			const { rgba, hsla } = convertColorCode(color);
			return { hex8: color, rgba, hsla };
		} else if (Color.isRGBA(color)) {
			const { hex8, hsla } = convertColorCode(color);
			return { hex8, rgba: color, hsla };
		} else if (Color.isHSLA(color)) {
			const { hex8, rgba } = convertColorCode(color);
			return { hex8, rgba, hsla: color };
		}

		throw new Error(`Unrecognized Color Format! ${color}`);
	}
}
