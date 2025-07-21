import { ZODIAC_PRESETS } from '../constants';
import type { ZodiacOptions, ZodiacSign } from '../types';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Returns the zodiac sign based on current date or `birthDate` option.
		 * @param options Optional config to choose preset or provide custom zodiac date ranges.
		 * @returns The matching zodiac sign from preset/custom list.
		 */
		getZodiacSign(options?: ZodiacOptions): ZodiacSign;
	}
}

/** * Plugin to inject `getZodiacSign` method */
export const zodiacPlugin = (ChronosClass: MainChronos): void => {
	ChronosClass.prototype.getZodiacSign = function (
		this: ChronosConstructor,
		options?: ZodiacOptions
	): ZodiacSign {
		const { birthDate, preset = 'western', custom } = options ?? {};

		let month: number;
		let date: number;

		if (birthDate && birthDate?.includes('-')) {
			[month, date] = birthDate.split('-').map(Number);
		} else {
			month = this.isoMonth;
			date = this.date;
		}

		const signs = custom ?? ZODIAC_PRESETS[preset];

		for (let i = signs.length - 1; i >= 0; i--) {
			const [sign, [m, d]] = signs[i];
			if (month > m || (month === m && date >= d)) {
				return sign;
			}
		}

		return signs[0][0];
	};
};
