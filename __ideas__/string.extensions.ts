import { capitalizeString, convertStringCase } from '../src/index';
import type { CapitalizeOptions, CaseFormat, StringCaseOptions } from '../src/string/types';

declare global {
	interface String {
		convertCase(format: CaseFormat, options?: StringCaseOptions): string;
		capitalize(options?: CapitalizeOptions): string;
	}
}

/**
 * Define a method on any prototype in an idempotent way.
 * - Non-enumerable by default (like native methods).
 * - Won't overwrite unless { overwrite: true }.
 */
function defineMethod<
	Proto extends object,
	Name extends Readonly<string>,
	Args extends unknown[],
	Return,
>(
	proto: Proto,
	name: Name,
	impl: (...args: Args) => Return,
	options?: {
		overwrite?: boolean;
		enumerable?: boolean;
		configurable?: boolean;
		writable?: boolean;
	}
): void {
	const alreadyExists = Object.prototype.hasOwnProperty.call(proto, name);

	if (alreadyExists && !options?.overwrite) return;

	Object.defineProperty(proto, name, {
		value: function (this: Proto, ...args: Args) {
			return impl.apply(this, args);
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
	defineMethod(
		String.prototype,
		'convertCase',
		function (this: String, format: CaseFormat, options?: StringCaseOptions) {
			return convertStringCase(this.toString(), format, options);
		}
	);

	defineMethod(
		String.prototype,
		'capitalize',
		function (this: String, options?: CapitalizeOptions) {
			return capitalizeString(this.toString(), options);
		}
	);

	// Add more methods with defineMethod('methodName', impl)
}

export function defineNumberMethods(): void {
	// Number example
	defineMethod(Number.prototype, 'double', function (this: Number) {
		return this.valueOf() * 2;
	});
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
