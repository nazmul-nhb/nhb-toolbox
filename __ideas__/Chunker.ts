import { utf8ToBytes, bytesToUtf8 } from '../src/hash/utils';
import { isNonEmptyString } from '../src/guards/primitives';

/**
 * @class `Chunker` provides deterministic utilities to split strings and byte arrays into fixed-size or logical chunks.
 * *
 * @example
 * Chunker.string('hello world', 5); // ['hello', ' worl', 'd']
 * Chunker.bytes(new Uint8Array([1, 2, 3, 4]), 2); // [[1,2], [3,4]]
 */
export class Chunker {
	private constructor() {}

	/**
	 * @static Splits a string into fixed-length chunks by UTF-16 code units.
	 *
	 * @param text - Input string to split
	 * @param size - Number of characters per chunk (must be > 0)
	 * @returns Array of string chunks
	 *
	 * @example
	 * Chunker.string('abcdef', 2); // ['ab', 'cd', 'ef']
	 */
	static string(text: string, size: number): string[] {
		if (size <= 0 || !isNonEmptyString(text)) return [];

		const chunks: string[] = [];

		for (let i = 0; i < text.length; i += size) {
			chunks.push(text.slice(i, i + size));
		}

		return chunks;
	}

	/**
	 * @static Splits a UTF-8 string into chunks based on byte length (UTF-8 safe).
	 *
	 * @param text - UTF-8 text to split
	 * @param byteSize - Maximum bytes per chunk (must be > 0)
	 * @returns Array of UTF-8–safe string chunks
	 *
	 * @example
	 * Chunker.utf8('ভাষা', 3); // [ 'ভ', 'া', 'ষ', 'া' ]
	 */
	static utf8(text: string, byteSize: number): string[] {
		if (byteSize <= 0 || !isNonEmptyString(text)) return [];

		const bytes = utf8ToBytes(text);
		const chunks: string[] = [];

		for (let i = 0; i < bytes.length; i += byteSize) {
			const slice = bytes.slice(i, i + byteSize);
			chunks.push(bytesToUtf8(slice));
		}

		return chunks;
	}

	/**
	 * @static Splits a byte array into fixed-size byte chunks.
	 *
	 * @param bytes - Input byte array
	 * @param size - Number of bytes per chunk (must be > 0)
	 * @returns Array of Uint8Array chunks
	 *
	 * @example
	 * Chunker.bytes(new Uint8Array([1, 2, 3, 4]), 2);
	 * // [Uint8Array([1,2]), Uint8Array([3,4])]
	 */
	static bytes(bytes: Uint8Array, size: number): Uint8Array[] {
		if (size <= 0 || bytes.length === 0) return [];

		const chunks: Uint8Array[] = [];
		for (let i = 0; i < bytes.length; i += size) {
			chunks.push(bytes.slice(i, i + size));
		}
		return chunks;
	}

	/**
	 * @static Splits a string by a delimiter and removes empty segments.
	 *
	 * @param text - Input string
	 * @param delimiter - Delimiter to split by
	 * @returns Array of non-empty string segments
	 *
	 * @example
	 * Chunker.byDelimiter('a,,b,c', ','); // ['a', 'b', 'c']
	 */
	static byDelimiter(text: string, delimiter: string): string[] {
		if (!isNonEmptyString(text) || !isNonEmptyString(text)) return [];

		return text.split(delimiter).filter(Boolean);
	}

	/**
	 * @static Creates sliding window chunks over a byte array.
	 *
	 * @param bytes - Input byte array
	 * @param windowSize - Size of each window (must be > 0)
	 * @returns Array of overlapping byte windows
	 *
	 * @example
	 * Chunker.sliding(new Uint8Array([1, 2, 3, 4]), 3);
	 * // [[1,2,3], [2,3,4]]
	 */
	static sliding(bytes: Uint8Array, windowSize: number): Uint8Array[] {
		if (windowSize <= 0 || bytes.length < windowSize) return [];

		const chunks: Uint8Array[] = [];
		for (let i = 0; i <= bytes.length - windowSize; i++) {
			chunks.push(bytes.slice(i, i + windowSize));
		}
		return chunks;
	}
}
