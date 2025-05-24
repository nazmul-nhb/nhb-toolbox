import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	target: ['esnext'],
	outDir: 'dist',
	dts: true,
	clean: true,
	sourcemap: true,
	// splitting: false,
	// bundle: false,
	// shims: true,
	skipNodeModulesBundle: true,
	esbuildOptions(options) {
		options.resolveExtensions = ['.ts', '.js', '.mts', '.mjs'];
	},
});
