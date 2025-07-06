// @ts-check

import { defineModuleConfig } from 'nhb-scripts';

export default defineModuleConfig({
    destination: 'src', // optional, default: "src/app/modules"
    force: false, // `true` if you want to override the existing module
    customTemplates: {
        'Chronos Plugin': {
            createFolder: false,
            destination: 'src/date/plugins', // optional, will prioritize inputs from cli
            // Use dynamic moduleName in filenames and contents
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
});
