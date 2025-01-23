/** @type {import('jest').Config} */
export default {
    // Use 'ts-jest' preset to handle TypeScript files.
    // This preset configures Jest to work seamlessly with TypeScript.
    preset: 'ts-jest',

    // Set the testing environment to 'jsdom'.
    // 'jsdom' simulates a browser-like environment for testing,
    // which is useful for testing DOM manipulations and interactions.
    testEnvironment: 'node',

    // Transform settings specify how files should be processed.
    // Here we define a regex pattern to match TypeScript files (.ts or .tsx).
    // When a file matches this pattern, it will be transformed using 'ts-jest'.
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // Use ts-jest to process TypeScript files
    },

    // This array specifies the file extensions Jest will recognize.
    // It helps Jest to understand which file types to include when running tests.
    moduleFileExtensions: ['ts', 'tsx', 'js', 'cjs', 'mjs', 'jsx', 'json', 'node'], // Supported file extensions
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'], // Pattern for test files
    coverageDirectory: 'coverage', // Output directory for coverage reports
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}', // Collect coverage from all TypeScript files
        '!src/index.ts', // Exclude main entry file if necessary
    ],
    // setupFilesAfterEnv: ['<rootDir>/setupTests.ts'], // File to run before tests

    moduleDirectories: [
        'node_modules',
        'src', // This allows Jest to resolve modules in the src directory
    ],
};