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

/** Header for `Signet` */
export type TokenHeader = {
	/** Algorithm used. Currently supports `'HS256'` only */
	alg: 'HS256';
	/** Type of token. Fixed `'SIGNET+JWT'` */
	typ: 'SIGNET+JWT';
};

/** Options for token verification */
export type VerifyOptions = {
	/** Where the token is allowed to be used */
	audience?: string | string[];
	/** Who the token is about */
	subject?: string;
	/** From where/who the token is issued */
	issuer?: string;
};

/** Token signing options */
export interface SignOptions extends VerifyOptions {
	/**
	 * * Specifies when the token expires after issuing it.
	 *
	 * @remarks
	 * - A numeric value (number or numeric string ({@link Numeric})) is interpreted as seconds count, e.g., `120` or `'120'` will be treated as `'120 seconds'`.
	 * - If you use time value with unit ({@link TimeWithUnit}) be sure you provide the time units (days, hours, etc.), otherwise it will return `NaN`, e.g., `'120 unknown'` will return `NaN`.
	 */
	expiresIn?: TimeWithUnit | Numeric;
	/**
	 * * Specifies when the token becomes active/valid in the future.
	 *
	 * @remarks
	 * - A numeric value (number or numeric string ({@link Numeric})) is interpreted as seconds count, e.g., `120` or `'120'` will be treated as `'120 seconds'`.
	 * - If you use time value with unit ({@link TimeWithUnit}) be sure you provide the time units (days, hours, etc.), otherwise it will return `NaN`, e.g., `'120 unknown'` will return `NaN`.
	 */
	notBefore?: TimeWithUnit | Numeric;
}

/** Pattern of a valid 3-parts token */
export type TokenString = `${string}.${string}.${string}`;

/** Interface of token verification result if token is valid */
export type $ValidToken<T extends GenericObject = GenericObject> = {
	/** Whether the token is valid */
	isValid: true;
	/** Decoded payload after successful verification with common {@link TokenPayload} properties */
	payload: TokenPayload<T>;
};

/** Interface of token verification result if token is invalid */
export type $InvalidToken = {
	/** Whether the token is valid */
	isValid: false;
	/** Error message if the token is invalid */
	error: string;
};

/** Result of token verification */
export type VerifiedToken<T extends GenericObject = GenericObject> =
	| $ValidToken<T>
	| $InvalidToken;

export type TokenPayload<T extends GenericObject = GenericObject> = {
	/** When the token was created (unix timestamp in seconds) */
	iat: number;
	/** When the token was created (as JavaScript {@link Date}) */
	iatDate: Date;
	/** When the token expires (unix timestamp in seconds) */
	exp?: number;
	/** When the token expires (as JavaScript {@link Date}) */
	expDate?: Date;
	/** When the token becomes valid (unix timestamp in seconds) */
	nbf?: number;
	/** When the token becomes valid (as JavaScript {@link Date}) */
	nbfDate?: Date;
	/** Where the token is allowed to be used */
	aud?: string | string[];
	/** Who the token is about */
	sub?: string;
	/** From where/who the token is issued */
	iss?: string;
} & T;

/** Interface of a decoded token */
export type DecodedToken<T extends GenericObject = GenericObject> = {
	/** Token header info, algorithm, type etc. */
	header: TokenHeader;
	/** Decoded payload after with common {@link TokenPayload} properties */
	payload: TokenPayload<T>;
	/**
	 * The `Base64`-encoded signature from the token.
	 * This is the third part of the token string.
	 */
	signature: string;
	/** The header and payload in encrypted `Base64` format.*/
	signingInput: `${string}.${string}`;
};
