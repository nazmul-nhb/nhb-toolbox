import {
	capitalizeString,
	flattenArray,
	generateRandomID,
	truncateString,
} from './src';

import { getColorForFirstCharacter } from './src';

const result1 = capitalizeString(`mo mOm`, {
	capitalizeEachFirst: true,
	capitalizeAll: true,
});

const result2 = truncateString(`momOm`, 3);

const result3 = generateRandomID({ caseOption: 'upper' });

const result4 = getColorForFirstCharacter([5, [45, 75, ['a', 2, 'd']]], 30);

const result5 = flattenArray([5, [45, 75, ['a', { a: 2 }, 'd']]]);

console.info(result5);
