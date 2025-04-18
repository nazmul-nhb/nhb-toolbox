import type { UnitKey } from './types';

/**
 * @class Represents a measurable unit and supports conversions between various types of units.
 *
 * Includes static methods for:
 * - Length: meters, feet, kilometers, miles
 * - Mass: kilograms, pounds, grams, ounces
 * - Temperature: Celsius, Fahrenheit, Kelvin
 * - Volume: liters, gallons
 * - Area: square meters, square feet
 * - Speed: km/h, mph
 * - Time: hours, minutes, seconds, days
 * - Digital Storage: kilobytes, megabytes, gigabytes
 * - Energy: joules, calories
 * - Pressure: atm, pascals
 * - Frequency: Hz, kHz
 */
export class Unit {
	#value: number;
	#unit?: UnitKey;

	/**
	 * * Creates an instance of the Unit class.
	 * @param value The numeric value to work with.
	 * @param unit The unit type of the value (e.g., 'kg', 'm', 'kb').
	 */
	constructor(value: number, unit?: UnitKey) {
		this.#value = value;
		this.#unit = unit;
	}

	/**
	 * @instance Returns the original value with unit (if passed in the constructor).
	 * @returns A string in the format "value unit".
	 */
	toString(): string {
		return `${this.#value} ${this.#unit ?? ''}`.trim();
	}

	/**
	 * @instance Converts the value using a static method name from the Unit class.
	 *
	 * *Provides IntelliSense and type safety for method selection.*
	 *
	 * @param methodName - A key of Unit class static method accepting a number and returning a number.
	 * @returns The converted numeric value.
	 */
	convert<T extends keyof typeof Unit>(
		methodName: T,
	): (typeof Unit)[T] extends (value: number) => number ? number : never {
		const method = Unit[methodName];

		if (typeof method !== 'function') {
			throw new Error(`Method ${methodName} is not a valid method!`);
		}

		// @ts-expect-error -_-
		return method(this.#value);
	}

	// ----- Static Conversion Methods -----

	/** Converts meters to feet. */
	static metersToFeet(m: number): number {
		return m * 3.28084;
	}

	/** Converts feet to meters. */
	static feetToMeters(ft: number): number {
		return ft / 3.28084;
	}

	/** Converts kilometers to miles. */
	static kmToMiles(km: number): number {
		return km * 0.621371;
	}

	/** Converts miles to kilometers. */
	static milesToKm(mi: number): number {
		return mi / 0.621371;
	}

	/** Converts kilograms to pounds. */
	static kgToLbs(kg: number): number {
		return kg * 2.20462;
	}

	/** Converts pounds to kilograms. */
	static lbsToKg(lbs: number): number {
		return lbs / 2.20462;
	}

	/** Converts grams to ounces. */
	static gramsToOunces(g: number): number {
		return g * 0.035274;
	}

	/** Converts ounces to grams. */
	static ouncesToGrams(oz: number): number {
		return oz / 0.035274;
	}

	/** Converts Celsius to Fahrenheit. */
	static celsiusToFahrenheit(c: number): number {
		return (c * 9) / 5 + 32;
	}

	/** Converts Fahrenheit to Celsius. */
	static fahrenheitToCelsius(f: number): number {
		return ((f - 32) * 5) / 9;
	}

	/** Converts Celsius to Kelvin. */
	static celsiusToKelvin(c: number): number {
		return c + 273.15;
	}

	/** Converts Kelvin to Celsius. */
	static kelvinToCelsius(k: number): number {
		return k - 273.15;
	}

	/** Converts liters to gallons. */
	static litersToGallons(l: number): number {
		return l * 0.264172;
	}

	/** Converts gallons to liters. */
	static gallonsToLiters(gal: number): number {
		return gal / 0.264172;
	}

	/** Converts square meters to square feet. */
	static sqmToSqft(sqm: number): number {
		return sqm * 10.7639;
	}

	/** Converts square feet to square meters. */
	static sqftToSqm(sqft: number): number {
		return sqft / 10.7639;
	}

	/** Converts kilometers per hour to miles per hour. */
	static kmphToMph(kmph: number): number {
		return kmph * 0.621371;
	}

	/** Converts miles per hour to kilometers per hour. */
	static mphToKmph(mph: number): number {
		return mph / 0.621371;
	}

	/** Converts hours to minutes. */
	static hoursToMinutes(h: number): number {
		return h * 60;
	}

	/** Converts minutes to seconds. */
	static minutesToSeconds(m: number): number {
		return m * 60;
	}

	/** Converts days to hours. */
	static daysToHours(d: number): number {
		return d * 24;
	}

	/** Converts megabytes to gigabytes. */
	static mbToGb(mb: number): number {
		return mb / 1024;
	}

	/** Converts gigabytes to megabytes. */
	static gbToMb(gb: number): number {
		return gb * 1024;
	}

	/** Converts kilobytes to megabytes. */
	static kbToMb(kb: number): number {
		return kb / 1024;
	}

	/** Converts joules to calories. */
	static joulesToCalories(j: number): number {
		return j * 0.239006;
	}

	/** Converts calories to joules. */
	static caloriesToJoules(cal: number): number {
		return cal / 0.239006;
	}

	/** Converts atmospheres to pascals. */
	static atmToPascal(atm: number): number {
		return atm * 101325;
	}

	/** Converts pascals to atmospheres. */
	static pascalToAtm(pa: number): number {
		return pa / 101325;
	}

	/** Converts hertz to kilohertz. */
	static hzToKHz(hz: number): number {
		return hz / 1000;
	}

	/** Converts kilohertz to hertz. */
	static kHzToHz(khz: number): number {
		return khz * 1000;
	}
}
