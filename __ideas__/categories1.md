# Chronos Instance Methods Categories

## 🧮 **Arithmetic & Adjustment**

> Methods that adjust the date/time by a certain amount or unit.

* `add`
* `addDays`
* `addHours`
* `addMinutes`
* `addMonths`
* `addSeconds`
* `addWeeks`
* `addYears`
* `subtract`
* `round`
* `set`
* `setWeek`

---

## 📊 **Comparison & Validation**

> Methods to compare dates or validate relationships between them.

* `isAfter`
* `isBefore`
* `isBetween`
* `isEqual`
* `isEqualOrAfter`
* `isEqualOrBefore`
* `isSame`
* `isSameOrAfter`
* `isSameOrBefore`
* `compare`

---

## 📆 **Date Boundaries & Period Helpers**

> Methods that deal with boundaries or structural parts of dates.

* `startOf`
* `endOf`
* `firstDayOfMonth`
* `lastDayOfMonth`
* `daysInMonth`
* `getWeek`
* `getWeekOfYear`
* `getWeekYear`
* `day`
* `monthName`

---

## 📅 **Status Checkers & Flags**

> Methods that return boolean status about the date (weekend, DST, leap year, etc.)

* `isDST`
* `isLeapYear`
* `isBusinessHour`
* `isWeekend`
* `isWorkday`
* `isToday`
* `isTomorrow`
* `isYesterday`
* `isFirstDayOfMonth`
* `isLastDayOfMonth`
* `isPalindromeDate`

---

## 🧭 **Relative Time & Human-Friendly Output**

> Methods that describe a date relative to now or as a human-readable phrase.

* `fromNow`
* `fromNowShort`
* `calendar`

---

## 🧠 **Descriptive & Informational**

> Methods that extract specific date-related information.

* `get`
* `getDayOfYear`
* `getPartOfDay`
* `getRelativeDay`
* `getRelativeHour`
* `getRelativeMinute`
* `getRelativeSecond`
* `getRelativeWeek`
* `getRelativeMonth`
* `getRelativeYear`
* `getRelativeMilliSecond`
* `getTimeStamp`
* `getTimeZoneOffset`
* `getTimeZoneOffsetMinutes`
* `getUTCOffset`
* `getUTCOffsetMinutes`
* `getZodiacSign`
* `timeZone`
* `toAcademicYear`
* `toFiscalQuarter`
* `toQuarter`

---

## 📤 **Formatters & Serializers**

> Methods that return string representations or format the date.

* `format`
* `formatStrict`
* `formatUTC`
* `toISOString`
* `toJSON`
* `toLocaleString`
* `toLocalISOString`
* `toString`
* `inspect`

---

## 🔁 **Transformers & Conversions**

> Methods that convert a `Chronos` instance into other structures or types.

* `toArray`
* `toDate`
* `toObject`
* `toLocal`
* `toUTC`
* `valueOf`

---

## 🧬 **Utility & Lifecycle**

> Utility methods that operate on or return new instances.

* `clone`
* `duration`
