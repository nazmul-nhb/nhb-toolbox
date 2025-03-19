/** @type {import('jest').Config} */
export default {
	preset: 'ts-jest', // Handles TypeScript support
	testEnvironment: 'node', // Use 'jsdom' if testing browser-related code

	// File extensions Jest should recognize
	moduleFileExtensions: [
		'ts',
		'tsx',
		'js',
		'cjs',
		'mjs',
		'jsx',
		'json',
		'node',
	],

	// Test file patterns
	testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],

	// Coverage settings
	coverageDirectory: 'coverage',
	collectCoverage: true,
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}', // Collect coverage from source files
		'!src/index.ts', // Exclude main entry file
	],

	// Module resolution settings
	moduleDirectories: ['node_modules', 'src'], // Allows Jest to resolve modules in src/

	// Uncomment if you have setup files
	// setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
};
