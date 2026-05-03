import { verbalizer } from '../../src/index';

describe('Verb form checks', () => {
	// Add some irregulars for testing
	beforeAll(() => {
		verbalizer.addIrregular('go', 'went', 'gone');
		verbalizer.addIrregular('run', 'ran', 'run');
		verbalizer.addIrregular('be', 'was', 'been');
		verbalizer.addIrregular('put', 'put', 'put');
	});

	describe('isBase()', () => {
		test('returns true for base forms', () => {
			expect(verbalizer.isBase('go')).toBe(true);
			expect(verbalizer.isBase('run')).toBe(true);
			expect(verbalizer.isBase('be')).toBe(true);
			expect(verbalizer.isBase('put')).toBe(true);
			expect(verbalizer.isBase('walk')).toBe(true); // regular
			expect(verbalizer.isBase('mummify')).toBe(true); // regular
			expect(verbalizer.isBase('stop')).toBe(true); // regular
			expect(verbalizer.isBase('mine')).toBe(true); // regular
		});

		test('returns false for non-base forms', () => {
			expect(verbalizer.isBase('went')).toBe(false);
			expect(verbalizer.isBase('ran')).toBe(false);
			expect(verbalizer.isBase('was')).toBe(false);
			expect(verbalizer.isBase('been')).toBe(false);
			expect(verbalizer.isBase('walked')).toBe(false);
			expect(verbalizer.isBase('mummified')).toBe(false);
			expect(verbalizer.isBase('stopped')).toBe(false);
			expect(verbalizer.isBase('mined')).toBe(false);
		});
	});

	describe('isPast()', () => {
		test('returns true for past tense forms', () => {
			expect(verbalizer.isPast('went')).toBe(true);
			expect(verbalizer.isPast('ran')).toBe(true);
			expect(verbalizer.isPast('was')).toBe(true);
			expect(verbalizer.isPast('put')).toBe(true);
			expect(verbalizer.isPast('walked')).toBe(true); // regular
			expect(verbalizer.isPast('mummified')).toBe(true); // regular
			expect(verbalizer.isPast('stopped')).toBe(true); // regular
			expect(verbalizer.isPast('mined')).toBe(true); // regular
		});

		test('returns false for non-past forms', () => {
			expect(verbalizer.isPast('go')).toBe(false);
			expect(verbalizer.isPast('gone')).toBe(false);
			expect(verbalizer.isPast('be')).toBe(false);
			expect(verbalizer.isPast('walk')).toBe(false);
			expect(verbalizer.isPast('mummify')).toBe(false);
			expect(verbalizer.isPast('stop')).toBe(false);
			expect(verbalizer.isPast('mine')).toBe(false);
		});
	});

	describe('isParticiple()', () => {
		test('returns true for past participle forms', () => {
			expect(verbalizer.isParticiple('gone')).toBe(true);
			expect(verbalizer.isParticiple('run')).toBe(true);
			expect(verbalizer.isParticiple('been')).toBe(true);
			expect(verbalizer.isParticiple('put')).toBe(true);
			expect(verbalizer.isParticiple('walked')).toBe(true); // regular
			expect(verbalizer.isParticiple('mummified')).toBe(true); // regular
			expect(verbalizer.isParticiple('stopped')).toBe(true); // regular
			expect(verbalizer.isParticiple('mined')).toBe(true); // regular
		});

		test('returns false for non-participle forms', () => {
			expect(verbalizer.isParticiple('go')).toBe(false);
			expect(verbalizer.isParticiple('ran')).toBe(false);
			expect(verbalizer.isParticiple('was')).toBe(false);
			expect(verbalizer.isParticiple('walk')).toBe(false);
			expect(verbalizer.isParticiple('mummify')).toBe(false);
			expect(verbalizer.isParticiple('stop')).toBe(false);
			expect(verbalizer.isParticiple('mine')).toBe(false);
		});
	});

	describe('Consistency checks', () => {
		const verbs = ['go', 'run', 'walk', 'be', 'put', 'mummify', 'mine', 'stop', 'panic'];

		test('base → past → base should round-trip correctly', () => {
			for (const v of verbs) {
				const past = verbalizer.toPast(v);
				expect(verbalizer.toBase(past)).toBe(v);
			}
		});

		test('base → participle → base should round-trip correctly', () => {
			for (const v of verbs) {
				const part = verbalizer.toParticiple(v);
				expect(verbalizer.toBase(part)).toBe(v);
			}
		});
	});
});
