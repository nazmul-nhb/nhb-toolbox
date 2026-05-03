import { defineConfig } from 'tsdown';

export default defineConfig({
	globalName: 'Chronos',
	entry: ['./src/index.ts', './src/utils.ts', './src/types.ts', './src/plugins/*.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	clean: true,
	exports: true,
	unbundle: false,
	treeshake: true,
	minify: true,
});
