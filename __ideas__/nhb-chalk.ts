import { CSS_COLORS } from "../src/colors/css-colors";
import type { Hex } from "../src/colors/types";

/** Extract all CSS color names */
export type CSSColorName = keyof typeof CSS_COLORS;

/** Additional text styles */
export type TextStyle =
	| "bold"
	| "dim"
	| "italic"
	| "underline"
	| "strikethrough"
	| "inverse";

/** ChalkStyle = Colors + Background colors + Text styles */
export type ChalkStyle = CSSColorName | `bg${Capitalize<CSSColorName>}` | TextStyle;

/** ANSI wrapper (supports true-color via 38;2;r;g;b) */
function hexToAnsi(hex: Hex, isBg = false): [string, string] {
	const clean = hex.replace("#", "");
	const bigint = parseInt(clean.substring(0, 6), 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	const open = `\x1b[${isBg ? 48 : 38};2;${r};${g};${b}m`;
	const close = `\x1b[${isBg ? 49 : 39}m`;
	return [open, close];
}

/** ANSI styles for non-color text effects */
const ANSI_TEXT_STYLES: Record<TextStyle, [string, string]> = {
	bold: ["\x1b[1m", "\x1b[22m"],
	dim: ["\x1b[2m", "\x1b[22m"],
	italic: ["\x1b[3m", "\x1b[23m"],
	underline: ["\x1b[4m", "\x1b[24m"],
	strikethrough: ["\x1b[9m", "\x1b[29m"],
	inverse: ["\x1b[7m", "\x1b[27m"],
};

/** Browser CSS equivalents */
const CSS_TEXT_STYLES: Record<TextStyle, string> = {
	bold: "font-weight: bold",
	dim: "opacity: 0.7",
	italic: "font-style: italic",
	underline: "text-decoration: underline",
	strikethrough: "text-decoration: line-through",
	inverse: "filter: invert(1)",
};

class ChalkChain {
	private styles: ChalkStyle[];

	constructor(styles: ChalkStyle[] = []) {
		this.styles = styles;
	}

	chain(style: ChalkStyle): ChalkChain {
		return new ChalkChain([...this.styles, style]);
	}

	/**
	 * Apply formatting to text
	 */
	public applyStyles(text: string): string | [string, string[]] {
		if (typeof window !== "undefined") {
			// Browser CSS
			const cssList: string[] = [];
			for (const style of this.styles) {
				if (style in CSS_TEXT_STYLES) {
					cssList.push(CSS_TEXT_STYLES[style as TextStyle]);
				} else if (style.startsWith("bg")) {
					const color = CSS_COLORS[
						(style.slice(2).charAt(0).toLowerCase() + style.slice(3)) as CSSColorName
					];
					cssList.push(`background: ${color}`);
				} else {
					const color = CSS_COLORS[style as CSSColorName];
					cssList.push(`color: ${color}`);
				}
			}
			return [`%c${text}`, cssList];
		} else {
			// Node ANSI
			let openSeq = "";
			let closeSeq = "";
			for (const style of this.styles) {
				if (style in ANSI_TEXT_STYLES) {
					const [open, close] = ANSI_TEXT_STYLES[style as TextStyle];
					openSeq += open;
					closeSeq = close + closeSeq;
				} else if (style.startsWith("bg")) {
					const hex = CSS_COLORS[
						(style.slice(2).charAt(0).toLowerCase() + style.slice(3)) as CSSColorName
					];
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
			return openSeq + text + closeSeq;
		}
	}

	/**
	 * Print styled text to console
	 */
	public log(text: string): void {
		if (typeof window !== "undefined") {
			const [fmt, cssList] = this.applyStyles(text) as [string, string[]];
			console.log(fmt, cssList.join(";"));
		} else {
			console.log(this.applyStyles(text));
		}
	}
}

/** Map all styles into TS type system */
type ChalkWithDynamicGetters = ChalkChain & {
	[K in ChalkStyle]: ChalkWithDynamicGetters;
};

/** Export chalk instance */
export const nhbChalk: ChalkWithDynamicGetters = new Proxy(new ChalkChain(), {
	get(target, prop: string) {
		if (prop in target) return (target)[prop];
		if (
			prop in CSS_COLORS ||
			(prop.startsWith("bg") && prop.slice(2).toLowerCase() in CSS_COLORS) ||
			prop in ANSI_TEXT_STYLES
		) {
			return target.chain(prop as ChalkStyle);
		}
		return undefined;
	},
}) as ChalkWithDynamicGetters;

// ! BUGS: CANNOT CHAIN OTHER STYLES WITH COLOR and MULTIPLE STYLES TOGETHER!