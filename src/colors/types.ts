/** - A string, number for generating color. */
export type ColorInput = string | number;

/** - An array of strings/numbers or nested arrays of strings/numbers for generating colors. */
export interface ColorInputArray extends Array<ColorInput | ColorInputArray> {}

/** - Opacity options */
export type OpacityValue =
	| 0
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8
	| 9
	| 10
	| 11
	| 12
	| 13
	| 14
	| 15
	| 16
	| 17
	| 18
	| 19
	| 20
	| 21
	| 22
	| 23
	| 24
	| 25
	| 26
	| 27
	| 28
	| 29
	| 30
	| 31
	| 32
	| 33
	| 34
	| 35
	| 36
	| 37
	| 38
	| 39
	| 40
	| 41
	| 42
	| 43
	| 44
	| 45
	| 46
	| 47
	| 48
	| 49
	| 50
	| 51
	| 52
	| 53
	| 54
	| 55
	| 56
	| 57
	| 58
	| 59
	| 60
	| 61
	| 62
	| 63
	| 64
	| 65
	| 66
	| 67
	| 68
	| 69
	| 70
	| 71
	| 72
	| 73
	| 74
	| 75
	| 76
	| 77
	| 78
	| 79
	| 80
	| 81
	| 82
	| 83
	| 84
	| 85
	| 86
	| 87
	| 88
	| 89
	| 90
	| 91
	| 92
	| 93
	| 94
	| 95
	| 96
	| 97
	| 98
	| 99
	| 100;

/**
 * * Represents a hexadecimal color code.
 * * Format: `#3C6945`
 */
export type Hex = `#${string}`;

/**
 * * Represents a hexadecimal color code.
 * * Format: `#3C6945`
 */
export type Hex6 = `#${string}` & { __hex6Brand: never };

/**
 * * Represents an RGB color string.
 * * Format: `rgb(R, G, B)`
 *
 * - R (Red): 0-255
 * - G (Green): 0-255
 * - B (Blue): 0-255
 */
export type RGB = `rgb(${number}, ${number}, ${number})`;

/**
 * * Represents an HSL color string.
 * * Format: `hsl(H, S%, L%)`
 *
 * - H (Hue): 0-360
 * - S (Saturation): 0-100%
 * - L (Lightness): 0-100%
 */
export type HSL = `hsl(${number}, ${number}%, ${number}%)`;

/**
 * * Represents a hexadecimal color code with optional alpha channel.
 * * Format: `#3C6945FF`
 */
export type Hex8 = `#${string}` & { __hex8Brand: never };

/**
 * * Represents an RGBA color string, now includes optional alpha (opacity).
 * * Format: `rgba(R, G, B, A)`
 */
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;

/**
 * * Represents an HSLA color string with optional alpha channel.
 * * Format: `hsla(H, S%, L%, A)`
 */
export type HSLA = `hsla(${number}, ${number}%, ${number}%, ${number})`;

/** * Union type representing a color in Hex6, RGB, or HSL format. */
export type ColorTypeSolid = Hex6 | RGB | HSL;

/** * Union type representing a color in Hex8, RGBA, or HSLA format. */
export type ColorTypeAlpha = Hex8 | RGBA | HSLA;

/** - Colors Object that includes `Hex8`, `RGBA` and `HSLA` formats of the same color. */
export interface SolidColors {
	hex: Hex6;
	rgb: RGB;
	hsl: HSL;
}

/** - Colors Object that includes `Hex`, `RGB` and `HSL` formats of the same color. */
export interface AlphaColors {
	hex8: Hex8;
	rgba: RGBA;
	hsla: HSLA;
}

export type ColorType = ColorTypeSolid | ColorTypeAlpha | Hex;

/** * Represents a tuple of three numerical values corresponding to RGB or HSL color components. */
export type ColorNumbers = [number, number, number];

/** * Represents a tuple of three numerical values corresponding to RGB or HSL color components. */
export type ColorNumbersAlpha = [number, number, number, number];

/**
 * * Represents the converted color formats for a given color type.
 *
 * - If the input is `Hex`, the output includes `RGB` and `HSL`.
 * - If the input is `RGB`, the output includes `Hex` and `HSL`.
 * - If the input is `HSL`, the output includes `Hex` and `RGB`.
 *
 * @template T The input color type (`Hex`, `RGB`, or `HSL`).
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
export type AlphaValue = number & { __brand: 'AlphaValue' };
