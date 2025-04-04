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
