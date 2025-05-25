import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	target: ['esnext'],
	outDir: 'dist',
	dts: true,
	clean: true,
	sourcemap: true,
	splitting: true,
	bundle: true,
	shims: true,
	treeshake: true,
	skipNodeModulesBundle: true,
	esbuildOptions(options) {
		options.treeShaking = true;
		options.pure = [
			'Object.freeze',
			'console.warn',
			'console.log',
			'console.error',
			'Chronos',
			'_Chronos',
		];
		// options.resolveExtensions = ['.ts', '.js', '.mts', '.mjs'];
	},
});
