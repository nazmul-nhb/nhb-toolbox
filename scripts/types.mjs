// @ts-check

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist/dts');
// const distPath = path.join(__dirname, '../dist');

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
 * Resolve the actual type definition file if it exists
 * @param {string} module - Module folder name
 * @returns {string | null} Relative path to the type file or null if not found
 */
const resolveTypeFile = (module) => {
	const basePath = path.join(distPath, module);
	const candidates = ['types.d.ts', 'interfaces.d.ts'];

	for (const file of candidates) {
		const fullPath = path.join(basePath, file);
		if (fs.existsSync(fullPath)) {
			return `./dist/dts/${module}/${file}`;
			// return `./dist/${module}/${file}`;
		}
	}

	return null;
};

/**
 * Generate the exports field for package.json
 * @param {string[]} modulePaths - Array of module folder names
 * @returns {{ exports: Record<string, unknown>, validModules: [string, string][] }} Export object and valid modules with resolved file paths
 */
const createExports = (modulePaths) => {
	/** @type {Record<string, unknown>} */
	const exports = {
		'./package.json': './package.json',
		'.': {
			types: './dist/dts/index.d.ts',
			import: './dist/esm/index.js',
			require: './dist/cjs/index.js',
			// types: './dist/index.d.ts',
			// import: './dist/index.mjs',
			// require: './dist/index.js',
		},
		'./types': {
			types: './dist/dts/types/index.d.ts',
			default: './dist/dts/types/index.d.ts',
			// types: './dist/types/index.d.ts',
			// default: './dist/types/index.d.ts',
		},
	};

	/** @type {[string, string][]} */
	const validModules = [];

	modulePaths.forEach((module) => {
		const resolved = resolveTypeFile(module);
		if (resolved) {
			exports[`./${module}/types`] = {
				types: resolved,
				default: resolved,
			};
			validModules.push([module, resolved]);
		}
	});

	return { exports, validModules };
};

/**
 * Generate typesVersions mapping for TypeScript
 * @param {[string, string][]} validModules - Array of tuples with module and relative type file
 * @returns {Record<string, Record<string, string[]>>}
 */
const createTypesVersions = (validModules) => {
	/** @type {Record<string, string[]>} */
	const versions = {};

	validModules.forEach(([module, resolved]) => {
		versions[`${module}/types`] = [resolved.replace('./', '')];
	});

	return {
		'*': {
			types: ['dist/dts/types/index.d.ts'],
			// types: ['dist/types/index.d.ts'],
			...versions,
		},
	};
};

/**
 * Read, update, and write package.json with updated exports and typesVersions
 * @param {Record<string, unknown>} exports - The exports map
 * @param {[string, string][]} validModules - Valid modules and their resolved type files
 */
const updatePackageJson = (exports, validModules) => {
	const packageJsonPath = path.join(__dirname, '../package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

	packageJson.exports = exports;
	packageJson.typesVersions = createTypesVersions(validModules);

	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

	console.info(
		'✅ ' +
		chalk.yellow.bold('package.json ') +
		chalk.green.bold('has been updated with ') +
		chalk.yellowBright.bold('exports') +
		chalk.green(' and ') +
		chalk.yellowBright.bold('typesVersions') +
		chalk.green(' fields!'),
	);
};

const modulePaths = getModulePaths();

const { exports, validModules } = createExports(modulePaths);

updatePackageJson(exports, validModules);
