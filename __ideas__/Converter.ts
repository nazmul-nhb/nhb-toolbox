type UnitMap = {
	time: 'second' | 'minute' | 'hour' | 'day';
	length: 'meter' | 'kilometer' | 'mile' | 'inch';
	data: 'byte' | 'kilobyte' | 'megabyte' | 'gigabyte';
	temperature: 'celsius' | 'fahrenheit' | 'kelvin';
};

type Category = keyof UnitMap;

type Unit = UnitMap[Category];

/**
 * Infer the category by unit name
 */
type InferCategory<U extends Unit> = {
	[K in keyof UnitMap]: U extends UnitMap[K] ? K : never;
}[keyof UnitMap];

/**
 * Base class that holds numeric value and source unit.
 */
class Base<U extends Unit> {
	protected readonly value: number;
	protected readonly unit: U;

	constructor(value: number, unit: U) {
		this.value = value;
		this.unit = unit;
	}
}

/**
 * Time-specific conversions
 */
class Time extends Base<UnitMap['time']> {
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

/**
 * Length-specific conversions
 */
class Length extends Base<UnitMap['length']> {
	toMeters(): number {
		const factors: Record<string, number> = {
			meter: 1,
			kilometer: 1000,
			mile: 1609.34,
			inch: 0.0254,
		};
		return this.value * factors[this.unit];
	}
}

/**
 * Data-specific conversions
 */
class Data extends Base<UnitMap['data']> {
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

/**
 * Temperature-specific conversions
 */
class Temperature extends Base<UnitMap['temperature']> {
	toCelsius(): number {
		if (this.unit === 'fahrenheit') return (this.value - 32) * (5 / 9);
		if (this.unit === 'kelvin') return this.value - 273.15;
		return this.value;
	}
}

export type Converted<U extends Unit> =
	InferCategory<U> extends 'time' ? Time
	: InferCategory<U> extends 'length' ? Length
	: InferCategory<U> extends 'data' ? Data
	: InferCategory<U> extends 'temperature' ? Temperature
	: never;

/**
 * Factory function that returns appropriate converter instance
 *
 * @description Converts values between compatible units (time, length, data, temperature).
 * The returned instance exposes only methods relevant to the provided unit type.
 */
export function Converter<U extends Unit>(value: number, unit: U): Converted<U> {
	const category = ((): Category => {
		if (['second', 'minute', 'hour', 'day'].includes(unit)) return 'time';
		if (['meter', 'kilometer', 'mile', 'inch'].includes(unit)) return 'length';
		if (['byte', 'kilobyte', 'megabyte', 'gigabyte'].includes(unit)) return 'data';
		if (['celsius', 'fahrenheit', 'kelvin'].includes(unit)) return 'temperature';
		throw new Error(`Unknown unit: ${unit}`);
	})();

	switch (category) {
		case 'time':
			return new Time(value, unit as UnitMap['time']) as Converted<U>;
		case 'length':
			return new Length(value, unit as UnitMap['length']) as Converted<U>;
		case 'data':
			return new Data(value, unit as UnitMap['data']) as Converted<U>;
		case 'temperature':
			return new Temperature(value, unit as UnitMap['temperature']) as Converted<U>;
	}
}
