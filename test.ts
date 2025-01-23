import { capitalizeString, truncateString } from './src/string';

const result1 = capitalizeString(`mo mOm`, {
	capitalizeEachFirst: true,
	capitalizeAll: true,
});

const result2 = truncateString(`momOm`, 3);

console.info(result2);
