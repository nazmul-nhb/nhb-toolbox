import type {
	DATE_FORMATS,
	DAY_FORMATS,
	HOUR_FORMATS,
	MILLISECOND_FORMATS,
	MINUTE_FORMATS,
	MONTH_FORMATS,
	SECOND_FORMATS,
	TIME_FORMATS,
	TIME_ZONES,
	YEAR_FORMATS,
} from './constants';

/** - Minute in numeric string from `00` to `23` */
export type Hours =
	| '00'
	| '01'
	| '02'
	| '03'
	| '04'
	| '05'
	| '06'
	| '07'
	| '08'
	| '09'
	| '10'
	| '11'
	| '12'
	| '13'
	| '14'
	| '15'
	| '16'
	| '17'
	| '18'
	| '19'
	| '20'
	| '21'
	| '22'
	| '23';

/** - Minute in numeric string from `00` to `59` */
export type Minutes =
	| '00'
	| '01'
	| '02'
	| '03'
	| '04'
	| '05'
	| '06'
	| '07'
	| '08'
	| '09'
	| '10'
	| '11'
	| '12'
	| '13'
	| '14'
	| '15'
	| '16'
	| '17'
	| '18'
	| '19'
	| '20'
	| '21'
	| '22'
	| '23'
	| '24'
	| '25'
	| '26'
	| '27'
	| '28'
	| '29'
	| '30'
	| '31'
	| '32'
	| '33'
	| '34'
	| '35'
	| '36'
	| '37'
	| '38'
	| '39'
	| '40'
	| '41'
	| '42'
	| '43'
	| '44'
	| '45'
	| '46'
	| '47'
	| '48'
	| '49'
	| '50'
	| '51'
	| '52'
	| '53'
	| '54'
	| '55'
	| '56'
	| '57'
	| '58'
	| '59';

/** - Time in "HH:MM" format. */
export type Time = `${Hours}:${Minutes}`;

/** - Configuration options for greeting. */
export interface GreetingConfigs {
	/** Time when the morning period ends (HH:MM format). Defaults to `11:59` */
	morningEnds?: Time;

	/** Time when the noon period ends (HH:MM format). Defaults to `12:59` */
	noonEnds?: Time;

	/** Time when the afternoon period ends (HH:MM format). Defaults to `17:59` */
	afternoonEnds?: Time;

	/** Time when the evening period ends (HH:MM format). Defaults to `23:59` */
	eveningEnds?: Time;

	/** Time when the midnight period ends (HH:MM format). Defaults to `02:59` */
	midnightEnds?: Time;

	/** Current time in "HH:MM" format for some weird reason. Defaults to current time `new Date()` */
	currentTime?: Time;

	/** Optional string to append after each message */
	appendToMsg?: string;

	/** Optional string to prepend before each message */
	prependToMsg?: string;

	/** Custom greeting message for the morning period. */
	morningMessage?: string;

	/** Custom greeting message for the noon period. */
	noonMessage?: string;

	/** Custom greeting message for the afternoon period. */
	afternoonMessage?: string;

	/** Custom greeting message for the evening period. */
	eveningMessage?: string;

	/** Custom greeting message for the midnight period. */
	midnightMessage?: string;

	/** Default greeting message if no period matches. */
	defaultMessage?: string;
}

export type TimeUnit =
	| 'year'
	| 'month'
	| 'day'
	| 'hour'
	| 'minute'
	| 'second'
	| 'millisecond';

export type Year = (typeof YEAR_FORMATS)[number];
export type Month = (typeof MONTH_FORMATS)[number];
export type Day = (typeof DAY_FORMATS)[number];
export type Date = (typeof DATE_FORMATS)[number];
export type Hour = (typeof HOUR_FORMATS)[number];
export type Minute = (typeof MINUTE_FORMATS)[number];
export type Second = (typeof SECOND_FORMATS)[number];
export type Millisecond = (typeof MILLISECOND_FORMATS)[number];
export type TimeFormats = (typeof TIME_FORMATS)[number];

export type ChronosFormat =
	| Year
	| Month
	| Day
	| Date
	| Hour
	| Minute
	| Second
	| Millisecond
	| TimeFormats;

// export type DateFormat =
// 	`${Day}, ${Month} ${Date}, ${Year} ${Hour}:${Minute}:${Second}:${Millisecond} ${TimeFormats}`;

export type TimeZone = keyof typeof TIME_ZONES;

export type PositiveUTCHour =
	| '+00'
	| '+01'
	| '+02'
	| '+03'
	| '+04'
	| '+05'
	| '+06'
	| '+07'
	| '+08'
	| '+09'
	| '+10'
	| '+11'
	| '+12'
	| '+13'
	| '+14';

export type NegativeUTCHour =
	| '-00'
	| '-01'
	| '-02'
	| '-03'
	| '-04'
	| '-05'
	| '-06'
	| '-07'
	| '-08'
	| '-09'
	| '-10'
	| '-11'
	| '-12'
	| '-13'
	| '-14';

export type UTCMinute = '00' | '15' | '30' | '45';

export type UTCOffSet = `UTC${PositiveUTCHour | NegativeUTCHour}:${UTCMinute}`;

/** * Format options */
export interface FormatOptions {
	/** - The desired format (Default format is dd, `MMM DD, YYYY HH:mm:ss` = `Sun, Apr 06, 2025 16:11:55:379`). */
	format?: string;
	/** - Whether to use UTC time. Defaults to `false`. */
	useUTC?: boolean;
}
