// @ts-check

import { defineScriptConfig, fixJsExtensions, fixTypeExports } from 'nhb-scripts';

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
							types: './dist/dts/utils/stylog.d.ts',
							import: './dist/esm/utils/stylog.js',
							require: './dist/cjs/utils/stylog.js',
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
			content: `type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
    interface Chronos {

        ${pluginName}(): void;
    }
}

/** * Plugin to inject \`${pluginName}\` method */
export const ${pluginName}Plugin = (ChronosClass: MainChronos): void => {
    ChronosClass.prototype.${pluginName} = function (this: ChronosConstructor): void {
        // Logic
    };
};`,
		},
	];
}
