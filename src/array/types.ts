/** - Flatten Array */
export type Flatten<T> = T extends (infer U)[] ? Flatten<U> : T;

/** - Select Options */
export interface SelectOptions {
	value: string;
	label: string;
}

/**  */
// export interface 