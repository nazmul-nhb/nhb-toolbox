import { $Base } from './base';
import type { UnitMap } from './types';

/** * Data-specific conversions */
export class $Data extends $Base<UnitMap['data']> {
	toKilobytes(): number {
		const factors: Record<UnitMap['data'], number> = {
			byte: 1 / 1024,
			kilobyte: 1,
			megabyte: 1024,
			gigabyte: 1024 * 1024,
		};
		return this.value * factors[this.unit];
	}
}
