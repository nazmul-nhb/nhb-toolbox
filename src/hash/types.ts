import type { TimeWithUnit } from '../date/types';
import type { GenericObject } from '../object/types';
import type { Branded, Numeric } from '../types/index';

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

export type VerifiedResult<T extends GenericObject = GenericObject> =
	| { isValid: true; payload: TokenPayload<T> }
	| { isValid: false; error: string };

export type TokenOptions = {
	alg?: 'HS256';
	typ?: 'JWT';
	expiresIn?: TimeWithUnit | Numeric;
};

export type TokenPayload<T extends GenericObject = GenericObject> = {
	iat: number;
	exp: number | null;
} & T;

export type DecodedToken<T extends GenericObject = GenericObject> = {
	header: TokenOptions;
	payload: TokenPayload<T>;
	signature: string;
	signingInput: string;
};
