import type { $Record } from '../object/types';
import type { Numeric } from '../types/index';
import { $BaseConverter } from './base';
import { UNITS } from './constants';
import type { $TempUnit, ConverterFormatOptions } from './types';

/**
 * @class $Temperature
 * @description Temperature-specific conversions with smart `.to()` and formatting.
 */
export class $Temperature extends $BaseConverter<$TempUnit> {
	constructor(value: Numeric, unit: $TempUnit) {
		super(value, unit);
	}

	/**
	 * @private
	 * @description Conversion helpers between Celsius, Fahrenheit, and Kelvin.
	 */
	static #toCelsius(value: number, from: $TempUnit): number {
		switch (from) {
			case 'fahrenheit':
				return (value - 32) * (5 / 9);
			case 'kelvin':
				return value - 273.15;
			default:
				return value;
		}
	}

	static #fromCelsius(value: number, to: $TempUnit): number {
		switch (to) {
			case 'fahrenheit':
				return value * (9 / 5) + 32;
			case 'kelvin':
				return value + 273.15;
			default:
				return value;
		}
	}

	/**
	 * @instance Converts current value to Celsius.
	 * @returns Value in Celsius.
	 */
	toCelsius(): number {
		return $Temperature.#toCelsius(this.value, this.unit);
	}

	/**
	 * @instance Converts to target temperature unit.
	 * @param target Target temperature unit.
	 * @returns Numeric value in target unit.
	 */
	to(target: $TempUnit): number {
		const celsiusValue = this.toCelsius();

		return $Temperature.#fromCelsius(celsiusValue, target);
	}

	/**
	 * @instance Converts to Fahrenheit.
	 * @returns Value in Fahrenheit.
	 */
	toFahrenheit(): number {
		return this.to('fahrenheit');
	}

	/**
	 * @instance Converts to Kelvin.
	 * @returns Value in Kelvin.
	 */
	toKelvin(): number {
		return this.to('kelvin');
	}

	/**
	 * @instance Converts to all temperature units at once.
	 * @returns Object containing all unit conversions.
	 */
	toAll(): $Record<$TempUnit, number> {
		const result = {} as $Record<$TempUnit, number>;

		for (const unit of UNITS.temp) {
			result[unit] = this.to(unit);
		}

		return result;
	}

	/**
	 * @instance Formats the converted temperature.
	 * @param target Target temperature unit.
	 * @param options Formatting options.
	 * @returns Formatted string.
	 */
	formatTo(target: $TempUnit, options?: ConverterFormatOptions): string {
		const value = this.to(target);
		const { style = 'plural', decimals = 2 } = options ?? {};
		const rounded = Number(value.toFixed(decimals));

		switch (style) {
			case 'compact': {
				const shortLabels: $Record<$TempUnit, string> = {
					celsius: '°C',
					fahrenheit: '°F',
					kelvin: 'K',
				};
				return `${rounded}${shortLabels[target]}`;
			}
			case 'scientific':
				return `${value.toExponential(decimals)} ${target}`;
			default:
				return this.withPluralUnit(rounded, target);
		}
	}
}
