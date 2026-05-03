# **Core Methods (Keep in Main Class)**

These are essential for basic date operations that most users will need daily:

1. **Basic Getters/Calculations:**
   - `day`, `monthName`, `daysInMonth`
   - `get`, `getWeek`, `getWeekOfYear`
   - `isLeapYear`, `isWeekend`, `isWorkday`
   - `firstDayOfMonth`, `lastDayOfMonth`

2. **Date Manipulation:**
   - `add`, `addDays`, `addHours`, `addMinutes`, `addMonths`, `addYears`
   - `subtract`
   - `startOf`, `endOf`

3. **Comparison Helpers:**
   - `isAfter`, `isBefore`, `isEqual`
   - `isSame`, `isSameOrAfter`, `isSameOrBefore`

4. **Formatting/Conversion:**
   - `format`, `toISOString`, `toJSON`
   - `toDate`, `toString`, `valueOf`
   - `toArray`, `toObject`

5. **Relative Time (Common Use):**
   - `fromNow`, `isToday`, `isTomorrow`, `isYesterday`

---

## **Plugin Candidates (Move to Plugins)**

These are more specialized or less frequently used features:

1. **Advanced Timezone Handling:**
   - `getTimeZoneOffset`, `getTimeZoneOffsetMinutes`
   - `getUTCOffset`, `getUTCOffsetMinutes`
   - `toUTC`, `toLocal`, `toLocalISOString`  
   *(You already have timezone plugin - these can be merged there)*

2. **Business/Workday Logic:**
   - `isBusinessHour` *(Business hours plugin)*
   - `toFiscalQuarter`, `toAcademicYear` *(Financial/education plugin)*

3. **Advanced Relative Time:**
   - `getRelativeDay`, `getRelativeHour`, `getRelativeWeek`, etc.  
   *(Relative time formatter plugin)*

4. **Calendar Systems:**
   - `calendar` *(Different calendar systems plugin)*

5. **Specialized Checks:**
   - `isPalindromeDate` *(Novelty/utility plugin)*
   - `isDST` *(Daylight savings plugin)*

6. **Precision Utilities:**
   - `round` *(Date rounding plugin)*
   - `getRelativeMilliSecond` *(High-precision timing plugin)*

7. **Week Numbering Systems:**
   - `getWeekYear`, `setWeek` *(Week numbering plugin)*

8. **Duration Handling:**
   - `duration`, `diff` *(Advanced duration plugin)*

---

## **Borderline Cases (Consider Keeping Core)**

These are somewhat common but could be plugins if size is critical:

- `clone` (very useful but trivial to implement externally)
- `compare` (simple but frequently used)
- `formatUTC` (could live in timezone plugin)
- `inspect` (debugging helper)

---

## **Recommended Plugin Structure**

```bash
plugins/
├── business/          # Workday/business hours
├── calendars/         # Alternate calendar systems
├── financial/         # Fiscal quarters, academic years
├── precision/         # Rounding, milliseconds
├── relativity/        # Advanced relative time formatting
├── timezones/         # Your existing timezone plugin
├── novelty/           # Palindrome, zodiac, etc.
└── week-numbering/    # ISO/week year systems
```
