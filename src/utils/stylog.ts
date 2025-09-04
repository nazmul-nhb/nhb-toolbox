import { convertHexToRgb, convertHslToRgb } from '../colors/convert';
import { CSS_COLORS } from '../colors/css-colors';
import {
	_isHex6,
	_isRGB,
	_isValidHue,
	_isValidPercentage,
	_isValidRGBComponent,
} from '../colors/helpers';
import { isArrayOfType } from '../guards/non-primitives';
import { isNumber, isString } from '../guards/primitives';
import { isBrowser } from '../guards/specials';

import type { CSSColor, Hex, Hex6, RGB, SolidValues } from '../colors/types';

/** Non-color text styles */
export type TextStyle =
	| 'bold'
	| 'bolder'
	| 'dim'
	| 'italic'
	| 'underline'
	| 'strikethrough'
	| 'inverse';

/** Represents a css color starting with `bg` (e.g. `"bgRed"`). */
export type BGColor = `bg${Capitalize<CSSColor>}`;

/** Styles allowed for `LogStyler` or `Stylog` */
export type Styles = CSSColor | BGColor | TextStyle;

export type AnsiSequence = [string, string];

/**
 * Detects color support level of the current terminal.
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

	return 1; // fallback: assume basic 16-color
}

function rgbToAnsi(r: number, g: number, b: number, isBg = false): AnsiSequence {
	const open = `\x1b[${isBg ? 48 : 38};2;${r};${g};${b}m`;
	const close = `\x1b[${isBg ? 49 : 39}m`;
	return [open, close];
}

/**
 * * Convert a HEX color into an ANSI escape code sequence.
 *
 * @param hex HEX color string. e.g. `#000000`
 * @param isBg Whether the color should be applied as background (`true`) or foreground (`false`). Defaults to `false`.
 * @returns Tuple containing the opening and closing ANSI escape sequences.
 */
export function hexToAnsi(hex: Hex, isBg = false): AnsiSequence {
	const [r, g, b] = (convertHexToRgb(hex).match(/\d+/g) || []).map(Number);

	return rgbToAnsi(r, g, b, isBg);
}

/**
 * * Extract the CSS color name from a background-prefixed style key.
 *
 * @param bgColor Style key starting with `bg` (e.g. `"bgRed"`).
 * @returns Extracted CSS color name.
 */
function extractColorName(bgColor: BGColor): CSSColor {
	return bgColor.slice(2).toLowerCase() as CSSColor;
}

/** ANSI styles for non-color text effects */
const ANSI_TEXT_STYLES: Record<TextStyle, AnsiSequence> = /* @__PURE__ */ Object.freeze({
	bold: ['\x1b[1m', '\x1b[22m'],
	bolder: ['\x1b[1m', '\x1b[22m'],
	dim: ['\x1b[2m', '\x1b[22m'],
	italic: ['\x1b[3m', '\x1b[23m'],
	underline: ['\x1b[4m', '\x1b[24m'],
	strikethrough: ['\x1b[9m', '\x1b[29m'],
	inverse: ['\x1b[7m', '\x1b[27m'],
});

/** Browser CSS equivalents */
const CSS_TEXT_STYLES: Record<TextStyle, string> = /* @__PURE__ */ Object.freeze({
	bold: 'font-weight: bold',
	bolder: 'font-weight: bolder',
	dim: 'opacity: 0.7',
	italic: 'font-style: italic',
	underline: 'text-decoration: underline',
	strikethrough: 'text-decoration: line-through',
	inverse: 'filter: invert(1)',
});

const ANSI_16_COLORS = /* @__PURE__ */ Object.freeze({
	// Foreground Colors
	black: [30, 39],
	red: [31, 39],
	green: [32, 39],
	yellow: [33, 39],
	blue: [34, 39],
	purple: [35, 39],
	cyan: [36, 39],
	white: [37, 39],

	// Bright Foreground Colors
	blackBright: [90, 39],
	redBright: [91, 39],
	greenBright: [92, 39],
	yellowBright: [93, 39],
	blueBright: [94, 39],
	purpleBright: [95, 39],
	cyanBright: [96, 39],
	whiteBright: [97, 39],

	// Background Colors
	bgBlack: [40, 49],
	bgRed: [41, 49],
	bgGreen: [42, 49],
	bgYellow: [43, 49],
	bgBlue: [44, 49],
	bgPurple: [45, 49],
	bgCyan: [46, 49],
	bgWhite: [47, 49],

	// Bright Background Colors
	bgBlackBright: [100, 49],
	bgRedBright: [101, 49],
	bgGreenBright: [102, 49],
	bgYellowBright: [103, 49],
	bgBlueBright: [104, 49],
	bgPurpleBright: [105, 49],
	bgCyanBright: [106, 49],
	bgWhiteBright: [107, 49],
} as const);

function isAnsi16Color(value: unknown): value is Ansi16Value {
	return (
		isArrayOfType(value, isNumber) &&
		value?.length === 2 &&
		value[0] >= 30 &&
		value[0] <= 107 &&
		(value[1] === 39 || value[1] === 49)
	);
}

function isCSS16Color(value: string): value is CSS16Color {
	return value?.startsWith('css-') && value?.replace('css-', '') in CSS_16_COLORS;
}

// Browser CSS equivalents for ANSI 16 colors
const CSS_16_COLORS = /* @__PURE__ */ Object.freeze({
	// Foreground Colors
	black: '#000000',
	red: '#800000',
	green: '#008000',
	yellow: '#808000',
	blue: '#000080',
	purple: '#800080',
	cyan: '#008080',
	white: '#c0c0c0',

	// Bright Foreground Colors
	blackBright: '#808080',
	redBright: '#ff0000',
	greenBright: '#00ff00',
	yellowBright: '#ffff00',
	blueBright: '#0000ff',
	purpleBright: '#ff00ff',
	cyanBright: '#00ffff',
	whiteBright: '#ffffff',

	// Background Colors
	bgBlack: '#000000',
	bgRed: '#800000',
	bgGreen: '#008000',
	bgYellow: '#808000',
	bgBlue: '#000080',
	bgPurple: '#800080',
	bgCyan: '#008080',
	bgWhite: '#c0c0c0',

	// Bright Background Colors
	bgBlackBright: '#808080',
	bgRedBright: '#ff0000',
	bgGreenBright: '#00ff00',
	bgYellowBright: '#ffff00',
	bgBlueBright: '#0000ff',
	bgPurpleBright: '#ff00ff',
	bgCyanBright: '#00ffff',
	bgWhiteBright: '#ffffff',
} as unknown as Record<Ansi16Color, Hex6>);

function css16ToHex(value: CSS16Color): Hex6 {
	return CSS_16_COLORS?.[value?.replace('css-', '') as Ansi16Color];
}

export type Ansi16Color = keyof typeof ANSI_16_COLORS;
export type CSS16Color = `css-${Ansi16Color}`;
export type Ansi16Value = (typeof ANSI_16_COLORS)[Ansi16Color];

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

function isAnsiSequence(seq: unknown): seq is AnsiSequence {
	return (
		isArrayOfType(seq, isString) &&
		seq?.length === 2 &&
		(seq[0].startsWith('\x1b[48') || seq[0].startsWith('\x1b[38')) &&
		(seq[1].startsWith('\x1b[49') || seq[1].startsWith('\x1b[39'))
	);
}

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
 * logger.style('blue')
 *   .style('dim')
 *   .style('bold')
 *   .log('Hello Blue');
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
	 * logger.style('blue')
	 *   .style('dim')
	 *   .style('bold')
	 *   .log('Hello Blue');
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
	) {
		return createStylogProxy(
			new LogStyler([...(this.#styles as Styles[]), ...(style as Styles[])])
		);
	}

	/**
	 * * Chain multiple styles to the input.
	 * @remarks When chaining similar styles, only the last one(s) takes effect.
	 *
	 * @param style Style to apply (color, background, or text style).
	 * @returns A new `LogStyler` instance combined with `StylogChain` with the additional style applied.
	 */
	style(...style: Styles[]): StylogChain {
		return this.#style(...style);
	}

	ansi16(color: Ansi16Color): StylogChain {
		this.#styles.push(ANSI_16_COLORS[color]);
		this.#styles.push(`css-${color}`);

		return createStylogProxy(this);
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
					const color = CSS_COLORS[extractColorName(style)];
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
				} else if (isCSS16Color(style)) {
					const color = css16ToHex(style);

					const colorValue =
						style.startsWith('css-bg') ? `background: ${color}` : `color: ${color}`;

					cssList.push(colorValue);
				}
			}
		}
		return [`%c${stringified}`, cssList];
	}

	#isValidHexOrRGB(color: string): color is Hex6 | RGB | `bg-${Hex6}` | `bg-${RGB}` {
		const pure = color?.replace('bg-', '');

		return _isHex6(pure) || _isRGB(pure);
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
					const hex = CSS_COLORS[extractColorName(style)];
					const [open, close] = hexToAnsi(hex, true);
					openSeq += open;
					closeSeq = close + closeSeq;
				} else if (isCSSColor(style)) {
					const hex = CSS_COLORS[style];
					const [open, close] = hexToAnsi(hex, false);
					openSeq += open;
					closeSeq = close + closeSeq;
				} else if (style in ANSI_16_COLORS) {
					const [open, close] = ANSI_16_COLORS[style as Ansi16Color];
					openSeq += open;
					closeSeq = close + closeSeq;
				}
			} else if (isAnsiSequence(style)) {
				openSeq += style[0];
				closeSeq = style[1] + closeSeq;
			} else if (isAnsi16Color(style)) {
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

	#sanitizeHex(code: string): string {
		return code?.trim()?.startsWith('#') ? code?.trim() : `#${code?.trim()}`;
	}

	#handleHex(code: string, isBg = false): LogStyler {
		const sanitized = this.#sanitizeHex(code);

		if (!_isHex6(sanitized)) {
			return this;
		}

		const ansi = hexToAnsi(sanitized, isBg);

		return this.#style(isBg ? `bg-${sanitized}` : sanitized, ansi);
	}

	hex(code: string): LogStyler {
		return this.#handleHex(code, false);
	}

	bgHex(code: string): LogStyler {
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
				return createStylogProxy(this);
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
				return createStylogProxy(this);
			}
		} else {
			return createStylogProxy(this);
		}
	}

	rgb(code: string): StylogChain;
	rgb(red: number, green: number, blue: number): StylogChain;

	rgb(code: string | number, green?: number, blue?: number): StylogChain {
		return this.#handleRGB(code, green, blue, false);
	}

	bgRGB(code: string): StylogChain;
	bgRGB(red: number, green: number, blue: number): StylogChain;

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
				return createStylogProxy(this);
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
				return createStylogProxy(this);
			}
		} else {
			return createStylogProxy(this);
		}
	}

	hsl(code: string): StylogChain;

	hsl(hue: number, saturation: number, lightness: number): StylogChain;

	hsl(code: string | number, saturation?: number, lightness?: number): StylogChain {
		return this.#handleHSL(code, saturation, lightness, false);
	}

	bgHSL(code: string): StylogChain;

	bgHSL(hue: number, saturation: number, lightness: number): StylogChain;

	bgHSL(code: string | number, saturation?: number, lightness?: number): StylogChain {
		return this.#handleHSL(code, saturation, lightness, true);
	}
}

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
