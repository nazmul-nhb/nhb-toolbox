import type { Country, HolidayDef, MonthDateString } from '../src/date/types';
import { isArray } from '../src/guards/non-primitives';

type ChronosConstructor = import('../src/date/Chronos').Chronos;
type MainChronos = typeof import('../src/date/Chronos').Chronos;

declare module '../src/date/Chronos' {
	interface Chronos {
		addHoliday(def: HolidayDef): void;
	}
}

/** * Plugin to inject `holiday` method */
export const holidayPlugin = (ChronosClass: MainChronos): void => {
	const registry = new HolidayRegistry();

	ChronosClass.prototype.addHoliday = function (
		this: ChronosConstructor,
		def: HolidayDef
	): void {
		registry.add(def.country, def);
	};
};

class HolidayRegistry {
	private registry: Map<Country, HolidayDef[]> = new Map();
	private overrides: Map<Country, Date[]> = new Map();

	/**
	 * Register a holiday definition for a given country / region
	 */
	add(country: Country, def: HolidayDef): void {
		const arr = this.registry.get(country) ?? [];
		arr.push(def);
		this.registry.set(country, arr);
	}

	/**
	 * Override (set) explicit holiday dates (one-offs)
	 */
	override(country: Country, dates: Date[]): void {
		this.overrides.set(country, dates);
	}

	/**
	 * Get all holiday dates in given year, including overrides & computed ones
	 */
	getHolidays(country: Country, year: number): Date[] {
		const out: Date[] = [];

		const currentYear = new Date().getFullYear();
		// add overrides
		const o = this.overrides.get(country);
		if (o) {
			out.push(...o.filter((d) => d.getFullYear() === year));
		}
		// add computed ones
		const defs = this.registry.get(country) ?? [];
		for (const def of defs) {
			out.push(
				...(isArray<MonthDateString>(def.dates) ?
					def.dates.map((d) => new Date(`${currentYear}-${d}`))
				:	def.dates(year))
			);
		}
		// (optional) sort & dedupe
		return Array.from(new Set(out.map((d) => d.toISOString()))).map((s) => new Date(s));
	}

	/**
	 * Check if a given date is a holiday
	 */
	isHoliday(country: Country, date: Date): boolean {
		const year = date.getFullYear();
		const list = this.getHolidays(country, year);
		return list.some(
			(d) =>
				d.getFullYear() === date.getFullYear() &&
				d.getMonth() === date.getMonth() &&
				d.getDate() === date.getDate()
		);
	}
}
