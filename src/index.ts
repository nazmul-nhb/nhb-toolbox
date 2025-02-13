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

export { getNumbersInRange } from './number/range';

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

export { Color } from './colors/Color';

export { extractNumbersFromColor } from './colors/helpers';

export {
	filterArrayOfObjects,
	flattenArray,
	isValidButEmptyArray,
	shuffleArray,
} from './array/basics';

export { sortAnArray } from './array/sort';

export { createOptionsArray } from './array/transform';

export { convertIntoFormData, isEmptyFormData } from './form/convert';

export { createControlledFormData } from './form/transform';

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

export { convertArrayToString, isDeepEqual } from './utils';
