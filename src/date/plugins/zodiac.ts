import { ZODIAC_SIGNS } from '../constants';
import type { ZodiacSign } from '../types';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Returns the zodiac sign for the current date.
		 * @returns The Western zodiac sign.
		 */
		getZodiacSign(): ZodiacSign;
	}
}

/** * Plugin to inject `getZodiacSign` method */
export const zodiacPlugin = (ChronosClass: MainChronos): void => {
	ChronosClass.prototype.getZodiacSign = function (
		this: ChronosConstructor,
	): ZodiacSign {
		for (const [sign, [m, d]] of ZODIAC_SIGNS) {
			if (this.isoMonth === m && this.date <= d) {
				return sign;
			}
		}

		return 'Capricorn';
	};
};
