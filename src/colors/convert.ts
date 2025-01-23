/**
 * Converts HSL to RGB color format.
 *
 * @param h - The hue component of the HSL color, in degrees (0 to 360).
 * @param s - The saturation component of the HSL color, as a percentage (0 to 100).
 * @param l - The lightness component of the HSL color, as a percentage (0 to 100).
 * @returns A string representing the color in RGB format (e.g., `rgb(255, 0, 0)`).
 */
export const convertHslToRgb = (h: number, s: number, l: number): string => {
	// Normalize the HSL values
	s /= 100;
	l /= 100;

	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;

	let r = 0,
		g = 0,
		b = 0;

	if (h >= 0 && h < 60) {
		r = c;
		g = x;
	} else if (h >= 60 && h < 120) {
		r = x;
		g = c;
	} else if (h >= 120 && h < 180) {
		g = c;
		b = x;
	} else if (h >= 180 && h < 240) {
		g = x;
		b = c;
	} else if (h >= 240 && h < 300) {
		r = x;
		b = c;
	} else if (h >= 300 && h < 360) {
		r = c;
		b = x;
	}

	// Convert RGB to 0-255 range and apply m
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Converts RGB to HSL color format.
 *
 * @param r - The red component of the RGB color, in the range 0 to 255.
 * @param g - The green component of the RGB color, in the range 0 to 255.
 * @param b - The blue component of the RGB color, in the range 0 to 255.
 * @returns A string representing the color in HSL format (e.g., `hsl(0, 100%, 50%)`).
 */
export const convertRgbToHsl = (r: number, g: number, b: number): string => {
	// Normalize the RGB values
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

	let h = 0,
		s = 0,
		l = (max + min) / 2;

	if (delta !== 0) {
		if (max === r) {
			h = (g - b) / delta;
		} else if (max === g) {
			h = (b - r) / delta + 2;
		} else {
			h = (r - g) / delta + 4;
		}

		s = delta / (1 - Math.abs(2 * l - 1));

		h *= 60;
		if (s === 0) l = Math.round(l * 100); // for pure colors
	} else {
		s = 0;
	}

	h = Math.round(h);
	s = Math.round(s * 100);
	l = Math.round(l * 100);

	return `hsl(${h}, ${s}%, ${l}%)`;
};

/**
 * Converts HSL to Hex color format.
 *
 * @param h - The hue component of the HSL color, in degrees (0 to 360).
 * @param s - The saturation component of the HSL color, as a percentage (0 to 100).
 * @param l - The lightness component of the HSL color, as a percentage (0 to 100).
 * @returns A string representing the color in Hex format (e.g., `#FF0000`).
 */
export const convertHslToHex = (h: number, s: number, l: number): string => {
	const rgb = convertHslToRgb(h, s, l);
	const [r, g, b] = rgb.match(/\d+/g)!.map((value) => parseInt(value, 10));

	return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase().padStart(6, '0')}`;
};

/**
 * Converts Hex to HSL color format.
 *
 * @param hex - A string representing the color in Hex format (e.g., `#FF0000`).
 * @returns A string representing the color in HSL format (e.g., `hsl(0, 100%, 50%)`).
 */
export const convertHexToHsl = (hex: string): string => {
	const hexCode = hex.replace('#', '');

	// Parse the hex value
	const r: number = parseInt(hexCode.slice(0, 2), 16);
	const g: number = parseInt(hexCode.slice(2, 4), 16);
	const b: number = parseInt(hexCode.slice(4, 6), 16);

	// Convert RGB to HSL
	return convertRgbToHsl(r, g, b);
};

/**
 * Converts RGB to Hex color format.
 *
 * @param r - The red component of the RGB color, in the range 0 to 255.
 * @param g - The green component of the RGB color, in the range 0 to 255.
 * @param b - The blue component of the RGB color, in the range 0 to 255.
 * @returns A string representing the color in Hex format (e.g., `#FF0000`).
 */
export const convertRgbToHex = (r: number, g: number, b: number): string => {
	return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase().padStart(6, '0')}`;
};

/**
 * Converts Hex to RGB color format.
 *
 * @param hex - A string representing the color in Hex format (e.g., `#FF0000`).
 * @returns A string representing the color in RGB format (e.g., `rgb(255, 0, 0)`).
 */
export const convertHexToRgb = (hex: string): string => {
	// Remove the # if present
	hex = hex.replace('#', '');

	// Parse the hex value
	const r: number = parseInt(hex.slice(0, 2), 16);
	const g: number = parseInt(hex.slice(2, 4), 16);
	const b: number = parseInt(hex.slice(4, 6), 16);

	return `rgb(${r}, ${g}, ${b})`;
};
