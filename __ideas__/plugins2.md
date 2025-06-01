
# ✅ **Core Methods** (daily, essential usage — should stay)

These are foundational for nearly all time handling:

## ✅ Accessors & Modifiers

* `add`, `subtract`
* `addDays`, `addWeeks`, `addMonths`, `addYears`
* `addHours`, `addMinutes`, `addSeconds`
* `clone`, `compare`, `diff`, `duration`
* `day`, `daysInMonth`
* `startOf`, `endOf`, `round`
* `get`, `set`, `setWeek`
* `toDate`, `toISOString`, `toJSON`, `toString`, `valueOf`

## ✅ Identity & Logic

* `isAfter`, `isBefore`, `isEqual`, `isSame`
* `isEqualOrAfter`, `isEqualOrBefore`
* `isSameOrAfter`, `isSameOrBefore`
* `isToday`, `isTomorrow`, `isYesterday`

## ✅ Output & Serialization

* `format`, `formatStrict`
* `toArray`, `toObject`
* `toLocaleString`, `toLocal`, `toUTC`, `toLocalISOString`

---

## 🔌 **Plugin Candidates** (less common / regional / heavy)

These are feature-rich or infrequently used in most apps and can be extracted:

### 🔮 Already plugin

* `season`, `zodiac`, `timeZone`

### 📆 Calendar Logic / Display

* `calendar` (because it mimics moment’s calendar-like formatting)
* `fromNow`, `fromNowShort`

### 🌍 Regional / Rare Cases

* `getWeek`, `getWeekOfYear`, `getWeekYear`
* `toQuarter`, `toFiscalQuarter`, `toAcademicYear`
* `getDayOfYear`, `monthName`
* `isLeapYear`, `isDST`
* `getUTCOffset`, `getUTCOffsetMinutes`, `getTimeZoneOffset`, `getTimeZoneOffsetMinutes`

### 📅 Business Logic

* `isBusinessHour`, `isWeekend`, `isWorkday`
* `isPalindromeDate` (novel but rare)
* `isFirstDayOfMonth`, `isLastDayOfMonth`
* `firstDayOfMonth`, `lastDayOfMonth`

### 🧭 Relative Getters (if you want micro control)

* `getRelativeDay`, `getRelativeHour`, `getRelativeMinute`, `getRelativeSecond`, `getRelativeMilliSecond`
* `getRelativeWeek`, `getRelativeMonth`, `getRelativeYear`

### 🛠️ Debug & Inspection

* `inspect` (dev-only)

---

#### 🧩 Final Categorization Summary

| Core (`Chronos`)                         | Plugin System                                    |
| ---------------------------------------- | ------------------------------------------------ |
| `add`, `subtract`, `clone`, `compare`    | `calendar`, `fromNow`, `fromNowShort`            |
| `addX` methods, `diff`, `duration`       | `getWeek`, `getWeekYear`, `getWeekOfYear`        |
| `startOf`, `endOf`, `round`              | `toQuarter`, `toFiscalQuarter`, `toAcademicYear` |
| `format`, `formatStrict`                 | `season`, `zodiac`, `timeZone`                   |
| `get`, `set`, `setWeek`                  | `isLeapYear`, `isDST`                            |
| `toString`, `toDate`, `toISOString`      | `isBusinessHour`, `isWeekend`, `isWorkday`       |
| `toJSON`, `toObject`, `toArray`          | `getRelativeX`, `getDayOfYear`, `monthName`      |
| `toLocaleString`, `toUTC`, `toLocal`     | `isPalindromeDate`, `inspect`                    |
| `isAfter`, `isBefore`, `isSame`, `equal` | `isFirstDayOfMonth`, `isLastDayOfMonth`          |
| `isToday`, `isTomorrow`, `isYesterday`   | `firstDayOfMonth`, `lastDayOfMonth`              |
| `valueOf`                                | `getTimeZoneOffset(X)`, `getUTCOffset(X)`        |

---

#### ✅ Recommendation for Plugin Structure

You might organize plugins like:

```ts
chronos.use(pluginCalendar);
chronos.use(pluginBusinessLogic);
chronos.use(pluginTimeZone); // already done
chronos.use(pluginSeason);
chronos.use(pluginZodiac);
```

Or even allow tree-shaking like:

```ts
import { Chronos } from 'chronos';
import { fromNow, toQuarter } from 'chronos/plugins';
```

## Multiple methods through single plugin

### ✅ How to Inject Multiple Methods from One Plugin

Simply extend the prototype multiple times within the same plugin function:

#### ✅ Example: `timeZonePlugin` with multiple methods

```ts
declare module '../Chronos' {
 interface Chronos {
  /**
   * Convert the current instance to a specific timezone.
   */
  timeZone(zone: TimeZone | UTCOffSet): ChronosConstructor;

  /**
   * Get the timezone offset in minutes from UTC.
   */
  getTimeZoneOffsetMinutes(): number;

  /**
   * Get the timezone offset in `UTC±HH:mm` string format.
   */
  getTimeZoneOffset(): UTCOffSet;
 }
}

export const timeZonePlugin = (ChronosClass: MainChronos): void => {
 ChronosClass.prototype.timeZone = function (
  this: ChronosConstructor,
  zone: TimeZone | UTCOffSet,
 ): ChronosConstructor {
  let targetOffset: number;
  let stringOffset: UTCOffSet;

  if (isValidUTCOffSet(zone)) {
   targetOffset = extractMinutesFromUTC(zone);
   stringOffset = zone;
  } else {
   targetOffset = TIME_ZONES[zone] ?? TIME_ZONES['UTC'];
   stringOffset = formatUTCOffset(targetOffset);
  }

  const previousOffset = this.getTimeZoneOffsetMinutes();
  const relativeOffset = targetOffset - previousOffset;

  const adjustedTime = new Date(
   this.toDate().getTime() + relativeOffset * 60 * 1000,
  );

  const instance = new ChronosClass(adjustedTime);

  return ChronosClass[INTERNALS].withOrigin(
   instance,
   'timeZone',
   stringOffset,
  );
 };

 ChronosClass.prototype.getTimeZoneOffsetMinutes = function (
  this: ChronosConstructor,
 ): number {
  return -this.toDate().getTimezoneOffset();
 };

 ChronosClass.prototype.getTimeZoneOffset = function (
  this: ChronosConstructor,
 ): UTCOffSet {
  return formatUTCOffset(this.getTimeZoneOffsetMinutes());
 };
};
```

---

### 🧩 Plugin Design Tips

* Group logically related methods into a single plugin (like timezone-related ones).
* Clearly declare them in the `declare module` block.
* Ensure `this` is properly typed for each method (`this: ChronosConstructor`).
* Use a utility like `ChronosClass[INTERNALS].withOrigin(...)` if you want to tag instances with metadata about plugin transformations.
