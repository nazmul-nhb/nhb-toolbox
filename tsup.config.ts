import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	clean: true,
	sourcemap: true,
	target: ['esnext'],
	// splitting: false,
	skipNodeModulesBundle: true,
	// bundle: false,
	shims: true,
	outDir: 'dist',
	esbuildOptions(options) {
		options.resolveExtensions = ['.ts', '.js', '.mts', '.mjs'];
	},
});
