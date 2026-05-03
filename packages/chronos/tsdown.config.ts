import { defineConfig } from 'tsdown';

export default defineConfig({
	globalName: 'Chronos',
	entry: ['./src/*.ts', './src/plugins/*.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	clean: true,
	exports: true,
	unbundle: true,
	treeshake: true,
	minify: true,
	checks: {
		pluginTimings: false,
		unresolvedEntry: false,
		toleratedTransform: false,
	},
});
