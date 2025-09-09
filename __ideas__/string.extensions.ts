import { capitalizeString, convertStringCase } from '../src/index';
import type { CapitalizeOptions, CaseFormat, StringCaseOptions } from '../src/string/types';

declare global {
	interface String {
		convertCase(format: CaseFormat, options?: StringCaseOptions): string;
		capitalize(options?: CapitalizeOptions): string;
	}
}

/**
 * Define a method on String.prototype in an idempotent way.
 * - Non-enumerable by default (like native methods).
 * - Won't overwrite unless you pass { overwrite: true }.
 * - Uses the string value of `this` safely.
 */
function defineStringMethod<Args extends unknown[], Return>(
	name: string,
	impl: (this: string, ...args: Args) => Return,
	options?: {
		/** Overwrite an existing method with the same name. Default: false */
		overwrite?: boolean;
		/** Property enumerability. Default: false */
		enumerable?: boolean;
		/** Property configurability. Default: false */
		configurable?: boolean;
		/** Property writability. Default: true */
		writable?: boolean;
	}
): void {
	const proto = String.prototype;
	const alreadyExists = Object.prototype.hasOwnProperty.call(proto, name);

	if (alreadyExists && !options?.overwrite) return;

	Object.defineProperty(proto, name, {
		value: function (this: string, ...args: Args) {
			// Ensure to operate on the primitive string value
			const s = this != null ? this.toString() : '';
			return impl.call(s, ...args);
		},
		enumerable: options?.enumerable ?? false,
		configurable: options?.configurable ?? false,
		writable: options?.writable ?? true,
	});
}

/**
 * Register all custom String methods here.
 * Import this file once at app startup.
 */
export function registerStringMethods(): void {
	defineStringMethod(
		'convertCase',
		function (this: string, format: CaseFormat, options?: StringCaseOptions) {
			return convertStringCase(this.toString(), format, options);
		}
	);

	defineStringMethod('capitalize', function (this: string, options?: CapitalizeOptions) {
		return capitalizeString(this.toString(), options);
	});

	// Add more methods with defineStringMethod('methodName', impl)
}

// ! Manual Way

// import { capitalizeString, convertStringCase } from 'nhb-toolbox';

// String.prototype.convertCase = function (format, options): string {
// 	return convertStringCase(this.toString(), format, options);
// };
// String.prototype.capitalize = function (options): string {
// 	return capitalizeString(this.toString(), options);
// };

// /**
//  * Registers the convertStringCase method on String.prototype.
//  * Should be imported once at app startup.
//  */
// // if (!String.prototype.convertCase) {
// // 	// Declared it in the .d.ts, so TS knows it exists.
// // 	// The check avoids re-defining in tests/hot reloads.
// // 	String.prototype.convertCase = function (format, options): string {
// // 		return convertStringCase(this.toString(), format, options);
// // 	};
// // }

// // function addStringMethods(method: <T>(str: string) => T) {
// // 	if (!String.prototype.method) {
// // 		String.prototype.method;
// // 	}
// // }

// export {};
