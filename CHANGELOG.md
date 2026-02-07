# Changelog

<!-- markdownlint-disable-file MD024 -->

All notable changes to the package will be documented here.

## [4.28.80] - 2026-02-07

- **Moved** `getDatesInRange` method to `Chronos` *plugin system*, usable via `dateRangePlugin`.
- **Updated** `Timestamp` type to `ISOTimeString` and removed *branding* for better clarity and consistency across the codebase.
  - `Chronos` methods `toISOString()` and `toLocalISOString()`; and `getTimestamp` utility now return `ISOTimeString` type.
  - `Chronos` method `getDatesInRange(...)` now return `ISOTimeString[]` instead of `string[]`.

## [4.28.72] - 2026-02-06

- **Updated** *tsdoc* for the overload signatures of `getTimestamp` utility to clarify the behavior.

## [4.28.71] - 2026-02-06

- **Fixed** an *issue* in `reconstruct` method of `Chronos` class where the *internal state* of the reconstructed instance was not properly when the timezone offset is different from the local system's timezone offset.

## [4.28.70] - 2026-02-06

- **Added** *new static methods*: `isReconstructable` and `reconstruct` to `Chronos` class for *validating* and *reconstructing* instances from plain objects.
- **Added** `getTimestamp` utility for generating ISO 8601 timestamps with options to control input date and output format.
- **Improved** `UUID v4/v8` generation to prefer `crypto.getRandomValues` with a `Math.random` fallback when unavailable.

## [4.28.66] - 2026-01-23

- **Refined** `TSDoc` to *improve* **IDE IntelliSense** for `Chronos` constructor.

## [4.28.64] - 2026-01-15

- **Added** new `zodiacPlugin` method: `getZodiacMeta` to retrieve zodiac *metadata* for a given *zodiac sign*.

## [4.28.60] - 2026-01-13

- **Fixed** `Chronos.getZodiacSign` boundary handling to correctly wrap across year transitions for *zodiac presets*.
- **Improved** zodiac resolution logic to ensure consistent results for early-January dates without altering existing zodiac presets.
- **Updated** `ZodiacArray` and `ZodiacOptions` types to support custom zodiac definitions with *correctly inferred sign names*.

## [4.28.57] - 2026-01-07

- **Enhanced** `Color.isLightColor` with an *optional brightness threshold* for custom light/dark detection.
- **Refined** `TSDoc` to *improve* **IDE IntelliSense** for selected methods in `Color` and `Stylog`.

## [4.28.56] - 2026-01-05

- **Resolved** an *issue affecting the conversion of Gregorian date strings to Bangla dates* in `BanglaCalendar`.

## [4.28.54] - 2026-01-02

- **Optimized** `Color.applyOpacity` and **updated** its behavior to return a *new* `Color` instance instead of mutating the original.

## [4.28.53] - 2026-01-01

- **Optimized** *internal utilities* to enhance **runtime performance** and **editor IntelliSense**.

## [4.28.52] - 2025-12-30

- **Added** *new* methods for `BanglaCalendar`: `addDays`, `addWeeks`, `addMonths`, `addYears`, `valueOf` and `[Symbol.toPrimitive]`.

## [4.28.51] - 2025-12-24

- **Removed** strictness from *format* parameter of `formatTimePart` utility and `Chronos.formatTimePart` static method.

## [4.28.50] - 2025-12-24

### ✨ New Class, Chronos Plugin, and Utilities

- **Added** a *new* class: `BanglaCalendar` for creating, manipulating, and converting dates between the Bangla and Gregorian calendar systems.
- **Introduced** a *new* `Chronos` *plugin*: `banglaPlugin`, enabling Bangla calendar support within `Chronos`.
- **Added** *new* numeric conversion utilities: `banglaToDigit` and `digitToBangla`, for working with Bangla numerals.
- **Added** a *new* date/time utility: `formatTimePart` for formatting a string that only has the time component.
- **Fixed** minor *issues* in `Chronos` and **improved** *type system* for date and number related utilities.

## [4.28.44] - 2025-12-19

- **Updated** `DateTimeFormatOptions` with *improved type system* and **removed** *unsupported* **locales/currencies** from *constants* and *types*.

## [4.28.40] - 2025-12-15

- **Added** *new class* `TextCodec` with only *static methods* to convert between `text`, `hex`, `binary`, and `Base64` representations using *byte-level transformations*.
- **Added** *new utility* `hexToBytes` with 2 new special *type guards:* `isHexString` and `isBinaryString`.

## [4.28.30] - 2025-12-13

- **Updated** *tsdoc* for `Chronos` and *signature* of `Currency` class with generic `CurrencyCode`.

## [4.28.24] - 2025-12-11

- **Updated** *type names* `VoidFunction` to `VoidFn`. `DelayedFn<T>` is used for both *debounced* and *throttled* functions.
- **Added** *new* `Chronos` *business plugin methods* `weekendsBetween`, `weekendsInMonth` and `weekendsInYear`.

## [4.28.21] - 2025-12-07

- **Added** *missing exports* for `getTimeZoneIds` and `getNativeTimeZoneId` *utilities*.

## [4.28.20] - 2025-12-07

### 🕧 Updates in Chronos

- **Added** *new methods* for *business plugin:* `nextWorkday`, `nextWeekend`, `previousWorkday`, `previousWeekend`, `workdaysBetween`, `workdaysInMonth`, `workdaysInYear`.
- **Optimized** *time complexity* for `getDatesForDay` and `getDatesInRange` for *longer time ranges*.

### 🛠️ Other Updates

- **Added** *new utilities*: `getTimeZoneIds` to get *time zone identifiers* for a given *UTC offset* and `getNativeTimeZoneId` to get *current system's time zone identifier*.
- **Added** *new utility types* `Maybe<T>`, `Alphabet<T>`, `IsAlphabet<T>` and `SpecialCharacter`.

## [4.28.10] - 2025-12-03

- **Added** *new* `addOrOverrideCode` method and **modified** *existing* + **introduced** *new types* for `HttpStatus` class.

## [4.28.8] - 2025-12-03

- **Fixed** a *tree-shaking issue* affecting `Chronos` and other *date/time utilities* by removing a *pre-compiled* `RegExp` instance from **date/constants**.

## [4.28.7] - 2025-12-02

- **Updated** *invalid links* in *tsdoc* of the *hash utilities*.
- **Implemented** input type *validation* for `sha256` utility.

## [4.28.6] - 2025-12-02

- **Updated** *tsdoc* for `stableStringify` + *type augmentation* for `String` methods: `toLowerCase` and `toUpperCase`.

## [4.28.4] - 2025-12-02

- **Updated** *implementation* and *tsdoc* for:
  - `cloneObject`: used `structuredClone` and `stableStringify` (optionally force to use *deterministic serialization*) internally and falls back to *shallow cloning* if serialization fails.
  - `stableStringify`: stringified value of *Date-like objects* (`Date`, `Chronos`, `Moment.js`, `Day.js`, `Luxon`, `JS-Joda`, `Temporal`) is converted to string representation (in the same way that `JSON.stringify` would serialize them).
- **Updated** `convertObjectValues` behavior: *fields* configured for *number conversion* now return `NaN` when *parsing fails*.
- **Updated** *reference links* in *tsdoc* of some *hash* utilities.

## [4.28.1] - 2025-12-02

- **Updated** *type* names `TokenHeader` to `SignetHeader` and `TokenPayload` to `SignetPayload` and both are available to import.

## [4.28.0] - 2025-12-01

- **Added** *new* class `Cipher` to *encrypt/decrypt* string with *secret key*.
- **Added** *new* class `Signet` to *sign*, *decode* and *verify* **token** like `JWT`.
- **Added** *new* `sha256` hash function. **Updated** `sha1` *encoding algorithm*. Now it avoids depending on `TextEncoder`.
- **Added** *new* utility `parseMSec` to convert time value to *milliseconds* or *seconds* along with new *type guard* `isTimeWithUnit`.
- **Added** *new* `JSON` utilities: `stableStringify` for *stable, deterministic stringifying* and `stripJsonEdgeGarbage` for stripping `JSON` string.

## [4.27.11] - 2025-11-29

- **Updated** *core algorithms* of `md5` and `sha1` utilities to fix *incorrect hash digest generation*.

## [4.27.10] - 2025-11-28

- **Updated** *type augmentation* for `String` methods: `toLowerCase` and `toUpperCase` (type level only, implementation remains intact).

## [4.27.1] - 2025-11-28

- **Updated** default *type parameter* for `generateRandomColor` by replacing `undefined` with `'hex'`.

## [4.27.0] - 2025-11-28

### New

- **Added** *typed* **string case converters** which can only be imported via the *subpath* `'nhb-toolbox/change-case'`.
  - **Also added** *new* utility types for formatting case(s) in type level.
- **Added** *new* hash utilities: `randomHex`, `md5`, `sha1`, `uuid`. `decodeUUID` and *uuid version checkers* derived from `isUUID`.
  - **Hash utilities** can only be imported via the *subpath* `'nhb-toolbox/hash'`
- **Added** *new* `definePrototypeMethod` utility to inject *prototype* methods in a safe (also *type-safe*) manner.

### Updates

- **Updated** `convertStringCase` utility to accept new format: `'Sentence case'`.
- **Updated** `generateAnagram` utility to accept an *optional dictionary array* for generating **valid anagrams**.
- **Updated** `isUUID` to verify versions 1-8 (not just `v4`). It now *narrows down* the value to **branded type** `UUID<UUIDVersion>`.

## [4.26.74] - 2025-11-23

- **Added** optional `serializer` and `deserializer` for *local and session storage* utilities with *improved error handling*.

## [4.26.73] - 2025-11-22

- **Added** the **missing** *closing parenthesis* in `INDIA_VEDIC_SEASONS` *constant* within the `seasons` module.

## [4.26.71] - 2025-11-21

- **Fixed** type issues regarding *array inputs* for `sanitizeData` by swapping the *overload signatures*.

## [4.26.70] - 2025-11-21

- **Added** new `formatDate` utility with alias `formatDateTime` and *core date formatter (private)* to be shared with both `Chronos` class and `formatDate` utility.
- **Fixed** issues raised from misplacement of *internal* `#date` in `Chronos` class.

## [4.26.69] - 2025-11-18

- **Updated** *return type* of `sanitizeData` utility:
  - **Fixed** *return type* when keys are ignored by *removing those keys* using `SanitizedData`, `OmitPath` and other new `type helpers`.
  - **Fixed** the *return type* when it is called with `_return = 'partial'` parameter by *making all the nested properties optional*.
    - **Created** new *utility type* `$DeepPartial` to satisfy this *return type*.

## [4.26.66] - 2025-11-17

- **Changed** the signature of `Chronos` `get()` method to `get<Unit extends TimeUnit>(unit: Unit): TimeUnitValue<Unit>` to align with `set()` method.

## [4.26.64] - 2025-11-17

### 🕧 Fixes in Chronos

- **Fixed** *timestamp handling*: `timestamp`, `unix`, `valueOf()`, and `getTimeStamp()` now consistently use/return the correct **universal timestamp**.
- **Improved** `min(...)` and `max(...)` methods to return a new *immutable* `Chronos` instance while preserving the *internal state* of the **winning instance** (timezone info, offset, and origin).

## [4.26.61] - 2025-11-17

- **Fixed** issue with `Chronos` *format methods* not formatting correctly when `useUTC` is `true`.
- **Updated** *tsdoc* for some `Chronos` methods.

## [4.26.60] - 2025-11-16

- **Fixed** an *issue* in `Chronos` class where chaining *calculation methods* after `timeZone`, `toLocal`, `toUTC`, or other *offset-adjusting methods* resulted in *incorrect* time values.

## [4.26.54] - 2025-11-15

- **Added** new *guard* utility: `isNativeTimeZoneId` with new constant for type interfaces using `Intl` API.
- **Updated** `isValidTimeZoneId` *guard* with new *array constant* for checking.
- **Updated** tsdoc: **added** *remarks* and **fixed** *reference links* in some *functions* and `Chronos` *methods*.

## [4.26.50-51] - 2025-11-14

- **Updated** `TimeZoneIdentifier` type: now **excludes** `Factory` and *time zone abbreviations* already present in `TimeZone` literal type. **Created** new `$TimeZoneIdentifier` type as *replacement*.
- **Replaced** `TIME_ZONE_IDS` with `Intl.supportedValuesOf('timeZone')` API to get *time zone identifier* to reduce the `timeZonePlugin` size.

## [4.26.45] - 2025-11-13

- **Removed** *time zone id* `'Factory'` from `TIME_ZONE_IDS` and **replaced** `'EDT'` with `'EST5EDT'` to fix the *issue with getting time zone details* using `Intl` API.

## [4.26.44] - 2025-11-13

- **Fixed** issues with passing optional *time zone id* in `Chronos` method `$getNativeTimeZoneName` and `getTimeZoneDetails` utility.

## [4.26.41] - 2025-11-12

- **Updated** *tsdoc* for some `Chronos` *methods* and `getTimeZoneDetails` utility.

## [4.26.40] - 2025-11-12

### 🕧 Updates in Chronos

- **Fixed** *tree-shaking issue* for *constant imports* from same module(s).
- **Renamed** `$getNativeTimeZone()` method to `$getNativeTimeZoneName()` and *optional* `tzId` parameter.
- **Enhanced** `timeZoneName()` and `getTimeZoneNameAbbr()`/`getTimeZoneNameShort()` methods: now look up for *time zone name* using `Intl.DateTimeFormat` when fails to resolve from `TIME_ZONE_IDS`.

### 🛠️ Other Updates

- **Added** new *date/time utility* `getTimeZoneDetails` to retrieve *time zone information*.

## [4.26.30] - 2025-11-11

### 🕧 Updates in Chronos

- **Fixed** issues in `getTimeZoneName()` and `getTimeZoneNameShort()` where expected outputs were *missing or incorrect*.
- **Updated** *timezone constants* by removing *redundant hints* and *improving internal consistency*.
- **Introduced** a new *method alias* `getTimeZoneNameAbbr()` for `getTimeZoneNameShort()`.
- **Fixed** an issue where the `clone()` method *did not correctly duplicate the instance state*.

## [4.26.21] - 2025-11-10

### 🕧 Updates in Chronos

- **Fixed** issues with `Chronos` timezone methods: `getTimeZoneName()` and `getTimeZoneNameShort()` *not providing name/short name* for *optional UTC*.
- **Fixed** issues with `Chronos` `diff()` method: now *calculates exact differences for month and year* too.
- **Changed** the signature of `Chronos` `set()` method to `set<Unit extends TimeUnit>(unit: Unit, value: TimeUnitValue<Unit>): Chronos`. **Created** new type helper `TimeUnitValue<Unit>`.

### 🛠️ Other Updates

- **Renamed** `isValidUTCOffSet` *guard* as `isValidUTCOffset` and also kept `isValidUTCOffSet` as alias.

## [4.26.20] - 2025-11-10

### 🕧 Updates in Chronos

- **Moved** `duration` and `durationString` methods to `Chronos` *plugin system*, usable via `durationPlugin`.
- **Optimized** related *plugins* where *internal private methods* are used.
- **Updated** *tsdoc* for `relativeTimePlugin` methods.

## [4.26.10] - 2025-11-09

### 🕧 Updates in Chronos

- **Fixed** *timezone conversion issues* by updating `TIME_ZONE_IDS`, and `TIME_ZONES` constants:
  - Now both the constants have similar *type definitions* and used with `as const` in the codebase.

    ```ts
    // Example structure after unification
    const TIME_ZONE_IDS: Record<string, { tzName: string; offset: UTCOffSet }> = {
      'Asia/Dhaka': { tzName: 'Bangladesh Standard Time', offset: 'UTC+06:00' },
      // ...
    };

    const TIME_ZONES: Record<string, { tzName: string; offset: UTCOffSet }> = {
      BST: { tzName: 'Bangladesh Standard Time', offset: 'UTC+06:00' },
      // ...
    };
    ```

- **Added** new *protected property* `$tzTracker`. **Updated** `withOrigin` and `#withOrigin` methods.
- **Added** *3 overload signatures* and *internal caching mechanism* for `timeZonePlugin` methods.
- **Updated** *tsdoc* for some `Chronos` methods. **Created** new type `TimeZoneName` and *more*.

## [4.26.1] - 2025-11-08

- **Updated** *tsdoc* for some `Chronos` *methods* and *public properties*.

## [4.26.0] - 2025-11-08

### 🕧 New in Chronos

- **Added** new *instance methods* `$getNativeTimeZone()` and `$getNativeTimeZoneId()` to access *local machine's timezone name and identifier*.
- **Added** new *public properties* `timeZoneName`, `timeZoneId` and `utcOffset` to access *current instance's timezone name, identifier(s) and UTC offset*.

### 🕧 Updates in Chronos

- **Updated** `Chronos` `timeZonePlugin` method `timeZone` to accept *timezone identifier* (`TimeZoneIdentifier`) along with *short timezone names* (`TimeZone`) and *UTC offset* (`UTCOffset`).
- **Fixed** issues with `toDate()` and `toLocalISOString()`: now returns `proper date`. **Fixed** *UTC offset* related issues.
- **Fixed** issues with `native` property: now *provides correct native* `Date`.
- **Updated** *type interfaces* for `toLocaleString()` `Chronos` method: **created** `LocalesArguments` and `DateTimeFormatOptions` *type* and *interface*.
- **Updated** *static* `parse` method to accept *millisecond tokens*.

### 🛠️ Other Updates

- **Added** new *constant* `TIME_ZONE_IDS` scrapped from [**IANA TZ Database**](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
- **Added** new *guard* `isValidTimeZoneId(...)` to check if a string value is a valid *timezone identifier* from **IANA Database**.

## [4.25.11] - 2025-11-06

- **Fixed** *pluralization logic* in `fromNow()` method of `Chronos`: *Only `1` is considered singular, every other number is plural*.

## [4.25.10] - 2025-11-06

- **Fixed** *pluralization issues* in the methods of `Converter` classes.

## [4.25.1-4] - 2025-11-05

- **Added** *alias* for `Chronos` *static method* `use`: `register`.
- **Updated** *tsdoc* for `Chronos` *static methods* `use` and `register`.

## [4.25.0] - 2025-11-03

- **Added** new `Chronos` method `durationString(...)` and **Fixed** issues with internal *duration normalization logic*.
- **Fixed** all *pluralization logic* in `pluralize(...)` method of `Pluralizer` and `formatUnitWithPlural` utility: *Only `1` is considered singular, every other number is plural*.

## [4.24.4] - 2025-10-31

- **Exported** color *checkers/guards* from *main path*. **Reverted** color types (optimized spacing).

## [4.24.2] - 2025-10-31

- **Fixed** *return type* when no `'colorType'` option is passed in `generateRandomColor`. **Improved** color related *types*.

## [4.24.1] - 2025-10-30

- **Added** aliases for `generateRandomHSLColor`. **Updated** tsdoc for some color utilities.

## [4.24.0] - 2025-10-30

- **Added** new color utility `generateRandomColor` with alias `getRandomColor` and **deprecated** `generateRandomColorInHexRGB`.

## [4.23.25] - 2025-10-27

- **Updated** tsdoc for `Chronos` *constructor* and **optimized** *internal logic* for some *checker methods*.

## [4.23.24] - 2025-10-26

- **Fixed** *pluralization issue* with ***suffixed*** `'-foot' --> '-feet'` for *format methods* in *converter classes*.

## [4.23.23] - 2025-10-26

- **Fixed** *pluralization issue* with `'foot' --> 'feet'` for *format methods* in *converter classes*.
- **Exported** `GENERAL_UNITS` (used in `Unit` class) and `CATEGORIZED_UNITS` (used in `Converter` classes) from `'nhb-toolbox/constants'`.

## [4.23.21] - 2025-10-25

- **Fixed** *return type* (now maintains *proper order* in the *tuple*) for `supportedUnits()` *converter method*.

## [4.23.20] - 2025-10-25

- **Fixed** *return type* for `supportedUnits()` *converter method*.
- **Added** *new package subpath* for `Color` class: `'nhb-toolbox/color'`.

## [4.23.11] - 2025-10-24

- **Added** new base method `supportedUnits()` to get an *array/tuple of supported unit names*.
- **Fixed** *precision issues* in several *conversion factors* across *converter classes*.
- **Optimized** the `formatTo()` method for improved *performance*.

## [4.23.10] - 2025-10-24

- **Added** `metre` variants of units where needed in *converter classes*.
- **Updated & Optimized** subpath exports for *converter classes* and *functions*.

## [4.23.1] - 2025-10-24

- **Exported** *all the converter classes* from the `'nhb-toolbox/converter'` sub-path too.

## [4.23.0] - 2025-10-24

- **Added** new *unit converter classes* and their *combined function* `Converter` (aliased `converter`).
- **Introduced** new *utility types:* `Replace` `ReplaceFirst` and `$Record`.
- **Exported** `pluralizer`, `verbalizer`, `httpStatus` and new `Converter` utility through different *package sub-paths*.

## [4.21.14] - 2025-10-14

- **Moved** `getTimeZoneName` method to `Chronos` *plugin system*, usable via `timeZonePlugin` and enhanced `timeZonePlugin`.

## [4.21.10] - 2025-10-13

- **Moved** `round` method to `Chronos` *plugin system*, usable via `roundPlugin`.
- **Updated** *tsdoc* for some `Chronos` methods with *proper references.*

## [4.21.4] - 2025-10-13

- **Added** new type `$UTCOffset` and applied in corresponding `Chronos` methods.

## [4.21.1] - 2025-10-13

- **Updated** `TypeScript` compiler target from `ESNext` to `ES2023` for *more stable and predictable* `JavaScript` output.
  - *Ensures consistent syntax across `TypeScript` versions.*

## [4.21.0] - 2025-10-12

- **Renamed** `RomanNumeralCap` type to `RomanCapital` and allow only strict `1-3999` and `RomanNumeral` type to `LooseRomanNumeral`.
- **Removed** all *Roman numeral type helpers* and **recreated** a *strict* `RomanNumeral` with other *internal types*.

## [4.20.92] - 2025-10-12

- **Fixed** `RomanNumeralCap` type and **added** *@remarks* section.

## [4.20.91] - 2025-10-12

- **Updated** *tsdoc* for `fromNow()` `Chronos` method: modified *@remarks* section.

## [4.20.90] - 2025-10-12

- **Updated** `formatUnitWithPlural` utility: now returns *singular unit* for both `0` and `1`.
- **Updated** `fromNow()` `Chronos` method: **fixed** issues when provided unit level value is `0`.

## [4.20.89] - 2025-10-12

- **Updated** behavior of `fromNow()` `Chronos` method: *excluded* `week` level and *included* `millisecond` for consistency. **Refactored** *internal logic*.

## [4.20.88] - 2025-10-11

- **Added** new utility `romanToInteger` and its *aliases* to convert *Roman numerals* to *Arabic numeric* representation and **updated** *input validation* for `convertToRomanNumerals`.
- **Added** new *utility type* `Repeat` to repeat literal string, it works like `String.prototype.repeat()` but on *type-level*.

## [4.20.87] - 2025-10-08

- **Added** new *constants* and *types* related to *country information*, e.g. *full country name, code, ISO code* etc.

## [4.20.86] - 2025-10-08

- **Added** new *number utility* `getFactors` and its alias to calculate *factors* of a given number (*integer*).

## [4.20.84] - 2025-10-07

- **Added** new *number utility* `factorial` and its alias to calculate *factorial* of a given number (*integer*).

## [4.20.80] - 2025-10-07

### 🕧 Updates in Chronos

- **Added** *overload signatures* for `isWeekend`, `isWorkDay` and `isBusinessHour` methods from `businessPlugin`.
- **Fixed** issues with `isBusinessHour`: previously skipped *business start and end hours* in some cases.
- **Added** new *utility type* `RangeTuple` to create *ranged tuple*.

## [4.20.69-70] - 2025-10-07

### 🕧 Updates in Chronos

- **Added** *alias* for some methods available through *plugins*: `greet` for `getGreeting`, `getSeasonName` for `season`, `zodiac` for `getZodiacSign`
- **Updated** behaviors of `isWeekend`, `isWorkDay` and `isBusinessHour` methods from `businessPlugin`, now accepts *indices of weekend day as tuple*.
- **Updated** *internal states* for most of the plugins; **Renamed** some internal *types* and *exposed* some.

## [4.20.66] - 2025-10-05

- **Updated** `isObjectWithKeys`: now returns more *structured object shape* with provided keys.

## [4.20.64] - 2025-10-05

- **Updated** `extractObjectKeys`: now have *overload signatures*, returns a *tuple* or an *array of keys* (string literal).
- **Updated** `extractObjectKeysDeep` no longer returns a *tuple*, instead now it returns an *array of keys* (string literal).

## [4.20.60] - 2025-10-04

- **Added** new *utility types* `ArrayToTuple<T[]>` and `Tuple<T>`.
- **Updated** the *return type* of `extractObjectKeys`, now it returns *tuple of exact top-level keys*.
- **Added** new utility `extractObjectKeysDeep` to extract *tuple* of *all nested keys*.
- **Updated** *query string parser* utilities to receive *generic return type*.
- **Added** new utility `literalQueryStringToObject` to parse *literal query string*.

## [4.20.56] - 2025-10-02

- **Updated** `isDeepEqual` utility: Now it accepts *arguments of unknown types*.

## [4.20.54] - 2025-10-02

- **Added** new utility `extractObjectKeys` to *extract keys of an object* with *proper typing*.
- **Updated** `isObjectWithKeys`: *now properly typed*.

## [4.20.52] - 2025-09-26

- **Added** new `Chronos` *plugin* `greetingPlugin` for accessing `getGreeting` method in `Chronos` instances.
- **Fixed** some *docs and internal type related issues* in `convertObjectValues` utility.

## [4.20.50] - 2025-09-25

- **Fixed** *return type* of `convertObjectValues` utility to correctly reflect the *transformed object structure* and `keys` option is now *more strict*: **only accepts keys which values are string and/or number** and **the array cannot be left empty**.
- **Updated** *options type* for `with()` *static method* of `Chronos`.

## [4.20.48] - 2025-09-22

- **Wrapped** `ChronosMethods` type in `LooseLiteral` to allow passing *custom method names* without *type errors* when creating a custom [`Chronos Plugin`](https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/plugins#%EF%B8%8F-writing-your-own-custom-plugin).
- **Updated** *error message* in `convert` method in `Currency` class.

## [4.20.46] - 2025-09-22

- `Chronos` class is now *exported via subpath* `'nhb-toolbox/chronos'`.

## [4.20.44] - 2025-09-20

- **Updated** type related issues in `Finder` class. Now it accepts *array of objects only*.

## [4.20.40] - 2025-09-18

- **Added** new **utility types**: `DeepPartialAll`, `Join`,`Split` along with `ValidArray`, `List` and *more*.

## [4.20.32] - 2025-09-17

- **Renamed** `isPastParticiple()` method to `isParticiple()` in `Verbalizer/verbalizer`.
- **Optimized** *internal logic* for `toPast()` and `toParticiple()` methods in `Verbalizer/verbalizer`.
- **Updated** all the *rules* for `Verbalizer/verbalizer`.

## [4.20.30] - 2025-09-17

- **Reduced** *unpacked size* by **removing** *tsdoc comments* from js (both `cjs` and `esm`) outputs.
- **Updated** tsdoc for `Verbalizer/verbalizer`: **added** reference to documentation site.

## [4.20.27] - 2025-09-16

- **Fixed** *issues*: (**failed to convert already past/participle regular verbs**) with `toPast()` and `toParticiple()` methods in `Verbalizer/verbalizer`.

## [4.20.26] - 2025-09-16

- **Optimized** *internal logic* in both `Pluralizer` and `Verbalizer`.

## [4.20.24] - 2025-09-15

- **Added** new class `Verbalizer` and its shared instance `verbalizer` for verb form(s) manipulation.
- **Updated** `Pluralizer/pluralizer`'s *internal mechanism* to *trim* input(s) and output(s).

## [4.20.20] - 2025-09-04

### 🎨 Updates for Stylog/LogStyler

- **Reorganized** full `stylog` module.
- **Renamed** `string()` method to `toANSI()` and `applyStyles()` to `toCSS()`.
- **Added** new `ansi16()` method to apply `ANSI-16` color codes.
- **Added** new `hsl()` and `bgHSL()` methods to colorize using custom `hsl` color values.
- **Added** new `rgb()` and `bgRGB()` methods to colorize using custom `rgb` color values.
- **Added** new `hex()` and `bgHex()` methods to colorize using custom `hex` color values.

## [4.20.17] - 2025-09-02

- **Added** *color support detector* for shell/console for `Stylog`/`LogStyler`.

## [4.20.16] - 2025-09-01

- **Added** new method `string()` in `LogStyler` (also in `Stylog`) and **made** `applyStyles()` method *public*.

## [4.20.11] - 2025-09-01

- **Added** new *Symbol* methods in `Chronos`: `Symbol.isConcatSpreadable` and `Symbol.match`.
- **Fixed** string coercion issues with `toPrimitive` *Symbol* method in `Chronos`.
- **Redesigned** `chronos` (`Chronos` wrapper) with *Proxy* and **updated** *TSDoc* for `chronos`.

## [4.20.10] - 2025-09-01

- **Added** new *utility types*: `RequireAtLeast`, `RequireExactly`, `RequireBetween`.
- **Added** new *static* `Chronos` method `Chronos.with(options)` to create `Chronos` instance from specified *time component(s)*.

## [4.20.1] - 2025-08-31

- **Exported** *helper function and guards* used for `Stylog` and `LogStyler`: `hexToAnsi`, `isCSSColor`, `isBGColor`, `isTextStyle`.

## [4.20.0] - 2025-08-31

- **Added** new class `LogStyler` and its chainable `Stylog` utility to log styled input in the console.

## [4.14.16] - 2025-08-30

- **Updated** *types* related to *object flattening utilities*: `FlattenDotKey`, `DotValue`, `FlattenDotValue`, `FlattenLeafKey`, `LeafValue` and `FlattenLeafValue`.
- **Made** all the (output) properties of `FlattenDotValue` and `FlattenLeafValue` *optional* to avoid issues.

## [4.14.14] - 2025-08-27

- **Updated** `DeepPartial` type to preserve optional properties of advanced types like `File`, `FileList`, `Chronos` etc.

## [4.14.13] - 2025-08-24

- **Updated** *return type* for `getColorForInitial` utility and **improved** *internal logic* and *error type* for color generator utilities.

## [4.14.12] - 2025-08-23

- **Updated** *error type* for `trimString` utility.

## [4.14.10] - 2025-08-17

- **Added** new utility `wordsToNumber` utility with alias: `convertWordsToNumber`, `convertWordToNumber` and `wordToNumber`

## [4.14.9] - 2025-08-16

- **Fixed** minor *internal issues* and **updated** JSDoc for `Pluralizer`.

## [4.14.4-8] - 2025-08-13 - 2025-08-14

- **Updated** internal logic of `convertStringCase` utility, added new `options` parameter.
- **Fixed** multiple *internal issues* and JSDoc; Optimized internal logic.

## [4.14.1-3] - 2025-08-11 - 2025-08-12

- **Updated** JSDoc, dev dependencies and **fixed** minor issues.

## [4.14.0] - 2025-08-11

- **Added** new class `HttpStatus` for retrieving and managing HTTP status codes.

## [4.13.11] - 2025-08-06

- **Fixed** an issue with `getZodiacSign` method in `Chronos` that could not return correct *Vedic* sign.

## [4.13.10] - 2025-08-02

- **Updated** docs for `isPlural` and `isSingular` methods in `Pluralizer`.
- **Updated** `getTimeZoneName()` and `getTimeZoneNameShort()` methods in `Chronos` to accept an optional UTC offset.
- **Changed** return type of `getTimeZoneName()` to `string | UTCOffset` using `LooseLiteral<UTCOffset>`.

## [4.13.9] - 2025-07-31

- **Added** new `Chronos` method `getTimeZoneName()` to get full time-zone name.
- **Added** new `Chronos` `timeZonePlugin` method `getTimeZoneNameShort()` to get abbreviated time-zone name.

## [4.13.7] - 2025-07-23

- **Updated** `isPlural` and `isSingular` methods in `Pluralizer` class to handle more cases.
- **Ran full test** on `pluralizer` and fixed some known issues.

## [4.13.3-6] - 2025-07-22

- **Reordered** rules for `pluralizer` and fixed other issues.

## [4.13.3] - 2025-07-22

- **Updated** *pluralization/uncountable rules*, *case restoration method* and fixed other bugs in `pluralizer`.
- **Updated** docs for `pluralizer`, `Pluralizer` and `formatUnitWithPlural`.

## [4.13.1] - 2025-07-22

- **Updated** docs in [README](README.md) for `pluralizer`.

## [4.13.0] - 2025-07-22

- **Added** new `Pluralizer` class and utility `pluralizer` (shared instance of `Pluralizer` class) with multiple methods.
- **Refactored** codes in number utilities, introduced new `normalizeNumber` utility.

## [4.12.80-81] - 2025-07-19

- **Updated** `convertArrayToString` to accept array of any primitive values.
- **Fully integrated** with [nhb-scripts](https://www.npmjs.com/package/nhb-scripts/).

## [4.12.70] - 2025-07-08

- **Updated** numeric string related issues, specifically in `isNumber` & `isNumericString` and other helper functions.

## [4.12.68-69] - 2025-07-05

- **Updated Docs:** Added links to other npm packages.

## [4.12.67] - 2025-07-03

- **Fixed** some import alias typo.

## [4.12.66] - 2025-07-02

- **Updated** `convertArrayToString` function, now accepts array of objects and have 2 overload signatures with options.
- **Updated** `RenameKeys` utility type by fixing some minor issues.

## [4.12.64] - 2025-07-02

- **Added** more utility types.
- **Updated** JSDoc for some `Chronos` methods.

## [4.12.61] - 2025-06-28

- **Added** new utility type `Expand<T>` to resolve complex helper-wrapped types into readable structures, similar to `Prettify<T>` but only for special types to use with.
- **Improved** type display for special cases where types were previously wrapped in multiple utility layers (e.g., `MergeAll`, `FlattenValue` etc.).

## [4.12.60] - 2025-06-27

- **Added** new array utilities:
  - `sumByField`
  - `averageByField`
  - `sumFieldDifference`
  - `groupAndSumByField`
  - `groupAndAverageByField`

- **Updated** `splitArrayByProperty` utility to allow nested field as dot-notation.

## [4.12.50] - 2025-06-27

- **Updated** return type definition and **enhanced** internal logic for `mergeObjects`, `mergeAndFlattenObjects`, `flattenObjectKeyValue`, `flattenObjectDotNotation`.
- **Created** new utility types for the mentioned utilities.

## [4.12.48] - 2025-06-24

- **Fixed** typo for utility name `splitArrayByProperty`.
- **Added** new utilities `getInstanceGetterNames` and `getStaticGetterNames`;
- **Updated** `getClassDetails` and its return type.

## [4.12.46] - 2025-06-24

- **Added** new utilities ~~spitArrayByProperty~~ `splitArrayByProperty` and `deleteFields`.

## [4.12.44] - 2025-06-23

- **Updated** `getDatesInRange()` method in `Chronos`: fixed an option conflict.

## [4.12.43] - 2025-06-22

- **Updated** `getDatesInRange()` method in `Chronos`, now accepts both `day-names` and `day-index` array for `skipDays` and `onlyDays`.
- **Updated** JSDoc for some functions and methods.

## [4.12.42] - 2025-06-21

- **Updated** JSDoc for some functions and methods.
- **Updated and Optimized** `getDatesInRange()` method in `Chronos`. Added new option `onlyDays` to get dates for only the provided days.
- **Allowed** `formatStrict()` method in `Chronos` to accept other string values [made less strict].

## [4.12.41] - 2025-06-17

- **Updated** `getDatesInRange()` and `getDatesForDay()` `Chronos` methods' options to change the date rounding behavior.

## [4.12.40] - 2025-06-17

- **Added** new utility: `convertMinutesToTime` to convert minutes into clock-time (`H:mm`) format.
- **Exposed** important `constants` to consumers via `'nhb-toolbox/constants'` import path.

### 🕧 Updates for Chronos

- **Added** new instance method `getDatesInRange()` to get dates in the range as ISO date string.
- **Fixed** a bug by rounding the date to the start hour of the day and **updated** internal logic in static `getDatesForDay()` method.

## [4.12.36] - 2025-06-13

- **Added** new `convertSync()` method in `Currency` class to convert currency without network request.

## [4.12.34-35] - 2025-06-12

- **Updated** `format()` and `convert()` methods in `Currency` class:
  - `format()` method now accepts `CurrencyCode` as optional second parameter
  - `convert()` method now returns a new `Currency` instance.

## [4.12.33] - 2025-06-11

- **Trim** input string for `numberToWordsOrdinal` utility.
- **Preserve** `File`, `FileList` and other file related object(s) when processing nested object(s) using `sanitizeData`.

## [4.12.32] - 2025-06-11

- **Fixed** a bug in `sanitizeData` and `createFormData` where key selections did not allow to choose keys with null/undefined value(s).
- **Fixed** a bug in `createFormData` where values of nested object(s) incorrectly converted to lowercase. Process `date-like object(s)` more efficiently in both utilities.

## [4.12.31] - 2025-06-10

- **Added** new utility to convert number or numeric string to ordinal word.
- **Updated** JSDoc for some types.
- **Upgraded** TypeScript version to `5.8.3` and other dev-dependencies.

## [4.12.28-30] - 2025-06-06

- **Resolved** a compile-time `not-assignable` error that occurred when optional properties were present in parameters of `sanitizeData`, `createFormData`, and other utility functions.
- **Added** additional utility types and integrated them into various parts of the package to improve type safety and maintainability.

## [4.12.27] - 2025-06-02

- **Updated** [README](README.md).
- **Added** new utility types, can be imported from `'nhb-toolbox/utils/types'`.

## [4.12.25-26] - 2025-06-02

- **Updated** JSDoc for some `Chronos` methods and exposed `INTERNALS` Symbol

## [4.12.24] - 2025-06-01

### 🕧 Updates for Chronos

- **Reduced** bloat by moving *rarely used* `Chronos` methods to plugin system.
- **Changed** plugin import paths as `import { somePlugin } from nhb-toolbox/plugins/somePlugin` format so the users can assume the path easily.
- **Updated** parameter type for `isBusinessHour` method: instead of multiple parameters can accept one options object now.

## [4.12.23] - 2025-06-01

### 🕧 Updates for Chronos

- All *plugin* imports now use statement like `import { somePlugin } from 'nhb-toolbox/plugins/plugin-path';`
- **Updated** `getZodiacSign` method: includes 2 presets `western` and `vedic` with aliases `tropical` and `sidereal`.
- **Fixed** issues in `getZodiacSign` method which previously could not parse some date/month range.

## [4.12.21-beta.2] - 2025-05-31

- **Updated** `types.mjs` script for updating the exports fields for plugins in `package.json`.

## [4.12.21-beta.1] - 2025-05-31

- **Updated** `getZodiacSign` method: includes 2 presets `western` and `vedic`.
- **Fixed** issues in `getZodiacSign` method.
- Experimenting with exporting each Chronos plugin as separate module from the respective locations.

## [4.12.20] - 2025-05-31

### 🕧 Released Plugin System for Chronos

- Plugin injection system for Chronos is now fully functional.

## [4.12.13-beta.1] - 2025-05-31

- **Created** more plugins for resource heavy methods of `Chronos`.

## [4.12.13-alpha.2] - 2025-05-30

- **Solved** experimental plugin export/import issues.

## [4.12.13-alpha.1] - 2025-05-30

### 🕧 Experimenting with Plugin System for Chronos

- **Introduced** plugin injection in `Chronos` class. Started with `season` method. Will make convert more methods if this is successful after publishing.

## [4.12.12] - 2025-05-30

### 🕧 Updates in Chronos

- **Added** new method `season` to get the name of the season for current Chronos instance. It has configurable options.
- All `Chronos` methods that use `#format` method internally now accepts escape tokens and new token `ZZ` is introduced to include timezone offset (or Z for UTC time) in the formatted date string.
- **Updated** some type names such as `Hours` ➡️ `ClockHour`, `Minutes` ➡️ `ClockMinute`, `Time` ➡️ `ClockTIme` etc. But the core definitions remain the same.

## [4.12.10] - 2025-05-30

### 🕧 New Chronos Methods

- **Added** 2 new instance methods in `Chronos`, `day` and `monthName` to get day and month names respectively.

### ℹ️ [README](README.md)

- **Added** `Signature Utilities` section in `README.md`

## [4.12.8] - 2025-05-29

### Types

- **Added** new types `Enumerate` and `NumberRange` to generate number literals like `0 | 1 | 2 | ... | 998`.
- **Implemented** both types in few cases where a return type is number and limited to a range, especially in color and number related functions and `Color` & `Chronos` classes.

### Method Changed in Chronos

- `isoWeekday` is now `isoWeekDay`
- Some method logic changed internally

---

## [4.12.7] - 2025-05-28

### Docs

- ➕ Introduced `CHANGELOG.md`

## [4.12.6] - 2025-05-28

### Added

- ➕ `Chronos.getDatesFromDay()` — a new static method to retrieve all matching dates for a given day of the week.

### Fixed

- 🐛 Minor internal issues and stability improvements.

---

## [4.12.0] - 2025-05-28

### ⚠️ Breaking Changes

- ⚠️ **Deprecation Notice**: All versions below `4.12.0` are now marked as deprecated
- ♻️ **Build System**: Switched from `tsup` back to `tsc` for building the library to resolve compatibility and output issues.

### Fixed

- 🛠️ Resolved ESM import issues by adding missing `.js` extensions in internal paths.
- 🧩 Improved module resolution in strict ESM-only environments.

### Improved

- 🌲 Full **tree-shaking support** for ESM builds (CommonJS remains unaffected).
  - 🌲 *From the beginning the library was tree-shakable* but now it's **properly tree-shakable** for ESM builds.
  - 📦 CommonJS (`cjs`) build remains unaffected and stable.
