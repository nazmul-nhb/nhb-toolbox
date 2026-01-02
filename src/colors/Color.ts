import { isNonEmptyString } from '../guards/primitives';
import type { Percent } from '../number/types';
import { convertColorCode } from './convert';
import { CSS_COLORS } from './css-colors';
import { isHSL, isHSLA, isRGB, isRGBA } from './guards';
import { _percentToHex } from './helpers';
import { generateRandomHSLColor } from './random';
import type {
	AlphaColors,
	Analogous,
	ColorType,
	CSSColor,
	Hex6,
	Hex8,
	HSL,
	HSLA,
	RGB,
	RGBA,
	SolidColors,
	Tetrad,
	Triad,
} from './types';
import { extractAlphaColorValues, extractSolidColorValues } from './utils';

/**
 * * Represents a color in {@link Hex6 Hex}, {@link Hex8}, {@link RGB}, {@link RGBA}, {@link HSL}, and {@link HSLA} formats.
 *
 * @remarks
 * - Instance methods allow transforming, adjusting, and deriving new colors.
 * - Static methods provide format validation and type-guard–style checks for supported color representations.
 *
 * @property `hex`  - {@link Hex6 Hex} color representation (without alpha).
 * @property `hex8` - {@link Hex8} color representation including alpha.
 * @property `rgb`  - {@link RGB} color representation (without alpha).
 * @property `rgba` - {@link RGBA} color representation including alpha.
 * @property `hsl`  - {@link HSL} color representation (without alpha).
 * @property `hsla` - {@link HSLA} color representation including alpha.
 */
export class Color {
	readonly hex: Hex6;
	readonly hex8: Hex8;
	readonly rgb: RGB;
	readonly rgba: RGBA;
	readonly hsl: HSL;
	readonly hsla: HSLA;

	/**
	 * * Creates a new `Color` instance with a random color and automatically converts the generated color to all other supported formats: {@link Hex6 Hex}, {@link Hex8}, {@link RGB}, {@link RGBA}, {@link HSL}, and {@link HSLA}.
	 *
	 * @description
	 * The `Color` class generates a random color in six common color representations:
	 * - {@link Hex6 Hex} (e.g., `#ff5733`)
	 * - {@link Hex8} (Hex with opacity, e.g., `#ff573380`)
	 * - {@link RGB} (e.g., `rgb(255, 87, 51)`)
	 * - {@link RGBA} (e.g., `rgba(255, 87, 51, 1)`)
	 * - {@link HSL} (e.g., `hsl(14, 100%, 60%)`)
	 * - {@link HSLA} (e.g., `hsla(14, 100%, 60%, 1)`)
	 *
	 * @remarks
	 * - Instance methods allow transforming, adjusting, and deriving new colors.
	 * - Static methods provide format validation and type-guard–style checks for supported color representations.
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
	 * * Creates a new `Color` instance with the input color and automatically converts it to all other supported formats: {@link Hex6 Hex}, {@link Hex8}, {@link RGB}, {@link RGBA}, {@link HSL}, and {@link HSLA}.
	 *
	 * @description
	 * The `Color` class allows seamless transformation between six common color representations:
	 * - {@link Hex6 Hex} (e.g., `#ff5733`)
	 * - {@link Hex8} (Hex with opacity, e.g., `#ff573380`)
	 * - {@link RGB} (e.g., `rgb(255, 87, 51)`)
	 * - {@link RGBA} (e.g., `rgba(255, 87, 51, 1)`)
	 * - {@link HSL} (e.g., `hsl(14, 100%, 60%)`)
	 * - {@link HSLA} (e.g., `hsla(14, 100%, 60%, 1)`)
	 *
	 * You can create a color from any of these formats, and the class will populate the rest.
	 *
	 * @remarks
	 * - Instance methods allow transforming, adjusting, and deriving new colors.
	 * - Static methods provide format validation and type-guard–style checks for supported color representations.
	 *
	 * @param color - A color string in any supported format (`Hex`, `Hex8`, `RGB`, `RGBA`, `HSL`, or `HSLA`) to convert in all other formats (includes the current format).
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
	constructor(color: ColorType);

	/**
	 * * Creates a new `Color` instance using a standard (CSS) named color and automatically converts it to all other supported formats: `Hex`, `Hex8`, `RGB`, `RGBA`, `HSL`, and `HSLA`.
	 *
	 * @description
	 * This allows you to use any valid named color from standard `150+ `CSS color names (e.g., `"red"`, `"blue"`, `"rebeccapurple"`)
	 *
	 * @param color - A named color string from standard `150+ `CSS color names.
	 *
	 * @example
	 * // Using a CSS named color
	 * const sky = new Color("skyblue");
	 * console.log(sky.hex); // '#87CEEB'
	 * console.log(sky.rgba); // 'rgba(135, 206, 235, 1)'
	 *
	 * @returns Instance of `Color`.
	 */
	constructor(color: CSSColor);

	/**
	 * * Creates a new `Color` instance and automatically converts the input color to all other supported formats: {@link Hex6 Hex}, {@link Hex8}, {@link RGB}, {@link RGBA}, {@link HSL}, and {@link HSLA}.
	 *
	 * @description
	 * The `Color` class allows seamless transformation between six common color representations:
	 * - {@link Hex6 Hex} (e.g., `#ff5733`)
	 * - {@link Hex8} (Hex with opacity, e.g., `#ff573380`)
	 * - {@link RGB} (e.g., `rgb(255, 87, 51)`)
	 * - {@link RGBA} (e.g., `rgba(255, 87, 51, 1)`)
	 * - {@link HSL} (e.g., `hsl(14, 100%, 60%)`)
	 * - {@link HSLA} (e.g., `hsla(14, 100%, 60%, 1)`)
	 *
	 * You can create a color from any of these formats, and the class will populate the rest.
	 * If no color is passed, a random color will be generated.
	 *
	 * @remarks
	 * - Instance methods allow transforming, adjusting, and deriving new colors.
	 * - Static methods provide format validation and type-guard–style checks for supported color representations.
	 *
	 * @param color - An optional input color string in any supported format (`Hex`, `Hex8`, `RGB`, `RGBA`, `HSL`, or `HSLA`) to convert in all other (includes the current format) formats.
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
	constructor(color?: ColorType | CSSColor) {
		if (color) {
			if (Color.isCSSColor(color)) {
				const newColor = new Color(CSS_COLORS[color?.trim() as CSSColor]);

				this.hex = newColor.hex;
				this.hex8 = newColor.hex8;
				this.rgb = newColor.rgb;
				this.rgba = newColor.rgba;
				this.hsl = newColor.hsl;
				this.hsla = newColor.hsla;
			} else {
				const colors = this.#convertColorToOthers(color?.trim() as ColorType);

				if ('hex8' in colors) {
					// Extract alpha color values (Hex8, RGBA, HSLA)
					const [r, g, b] = extractAlphaColorValues(colors.rgba);
					const [h, s, l] = extractAlphaColorValues(colors.hsla);

					this.hex = colors.hex8.toUpperCase().slice(0, 7) as Hex6;
					this.hex8 = colors.hex8.toUpperCase() as Hex8;
					this.rgb = `rgb(${r}, ${g}, ${b})`;
					this.rgba = colors.rgba;
					this.hsl = `hsl(${h}, ${s}%, ${l}%)`;
					this.hsla = colors.hsla;
				} else {
					// Extract solid color values (Hex, RGB, HSL)
					const [r, g, b] = extractSolidColorValues(colors.rgb);
					const [h, s, l] = extractSolidColorValues(colors.hsl);

					this.hex = colors.hex.toUpperCase() as Hex6;
					this.hex8 = `${colors.hex.toUpperCase()}${_percentToHex(100)}` as Hex8;
					this.rgb = colors.rgb;
					this.rgba = `rgba(${r}, ${g}, ${b}, 1)`;
					this.hsl = colors.hsl;
					this.hsla = `hsla(${h}, ${s}%, ${l}%, 1)`;
				}
			}
		} else {
			const hsl = generateRandomHSLColor();
			const { hex, rgb } = convertColorCode(hsl);

			const [r, g, b] = extractSolidColorValues(rgb);
			const [h, s, l] = extractSolidColorValues(hsl);

			this.hex = hex.toUpperCase() as Hex6;
			this.hex8 = `${hex.toUpperCase()}${_percentToHex(100)}` as Hex8;
			this.rgb = rgb;
			this.rgba = `rgba(${r}, ${g}, ${b}, 1)`;
			this.hsl = hsl;
			this.hsla = `hsla(${h}, ${s}%, ${l}%, 1)`;
		}
	}

	/** Iterates over the color representations (`Hex`, `RGB`, `HSL`). */
	*[Symbol.iterator]() {
		yield this.hex;
		yield this.hex8;
		yield this.rgb;
		yield this.rgba;
		yield this.hsl;
		yield this.hsla;
	}

	/**
	 * @instance Applies or modifies the opacity of a color and returns a new instance.
	 *
	 * @remarks
	 * - For solid colors ({@link Hex6}/{@link RGB}/{@link HSL}): Adds an alpha channel with the specified opacity.
	 * - For alpha colors ({@link Hex8}/{@link RGBA}/{@link HSLA}): Updates the existing alpha channel.
	 *
	 * @param opacity - A number between `0-100` representing the opacity percentage.
	 * @returns A new instance of `Color` containing all color formats with the applied opacity.
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
	applyOpacity(opacity: Percent): Color {
		const hex8 = `${this.hex.slice(0, 7)}${_percentToHex(opacity)}`.toUpperCase() as Hex8;

		return new Color(hex8);
	}

	/**
	 * @instance Darkens the color by reducing the lightness by the given percentage.
	 * @param percent - The percentage to darken (`0–100`).
	 * @returns A new `Color` instance with the modified darkness.
	 */
	applyDarkness(percent: Percent): Color {
		const [h, s, l, a] = extractAlphaColorValues(this.hsla);

		const newL = Math.max(0, l - percent);

		const newHSL = `hsl(${h}, ${s}%, ${newL}%)` as HSL;

		return new Color(newHSL).applyOpacity((a * 100) as Percent);
	}

	/**
	 * @instance Lightens the color by increasing the lightness by the given percentage.
	 * @param percent - The percentage to brighten (`0–100`).
	 * @returns A new `Color` instance with the modified lightness.
	 */
	applyBrightness(percent: Percent): Color {
		const [h, s, l, a] = extractAlphaColorValues(this.hsla);

		const newL = Math.min(100, l + percent);

		const newHSL = `hsl(${h}, ${s}%, ${newL}%)` as HSL;

		return new Color(newHSL).applyOpacity((a * 100) as Percent);
	}

	/**
	 * @instance Reduces the saturation of the color to make it appear duller.
	 * @param percent - The percentage to reduce saturation (`0–100`).
	 * @returns A new `Color` instance with the modified saturation.
	 */
	applyDullness(percent: Percent): Color {
		const [h, s, l, a] = extractAlphaColorValues(this.hsla);

		const newS = Math.max(0, s - percent);

		const newHSL = `hsl(${h}, ${newS}%, ${l}%)` as HSL;

		return new Color(newHSL).applyOpacity((a * 100) as Percent);
	}

	/**
	 * @instance Softens the color toward white by reducing saturation and increasing lightness based on a percentage.
	 *
	 * @remarks
	 * This creates a soft UI-like white shade effect (similar to some UI libraries' light color scale).
	 *
	 * @param percent - Value from `0` to `100` representing how far to push the color toward white.
	 * @returns A new `Color` instance shifted toward white.
	 */
	applyWhiteShade(percent: Percent): Color {
		const [h, s, l, a] = extractAlphaColorValues(this.hsla);

		// Cap values to avoid overshooting
		const newS = Math.max(0, s - (s * percent) / 100);
		const newL = Math.min(100, l + ((100 - l) * percent) / 100);

		const newHSL = `hsl(${h}, ${newS}%, ${newL}%)` as HSL;

		return new Color(newHSL).applyOpacity((a * 100) as Percent);
	}

	/**
	 * @instance Blends the current color with another color based on the given weight.
	 *
	 * @remarks
	 * If any of the input colors has opacity (alpha channel), it might be lost or distorted from the generated alpha variants of the respective color formats.
	 *
	 * @param other - The color in any of 6 ({@link Hex6 Hex}, {@link Hex8}, {@link RGB}, {@link RGBA}, {@link HSL} or {@link HSLA}) formats or a {@link CSSColor} to blend with.
	 * @param weight - A number from `0` to `1` indicating the weight of the other color. Defaults to `0.5`.
	 *               - `weight = 0` → only the original color.
	 *               - `weight = 1` → only the other color.
	 *               - `weight = 0.5` → equal blend between the two.
	 * @returns A new `Color` instance representing the blended result, with proper alpha blending.
	 */
	blendWith(other: ColorType | CSSColor, weight = 0.5): Color {
		const w = Math.max(0, Math.min(1, weight));

		const converted = Color.isCSSColor(other) ? new Color(other) : new Color(other);

		const [r1, b1, g1, a1] = extractAlphaColorValues(this.rgba);
		const [r2, b2, g2, a2] = extractAlphaColorValues(converted.rgba);

		const alpha = Math.round((a1 * (1 - w) + a2 * w) * 100) / 100;

		const blendChannel = (c1: number, c2: number): number => {
			return Math.round((c1 * a1 * (1 - w) + c2 * a2 * w) / alpha);
		};

		const r = blendChannel(r1, r2);
		const g = blendChannel(g1, g2);
		const b = blendChannel(b1, b2);

		const blended = `rgba(${r}, ${g}, ${b}, ${alpha})`;

		return new Color(blended as RGBA);
	}

	/**
	 * @instance Calculates the contrast ratio between this color and another color (WCAG).
	 * @param other - The other color to compare against.
	 * @returns A number representing the contrast ratio (rounded to 2 decimal places).
	 */
	contrastRatio(other: ColorType | CSSColor): number {
		const newColor = Color.isCSSColor(other) ? new Color(other) : new Color(other);

		const luminance = (rgb: RGB): number => {
			const [r, g, b] = extractSolidColorValues(rgb).map((v) => {
				const c = v / 255;
				return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
			});

			return 0.2126 * r + 0.7152 * g + 0.0722 * b;
		};

		const lum1 = luminance(this.rgb);
		const lum2 = luminance(newColor.rgb);

		const brighter = Math.max(lum1, lum2);
		const darker = Math.min(lum1, lum2);

		const ratio = (brighter + 0.05) / (darker + 0.05);

		return Math.round(ratio * 100) / 100;
	}

	/**
	 * @instance Returns the complementary color by rotating the hue 180 degrees.
	 * @returns A new `Color` that is the complement of the current color.
	 */
	getComplementaryColor(): Color {
		const [h, s, l, a] = extractAlphaColorValues(this.hsla);

		const newHue = (h + 180) % 360;

		const newHSL = `hsl(${newHue}, ${s}%, ${l}%)` as HSL;

		return new Color(newHSL).applyOpacity((a * 100) as Percent);
	}

	/**
	 * @instance Generates a color scheme of analogous colors, including the base color.
	 *
	 * @remarks
	 * Analogous colors are next to each other on the color wheel (±30°).
	 *
	 * @returns An array of three `Color` instances: `[base, left, right]`.
	 */
	getAnalogousColors(): Analogous {
		const [h, s, l, a] = extractAlphaColorValues(this.hsla);

		const left = `hsl(${(h + 330) % 360}, ${s}%, ${l}%)` as HSL;
		const right = `hsl(${(h + 30) % 360}, ${s}%, ${l}%)` as HSL;

		const analogous = [this, new Color(left), new Color(right)];

		return analogous.map((c) => c.applyOpacity((a * 100) as Percent)) as Analogous;
	}

	/**
	 * @instance Generates a color triad scheme including the base color.
	 *
	 * @remarks
	 * Triadic colors are evenly spaced (120° apart) on the color wheel.
	 *
	 * @returns An array of three `Color` instances: `[base, triad1, triad2]`.
	 */
	getTriadColors(): Triad {
		const [h, s, l, a] = extractAlphaColorValues(this.hsla);

		const c1 = `hsl(${(h + 120) % 360}, ${s}%, ${l}%)` as HSL;
		const c2 = `hsl(${(h + 240) % 360}, ${s}%, ${l}%)` as HSL;

		const triad = [this, new Color(c1), new Color(c2)];

		return triad.map((c) => c.applyOpacity((a * 100) as Percent)) as Triad;
	}

	/**
	 * @instance Generates a tetradic color scheme including the base color.
	 *
	 * @remarks
	 * Tetradic colors form a rectangle on the color wheel (90° apart).
	 *
	 * @returns An array of four `Color` instances: `[base, tetrad1, tetrad2, tetrad3]`.
	 */
	getTetradColors(): Tetrad {
		const [h, s, l, a] = extractAlphaColorValues(this.hsla);

		const c1 = `hsl(${(h + 90) % 360}, ${s}%, ${l}%)` as HSL;
		const c2 = `hsl(${(h + 180) % 360}, ${s}%, ${l}%)` as HSL;
		const c3 = `hsl(${(h + 270) % 360}, ${s}%, ${l}%)` as HSL;

		const tetrad = [this, new Color(c1), new Color(c2), new Color(c3)];

		return tetrad.map((c) => c.applyOpacity((a * 100) as Percent)) as Tetrad;
	}

	/**
	 * @instance Gets the `WCAG` accessibility rating between this and another color.
	 * @param other - The other color to test contrast against.
	 * @returns `'Fail'`, `'AA'`, or `'AAA'` based on `WCAG 2.1` contrast standards.
	 */
	getWCAGRating(other: ColorType | CSSColor): 'Fail' | 'AA' | 'AAA' {
		const ratio = this.contrastRatio(other);

		if (ratio >= 7) return 'AAA';
		if (ratio >= 4.5) return 'AA';
		return 'Fail';
	}

	/**
	 * @instance Determines if the color is light based on its perceived brightness.
	 * @returns `true` if light, `false` if dark.
	 */
	isLightColor(): boolean {
		const [r, g, b] = extractSolidColorValues(this.rgb);

		const brightness = (r * 299 + g * 587 + b * 114) / 1000;

		return brightness > 127.5;
	}

	/**
	 * @static Checks if a color is in {@link Hex6} format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's a {@link Hex6} color, `false` if not.
	 */
	static isHex6(color: string): color is Hex6 {
		return /^#[0-9A-Fa-f]{6}$/.test(color?.trim());
	}

	/**
	 * @static Checks if a color is in {@link Hex8} format.
	 *
	 * @param color Color to check.
	 * @returns Boolean: `true` if it's a {@link Hex8} color, `false` if not.
	 */
	static isHex8(color: string): color is Hex8 {
		return /^#[0-9A-Fa-f]{8}$/.test(color?.trim());
	}

	/**
	 * @static Checks if a color is in {@link RGB} format and within valid ranges.
	 *
	 * @param color Color to check.
	 * @returns `true` if it's a {@link RGB} color, `false` if not.
	 */
	static isRGB(color: string): color is RGB {
		return isRGB(color);
	}

	/**
	 * @static Checks if a color is in {@link RGBA} format and within valid ranges.
	 *
	 * @param color Color to check.
	 * @returns `true` if it's a {@link RGBA} color, `false` if not.
	 */
	static isRGBA(color: string): color is RGBA {
		return isRGBA(color);
	}

	/**
	 * @static Checks if a color is in {@link HSL} format and within valid ranges.
	 *
	 * @param color Color to check.
	 * @returns `true` if it's a {@link HSL} color, `false` if not.
	 */
	static isHSL(color: string): color is HSL {
		return isHSL(color);
	}

	/**
	 * @static Checks if a color is in {@link HSLA} format and within valid ranges.
	 *
	 * @param color Color to check.
	 * @returns `true` if it's a {@link HSLA} color, `false` if not.
	 */
	static isHSLA(color: string): color is HSLA {
		return isHSLA(color);
	}

	/**
	 * @static Checks if a color is a valid CSS color name ({@link CSSColor}).
	 *
	 * @remarks
	 * - This method checks against a predefined list of CSS color names.
	 * - It does not validate format types like `Hex`, `RGB`, or `HSL` or their alpha channels.
	 *
	 * @param color - The color to check.
	 * @returns `true` if the color is a valid CSS color name, `false` otherwise.
	 */
	static isCSSColor(color: string): color is CSSColor {
		return isNonEmptyString(color) && color in CSS_COLORS;
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

		throw new TypeError(`${color} is not a valid color!`, {
			cause: 'Unrecognized Color Format',
		});
	}
}
