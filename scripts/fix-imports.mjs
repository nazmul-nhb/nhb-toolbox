// @ts-check

import chalk from 'chalk';
import fs from 'fs/promises';
import { join } from 'path';

/**
 * * Fix .ts extensions in ESM files.
 * @param {string} dir - Directory to fix
 */
export const fixTsExtensions = async (dir) => {
	const entries = await fs.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);

		if (entry.isDirectory()) {
			await fixTsExtensions(fullPath);
		} else if (entry.isFile() && entry.name.endsWith('.ts')) {
			const code = await fs.readFile(fullPath, 'utf8');

			// Replace relative imports/exports that don’t end with .ts/.json
			const fixed = code.replace(
				/(?<=\b(?:import|export)[^'"]*?from\s*['"])(\.{1,2}\/[^'"]+?)(?=(?<!\.ts|\.json)['"])/g,
				'$1.ts',
			);

			await fs.writeFile(fullPath, fixed);
		}
	}

	console.info(
		chalk.greenBright(
			`Appended ${chalk.yellowBright('*.ts')} in import statements!`,
		),
	);
};

/**
 * * Fix .js extensions in ESM files.
 * @param {string} dir - Directory to fix
 */
export const fixJsExtensions = async (dir) => {
	const entries = await fs.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);

		if (entry.isDirectory()) {
			await fixJsExtensions(fullPath);
		} else if (entry.isFile() && entry.name.endsWith('.js')) {
			const code = await fs.readFile(fullPath, 'utf8');

			// Replace relative imports/exports that don’t end with .js/.json/.mjs
			const fixed = code.replace(
				/(?<=\b(?:import|export)[^'"]*?from\s*['"])(\.{1,2}\/[^'"]+?)(?=(?<!\.m?js|\.json)['"])/g,
				'$1.js',
			);

			await fs.writeFile(fullPath, fixed);
		}
	}

	console.info(
		chalk.greenBright(
			`Appended ${chalk.yellowBright('*.js')} in import statements!`,
		),
	);
};
