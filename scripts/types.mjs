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
			return normalizePath(`./dist/dts/${module}/${file}`);
			// return `./dist/${module}/${file}`;
		}
	}

	return null;
};

/**
 * Normalize a file path to use forward slashes.
 * @param {string} filePath - The file path to normalize.
 * @returns {string} - The normalized file path.
 */
const normalizePath = (filePath) => filePath.replace(/\\/g, '/');

/**
 * @typedef {Object} Exports
 * @property {Record<string, unknown>} exports - The exports object
 * @property {Array<[string, string]>} validModules - Array of valid modules
 * @property {Object} pluginModules - Plugin modules configuration
 * @property {string[]} pluginModules.types - Type definitions
 * @property {string[]} pluginModules.import - Import paths
 * @property {string[]} pluginModules.require - Require paths
 */

/**
 * Generate the exports field for package.json
 * @param {string[]} modulePaths - Array of module folder names
 * @returns {Exports} Export object and valid modules with resolved file paths
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

	/**
	 * * Collect all plugin type files under any `dist\/dts\/**\/plugins/*.d.ts`.
	 * @param {string} base Base path to look up.
	 * @returns {string[]} matching path as array of strings.
	 */
	const walkForPlugins = (base) => {
		/** @type {string[]} */
		const pluginTypePaths = [];
		const dirs = fs.readdirSync(base, { withFileTypes: true });

		for (const dirent of dirs) {
			const fullPath = path.join(base, dirent.name);
			if (dirent.isDirectory()) {
				if (dirent.name === 'plugins') {
					const pluginFiles = fs
						.readdirSync(fullPath)
						.filter((f) => f.endsWith('.d.ts'))
						.map((file) =>
							path.relative(distPath, path.join(fullPath, file)),
						);
					pluginTypePaths.push(...pluginFiles);
				} else {
					pluginTypePaths.push(...walkForPlugins(fullPath));
				}
			}
		}
		return pluginTypePaths.map(normalizePath);
	};

	// Plugins across all formats
	const pluginTypes = walkForPlugins(distPath);
	const pluginImports = pluginTypes.map((p) =>
		p.replace(/^/, 'dist/esm/').replace(/\.d\.ts$/, '.js'),
	);
	const pluginRequires = pluginTypes.map((p) =>
		p.replace(/^/, 'dist/cjs/').replace(/\.d\.ts$/, '.js'),
	);
	const pluginTypesFull = pluginTypes.map((p) => `./dist/dts/${p}`);

	if (pluginTypes.length > 0) {
		exports['./plugins'] = {
			types: pluginTypesFull,
			import: pluginImports.map((p) => `./${p}`),
			require: pluginRequires.map((p) => `./${p}`),
		};
	}

	return {
		exports,
		validModules,
		pluginModules: {
			types: pluginTypes.map((p) => `dist/dts/${p}`),
			import: pluginImports,
			require: pluginRequires,
		},
	};
};

/**
 * Generate typesVersions mapping for TypeScript
 * @param {[string, string][]} validModules - Array of tuples with module and relative type file
 * @returns {Record<string, Record<string, string[]>>}
 */
const createTypesVersions = (validModules) => {
	/** @type {Record<string, string[]>} */
	const versions = {};

	// /** @type {string[]} */
	// const types = ['dist/dts/types/index.d.ts'];

	validModules.forEach(([module, resolved]) => {
		versions[`${module}/types`] = [resolved.replace('./', '')];
		// types.push(resolved.replace('./', ''));
	});

	return {
		'*': {
			// types,
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
 * @param {Exports['pluginModules'] } pluginModules
 */
const updatePackageJson = (exports, validModules, pluginModules) => {
	const packageJsonPath = path.join(__dirname, '../package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

	packageJson.exports = exports;
	packageJson.typesVersions = createTypesVersions(validModules);

	if (pluginModules.types.length > 0) {
		packageJson.typesVersions['*']['plugins'] = pluginModules.types;
	}

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

const { exports, validModules, pluginModules } = createExports(modulePaths);

updatePackageJson(exports, validModules, pluginModules);
