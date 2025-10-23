import type { Numeric } from '../types/index';
import type { $Unit } from './types';

/**
 * @description Base class providing common mathematical and formatting utilities
 * for all unit converters (time, length, data, temperature, etc.).
 */
export class $BaseConverter<U extends $Unit> {
	protected readonly value: number;
	protected readonly unit: U;

	/**
	 * Convert value to other units
	 * @param value Number or numeric string value to convert.
	 * @param unit Optional base unit for the provided value.
	 */
	constructor(value: Numeric, unit?: U) {
		this.value = Number(value);
		this.unit = unit ?? ('' as U);
	}

	/** * Returns a grammatically correct unit string, prefixed with the number value. */
	protected $withPluralUnit(value?: number, unit?: $Unit): string {
		const abs = Math.abs(value ?? this.value);
		const u = unit ?? this.unit;

		const pluralized =
			abs <= 1 ? u
			: u ? `${u}s`
			: '';

		return `${abs} ${pluralized}`.trim();
	}

	/** * Rounds a numeric value to given decimal places. */
	protected $round(value: number, decimals = 2): number {
		const factor = 10 ** decimals;
		return Math.round(value * factor) / factor;
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
	getUnit(): U {
		return this.unit || ('unknown' as U);
	}

	/**
	 * @instance Returns the original value with formatted pluralized unit.
	 * @returns A string like "3 hours" or "1 minute".
	 */
	toString(): string {
		return this.$withPluralUnit();
	}

	/**
	 * @instance Returns a plain object representation.
	 * @returns An object with value and unit.
	 */
	toObject(): { value: number; unit: U } {
		return { value: this.value, unit: this.unit || ('unknown' as U) };
	}

	/**
	 * @instance Converts to JSON representation.
	 * @returns JSON string of `{ value, unit }`.
	 */
	toJSON(): string {
		return JSON.stringify(this.toObject());
	}

	/**
	 * @instance Returns a new instance with the absolute value.
	 */
	abs(): this {
		return new (this.constructor as new (v: number, u: U) => this)(
			Math.abs(this.value),
			this.unit
		);
	}

	/**
	 * @instance Adds a numeric value (same unit assumed).
	 * @returns A new instance with updated value.
	 */
	add(n: Numeric): this {
		return new (this.constructor as new (v: number, u: U) => this)(
			this.value + Number(n),
			this.unit
		);
	}

	/**
	 * @instance Subtracts a numeric value (same unit assumed).
	 * @returns A new instance with updated value.
	 */
	subtract(n: Numeric): this {
		return new (this.constructor as new (v: number, u: U) => this)(
			this.value - Number(n),
			this.unit
		);
	}

	/**
	 * @instance Multiplies the value.
	 * @returns A new instance with updated value.
	 */
	multiply(n: Numeric): this {
		return new (this.constructor as new (v: number, u: U) => this)(
			this.value * Number(n),
			this.unit
		);
	}

	/**
	 * @instance Divides the value.
	 * @returns A new instance with updated value.
	 */
	divide(n: Numeric): this {
		return new (this.constructor as new (v: number, u: U) => this)(
			this.value / Number(n),
			this.unit
		);
	}

	/**
	 * @instance Rounds to given decimal places.
	 * @param decimals Number of decimal places to round.
	 * @returns A new instance with rounded value.
	 */
	round(decimals = 0): this {
		const rounded = this.$round(this.value, decimals);
		return new (this.constructor as new (v: number, u: U) => this)(rounded, this.unit);
	}

	/** * @instance Returns whether this value is greater than another numeric value. */
	gt(n: Numeric): boolean {
		return this.value > Number(n);
	}

	/** * @instance Returns whether this value is less than another numeric value. */
	lt(n: Numeric): boolean {
		return this.value < Number(n);
	}

	/** * @instance Returns whether this value equals another numeric value. */
	eq(n: Numeric): boolean {
		return this.value === Number(n);
	}

	/**
	 * @instance Returns a human-friendly formatted string with fixed decimals.
	 * @param decimals Number of decimal places.
	 * @returns Formatted string.
	 */
	format(decimals = 2): string {
		return `${this.$round(this.value, decimals)} ${this.unit}`;
	}
}
