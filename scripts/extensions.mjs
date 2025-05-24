// @ts-check
import fs from 'fs/promises';
import { join } from 'path';

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
		} else if (entry.isFile() && entry.name.endsWith('.mjs')) {
			const code = await fs.readFile(fullPath, 'utf8');

			// Replace relative imports/exports that don’t end with .js/.json/.mjs
			const fixed = code.replace(
				/(?<=\b(?:import|export)[^'"]*?from\s*['"])(\.{1,2}\/[^'"]+?)(?=(?<!\.m?js|\.json)['"])/g,
				'$1.mjs',
			);

			await fs.writeFile(fullPath, fixed);
		}
	}
};

await fixJsExtensions('./dist');
