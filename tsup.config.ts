import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts', 'src/chronos.ts', 'src/typedefs.ts'],
	format: ['esm', 'cjs'],
	target: ['esnext'],
	outDir: 'dist',
	dts: true,
	clean: true,
	sourcemap: true,
	splitting: true,
	bundle: true,
	name: 'nhb-toolbox',
	shims: true,
	pure: ['Object.freeze', 'console.warn', 'console.log', 'console.error'],
	keepNames: true,
	treeshake: true,
	skipNodeModulesBundle: true,
	esbuildOptions(options) {
		options.entryNames = '[name]';
		options.chunkNames = '[name]-nhb';
		// options.treeShaking = true;
		// options.keepNames = true;
		// options.pure = [
		// 	'Object.freeze',
		// 	'console.warn',
		// 	'console.log',
		// 	'console.error',
		// ];
		// options.resolveExtensions = ['.ts', '.js', '.mts', '.mjs'];
	},
});
