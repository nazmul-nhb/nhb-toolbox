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
	maskString,
	normalizeString,
	replaceAllInString,
	reverseString,
	slugifyString,
} from './string/convert';

export {
	extractNumbersFromString,
	getLevenshteinDistance,
	getLevenshteinDistance as levenshteinDistance,
} from './string/utilities';

// ! Number Utilities
export {
	calculateHCF as calculateGCD,
	calculateHCF,
	calculateLCM as calculateLCD,
	calculateLCM,
	convertToDecimal,
	getFibonacciSeries as getFibonacci,
	getFibonacciSeries as getFibonacciNumbers,
	getFibonacciSeries,
	getRandomNumber,
	sumNumbers as getSumOfNumbers,
	reverseNumber,
	sumDigits,
	sumNumbers,
	sumNumbers as sumOfNumbers,
} from './number/basics';

export {
	isEven,
	isEven as isEvenNumber,
	isFibonacci,
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
} from './number/convert';

export {
	findPrimeNumbers,
	findPrimeNumbers as getPrimeNumbers,
	isPrime,
	isPrime as isPrimeNumber,
} from './number/prime';

export {
	clampNumber,
	formatCurrency as convertNumberToCurrency,
	formatCurrency,
	getRandomFloat as getRandomDecimal,
	getRandomFloat,
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

export { isValidTime, isValidTime as isValidTimeString } from './date/guards';

export { Chronos, Chronos as Chronus } from './date/Chronos';

export {
	chronos,
	chronos as chronosjs,
	chronos as chronosts,
	chronos as chronus,
	chronos as chronusjs,
	chronos as chronusts,
	extractHourMinute,
	getCurrentDateTime,
	getCurrentDateTime as getCurrentTime,
	getTotalMinutes,
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

export { sortAnArray } from './array/sort';

export {
	createOptionsArray,
	moveArrayElement,
	removeDuplicatesFromArray,
	rotateArray,
	splitArray,
} from './array/transform';

// ! Form Utilities
export {
	createControlledFormData as convertIntoFormData,
	createControlledFormData,
	createControlledFormData as createFormData,
} from './form/convert';

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
} from './object/objectify';

export { sanitizeData } from './object/sanitize';

export { convertObjectValues } from './object/convert';

// ! DOM Utilities
export {
	generateQueryParams,
	getQueryParams,
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
	debounceAction,
	isDeepEqual,
	throttleAction,
} from './utils';

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
