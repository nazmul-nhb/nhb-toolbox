import { convertColorCode } from './convert';
import { generateRandomHSLColor } from './random';
import type { Colors, ColorType, Hex, HSL, RGB } from './types';

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
	public hex: Hex;
	public rgb: RGB;
	public hsl: HSL;

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
			this.hex = this._convertColorToOthers(toConvert).hex;
			this.rgb = this._convertColorToOthers(toConvert).rgb;
			this.hsl = this._convertColorToOthers(toConvert).hsl;
		} else {
			this.hex = hexRGB.hex;
			this.rgb = hexRGB.rgb;
			this.hsl = hsl;
		}
	}

	/**
	 * - Converts the given color to all other formats while preserving the original.
	 *
	 * @private
	 * @param color - The color to convert.
	 * @returns An object containing Hex, RGB, and HSL representations.
	 */
	private _convertColorToOthers(color: ColorType): Colors {
		if (Color.isHex(color)) {
			return {
				hex: color,
				rgb: convertColorCode(color).rgb,
				hsl: convertColorCode(color).hsl,
			};
		} else if (Color.isRGB(color)) {
			return {
				hex: convertColorCode(color).hex,
				rgb: color,
				hsl: convertColorCode(color).hsl,
			};
		} else if (Color.isHSL(color)) {
			return {
				hex: convertColorCode(color).hex,
				rgb: convertColorCode(color).rgb,
				hsl: color,
			};
		}

		throw new Error(`Unrecognized Color Format: ${color}`);
	}

	/**
	 * @static
	 * Checks if a color is in `Hex` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's a `Hex` color, `false` if not.
	 */
	public static isHex(color: string): color is Hex {
		return /^#[0-9A-Fa-f]{6}$/.test(color);
	}

	/**
	 * @static
	 * Checks if a color is in `RGB` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's an `RGB` color, `false` if not.
	 */
	public static isRGB(color: string): color is RGB {
		return /^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/.test(color);
	}

	/**
	 * @static
	 * Checks if a color is in `HSL` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's an `HSL` color, `false` if not.
	 */
	public static isHSL(color: string): color is HSL {
		return /^hsl\(\d{1,3}, \d{1,3}%, \d{1,3}%\)$/.test(color);
	}
}
