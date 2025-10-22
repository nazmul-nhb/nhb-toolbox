import { $Base } from './base';
import type { UnitMap } from './types';

/** * Temperature-specific conversions */
export class $Temperature extends $Base<UnitMap['temp']> {
	toCelsius(): number {
		if (this.unit === 'fahrenheit') return (this.value - 32) * (5 / 9);
		if (this.unit === 'kelvin') return this.value - 273.15;
		return this.value;
	}
}
