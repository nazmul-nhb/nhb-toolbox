import type { Branded } from '../types/index';
import type { Color } from './Color';
import type { PERCENT_VALUES } from './constants';
import type { CSS_COLORS } from './css-colors';

/** - A string, number for generating color. */
export type ColorInput = string | number;

/** - An array of strings/numbers or nested arrays of strings/numbers for generating colors. */
export type ColorInputArray = Array<ColorInput | ColorInputArray>;

/** - Number value in percentage `(0% - 100%)` without `%` symbol. */
export type Percent = (typeof PERCENT_VALUES)[number];

/**
 * * Represents a hexadecimal color code.
 * * Format: `#3C6945`
 */
export type Hex = `#${string}`;

/**
 * * Represents a hexadecimal color code.
 * * Format: `#3C6945`
 */
export type Hex6 = Branded<`#${string}`, 'Hex6'>;

/**
 * * Represents an RGB color string.
 * * Format: `rgb(R, G, B)`
 *
 * - R (Red): 0-255
 * - G (Green): 0-255
 * - B (Blue): 0-255
 */
export type RGB =
	| `rgb(${number}, ${number}, ${number})`
	| `rgb(${number},${number},${number})`;

/**
 * * Represents an HSL color string.
 * * Format: `hsl(H, S%, L%)`
 *
 * - H (Hue): 0-360
 * - S (Saturation): 0-100%
 * - L (Lightness): 0-100%
 */
export type HSL =
	| `hsl(${number}, ${number}%, ${number}%)`
	| `hsl(${number},${number}%,${number}%)`;

/**
 * * Represents a hexadecimal color code with optional alpha channel.
 * * Format: `#3C6945FF`
 */
export type Hex8 = Branded<`#${string}`, 'Hex8'>;

/**
 * * Represents an RGBA color string, now includes optional alpha (opacity).
 * * Format: `rgba(R, G, B, A)`
 */
export type RGBA =
	| `rgba(${number}, ${number}, ${number}, ${number})`
	| `rgba(${number},${number},${number},${number})`;

/**
 * * Represents an HSLA color string with optional alpha channel.
 * * Format: `hsla(H, S%, L%, A)`
 */
export type HSLA =
	| `hsla(${number}, ${number}%, ${number}%, ${number})`
	| `hsla(${number},${number}%,${number}%,${number})`;

/** * Union type representing a color in Hex6, RGB, or HSL format. */
export type ColorTypeSolid = Hex6 | RGB | HSL;

/** * Union type representing a color in Hex8, RGBA, or HSLA format. */
export type ColorTypeAlpha = Hex8 | RGBA | HSLA;

/** * Union of Alpha & Solid `Hex`, `RGB` and `HSL` */
export type ColorType = Hex | Hex6 | RGB | HSL | Hex8 | RGBA | HSLA;

/** - Colors Object that includes `Hex8`, `RGBA` and `HSLA` formats of the same color. */
export interface SolidColors {
	/** Represents a normal Hex color */
	hex: Hex6;
	/** Represents a normal RGB color */
	rgb: RGB;
	/** Represents a normal HSL color */
	hsl: HSL;
}

/** - Colors Object that includes `Hex`, `RGB` and `HSL` formats of the same color. */
export interface AlphaColors {
	/** Represents a Hex color with alpha channel */
	hex8: Hex8;
	/** Represents a RGBA color with alpha channel */
	rgba: RGBA;
	/** Represents a HSLA color with alpha channel */
	hsla: HSLA;
}

/** * Represents a tuple of three numerical values corresponding to RGB or HSL color components. */
export type SolidValues = [number, number, number];

/** * Represents a tuple of four numerical values corresponding to RGBA or HSLA color components. */
export type AlphaValues = [number, number, number, number];

/**
 * * Represents the converted color formats for a given color type.
 *
 * - If the input is `Hex`, the output includes `RGB` and `HSL`.
 * - If the input is `RGB`, the output includes `Hex` and `HSL`.
 * - If the input is `HSL`, the output includes `Hex` and `RGB`.
 */
export interface ConvertedColors<T extends ColorType>
	extends Record<string, ColorType> {
	/** - The Hex representation (excluded if the input is already Hex). */
	hex: T extends Hex6 | ColorTypeAlpha ? never : Hex6;
	/** - The RGB representation (excluded if the input is already RGB). */
	rgb: T extends RGB | ColorTypeAlpha ? never : RGB;
	/** - The HSL representation (excluded if the input is already HSL). */
	hsl: T extends HSL | ColorTypeAlpha ? never : HSL;
	/** - The Hex8 representation with opacity (excluded if the input is already Hex8). */
	hex8: T extends Hex8 | ColorTypeSolid ? never : Hex8;
	/** - The RGBA representation (excluded if the input is already RGBA). */
	rgba: T extends RGBA | ColorTypeSolid ? never : RGBA;
	/** - The HSLA representation (excluded if the input is already HSLA). */
	hsla: T extends HSLA | ColorTypeSolid ? never : HSLA;
}

/** Represents an alpha value between 0 and 1 */
export type AlphaValue = Branded<number, 'AlphaValue'>;

/** An Object representing all the colors from `Color` constructor. */
export interface Colors {
	/** - `Hex` color (e.g., `#ff5733`) */
	hex: Hex6;
	/** - `Hex8` color (Hex with opacity, e.g., `#ff573380`) */
	hex8: Hex8;
	/** - `RGB` color (e.g., `rgb(255, 87, 51)`) */
	rgb: RGB;
	/** - `RGBA` color (e.g., `rgba(255, 87, 51, 1)`) */
	rgba: RGBA;
	/** - `HSL` color (e.g., `hsl(14, 100%, 60%)`) */
	hsl: HSL;
	/** - `HSLA` color (e.g., `hsla(14, 100%, 60%, 1)`) */
	hsla: HSLA;
}

/** Analogous colors  */
export type Analogous = [Color, Color, Color];

/** Triad color */
export type Triad = [Color, Color, Color];

/** Tetrad color */
export type Tetrad = [Color, Color, Color, Color];

/** CSS named color, also includes different response colors */
export type CSSColor = keyof typeof CSS_COLORS;
