import { isNonEmptyString } from '../guards/primitives';
import { isBase64 } from '../guards/specials';
import { _padStartWith0, _splitByCharLength } from './helpers';
import { base64ToBytes, bytesToBase64, bytesToUtf8, utf8ToBytes } from './utils';

export class TextCodec {
	static isValidHex(hex: string): boolean {
		return /^[\da-fA-F\s]+$/.test(hex) && hex.replace(/\s+/g, '').length % 2 === 0;
	}

	static isValidBinary(binary: string): boolean {
		return /^[01\s]+$/.test(binary) && binary.replace(/\s+/g, '').length % 8 === 0;
	}

	static utf8ToHex(text: string, spaced = true) {
		return [...utf8ToBytes(text)]
			.map((b) => _padStartWith0(b, 'hex'))
			.join(spaced ? ' ' : '');
	}

	static utf8ToBinary(text: string, spaced = true) {
		return [...utf8ToBytes(text)]
			.map((b) => _padStartWith0(b, 'binary'))
			.join(spaced ? ' ' : '');
	}

	static hexToUtf8(hex: string) {
		if (!this.isValidHex(hex)) return '';

		const bytes = _splitByCharLength(hex, 2).map((h) => parseInt(h, 16));

		return bytesToUtf8(new Uint8Array(bytes));
	}

	static binaryToUtf8(binary: string) {
		if (!this.isValidBinary(binary)) return '';

		const bytes = _splitByCharLength(binary, 8).map((b) => parseInt(b, 2));

		return bytesToUtf8(new Uint8Array(bytes));
	}

	static hexToBinary(hex: string, spaced = true) {
		if (!this.isValidHex(hex)) return '';

		return _splitByCharLength(hex, 2)
			.map((h) => _padStartWith0(parseInt(h, 16), 'binary'))
			.join(spaced ? ' ' : '');
	}

	static binaryToHex(binary: string, spaced = true) {
		if (!this.isValidBinary(binary)) return '';

		return _splitByCharLength(binary, 8)
			.map((b) => _padStartWith0(parseInt(b, 2), 'hex'))
			.join(spaced ? ' ' : '');
	}

	static base64ToUtf8(b64: string): string {
		if (!isBase64(b64)) return '';

		return bytesToUtf8(base64ToBytes(b64));
	}

	static utf8ToBase64(text: string): string {
		if (!isNonEmptyString(text)) return '';

		return bytesToBase64(utf8ToBytes(text));
	}

	static base64ToHex(b64: string, spaced = true) {
		return this.utf8ToHex(this.base64ToUtf8(b64), spaced);
	}

	static base64ToBinary(b64: string, spaced = true) {
		return this.utf8ToBinary(this.base64ToUtf8(b64), spaced);
	}

	static hexToBase64(hex: string) {
		return this.utf8ToBase64(this.hexToUtf8(hex));
	}

	static binaryToBase64(binary: string) {
		return this.utf8ToBase64(this.binaryToUtf8(binary));
	}
}
