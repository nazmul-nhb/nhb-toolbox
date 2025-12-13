export const ONES = /* @__PURE__ */ Object.freeze([
	'',
	'one',
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight',
	'nine',
] as const);

export const TEENS = /* @__PURE__ */ Object.freeze([
	'ten',
	'eleven',
	'twelve',
	'thirteen',
	'fourteen',
	'fifteen',
	'sixteen',
	'seventeen',
	'eighteen',
	'nineteen',
] as const);

export const TENS = /* @__PURE__ */ Object.freeze([
	'',
	'ten',
	'twenty',
	'thirty',
	'forty',
	'fifty',
	'sixty',
	'seventy',
	'eighty',
	'ninety',
] as const);

export const THOUSANDS = /* @__PURE__ */ Object.freeze([
	'',
	'thousand',
	'million',
	'billion',
	'trillion',
	'quadrillion',
	'quintillion',
	// ! Need to modify later, supports up to 10 sextillion! It's a bug (limitation in JS)!
	// 'sextillion',
] as const);

/** Ordinal numbers (0-12) in words against the corresponding cardinal variant */
export const ORDINAL_UNDER_TEEN = /* @__PURE__ */ Object.freeze({
	zero: 'zeroth',
	one: 'first',
	two: 'second',
	three: 'third',
	four: 'fourth',
	five: 'fifth',
	six: 'sixth',
	seven: 'seventh',
	eight: 'eighth',
	nine: 'ninth',
	ten: 'tenth',
	eleven: 'eleventh',
	twelve: 'twelfth',
} as Record<string, string>);

/** Ordinals that don't cleanly map by suffix alone */
export const ORDINAL_TO_CARDINAL = /* @__PURE__ */ Object.freeze({
	first: 'one',
	second: 'two',
	third: 'three',
	fourth: 'four',
	fifth: 'five',
	sixth: 'six',
	seventh: 'seven',
	eighth: 'eight',
	ninth: 'nine',
	tenth: 'ten',
	eleventh: 'eleven',
	twelfth: 'twelve',
	thirteenth: 'thirteen',
	fourteenth: 'fourteen',
	fifteenth: 'fifteen',
	sixteenth: 'sixteen',
	seventeenth: 'seventeen',
	eighteenth: 'eighteen',
	nineteenth: 'nineteen',
	twentieth: 'twenty',
	thirtieth: 'thirty',
	fortieth: 'forty',
	fiftieth: 'fifty',
	sixtieth: 'sixty',
	seventieth: 'seventy',
	eightieth: 'eighty',
	ninetieth: 'ninety',
} as Record<string, string>);

/** List of ISO 4217 currency codes */
export const CURRENCY_CODES = /* @__PURE__ */ Object.freeze([
	'AED',
	'AFN',
	'ALL',
	'AMD',
	'ANG',
	'AOA',
	'ARS',
	'AUD',
	'AWG',
	'AZN',
	'BAM',
	'BBD',
	'BDT',
	'BGN',
	'BHD',
	'BIF',
	'BMD',
	'BND',
	'BOB',
	'BRL',
	'BSD',
	'BTN',
	'BWP',
	'BYN',
	'BZD',
	'CAD',
	'CDF',
	'CHF',
	'CLP',
	'CNY',
	'COP',
	'CRC',
	'CUP',
	'CVE',
	'CZK',
	'DJF',
	'DKK',
	'DOP',
	'DZD',
	'EGP',
	'ERN',
	'ETB',
	'EUR',
	'FJD',
	'FKP',
	'FOK',
	'GBP',
	'GEL',
	'GGP',
	'GHS',
	'GIP',
	'GMD',
	'GNF',
	'GTQ',
	'GYD',
	'HKD',
	'HNL',
	'HRK',
	'HTG',
	'HUF',
	'IDR',
	'ILS',
	'IMP',
	'INR',
	'IQD',
	'IRR',
	'ISK',
	'JEP',
	'JMD',
	'JOD',
	'JPY',
	'KES',
	'KGS',
	'KHR',
	'KID',
	'KMF',
	'KRW',
	'KWD',
	'KYD',
	'KZT',
	'LAK',
	'LBP',
	'LKR',
	'LRD',
	'LSL',
	'LYD',
	'MAD',
	'MDL',
	'MGA',
	'MKD',
	'MMK',
	'MNT',
	'MOP',
	'MRU',
	'MUR',
	'MVR',
	'MWK',
	'MXN',
	'MYR',
	'MZN',
	'NAD',
	'NGN',
	'NIO',
	'NOK',
	'NPR',
	'NZD',
	'OMR',
	'PAB',
	'PEN',
	'PGK',
	'PHP',
	'PKR',
	'PLN',
	'PYG',
	'QAR',
	'RON',
	'RSD',
	'RUB',
	'RWF',
	'SAR',
	'SBD',
	'SCR',
	'SDG',
	'SEK',
	'SGD',
	'SHP',
	'SLE',
	'SOS',
	'SRD',
	'SSP',
	'STN',
	'SYP',
	'SZL',
	'THB',
	'TJS',
	'TMT',
	'TND',
	'TOP',
	'TRY',
	'TTD',
	'TVD',
	'TWD',
	'TZS',
	'UAH',
	'UGX',
	'USD',
	'UYU',
	'UZS',
	'VES',
	'VND',
	'VUV',
	'WST',
	'XAF',
	'XCD',
	'XOF',
	'XPF',
	'YER',
	'ZAR',
	'ZMW',
	'ZWL',
] as const);

/** List of all supported BCP 47 locales */
export const LOCALE_CODES = /* @__PURE__ */ Object.freeze([
	'af-ZA',
	'am-ET',
	'ar-AE',
	'ar-BH',
	'ar-DZ',
	'ar-EG',
	'ar-IQ',
	'ar-JO',
	'ar-KW',
	'ar-LB',
	'ar-LY',
	'ar-MA',
	'ar-OM',
	'ar-QA',
	'ar-SA',
	'ar-SD',
	'ar-SY',
	'ar-TN',
	'ar-YE',
	'az-AZ',
	'be-BY',
	'bg-BG',
	'bn-BD',
	'bn-IN',
	'bs-BA',
	'ca-ES',
	'cs-CZ',
	'cy-GB',
	'da-DK',
	'de-AT',
	'de-CH',
	'de-DE',
	'el-GR',
	'en-AU',
	'en-CA',
	'en-GB',
	'en-IE',
	'en-IN',
	'en-NZ',
	'en-PH',
	'en-SG',
	'en-US',
	'en-ZA',
	'es-AR',
	'es-BO',
	'es-CL',
	'es-CO',
	'es-CR',
	'es-DO',
	'es-EC',
	'es-ES',
	'es-GT',
	'es-HN',
	'es-MX',
	'es-NI',
	'es-PA',
	'es-PE',
	'es-PR',
	'es-PY',
	'es-SV',
	'es-US',
	'es-UY',
	'es-VE',
	'et-EE',
	'eu-ES',
	'fa-IR',
	'fi-FI',
	'fil-PH',
	'fr-BE',
	'fr-CA',
	'fr-CH',
	'fr-FR',
	'ga-IE',
	'gl-ES',
	'gu-IN',
	'he-IL',
	'hi-IN',
	'hr-HR',
	'hu-HU',
	'hy-AM',
	'id-ID',
	'is-IS',
	'it-CH',
	'it-IT',
	'ja-JP',
	'ka-GE',
	'kk-KZ',
	'km-KH',
	'kn-IN',
	'ko-KR',
	'ky-KG',
	'lt-LT',
	'lv-LV',
	'mk-MK',
	'ml-IN',
	'mn-MN',
	'mr-IN',
	'ms-MY',
	'mt-MT',
	'nb-NO',
	'ne-NP',
	'nl-BE',
	'nl-NL',
	'pl-PL',
	'pt-BR',
	'pt-PT',
	'ro-RO',
	'ru-RU',
	'sk-SK',
	'sl-SI',
	'sq-AL',
	'sr-Latn',
	'sv-SE',
	'sw-KE',
	'ta-IN',
	'te-IN',
	'th-TH',
	'tr-TR',
	'uk-UA',
	'ur-PK',
	'uz-UZ',
	'vi-VN',
	'zh-CN',
	'zh-HK',
	'zh-TW',
] as const);

/** Mapping of CurrencyCodes to LocaleCodes */
export const CURRENCY_LOCALES = /* @__PURE__ */ Object.freeze({
	AED: 'ar-AE', // United Arab Emirates Dirham
	AFN: 'fa-IR', // Afghan Afghani
	ALL: 'sq-AL', // Albanian Lek
	AMD: 'hy-AM', // Armenian Dram
	ANG: 'nl-NL', // Netherlands Antillean Guilder
	AOA: 'pt-AO', // Angolan Kwanza
	ARS: 'es-AR', // Argentine Peso
	AUD: 'en-AU', // Australian Dollar
	AWG: 'nl-AW', // Aruban Florin
	AZN: 'az-AZ', // Azerbaijani Manat
	BAM: 'bs-BA', // Bosnia and Herzegovina Convertible Mark
	BBD: 'en-BB', // Barbadian Dollar
	BDT: 'bn-BD', // Bangladeshi Taka
	BGN: 'bg-BG', // Bulgarian Lev
	BHD: 'ar-BH', // Bahraini Dinar
	BIF: 'fr-BI', // Burundian Franc
	BMD: 'en-BM', // Bermudian Dollar
	BND: 'ms-BN', // Brunei Dollar
	BOB: 'es-BO', // Bolivian Boliviano
	BRL: 'pt-BR', // Brazilian Real
	BSD: 'en-BS', // Bahamian Dollar
	BTN: 'dz-BT', // Bhutanese Ngultrum
	BWP: 'en-BW', // Botswanan Pula
	BYN: 'be-BY', // Belarusian Ruble
	BZD: 'es-BZ', // Belize Dollar
	CAD: 'fr-CA', // Canadian Dollar
	CDF: 'fr-CD', // Congolese Franc
	CHF: 'fr-CH', // Swiss Franc
	CLP: 'es-CL', // Chilean Peso
	CNY: 'zh-CN', // Chinese Yuan
	COP: 'es-CO', // Colombian Peso
	CRC: 'es-CR', // Costa Rican Colón
	CUP: 'es-CU', // Cuban Peso
	CVE: 'pt-CV', // Cape Verdean Escudo
	CZK: 'cs-CZ', // Czech Koruna
	DJF: 'fr-DJ', // Djiboutian Franc
	DKK: 'da-DK', // Danish Krone
	DOP: 'es-DO', // Dominican Peso
	DZD: 'ar-DZ', // Algerian Dinar
	EGP: 'ar-EG', // Egyptian Pound
	ERN: 'ti-ER', // Eritrean Nakfa
	ETB: 'am-ET', // Ethiopian Birr
	EUR: 'de-DE', // Euro
	FJD: 'en-FJ', // Fijian Dollar
	FKP: 'en-FK', // Falkland Islands Pound
	FOK: 'fo-FO', // Faroese Króna
	GBP: 'en-GB', // British Pound Sterling
	GEL: 'ka-GE', // Georgian Lari
	GGP: 'en-GG', // Guernsey Pound
	GHS: 'ak-GH', // Ghanaian Cedi
	GIP: 'en-GI', // Gibraltar Pound
	GMD: 'en-GM', // Gambian Dalasi
	GNF: 'fr-GN', // Guinean Franc
	GTQ: 'es-GT', // Guatemalan Quetzal
	GYD: 'en-GY', // Guyanaese Dollar
	HKD: 'zh-HK', // Hong Kong Dollar
	HNL: 'es-HN', // Honduran Lempira
	HRK: 'hr-HR', // Croatian Kuna
	HTG: 'ht-HT', // Haitian Gourde
	HUF: 'hu-HU', // Hungarian Forint
	IDR: 'id-ID', // Indonesian Rupiah
	ILS: 'he-IL', // Israeli New Shekel
	IMP: 'en-IM', // Isle of Man Pound
	INR: 'hi-IN', // Indian Rupee
	IQD: 'ar-IQ', // Iraqi Dinar
	IRR: 'fa-IR', // Iranian Rial
	ISK: 'is-IS', // Icelandic Króna
	JEP: 'en-JE', // Jersey Pound
	JMD: 'en-JM', // Jamaican Dollar
	JOD: 'ar-JO', // Jordanian Dinar
	JPY: 'ja-JP', // Japanese Yen
	KES: 'sw-KE', // Kenyan Shilling
	KGS: 'ky-KG', // Kyrgyzstani Som
	KHR: 'km-KH', // Cambodian Riel
	KID: 'en-KI', // Kiribati Dollar
	KMF: 'fr-KM', // Comorian Franc
	KRW: 'ko-KR', // South Korean Won
	KWD: 'ar-KW', // Kuwaiti Dinar
	KYD: 'en-KY', // Cayman Islands Dollar
	KZT: 'kk-KZ', // Kazakhstani Tenge
	LAK: 'lo-LA', // Laotian Kip
	LBP: 'ar-LB', // Lebanese Pound
	LKR: 'si-LK', // Sri Lankan Rupee
	LRD: 'en-LR', // Liberian Dollar
	LSL: 'st-LS', // Lesotho Loti
	LYD: 'ar-LY', // Libyan Dinar
	MAD: 'ar-MA', // Moroccan Dirham
	MDL: 'ro-RO', // Moldovan Leu
	MGA: 'mg-MG', // Malagasy Ariary
	MKD: 'mk-MK', // Macedonian Denar
	MMK: 'my-MM', // Burmese Kyat
	MNT: 'mn-MN', // Mongolian Tugrik
	MOP: 'pt-MO', // Macanese Pataca
	MRU: 'ar-MA', // Mauritanian Ouguiya
	MUR: 'en-MU', // Mauritian Rupee
	MVR: 'dv-MV', // Maldivian Rufiyaa
	MWK: 'ny-MW', // Malawian Kwacha
	MXN: 'es-MX', // Mexican Peso
	MYR: 'ms-MY', // Malaysian Ringgit
	MZN: 'pt-MZ', // Mozambican Metical
	NAD: 'en-NA', // Namibian Dollar
	NGN: 'en-NG', // Nigerian Naira
	NIO: 'es-NI', // Nicaraguan Córdoba
	NOK: 'no-NO', // Norwegian Krone
	NPR: 'ne-NP', // Nepalese Rupee
	NZD: 'en-NZ', // New Zealand Dollar
	OMR: 'ar-OM', // Omani Rial
	PAB: 'es-PA', // Panamanian Balboa
	PEN: 'es-PE', // Peruvian Nuevo Sol
	PGK: 'en-PG', // Papua New Guinean Kina
	PHP: 'fil-PH', // Philippine Peso
	PKR: 'ur-PK', // Pakistani Rupee
	PLN: 'pl-PL', // Polish Zloty
	PYG: 'es-PY', // Paraguayan Guarani
	QAR: 'ar-QA', // Qatari Rial
	RON: 'ro-RO', // Romanian Leu
	RSD: 'sr-RS', // Serbian Dinar
	RUB: 'ru-RU', // Russian Ruble
	RWF: 'rw-RW', // Rwandan Franc
	SAR: 'ar-SA', // Saudi Riyal
	SBD: 'en-SB', // Solomon Islands Dollar
	SCR: 'en-SC', // Seychellois Rupee
	SDG: 'ar-SD', // Sudanese Pound
	SEK: 'sv-SE', // Swedish Krona
	SGD: 'en-SG', // Singapore Dollar
	SHP: 'en-SH', // Saint Helena Pound
	SLE: 'en-SL', // Sierra Leonean Leone
	SOS: 'so-SO', // Somali Shilling
	SRD: 'nl-SR', // Surinamese Dollar
	SSP: 'en-SS', // South Sudanese Pound
	STN: 'st-ST', // São Tomé and Príncipe Dobra
	SYP: 'ar-SY', // Syrian Pound
	SZL: 'en-SZ', // Swazi Lilangeni
	THB: 'th-TH', // Thai Baht
	TJS: 'tg-TJ', // Tajikistani Somoni
	TMT: 'tk-TM', // Turkmenistan Manat
	TND: 'ar-TN', // Tunisian Dinar
	TOP: 'to-TO', // Tongan Paʻanga
	TRY: 'tr-TR', // Turkish Lira
	TTD: 'en-TT', // Trinidad and Tobago Dollar
	TVD: 'en-TV', // Tuvaluan Dollar
	TWD: 'zh-TW', // New Taiwan Dollar
	TZS: 'sw-TZ', // Tanzanian Shilling
	UAH: 'uk-UA', // Ukrainian Hryvnia
	UGX: 'sw-UG', // Ugandan Shilling
	USD: 'en-US', // United States Dollar
	UYU: 'es-UY', // Uruguayan Peso
	UZS: 'uz-UZ', // Uzbekistani Som
	VES: 've-VE', // Venezuelan Bolívar
	VND: 'vi-VN', // Vietnamese Dong
	VUV: 'en-VU', // Vanuatu Vatu
	WST: 'en-WS', // Samoan Tala
	XAF: 'fr-XAF', // Central African CFA Franc
	XCD: 'en-XCD', // East Caribbean Dollar
	XOF: 'fr-XOF', // West African CFA Franc
	XPF: 'fr-XPF', // CFP Franc
	YER: 'ar-YE', // Yemeni Rial
	ZAR: 'en-ZA', // South African Rand
	ZMW: 'en-ZM', // Zambian Kwacha
	ZWL: 'en-ZW', // Zimbabwean Dollar
} as const);

/** * Fiat currencies supported by Frankfurter API */
export const FRANKFURTER_CURRENCIES = /* @__PURE__ */ Object.freeze([
	'AUD',
	'BGN',
	'BRL',
	'CAD',
	'CHF',
	'CNY',
	'CZK',
	'DKK',
	'EUR',
	'GBP',
	'HKD',
	'HUF',
	'IDR',
	'ILS',
	'INR',
	'ISK',
	'JPY',
	'KRW',
	'MXN',
	'MYR',
	'NOK',
	'NZD',
	'PHP',
	'PLN',
	'RON',
	'SEK',
	'SGD',
	'THB',
	'TRY',
	'USD',
	'ZAR',
] as const);

/** * Unit names and their full readable labels. */
export const UNITS = /* @__PURE__ */ Object.freeze({
	// Length
	m: 'Meter',
	km: 'Kilometer',
	mi: 'Mile',
	ft: 'Foot',

	// Mass / Weight
	kg: 'Kilogram',
	lbs: 'Pound',
	g: 'Gram',
	oz: 'Ounce',

	// Temperature
	C: 'Celsius',
	F: 'Fahrenheit',
	K: 'Kelvin',

	// Volume
	l: 'Liter',
	gal: 'Gallon',

	// Area
	sqm: 'Square Meter',
	sqft: 'Square Foot',

	// Speed
	kmph: 'Kilometer per Hour',
	mph: 'Miles per Hour',

	// Time
	h: 'Hour',
	min: 'Minute',
	sec: 'Second',
	d: 'Day',

	// Digital Storage
	kb: 'Kilobyte',
	mb: 'Megabyte',
	gb: 'Gigabyte',

	// Energy
	j: 'Joule',
	cal: 'Calorie',

	// Pressure
	atm: 'Atmosphere',
	pa: 'Pascal',

	// Frequency
	hz: 'Hertz',
	khz: 'Kilohertz',
} as const);

/** * Scientific SI Unit prefix multipliers. */
export const PREFIX_MULTIPLIERS = /* @__PURE__ */ Object.freeze({
	y: 1e-24,
	z: 1e-21,
	a: 1e-18,
	f: 1e-15,
	p: 1e-12,
	n: 1e-9,
	μ: 1e-6,
	u: 1e-6,
	m: 1e-3,
	c: 1e-2,
	d: 1e-1,
	da: 1e1,
	h: 1e2,
	k: 1e3,
	M: 1e6,
	G: 1e9,
	T: 1e12,
	P: 1e15,
	E: 1e18,
	Z: 1e21,
	Y: 1e24,
	'': 1, // base unit, like meter, gram, byte etc.
} as const);
