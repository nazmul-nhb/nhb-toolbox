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
 * * Class representing a color and its conversions between Hex, RGB, and HSL formats.
 * * It has  3 static methods that can be used to check if a color is in `Hex`, `RGB` or `HSL` format.
 *
 * @property {Hex} hex - The color in `Hex` format.
 * @property {RGB} rgb - The color in `RGB` format.
 * @property {HSL} hsl - The color in `HSL` format.
 *
 * @example
 * const color = new Color("#ff5733"); // Accepts a color in `Hex`, `RGB` or `HSL` format.
 * console.log(color.rgb); // Get RGB equivalent
 * console.log(color.hsl); // Get HSL equivalent
 *
 * @example
 * const randomColor = new Color(); // Generate a random color
 * console.log(randomColor.hex, randomColor.rgb, randomColor.hsl);
 */
export class Color {
	public hex: Hex6 | Hex8;
	public rgb: RGB | RGBA;
	public hsl: HSL | HSLA;

	/** - Iterates over the color representations (Hex, RGB, HSL). */
	*[Symbol.iterator]() {
		yield this.hex;
		yield this.rgb;
		yield this.hsl;
	}

	/**
	 * * Creates a new Color instance, optionally converting an input color.
	 *
	 * @param toConvert - The color to convert. If not provided, a random color is generated.
	 */
	constructor(toConvert?: ColorType) {
		if (toConvert) {
			const converted = this._convertColorToOthers(toConvert);

			if ('hex8' in converted) {
				// Handle alpha colors (Hex8, RGBA, HSLA)
				this.hex = converted.hex8;
				this.rgb = converted.rgba;
				this.hsl = converted.hsla;
			} else {
				// Handle solid colors (Hex, RGB, HSL)
				this.hex = converted.hex;
				this.rgb = converted.rgb;
				this.hsl = converted.hsl;
			}
		} else {
			// Generate random color
			this.hex = hexRGB.hex;
			this.rgb = hexRGB.rgb;
			this.hsl = hsl;
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

		if (Color.isHex8(this.hex)) {
			const rgbaValues = _extractAlphaColorValues(this.rgb as RGBA);
			const hslaValues = _extractAlphaColorValues(this.hsl as HSLA);

			return {
				hex: this.hex.slice(0, 7) as Hex6,
				hex8: `${this.hex.slice(0, 7)}${alphaHex}` as Hex8,
				rgb: `rgba(${rgbaValues[0]}, ${rgbaValues[1]}, ${rgbaValues[2]})` as RGB,
				rgba: `rgba(${rgbaValues[0]}, ${rgbaValues[1]}, ${rgbaValues[2]}, ${alphaDecimal})` as RGBA,
				hsl: `hsla(${hslaValues[0]}, ${hslaValues[1]}%, ${hslaValues[2]}%)` as HSL,
				hsla: `hsla(${hslaValues[0]}, ${hslaValues[1]}%, ${hslaValues[2]}%, ${alphaDecimal})` as HSLA,
			};
		}

		const rgbValues = _extractSolidColorValues(this.rgb as RGB);
		const hslValues = _extractSolidColorValues(this.hsl as HSL);

		return {
			hex: this.hex as Hex6,
			hex8: `${this.hex}${alphaHex}` as Hex8,
			rgb: this.rgb as RGB,
			rgba: `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${alphaDecimal})` as RGBA,
			hsl: this.hsl as HSL,
			hsla: `hsla(${hslValues[0]}, ${hslValues[1]}%, ${hslValues[2]}%, ${alphaDecimal})` as HSLA,
		};
	}

	/**
	 * Creates a new Color instance from a hex string
	 * @param hex The hex color string
	 */
	public static fromHex(hex: string): Color {
		if (this.isHex6(hex as ColorType)) {
			return new Color(hex as Hex6);
		}
		if (this.isHex8(hex as ColorType)) {
			return new Color(hex as Hex8);
		}
		throw new Error(`Unrecognized Hex Format: ${hex}`);
	}

	/**
	 * @static
	 * Checks if a color is in `Hex6` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's a `Hex6` color, `false` if not.
	 */
	public static isHex6(color: ColorType): color is Hex6 {
		return /^#[0-9A-Fa-f]{6}$/.test(color);
	}

	/**
	 * @static
	 * Checks if a color is in `Hex8` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's a `Hex8` color, `false` if not.
	 */
	public static isHex8(color: ColorType): color is Hex8 {
		return /^#[0-9A-Fa-f]{8}$/.test(color);
	}

	/**
	 * @static
	 * Checks if a color is in `RGB` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's an `RGB` color, `false` if not.
	 */
	public static isRGB(color: ColorType): color is RGB {
		return /^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/.test(color);
	}

	/**
	 * @static
	 * Checks if a color is in `RGBA` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's an `RGBA` color, `false` if not.
	 */
	public static isRGBA(color: ColorType): color is RGBA {
		return /^rgba\(\d{1,3}, \d{1,3}, \d{1,3}, (0|1|0?\.\d+)\)$/.test(color);
	}

	/**
	 * @static
	 * Checks if a color is in `HSL` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's an `HSL` color, `false` if not.
	 */
	public static isHSL(color: ColorType): color is HSL {
		return /^hsl\(\d{1,3}, \d{1,3}%, \d{1,3}%\)$/.test(color);
	}

	/**
	 * @static
	 * Checks if a color is in `HSLA` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's an `HSLA` color, `false` if not.
	 */
	public static isHSLA(color: ColorType): color is HSLA {
		return /^hsla\(\d{1,3}, \d{1,3}%, \d{1,3}%, (0|1|0?\.\d+)\)$/.test(
			color,
		);
	}

	/**
	 * - Converts the given color to all other formats while preserving the original.
	 *
	 * @private
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

		throw new Error(`Unrecognized Color Format: ${color}`);
	}
}
