import type { NumberRange } from '../../number/types';
import { ZODIAC_PRESETS } from '../constants';
import type { $Chronos, ZodiacArray, ZodiacOptions, ZodiacSign } from '../types';

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Returns the zodiac sign based on current date or `birthDate` option.
		 * @param options Optional config to choose preset or provide custom zodiac date ranges.
		 * @returns The matching zodiac sign from preset/custom list.
		 */
		getZodiacSign<Sign extends string = ZodiacSign>(options?: ZodiacOptions<Sign>): Sign;

		/**
		 * @instance Returns the zodiac sign based on current date or `birthDate` option.
		 * @remarks This method is an alias for {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/names#getzodiacsign getZodiacSign} method.
		 *
		 * @param options Optional config to choose preset or provide custom zodiac date ranges.
		 * @returns The matching zodiac sign from preset/custom list.
		 */
		zodiac<Sign extends string = ZodiacSign>(options?: ZodiacOptions<Sign>): Sign;
	}
}

/** * Plugin to inject `zodiac` related methods */
export const zodiacPlugin = ($Chronos: $Chronos): void => {
	function _toHundreds(range: readonly [number, number]) {
		return range[0] * 100 + range[1];
	}

	function _getSortedSigns<Sign extends string = ZodiacSign>(options?: ZodiacOptions<Sign>) {
		const { preset = 'western', custom } = options ?? {};

		const sorted = [...(custom ?? ZODIAC_PRESETS[preset])].sort(
			(a, b) => _toHundreds(a[1]) - _toHundreds(b[1])
		);

		return sorted as ZodiacArray<Sign>;
	}

	$Chronos.prototype.getZodiacSign = function <Sign extends string = ZodiacSign>(
		options?: ZodiacOptions<Sign>
	) {
		const { birthDate } = options ?? {};

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

		const sortedSigns = _getSortedSigns(options);

		for (let i = sortedSigns.length - 1; i >= 0; i--) {
			const [sign, [m, d]] = sortedSigns[i];

			if (month > m || (month === m && date >= d)) {
				return sign;
			}

			if (i === 0) {
				return sortedSigns.at(-1)![0];
			}
		}

		return sortedSigns[0][0];
	};

	$Chronos.prototype.zodiac = function (options) {
		return this.getZodiacSign(options);
	};
};
