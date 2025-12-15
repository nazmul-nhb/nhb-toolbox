import { _padStartWith0, _splitByCharLength } from './helpers';
import { bytesToUtf8, utf8ToBytes } from './utils';

export class UTF8 {
	static isValidHex(hex: string): boolean {
		return /^[\da-fA-F\s]+$/.test(hex) && hex.replace(/\s+/g, '').length % 2 === 0;
	}

	static isValidBinary(binary: string): boolean {
		return /^[01\s]+$/.test(binary) && binary.replace(/\s+/g, '').length % 8 === 0;
	}

	static textToHex(text: string, spaced = true) {
		return [...utf8ToBytes(text)]
			.map((b) => _padStartWith0(b, 'hex'))
			.join(spaced ? ' ' : '');
	}

	static textToBinary(text: string, spaced = true) {
		return [...utf8ToBytes(text)]
			.map((b) => _padStartWith0(b, 'binary'))
			.join(spaced ? ' ' : '');
	}

	static hexToText(hex: string) {
		const bytes = _splitByCharLength(hex, 2).map((h) => parseInt(h, 16));

		return bytesToUtf8(new Uint8Array(bytes));
	}

	static binaryToText(binary: string) {
		const bytes = _splitByCharLength(binary, 8).map((b) => parseInt(b, 2));

		return bytesToUtf8(new Uint8Array(bytes));
	}

	static hexToBinary(hex: string, spaced = true) {
		return _splitByCharLength(hex, 2)
			.map((h) => _padStartWith0(parseInt(h, 16), 'binary'))
			.join(spaced ? ' ' : '');
	}

	static binaryToHex(binary: string, spaced = true) {
		return _splitByCharLength(binary, 8)
			.map((b) => _padStartWith0(parseInt(b, 2), 'hex'))
			.join(spaced ? ' ' : '');
	}
}
