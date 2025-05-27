import { readFileSync } from 'fs';

/**
 * Converts a File object to a Base64 encoded string.
 * @param file - The file to convert.
 * @returns A Promise that resolves to the Base64 string of the file.
 */
export function fileToBase64(file: File | Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = () => {
			if (typeof reader.result === 'string') {
				resolve(reader.result.split(',')[1]); // Extract only the Base64 part
			} else {
				reject(new Error('Failed to convert file to Base64!'));
			}
		};

		reader.onerror = () => reject(new Error('Error reading the file!'));
	});
}

/**
 * Converts a file (from disk) to a Base64 encoded string in Node.js.
 * @param filePath - The path of the file.
 * @returns The Base64 encoded string of the file.
 */
export function fileToBase64Node(filePath: string): string {
	const fileBuffer = readFileSync(filePath);
	return fileBuffer.toString('base64');
}

/**
 * Creates a virtual file and returns its Base64 encoded content.
 * @param content - The string content of the file.
 * @returns The Base64 encoded representation of the content.
 */
export function createVirtualFileBase64(content: string): string {
	const buffer = Buffer.from(content, 'utf-8');
	return buffer.toString('base64');
}

/**
 * Creates a virtual file from a Base64 string.
 * @param base64 - The Base64 encoded string.
 * @param fileName - The name of the file.
 * @param mimeType - The MIME type of the file (default: "application/octet-stream").
 * @returns A File object.
 */
export function base64ToFile(
	base64: string,
	fileName: string,
	mimeType = 'application/octet-stream',
): File {
	const byteCharacters = atob(base64);
	const byteArrays: Uint8Array[] = [];

	for (let i = 0; i < byteCharacters.length; i += 512) {
		const slice = byteCharacters.slice(i, i + 512);
		const byteNumbers = new Array(slice.length);
		for (let j = 0; j < slice.length; j++) {
			byteNumbers[j] = slice.charCodeAt(j);
		}
		byteArrays.push(new Uint8Array(byteNumbers));
	}

	const blob = new Blob(byteArrays, { type: mimeType });
	return new File([blob], fileName, { type: mimeType });
}

/**
 * Encodes a text string into a Base64-encoded string.
 * @param text - The text to encode.
 * @returns The Base64-encoded representation of the text.
 */
export function textToBase64(text: string): string {
	return btoa(encodeURIComponent(text));
}

/**
 * Decodes a Base64-encoded string back to a text string.
 * @param base64 - The Base64 string to decode.
 * @returns The decoded text string.
 */
export function base64ToText(base64: string): string {
	return decodeURIComponent(atob(base64));
}

// (async () => {
// 	const text = 'Hello, World!';
// 	const base64 = textToBase64(text);
// 	const virtualFile = base64ToFile(base64, 'hello.txt', 'text/plain');

// 	const base640 = await fileToBase64(virtualFile);

// 	console.log(base640);
// })();
