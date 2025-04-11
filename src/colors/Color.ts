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
const { hex, rgb } = convertColorCode(hsl);

/**
 * * Class representing a color and its conversions among `Hex`, `Hex8` `RGB`, `RGBA`, `HSL` and `HSLA` formats.
 * * It has 1 instance method `applyOpacity()` to apply opacity to `Hex`, `Hex8` `RGB`, `RGBA`, `HSL` or `HSLA` color.
 * * It has 6 static methods that can be used to check if a color is in `Hex`, `Hex8` `RGB`, `RGBA`, `HSL` or `HSLA` format.
 *
 * @property hex - The color in `Hex` format.
 * @property hex8 - The color in `Hex8` format.
 * @property rgb - The color in `RGB` format.
 * @property rgba - The color in `RGBA` format.
 * @property hsl - The color in `HSL` format.
 * @property hsla - The color in `HSLA` format.
 */
export class Color {
	public hex: Hex6;
	public hex8: Hex8;
	public rgb: RGB;
	public rgba: RGBA;
	public hsl: HSL;
	public hsla: HSLA;

	/**
	 * * Creates a new `Color` instance with a random color and automatically converts the generated color to all other supported formats: `Hex`, `Hex8`, `RGB`, `RGBA`, `HSL`, and `HSLA`.
	 *
	 * @description
	 * The `Color` class generates a random color in six common color representations:
	 * - `Hex` (e.g., `#ff5733`)
	 * - `Hex8` (Hex with opacity, e.g., `#ff573380`)
	 * - `RGB` (e.g., `rgb(255, 87, 51)`)
	 * - `RGBA` (e.g., `rgba(255, 87, 51, 1)`)
	 * - `HSL` (e.g., `hsl(14, 100%, 60%)`)
	 * - `HSLA` (e.g., `hsla(14, 100%, 60%, 1)`)
	 *
	 * Additionally:
	 * - Use `.applyOpacity(opacity)` to modify or add opacity to the color.
	 * - Use static methods like `Color.isHex6(color)` to validate color strings.
	 *
	 * @example
	 * // Generate a random color
	 * const randomColor = new Color();
	 * console.log(randomColor.hex, randomColor.rgb, randomColor.hsl);
	 *
	 * @returns Instance of `Color`.
	 */
	constructor();

	/**
	 * * Creates a new `Color` instance with the input color and automatically converts it to all other supported formats: `Hex`, `Hex8`, `RGB`, `RGBA`, `HSL`, and `HSLA`.
	 *
	 * @description
	 * The `Color` class allows seamless transformation between six common color representations:
	 * - `Hex` (e.g., `#ff5733`)
	 * - `Hex8` (Hex with opacity, e.g., `#ff573380`)
	 * - `RGB` (e.g., `rgb(255, 87, 51)`)
	 * - `RGBA` (e.g., `rgba(255, 87, 51, 1)`)
	 * - `HSL` (e.g., `hsl(14, 100%, 60%)`)
	 * - `HSLA` (e.g., `hsla(14, 100%, 60%, 1)`)
	 *
	 * You can create a color from any of these formats, and the class will populate the rest.
	 *
	 * Additionally:
	 * - Use `.applyOpacity(opacity)` to modify or add opacity to the color.
	 * - Use available 6 static methods like `Color.isHex6(color)` to validate color strings.
	 *
	 * @param toConvert - A color string in any supported format (`Hex`, `Hex8`, `RGB`, `RGBA`, `HSL`, or `HSLA`) to convert in all other formats (includes the current format).
	 *
	 * @example
	 * // Convert an existing Hex color to all other formats
	 * const color = new Color("#ff5733");
	 * console.log(color.rgb); // 'rgb(255, 87, 51)'
	 * console.log(color.hsl); // 'hsl(14, 100%, 60%)'
	 * console.log(color.rgba); // 'rgba(255, 87, 51, 1)'
	 * console.log(color.hsla); // 'hsla(14, 100%, 60%, 1)'
	 * console.log(color.hex8); // '#FF5733FF'
	 *
	 * @example
	 * // Handle a color with alpha
	 * const alphaColor = new Color("rgba(255, 0, 0, 0.5)");
	 * console.log(alphaColor.hex8); // '#FF000080'
	 * console.log(alphaColor.hsla); // 'hsla(0, 100%, 50%, 0.5)'
	 *
	 * @returns Instance of `Color`.
	 */
	constructor(toConvert: ColorType);

	/**
	 * * Creates a new `Color` instance and automatically converts the input color to all other supported formats: `Hex`, `Hex8`, `RGB`, `RGBA`, `HSL`, and `HSLA`.
	 *
	 * @description
	 * The `Color` class allows seamless transformation between six common color representations:
	 * - `Hex` (e.g., `#ff5733`)
	 * - `Hex8` (Hex with opacity, e.g., `#ff573380`)
	 * - `RGB` (e.g., `rgb(255, 87, 51)`)
	 * - `RGBA` (e.g., `rgba(255, 87, 51, 1)`)
	 * - `HSL` (e.g., `hsl(14, 100%, 60%)`)
	 * - `HSLA` (e.g., `hsla(14, 100%, 60%, 1)`)
	 *
	 * You can create a color from any of these formats, and the class will populate the rest.
	 * If no color is passed, a random color will be generated.
	 *
	 * Additionally:
	 * - Use `.applyOpacity(opacity)` to modify or add opacity to the color.
	 * - Use static methods like `Color.isHex6(color)` to validate color strings.
	 *
	 * @param toConvert - An optional input color string in any supported format (`Hex`, `Hex8`, `RGB`, `RGBA`, `HSL`, or `HSLA`) to convert in all other (includes the current format) formats.
	 *
	 * @example
	 * // Convert an existing Hex color to all other formats
	 * const color = new Color("#ff5733");
	 * console.log(color.rgb); // 'rgb(255, 87, 51)'
	 * console.log(color.hsl); // 'hsl(14, 100%, 60%)'
	 * console.log(color.rgba); // 'rgba(255, 87, 51, 1)'
	 * console.log(color.hsla); // 'hsla(14, 100%, 60%, 1)'
	 * console.log(color.hex8); // '#FF5733FF'
	 *
	 * @example
	 * // Handle a color with alpha
	 * const alphaColor = new Color("rgba(255, 0, 0, 0.5)");
	 * console.log(alphaColor.hex8); // '#FF000080'
	 * console.log(alphaColor.hsla); // 'hsla(0, 100%, 50%, 0.5)'
	 *
	 * @example
	 * // Generate a random color
	 * const randomColor = new Color();
	 * console.log(randomColor.hex, randomColor.rgb, randomColor.hsl);
	 *
	 * @returns Instance of `Color`.
	 */
	constructor(toConvert?: ColorType) {
		if (toConvert) {
			const colors = this.#convertColorToOthers(toConvert);

			if ('hex8' in colors) {
				// Extract alpha color values (Hex8, RGBA, HSLA)
				const rgbaValues = _extractAlphaColorValues(colors.rgba);
				const hslaValues = _extractAlphaColorValues(colors.hsla);

				this.hex = colors.hex8.toUpperCase().slice(0, 7) as Hex6;
				this.hex8 = colors.hex8.toUpperCase() as Hex8;
				this.rgb = `rgb(${rgbaValues[0]}, ${rgbaValues[1]}, ${rgbaValues[2]})`;
				this.rgba = colors.rgba;
				this.hsl = `hsl(${hslaValues[0]}, ${hslaValues[1]}%, ${hslaValues[2]}%)`;
				this.hsla = colors.hsla;
			} else {
				// Extract solid color values (Hex, RGB, HSL)
				const rgbValues = _extractSolidColorValues(colors.rgb);
				const hslValues = _extractSolidColorValues(colors.hsl);

				this.hex = colors.hex.toUpperCase() as Hex6;
				this.hex8 =
					`${colors.hex.toUpperCase()}${_convertOpacityToHex(100)}` as Hex8;
				this.rgb = colors.rgb;
				this.rgba = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 1)`;
				this.hsl = colors.hsl;
				this.hsla = `hsla(${hslValues[0]}, ${hslValues[1]}%, ${hslValues[2]}%, 1)`;
			}
		} else {
			const rgbValues = _extractSolidColorValues(rgb);
			const hslValues = _extractSolidColorValues(hsl);

			// Generate random colors
			this.hex = hex.toUpperCase() as Hex6;
			this.hex8 =
				`${hex.toUpperCase()}${_convertOpacityToHex(100)}` as Hex8;
			this.rgb = rgb;
			this.rgba = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 1)`;
			this.hsl = hsl;
			this.hsla = `hsla(${hslValues[0]}, ${hslValues[1]}%, ${hslValues[2]}%, 1)`;
		}
	}

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
	 * console.log(alpha75.hex8); // #FF0000BF
	 */
	applyOpacity(opacity: OpacityValue): SolidColors & AlphaColors {
		const validOpacity = Math.min(100, Math.max(0, opacity));
		const alphaHex = _convertOpacityToHex(opacity);
		const alphaDecimal = validOpacity / 100;

		const rgbValues = _extractSolidColorValues(this.rgb);
		const hslValues = _extractSolidColorValues(this.hsl);

		return {
			hex: this.hex.slice(0, 7).toUpperCase() as Hex6,
			hex8: `${this.hex.slice(0, 7)}${alphaHex}`.toUpperCase() as Hex8,
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
	static isHex6(color: string): color is Hex6 {
		return /^#[0-9A-Fa-f]{6}$/.test(color);
	}

	/**
	 * @static Checks if a color is in `Hex8` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's a `Hex8` color, `false` if not.
	 */
	static isHex8(color: string): color is Hex8 {
		return /^#[0-9A-Fa-f]{8}$/.test(color);
	}

	/**
	 * @static Checks if a color is in `RGB` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's an `RGB` color, `false` if not.
	 */
	static isRGB(color: string): color is RGB {
		return /^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/.test(color);
	}

	/**
	 * @static Checks if a color is in `RGBA` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's an `RGBA` color, `false` if not.
	 */
	static isRGBA(color: string): color is RGBA {
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
	static isHSL(color: string): color is HSL {
		return /^hsl\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%\)$/.test(color);
	}

	/**
	 * @static Checks if a color is in `HSLA` format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's an `HSLA` color, `false` if not.
	 */
	static isHSLA(color: string): color is HSLA {
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
	#convertColorToOthers(color: ColorType): SolidColors | AlphaColors {
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

		throw new Error(`Unrecognized color format: ${color}`);
	}
}
