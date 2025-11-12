import type { Hex6 } from '../colors/types';
import type { Ansi16Color, AnsiSequence, TextStyle } from './Stylog';

/** ANSI styles for non-color text effects */
export const ANSI_TEXT_STYLES: Record<TextStyle, AnsiSequence> = /* @__PURE__ */ Object.freeze({
	bold: ['\x1b[1m', '\x1b[22m'],
	bolder: ['\x1b[1m', '\x1b[22m'],
	dim: ['\x1b[2m', '\x1b[22m'],
	italic: ['\x1b[3m', '\x1b[23m'],
	underline: ['\x1b[4m', '\x1b[24m'],
	strikethrough: ['\x1b[9m', '\x1b[29m'],
	inverse: ['\x1b[7m', '\x1b[27m'],
});

/** Browser CSS equivalents */
export const CSS_TEXT_STYLES: Record<TextStyle, string> = /* @__PURE__ */ Object.freeze({
	bold: 'font-weight: bold',
	bolder: 'font-weight: bolder',
	dim: 'opacity: 0.7',
	italic: 'font-style: italic',
	underline: 'text-decoration: underline',
	strikethrough: 'text-decoration: line-through',
	inverse: 'filter: invert(1)',
});

/** Records of ANSI-16 colors with values */
export const ANSI_16_COLORS = /* @__PURE__ */ Object.freeze({
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

/** Browser CSS equivalents for ANSI 16 colors */
export const CSS_16_COLORS = /* @__PURE__ */ Object.freeze({
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
