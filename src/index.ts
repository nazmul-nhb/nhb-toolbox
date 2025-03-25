// ! String Utilities
export {
	capitalizeString,
	generateRandomID,
	trimString,
	truncateString,
} from './string/basics';

export { generateAnagrams } from './string/anagram';

export { convertStringCase, replaceAllInString } from './string/convert';

// ! Number Utilities
export {
	calculateHCF as calculateGCD,
	calculateHCF,
	calculateLCM as calculateLCD,
	calculateLCM,
	convertToDecimal,
	getRandomNumber,
	isEven,
	isMultiple,
	isOdd,
} from './number/basics';

export { numberToWords } from './number/convert';

export { findPrimeNumbers, isPrime } from './number/prime';

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

export { Color } from './colors/Color';

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
	removeDuplicatesFromArray,
} from './array/transform';

// ! Form Utilities
export { convertIntoFormData, isEmptyFormData } from './form/convert';

export { createControlledFormData } from './form/transform';

export {
	isCustomFile,
	isCustomFileArray,
	isFileUpload,
	isOriginFileObj,
} from './form/guards';

// ! Object Utilities
export {
	cloneObject,
	countObjectFields,
	generateQueryParams,
	isEmptyObject,
	isObject,
} from './object/basics';

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
	isArray,
	isArrayOfType,
	isBigInt,
	isDate,
	isError,
	isFunction,
	isJSON,
	isJSON as isValidJSON,
	isJSON as isJSONObject,
	isMap,
	isMap as isValidMap,
	isEmptyObject as isObjectEmpty,
	isObjectWithKeys,
	isPromise,
	isRegExp,
	isReturningPromise,
	isSet,
	isSet as isValidSet,
	isObject as isValidObject,
} from './guards/non-primitives';

// ! Special Type Guards
export {
	isBrowser,
	isDateString,
	isEmail,
	isEmail as isValidEmail,
	isEmailArray,
	isUUID,
	isBase64,
	isEnvironment,
	isIPAddress,
	isNode,
	isNumericString,
	isPhoneNumber,
	isURL,
	isURL as isValidURL,
} from './guards/specials';
