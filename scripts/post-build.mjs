// @ts-check

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist/dts');

/**
 * Get all subdirectory names under the dist/dts directory
 * @returns {string[]} An array of module folder names
 */
const getModulePaths = () => {
	const moduleDirs = fs
		.readdirSync(distPath, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	return moduleDirs;
};

/**
 * Generate the exports field for package.json
 * @param {string[]} modulePaths - Array of module folder names
 * @returns {Record<string, unknown>} The exports field object
 */
const createExports = (modulePaths) => {
	/** @type {Record<string, unknown>} */
	const exports = {
		'.': {
			import: './dist/esm/index.js',
			require: './dist/cjs/index.js',
			types: './dist/dts/index.d.ts',
		},
		'./package.json': './package.json',
	};

	modulePaths.forEach((module) => {
		const relativePath = `./dist/dts/${module}/types.d.ts`;
		exports[`./${module}/types`] = {
			types: relativePath,
			default: relativePath,
		};
	});

	return exports;
};

/**
 * Generate typesVersions mapping for TypeScript
 * @param {string[]} modulePaths - Array of module folder names
 * @returns {Record<string, Record<string, string[]>>}
 */
const createTypesVersions = (modulePaths) => {
	/** @type {Record<string, string[]>} */
	const versions = {};

	modulePaths.forEach((module) => {
		versions[`${module}/types`] = [`dist/dts/${module}/types.d.ts`];
	});

	return { '*': versions };
};

/**
 * Read, update, and write package.json with updated exports and typesVersions
 * @param {Record<string, unknown>} exports - The exports map
 * @param {string[]} modulePaths - Module folder names
 */
const updatePackageJson = (exports, modulePaths) => {
	const packageJsonPath = path.join(__dirname, '../package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

	packageJson.exports = exports;
	packageJson.typesVersions = createTypesVersions(modulePaths);

	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
	console.info('✅ `package.json` has been updated with export fields!');
};

// --- Run Script ---
const modulePaths = getModulePaths();
const exports = createExports(modulePaths);

updatePackageJson(exports, modulePaths);
