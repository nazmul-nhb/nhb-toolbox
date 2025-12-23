# Suggested Methods by DeepSeek for `BanglaCalendar`

Looking at your `BanglaCalendar` class, here are useful methods you should consider adding:

## **Date Manipulation Methods**  <!-- ! Chronos has these but can be useful in some cases -->

```typescript
/**
 * @instance Adds days to the current Bangla date.
 * 
 * @param days - Number of days to add (can be negative)
 * @returns New BanglaCalendar instance with added days
 * 
 * @example
 * const bnCal = new BanglaCalendar('১৪৩০', '১', '১');
 * const nextWeek = bnCal.addDays(7); // Returns: ৮ বৈশাখ ১৪৩০
 */
addDays(days: number): BanglaCalendar

/**
 * @instance Subtracts days from the current Bangla date.
 * 
 * @param days - Number of days to subtract
 * @returns New BanglaCalendar instance with subtracted days
 */
subtractDays(days: number): BanglaCalendar

/**
 * @instance Adds months to the current Bangla date.
 * 
 * @param months - Number of months to add (can be negative)
 * @returns New BanglaCalendar instance with added months
 * 
 * @remarks Adjusts date if resulting day exceeds month length
 */
addMonths(months: number): BanglaCalendar

/**
 * @instance Adds years to the current Bangla date.
 * 
 * @param years - Number of years to add (can be negative)
 * @returns New BanglaCalendar instance with added years
 * 
 * @remarks Handles leap year changes and date adjustments for 30 চৈত্র
 */
addYears(years: number): BanglaCalendar
```

## **Comparison Methods**  <!-- ! Chronos has these -->

```typescript
/**
 * @instance Checks if this date is before another Bangla date.
 * 
 * @param other - Other BanglaCalendar instance or date string
 * @returns `true` if this date is before the other date
 */
isBefore(other: BanglaCalendar | string): boolean

/**
 * @instance Checks if this date is after another Bangla date.
 * 
 * @param other - Other BanglaCalendar instance or date string
 * @returns `true` if this date is after the other date
 */
isAfter(other: BanglaCalendar | string): boolean

/**
 * @instance Checks if this date is the same as another Bangla date.
 * 
 * @param other - Other BanglaCalendar instance or date string
 * @returns `true` if both dates represent the same day
 */
isSame(other: BanglaCalendar | string): boolean

/**
 * @instance Checks if this date is between two Bangla dates (inclusive).
 * 
 * @param start - Start date
 * @param end - End date
 * @returns `true` if this date is between start and end (inclusive)
 */
isBetween(start: BanglaCalendar | string, end: BanglaCalendar | string): boolean

/**
 * @instance Calculates the difference in days between two Bangla dates.
 * 
 * @param other - Other BanglaCalendar instance
 * @returns Number of days difference (positive if this date is later)
 */
diffInDays(other: BanglaCalendar): number
```

## **Utility Methods**  <!-- ! Chronos has these but can be useful -->

```typescript
/**
 * @instance Gets the number of days in the current Bangla month.
 * 
 * @returns Number of days in the current month (30 or 31)
 * 
 * @example
 * const bnCal = new BanglaCalendar('১৪৩০', '১', '১');
 * bnCal.daysInMonth(); // Returns: 31 (বৈশাখ has 31 days)
 */
daysInMonth(): number

/**
 * @instance Gets the number of days in the current Bangla year.
 * 
 * @returns 365 for normal years, 366 for leap years
 */
daysInYear(): number

/**
 * @instance Gets the week number in the current Bangla year.
 * 
 * @returns Week number (1-≈53) according to Bangla calendar weeks
 * 
 * @remarks Week starts on Sunday (রবিবার)
 */
weekOfYear(): number

/**
 * @instance Gets the day of the year (1-365/366).
 * 
 * @returns Day number in the current Bangla year
 * 
 * @example
 * const bnCal = new BanglaCalendar('১৪৩০', '১', '১');
 * bnCal.dayOfYear(); // Returns: 1
 */
dayOfYear(): number

/**
 * @instance Gets a new BanglaCalendar instance for the next weekday.
 * 
 * @param dayOfWeek - Day of week (0=রবিবার, 6=শনিবার)
 * @returns Next occurrence of the specified weekday
 */
next(dayOfWeek: Enumerate<7>): BanglaCalendar

/**
 * @instance Gets a new BanglaCalendar instance for the previous weekday.
 * 
 * @param dayOfWeek - Day of week (0=রবিবার, 6=শনিবার)
 * @returns Previous occurrence of the specified weekday
 */
previous(dayOfWeek: Enumerate<7>): BanglaCalendar
```

## **Factory/Static Methods**  <!-- ! Not interested/already there as constructor or methods or Chronos has these -->

```typescript
/**
 * * Creates a BanglaCalendar instance from a Bangla date string.
 * 
 * @param dateString - Bangla date string in "YYYY-MM-DD" format
 * @param config - Calendar configuration
 * @returns BanglaCalendar instance
 * 
 * @example
 * BanglaCalendar.fromString('১৪৩০-০১-০১');
 */
static fromString(dateString: string, config?: BnCalendarConfig): BanglaCalendar

/**
 * * Gets the current Bangla date.
 * 
 * @param config - Calendar configuration
 * @returns BanglaCalendar instance for current date
 * 
 * @example
 * BanglaCalendar.now();
 */
static now(config?: BnCalendarConfig): BanglaCalendar

/**
 * * Creates BanglaCalendar from a timestamp.
 * 
 * @param timestamp - Unix timestamp in milliseconds
 * @param config - Calendar configuration
 * @returns BanglaCalendar instance
 */
static fromTimestamp(timestamp: number, config?: BnCalendarConfig): BanglaCalendar

/**
 * * Validates a full Bangla date (year, month, day combination).
 * 
 * @param year - Bangla year
 * @param month - Bangla month
 * @param day - Bangla day
 * @returns `true` if the date is valid
 * 
 * @example
 * BanglaCalendar.isValidDate(1430, 1, 31); // true
 * BanglaCalendar.isValidDate(1430, 1, 32); // false
 */
static isValidDate(
  year: number | string,
  month: number | string,
  day: number | string
): boolean
```

## **Conversion Methods** <!-- ! Chronos has these -->

```typescript
/**
 * @instance Converts to Unix timestamp (milliseconds since epoch).
 * 
 * @returns Unix timestamp
 */
valueOf(): number

/**
 * @instance Gets the Gregorian date string in ISO format.
 * 
 * @returns ISO 8601 string (YYYY-MM-DD)
 * 
 * @example
 * const bnCal = new BanglaCalendar('১৪৩০', '১', '১');
 * bnCal.toISOString(); // "2023-04-14"
 */
toISOString(): string

/**
 * @instance Gets the Gregorian date string in localized format.
 * 
 * @param locale - Locale string (e.g., 'bn-BD', 'en-US')
 * @param options - Intl.DateTimeFormat options
 * @returns Localized date string
 */
toLocaleString(locale?: string, options?: Intl.DateTimeFormatOptions): string
```

## **Helper Methods**

```typescript
/**
 * @instance Clones the current BanglaCalendar instance.
 * 
 * @returns New BanglaCalendar instance with same date
 */
clone(): BanglaCalendar

/**
 * @instance Sets specific components of the date.
 * 
 * @param values - Object with year, month, or date to set
 * @returns New BanglaCalendar instance with updated components
 * 
 * @example
 * bnCal.set({ year: 1431 }); // Changes year to 1431
 * bnCal.set({ month: 2 }); // Changes month to জ্যৈষ্ঠ
 */
set(values: {
  year?: number | string;
  month?: number | string;
  date?: number | string;
}): BanglaCalendar
```

## **Festival/Holiday Methods** (if applicable)

```typescript
/**
 * @instance Gets upcoming major Bangla festivals/holidays.
 * 
 * @param count - Number of festivals to return (default: 5)
 * @returns Array of upcoming festival dates with names
 */
getUpcomingFestivals(count?: number): Array<{
  date: BanglaCalendar;
  name: string;
  description?: string;
}>

/**
 * @instance Checks if the current date is a major Bangla festival/holiday.
 * 
 * @returns Festival name if it's a festival day, `null` otherwise
 */
isFestival(): string | null
```

Choose based on your use case - date manipulation and comparison methods would be most useful for a robust date library.
