/** Supported UUID versions */
export type UUIDVersion = 'v1' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7';

export interface $UUIDOptionsV3V5<V extends UUIDVersion = 'v4'> extends $UUIDOptions<V> {
	/** Namespace for `v3`/`v5` UUID */
	namespace: string;
	/** Name for `v3`/`v5` UUID */
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
	version: 1 | 2 | 3 | 4 | 5 | 6 | 7;
	variant: 'NCS' | 'RFC4122' | 'Microsoft' | 'Future';
	timestamp?: number; // for v1 & v6 (in ms since epoch)
	node?: string; // v1 node (MAC)
	clockSeq?: number; // v1/v2 clock sequence
	raw: string; // original UUID
}
