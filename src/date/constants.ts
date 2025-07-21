import type { ClockHour, DayPart, UTCOffSet } from './types';

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

export const MONTH_FORMATS = /* @__PURE__ */ Object.freeze([
	'M',
	'MM',
	'mmm',
	'mmmm',
] as const);

export const DATE_FORMATS = /* @__PURE__ */ Object.freeze([
	'DD',
	'D',
	'Do',
] as const);

export const DAY_FORMATS = /* @__PURE__ */ Object.freeze([
	'd',
	'dd',
	'ddd',
] as const);

export const HOUR_FORMATS = /* @__PURE__ */ Object.freeze([
	'H',
	'HH',
	'hh',
	'h',
] as const);

export const MINUTE_FORMATS = /* @__PURE__ */ Object.freeze([
	'mm',
	'm',
] as const);

export const SECOND_FORMATS = /* @__PURE__ */ Object.freeze([
	'ss',
	's',
] as const);

export const ZONE_FORMATS = /* @__PURE__ */ Object.freeze(['ZZ'] as const);

export const MILLISECOND_FORMATS = /* @__PURE__ */ Object.freeze([
	'ms',
	'mss',
] as const);

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

/** List of time-zones with respective time-zone offsets (in number) as array of objects (`{timeZone: offset}`) */
export const TIME_ZONES = /* @__PURE__ */ Object.freeze({
	// UTC -12:00 to -01:00 (Mostly Pacific Islands, Americas)
	/** International Date Line West (Baker Island, Howland Island) */
	IDLW: -12 * 60,
	/** Baker Island Time (Uninhabited) */
	BIT: -12 * 60,
	/** Samoa Standard Time (American Samoa, Midway) */
	SST: -11 * 60,
	/** Niue Time */
	NUT: -11 * 60,
	/** Hawaii-Aleutian Standard Time (USA-Hawaii) */
	HST: -10 * 60,
	/** Cook Island Time */
	CKT: -10 * 60,
	/** Tahiti Time (French Polynesia) */
	TAHT: -10 * 60,
	/** Alaska Standard Time (USA-Alaska) */
	AKST: -9 * 60,
	/** Gambier Time (French Polynesia) */
	GAMT: -9 * 60,
	/** Paraguay Time (Summer UTC-3) */
	PYT: -9 * 60,
	/** Marquesas Islands Time (UTC−09:30) */
	MART: -9.5 * 60,
	/** Hawaii-Aleutian Daylight Time (USA-Hawaii, DST) */
	HDT: -9 * 60,
	/** Pacific Standard Time (USA-West Coast, Canada) */
	PST: -8 * 60,
	/** Alaska Daylight Time (USA-Alaska, DST) */
	AKDT: -8 * 60,
	/** Mountain Standard Time (USA/Canada Rockies) */
	MST: -7 * 60,
	/** Mountain Daylight Time (USA/Canada Rockies, DST) */
	MDT: -6 * 60,
	/** Pacific Daylight Time (USA-West Coast, Canada, DST) */
	PDT: -7 * 60,
	/** Central Standard Time (USA/Canada Central) */
	CST: -6 * 60,
	/** Central Daylight Time (USA/Canada Central, DST) */
	CDT: -5 * 60,
	/** Easter Island Time (Chile) */
	EAST: -6 * 60,
	/** Eastern Standard Time (USA/Canada East Coast) */
	EST: -5 * 60,
	/** Eastern Daylight Time (USA/Canada East Coast, DST) */
	EDT: -4 * 60,
	/** Peru Time */
	PET: -5 * 60,
	/** Colombia Time */
	COT: -5 * 60,
	/** Acre Time (Brazil-West) */
	ACT: -5 * 60,
	/** Atlantic Standard Time (Canada-Maritime, Caribbean) */
	AST: -4 * 60,
	/** Bolivia Time */
	BOT: -4 * 60,
	/** Venezuelan Standard Time */
	VET: -4 * 60,
	/** Guyana Time */
	GYT: -4 * 60,
	/** Chile Standard Time */
	CLT: -4 * 60,
	/** Atlantic Daylight Time (Canada-Maritime, DST) */
	ADT: -3 * 60,
	/** Brasília Time (Brazil-East) */
	BRT: -3 * 60,
	/** Argentina Time */
	ART: -3 * 60,
	/** Uruguay Time */
	UYT: -3 * 60,
	/** Falkland Islands Summer Time */
	FKST: -3 * 60,
	/** Saint Pierre and Miquelon Standard Time */
	PMST: -3 * 60,
	/** Chile Summer Time (DST) */
	CLST: -3 * 60,
	/** French Guiana Time */
	GFT: -3 * 60,
	/** Newfoundland Standard Time */
	NST: -3.5 * 60,
	/** Newfoundland Daylight Time (DST) */
	NDT: -2.5 * 60,
	/** Fernando de Noronha Time (Brazil) */
	FNT: -2 * 60,
	/** South Georgia Time */
	'GST-South Georgia': -2 * 60,
	/** Brazil Summer Time (DST) */
	BRST: -2 * 60,
	/** Azores Time (Portugal) */
	AZOT: -1 * 60,
	/** Cape Verde Time */
	CVT: -1 * 60,

	// UTC ±00:00 (Europe, Africa, Greenland)
	/** Greenwich Mean Time (UK, Iceland, West Africa) */
	GMT: 0,
	/** Coordinated Universal Time */
	UTC: 0,
	/** Western European Time (Portugal, Morocco) */
	WET: 0,
	/** Eastern Greenland Summer Time */
	EGST: 0,
	/** Central European Time (France, Germany, Italy) */
	CET: 1 * 60,
	/** West Africa Time (Nigeria, Algeria) */
	WAT: 1 * 60,
	/** Middle European Time (Historical) */
	MET: 1 * 60,
	/** Western European Summer Time (Summer UTC+1) */
	WEST: 1 * 60,
	/** British Summer Time (UK DST) */
	'BST-UK': 1 * 60,
	/** Central European Summer Time (DST) */
	CEST: 2 * 60,
	/** Middle European Summer Time (DST) */
	MEST: 2 * 60,

	// UTC +02:00 to +05:00 (Europe, Africa, Middle East, Russia)
	/** Eastern European Time (Greece, Finland, Egypt) */
	EET: 2 * 60,
	/** Central Africa Time (Sudan, South Africa) */
	CAT: 2 * 60,
	/** South Africa Standard Time */
	SAST: 2 * 60,
	/** Israel Standard Time */
	'IST-ISRAEL': 2 * 60,
	/** Israel Daylight Time (DST) */
	'IST-IL': 2 * 60,
	/** Eastern European Summer Time */
	EEST: 3 * 60,
	/** Moscow Time (Russia-West) */
	MSK: 3 * 60,
	/** Syowa Time (Antarctica) */
	SYOT: 3 * 60,
	/** Arabia Standard Time (Iraq, Saudi Arabia) */
	'AST-ARAB': 3 * 60,
	/** East Africa Time (Kenya, Ethiopia) */
	EAT: 3 * 60,
	/** Iran Standard Time */
	IRST: 3.5 * 60,
	/** Iran Daylight Time (DST) */
	IRDT: 4.5 * 60,
	/** Armenia Time */
	AMT: 4 * 60,
	/** Georgia Time */
	GET: 4 * 60,
	/** Azerbaijan Time */
	AZT: 4 * 60,
	/** Mauritius Time */
	MUT: 4 * 60,
	/** Seychelles Time */
	SCT: 4 * 60,
	/** Gulf Standard Time (UAE, Oman) */
	'GST-GULF': 4 * 60,
	/** Samara Time (Russia) */
	SAMT: 4 * 60,
	/** Pakistan Standard Time */
	PKT: 5 * 60,
	/** Tajikistan Time */
	TJT: 5 * 60,
	/** Turkmenistan Time */
	TMT: 5 * 60,
	/** Uzbekistan Time */
	UZT: 5 * 60,
	/** Aqtobe Time (Kazakhstan) */
	AQTT: 5 * 60,
	/** Yekaterinburg Time (Russia) */
	YEKT: 5 * 60,
	/** Yekaterinburg Summer Time (Russia, DST) */
	YEKST: 5 * 60,
	/** India Standard Time */
	'IST-IN': 5.5 * 60,

	// UTC +05:30 to +09:00 (South Asia, Russia, Southeast Asia)
	/** Nepal Time (UTC+05:45) */
	NPT: 5.75 * 60,
	/** Nepal Time (alternative) */
	'NPT-NEPAL': 5.75 * 60,
	/** Bangladesh Time */
	BDT: 6 * 60,
	/** Bangladesh Standard Time */
	'BST-BD': 6 * 60,
	/** Bhutan Time */
	BTT: 6 * 60,
	/** Almaty Time (Kazakhstan) */
	ALMT: 6 * 60,
	/** Omsk Time (Russia) */
	OMST: 6 * 60,
	/** Myanmar Time */
	MMT: 6.5 * 60,
	/** Cocos Islands Time */
	CCT: 6.5 * 60,
	/** Indochina Time (Thailand, Vietnam) */
	ICT: 7 * 60,
	/** Thailand Standard Time */
	THA: 7 * 60,
	/** Krasnoyarsk Time (Russia) */
	KRAT: 7 * 60,
	/** Western Indonesia Time (Jakarta) */
	WIB: 7 * 60,
	/** Hong Kong Time */
	HKT: 8 * 60,
	/** China Standard Time */
	'CST-CHINA': 8 * 60,
	/** Singapore Time */
	SGT: 8 * 60,
	/** Malaysia Time */
	MYT: 8 * 60,
	/** Philippines Time */
	PHT: 8 * 60,
	/** Irkutsk Time (Russia) */
	IRKT: 8 * 60,
	/** Irkutsk Daylight Time (Russia, DST) */
	'IRKT-DST': 9 * 60,
	/** Irkutsk Time (Russia, alternative) */
	'IRKT-RU': 8 * 60,
	/** Australian Western Standard Time */
	AWST: 8 * 60,
	/** Australian Central Western Standard Time (Eucla, UTC+08:45) */
	ACWST: 8.75 * 60,
	/** Western Indonesia Time (Bali) */
	WITA: 8 * 60,
	/** Japan Standard Time */
	JST: 9 * 60,
	/** Korea Standard Time */
	KST: 9 * 60,
	/** Palau Time */
	PWT: 9 * 60,
	/** Yakutsk Time (Russia) */
	YAKT: 9 * 60,
	/** Eastern Indonesia Time (Jayapura) */
	WIT: 9 * 60,

	// UTC +09:30 to +14:00 (Australia, Pacific Islands, Russia)
	/** Australian Central Standard Time */
	ACST: 9.5 * 60,
	/** Australian Central Daylight Time (DST) */
	ACDT: 10.5 * 60,
	/** Australian Eastern Standard Time */
	AEST: 10 * 60,
	/** Australian Eastern Daylight Time (DST) */
	AEDT: 11 * 60,
	/** Vladivostok Time (Russia) */
	VLAT: 10 * 60,
	/** Lord Howe Standard Time (UTC+10:30) */
	LHST: 10.5 * 60,
	/** Lord Howe Daylight Time (DST +30min) */
	LHDT: 11 * 60,
	/** Sakhalin Time (Russia) */
	SAKT: 11 * 60,
	/** Magadan Time (Russia) */
	MAGT: 11 * 60,
	/** Norfolk Time (Australia) */
	NFT: 11 * 60,
	/** Chamorro Standard Time (Guam, Northern Mariana Islands) */
	CHST: 10 * 60,
	/** New Zealand Standard Time */
	NZST: 12 * 60,
	/** New Zealand Daylight Time (DST) */
	NZDT: 13 * 60,
	/** Fiji Time */
	FJT: 12 * 60,
	/** Tuvalu Time */
	TVT: 12 * 60,
	/** Chatham Standard Time (New Zealand) */
	CHAST: 12.75 * 60,
	/** Chatham Daylight Time (New Zealand, DST) */
	CHADT: 13.75 * 60,
	/** Chatham Standard Time (alternative) */
	'CHAST-NZ': 12.75 * 60,
	/** Phoenix Island Time (Kiribati) */
	PHOT: 13 * 60,
	/** Tokelau Time */
	TKT: 13 * 60,
	/** Tonga Time */
	TOT: 13 * 60,
	/** New Zealand Antarctica Time */
	NZAT: 13 * 60,
	/** Line Islands Time (Kiribati) */
	LINT: 14 * 60,

	// Antarctica (used in research stations)
	/** Rothera Time (Antarctica) */
	ROTT: -3 * 60,
	/** Mawson Time (Antarctica) */
	MAWT: 5 * 60,
	/** Petropavlovsk-Kamchatsky Time (Russia) */
	PETT: 12 * 60,
} as const);

/** List of time-zone labels against their corresponding utc values as array of objects */
export const TIME_ZONE_LABELS = /* @__PURE__ */ Object.freeze({
	'UTC-12:00': 'Baker Island Time', // and Howland Island
	// 'UTC-11:30': 'Niue Time',
	// 'UTC-11:00': 'Niue Time',
	'UTC-11:00': 'Samoa Standard Time',
	// 'UTC-10:30': 'Marquesas Time',
	'UTC-10:00': 'Hawaii-Aleutian Standard Time',
	'UTC-09:30': 'Marquesas Islands Time',
	'UTC-09:00': 'Alaskan Standard Time',
	// 'UTC-08:30': 'Pitcairn Standard Time',
	'UTC-08:00': 'Pacific Standard Time',
	'UTC-07:30': 'Mountain Standard Time (Unofficial)',
	'UTC-07:00': 'Mountain Standard Time',
	'UTC-06:30': 'Central America Time (Unofficial)',
	'UTC-06:00': 'Central Standard Time',
	// 'UTC-05:30': 'Venezuelan Standard Time (Historical)',
	'UTC-05:00': 'Eastern Standard Time',
	// 'UTC-04:30': 'Venezuelan Standard Time',
	'UTC-04:00': 'Atlantic Standard Time',
	'UTC-03:30': 'Newfoundland Standard Time',
	'UTC-03:00': 'SA Eastern Standard Time',
	'UTC-02:30': 'Mid-Atlantic Time (Unofficial)',
	'UTC-02:00': 'Mid-Atlantic Standard Time',
	'UTC-01:30': 'Azores Time (Unofficial)',
	'UTC-01:00': 'Cape Verde Time',
	'UTC+00:00': 'Greenwich Mean Time',
	'UTC+00:30': 'British Summer Time (Historical)',
	'UTC+01:00': 'Central European Standard Time',
	'UTC+01:30': 'Central Africa Time (Unofficial)',
	'UTC+02:00': 'Eastern European Standard Time',
	'UTC+02:30': 'Israel Standard Time (Historical)',
	'UTC+03:00': 'Arab Standard Time',
	'UTC+03:30': 'Iran Standard Time',
	'UTC+04:00': 'Gulf Standard Time',
	'UTC+04:30': 'Afghanistan Time',
	'UTC+05:00': 'Pakistan Standard Time',
	'UTC+05:30': 'India Standard Time',
	'UTC+05:45': 'Nepal Standard Time',
	'UTC+06:00': 'Bangladesh Standard Time',
	'UTC+06:30': 'Myanmar Standard Time',
	'UTC+07:00': 'Indochina Standard Time',
	'UTC+07:30': 'Western Indonesia Time (Unofficial)',
	'UTC+08:00': 'China Standard Time',
	'UTC+08:30': 'North Korea Standard Time',
	'UTC+08:45': 'South-Western Australia Standard Time',
	'UTC+09:00': 'Japan Standard Time',
	'UTC+09:30': 'Central Australia Standard Time',
	'UTC+10:00': 'Eastern Australia Standard Time',
	'UTC+10:30': 'Lord Howe Standard Time',
	'UTC+11:00': 'Central Pacific Standard Time',
	// 'UTC+11:30': 'Norfolk Island Time',
	'UTC+12:00': 'New Zealand Standard Time',
	'UTC+12:45': 'Chatham Islands Time',
	'UTC+13:00': 'Phoenix Island Time',
	'UTC+13:45': 'Tokelau Time (Unofficial)',
	'UTC+14:00': 'Line Islands Time',
} as Record<UTCOffSet, string>);

/** Ranges for day parts. */
export const DEFAULT_RANGES = /* @__PURE__ */ Object.freeze({
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

/** * @internal Symbol for accessing Chronos internals (plugin author use only) */
export const INTERNALS = Symbol('Internals');
