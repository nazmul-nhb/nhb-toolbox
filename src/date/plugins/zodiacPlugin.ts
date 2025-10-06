import type { NumberRange } from '../../number/types';
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

		/**
		 * @instance Returns the zodiac sign based on current date or `birthDate` option.
		 * @remarks This method alias for {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/names#getzodiacsign getZodiacSign} method.
		 *
		 * @param options Optional config to choose preset or provide custom zodiac date ranges.
		 * @returns The matching zodiac sign from preset/custom list.
		 */
		zodiac(options?: ZodiacOptions): ZodiacSign;
	}
}

/** * Plugin to inject `getZodiacSign`/`zodiac` method */
export const zodiacPlugin = (ChronosClass: MainChronos): void => {
	ChronosClass.prototype.getZodiacSign = function (
		this: ChronosConstructor,
		options?: ZodiacOptions
	): ZodiacSign {
		const { birthDate, preset = 'western', custom } = options ?? {};

		let month: NumberRange<1, 12>;
		let date: NumberRange<1, 31>;

		if (birthDate && birthDate?.includes('-')) {
			[month, date] = birthDate.split('-').map(Number) as [
				NumberRange<1, 12>,
				NumberRange<1, 31>,
			];
		} else {
			month = this.isoMonth;
			date = this.date;
		}

		const signs = [...(custom ?? ZODIAC_PRESETS[preset])].sort(
			(a, b) => a[1][0] * 100 + a[1][1] - (b[1][0] * 100 + b[1][1])
		);

		for (let i = signs.length - 1; i >= 0; i--) {
			const [sign, [m, d]] = signs[i];
			if (month > m || (month === m && date >= d)) {
				return sign;
			}
		}

		return signs[0][0];
	};

	ChronosClass.prototype.zodiac = function (
		this: ChronosConstructor,
		options?: ZodiacOptions
	): ZodiacSign {
		return this.getZodiacSign(options);
	};
};
