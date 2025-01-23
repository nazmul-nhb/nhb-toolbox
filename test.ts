import {
	convertHexToHsl,
	convertHexToRgb,
	convertHslToHex,
	convertHslToRgb,
	convertRgbToHex,
	convertRgbToHsl,
	// capitalizeString,
	// createSelectOptions,
	// flattenArray,
	// generateRandomID,
	// truncateString,
	// getColorForFirstCharacter,
	// generateQueryParams,
	generateRandomColor,
} from './src';

// const result1 = capitalizeString(`mo mOm`, {
// 	capitalizeEachFirst: true,
// 	capitalizeAll: true,
// });

// const result2 = truncateString(`momOm`, 3);

// const result3 = generateRandomID({ caseOption: 'upper' });

// const result4 = getColorForFirstCharacter([5, [45, 75, ['a', 2, 'd']]], 30);

// const result5 = flattenArray([5, [45, 75, ['a', { a: 2 }, 'd']]]);

// const users = [
// 	{ id: 1, name: 'Alice', city: 'Banguland' },
// 	{ id: 2, name: null, city: 'Banguland' },
// 	{ id: 3, name: undefined, city: undefined },
// 	{ id: null, name: 'Bob', city: 'Banguland' },
// ];

// const result6 = createSelectOptions(users, 'id', 'city');

// const result7 = generateQueryParams({ key1: ['value1', 'value2'], key2: 42 });

const result8 = generateRandomColor();

console.info(result8);

// const hslColor = 'hsl(120, 50%, 60%)';
// const rgbColor = 'rgb(60, 150, 60)';
const hexColor = '#3c963c';

// HSL to RGB
const rgbFromHsl = convertHslToRgb(120, 50, 60);
console.info({ rgbFromHsl }); // rgb(60, 150, 60)

// RGB to HSL
const hslFromRgb = convertRgbToHsl(60, 150, 60);
console.info({ hslFromRgb }); // hsl(120, 50%, 60%)

// HSL to Hex
const hexFromHsl = convertHslToHex(120, 50, 60);
console.info({ hexFromHsl }); // #3C963C

// Hex to HSL
const hslFromHex = convertHexToHsl(hexColor);
console.info({ hslFromHex }); // hsl(120, 50%, 60%)

// RGB to Hex
const hexFromRgb = convertRgbToHex(60, 150, 60);
console.info({ hexFromRgb }); // #3C963C

// Hex to RGB
const rgbFromHex = convertHexToRgb(hexColor);
console.info({ rgbFromHex }); // rgb(60, 150, 60)
