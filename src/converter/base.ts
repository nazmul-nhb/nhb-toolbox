import type { Numeric } from '../types/index';
import { INVARIANT_UNITS, IRREGULAR_PLURALS, UNITS, Y_TO_IES } from './constants';
import type { $Unit, Category, FormatToOptions, Units, UnitsTuple } from './types';

/**
 * @description Base class providing common mathematical and formatting utilities
 * for all unit converters (time, length, data, temperature, etc.).
 */
export class $BaseConverter<Unit extends $Unit> {
	protected readonly value: number;
	protected readonly unit: Unit;

	/**
	 * Convert value to other units
	 * @param value Number or numeric string value to convert.
	 * @param unit Optional base unit for the provided value.
	 */
	constructor(value: Numeric, unit?: Unit) {
		this.value = Number(value);
		this.unit = unit ?? ('' as Unit);
	}

	/** @protected Returns a grammatically correct unit string, prefixed with the number value. */
	protected $withPluralUnit(value?: number, unit?: $Unit): string {
		const abs = Math.abs(value ?? this.value);
		const u = unit ?? this.unit;

		if (!u) return String(abs);

		let pluralized: string;

		if (abs === 1) {
			pluralized = u;
		} else if (IRREGULAR_PLURALS?.[u]) {
			pluralized = IRREGULAR_PLURALS[u];
		} else if (INVARIANT_UNITS.has(u)) {
			pluralized = u;
		} else if (u.endsWith('foot')) {
			pluralized = u.replace(/foot$/, 'feet');
		} else if (u.endsWith('inch')) {
			pluralized = u.replace(/inch$/, 'inches');
		} else {
			pluralized = Y_TO_IES.has(u) ? u.replace(/y$/, 'ies') : `${u}s`;
		}

		return `${abs} ${pluralized}`;
	}

	/** @protected Rounds a numeric value to given decimal places. */
	protected $round(value: number, decimals = 2): number {
		const factor = 10 ** decimals;
		return Math.round(value * factor) / factor;
	}

	/**
	 * @protected Shared formatter for all converters.
	 * @param value Converted value (already computed via `.to(target)`).
	 * @param target Target unit name.
	 * @param shortLabels Record of compact unit labels.
	 * @param options Formatting options.
	 * @returns Formatted string according to style (compact, plural, scientific).
	 */
	protected $formatTo(
		value: number,
		target: Unit,
		shortLabels: Record<Unit, string>,
		options: FormatToOptions | undefined
	): string {
		const { style = 'plural', decimals = 2 } = options ?? {};
		const rounded = this.$round(value, decimals);

		switch (style) {
			case 'compact':
				return `${rounded}${shortLabels[target]}`;
			case 'scientific':
				return `${value.toExponential(decimals)} ${target}`;
			default:
				return this.$withPluralUnit(rounded, target);
		}
	}

	/**
	 * @instance Returns the numeric value.
	 * @returns The raw numeric value without unit.
	 */
	valueOf(): number {
		return this.value;
	}

	/**
	 * @instance Returns the numeric value.
	 * @returns The raw numeric value without unit.
	 */
	getValue(): number {
		return this.value;
	}

	/**
	 * @instance Returns the unit name.
	 * @returns The current unit.
	 */
	getUnit(): Unit {
		return this.unit || ('unknown' as Unit);
	}

	/**
	 * @instance Returns the original value with formatted pluralized unit.
	 * @returns A string like `"3 hours"` or `"1 minute"` or `"3"` if no unit is provided.
	 *
	 * @remarks
	 * - This method is automatically called when the instance is used in a string context.
	 * - For complex and versatile pluralization, please refer to {@link https://toolbox.nazmul-nhb.dev/docs/utilities/string/pluralizer pluralizer} or {@link https://toolbox.nazmul-nhb.dev/docs/classes/Pluralizer Pluralizer Class} instead.
	 */
	toString(): string {
		return this.$withPluralUnit();
	}

	/**
	 * @instance Returns a plain object representation.
	 * @returns An object with value and unit.
	 */
	toObject(): { value: number; unit: Unit } {
		return { value: this.value, unit: this.unit || ('unknown' as Unit) };
	}

	/**
	 * @instance Converts to JSON representation.
	 * @returns JSON string of `{ value, unit }`.
	 */
	toJSON(): string {
		return JSON.stringify(this.toObject());
	}

	/** @instance Returns a new instance with the absolute value. */
	abs(): this {
		return new (this.constructor as new (v: number, u: Unit) => this)(
			Math.abs(this.value),
			this.unit
		);
	}

	/**
	 * @instance Adds a numeric value (same unit assumed).
	 * @returns A new instance with updated value.
	 */
	add(n: Numeric): this {
		return new (this.constructor as new (v: number, u: Unit) => this)(
			this.value + Number(n),
			this.unit
		);
	}

	/**
	 * @instance Subtracts a numeric value (same unit assumed).
	 * @returns A new instance with updated value.
	 */
	subtract(n: Numeric): this {
		return new (this.constructor as new (v: number, u: Unit) => this)(
			this.value - Number(n),
			this.unit
		);
	}

	/**
	 * @instance Multiplies the value.
	 * @returns A new instance with updated value.
	 */
	multiply(n: Numeric): this {
		return new (this.constructor as new (v: number, u: Unit) => this)(
			this.value * Number(n),
			this.unit
		);
	}

	/**
	 * @instance Divides the value.
	 * @returns A new instance with updated value.
	 */
	divide(n: Numeric): this {
		return new (this.constructor as new (v: number, u: Unit) => this)(
			this.value / Number(n),
			this.unit
		);
	}

	/**
	 * @instance Rounds to given decimal places.
	 * @param decimals Number of decimal places to round. Default is `0`.
	 * @returns A new instance with rounded value.
	 */
	round(decimals = 0): this {
		const rounded = this.$round(this.value, decimals);
		return new (this.constructor as new (v: number, u: Unit) => this)(rounded, this.unit);
	}

	/** @instance Returns whether this value is greater than another numeric value. */
	gt(n: Numeric): boolean {
		return this.value > Number(n);
	}

	/** @instance Returns whether this value is less than another numeric value. */
	lt(n: Numeric): boolean {
		return this.value < Number(n);
	}

	/** @instance Returns whether this value equals another numeric value. */
	eq(n: Numeric): boolean {
		return this.value === Number(n);
	}

	/**
	 * @instance Returns a human-friendly formatted string with fixed decimals (if the value is fraction).
	 * @param decimals Number of decimal places for fractional value.
	 * @returns Formatted string with proper unit pluralization.
	 *
	 * @remarks For complex and versatile pluralization, please refer to {@link https://toolbox.nazmul-nhb.dev/docs/utilities/string/pluralizer pluralizer} or {@link https://toolbox.nazmul-nhb.dev/docs/classes/Pluralizer Pluralizer Class} instead.
	 */
	format(decimals = 2): string {
		return this.$withPluralUnit(this.$round(this.value, decimals));
	}

	/**
	 * @instance Returns all supported units.
	 * @returns Array of supported unit strings.
	 */
	supportedUnits(): Units;

	/**
	 * @instance Returns all supported units for a specific category.
	 * @param category Category to filter units by.
	 * @returns Tuple of supported units for the specified category.
	 */
	supportedUnits<Cat extends Category>(category: Cat): UnitsTuple<Cat>;

	/**
	 * @instance Returns all supported units, optionally filtered by category.
	 * @param category Category to filter units by.
	 * @returns Array or tuple of supported unit strings.
	 */
	supportedUnits<Cat extends Category>(category?: Cat) {
		if (category && category in UNITS) {
			return [...UNITS[category]];
		}

		return Object.values(UNITS).flat();
	}
}
