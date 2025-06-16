// @ts-check

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist/dts');

/**
 * Get all subdirectory names under the dist/dts directory
 * @returns {string[]}
 */
const getModulePaths = () => {
	return fs
		.readdirSync(distPath, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);
};

/**
 * Normalize a file path to use forward slashes.
 * @param {string} filePath
 * @returns {string}
 */
const normalizePath = (filePath) => filePath.replace(/\\/g, '/');

/**
 * @param {string} module
 * @returns {string | null}
 */
const resolveTypeFile = (module) => {
	const basePath = path.join(distPath, module);
	const candidates = ['types.d.ts', 'interfaces.d.ts'];

	for (const file of candidates) {
		const fullPath = path.join(basePath, file);
		if (fs.existsSync(fullPath)) {
			return normalizePath(`./dist/dts/${module}/${file}`);
		}
	}
	return null;
};

/**
 * @param {string} base
 * @returns {Array<{name: string, rel: string}>}
 */
const walkForPlugins = (base) => {
	/** @type {Array<{name: string, rel: string}>} */
	const plugins = [];

	/** @param {string} dir */
	const traverse = (dir) => {
		const dirents = fs.readdirSync(dir, { withFileTypes: true });
		for (const dirent of dirents) {
			const fullPath = path.join(dir, dirent.name);

			if (dirent.isDirectory()) {
				if (dirent.name === 'plugins') {
					const files = fs
						.readdirSync(fullPath)
						.filter((f) => f.endsWith('.d.ts'));

					for (const file of files) {
						const name = file.replace(/\.d\.ts$/, '');
						const rel = path.relative(
							distPath,
							path.join(fullPath, file),
						);
						plugins.push({ name, rel: normalizePath(rel) });
					}
				} else {
					traverse(fullPath);
				}
			}
		}
	};

	traverse(base);
	return plugins;
};

/**
 * @param {string[]} modulePaths
 */
const createExports = (modulePaths) => {
	/** @type {Record<string, unknown>} */
	const exports = {
		'./package.json': './package.json',
		'.': {
			types: './dist/dts/index.d.ts',
			import: './dist/esm/index.js',
			require: './dist/cjs/index.js',
		},
		'./constants': {
			types: './dist/dts/constants.d.ts',
			import: './dist/esm/constants.js',
			require: './dist/cjs/constants.js',
		},
		'./types': {
			types: './dist/dts/types/index.d.ts',
			default: './dist/dts/types/index.d.ts',
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

	const pluginModules = walkForPlugins(distPath);

	pluginModules.forEach(({ name, rel }) => {
		const esm = `./dist/esm/${rel.replace(/\.d\.ts$/, '.js')}`;
		const cjs = `./dist/cjs/${rel.replace(/\.d\.ts$/, '.js')}`;
		const types = `./dist/dts/${rel}`;

		exports[`./plugins/${name}`] = {
			types,
			import: esm,
			require: cjs,
		};
	});

	return {
		exports,
		validModules,
		pluginModules,
	};
};

/**
 * @param {[string, string][]} validModules
 */
const createTypesVersions = (validModules) => {
	const versions = {};

	validModules.forEach(([module, resolved]) => {
		versions[`${module}/types`] = [resolved.replace('./', '')];
	});

	return {
		'*': {
			types: ['dist/dts/types/index.d.ts'],
			constants: ['dist/dts/constants.d.ts'],
			...versions,
		},
	};
};

/**
 * @param {Record<string, unknown>} exports
 * @param {[string, string][]} validModules
 * @param {Array<{name: string, rel: string}>} pluginModules
 */
const updatePackageJson = (exports, validModules, pluginModules) => {
	const packageJsonPath = path.join(__dirname, '../package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

	packageJson.exports = exports;
	packageJson.typesVersions = createTypesVersions(validModules);

	if (!packageJson.typesVersions['*']) {
		packageJson.typesVersions['*'] = {};
	}

	pluginModules.forEach(({ name, rel }) => {
		packageJson.typesVersions['*'][`plugins/${name}`] = [`dist/dts/${rel}`];
	});

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
