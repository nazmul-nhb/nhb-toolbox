import { capitalizeString } from './src/string';

const result = capitalizeString(`'tHIS IS A tEST sTRiNG'`, {
	capitalizeEachFirst: true,
	lowerCaseRest: true,
});

console.info(result);
