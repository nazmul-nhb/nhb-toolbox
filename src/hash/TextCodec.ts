import { isNonEmptyString } from '../guards/primitives';
import { isBase64, isBinaryString, isHexString } from '../guards/specials';
import { _padStartWith0, _splitByCharLength } from './helpers';
import { base64ToBytes, bytesToBase64, bytesToUtf8, hexToBytes, utf8ToBytes } from './utils';

/**
 * @class `TextCodec` provides **UTF-8–safe** conversions between `text`, `hex`, `binary`, and `Base64` representations using byte-level transformations.
 *
 * @example
 * TextCodec.utf8ToHex('ভাষা'); // 'e0 a6 ad e0 a6 be e0 a6 b7 e0 a6 be'
 * TextCodec.hexToUtf8('e0 a6 ad e0 a6 be'); // 'ভা'
 */
export class TextCodec {
	private constructor() {}

	/**
	 * @static Validates whether a string represents a valid hexadecimal byte sequence.
	 *
	 * @param hex - Hex string, spaced or un-spaced (e.g. "ff 0a" or "ff0a")
	 * @returns `true` if the input is valid hex byte string
	 *
	 * @example
	 * TextCodec.isValidHex('ff 0a');
	 */
	static isValidHex(hex: string): boolean {
		return isHexString(hex);
	}

	/**
	 * @static Validates whether a string represents a valid binary byte sequence.
	 *
	 * @param binary - Binary string, spaced or un-spaced
	 * @returns `true` if the input is valid binary byte string
	 *
	 * @example
	 * TextCodec.isValidBinary('01000001');
	 */
	static isValidBinary(binary: string): boolean {
		return isBinaryString(binary);
	}

	/**
	 * @static Validates whether a string represents a valid Base64-encoded string.
	 *
	 * @param b64 - Base64 string to check
	 * @returns `true` if the input is valid Base64-encoded string
	 *
	 * @example
	 * TextCodec.isValidBase64('SGVsbG8=');
	 */
	static isValidBase64(b64: string): boolean {
		return isBase64(b64);
	}

	/**
	 * @static Converts UTF-8 text into hexadecimal byte representation.
	 *
	 * @param text - UTF-8 text to convert
	 * @param spaced - Whether to separate bytes with spaces, defaults to `true`
	 * @returns Hexadecimal byte string
	 *
	 * @example
	 * TextCodec.utf8ToHex('Hi');
	 */
	static utf8ToHex(text: string, spaced = true) {
		return [...utf8ToBytes(text)]
			.map((b) => _padStartWith0(b, 'hex'))
			.join(spaced ? ' ' : '');
	}

	/**
	 * @static Converts UTF-8 text into binary byte representation.
	 *
	 * @param text - UTF-8 text to convert
	 * @param spaced - Whether to separate bytes with spaces, defaults to `true`
	 * @returns Binary byte string
	 *
	 * @example
	 * TextCodec.utf8ToBinary('A');
	 */
	static utf8ToBinary(text: string, spaced = true) {
		return [...utf8ToBytes(text)]
			.map((b) => _padStartWith0(b, 'binary'))
			.join(spaced ? ' ' : '');
	}

	/**
	 * @static Converts hexadecimal byte string into UTF-8 text.
	 *
	 * @param hex - Hexadecimal byte string
	 * @returns Decoded UTF-8 text
	 *
	 * @example
	 * TextCodec.hexToUtf8('48 69');
	 */
	static hexToUtf8(hex: string) {
		return bytesToUtf8(hexToBytes(hex));
	}

	/**
	 * @static Converts binary byte string into UTF-8 text.
	 *
	 * @param binary - Binary byte string
	 * @returns Decoded UTF-8 text
	 *
	 * @example
	 * TextCodec.binaryToUtf8('01001000 01101001');
	 */
	static binaryToUtf8(binary: string) {
		if (!isBinaryString(binary)) return '';

		const bytes = _splitByCharLength(binary, 8).map((b) => parseInt(b, 2));

		return bytesToUtf8(new Uint8Array(bytes));
	}

	/**
	 * @static Converts hexadecimal byte string into binary byte string.
	 *
	 * @param hex - Hexadecimal byte string
	 * @param spaced - Whether to separate bytes with spaces, defaults to `true`
	 * @returns Binary byte string
	 *
	 * @example
	 * TextCodec.hexToBinary('ff');
	 */
	static hexToBinary(hex: string, spaced = true) {
		if (!isHexString(hex)) return '';

		return _splitByCharLength(hex, 2)
			.map((h) => _padStartWith0(parseInt(h, 16), 'binary'))
			.join(spaced ? ' ' : '');
	}

	/**
	 * @static Converts binary byte string into hexadecimal byte string.
	 *
	 * @param binary - Binary byte string
	 * @param spaced - Whether to separate bytes with spaces, defaults to `true`
	 * @returns Hexadecimal byte string
	 *
	 * @example
	 * TextCodec.binaryToHex('00000001');
	 */
	static binaryToHex(binary: string, spaced = true) {
		if (!isBinaryString(binary)) return '';

		return _splitByCharLength(binary, 8)
			.map((b) => _padStartWith0(parseInt(b, 2), 'hex'))
			.join(spaced ? ' ' : '');
	}

	/**
	 * @static Converts a Base64-encoded string into UTF-8 text.
	 *
	 * @param b64 - Base64 encoded string
	 * @returns Decoded UTF-8 text
	 *
	 * @example
	 * TextCodec.base64ToUtf8('SGVsbG8=');
	 */
	static base64ToUtf8(b64: string): string {
		if (!isBase64(b64)) return '';

		return bytesToUtf8(base64ToBytes(b64));
	}

	/**
	 * @static Converts UTF-8 text into a Base64-encoded string.
	 *
	 * @param text - UTF-8 text to encode
	 * @returns Base64 encoded string
	 *
	 * @example
	 * TextCodec.utf8ToBase64('Hello');
	 */
	static utf8ToBase64(text: string): string {
		if (!isNonEmptyString(text)) return '';

		return bytesToBase64(utf8ToBytes(text));
	}

	/**
	 * @static Converts Base64 directly into hexadecimal byte string.
	 *
	 * @param b64 - Base64 encoded string
	 * @param spaced - Whether to separate bytes with spaces, defaults to `true`
	 * @returns Hexadecimal byte string
	 *
	 * @example
	 * TextCodec.base64ToHex('SGVsbG8=');
	 */
	static base64ToHex(b64: string, spaced = true) {
		return this.utf8ToHex(this.base64ToUtf8(b64), spaced);
	}

	/**
	 * @static Converts Base64 directly into binary byte string.
	 *
	 * @param b64 - Base64 encoded string
	 * @param spaced - Whether to separate bytes with spaces, defaults to `true`
	 * @returns Binary byte string
	 *
	 * @example
	 * TextCodec.base64ToBinary('SGVsbG8=');
	 */
	static base64ToBinary(b64: string, spaced = true) {
		return this.utf8ToBinary(this.base64ToUtf8(b64), spaced);
	}

	/**
	 * @static Converts hexadecimal byte string into a Base64 string.
	 *
	 * @param hex - Hexadecimal byte string
	 * @returns Base64 encoded string
	 *
	 * @example
	 * TextCodec.hexToBase64('48 69');
	 */
	static hexToBase64(hex: string) {
		return this.utf8ToBase64(this.hexToUtf8(hex));
	}

	/**
	 * @static Converts binary byte string into a Base64 string.
	 *
	 * @param binary - Binary byte string
	 * @returns Base64 encoded string
	 *
	 * @example
	 * TextCodec.binaryToBase64('01001000 01101001');
	 */
	static binaryToBase64(binary: string) {
		return this.utf8ToBase64(this.binaryToUtf8(binary));
	}
}
