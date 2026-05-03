// @ts-check

import { defineScriptConfig } from 'nhb-scripts';

export default defineScriptConfig({
	commit: {
		runFormatter: false,
		wrapPrefixWith: '`',
		commitTypes: {
			custom: [
				{ emoji: '💩', type: 'dump' },
				{ emoji: '🧠', type: 'ideas' },
				{ emoji: '📝', type: 'draft' },
				{ emoji: '🔣', type: 'types' },
				{ emoji: '🔡', type: 'tsdoc' },
			],
		},
	},
	count: {
		defaultPath: 'packages/nhb-toolbox/src/index.ts',
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
				destination: 'packages/nhb-toolbox/src/date/plugins',
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
			content: `import type { $Chronos } from '../types';

declare module '../Chronos' {
    interface Chronos {

        ${pluginName}(): void;
    }
}

/** * Plugin to inject \`${pluginName}\` method */
export const ${pluginName}Plugin = ($Chronos: $Chronos): void => {
    $Chronos.prototype.${pluginName} = function () {
        // Logic
    };
};`,
		},
	];
}
