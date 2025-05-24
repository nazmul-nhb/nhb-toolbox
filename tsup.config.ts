import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/**/*.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	clean: true,
	sourcemap: true,
	target: ['esnext'],
	// splitting: false,
	skipNodeModulesBundle: true,
	bundle: false,
	shims: true,
	outDir: 'dist',
});
