/** - Options for random number generator */
export interface RandomNumberOptions {
	/** Minimum number to start with. */
	min?: number;
	/** Maximum number to end with. */
	max?: number;
	/** Whether to include the minimum number. */
	includeMin?: boolean;
	/** Whether to include the maximum number. */
	includeMax?: boolean;
}

/** Decimal options for converting to decimal */
export interface DecimalOptions {
	/** Number of decimal places to round to. Defaults to `2`. */
	decimalPlaces?: number;
	/** If the return value is in `string` or `number`. Defaults to `false`. */
	isString?: boolean;
}
