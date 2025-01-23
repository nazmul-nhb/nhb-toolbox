export interface CapitalizeOptions {
	/** If true, capitalizes the first letter of each word (space separated). Defaults to `false` */
	capitalizeEachFirst?: boolean;
	/** If true, ensures that the whole string is capitalized. Defaults to `false` */
	capitalizeAll?: boolean;
	/** If true, ensures that the rest of the string is lowercase. Defaults to `true` */
	lowerCaseRest?: boolean;
}
