import { Chronos } from '../../../src/date/Chronos';
import { zodiacPlugin } from '../../../src/date/plugins/zodiacPlugin';

Chronos.use(zodiacPlugin);

describe('Chronos.getZodiacSign – Western boundaries', () => {
	it('returns Capricorn on Jan 1 (year wrap)', () => {
		expect(new Chronos('2026-01-01').getZodiacSign()).toBe('Capricorn');
	});

	it('returns Capricorn on Jan 19 (last day)', () => {
		expect(new Chronos('2026-01-19').getZodiacSign()).toBe('Capricorn');
	});

	it('returns Aquarius on Jan 20 (boundary)', () => {
		expect(new Chronos('2026-01-20').getZodiacSign()).toBe('Aquarius');
	});

	it('returns Sagittarius on Dec 21', () => {
		expect(new Chronos('2026-12-21').getZodiacSign()).toBe('Sagittarius');
	});

	it('returns Capricorn on Dec 22 (boundary)', () => {
		expect(new Chronos('2026-12-22').getZodiacSign()).toBe('Capricorn');
	});
});

describe('Chronos.getZodiacSign – Western sign transitions', () => {
	const cases = [
		['2026-02-18', 'Aquarius'],
		['2026-02-19', 'Pisces'],

		['2026-03-20', 'Pisces'],
		['2026-03-21', 'Aries'],

		['2026-04-19', 'Aries'],
		['2026-04-20', 'Taurus'],

		['2026-05-20', 'Taurus'],
		['2026-05-21', 'Gemini'],

		['2026-06-20', 'Gemini'],
		['2026-06-21', 'Cancer'],

		['2026-07-22', 'Cancer'],
		['2026-07-23', 'Leo'],

		['2026-08-22', 'Leo'],
		['2026-08-23', 'Virgo'],

		['2026-09-22', 'Virgo'],
		['2026-09-23', 'Libra'],

		['2026-10-22', 'Libra'],
		['2026-10-23', 'Scorpio'],

		['2026-11-21', 'Scorpio'],
		['2026-11-22', 'Sagittarius'],
	] as const;

	it.each(cases)('%s → %s', (date, sign) => {
		expect(new Chronos(date).getZodiacSign()).toBe(sign);
	});
});

describe('Chronos.getZodiacSign – Vedic boundaries', () => {
	it('returns Sagittarius on Jan 1', () => {
		expect(new Chronos('2026-01-01').getZodiacSign({ preset: 'vedic' })).toBe(
			'Sagittarius'
		);
	});

	it('returns Sagittarius on Jan 13 (last day)', () => {
		expect(new Chronos('2026-01-13').getZodiacSign({ preset: 'vedic' })).toBe(
			'Sagittarius'
		);
	});

	it('returns Capricorn on Jan 14 (boundary)', () => {
		expect(new Chronos('2026-01-14').getZodiacSign({ preset: 'vedic' })).toBe('Capricorn');
	});
});

describe('Chronos.getZodiacSign – birthDate option', () => {
	it('respects MM-DD format (Western)', () => {
		expect(new Chronos('2026-06-01').getZodiacSign({ birthDate: '01-12' })).toBe(
			'Capricorn'
		);
	});

	it('respects MM-DD format (Vedic)', () => {
		expect(
			new Chronos('2026-06-01').getZodiacSign({
				birthDate: '01-12',
				preset: 'vedic',
			})
		).toBe('Sagittarius');
	});
});

describe('Chronos.getZodiacSign – custom preset wrap', () => {
	it('wraps correctly for custom presets', () => {
		const custom = [
			['A', [3, 1]],
			['B', [6, 1]],
			['C', [9, 1]],
			['D', [12, 1]],
		] as const;

		expect(new Chronos('2026-01-10').getZodiacSign({ custom })).toBe('D');
	});
});
