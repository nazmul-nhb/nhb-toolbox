import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts', 'src/chronos.ts'],
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
		options.entryNames = '[name]';
		options.pure = [
			'Object.freeze',
			'console.warn',
			'console.log',
			'console.error',
		];
		// options.resolveExtensions = ['.ts', '.js', '.mts', '.mjs'];
	},
});
