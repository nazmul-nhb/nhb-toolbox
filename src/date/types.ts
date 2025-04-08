import type { Chronos } from './Chronos';
import type {
	DATE_FORMATS,
	DAY_FORMATS,
	HOUR_FORMATS,
	MILLISECOND_FORMATS,
	MINUTE_FORMATS,
	MONTH_FORMATS,
	ORIGIN,
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

export type ChronosDate = number | string | Date | Chronos;

/** * All valid granular parts. */
export type DateParts =
	| `${Day}, ${Exclude<Month, 'M' | 'MM' | 'MMM' | 'MMMM'>} ${Date}, ${Exclude<Year, 'yyyy' | 'yy'>}`
	| `${Day}, ${Date} ${Exclude<Month, 'M' | 'MM' | 'MMM' | 'MMMM'>}, ${Exclude<Year, 'yyyy' | 'yy'>}`
	| `${Date}/${Exclude<Month, 'MMM' | 'MMMM' | 'mmm' | 'mmmm'>}/${Exclude<Year, 'yyyy' | 'yy'>}`
	| `${Exclude<Month, 'MMM' | 'MMMM' | 'mmm' | 'mmmm'>}/${Date}/${Exclude<Year, 'yyyy' | 'yy'>}`
	| `${Date}-${Exclude<Month, 'MMM' | 'MMMM' | 'mmm' | 'mmmm'>}-${Exclude<Year, 'yyyy' | 'yy'>}`
	| `${Exclude<Year, 'yyyy' | 'yy'>}-${Exclude<Month, 'MMM' | 'MMMM' | 'mmm' | 'mmmm'>}-${Date}`
	| `${Day}, ${Date} ${Exclude<Month, 'M' | 'MM' | 'MMM' | 'MMMM'>}`;

export type TimeParts =
	| `${Exclude<Hour, 'h' | 'hh'>}:${Minute}`
	| `${Exclude<Hour, 'H' | 'HH'>}:${Minute} ${TimeFormats}`
	| `${Exclude<Hour, 'h' | 'hh'>}:${Minute}:${Second}`
	| `${Exclude<Hour, 'H' | 'HH'>}:${Minute}:${Second} ${TimeFormats}`
	| `${Exclude<Hour, 'h' | 'hh'>}:${Minute}:${Second}:${Millisecond}`
	| `${Exclude<Hour, 'H' | 'HH'>}:${Minute}:${Second}:${Millisecond} ${TimeFormats}`;

type DateTimeConnector = ', ' | ' ' | ' - ';

/** Strict pre-defined types for formatting date and time. */
export type StrictFormat =
	| DateParts
	| TimeParts
	| `${DateParts}${DateTimeConnector}${TimeParts}`;

export interface ChronosObject {
	year: number;
	month: number;
	isoMonth: number;
	date: number;
	weekDay: number;
	isoWeekDay: number;
	hour: number;
	minute: number;
	second: number;
	millisecond: number;
}

export type WithoutOrigin = Omit<Chronos, typeof ORIGIN>;

/** Methods (both instance and static) in `Chronos` class that return `Chronos` instance. */
export type ChronosMethods =
	| {
			// Instance methods that return `Chronos`
			[K in keyof WithoutOrigin]: Chronos extends {
				[key in K]: (...args: any[]) => Chronos;
			} ?
				K
			:	never;
	  }[keyof WithoutOrigin]
	| {
			// Static methods that return `Chronos`
			[K in keyof typeof Chronos]: typeof Chronos extends {
				[key in K]: (...args: any[]) => Chronos;
			} ?
				K
			:	never;
	  }[keyof typeof Chronos];

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
