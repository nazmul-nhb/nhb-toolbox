import { pluralizer } from '../../src/index';

describe('Pluralizer round‑trip tests', () => {
	const cases: [string, string][] = [
		['appendix', 'appendices'],
		['codex', 'codices'],
		['matrix', 'matrices'],
		['index', 'indices'],
		['vertex', 'vertices'],
		['alumna', 'alumnae'],
		['alga', 'algae'],
		['vertebra', 'vertebrae'],
		['phenomenon', 'phenomena'],
		['criterion', 'criteria'],
		['prolegomenon', 'prolegomena'],
		['automaton', 'automata'],
		['stigma', 'stigmata'],
		['stoma', 'stomata'],
		['lemma', 'lemmata'],
		['bacterium', 'bacteria'],
		['curriculum', 'curricula'],
		['datum', 'data'],
		['millennium', 'millennia'],
		['candelabrum', 'candelabra'],
		['erratum', 'errata'],
		['ovum', 'ova'],
		['symposium', 'symposia'],
		['octopus', 'octopi'],
		['cactus', 'cacti'],
		['fungus', 'fungi'],
		['focus', 'foci'],
		['nucleus', 'nuclei'],
		['radius', 'radii'],
		['stimulus', 'stimuli'],
		['terminus', 'termini'],
		['bacillus', 'bacilli'],
		['uterus', 'uteri'],
		['locus', 'loci'],
		['stratus', 'strati'],
		['analysis', 'analyses'],
		['basis', 'bases'],
		['crisis', 'crises'],
		['diagnosis', 'diagnoses'],
		['parenthesis', 'parentheses'],
		['thesis', 'theses'],
		['synopsis', 'synopses'],
		['emphasis', 'emphases'],
		['neurosis', 'neuroses'],
		['noumenon', 'noumena'],
		['organon', 'organa'],
		['hedron', 'hedra'],
		['child', 'children'],
		['person', 'people'],
		['man', 'men'],
		['woman', 'women'],
		['tooth', 'teeth'],
		['foot', 'feet'],
		['goose', 'geese'],
		['mouse', 'mice'],
		['ox', 'oxen'],
		['quiz', 'quizzes'],
		['bus', 'buses'],
		['hero', 'heroes'],
		['potato', 'potatoes'],
		['tomato', 'tomatoes'],
		['echo', 'echoes'],
		['torpedo', 'torpedoes'],
		['fly', 'flies'],
		['puppy', 'puppies'],
		['cherry', 'cherries'],
		['leaf', 'leaves'],
		['wolf', 'wolves'],
		['knife', 'knives'],
		['life', 'lives'],
		['shelf', 'shelves'],
		['thief', 'thieves'],
		['calf', 'calves'],
		['loaf', 'loaves'],
		['elf', 'elves'],
		['half', 'halves'],
		['chief', 'chiefs'],
		['roof', 'roofs'],
		['cliff', 'cliffs'],
		['belief', 'beliefs'],
		['reef', 'reefs'],
	];

	it.each(cases.map(([s, p]) => [s, p, s]))(
		'%s → %p → %s',
		(singular, plural, back) => {
			expect(pluralizer.toPlural(singular)).toBe(plural);
			expect(pluralizer.toSingular(plural)).toBe(back);
		}
	);

	it('handles uncountables correctly', () => {
		const uncountables = [
			'series',
			'species',
			'news',
			'equipment',
			'information',
		];
		for (const word of uncountables) {
			expect(pluralizer.toPlural(word)).toBe(word);
			expect(pluralizer.toSingular(word)).toBe(word);
			expect(pluralizer.isPlural(word)).toBe(true);
			expect(pluralizer.isSingular(word)).toBe(true);
		}
	});
});

describe('Pluralizer instance extended tests', () => {
	const testCases = [
		// irregular singular -> plural
		['appendix', 'appendices'],
		['codex', 'codices'],
		['matrix', 'matrices'],
		['index', 'indices'],
		['vertex', 'vertices'],
		['alumna', 'alumnae'],
		['alga', 'algae'],
		['vertebra', 'vertebrae'],
		['phenomenon', 'phenomena'],
		['criterion', 'criteria'],
		['prolegomenon', 'prolegomena'],
		['automaton', 'automata'],
		['stigma', 'stigmata'],
		['stoma', 'stomata'],
		['lemma', 'lemmata'],
		['bacterium', 'bacteria'],
		['curriculum', 'curricula'],
		['datum', 'data'],
		['millennium', 'millennia'],
		['candelabrum', 'candelabra'],
		['erratum', 'errata'],
		['ovum', 'ova'],
		['symposium', 'symposia'],
		['octopus', 'octopi'],
		['cactus', 'cacti'],
		['fungus', 'fungi'],
		['focus', 'foci'],
		['nucleus', 'nuclei'],
		['radius', 'radii'],
		['stimulus', 'stimuli'],
		['terminus', 'termini'],
		['bacillus', 'bacilli'],
		['uterus', 'uteri'],
		['locus', 'loci'],
		['stratus', 'strati'],

		// regular plurals
		['cat', 'cats'],
		['dog', 'dogs'],
		['bus', 'buses'],
		['quiz', 'quizzes'],
		['potato', 'potatoes'],
		['tomato', 'tomatoes'],
		['hero', 'heroes'],
		['church', 'churches'],

		// uncountables
		['fish', 'fish'],
		['series', 'series'],
		['species', 'species'],
		['equipment', 'equipment'],
		['information', 'information'],

		// irregular plurals
		['child', 'children'],
		['person', 'people'],
		['man', 'men'],
		['woman', 'women'],
		['tooth', 'teeth'],
		['foot', 'feet'],
		['goose', 'geese'],
		['mouse', 'mice'],
		['ox', 'oxen'],
	];

	testCases.forEach(([singular, plural]) => {
		test(`pluralize('${singular}') should return '${plural}'`, () => {
			expect(pluralizer.pluralize(singular)).toBe(plural);
		});

		test(`toPlural('${singular}') should return '${plural}'`, () => {
			expect(pluralizer.toPlural(singular)).toBe(plural);
		});

		test(`toSingular('${plural}') should return '${singular}'`, () => {
			expect(pluralizer.toSingular(plural)).toBe(singular);
		});

		test(`isPlural('${plural}') should be true`, () => {
			expect(pluralizer.isPlural(plural)).toBe(true);
		});

		// test(`isPlural('${singular}') should be false`, () => {
		// 	expect(pluralizer.isPlural(singular)).toBe(false);
		// });

		test(`isSingular('${singular}') should be true`, () => {
			expect(pluralizer.isSingular(singular)).toBe(true);
		});

		// test(`isSingular('${plural}') should be false`, () => {
		// 	expect(pluralizer.isSingular(plural)).toBe(false);
		// });

		test(`pluralize('${singular}', { count: 1, inclusive: true }) should be '1 ${singular}'`, () => {
			expect(
				pluralizer.pluralize(singular, { count: 1, inclusive: true })
			).toBe(`1 ${singular}`);
		});

		test(`pluralize('${singular}', { count: 5, inclusive: true }) should be '5 ${plural}'`, () => {
			expect(
				pluralizer.pluralize(singular, { count: 5, inclusive: true })
			).toBe(`5 ${plural}`);
		});
	});

	test('Empty and invalid inputs', () => {
		expect(pluralizer.pluralize('')).toBe('');
		expect(pluralizer.toPlural('')).toBe('');
		expect(pluralizer.toSingular('')).toBe('');
		expect(pluralizer.isPlural('')).toBe(false);
		expect(pluralizer.isSingular('')).toBe(false);
	});
});

describe('Pluralizer extra casing and edge‑case tests', () => {
	it('preserves title case when pluralizing', () => {
		expect(pluralizer.toPlural('Child')).toBe('Children');
		expect(pluralizer.toPlural('Goose')).toBe('Geese');
		expect(pluralizer.toPlural('Box')).toBe('Boxes');
	});

	it('preserves upper case when pluralizing', () => {
		expect(pluralizer.toPlural('CHILD')).toBe('CHILDREN');
		expect(pluralizer.toPlural('GOOSE')).toBe('GEESE');
		expect(pluralizer.toPlural('BOX')).toBe('BOXES');
	});

	it('preserves lower case when pluralizing', () => {
		expect(pluralizer.toPlural('child')).toBe('children');
		expect(pluralizer.toPlural('goose')).toBe('geese');
		expect(pluralizer.toPlural('box')).toBe('boxes');
	});

	it('preserves irregular case when pluralizing', () => {
		expect(pluralizer.toPlural('ChiLd')).toBe('ChiLdren');
		expect(pluralizer.toPlural('gOOse')).toBe('gEEse');
		expect(pluralizer.toPlural('boX')).toBe('boXes');
	});

	it('handles words ending in y correctly', () => {
		expect(pluralizer.toPlural('boy')).toBe('boys'); // vowel+y
		expect(pluralizer.toPlural('toy')).toBe('toys'); // vowel+y
		expect(pluralizer.toPlural('lady')).toBe('ladies'); // consonant+y
		expect(pluralizer.toPlural('puppy')).toBe('puppies'); // consonant+y
	});

	it('handles words ending in f/fe correctly', () => {
		expect(pluralizer.toPlural('leaf')).toBe('leaves');
		expect(pluralizer.toPlural('knife')).toBe('knives');
		expect(pluralizer.toPlural('roof')).toBe('roofs'); // exception
		expect(pluralizer.toPlural('chief')).toBe('chiefs'); // exception
	});

	it('handles words that are both singular and plural in context', () => {
		const uncountables = ['series', 'species', 'sheep', 'fish'];
		for (const word of uncountables) {
			expect(pluralizer.toPlural(word)).toBe(word);
			expect(pluralizer.toSingular(word)).toBe(word);
			expect(pluralizer.isPlural(word)).toBe(true);
			expect(pluralizer.isSingular(word)).toBe(true);
		}
	});

	it('inclusive flag works for both singular and plural', () => {
		expect(
			pluralizer.pluralize('child', { count: 1, inclusive: true })
		).toBe('1 child');
		expect(
			pluralizer.pluralize('child', { count: 2, inclusive: true })
		).toBe('2 children');
		// even starting from plural form should normalize
		expect(
			pluralizer.pluralize('children', { count: 1, inclusive: true })
		).toBe('1 child');
		expect(
			pluralizer.pluralize('children', { count: 3, inclusive: true })
		).toBe('3 children');
	});
});
