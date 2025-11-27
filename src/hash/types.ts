import type { Branded } from '../types/index';

/** Supported UUID versions */
export type UUIDVersion = 'v1' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7' | 'v8';

export type $UUID = `${string}-${string}-${string}-${string}-${string}`;

export type UUID<V extends UUIDVersion> = Branded<$UUID, V>;

export interface $UUIDOptionsV3V5<V extends 'v3' | 'v5'> extends $UUIDOptions<V> {
	/** Namespace for `v3` and `v5` UUID (must be another valid UUID) */
	namespace: $UUID;
	/** Name for `v3` and `v5` UUID (must be a non-empty string) */
	name: string;
}

export interface $UUIDOptions<V extends UUIDVersion = 'v4'> {
	/** UUID version, default `'v4'` */
	version?: V | UUIDVersion;
	/** Whether to use uppercase characters (default `false`) */
	uppercase?: boolean;
}

/** * Options for generating UUID */
export type UUIDOptions<V extends UUIDVersion = 'v4'> =
	V extends 'v3' | 'v5' ? $UUIDOptionsV3V5<V> : $UUIDOptions<V>;

/** Type representing decoded UUID info */
export interface DecodedUUID {
	/** Original UUID */
	raw: UUID<UUIDVersion>;
	/** Plain version of the UUID without `-` */
	plain: string;
	/** Version of the UUID */
	version: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
	/** Variant of the UUID */
	variant: 'NCS' | 'RFC4122' | 'Microsoft' | 'Future';
	/** Single integer value of the UUID in bigint */
	singleInt: bigint;
	/** Timestamp for v1, v6-8 (in ms since epoch) */
	timestamp?: number;
	/** v1 node (MAC) */
	node?: string;
}
