import { convertHexToRgb } from '../src/colors/convert';
import { CSS_COLORS } from '../src/colors/css-colors';
import type { Hex } from '../src/colors/types';
import { isBrowser } from '../src/index';
import type { Any } from '../src/types/index';

/** Extract all CSS color names */
export type CSSColorName = keyof typeof CSS_COLORS;

export type TextStyle =
	| 'bold'
	| 'bolder'
	| 'dim'
	| 'italic'
	| 'underline'
	| 'strikethrough'
	| 'inverse';

export type Styles = CSSColorName | `bg${Capitalize<CSSColorName>}` | TextStyle;

/** ANSI wrapper (supports true-color via 38;2;r;g;b) */
function hexToAnsi(hex: Hex, isBg = false): [string, string] {
	const [r, g, b] = (convertHexToRgb(hex).match(/\d+/g) || []).map(Number);
	const open = `\x1b[${isBg ? 48 : 38};2;${r};${g};${b}m`;
	const close = `\x1b[${isBg ? 49 : 39}m`;
	return [open, close];
}

function extractColorName(bgColor: string): CSSColorName {
	return bgColor.slice(2).toLowerCase() as CSSColorName;
}

/** ANSI styles for non-color text effects */
const ANSI_TEXT_STYLES: Record<TextStyle, [string, string]> = {
	bold: ['\x1b[1m', '\x1b[22m'],
	bolder: ['\x1b[1m', '\x1b[22m'],
	dim: ['\x1b[2m', '\x1b[22m'],
	italic: ['\x1b[3m', '\x1b[23m'],
	underline: ['\x1b[4m', '\x1b[24m'],
	strikethrough: ['\x1b[9m', '\x1b[29m'],
	inverse: ['\x1b[7m', '\x1b[27m'],
};

/** Browser CSS equivalents */
const CSS_TEXT_STYLES: Record<TextStyle, string> = {
	bold: 'font-weight: bold',
	bolder: 'font-weight: bolder',
	dim: 'opacity: 0.7',
	italic: 'font-style: italic',
	underline: 'text-decoration: underline',
	strikethrough: 'text-decoration: line-through',
	inverse: 'filter: invert(1)',
};

class LogStyler {
	readonly #styles: Styles[];

	constructor(styles: Styles[] = []) {
		this.#styles = styles;
	}

	chain(style: Styles): LogStyler {
		return new LogStyler([...this.#styles, style]);
	}

	#applyStyles(input: Any, stringify = false): string | [string, string[]] {
		const stringified = stringify === true ? JSON.stringify(input) : input;

		if (isBrowser()) {
			// Browser CSS
			const cssList: string[] = [];
			for (const style of this.#styles) {
				if (style in CSS_TEXT_STYLES) {
					cssList.push(CSS_TEXT_STYLES[style as TextStyle]);
				} else if (style.startsWith('bg')) {
					const color = CSS_COLORS[extractColorName(style)];
					cssList.push(`background: ${color}`);
				} else {
					const color = CSS_COLORS[style as CSSColorName];
					cssList.push(`color: ${color}`);
				}
			}
			return [`%c${stringified}`, cssList];
		} else {
			// Node ANSI
			let openSeq = '';
			let closeSeq = '';
			for (const style of this.#styles) {
				if (style in ANSI_TEXT_STYLES) {
					const [open, close] = ANSI_TEXT_STYLES[style as TextStyle];
					openSeq += open;
					closeSeq = close + closeSeq;
				} else if (style.startsWith('bg')) {
					const hex = CSS_COLORS[extractColorName(style)];
					const [open, close] = hexToAnsi(hex, true);
					openSeq += open;
					closeSeq = close + closeSeq;
				} else {
					const hex = CSS_COLORS[style as CSSColorName];
					const [open, close] = hexToAnsi(hex, false);
					openSeq += open;
					closeSeq = close + closeSeq;
				}
			}
			return openSeq + stringified + closeSeq;
		}
	}

	/**
	 * Print styled input to console
	 */
	public log(input: Any, stringify = false): void {
		if (isBrowser()) {
			const [fmt, cssList] = this.#applyStyles(input, stringify) as [string, string[]];
			console.log(fmt, cssList.join(';'));
		} else {
			console.log(this.#applyStyles(input, stringify));
		}
	}
}

/** Map all styles into TS type system */
type Stylog = LogStyler & {
	[K in Styles]: Stylog;
};

/** Wraps a Stylog in a Proxy to support dynamic chaining */
function createStylogProxy(chain: LogStyler): Stylog {
	return new Proxy(chain, {
		get(target, prop: Styles) {
			if (prop in target) {
				const value = target[prop];
				if (typeof value === 'function') {
					return value.bind(target);
				}
				return value;
			}

			// If prop is a color or style, chain it
			if (
				prop in CSS_COLORS ||
				(prop.startsWith('bg') && extractColorName(prop) in CSS_COLORS) ||
				prop in ANSI_TEXT_STYLES
			) {
				return createStylogProxy(target.chain(prop));
			}
		},
	}) as Stylog;
}

/** Export Stylog instance */
export const Stylog: Stylog = createStylogProxy(new LogStyler());

// * BUGS FIXED: CANNOT CHAIN OTHER STYLES WITH COLOR and MULTIPLE STYLES TOGETHER!
