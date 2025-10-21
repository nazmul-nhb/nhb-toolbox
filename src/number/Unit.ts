import { PREFIX_MULTIPLIERS } from './constants';
import type { SIPrefix, UnitKey, UnitNumberMethods } from './types';

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
	readonly #value: number;
	readonly #unit?: UnitKey;

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
		return ` ${this.#value} ${this.#unit ?? ''}`.trim();
	}

	/**
	 * @instance Converts using scientific prefixes (e.g., kB to MB, mg to g).
	 *
	 * @param fromPrefix The SI prefix of the source unit.
	 * @param toPrefix The SI prefix of the target unit.
	 * @returns The converted numeric value.
	 */
	convertByPrefix(fromPrefix: SIPrefix, toPrefix: SIPrefix): number {
		return Unit.convertByPrefix(this.#value, fromPrefix, toPrefix);
	}

	/**
	 * @instance Converts from prefixed unit string to another (e.g., kB to MB, mg to g).
	 *
	 * @param from Prefixed unit string (e.g., 'kB', 'mg').
	 * @param to Target prefixed unit string (e.g., 'MB', 'g').
	 * @returns The converted numeric value.
	 */
	convertFromTo(from: string, to: string): number {
		return Unit.convertFromTo(this.#value, from, to);
	}

	/**
	 * @instance Converts the value using a static method name from the `Unit` class.
	 *
	 * - **N.B.** *Provides IntelliSense and type safety for method selection.*
	 *
	 * @param methodName - A static `Unit` method that accepts a number and returns a number.
	 * @returns The converted numeric value.
	 */
	convert(methodName: UnitNumberMethods): number {
		const method = Unit[methodName];

		if (typeof method !== 'function') {
			throw new Error(`Method ${methodName} is not a valid method!`);
		}

		return method(this.#value);
	}

	// ! ----- Static Conversion Methods ----- ! //

	/**
	 * @static Converts a value using scientific prefixes (e.g., kB to MB, mg to g).
	 *
	 * @param value The value to convert.
	 * @param fromPrefix The SI prefix of the source unit.
	 * @param toPrefix The SI prefix of the target unit.
	 * @returns The converted numeric value.
	 */
	static convertByPrefix(value: number, fromPrefix: SIPrefix, toPrefix: SIPrefix): number {
		const fromMultiplier = PREFIX_MULTIPLIERS[fromPrefix];
		const toMultiplier = PREFIX_MULTIPLIERS[toPrefix];

		return (value * fromMultiplier) / toMultiplier;
	}

	/**
	 * @static Converts from prefixed unit string to another (e.g., kB to MB, mg to g).
	 *
	 * @param value The numeric value.
	 * @param from Prefixed unit string (e.g., 'kB', 'mg').
	 * @param to Target prefixed unit string (e.g., 'MB', 'g').
	 * @returns The converted numeric value.
	 */
	static convertFromTo(value: number, from: string, to: string): number {
		const extractPrefix = (str: string): [SIPrefix, string] => {
			const match = str.match(/^(da|[yzafpnμumcdhkMGTPEZY]?)(.+)$/);
			if (!match) throw new Error(`Invalid unit format: ${str}`);

			return [match[1] as SIPrefix, match[2]];
		};

		const [fromPrefix, fromUnit] = extractPrefix(from);
		const [toPrefix, toUnit] = extractPrefix(to);

		if (fromUnit !== toUnit) {
			throw new Error(`Mismatched units: ${fromUnit} vs ${toUnit}`);
		}

		return Unit.convertByPrefix(value, fromPrefix, toPrefix);
	}

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

	/** Converts Fahrenheit to Kelvin. */
	static fahrenheitToKelvin(f: number): number {
		return ((f - 32) * 5) / 9 + 273.15;
	}

	/** Converts Kelvin to Fahrenheit. */
	static kelvinToFahrenheit(k: number): number {
		return ((k - 273.15) * 9) / 5 + 32;
	}

	/** Converts milliliters to liters. */
	static mlToLiters(ml: number): number {
		return ml / 1000;
	}

	/** Converts liters to milliliters. */
	static litersToMl(l: number): number {
		return l * 1000;
	}

	/** Converts gallons to milliliters. */
	static gallonsToMl(gal: number): number {
		return gal * 3785.41;
	}

	/** Converts milliliters to gallons. */
	static mlToGallons(ml: number): number {
		return ml / 3785.41;
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

	/** Converts minutes to hours. */
	static minutesToHours(min: number): number {
		return min / 60;
	}

	/** Converts seconds to minutes. */
	static secondsToMinutes(sec: number): number {
		return sec / 60;
	}

	/** Converts hours to days. */
	static hoursToDays(hr: number): number {
		return hr / 24;
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

	/** Converts kilobytes to gigabytes. */
	static kbToGb(kb: number): number {
		return kb / (1024 * 1024);
	}

	/** Converts gigabytes to kilobytes. */
	static gbToKb(gb: number): number {
		return gb * 1024 * 1024;
	}

	/** Converts bytes to kilobytes. */
	static bytesToKb(bytes: number): number {
		return bytes / 1024;
	}

	/** Converts kilobytes to bytes. */
	static kbToBytes(kb: number): number {
		return kb * 1024;
	}

	/** Converts megabytes to kilobytes. */
	static mbToKb(mb: number): number {
		return mb * 1024;
	}

	/** Converts gigabytes to terabytes. */
	static gbToTb(gb: number): number {
		return gb / 1024;
	}

	/** Converts terabytes to gigabytes. */
	static tbToGb(tb: number): number {
		return tb * 1024;
	}

	/** Converts joules to calories. */
	static joulesToCalories(j: number): number {
		return j * 0.239006;
	}

	/** Converts calories to joules. */
	static caloriesToJoules(cal: number): number {
		return cal / 0.239006;
	}

	/** Converts calories to kilojoules. */
	static caloriesToKJoules(cal: number): number {
		return cal / 0.239006 / 1000;
	}

	/** Converts kilojoules to calories. */
	static kJoulesToCalories(kj: number): number {
		return kj * 1000 * 0.239006;
	}

	/** Converts atmospheres to pascals. */
	static atmToPascal(atm: number): number {
		return atm * 101325;
	}

	/** Converts pascals to atmospheres. */
	static pascalToAtm(pa: number): number {
		return pa / 101325;
	}

	/** Converts bar to pascals. */
	static barToPascal(bar: number): number {
		return bar * 100000;
	}

	/** Converts pascals to bar. */
	static pascalToBar(pa: number): number {
		return pa / 100000;
	}

	/** Converts hertz to kilohertz. */
	static hzToKHz(hz: number): number {
		return hz / 1000;
	}

	/** Converts kilohertz to hertz. */
	static kHzToHz(khz: number): number {
		return khz * 1000;
	}

	/** Converts hertz to megahertz. */
	static hzToMHz(hz: number): number {
		return hz / 1_000_000;
	}

	/** Converts megahertz to hertz. */
	static mHzToHz(mhz: number): number {
		return mhz * 1_000_000;
	}

	/** Converts kilohertz to megahertz. */
	static kHzToMHz(khz: number): number {
		return khz / 1000;
	}

	/** Converts megahertz to kilohertz. */
	static mHzToKHz(mhz: number): number {
		return mhz * 1000;
	}

	/** Converts centimeters to meters. */
	static cmToMeters(cm: number): number {
		return cm / 100;
	}

	/** Converts meters to centimeters. */
	static metersToCm(m: number): number {
		return m * 100;
	}

	/** Converts millimeters to meters. */
	static mmToMeters(mm: number): number {
		return mm / 1000;
	}

	/** Converts meters to millimeters. */
	static metersToMm(m: number): number {
		return m * 1000;
	}

	/** Converts square kilometers to square meters. */
	static sqkmToSqm(sqkm: number): number {
		return sqkm * 1_000_000;
	}

	/** Converts square meters to square kilometers. */
	static sqmToSqkm(sqm: number): number {
		return sqm / 1_000_000;
	}

	/** Converts square feet to square inches. */
	static sqftToSqin(sqft: number): number {
		return sqft * 144;
	}

	/** Converts square inches to square feet. */
	static sqinToSqft(sqin: number): number {
		return sqin / 144;
	}

	/** Converts watts to kilowatts. */
	static wattsToKw(w: number): number {
		return w / 1000;
	}

	/** Converts kilowatts to watts. */
	static kwToWatts(kw: number): number {
		return kw * 1000;
	}
}
