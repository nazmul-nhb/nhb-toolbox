import type { NumberRange } from '../../number/types';
import { ZODIAC_PRESETS } from '../constants';
import { _padZero } from '../helpers';
import type {
	$Chronos,
	ZodiacArray,
	ZodiacMeta,
	ZodiacMetaOptions,
	ZodiacOptions,
	ZodiacSign,
} from '../types';

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

		/**
		 * @instance Returns detailed metadata for a given zodiac sign based on the selected `preset` or custom ranges.
		 *
		 * @remarks
		 * - The metadata includes the sign's `index` within the normalized zodiac order, its inclusive start and end dates.
		 *   - **Note:** The returned `index` represents the chronological position of the zodiac sign based on Gregorian month–day ordering and may vary between different zodiac variants.
		 * - Handles year-boundary wrapping correctly (e.g. Capricorn, Sagittarius).
		 *
		 * @param sign The zodiac sign to retrieve metadata for.
		 * @param options Optional configuration to select a zodiac preset or provide custom ranges.
		 *
		 * @throws A {@link RangeError} if the provided sign does not exist in the resolved zodiac set.
		 *
		 * @returns A metadata object describing the zodiac sign's position and date range.
		 */
		getZodiacMeta<Sign extends string = ZodiacSign>(
			sign: Sign,
			options?: ZodiacMetaOptions<Sign>
		): ZodiacMeta<Sign>;
	}
}

/** * Plugin to inject `zodiac` related methods */
export const zodiacPlugin = ($Chronos: $Chronos): void => {
	function _toHundreds(range: readonly [number, number]) {
		return range[0] * 100 + range[1];
	}

	function _resolveSigns<Z extends string = ZodiacSign>(options?: ZodiacMetaOptions<Z>) {
		const { preset = 'western', custom } = options ?? {};

		const sorted = [...(custom ?? ZODIAC_PRESETS[preset])].sort(
			(a, b) => _toHundreds(a[1]) - _toHundreds(b[1])
		);

		return sorted as ZodiacArray<Z>;
	}

	$Chronos.prototype.getZodiacSign = function <Z extends string = ZodiacSign>(
		options?: ZodiacOptions<Z>
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

		const sortedSigns = _resolveSigns(options);

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

	$Chronos.prototype.getZodiacMeta = function <Z extends string = ZodiacSign>(
		sign: Z,
		options?: ZodiacMetaOptions<Z>
	) {
		const sortedSigns = _resolveSigns(options);

		const index = sortedSigns.findIndex(([s]) => s === sign);

		if (index === -1) {
			throw new RangeError(`Invalid zodiac sign: "${sign}"`);
		}

		const [startMonth, startDate] = sortedSigns[index][1];

		const [endMonth, endDate] = (sortedSigns[index + 1] ?? sortedSigns[0])[1];

		return {
			index,
			sign,
			start: `${_padZero(startMonth)}-${_padZero(startDate)}`,
			end: `${_padZero(endMonth)}-${_padZero(endDate - 1)}`,
		} as ZodiacMeta<Z>;
	};
};
