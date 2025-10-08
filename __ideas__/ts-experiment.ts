interface HolidayDef {
	/** A function (year) => Date(s) for that holiday in that year, or fixed dates */
	getDates: (year: number) => Date[];
	/** Human name / label, optional */
	name?: string;
	/** Region or country code, optional */
	region?: string;
}

class HolidaysRegistry {
	private registry: Map<string, HolidayDef[]> = new Map();
	private overrides: Map<string, Date[]> = new Map();

	/**
	 * Register a holiday definition for a given country / region
	 */
	add(country: string, def: HolidayDef): void {
		const arr = this.registry.get(country) ?? [];
		arr.push(def);
		this.registry.set(country, arr);
	}

	/**
	 * Override (set) explicit holiday dates (one-offs)
	 */
	override(country: string, dates: Date[]): void {
		this.overrides.set(country, dates);
	}

	/**
	 * Get all holiday dates in given year, including overrides & computed ones
	 */
	getHolidays(country: string, year: number): Date[] {
		const out: Date[] = [];
		// add overrides
		const o = this.overrides.get(country);
		if (o) {
			out.push(...o.filter((d) => d.getFullYear() === year));
		}
		// add computed ones
		const defs = this.registry.get(country) ?? [];
		for (const def of defs) {
			out.push(...def.getDates(year));
		}
		// (optional) sort & dedupe
		return Array.from(new Set(out.map((d) => d.toISOString()))).map((s) => new Date(s));
	}

	/**
	 * Check if a given date is a holiday
	 */
	isHoliday(country: string, date: Date): boolean {
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

// holiday plugin for Chronos
function holidaysPlugin(ChronosClass: any) {
	const registry = new HolidaysRegistry();

	ChronosClass._holidayRegistry = registry;

	/**
	 * Add a holiday definition (for region)
	 */
	ChronosClass.addHolidayDef = function (country: string, def: HolidayDef) {
		registry.add(country, def);
	};

	/**
	 * Override holiday dates
	 */
	ChronosClass.overrideHolidays = function (country: string, dates: Date[]) {
		registry.override(country, dates);
	};

	/**
	 * Instance method: is this date a holiday in given country?
	 */
	ChronosClass.prototype.isHoliday = function (country: string): boolean {
		const native = this.toDate();
		return registry.isHoliday(country, native);
	};

	/**
	 * Instance method: list holidays in given year for region
	 */
	ChronosClass.prototype.holidaysInYear = function (country: string, year?: number) {
		const y = year ?? this.year(); // however you get year from Chronos
		const dates = registry.getHolidays(country, y);
		return dates.map((d) => new ChronosClass(d));
	};
}
