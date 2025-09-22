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
		excludePaths: ['node_modules', 'dist', '__tests__', 'coverage'],
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

/** * Plugin to inject ${pluginName} method */
export const ${pluginName}Plugin = (ChronosClass: MainChronos): void => {
    ChronosClass.prototype.${pluginName} = function (this: ChronosConstructor): void {
        // Logic
    };
};`,
		},
	];
}
