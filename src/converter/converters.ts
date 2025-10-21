import { formatUnitWithPlural } from '../string/convert';
import type { Numeric } from '../types/index';
import type { Unit, UnitMap } from './types';

/** * Base class that holds numeric value and source unit. */
export class $Base<U extends Unit> {
	protected readonly value: number;
	protected readonly unit: U;

	constructor(value: Numeric, unit?: U) {
		this.value = Number(value);
		this.unit = unit as U;
	}

	/**
	 * @instance Returns the original value with unit (if passed in the constructor).
	 * @returns A string in the format "value unit".
	 */
	toString(): string {
		return formatUnitWithPlural(this.value, this.unit ?? '');
	}
}

/** * Time-specific conversions */
export class $Time extends $Base<UnitMap['time']> {
	toMinutes(): number {
		if (this.unit === 'second') return this.value / 60;
		if (this.unit === 'hour') return this.value * 60;
		return this.value; // assume already in minutes
	}

	toHours(): number {
		if (this.unit === 'second') return this.value / 3600;
		if (this.unit === 'minute') return this.value / 60;
		return this.value;
	}
}

/** * Length-specific conversions */
export class $Length extends $Base<UnitMap['length']> {
	toMeters(): number {
		const factors: Record<UnitMap['length'], number> = {
			meter: 1,
			kilometer: 1000,
			mile: 1609.34,
			inch: 0.0254,
		};
		return this.value * factors[this.unit];
	}
}

/** * Data-specific conversions */
export class $Data extends $Base<UnitMap['data']> {
	toKilobytes(): number {
		const factors: Record<string, number> = {
			byte: 1 / 1024,
			kilobyte: 1,
			megabyte: 1024,
			gigabyte: 1024 * 1024,
		};
		return this.value * factors[this.unit];
	}
}

/** * Temperature-specific conversions */
export class $Temperature extends $Base<UnitMap['temp']> {
	toCelsius(): number {
		if (this.unit === 'fahrenheit') return (this.value - 32) * (5 / 9);
		if (this.unit === 'kelvin') return this.value - 273.15;
		return this.value;
	}
}
