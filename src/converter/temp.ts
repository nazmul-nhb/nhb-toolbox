import type { $Record } from '../object/types';
import type { Numeric } from '../types/index';
import { $BaseConverter } from './base';
import { UNITS } from './constants';
import type { $TempUnit, ConverterFormatOptions } from './types';

/**
 * @class TemperatureConverter
 * @description Handles conversions with smart `.to()`, `.toAll()`, and `.formatTo()`.
 */
export class $Temperature extends $BaseConverter<$TempUnit> {
	/**
	 * Convert temperature value to other temperature units
	 * @param value Number or numeric string value to convert.
	 * @param unit Base temperature unit for the provided value.
	 */
	constructor(value: Numeric, unit: $TempUnit) {
		super(value, unit);
	}

	/**
	 * @private
	 * @description Conversion helper from Fahrenheit and Kelvin to Celsius.
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

	/**
	 * @private
	 * @description Conversion helper from Celsius to Fahrenheit and Kelvin.
	 */
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
	 * @instance Converts to target temperature unit.
	 * @param target Target temperature unit.
	 */
	to(target: $TempUnit): number {
		const celsiusValue = $Temperature.#toCelsius(this.value, this.unit);

		return $Temperature.#fromCelsius(celsiusValue, target);
	}

	/**
	 * @instance Converts to all temperature units at once.
	 * @returns Object with all unit conversions.
	 */
	toAll(): $Record<$TempUnit, number> {
		const result = {} as $Record<$TempUnit, number>;

		for (const unit of UNITS.temp) {
			result[unit] = this.to(unit);
		}

		return result;
	}

	/**
	 * @instance Formats the converted value and unit.
	 * @param target Target unit to format to.
	 * @param options Formatting options.
	 * @returns Formatted string like "5°F", "5.25 kelvins", or "5e+3 celsius".
	 */
	formatTo(target: $TempUnit, options?: ConverterFormatOptions): string {
		const value = this.to(target);
		const { style = 'plural', decimals = 2 } = options ?? {};
		const rounded = this.$round(value, decimals);

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
				return this.$withPluralUnit(rounded, target);
		}
	}
}
