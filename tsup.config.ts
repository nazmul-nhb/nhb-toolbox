import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/**/*.ts'],
	format: ['esm', 'cjs'],
	dts: { resolve: true },
	clean: true,
	sourcemap: true,
	target: ['esnext'],
	// splitting: false,
	skipNodeModulesBundle: true,
	bundle: false,
	shims: true,
	outDir: 'dist',
	esbuildOptions(options) {
		options.resolveExtensions = ['.ts', '.js', '.mts', '.mjs'];
	},
});
