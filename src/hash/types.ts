import type { Branded } from '../types/index';

/** UUID versions as number from `1-8` */
export type $UUIDVersion = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** UUID versions as string from `v1-v8` */
export type UUIDVersion = `v${$UUIDVersion}`;

/** Supported UUID versions (without `v2`) as string */
export type SupportedVersion = `v${Exclude<$UUIDVersion, 2>}`;

/** General 5 parts UUID string type */
export type $UUID = `${string}-${string}-${string}-${string}-${string}`;

/** General 5 parts UUID string as {@link Branded} type */
export type UUID<V extends UUIDVersion> = Branded<$UUID, V>;

/** * Options for generating UUID for `v3` and `v5` */
export interface $UUIDOptionsV3V5<V extends 'v3' | 'v5'> extends $UUIDOptions<V> {
	/** Namespace for `v3` and `v5` UUID (must be another valid UUID) */
	namespace: $UUID;
	/** Name for `v3` and `v5` UUID (must be a non-empty string) */
	name: string;
}

/** * General Options for generating UUID */
export interface $UUIDOptions<V extends SupportedVersion = 'v4'> {
	/** UUID version, default `'v4'` */
	version?: V | SupportedVersion;
	/** Whether to use uppercase characters (default `false`) */
	uppercase?: boolean;
}

/** * Options for generating UUID */
export type UUIDOptions<V extends SupportedVersion = 'v4'> =
	V extends 'v3' | 'v5' ? $UUIDOptionsV3V5<V> : $UUIDOptions<V>;

/** Type representing decoded UUID info */
export interface DecodedUUID {
	/** Original UUID */
	raw: UUID<UUIDVersion>;
	/** Plain version of the UUID without hyphens (`-`) */
	plain: string;
	/** Version of the UUID as number */
	version: $UUIDVersion;
	/** Variant of the UUID */
	variant: 'NCS' | 'RFC4122' | 'Microsoft' | 'Future';
	/** Single integer value of the UUID in bigint */
	singleInt: bigint;
	/** Timestamp for `v1`, `v6`, `v7` and `v8` (in ms since epoch) */
	timestamp?: number;
	/** v1 node (MAC) */
	node?: string;
}

type $Years = 'years' | 'year' | 'yrs' | 'yr' | 'y';
type $Months = 'months' | 'month' | 'mo';
type $Weeks = 'weeks' | 'week' | 'w';
type $Days = 'days' | 'day' | 'd';
type $Hours = 'hours' | 'hour' | 'hrs' | 'hr' | 'h';
type $Minutes = 'minutes' | 'minute' | 'mins' | 'min' | 'm';
type $Seconds = 'seconds' | 'second' | 'secs' | 'sec' | 's';
type $Milliseconds = 'milliseconds' | 'millisecond' | 'msecs' | 'msec' | 'ms';

export type $Unit =
	| $Years
	| $Months
	| $Weeks
	| $Days
	| $Hours
	| $Minutes
	| $Seconds
	| $Milliseconds;

type UnitAnyCase = Capitalize<$Unit> | Uppercase<$Unit> | $Unit;

export type TimeWithUnit = `${number}` | `${number}${UnitAnyCase}` | `${number} ${UnitAnyCase}`;
