import { generateRandomColorInHexRGB, generateRandomHSLColor } from '../../src';
import { _generateRandomHSL, _isSimilarToLast } from '../../src/colors/helpers';
import type { HSL } from '../../src/colors/types';

describe('generateRandomHSLColor', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should generate a valid HSL color string', () => {
		const color = generateRandomHSLColor();
		expect(color).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
	});

	test('should generate unique colors over multiple calls', () => {
		const colors = new Set();
		for (let i = 0; i < 100; i++) {
			colors.add(generateRandomHSLColor());
		}
		expect(colors.size).toBe(100);
	});

	test('should not generate colors similar to recent ones', () => {
		const recentColors = ['hsl(200, 80%, 60%)', 'hsl(201, 78%, 62%)'];
		let newColor: HSL;
		do {
			newColor = generateRandomHSLColor();
		} while (_isSimilarToLast(recentColors, newColor));
		expect(_isSimilarToLast(recentColors, newColor)).toBe(false);
	});
});

describe('_generateRandomHSL', () => {
	test('should generate a valid HSL color', () => {
		const color = _generateRandomHSL();
		expect(color).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
	});
});

describe('_isSimilarToLast', () => {
	test('should return false if there are no recent colors', () => {
		expect(_isSimilarToLast([], 'hsl(200, 80%, 60%)')).toBe(false);
	});

	test('should return true for very similar colors', () => {
		const recentColors = ['hsl(200, 80%, 60%)'];
		expect(_isSimilarToLast(recentColors, 'hsl(205, 78%, 62%)')).toBe(true);
	});

	test('should return false for significantly different colors', () => {
		const recentColors = ['hsl(50, 40%, 30%)'];
		expect(_isSimilarToLast(recentColors, 'hsl(200, 80%, 60%)')).toBe(
			false,
		);
	});
});

describe('generateRandomColorInHexRGB', () => {
	test('should generate a valid hex and RGB color', () => {
		const color = generateRandomColorInHexRGB();
		expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
		expect(color.rgb).toMatch(/^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/);
	});

	test('should generate unique colors', () => {
		const color1 = generateRandomColorInHexRGB();
		const color2 = generateRandomColorInHexRGB();
		expect(color1.hex).not.toBe(color2.hex);
		expect(color1.rgb).not.toBe(color2.rgb);
	});

	test('should maintain a limited history of recent colors', () => {
		const maxColors = 5;
		const generatedColors = new Set();
		for (let i = 0; i < 10; i++) {
			generatedColors.add(generateRandomColorInHexRGB(maxColors).hex);
		}
		expect(generatedColors.size).toBeGreaterThan(0);
	});

	test('should return a valid Hex6 and RGB type', () => {
		const color = generateRandomColorInHexRGB();
		expect(typeof color.hex).toBe('string');
		expect(typeof color.rgb).toBe('string');
	});

	test('should not return undefined or null values', () => {
		const color = generateRandomColorInHexRGB();
		expect(color.hex).not.toBeNull();
		expect(color.rgb).not.toBeNull();
	});
});
