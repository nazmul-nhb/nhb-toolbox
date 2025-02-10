export {
	capitalizeString,
	generateRandomID,
	trimString,
	truncateString,
} from './string/basics';

export { generateAnagrams } from './string/anagram';

export { convertToDecimal, getRandomNumber } from './number/basics';

export { numberToWords } from './number/convert';

export { isPrime, findPrimeNumbers } from './number/prime';

export { getColorForInitial } from './colors/initials';

export { generateRandomColor } from './colors/random';

export {
	convertHexToHsl,
	convertHexToRgb,
	convertHslToHex,
	convertHslToRgb,
	convertRgbToHex,
	convertRgbToHsl,
} from './colors/convert';

export {
	createOptionsArray,
	filterArrayOfObjects,
	flattenArray,
	sortAnArray,
} from './array/basics';

export {
	cloneObject,
	countObjectFields,
	flattenObject,
	generateQueryParams,
	isDeepEqual,
	isEmptyObject,
	mergeAndFlattenObjects,
	mergeObjects,
} from './object/basics';

export { sanitizeData } from './object/sanitize';

export { convertObjectValues } from './object/convert';
