import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true
        },
        {
            file: 'dist/index.min.js',
            format: 'cjs',
            plugins: [terser()],
            sourcemap: true
        },
        {
            file: 'dist/index.umd.js',
            format: 'umd',
            name: 'NHBToolBox',
            plugins: [terser()],
            sourcemap: true,
        },
    ],
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
            declaration: true,
            declarationDir: './dist',
            module: 'esnext',
            sourceMap: true,
        }),
        nodeResolve(),
        commonjs(),
        // terser(),
    ],
    external: [
        // List any external dependencies here that should not be bundled
        // 'react', 'lodash' etc.
    ],
};