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

export type ColorNumber =
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
	| 100
	| 101
	| 102
	| 103
	| 104
	| 105
	| 106
	| 107
	| 108
	| 109
	| 110
	| 111
	| 112
	| 113
	| 114
	| 115
	| 116
	| 117
	| 118
	| 119
	| 120
	| 121
	| 122
	| 123
	| 124
	| 125
	| 126
	| 127
	| 128
	| 129
	| 130
	| 131
	| 132
	| 133
	| 134
	| 135
	| 136
	| 137
	| 138
	| 139
	| 140
	| 141
	| 142
	| 143
	| 144
	| 145
	| 146
	| 147
	| 148
	| 149
	| 150
	| 151
	| 152
	| 153
	| 154
	| 155
	| 156
	| 157
	| 158
	| 159
	| 160
	| 161
	| 162
	| 163
	| 164
	| 165
	| 166
	| 167
	| 168
	| 169
	| 170
	| 171
	| 172
	| 173
	| 174
	| 175
	| 176
	| 177
	| 178
	| 179
	| 180
	| 181
	| 182
	| 183
	| 184
	| 185
	| 186
	| 187
	| 188
	| 189
	| 190
	| 191
	| 192
	| 193
	| 194
	| 195
	| 196
	| 197
	| 198
	| 199
	| 200
	| 201
	| 202
	| 203
	| 204
	| 205
	| 206
	| 207
	| 208
	| 209
	| 210
	| 211
	| 212
	| 213
	| 214
	| 215
	| 216
	| 217
	| 218
	| 219
	| 220
	| 221
	| 222
	| 223
	| 224
	| 225
	| 226
	| 227
	| 228
	| 229
	| 230
	| 231
	| 232
	| 233
	| 234
	| 235
	| 236
	| 237
	| 238
	| 239
	| 240
	| 241
	| 242
	| 243
	| 244
	| 245
	| 246
	| 247
	| 248
	| 249
	| 250
	| 251
	| 252
	| 253
	| 254
	| 255;

/**
 * * Represents a hexadecimal color code.
 * * Format: `#3C6945`
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

// export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;

// export type HSLA = `hsla(${number}, ${number}%, ${number}%, ${number})`;

/** * Union type representing a color in Hex, RGB, or HSL format. */
export type ColorType = Hex | RGB | HSL;

/** - Colors Object that includes `Hex`, `RGB` and `HSL` formats of the same color. */
export interface Colors {
	hex: Hex;
	rgb: RGB;
	hsl: HSL;
}

/** * Represents a tuple of three numerical values corresponding to RGB or HSL color components. */
export type ColorNumbers = [ColorNumber, ColorNumber, ColorNumber];

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
	extends Record<string, Hex | RGB | HSL> {
	/** - The Hex representation (excluded if the input is already Hex). */
	hex: T extends Hex ? never : Hex;
	/** - The RGB representation (excluded if the input is already RGB). */
	rgb: T extends RGB ? never : RGB;
	/** - The HSL representation (excluded if the input is already HSL). */
	hsl: T extends HSL ? never : HSL;
}
