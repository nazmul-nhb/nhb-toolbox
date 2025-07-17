// @ts-check

import { defineScriptConfig, fixJsExtensions, fixTypeExports } from 'nhb-scripts';

export default defineScriptConfig({
    format: {
        args: ['--write'],
        files: ['src'],
        ignorePath: '.prettierignore',
    },
    build: {
        distFolder: 'dist',
        commands: [
            {
                cmd: 'tsc',
                args: ['-p', 'tsconfig.cjs.json']
            },
            {
                cmd: 'tsc',
                args: ['-p', 'tsconfig.esm.json'],
                options: { stdio: 'inherit' }
            }
        ],
        after: [
            () => fixJsExtensions('dist/esm'),
            () => fixTypeExports({
                distPath: 'dist/dts',
                packageJsonPath: 'package.json',
                typeFileCandidates: ['types.d.ts', 'interfaces.d.ts'],
                extraPatterns: [
                    { pattern: 'plugins', folderName: 'plugins' },
                ],
                extraStatic: {
                    './types': {
                        types: './dist/dts/types/index.d.ts',
                        default: './dist/dts/types/index.d.ts'
                    },
                    './constants': {
                        types: './dist/dts/constants.d.ts',
                        import: './dist/esm/constants.js',
                        require: './dist/cjs/constants.js'
                    },
                }
            }),
        ],
    },
    commit: {
        runFormatter: true
    },
    count: {
        defaultPath: 'src/index.ts',
        excludePaths: ['node_modules', 'dist', 'build']
    },
    module: {
        destination: 'src',
        force: false,
        customTemplates: {
            'Chronos Plugin': {
                createFolder: false,
                destination: 'src/date/plugins',
                files: (moduleName) => [
                    {
                        name: `${moduleName}Plugin.ts`, content: `type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
    interface Chronos {

        ${moduleName}(): void;
    }
}

/** * Plugin to inject ${moduleName} method */
export const ${moduleName}Plugin = (ChronosClass: MainChronos): void => {
    ChronosClass.prototype.${moduleName} = function (this: ChronosConstructor): void {
        // Logic
    };
};`
                    },
                ]
            },
        },
    }
});
