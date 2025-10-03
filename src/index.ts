/**
 * Copyright 2025 - present Nazmul Hassan
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

export { convertStringCase } from './string/case';

export {
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

// ! Pluralizer Class and Its Default Instance
export { Pluralizer, pluralizer } from './pluralize/Pluralizer';

// ! Verbalizer Class and Its Default instance
export { Verbalizer, verbalizer } from './verbalizer/Verbalizer';

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
	roundNumber,
	roundNumber as roundToDecimal,
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
	areInvalidNumbers as areNumbersInvalid,
	isEven,
	isEven as isEvenNumber,
	isFibonacci,
	areInvalidNumbers as isInvalidNumber,
	isMultiple,
	areInvalidNumbers as isNumberInvalid,
	isOdd,
	isOdd as isOddNumber,
	isFibonacci as isPartOfFibonacci,
	isFibonacci as isPartOfFibonacciSeries,
	isPerfectSquare,
} from './number/guards';

export {
	numberToWordsOrdinal as cardinalWordsToOrdinal,
	numberToWords as convertNumberToWords,
	numberToWordsOrdinal as convertNumberToWordsOrdinal,
	convertToRomanNumerals,
	wordsToNumber as convertWordsToNumber,
	wordsToNumber as convertWordToNumber,
	convertToRomanNumerals as integerToRoman,
	convertToRomanNumerals as numberToRoman,
	numberToWords,
	numberToWordsOrdinal,
	convertToRomanNumerals as numericToRoman,
	convertToRomanNumerals as toRoman,
	convertToRomanNumerals as toRomanNumeral,
	wordsToNumber,
	wordsToNumber as wordToNumber,
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
	normalizeNumber,
	getOrdinal as numberToOrdinal,
	roundToNearest as roundNumberToNearestInterval,
	roundToNearest,
	roundToNearest as roundToNearestInterval,
} from './number/utilities';

export { getNumbersInRange } from './number/range';

// ! Color Utilities
export { getColorForInitial } from './colors/initials';

export { generateRandomColorInHexRGB, generateRandomHSLColor } from './colors/random';

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

export { extractAlphaColorValues, extractSolidColorValues } from './colors/utils';

// ! Date & Time Utilities
export {
	getGreeting as generateGreeting,
	getGreeting,
	getGreeting as greet,
} from './date/greet';

export {
	isDateLike,
	isLeapYear,
	isValidTime,
	isValidTime as isValidTimeString,
	isValidUTCOffSet as isValidUTC,
	isValidUTCOffSet,
} from './date/guards';

// ! Chronos
export { Chronos, Chronos as Chronus } from './date/Chronos';

// ! Chronos `INTERNALS` Symbol for plugin authors
export { INTERNALS } from './date/constants';

// ! Chronos wrapper function
export {
	chronos,
	chronos as chronosjs,
	chronos as chronosts,
	chronos as chronus,
	chronos as chronusjs,
	chronos as chronusts,
} from './date/chronos-fn';

// ! Other date/time utils
export {
	convertMinutesToTime as convertMinutesToHourMinutes,
	convertMinutesToTime,
	formatUTCOffset as convertMinutesToUTCOffset,
	extractHourMinute,
	extractMinutesFromUTC,
	extractTimeFromUTC,
	extractTimeFromUTC as extractTimeStringFromUTC,
	getTotalMinutes as extractTotalMinutesFromTime,
	formatUTCOffset,
	getCurrentDateTime,
	getCurrentDateTime as getCurrentTime,
	convertMinutesToTime as getHourMinutesFromMinutes,
	extractMinutesFromUTC as getMinutesFromUTC,
	convertMinutesToTime as getTimeFromMinutes,
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

export {
	averageByField,
	averageByField as avgByField,
	groupAndAverageByField,
	groupAndAverageByField as groupAndAvgByField,
	groupAndSumByField,
	sumByField,
	sumFieldDifference,
	sumFieldDifference as totalDeltaByField,
} from './array/calc';

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
	splitArrayByProperty as groupArrayByProperty,
	moveArrayElement,
	removeDuplicatesFromArray as removeDuplicates,
	removeDuplicatesFromArray,
	rotateArray,
	splitArray,
	splitArrayByProperty,
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
	isFileOrBlob,
	isFileUpload,
	isOriginFileObj,
	isValidFormData,
} from './form/guards';

// ! Object Utilities
export {
	cloneObject,
	countObjectFields,
	extractObjectKeys,
	extractObjectKeys as extractKeys,
	extractObjectKeysDeep,
	extractObjectKeysDeep as extractKeysDeep,
} from './object/basics';

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
	parseObjectValues as parseStringifiedObjectValues,
	sanitizeData,
} from './object/sanitize';

export {
	convertObjectValues,
	deleteFields,
	deleteFields as deleteObjectFields,
	deleteFields as omitFields,
	deleteFields as omitObjectFields,
	pickFields,
	pickObjectFieldsByCondition as pickFieldsByCondition,
	pickFields as pickObjectFields,
	pickObjectFieldsByCondition,
	remapFields,
	remapFields as remapObjectFields,
	deleteFields as removeFields,
	deleteFields as removeObjectFields,
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
	parseQueryStringLiteral,
	parseQueryStringLiteral as literalQueryStringToObject,
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
	convertArrayToString as joinArrayElements,
	parseJSON,
	parseJSON as parseJsonDeep,
	deepParsePrimitives as parsePrimitivesDeep,
	throttleAction,
} from './utils/index';

export { Paginator } from './utils/Paginator';

// ! Primitive Type Guards
export {
	isBigInt,
	isBoolean,
	isFalsy,
	isInteger,
	isNonEmptyString,
	isNormalPrimitive,
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

// ! HTTP Status
export { HttpStatus, httpStatus } from './http-status/HttpStatus';

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
