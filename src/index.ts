/**
 * Copyright 2025 Nazmul Hassan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// ! String Utilities
export {
	capitalizeString,
	generateRandomID,
	trimString,
	truncateString,
} from './string/basics';

export { generateAnagrams } from './string/anagram';

export {
	isCamelCase,
	isEmojiOnly,
	isKebabCase,
	isPalindrome,
	isPascalCase,
	isSnakeCase,
} from './string/guards';

export {
	convertStringCase,
	extractEmails,
	extractURLs,
	formatUnitWithPlural as formatNumberWithPluralUnit,
	formatUnitWithPlural,
	formatUnitWithPlural as formatWithPlural,
	maskString,
	normalizeString,
	replaceAllInString,
	reverseString,
	slugifyString,
} from './string/convert';

export {
	countWords,
	countWords as countWordsInString,
	extractNumbersFromString as extractNumbers,
	extractNumbersFromString,
	getLevenshteinDistance,
	getLevenshteinDistance as levenshteinDistance,
	extractNumbersFromString as parseNumbersFromText,
	countWords as wordCount,
} from './string/utilities';

// ! Number Utilities
export {
	getAverage as calculateAverage,
	calculateHCF as calculateGCD,
	calculateHCF,
	calculateLCM as calculateLCD,
	calculateLCM,
	convertToDecimal,
	convertToDecimal as convertToFixed,
	getAverage,
	getAverage as getAverageOfNumbers,
	getRandomNumber as getRandomInt,
	getRandomNumber,
	sumNumbers as getSumOfNumbers,
	reverseNumber,
	sumDigits,
	sumNumbers,
	sumNumbers as sumOfNumbers,
} from './number/basics';

export { Currency } from './number/Currency';

export { Unit, Unit as UnitConverter } from './number/Unit';

export { calculatePercentage } from './number/percent';

export {
	fibonacciGenerator,
	fibonacciGenerator as generateFibonacci,
	getFibonacciSeries as getFibonacci,
	getFibonacciSeries as getFibonacciNumbers,
	getFibonacciSeries,
	getFibonacciSeriesMemo,
	getFibonacciSeriesMemo as getMemoizedFibonacci,
	getFibonacciSeriesMemo as getMemoizedFibonacciSeries,
	getNthFibonacci,
} from './number/fibonacci';

export {
	areInvalidNumbers,
	isEven,
	isEven as isEvenNumber,
	isFibonacci,
	areInvalidNumbers as isInvalidNumbers,
	isMultiple,
	isOdd,
	isOdd as isOddNumber,
	isFibonacci as isParOfFibonacci,
	isFibonacci as isParOfFibonacciSeries,
	isPerfectSquare,
} from './number/guards';

export {
	numberToWords as convertNumberToWords,
	convertToRomanNumerals,
	numberToWords,
	convertToRomanNumerals as numericToRoman,
	convertToRomanNumerals as toRoman,
	convertToRomanNumerals as numberToRoman,
	convertToRomanNumerals as integerToRoman,
	convertToRomanNumerals as toRomanNumeral,
} from './number/convert';

export {
	findPrimeNumbers,
	findPrimeNumbers as getPrimeNumbers,
	isPrime,
	isPrime as isPrimeNumber,
} from './number/prime';

export {
	getOrdinal as cardinalToOrdinal,
	clampNumber,
	formatCurrency as convertNumberToCurrency,
	getOrdinal as convertNumberToOrdinal,
	getOrdinal as convertToOrdinal,
	formatCurrency,
	getOrdinal,
	getOrdinal as getOrdinalNumber,
	getRandomFloat as getRandomDecimal,
	getRandomFloat,
	getOrdinal as numberToOrdinal,
	roundToNearest as roundNumber,
	roundToNearest as roundNumberToNearestInterval,
	roundToNearest,
	roundToNearest as roundToNearestInterval,
} from './number/utilities';

export { getNumbersInRange } from './number/range';

// ! Color Utilities
export { getColorForInitial } from './colors/initials';

export {
	generateRandomColorInHexRGB,
	generateRandomHSLColor,
} from './colors/random';

export {
	convertColorCode,
	convertHex8ToHsla,
	convertHex8ToRgba,
	convertHexToHsl,
	convertHexToRgb,
	convertHslaToHex8,
	convertHslaToRgba,
	convertHslToHex,
	convertHslToRgb,
	convertRgbaToHex8,
	convertRgbaToHsla,
	convertRgbToHex,
	convertRgbToHsl,
	convertRgbToRgba,
} from './colors/convert';

export { Color, Color as Colour } from './colors/Color';

// ! Date & Time Utilities
export {
	getGreeting as generateGreeting,
	getGreeting,
	getGreeting as greet,
} from './date/greet';

export {
	isLeapYear,
	isValidTime,
	isValidTime as isValidTimeString,
	isValidUTCOffSet as isValidUTC,
	isValidUTCOffSet,
} from './date/guards';

export { Chronos, Chronos as Chronus } from './date/Chronos';

export {
	chronos,
	chronos as chronosjs,
	chronos as chronosts,
	chronos as chronus,
	chronos as chronusjs,
	chronos as chronusts,
} from './date/chronos-fn';

export {
	formatUTCOffset as convertMinutesToUTCOffset,
	extractHourMinute,
	extractMinutesFromUTC,
	extractTimeFromUTC,
	extractTimeFromUTC as extractTimeStringFromUTC,
	getTotalMinutes as extractTotalMinutesFromTime,
	formatUTCOffset,
	getCurrentDateTime,
	getCurrentDateTime as getCurrentTime,
	extractMinutesFromUTC as getMinutesFromUTC,
	extractTimeFromUTC as getTimeStringFromUTC,
	getTotalMinutes,
	getTotalMinutes as getTotalMinutesFromTime,
	extractMinutesFromUTC as getTotalMinutesFromUTC,
	formatUTCOffset as minutesToUTCOffset,
} from './date/utils';

// ! Array Utilities
export {
	filterArrayOfObjects,
	flattenArray,
	getLastArrayElement,
	isInvalidOrEmptyArray,
	isInvalidOrEmptyArray as isValidEmptyArray,
	shuffleArray,
} from './array/basics';

export { Finder } from './array/Finder';

export { sortAnArray } from './array/sort';

export {
	createOptionsArray,
	getDuplicates as extractDuplicates,
	getDuplicates as extractDuplicatesFromArray,
	findMissingElements as extractMissingElements,
	findMissingElements,
	getDuplicates,
	getDuplicates as getDuplicatesFromArray,
	findMissingElements as getMissingElements,
	moveArrayElement,
	removeDuplicatesFromArray as removeDuplicates,
	removeDuplicatesFromArray,
	rotateArray,
	splitArray,
} from './array/transform';

export {
	naturalSort as compareNaturally,
	naturalSort as compareSorter,
	naturalSort,
	naturalSort as naturalSortForString,
} from './array/utils';

// ! Form Utilities
export {
	createControlledFormData as convertIntoFormData,
	createControlledFormData,
	createControlledFormData as createFormData,
} from './form/convert';

export { parseFormData, serializeForm } from './form/transform';

export {
	isCustomFile,
	isCustomFileArray,
	isFileArray,
	isFileList,
	isFileUpload,
	isOriginFileObj,
	isValidFormData,
} from './form/guards';

// ! Object Utilities
export { cloneObject, countObjectFields } from './object/basics';

export {
	extractNewFields,
	extractUpdatedAndNewFields,
	extractUpdatedFields,
	flattenObjectDotNotation,
	flattenObjectKeyValue,
	mergeAndFlattenObjects,
	mergeObjects,
	parseJsonToObject,
} from './object/objectify';

export {
	parseObjectValues,
	parseObjectValues as parsePrimitiveData,
	parseObjectValues as parsePrimitives,
	parseObjectValues as parseStringifiedObjectValues,
	parseObjectValues as parseStringifiedPrimitives,
	parseObjectValues as parseStringifiedValues,
	sanitizeData,
} from './object/sanitize';

export {
	convertObjectValues,
	pickFields,
	pickObjectFieldsByCondition as pickFieldsByCondition,
	pickFields as pickObjectFields,
	pickObjectFieldsByCondition,
	remapFields,
	remapFields as remapObjectFields,
} from './object/convert';

// ! DOM Utilities
export {
	generateQueryParams as createQueryParams,
	generateQueryParams as formatQueryParams,
	generateQueryParams,
	getQueryParams,
	parseQueryString as getQueryStringAsObject,
	parseQueryString,
	parseQueryString as queryStringToObject,
	updateQueryParam,
} from './dom/query';

export { copyToClipboard, smoothScrollTo, toggleFullScreen } from './dom/utils';

export {
	getFromLocalStorage,
	getFromSessionStorage,
	removeFromLocalStorage,
	removeFromSessionStorage,
	saveToLocalStorage,
	saveToSessionStorage,
} from './dom/storage';

// ! Other Utilities
export {
	convertArrayToString,
	countInstanceMethods,
	countStaticMethods,
	debounceAction,
	deepParsePrimitives,
	getClassDetails,
	getInstanceMethodNames,
	countInstanceMethods as getInstanceMethodsCount,
	getStaticMethodNames,
	countStaticMethods as getStaticMethodsCount,
	isDeepEqual,
	parseJSON,
	parseJSON as parseJsonDeep,
	deepParsePrimitives as parsePrimitivesDeep,
	throttleAction,
} from './utils';

export { Paginator } from './utils/Paginator';

// ! Primitive Type Guards
export {
	isBoolean,
	isFalsy,
	isInteger,
	isNonEmptyString,
	isNull,
	isNumber,
	isPositiveInteger,
	isPrimitive,
	isString,
	isSymbol,
	isTruthy,
	isUndefined,
} from './guards/primitives';

// ! Non-Primitive Type Guards
export {
	isReturningPromise as doesReturnPromise,
	isArray,
	isArrayOfType,
	isValidArray as isArrayWithLength,
	isBigInt,
	isDate,
	isEmptyObject,
	isEmptyObject as isEmptyObjectGuard,
	isError,
	isFunction,
	isJSON,
	isJSON as isJSONObject,
	isMap,
	isMethodDescriptor as isMethod,
	isMethodDescriptor,
	isNotEmptyObject,
	isObject,
	isEmptyObject as isObjectEmpty,
	isObjectWithKeys,
	isPromise,
	isRegExp,
	isRegExp as isRegularExpression,
	isReturningPromise,
	isSet,
	isValidArray,
	isJSON as isValidJSON,
	isMap as isValidMap,
	isNotEmptyObject as isValidObject,
	isSet as isValidSet,
} from './guards/non-primitives';

// ! Special Type Guards
export {
	isBase64,
	isBrowser,
	isDateString,
	isEmail,
	isEmailArray,
	isEnvironment,
	isEnvironment as isExpectedNodeENV,
	isIPAddress,
	isNode,
	isEnvironment as isNodeENV,
	isEnvironment as isNodeEnvironment,
	isNumericString,
	isPhoneNumber,
	isURL,
	isUUID,
	isEmail as isValidEmail,
	isURL as isValidURL,
} from './guards/specials';
