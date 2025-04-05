export const DAYS = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
] as const;

export const MONTHS = [
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
] as const;

export const YEAR_FORMATS = ['YYYY', 'YY', 'yyyy', 'yy'] as const;
export const MONTH_FORMATS = ['M', 'MM', 'MMM', 'MMMM', 'mmm', 'mmmm'] as const;
export const DATE_FORMATS = ['DD', 'D'] as const;
export const DAY_FORMATS = ['d', 'dd', 'ddd', 'dddd'] as const;
export const HOUR_FORMATS = ['H', 'HH', 'hh', 'h'] as const;
export const MINUTE_FORMATS = ['mm', 'm'] as const;
export const SECOND_FORMATS = ['ss', 's'] as const;
export const MILLISECOND_FORMATS = ['ms', 'mss'] as const;
export const TIME_FORMATS = ['a', 'A'] as const;

export const sortedFormats = [
	...YEAR_FORMATS,
	...MONTH_FORMATS,
	...DAY_FORMATS,
	...DATE_FORMATS,
	...HOUR_FORMATS,
	...MINUTE_FORMATS,
	...SECOND_FORMATS,
	...MILLISECOND_FORMATS,
	...TIME_FORMATS,
].sort((a, b) => b.length - a.length);

export const TIME_ZONES = {
	// Universal
	UTC: 0,
	GMT: 0,

	// North America
	EST: -5 * 60,
	EDT: -4 * 60,
	CST: -6 * 60,
	CDT: -5 * 60,
	MST: -7 * 60,
	MDT: -6 * 60,
	PST: -8 * 60,
	PDT: -7 * 60,
	AKST: -9 * 60,
	AKDT: -8 * 60,
	HST: -10 * 60,
	HDT: -9 * 60,

	// South America
	ART: -3 * 60,
	BRST: -2 * 60,
	BRT: -3 * 60,
	CLT: -4 * 60,
	CLST: -3 * 60,
	GFT: -3 * 60,
	UYT: -3 * 60,

	// Europe
	CET: 1 * 60,
	CEST: 2 * 60,
	EET: 2 * 60,
	EEST: 3 * 60,
	WET: 0,
	WEST: 1 * 60,
	MET: 1 * 60,
	MEST: 2 * 60,

	// Africa
	WAT: 1 * 60,
	CAT: 2 * 60,
	EAT: 3 * 60,

	// Asia
	IST: 5.5 * 60, // India
	PKT: 5 * 60,
	BST: 6 * 60, // Bangladesh
	NPT: 5.75 * 60,
	MYT: 8 * 60,
	THA: 7 * 60,
	ICT: 7 * 60,
	WIB: 7 * 60,
	WITA: 8 * 60,
	WIT: 9 * 60,
	SGT: 8 * 60,
	CST_CHINA: 8 * 60,
	JST: 9 * 60,
	KST: 9 * 60,
	IRKT: 8 * 60,
	IRKT_DST: 9 * 60,

	// Australia & Oceania
	AEST: 10 * 60,
	AEDT: 11 * 60,
	ACST: 9.5 * 60,
	ACDT: 10.5 * 60,
	AWST: 8 * 60,
	NZST: 12 * 60,
	NZDT: 13 * 60,
	CHAST: 12.75 * 60,
	CHADT: 13.75 * 60,

	// Russia
	MSK: 3 * 60,
	SAMT: 4 * 60,
	YEKST: 5 * 60,
	OMST: 6 * 60,
	KRAT: 7 * 60,
	IRKT_RU: 8 * 60,
	YAKT: 9 * 60,
	VLAT: 10 * 60,
	MAGT: 11 * 60,
	PETT: 12 * 60,

	// Middle East
	IRST: 3.5 * 60,
	IRDT: 4.5 * 60,
	GST: 4 * 60,

	// Antarctica (used in research stations)
	ROTT: -3 * 60,
	MAWT: 5 * 60,
	NZAT: 13 * 60,

	// Misc
	AST: -4 * 60,
	ADT: -3 * 60,
	NST: -3.5 * 60,
	NDT: -2.5 * 60,
	SST: -11 * 60,
	CHST: 10 * 60,

	// Rare fractional or unique time zones
	MART: -9.5 * 60, // Marquesas Islands Time (UTC−09:30)
	CHAST_NZ: 12.75 * 60, // Chatham Standard Time (NZ, UTC+12:45)
	LHST: 10.5 * 60, // Lord Howe Standard Time (UTC+10:30)
	LHDT: 11 * 60, // Lord Howe Daylight Time (DST +30min)
	ACWST: 8.75 * 60, // Australian Central Western Standard Time (Eucla, UTC+08:45)
	NPT_NEPAL: 5.75 * 60, // Nepal Time (UTC+05:45)

	UTC_MINUS_12: -12 * 60,
	UTC_MINUS_11: -11 * 60,
	UTC_MINUS_10: -10 * 60,
	UTC_MINUS_9: -9 * 60,
	UTC_MINUS_8: -8 * 60,
	UTC_MINUS_7: -7 * 60,
	UTC_MINUS_6: -6 * 60,
	UTC_MINUS_5: -5 * 60,
	UTC_MINUS_4: -4 * 60,
	UTC_MINUS_3: -3 * 60,
	UTC_MINUS_2: -2 * 60,
	UTC_MINUS_1: -1 * 60,
	UTC_PLUS_0: 0,
	UTC_PLUS_1: 1 * 60,
	UTC_PLUS_2: 2 * 60,
	UTC_PLUS_3: 3 * 60,
	UTC_PLUS_3_30: 3.5 * 60,
	UTC_PLUS_4: 4 * 60,
	UTC_PLUS_4_30: 4.5 * 60,
	UTC_PLUS_5: 5 * 60,
	UTC_PLUS_5_30: 5.5 * 60,
	UTC_PLUS_5_45: 5.75 * 60,
	UTC_PLUS_6: 6 * 60,
	UTC_PLUS_6_30: 6.5 * 60,
	UTC_PLUS_7: 7 * 60,
	UTC_PLUS_8: 8 * 60,
	UTC_PLUS_8_45: 8.75 * 60,
	UTC_PLUS_9: 9 * 60,
	UTC_PLUS_9_30: 9.5 * 60,
	UTC_PLUS_10: 10 * 60,
	UTC_PLUS_10_30: 10.5 * 60,
	UTC_PLUS_11: 11 * 60,
	UTC_PLUS_12: 12 * 60,
	UTC_PLUS_12_45: 12.75 * 60,
	UTC_PLUS_13: 13 * 60,
	UTC_PLUS_14: 14 * 60,

	BST_UK: 60, // British Summer Time (UK DST)
	BST_BD: 360, // Bangladesh Standard Time
	IST_IN: 330, // India
	IST_IL: 120, // Israel
	CST_US: -360,
	CST_CN: 480,
} as const;
