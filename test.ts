import { capitalizeString } from './src/string';

const result = capitalizeString(`mo mOm`, {
	capitalizeEachFirst: true,
	capitalizeAll:true
});

console.info(result);
