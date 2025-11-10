import type { ClockHour, DayPart } from './types';

/** Array of strings containing all the seven week-day names, starting with `Sunday` */
export const DAYS = /* @__PURE__ */ Object.freeze([
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
] as const);

/** Array of strings containing all the 12 month names, starting with `January`  */
export const MONTHS = /* @__PURE__ */ Object.freeze([
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
] as const);

export const YEAR_FORMATS = /* @__PURE__ */ Object.freeze([
	'YYYY',
	'YY',
	'yyyy',
	'yy',
] as const);

export const MONTH_FORMATS = /* @__PURE__ */ Object.freeze(['M', 'MM', 'mmm', 'mmmm'] as const);

export const DATE_FORMATS = /* @__PURE__ */ Object.freeze(['DD', 'D', 'Do'] as const);

export const DAY_FORMATS = /* @__PURE__ */ Object.freeze(['d', 'dd', 'ddd'] as const);

export const HOUR_FORMATS = /* @__PURE__ */ Object.freeze(['H', 'HH', 'hh', 'h'] as const);

export const MINUTE_FORMATS = /* @__PURE__ */ Object.freeze(['mm', 'm'] as const);

export const SECOND_FORMATS = /* @__PURE__ */ Object.freeze(['ss', 's'] as const);

export const ZONE_FORMATS = /* @__PURE__ */ Object.freeze(['ZZ'] as const);

export const MILLISECOND_FORMATS = /* @__PURE__ */ Object.freeze(['ms', 'mss'] as const);

export const TIME_FORMATS = /* @__PURE__ */ Object.freeze(['a', 'A'] as const);

export const SORTED_TIME_FORMATS = /* @__PURE__ */ Object.freeze(
	[
		...YEAR_FORMATS,
		...MONTH_FORMATS,
		...DAY_FORMATS,
		...DATE_FORMATS,
		...HOUR_FORMATS,
		...MINUTE_FORMATS,
		...SECOND_FORMATS,
		...MILLISECOND_FORMATS,
		...TIME_FORMATS,
		...ZONE_FORMATS,
	].sort((a, b) => b.length - a.length)
);

/** Ranges for day parts. */
export const DATE_PART_RANGES = /* @__PURE__ */ Object.freeze({
	night: ['21', '23'],
	midnight: ['00', '01'],
	lateNight: ['02', '04'],
	morning: ['05', '11'],
	afternoon: ['12', '16'],
	evening: ['17', '20'],
} as Record<DayPart, [ClockHour, ClockHour]>);

/** Western Zodiac Signs */
export const WESTERN_ZODIAC_SIGNS = /* @__PURE__ */ Object.freeze([
	['Capricorn', [12, 22]],
	['Aquarius', [1, 20]],
	['Pisces', [2, 19]],
	['Aries', [3, 21]],
	['Taurus', [4, 20]],
	['Gemini', [5, 21]],
	['Cancer', [6, 21]],
	['Leo', [7, 23]],
	['Virgo', [8, 23]],
	['Libra', [9, 23]],
	['Scorpio', [10, 23]],
	['Sagittarius', [11, 22]],
	['Capricorn', [12, 22]],
] as const);

/** Vedic Zodiac Sign */
export const VEDIC_ZODIAC_SIGNS = /* @__PURE__ */ Object.freeze([
	['Capricorn', [1, 14]],
	['Aquarius', [2, 13]],
	['Pisces', [3, 14]],
	['Aries', [4, 13]],
	['Taurus', [5, 14]],
	['Gemini', [6, 14]],
	['Cancer', [7, 16]],
	['Leo', [8, 16]],
	['Virgo', [9, 16]],
	['Libra', [10, 16]],
	['Scorpio', [11, 15]],
	['Sagittarius', [12, 15]],
	['Capricorn', [1, 14]],
] as const);

/** Zodiac Signs Presets */
export const ZODIAC_PRESETS = /* @__PURE__ */ Object.freeze({
	western: WESTERN_ZODIAC_SIGNS,
	vedic: VEDIC_ZODIAC_SIGNS,
	tropical: WESTERN_ZODIAC_SIGNS,
	sidereal: VEDIC_ZODIAC_SIGNS,
} as const);

/** @internal Symbol for accessing Chronos internals (plugin author use only) */
export const INTERNALS = Symbol('Internals');
