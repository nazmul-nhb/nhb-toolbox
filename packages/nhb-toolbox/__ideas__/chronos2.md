# More Chronos Methods

<!-- ## 1. `isWeekend(): boolean` -->

Checks if the current date is a Saturday or Sunday.

---

<!-- ## 2. `isWorkday(weekends: number[] = [0, 6]): boolean` -->

Checks if the current day is a workday (excluding custom weekend days).

---

<!-- ## 3. `toQuarter(): 1 | 2 | 3 | 4` -->

Returns the quarter of the year for the current date.

---

<!-- ## 4. `isSameWeek(date: DateLike, weekStartsOn: number = 0): boolean` --> // ! Handled in `isSame()`

Checks if two dates fall in the same week. Supports custom week start day (e.g., Monday = 1).

---

<!-- ## 5. `getZodiacSign(): string` -->

Returns the astrological zodiac sign of the current date.

---

## 6. `isPublicHoliday(holidays: DateLike[]): boolean`

Checks whether the current date matches any given list of holidays.

---

<!-- ## 7. `toAcademicYear(startMonth = 7): string` -->

Returns the academic year for the date (e.g., "2024-2025"). Useful for institutions.

---

<!-- ## 8. `isDST(): boolean` -->

Checks if the current date falls within Daylight Saving Time in its time zone.

---

<!-- ## 9. `isPalindromeDate(format?: string): boolean` -->

Checks if the formatted date (e.g., YYYYMMDD or DDMMYYYY) is a palindrome.

---

<!-- ## 10. `toFiscalQuarter(fiscalStartMonth = 4): 1 | 2 | 3 | 4` -->

Returns fiscal quarter based on custom fiscal year start month (April by default).

## 11. `count` for counting any unit from a start to end date
