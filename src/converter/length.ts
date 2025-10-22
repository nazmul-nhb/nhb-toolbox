import { $Base } from './base';
import type { UnitMap } from './types';

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
