/** - Options for capitalizeString function. */
export interface CapitalizeOptions {
	/** If true, capitalizes the first letter of each word (space separated). Defaults to `false`. */
	capitalizeEachFirst?: boolean;
	/** If true, ensures that the whole string is capitalized. Defaults to `false`. */
	capitalizeAll?: boolean;
	/** If true, ensures that the rest of the string is lowercase. Defaults to `true`. */
	lowerCaseRest?: boolean;
}

/** - Configuration options for ID generation. */
export interface RandomIdOptions {
	/** A string to prepend to the ID. Default is an empty string. */
	prefix?: string;

	/** A string to append to the ID. Default is an empty string.*/
	suffix?: string;

	/** Whether to include the current timestamp in the ID. Default is `false`. */
	timeStamp?: boolean;

	/** The length of the random alphanumeric string. Default is `16`. */
	length?: number;

	/** The separator to use between parts of the ID. Default is an empty string. */
	separator?: string;

	/** Specifies the case for the random alphanumeric string. */
	caseOption?: 'upper' | 'lower' | null;
}
