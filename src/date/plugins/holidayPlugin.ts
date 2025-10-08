type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		holiday(): void;
	}
}

/** * Plugin to inject `holiday` method */
export const holidayPlugin = (ChronosClass: MainChronos): void => {
	ChronosClass.prototype.holiday = function (this: ChronosConstructor): void {
		// Logic
	};
};

// class HolidaysRegistry {
// 	private registry: Map<string, HolidayDef[]> = new Map();
// 	private overrides: Map<string, Date[]> = new Map();

// 	/**
// 	 * Register a holiday definition for a given country / region
// 	 */
// 	add(country: string, def: HolidayDef): void {
// 		const arr = this.registry.get(country) ?? [];
// 		arr.push(def);
// 		this.registry.set(country, arr);
// 	}

// 	/**
// 	 * Override (set) explicit holiday dates (one-offs)
// 	 */
// 	override(country: string, dates: Date[]): void {
// 		this.overrides.set(country, dates);
// 	}

// 	/**
// 	 * Get all holiday dates in given year, including overrides & computed ones
// 	 */
// 	getHolidays(country: string, year: number): Date[] {
// 		const out: Date[] = [];
// 		// add overrides
// 		const o = this.overrides.get(country);
// 		if (o) {
// 			out.push(...o.filter((d) => d.getFullYear() === year));
// 		}
// 		// add computed ones
// 		const defs = this.registry.get(country) ?? [];
// 		for (const def of defs) {
// 			out.push(...def.getDates(year));
// 		}
// 		// (optional) sort & dedupe
// 		return Array.from(new Set(out.map((d) => d.toISOString()))).map((s) => new Date(s));
// 	}

// 	/**
// 	 * Check if a given date is a holiday
// 	 */
// 	isHoliday(country: string, date: Date): boolean {
// 		const year = date.getFullYear();
// 		const list = this.getHolidays(country, year);
// 		return list.some(
// 			(d) =>
// 				d.getFullYear() === date.getFullYear() &&
// 				d.getMonth() === date.getMonth() &&
// 				d.getDate() === date.getDate()
// 		);
// 	}
// }
