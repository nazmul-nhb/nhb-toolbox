import { formatUnitWithPlural } from '../string/convert';
import { $Base } from './base';
import { UNIT_MAP } from './constants';
import type { ConverterFormatOptions, UnitMap } from './types';

/**
 * @class $Temperature
 * @description Temperature-specific conversions with smart `.to()` and formatting.
 */
export class $Temperature extends $Base<UnitMap['temp']> {
	/**
	 * @private
	 * @description Conversion helpers between Celsius, Fahrenheit, and Kelvin.
	 */
	static #toCelsius(value: number, from: UnitMap['temp']): number {
		switch (from) {
			case 'fahrenheit':
				return (value - 32) * (5 / 9);
			case 'kelvin':
				return value - 273.15;
			default:
				return value;
		}
	}

	static #fromCelsius(value: number, to: UnitMap['temp']): number {
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
	to(target: UnitMap['temp']): number {
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
	 * @instance Formats the converted temperature.
	 * @param target Target temperature unit.
	 * @param options Formatting options.
	 * @returns Formatted string.
	 */
	formatTo(target: UnitMap['temp'], options?: ConverterFormatOptions): string {
		const value = this.to(target);
		const { style = 'plural', decimals = 2 } = options ?? {};
		const rounded = Number(value.toFixed(decimals));

		switch (style) {
			case 'compact': {
				const shortLabels: Record<UnitMap['temp'], string> = {
					celsius: '°C',
					fahrenheit: '°F',
					kelvin: 'K',
				};
				return `${rounded}${shortLabels[target]}`;
			}
			case 'scientific':
				return `${value.toExponential(decimals)} ${target}`;
			default:
				return formatUnitWithPlural(rounded, target);
		}
	}

	/**
	 * @instance Converts to all temperature units at once.
	 * @returns Object containing all unit conversions.
	 */
	toAll(): Record<UnitMap['temp'], number> {
		const result = {} as Record<UnitMap['temp'], number>;

		for (const unit of UNIT_MAP.temp) {
			result[unit] = this.to(unit);
		}

		return result;
	}
}
