import { chronos } from '../../src/index';
import { CURRENCY_LOCALES, LOCALE_CODES } from '../../src/number/constants';

describe('Time must be same as the Date constructor', () => {
	const stringifyDate = (date: Date) => {
		return JSON.stringify(date).split('.')[0];
	};

	it('chronos.toDate() and new Date() should be equal after trimming milliseconds', () => {
		expect(stringifyDate(chronos().toDate())).toBe(stringifyDate(new Date()));
	});

	it('chronos.toDate() and new Date() should be equal after trimming milliseconds for UTC times', () => {
		expect(stringifyDate(chronos().toUTC().toDate())).toBe(stringifyDate(new Date()));
	});
});

describe('chronos.toLocaleString should not throw for locals arguments', () => {
	const SAMPLE = [...Object.values(CURRENCY_LOCALES), ...LOCALE_CODES];

	for (const locale of SAMPLE) {
		it(`should not throw for locale: ${locale}`, () => {
			expect(() => {
				chronos().toLocaleString(locale);
			}).not.toThrow();
		});
	}
});
