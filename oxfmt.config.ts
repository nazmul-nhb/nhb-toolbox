import { defineConfig } from 'oxfmt';

export default defineConfig({
	semi: true,
	singleQuote: true,
	tabWidth: 4,
	useTabs: true,
	printWidth: 96,
	trailingComma: 'es5',
	sortPackageJson: false,
	ignorePatterns: ['dist', 'node_modules', '.estimator', '*.md'],
});
