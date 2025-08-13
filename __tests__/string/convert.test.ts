import { convertStringCase } from '../../src/string/case';

describe('convertStringCase - basic conversions', () => {
	test('camelCase from dashed/underscored input', () => {
		expect(convertStringCase('my-example_string', 'camelCase')).toBe(
			'myExampleString'
		);
	});

	test('snake_case from camel input', () => {
		expect(convertStringCase('myExampleString', 'snake_case')).toBe(
			'my_example_string'
		);
	});

	test('kebab-case from camel/pascal with numbers', () => {
		expect(convertStringCase('v2ApiEndpoint', 'kebab-case')).toBe(
			'v2-api-endpoint'
		);
	});

	test('PascalCase from kebab', () => {
		expect(convertStringCase('xml-http-request', 'PascalCase')).toBe(
			'XmlHttpRequest'
		);
	});

	test('preserves leading/trailing punctuation', () => {
		expect(convertStringCase('++foo_bar++', 'camelCase')).toBe(
			'++fooBar++'
		);
	});

	test('Convert normal spaced string to Title Case', () => {
		expect(convertStringCase('hello from world', 'Title Case')).toBe(
			'Hello from World'
		);
	});

	test('Convert special cased string to Title Case', () => {
		expect(convertStringCase('xml-http_request', 'Title Case')).toBe(
			'Xml-http Request'
		);
	});
});

describe('convertStringCase - unicode and boundaries', () => {
	test('handles unicode letters like ü', () => {
		expect(convertStringCase('Ümlaut-test', 'camelCase')).toBe(
			'ümlautTest'
		);
	});

	test('splits letter-number boundaries', () => {
		expect(convertStringCase('v2ApiEndpoint', 'snake_case')).toBe(
			'v2_api_endpoint'
		);
	});
});

describe('convertStringCase - acronyms preservation', () => {
	test('camelCase preserveAcronyms true keeps internal acronyms', () => {
		expect(
			convertStringCase('get API data', 'camelCase', {
				preserveAcronyms: true,
			})
		).toBe('getAPIData');
	});

	test('camelCase preserveAcronyms false -> Api capitalized normally', () => {
		expect(
			convertStringCase('get API data', 'camelCase', {
				preserveAcronyms: false,
			})
		).toBe('getApiData');
	});

	test('PascalCase preserveAcronyms true keeps acronyms intact', () => {
		expect(
			convertStringCase('get API data', 'PascalCase', {
				preserveAcronyms: true,
			})
		).toBe('GetAPIData');
	});

	test('Title Case preserves acronym token and small words', () => {
		expect(
			convertStringCase('the API of things', 'Title Case', {
				preserveAcronyms: true,
			})
		).toBe('The API of Things');
		// without preserveAcronyms it becomes Api
		expect(
			convertStringCase('the API of things', 'Title Case', {
				preserveAcronyms: false,
			})
		).toBe('The Api of Things');
	});

	test('snake_case/kebab-case lowercases acronyms regardless of preserveAcronyms', () => {
		expect(
			convertStringCase('XMLHttpRequest', 'snake_case', {
				preserveAcronyms: true,
			})
		).toBe('xml_http_request');
		expect(
			convertStringCase('XMLHttpRequest', 'kebab-case', {
				preserveAcronyms: true,
			})
		).toBe('xml-http-request');
	});
});
