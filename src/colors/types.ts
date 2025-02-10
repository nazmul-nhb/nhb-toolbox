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
 * Format: `#3C6945`
 */
export type Hex = `#${string}`;

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

/** * Union type representing a color in Hex, RGB, or HSL format. */
export type Color = Hex | RGB | HSL;

/** * Represents a tuple of three numerical values corresponding to RGB or HSL color components. */
export type ColorNumbers = [number, number, number];

/**
 * * Represents the converted color formats for a given color type.
 *
 * - If the input is `Hex`, the output includes `RGB` and `HSL`.
 * - If the input is `RGB`, the output includes `Hex` and `HSL`.
 * - If the input is `HSL`, the output includes `Hex` and `RGB`.
 *
 * @template T The input color type (`Hex`, `RGB`, or `HSL`).
 */
export interface ConvertedColors<T extends Color>
	extends Record<string, Hex | RGB | HSL> {
	/** - The Hex representation (excluded if the input is already Hex). */
	hex: T extends Hex ? never : Hex;
	/** - The RGB representation (excluded if the input is already RGB). */
	rgb: T extends RGB ? never : RGB;
	/** - The HSL representation (excluded if the input is already HSL). */
	hsl: T extends HSL ? never : HSL;
}
