// @ts-check

import { defineFormatConfig } from 'nhb-scripts';
    
export default defineFormatConfig({
    args: ['--write'],
    files: ['src'],
    ignorePath: '.prettierignore',
});
