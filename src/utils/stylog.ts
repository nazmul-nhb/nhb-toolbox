import { convertHexToRgb, convertHslToRgb } from '../colors/convert';
import { CSS_COLORS } from '../colors/css-colors';
import {
	_isHex6,
	_isRGB,
	_isValidHue,
	_isValidPercentage,
	_isValidRGBComponent,
} from '../colors/helpers';
import { isNumber, isString } from '../guards/primitives';
import { isBrowser } from '../guards/specials';

import type { CSSColor, Hex, Hex6, RGB, SolidValues } from '../colors/types';
import { ANSI_16_COLORS, ANSI_TEXT_STYLES, CSS_TEXT_STYLES } from './constants';
import {
	_css16ToHex,
	_extractColorName,
	_isAnsi16ColorValue,
	_isAnsiSequence,
	_isCSS16Color,
} from './helpers';

// ! ======= Type Definitions ======= ! //

/** Non-color text styles */
export type TextStyle =
	| 'bold'
	| 'bolder'
	| 'dim'
	| 'italic'
	| 'underline'
	| 'strikethrough'
	| 'inverse';

/** Represents `ANSI-16` color names available in `LogStyler` */
export type Ansi16Color = keyof typeof ANSI_16_COLORS;

/** Represents `ANSI-16` color names with `css-` prefix available in `LogStyler` */
export type CSS16Color = `css-${Ansi16Color}`;

/** Represents the value of `ANSI-16` color codes */
export type Ansi16Value = (typeof ANSI_16_COLORS)[Ansi16Color];

/** Represents a css color starting with `bg` (e.g. `"bgRed"`). */
export type BGColor = `bg${Capitalize<CSSColor>}`;

/** Styles allowed for `LogStyler` or `Stylog` */
export type Styles = CSSColor | BGColor | TextStyle;

/** A `tuple of strings` that represents `ANSI` color code with special closing and ending */
export type AnsiSequence = [string, string];

/**
 * * Type representing a fully chainable `LogStyler` instance.
 *
 * @remarks - Each property corresponds to a style (foreground color, background color, or text effect) and returns a new `Stylog` instance, allowing fluent chaining like:
 *
 * **This type combines:**
 * - The methods of `LogStyler` (e.g., `.style()`, `.log()`)
 * - Dynamically generated properties for all available `Styles`
 *   that return another `Stylog` instance for chaining.
 *
 * @example
 * Stylog.green.bold.bgBlue.log('Hello World');
 */
export type StylogChain = LogStyler & {
	[K in Styles]: StylogChain;
};

// ! ======= Utility Functions ======= ! //

/**
 * * Detects color support level of the current terminal/shell.
 * @returns `0 = none`, `1 = basic (16 colors)`, `2 = 256 colors`, `3 = truecolor`
 */
export function detectColorSupport(): 0 | 1 | 2 | 3 {
	if ('NO_COLOR' in process.env) return 0; // explicit opt-out
	if ('FORCE_COLOR' in process.env) return 3; // explicit opt-in (max)

	if (!process.stdout.isTTY) return 0;

	const term = process.env.TERM ?? process.env.COLORTERM ?? '';

	if (term === 'dumb') return 0;
	if (/\b256(color)?\b/i.test(term)) return 2;
	if (/\btruecolor\b|\b24bit\b/i.test(term)) return 3;

	return 1; // fallback to basic 16-color
}

/**
 * * Convert `RGB` color components into an `ANSI` escape code sequence.
 *
 * @param r Red component (`0-255`).
 * @param g Green component (`0-255`).
 * @param b Blue component (`0-255`).
 * @param isBg Whether the color should be applied as background (`true`) or foreground (`false`). Defaults to `false`.
 * @returns Tuple containing the opening and closing `ANSI` escape sequences.
 */
export function rgbToAnsi(r: number, g: number, b: number, isBg = false): AnsiSequence {
	const open = `\x1b[${isBg ? 48 : 38};2;${r};${g};${b}m`;
	const close = `\x1b[${isBg ? 49 : 39}m`;
	return [open, close];
}

/**
 * * Convert a HEX color into an `ANSI` escape code sequence.
 *
 * @param hex HEX color string. e.g. `#000000`
 * @param isBg Whether the color should be applied as background (`true`) or foreground (`false`). Defaults to `false`.
 * @returns Tuple containing the opening and closing `ANSI` escape sequences.
 */
export function hexToAnsi(hex: Hex, isBg = false): AnsiSequence {
	const rgb = (convertHexToRgb(hex).match(/\d+/g) || []).map(parseFloat) as SolidValues;

	return rgbToAnsi(...rgb, isBg);
}

/** * Check if a string represents a valid `CSSColor`. */
export function isCSSColor(value: string): value is CSSColor {
	return value in CSS_COLORS;
}

/** * Check if a string represents `bgColor` with valid CSS color name. */
export function isBGColor(value: string): value is BGColor {
	return value?.startsWith('bg') && isCSSColor(value.slice(2).toLowerCase());
}

/** * Check if a string represent `TextStyle` used in `LogStyler`. */
export function isTextStyle(value: string): value is TextStyle {
	return value in CSS_TEXT_STYLES || value in ANSI_TEXT_STYLES;
}

// ! ======= Implementation of LogStyler ======= ! //

/**
 * * Utility class for styling console log output with `ANSI` (`Node.js`) or `CSS` (Browser).
 *
 * @remarks
 * - Allows chaining of style methods or initializing with predefined styles.
 * - For fluent, chainable styling with zero configuration use {@link https://toolbox.nazmul-nhb.dev/docs/utilities/misc/stylog Stylog} (`LogStyler` chainable wrapper).
 *
 * @example
 * const styled = new LogStyler(['red', 'bold']);
 * styled.log('Hello World');
 *
 * const logger = new LogStyler();
 * logger.style('blue', 'dim', 'bold').log('Hello Blue');
 * logger.style('blue', 'dim', 'bold').string('Hello Blue');
 * logger.style('blue', 'dim', 'bold').applyStyles('Hello Blue');
 */
export class LogStyler {
	readonly #styles: Array<
		| Styles
		| AnsiSequence
		| Ansi16Value
		| CSS16Color
		| Hex6
		| RGB
		| `bg-${Hex6}`
		| `bg-${RGB}`
	>;

	/**
	 * * Creates a new `LogStyler` instance.
	 *
	 * @param styles - Optional array of initial styles to apply (e.g., ['red', 'bold']). Defaults to an empty array.
	 *
	 * @example
	 * const styled = new LogStyler(['red', 'bold']);
	 * styled.log('Hello World');
	 *
	 * const logger = new LogStyler();
	 * logger.style('blue', 'dim', 'bold').log('Hello Blue');
	 * logger.style('blue', 'dim', 'bold').string('Hello Blue');
	 * logger.style('blue', 'dim', 'bold').applyStyles('Hello Blue');
	 */
	constructor(styles: Styles[] = []) {
		this.#styles = styles;
	}

	#style(
		...style: Array<
			| Styles
			| AnsiSequence
			| Ansi16Value
			| CSS16Color
			| Hex6
			| RGB
			| `bg-${Hex6}`
			| `bg-${RGB}`
		>
	): StylogChain {
		return createStylogProxy(
			new LogStyler([...(this.#styles as Styles[]), ...(style as Styles[])])
		);
	}

	/**
	 * * Chain multiple styles to the input.
	 * @remarks When chaining similar styles, only the last one(s) takes effect.
	 * @param style - One or more styles to apply (color, background, or text style).
	 * @returns A new StylogChain instance with the additional styles applied.
	 *
	 * @example
	 * // Single style
	 * Stylog.style('red').log('Red text');
	 * Stylog.style('red').string('Red text');
	 * Stylog.style('red').applyStyles('Red text');
	 *
	 * @example
	 * // Multiple styles at once
	 * Stylog.style('red', 'bold', 'underline').log('Red bold underlined text');
	 * Stylog.style('red', 'bold', 'underline').string('Red bold underlined text');
	 * Stylog.style('red', 'bold', 'underline').applyStyles('Red bold underlined text');
	 *
	 * @example
	 * // Mixed foreground and background
	 * Stylog.style('white', 'bgBlue').log('White text on blue background');
	 * Stylog.style('white', 'bgBlue').string('White text on blue background');
	 * Stylog.style('white', 'bgBlue').applyStyles('White text on blue background');
	 *
	 * @example
	 * // Building on existing styles
	 * const errorStyle = Stylog.style('red', 'bold');
	 * errorStyle.style('underline').log('Red bold underlined error');
	 * errorStyle.style('underline').string('Red bold underlined error');
	 * errorStyle.style('underline').applyStyles('Red bold underlined error');
	 */
	style(...style: Styles[]): StylogChain {
		return this.#style(...style);
	}

	/**
	 * * Apply ANSI 16-color styling to the text.
	 * @param color - ANSI 16-color name (e.g., 'red', 'cyanBright', 'bgRed').
	 * @returns A new `StylogChain` instance with the `ANSI 16-color` style applied.
	 *
	 * @example
	 * // Basic usage
	 * Stylog.ansi16('red').log('Error message');
	 *
	 * @example
	 * // Chaining with other styles
	 * Stylog.ansi16('redBright').bold.italic.log('Bright red bold italic');
	 * Stylog.ansi16('redBright').bold.italic.string('Bright red bold italic');
	 * Stylog.ansi16('redBright').bold.italic.applyStyles('Bright red bold italic');
	 *
	 * @example
	 * // Background colors
	 * Stylog.ansi16('bgRed').log('Red background');
	 * Stylog.ansi16('bgRed').string('Red background');
	 * Stylog.ansi16('bgRed').applyStyles('Red background');
	 */
	ansi16(color: Ansi16Color): StylogChain {
		return this.#style(ANSI_16_COLORS[color], `css-${color}`);
	}

	/**
	 * * Returns styled tuple `[format, cssList]` for Browser.
	 *
	 * @remarks
	 * - This method is specifically designed for browser environments and returns a tuple containing the formatted string with `%c` placeholder and an array of CSS styles (`string[]`).
	 * - Use this when you need direct access to the CSS styling for custom browser output.
	 * - If you want to format with ANSI escape codes, consider using {@link https://toolbox.nazmul-nhb.dev/docs/classes/LogStyler#stringinput-stringify string} method.
	 *
	 * @param input - Value to style (any type).
	 * @param stringify - Whether to apply `JSON.stringify()` before styling. Defaults to `false`.
	 * @returns Tuple `[format, cssList]` where:
	 *   - `format`: String with `%c` placeholder for CSS styling
	 *   - `cssList`: Array of CSS style strings
	 *
	 * @example
	 * // Basic usage in browser
	 * const styler = new LogStyler(['red', 'bold']);
	 * const [format, cssList] = styler.applyStyles('Error message');
	 * // format: "%cError message"
	 * // cssList: ["color: #FF0000", "font-weight: bold"]
	 *
	 * @example
	 * // Custom browser output handling
	 * const styled = new LogStyler(['blue', 'bgYellow', 'italic']);
	 * const [format, styles] = styled.applyStyles('Warning', true);
	 *
	 * // Use with custom logging function
	 * function customLog(formatted: string, styles: string[]) {
	 *   const styleString = styles.join('; ');
	 *   console.log(formatted, styleString);
	 * }
	 * customLog(format, styles);
	 *
	 * @example
	 * // With object stringification
	 * const dataOutput = new LogStyler(['green']).applyStyles({ id: 123 }, true);
	 * // format: "%c{\"id\":123}"
	 * // cssList: ["color: #008000"]
	 */
	public applyStyles(input: any, stringify = false): [string, string[]] {
		const stringified = stringify === true ? JSON.stringify(input) : input;

		const cssList: string[] = [];

		for (const style of this.#styles) {
			if (isString(style)) {
				if (isTextStyle(style)) {
					cssList.push(CSS_TEXT_STYLES[style]);
				} else if (isBGColor(style)) {
					const color = CSS_COLORS[_extractColorName(style)];
					cssList.push(`background: ${color}`);
				} else if (isCSSColor(style)) {
					const color = CSS_COLORS[style];
					cssList.push(`color: ${color}`);
				} else if (this.#isValidHexOrRGB(style)) {
					if (style.startsWith('bg-')) {
						cssList.push(`background: ${style?.replace('bg-', '')}`);
					} else {
						cssList.push(`color: ${style}`);
					}
				} else if (_isCSS16Color(style)) {
					const color = _css16ToHex(style);

					const colorValue =
						style.startsWith('css-bg') ? `background: ${color}` : `color: ${color}`;

					cssList.push(colorValue);
				}
			}
		}
		return [`%c${stringified}`, cssList];
	}

	/**
	 * * Returns the input as a styled string with ANSI escape codes.
	 *
	 * @remarks
	 * - This method returns ANSI-formatted strings suitable for environments that support ANSI escape codes (terminals, modern browser consoles, etc.).
	 * - For unsupported browsers, consider using the {@link https://toolbox.nazmul-nhb.dev/docs/classes/LogStyler#loginput-stringify log} method to print directly or {@link https://toolbox.nazmul-nhb.dev/docs/classes/LogStyler#applystylesinput-stringify applyStyles} to get styled tuple `[format, cssList]` for Browser.
	 *
	 * @param input - Value to style (any type).
	 * @param stringify - Whether to apply `JSON.stringify()` before styling. Defaults to `false`.
	 * @returns The styled string with ANSI escape codes.
	 *
	 * @example
	 * const styled = new LogStyler(['red', 'bold']);
	 * const errorMessage = styled.string('Error occurred, using LogStyler');
	 * // Or with Stylog
	 * const errorMessage = Stylog.red.bold.string('Error occurred, using Stylog');
	 * // Returns: "\x1b[31m\x1b[1mError occurred, using Stylog\xx1b[22m\x1b[39m"
	 *
	 * @example
	 * // Use in console (terminal or modern browser consoles)
	 * console.error(errorMessage);
	 * console.info(Stylog.red.bold.string('I support ANSI!'));
	 */
	public string(input: any, stringify = false): string {
		const stringified = stringify === true ? JSON.stringify(input) : input;
		let openSeq = '',
			closeSeq = '';

		for (const style of this.#styles) {
			if (isString(style)) {
				if (isTextStyle(style)) {
					const [open, close] = ANSI_TEXT_STYLES[style];
					openSeq += open;
					closeSeq = close + closeSeq;
				} else if (isBGColor(style)) {
					const hex = CSS_COLORS[_extractColorName(style)];
					const [open, close] = hexToAnsi(hex, true);
					openSeq += open;
					closeSeq = close + closeSeq;
				} else if (isCSSColor(style)) {
					const hex = CSS_COLORS[style];
					const [open, close] = hexToAnsi(hex, false);
					openSeq += open;
					closeSeq = close + closeSeq;
				}
			} else if (_isAnsiSequence(style)) {
				openSeq += style[0];
				closeSeq = style[1] + closeSeq;
			} else if (_isAnsi16ColorValue(style)) {
				const [open, close] = style.map((s) => `\x1b[${s}m`);
				openSeq += open;
				closeSeq = close + closeSeq;
			}
		}

		if (!detectColorSupport()) {
			return stringified;
		} else {
			return openSeq + stringified + closeSeq;
		}
	}

	/**
	 * * Print styled input to the console.
	 *
	 * @param input Input to print.
	 * @param stringify Whether to apply `JSON.stringify()` before printing. Defaults to `false`.
	 */
	public log(input: any, stringify = false): void {
		if (isBrowser()) {
			const [fmt, cssList] = this.applyStyles(input, stringify);
			console.log(fmt, cssList.join(';'));
		} else {
			console.log(this.string(input, stringify));
		}
	}

	#isValidHexOrRGB(color: string): color is Hex6 | RGB | `bg-${Hex6}` | `bg-${RGB}` {
		const pure = color?.replace('bg-', '');

		return _isHex6(pure) || _isRGB(pure);
	}

	#sanitizeHex(code: string): string {
		return code?.trim()?.startsWith('#') ? code?.trim() : `#${code?.trim()}`;
	}

	#handleHex(code: string, isBg = false): StylogChain {
		const sanitized = this.#sanitizeHex(code);

		if (!_isHex6(sanitized)) {
			return this.#style();
		}

		const ansi = hexToAnsi(sanitized, isBg);

		return this.#style(isBg ? `bg-${sanitized}` : sanitized, ansi);
	}

	/**
	 * * Apply a HEX color to the text foreground.
	 * @param code - HEX color string (e.g., '#4682B4' or '4682B4').
	 * @returns A new `StylogChain` instance with the HEX color applied.
	 *
	 * @example
	 * // With hash prefix
	 * Stylog.hex('#4682B4').log('Steel blue text');
	 * Stylog.hex('#4682B4').string('Steel blue text');
	 * Stylog.hex('#4682B4').applyStyles('Steel blue text');
	 *
	 * @example
	 * // Without hash prefix
	 * Stylog.hex('4682B4').log('Steel blue text');
	 * Stylog.hex('4682B4').string('Steel blue text');
	 * Stylog.hex('4682B4').applyStyles('Steel blue text');
	 *
	 * @example
	 * // Chaining with other styles
	 * Stylog.hex('#FF0000').bold.log('Red bold text');
	 * Stylog.hex('#FF0000').bold.string('Red bold text');
	 * Stylog.hex('#FF0000').bold.applyStyles('Red bold text');
	 */
	hex(code: string): StylogChain {
		return this.#handleHex(code, false);
	}

	/**
	 * * Apply a HEX color to the text background.
	 * @param code - HEX color string (e.g., '#4682B4' or '4682B4').
	 * @returns A new StylogChain instance with the HEX background color applied.
	 *
	 * @example
	 * // With hash prefix
	 * Stylog.bgHex('#4682B4').log('Steel blue background');
	 * Stylog.bgHex('#4682B4').string('Steel blue background');
	 * Stylog.bgHex('#4682B4').applyStyles('Steel blue background');
	 *
	 * @example
	 * // Without hash prefix
	 * Stylog.bgHex('4682B4').log('Steel blue background');
	 * Stylog.bgHex('4682B4').string('Steel blue background');
	 * Stylog.bgHex('4682B4').applyStyles('Steel blue background');
	 *
	 * @example
	 * // Chaining with foreground color
	 * Stylog.white.bgHex('#000000').log('White text on black background');
	 * Stylog.white.bgHex('#000000').string('White text on black background');
	 * Stylog.white.bgHex('#000000').applyStyles('White text on black background');
	 */
	bgHex(code: string): StylogChain {
		return this.#handleHex(code, true);
	}

	#extractColorValues(code: string): SolidValues {
		const trimmed = code?.trim();

		return (trimmed?.match(/[\d.]+%?/g) || []).map(parseFloat) as SolidValues;
	}

	#isValidRGB(...value: number[]) {
		return value.every(_isValidRGBComponent);
	}

	#handleRGB(
		code: string | number,
		green?: number,
		blue?: number,
		isBg = false
	): StylogChain {
		if (isString(code)) {
			const rgb = this.#extractColorValues(code);
			if (this.#isValidRGB(...rgb)) {
				return this.#style(
					rgbToAnsi(...rgb, isBg),
					isBg ?
						`bg-rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
					:	`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
				);
			} else {
				return this.#style();
			}
		} else if (isNumber(code) && isNumber(green) && isNumber(blue)) {
			if (this.#isValidRGB(code, green, blue)) {
				return this.#style(
					rgbToAnsi(code, green, blue, isBg),
					isBg ?
						`bg-rgb(${code}, ${green}, ${blue})`
					:	`rgb(${code}, ${green}, ${blue})`
				);
			} else {
				return this.#style();
			}
		} else {
			return this.#style();
		}
	}

	/**
	 * * Apply an RGB color to the text foreground using a CSS-like string.
	 * @param code - RGB color string (e.g., 'rgb(11, 45, 1)' or '11, 45, 1').
	 * @returns A new `StylogChain` instance with the RGB color applied.
	 *
	 * @example
	 * // Full rgb() syntax
	 * Stylog.rgb('rgb(11, 45, 1)').log('Dark green text');
	 * Stylog.rgb('rgb(11, 45, 1)').string('Dark green text');
	 * Stylog.rgb('rgb(11, 45, 1)').applyStyles('Dark green text');
	 *
	 * @example
	 * // Comma-separated values
	 * Stylog.rgb('11, 45, 1').log('Dark green text');
	 * Stylog.rgb('11, 45, 1').string('Dark green text');
	 * Stylog.rgb('11, 45, 1').applyStyles('Dark green text');
	 *
	 * @example
	 * // Chaining with other styles
	 * Stylog.rgb('255, 0, 0').bold.log('Red bold text');
	 * Stylog.rgb('255, 0, 0').bold.string('Red bold text');
	 * Stylog.rgb('255, 0, 0').bold.applyStyles('Red bold text');
	 */
	rgb(code: string): StylogChain;

	/**
	 * * Apply an RGB color to the text foreground using individual components.
	 * @param red - Red component (`0-255`).
	 * @param green - Green component (`0-255`).
	 * @param blue - Blue component (`0-255`).
	 * @returns A new `StylogChain` instance with the RGB color applied.
	 *
	 * @example
	 * // Individual components
	 * Stylog.rgb(255, 0, 0).log('Red text');
	 * Stylog.rgb(255, 0, 0).string('Red text');
	 * Stylog.rgb(255, 0, 0).applyStyles('Red text');
	 *
	 * @example
	 * // With other styles
	 * Stylog.rgb(0, 255, 0).underline.log('Green underlined text');
	 * Stylog.rgb(0, 255, 0).underline.string('Green underlined text');
	 * Stylog.rgb(0, 255, 0).underline.applyStyles('Green underlined text');
	 */
	rgb(red: number, green: number, blue: number): StylogChain;

	/** * Apply an RGB color to the text foreground using string or individual components. */
	rgb(code: string | number, green?: number, blue?: number): StylogChain {
		return this.#handleRGB(code, green, blue, false);
	}

	/**
	 * * Apply an RGB color to the text background using a CSS-like string.
	 * @param code - RGB color string (e.g., 'rgb(225, 169, 196)' or '225, 169, 196').
	 * @returns A new `StylogChain` instance with the RGB background color applied.
	 *
	 * @example
	 * // Full rgb() syntax
	 * Stylog.bgRGB('rgb(225, 169, 196)').log('Pink background');
	 * Stylog.bgRGB('rgb(225, 169, 196)').string('Pink background');
	 * Stylog.bgRGB('rgb(225, 169, 196)').applyStyles('Pink background');
	 *
	 * @example
	 * // Comma-separated values
	 * Stylog.bgRGB('225, 169, 196').log('Pink background');
	 * Stylog.bgRGB('225, 169, 196').string('Pink background');
	 * Stylog.bgRGB('225, 169, 196').applyStyles('Pink background');
	 *
	 * @example
	 * // With foreground color
	 * Stylog.black.bgRGB('255, 255, 255').log('Black text on white background');
	 * Stylog.black.bgRGB('255, 255, 255').string('Black text on white background');
	 * Stylog.black.bgRGB('255, 255, 255').applyStyles('Black text on white background');
	 */
	bgRGB(code: string): StylogChain;

	/**
	 * * Apply an RGB color to the text background using individual components.
	 * @param red - Red component (`0-255`).
	 * @param green - Green component (`0-255`).
	 * @param blue - Blue component (`0-255`).
	 * @returns A new `StylogChain` instance with the RGB background color applied.
	 *
	 * @example
	 * // Individual components
	 * Stylog.bgRGB(0, 0, 255).log('Blue background');
	 * Stylog.bgRGB(0, 0, 255).string('Blue background');
	 * Stylog.bgRGB(0, 0, 255).applyStyles('Blue background');
	 *
	 * @example
	 * // With text styles
	 * Stylog.bgRGB(255, 255, 0).bold.log('Bold text on yellow background');
	 * Stylog.bgRGB(255, 255, 0).bold.string('Bold text on yellow background');
	 * Stylog.bgRGB(255, 255, 0).bold.applyStyles('Bold text on yellow background');
	 */
	bgRGB(red: number, green: number, blue: number): StylogChain;

	/** * Apply an RGB color to the text background using string or individual components. */
	bgRGB(code: string | number, green?: number, blue?: number): StylogChain {
		return this.#handleRGB(code, green, blue, true);
	}

	#isValidHSL(h: number, s: number, l: number) {
		return _isValidHue(h) && _isValidPercentage(s) && _isValidPercentage(l);
	}

	#handleHSL(
		code: string | number,
		saturation?: number,
		lightness?: number,
		isBg = false
	): StylogChain {
		if (isString(code)) {
			const hsl = this.#extractColorValues(code);
			console.log(hsl);
			if (this.#isValidHSL(...hsl)) {
				return this.#handleRGB(convertHslToRgb(...hsl), undefined, undefined, isBg);
			} else {
				return this.#style();
			}
		} else if (isNumber(code) && isNumber(saturation) && isNumber(lightness)) {
			if (this.#isValidHSL(code, saturation, lightness)) {
				return this.#handleRGB(
					convertHslToRgb(code, saturation, lightness),
					undefined,
					undefined,
					isBg
				);
			} else {
				return this.#style();
			}
		} else {
			return this.#style();
		}
	}

	/**
	 * * Apply an HSL color to the text foreground using a CSS-like string.
	 * @param code - HSL color string (e.g., 'hsl(50 80.5% 40%)').
	 * @returns A new `StylogChain` instance with the HSL color applied.
	 *
	 * @example
	 * // Standard HSL syntax
	 * Stylog.hsl('hsl(50 80.5% 40%)').log('Gold text');
	 * Stylog.hsl('hsl(50 80.5% 40%)').string('Gold text');
	 * Stylog.hsl('hsl(50 80.5% 40%)').applyStyles('Gold text');
	 *
	 * @example
	 * // With commas
	 * Stylog.hsl('50, 80.5%, 40%').log('Gold text');
	 * Stylog.hsl('50, 80.5%, 40%').string('Gold text');
	 * Stylog.hsl('50, 80.5%, 40%').applyStyles('Gold text');
	 *
	 * @example
	 * // Chaining with other styles
	 * Stylog.hsl('120, 100%, 50%').italic.log('Green italic text');
	 * Stylog.hsl('120, 100%, 50%').italic.string('Green italic text');
	 * Stylog.hsl('120, 100%, 50%').italic.applyStyles('Green italic text');
	 */
	hsl(code: string): StylogChain;

	/**
	 * * Apply an HSL color to the text foreground using individual components.
	 * @param hue - Hue component (0-360).
	 * @param saturation - Saturation component (0-100 or 0-100%).
	 * @param lightness - Lightness component (0-100 or 0-100%).
	 * @returns A new `StylogChain` instance with the HSL color applied.
	 *
	 * @example
	 * // Individual components
	 * Stylog.hsl(0, 100, 50).log('Red text');
	 * Stylog.hsl(0, 100, 50).string('Red text');
	 * Stylog.hsl(0, 100, 50).applyStyles('Red text');
	 *
	 * @example
	 * // With percentage values
	 * Stylog.hsl(240, 100, 50).log('Blue text');
	 * Stylog.hsl(240, 100, 50).string('Blue text');
	 * Stylog.hsl(240, 100, 50).applyStyles('Blue text');
	 */
	hsl(hue: number, saturation: number, lightness: number): StylogChain;

	/** * Apply an HSL color to the text foreground using string or individual components. */
	hsl(code: string | number, saturation?: number, lightness?: number): StylogChain {
		return this.#handleHSL(code, saturation, lightness, false);
	}

	/**
	 * * Apply an HSL color to the text background using a CSS-like string.
	 * @param code - HSL color string (e.g., 'hsl(50 80.5% 40%)').
	 * @returns A new `StylogChain` instance with the HSL background color applied.
	 *
	 * @example
	 * // Standard HSL syntax
	 * Stylog.bgHSL('hsl(50 80.5% 40%)').log('Gold background');
	 * Stylog.bgHSL('hsl(50 80.5% 40%)').string('Gold background');
	 * Stylog.bgHSL('hsl(50 80.5% 40%)').applyStyles('Gold background');
	 *
	 * @example
	 * // With commas
	 * Stylog.bgHSL('50, 80.5%, 40%').log('Gold background');
	 * Stylog.bgHSL('50, 80.5%, 40%').string('Gold background');
	 * Stylog.bgHSL('50, 80.5%, 40%').applyStyles('Gold background');
	 *
	 * @example
	 * // With foreground color
	 * Stylog.white.bgHSL('0, 100%, 50%').log('White text on red background');
	 * Stylog.white.bgHSL('0, 100%, 50%').string('White text on red background');
	 * Stylog.white.bgHSL('0, 100%, 50%').applyStyles('White text on red background');
	 */
	bgHSL(code: string): StylogChain;

	/**
	 * * Apply an HSL color to the text background using individual components.
	 * @param hue - Hue component (0-360).
	 * @param saturation - Saturation component (0-100 or 0-100%).
	 * @param lightness - Lightness component (0-100 or 0-100%).
	 * @returns A new StylogChain instance with the HSL background color applied.
	 *
	 * @example
	 * // Individual components
	 * Stylog.bgHSL(120, 100, 50).log('Green background');
	 * Stylog.bgHSL(120, 100, 50).string('Green background');
	 * Stylog.bgHSL(120, 100, 50).applyStyles('Green background');
	 *
	 * @example
	 * // With text styles
	 * Stylog.bgHSL(300, 100, 50).bold.log('Bold text on purple background');
	 * Stylog.bgHSL(300, 100, 50).bold.string('Bold text on purple background');
	 * Stylog.bgHSL(300, 100, 50).bold.applyStyles('Bold text on purple background');
	 */
	bgHSL(hue: number, saturation: number, lightness: number): StylogChain;

	/** * Apply an HSL color to the text background using string or individual components. */
	bgHSL(code: string | number, saturation?: number, lightness?: number): StylogChain {
		return this.#handleHSL(code, saturation, lightness, true);
	}
}

// ! ======= Implementation of Stylog ======= ! //

/**
 * * Create a proxied instance of `LogStyler` that supports dynamic style chaining.
 *
 * @param styler Base `LogStyler` instance.
 * @returns Proxied `LogStyler` instance with dynamic chaining support (`StylogChain`).
 */
function createStylogProxy(styler: LogStyler): StylogChain {
	return new Proxy(styler, {
		get(target, prop: string) {
			if (prop in target) {
				const value = target[prop as keyof LogStyler];

				if (typeof value === 'function') {
					return value.bind(target);
				} else {
					return value;
				}
			}

			// If prop is a color or style, chain it
			if (isCSSColor(prop) || isBGColor(prop) || isTextStyle(prop)) {
				return createStylogProxy(target.style(prop));
			}
		},
	}) as StylogChain;
}

/**
 * * Styled console logger with chainable, type-safe color and text effects for both `Node.js` (`ANSI true-color`) and browsers (`CSS` via `%c`).
 *
 * @remarks
 * - Chain any mix of foreground colors (e.g. `green`), background colors (e.g. `bgBlue`), and text styles (e.g. `bold`, `italic`, `underline`).
 * - In browsers, styles are applied using `CSS`; in `Node.js`, `ANSI` escape codes are used.
 * - When multiple styles of the same category are chained, the last one wins.
 * - Use `.log(value, stringify?)` to print; set `stringify` to `true` to serialize with `JSON.stringify`.
 * - If you need custom reusable style configurations, use {@link https://toolbox.nazmul-nhb.dev/docs/classes/LogStyler Stylog} class.
 *
 * @example
 * // Simple color
 * Stylog.green.log('Ready');
 *
 * @example
 * // Foreground + background + effect, with JSON stringification
 * Stylog.green.bgBlue.bold.log({ a: 121 }, true);
 *
 * @example
 * // Reusable base chain
 * const base = Stylog.underline;
 * base.red.log('Error');
 * base.error.log('Error');
 * base.bgYellow.bold.log('Caution');
 *
 * @example
 * // Works in the browser console too
 * Stylog.cornflowerblue.italic.log('Hello from the browser');
 */
export const Stylog = createStylogProxy(new LogStyler());
