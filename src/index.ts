export {
	capitalizeString,
	generateRandomID,
	trimString,
	truncateString,
} from './string/basics';

export { generateAnagrams } from './string/anagram';

export { convertToDecimal, getRandomNumber } from './number/basics';

export { numberToWords } from './number/convert';

export { findPrimeNumbers, isPrime } from './number/prime';

export { getColorForInitial } from './colors/initials';

export {
	generateRandomColorInHexRGB,
	generateRandomHSLColor,
} from './colors/random';

export {
	convertColorCode,
	convertHexToHsl,
	convertHexToRgb,
	convertHslToHex,
	convertHslToRgb,
	convertRgbToHex,
	convertRgbToHsl,
} from './colors/convert';

export { extractNumbersFromColor } from './colors/helpers';

export {
	createOptionsArray,
	filterArrayOfObjects,
	flattenArray,
	sortAnArray,
} from './array/basics';

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
	flattenObject,
	mergeAndFlattenObjects,
	mergeObjects,
} from './object/objectify';

export { sanitizeData } from './object/sanitize';

export { convertObjectValues } from './object/convert';

export { isDeepEqual } from './utils';
