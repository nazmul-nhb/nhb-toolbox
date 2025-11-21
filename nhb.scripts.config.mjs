// @ts-check

import { defineScriptConfig, fixJsExtensions, fixTypeExports, mimicClack } from 'nhb-scripts';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join as joinPath } from 'node:path';

export default defineScriptConfig({
	format: {
		args: ['--write'],
		files: ['src', 'nhb.scripts.config.mjs'],
		ignorePath: '.prettierignore',
	},
	lint: { folders: ['src'], patterns: ['**/*.ts'] },
	fix: { folders: ['src'], patterns: ['**/*.ts'] },
	build: {
		distFolder: 'dist',
		waitingMessage: ' 📦 Building Package: nhb-toolbox...',
		commands: [
			{
				cmd: 'tsc',
				args: ['-p', 'tsconfig.cjs.json'],
			},
			{
				cmd: 'tsc',
				args: ['-p', 'tsconfig.esm.json'],
			},
			{
				cmd: 'tsc',
				args: ['-p', 'tsconfig.dts.json'],
			},
		],
		after: [
			async () => await fixJsExtensions('dist/esm'),
			() => {
				restorePureTags('dist/esm');
				restorePureTags('dist/cjs');
			},
			async () =>
				await fixTypeExports({
					distPath: 'dist/dts',
					packageJsonPath: 'package.json',
					typeFileCandidates: ['types.d.ts', 'interfaces.d.ts'],
					extraPatterns: [{ pattern: 'plugins', folderName: 'plugins' }],
					extraStatic: {
						'./types': {
							types: './dist/dts/types/index.d.ts',
							default: './dist/dts/types/index.d.ts',
						},
						'./constants': {
							types: './dist/dts/constants.d.ts',
							import: './dist/esm/constants.js',
							require: './dist/cjs/constants.js',
						},
						'./chronos': {
							types: './dist/dts/date/Chronos.d.ts',
							import: './dist/esm/date/Chronos.js',
							require: './dist/cjs/date/Chronos.js',
						},
						'./color': {
							types: './dist/dts/colors/Color.d.ts',
							import: './dist/esm/colors/Color.js',
							require: './dist/cjs/colors/Color.js',
						},
						'./converter': {
							types: './dist/dts/converter/Converter.d.ts',
							import: './dist/esm/converter/Converter.js',
							require: './dist/cjs/converter/Converter.js',
						},
						'./pluralizer': {
							types: './dist/dts/pluralizer/Pluralizer.d.ts',
							import: './dist/esm/pluralizer/Pluralizer.js',
							require: './dist/cjs/pluralizer/Pluralizer.js',
						},
						'./verbalizer': {
							types: './dist/dts/verbalizer/Verbalizer.d.ts',
							import: './dist/esm/verbalizer/Verbalizer.js',
							require: './dist/cjs/verbalizer/Verbalizer.js',
						},
						'./http-status': {
							types: './dist/dts/http-status/HttpStatus.d.ts',
							import: './dist/esm/http-status/HttpStatus.js',
							require: './dist/cjs/http-status/HttpStatus.js',
						},
						'./stylog': {
							types: './dist/dts/stylog/Stylog.d.ts',
							import: './dist/esm/stylog/Stylog.js',
							require: './dist/cjs/stylog/Stylog.js',
						},
					},
				}),
		],
	},
	commit: {
		runFormatter: false,
		wrapPrefixWith: '`',
	},
	count: {
		defaultPath: 'src/index.ts',
		excludePaths: [
			'node_modules',
			'coverage',
			'dist',
			'__tests__',
			'__ideas__',
			'__dump__',
		],
	},
	module: {
		force: false,
		defaultTemplate: 'chronos-plugin',
		templates: {
			'chronos-plugin': {
				createFolder: false,
				destination: 'src/date/plugins',
				files: generatePlugin,
			},
		},
	},
});

// ! ============= Custom Templates ============= ! //

/**
 *  @import { FileGenerator } from 'nhb-scripts';
 */

/** @type { FileGenerator } */
function generatePlugin(pluginName) {
	return [
		{
			name: `${pluginName}Plugin.ts`,
			content: `type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
    interface Chronos {

        ${pluginName}(): void;
    }
}

/** * Plugin to inject \`${pluginName}\` method */
export const ${pluginName}Plugin = (ChronosClass: MainChronos): void => {
    ChronosClass.prototype.${pluginName} = function (this) {
        // Logic
    };
};`,
		},
	];
}

// ! ============= Post Build Hooks ============= ! //

/**
 * Recursively processes target JS files and inserts `@__PURE__` before each Object.freeze(...) expression.
 * @param {string} dir Directory to traverse and find target files to fix.
 */
function restorePureTags(dir) {
	let totalFiles = 0;

	/** @param {string} folder */
	const traverse = (folder) => {
		for (const file of readdirSync(folder)) {
			const full = joinPath(folder, file);
			const stat = statSync(full);

			if (stat.isDirectory()) {
				traverse(full);
				continue;
			}

			const TARGET_FILES = [
				'constants.js',
				'countries.js',
				'timezone.js',
				'seasons.js',
				'css-colors.js',
				'rules.js',
			];

			if (!TARGET_FILES.includes(file)) continue;
			if (!file.endsWith('.js')) continue;

			const code = readFileSync(full, 'utf8');

			// Avoid duplicating the tag if already present
			const updated = code.replace(/([^/])(?=(Object\.freeze\s*\())/g, (match, p1) => {
				// If already tagged before, skip
				if (p1.includes('@__PURE__')) return match;
				return p1 + '/* @__PURE__ */ ';
			});

			if (updated !== code) {
				writeFileSync(full, updated, 'utf8');
				totalFiles++;
			}
		}
	};

	traverse(dir);

	mimicClack(`✓ Restored /* @__PURE__ */ tags in ${totalFiles} files in ${dir} directory!`);
}
