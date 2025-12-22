import type { $TimeUnitVar, ClockHour, DayPart } from './types';

/** @internal Symbol for accessing Chronos internals (plugin author use only) */
export const INTERNALS = Symbol('Internals');

/** Milliseconds per day */
export const MS_PER_DAY = 86400000;

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

export const MILLISECOND_FORMATS = /* @__PURE__ */ Object.freeze(['ms', 'mss'] as const);

export const TIME_FORMATS = /* @__PURE__ */ Object.freeze(['a', 'A'] as const);

export const EXTRA_FORMATS = /* @__PURE__ */ Object.freeze(['Z', 'ZZ', 'S', 'SS'] as const);

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
		...EXTRA_FORMATS,
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

/** Variants of different time units */
export const TIME_UNIT_VARIANTS = /* @__PURE__ */ Object.freeze({
	year: ['y', 'yr', 'yrs', 'year', 'years'],
	month: ['mo', 'month', 'months'],
	week: ['w', 'week', 'weeks'],
	day: ['d', 'day', 'days'],
	hour: ['h', 'hr', 'hrs', 'hour', 'hours'],
	minute: ['m', 'min', 'mins', 'minute', 'minutes'],
	second: ['s', 'sec', 'secs', 'second', 'seconds'],
	millisecond: ['ms', 'msec', 'msecs', 'millisecond', 'milliseconds'],
} as const);

/** Map to different time units to milliseconds */
export const MS_MAP = /* @__PURE__ */ Object.freeze(
	((): Record<$TimeUnitVar, number> => {
		const s = 1000;
		const m = s * 60;
		const h = m * 60;
		const d = h * 24;
		const w = d * 7;
		const y = d * 365.25;
		const mo = y / 12;

		return {
			y,
			yr: y,
			yrs: y,
			year: y,
			years: y,
			mo,
			month: mo,
			months: mo,
			w,
			week: w,
			weeks: w,
			d,
			day: d,
			days: d,
			h,
			hr: h,
			hrs: h,
			hour: h,
			hours: h,
			m,
			min: m,
			mins: m,
			minute: m,
			minutes: m,
			s,
			sec: s,
			secs: s,
			second: s,
			seconds: s,
			ms: 1,
			msec: 1,
			msecs: 1,
			millisecond: 1,
			milliseconds: 1,
		};
	})()
);

/** List of locale calendars supported by {@link Intl} API */
export const LOCALE_CALENDARS = /* @__PURE__ */ Object.freeze([
	'buddhist',
	'chinese',
	'coptic',
	'dangi',
	'ethioaa',
	'ethiopic',
	'gregory',
	'hebrew',
	'indian',
	'islamic',
	'islamic-civil',
	'islamic-rgsa',
	'islamic-tbla',
	'islamic-umalqura',
	'iso8601',
	'japanese',
	'persian',
	'roc',
] as const);

/** List of locale numbering systems supported by {@link Intl} API */
export const LOCALE_NUMBERING_SYSTEMS = /* @__PURE__ */ Object.freeze([
	'adlm',
	'ahom',
	'arab',
	'arabext',
	'bali',
	'beng',
	'bhks',
	'brah',
	'cakm',
	'cham',
	'deva',
	'diak',
	'fullwide',
	'gara',
	'gong',
	'gonm',
	'gujr',
	'gukh',
	'guru',
	'hanidec',
	'hmng',
	'hmnp',
	'java',
	'kali',
	'kawi',
	'khmr',
	'knda',
	'krai',
	'lana',
	'lanatham',
	'laoo',
	'latn',
	'lepc',
	'limb',
	'mathbold',
	'mathdbl',
	'mathmono',
	'mathsanb',
	'mathsans',
	'mlym',
	'modi',
	'mong',
	'mroo',
	'mtei',
	'mymr',
	'mymrepka',
	'mymrpao',
	'mymrshan',
	'mymrtlng',
	'nagm',
	'newa',
	'nkoo',
	'olck',
	'onao',
	'orya',
	'osma',
	'outlined',
	'rohg',
	'saur',
	'segment',
	'shrd',
	'sind',
	'sinh',
	'sora',
	'sund',
	'sunu',
	'takr',
	'talu',
	'tamldec',
	'telu',
	'thai',
	'tibt',
	'tirh',
	'tnsa',
	'vaii',
	'wara',
	'wcho',
] as const);

// ! Bangla Calendar Constants

/** Bangla year offset */
export const BN_YEAR_OFFSET = 593;

/** Bangla month days table for different variants */
export const BN_MONTH_TABLES = /* @__PURE__ */ Object.freeze({
	'revised-2019': {
		normal: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 29, 30],
		leap: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30],
	},
	'revised-1966': {
		normal: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
		leap: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 31, 30],
	},
} as const);

/** List of Bangla season names in Bangla and English */
export const BN_SEASONS = /* @__PURE__ */ Object.freeze([
	{ bn: 'গ্রীষ্ম', en: 'Grisma (Summer)' },
	{ bn: 'বর্ষা', en: 'Barsa (Monsoon)' },
	{ bn: 'শরৎ', en: 'Sarat (Autumn)' },
	{ bn: 'হেমন্ত', en: 'Hemanta (Late-Autumn)' },
	{ bn: 'শীত', en: 'Shhit (Winter)' },
	{ bn: 'বসন্ত', en: 'Basanta (Spring)' },
] as const);

/** List of Bangla day names in Bangla and English */
export const BN_DAYS = /* @__PURE__ */ Object.freeze([
	{ bn: 'রবিবার', en: 'Robibar (Sunday)', short: 'র' },
	{ bn: 'সোমবার', en: 'Shombar (Monday)', short: 'সো' },
	{ bn: 'মঙ্গলবার', en: 'Mongolbar (Tuesday)', short: 'ম' },
	{ bn: 'বুধবার', en: 'Budhbar (Wednesday)', short: 'বু' },
	{ bn: 'বৃহস্পতিবার', en: 'Brihoshpotibar (Thursday)', short: 'বৃ' },
	{ bn: 'শুক্রবার', en: 'Shukrobar (Friday)', short: 'শু' },
	{ bn: 'শনিবার', en: 'Shonibar (Saturday)', short: 'শ' },
] as const);

/** List of Bangla month names in Bangla and English */
export const BN_MONTHS = /* @__PURE__ */ Object.freeze([
	{ bn: 'বৈশাখ', en: 'Boishakh', short: 'বৈ' },
	{ bn: 'জ্যৈষ্ঠ', en: 'Joishtho', short: 'জ্য' },
	{ bn: 'আষাঢ়', en: 'Asharh', short: 'আ' },
	{ bn: 'শ্রাবণ', en: 'Srabon', short: 'শ্রা' },
	{ bn: 'ভাদ্র', en: 'Bhadro', short: 'ভা' },
	{ bn: 'আশ্বিন', en: 'Ashwin', short: 'আ' },
	{ bn: 'কার্তিক', en: 'Kartik', short: 'কা' },
	{ bn: 'অগ্রহায়ণ', en: 'Ogrohayon', short: 'অ' },
	{ bn: 'পৌষ', en: 'Poush', short: 'পৌ' },
	{ bn: 'মাঘ', en: 'Magh', short: 'মা' },
	{ bn: 'ফাল্গুন', en: 'Falgun', short: 'ফা' },
	{ bn: 'চৈত্র', en: 'Choitro', short: 'চৈ' },
] as const);
