import { verbalizer } from '../../src/index'; // adjust path to your class

describe('Verbalizer form checks', () => {
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
		});

		test('returns false for non-base forms', () => {
			expect(verbalizer.isBase('went')).toBe(false);
			expect(verbalizer.isBase('ran')).toBe(false);
			expect(verbalizer.isBase('was')).toBe(false);
			expect(verbalizer.isBase('been')).toBe(false);
			expect(verbalizer.isBase('walked')).toBe(false);
		});
	});

	describe('isPast()', () => {
		test('returns true for past tense forms', () => {
			expect(verbalizer.isPast('went')).toBe(true);
			expect(verbalizer.isPast('ran')).toBe(true);
			expect(verbalizer.isPast('was')).toBe(true);
			expect(verbalizer.isPast('put')).toBe(true);
			expect(verbalizer.isPast('walked')).toBe(true); // regular
		});

		test('returns false for non-past forms', () => {
			expect(verbalizer.isPast('go')).toBe(false);
			expect(verbalizer.isPast('gone')).toBe(false);
			expect(verbalizer.isPast('be')).toBe(false);
			expect(verbalizer.isPast('walk')).toBe(false);
		});
	});

	describe('isPastParticiple()', () => {
		test('returns true for past participle forms', () => {
			expect(verbalizer.isPastParticiple('gone')).toBe(true);
			expect(verbalizer.isPastParticiple('run')).toBe(true);
			expect(verbalizer.isPastParticiple('been')).toBe(true);
			expect(verbalizer.isPastParticiple('put')).toBe(true);
			expect(verbalizer.isPastParticiple('walked')).toBe(true); // regular
		});

		test('returns false for non-participle forms', () => {
			expect(verbalizer.isPastParticiple('go')).toBe(false);
			expect(verbalizer.isPastParticiple('ran')).toBe(false);
			expect(verbalizer.isPastParticiple('was')).toBe(false);
			expect(verbalizer.isPastParticiple('walk')).toBe(false);
		});
	});

	describe('Consistency checks', () => {
		test('base → past → base should round-trip correctly', () => {
			const verbs = ['go', 'run', 'walk', 'be', 'put'];
			for (const v of verbs) {
				const past = verbalizer.toPast(v);
				expect(verbalizer.toBase(past)).toBe(v);
			}
		});

		test('base → participle → base should round-trip correctly', () => {
			const verbs = ['go', 'run', 'walk', 'be', 'put'];
			for (const v of verbs) {
				const part = verbalizer.toParticiple(v);
				expect(verbalizer.toBase(part)).toBe(v);
			}
		});
	});
});
