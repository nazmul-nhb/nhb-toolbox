import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * * Analyze a TypeScript or JavaScript class file and report JSDoc coverage for methods and class properties.
 * @param {string} filePath
 */
function analyzeFile(filePath) {
	const content = readFileSync(filePath, 'utf8');

	const methodRegex =
		/^\s*(?:public|private|protected)?\s*(?:static\s*)?(?:async\s*)?(get\s+|set\s+)?([a-zA-Z0-9_[\]$]+)\s*\(.*?\)\s*{/gm;

	const jsdocRegex = /\/\*\*[^]*?\*\//g;
	const jsdocMatches = [...content.matchAll(jsdocRegex)].map(
		(m) => m.index ?? -1,
	);

	const methods = [...content.matchAll(methodRegex)];

	let total = 0;
	let documented = 0;

	for (const match of methods) {
		const methodIndex = match.index ?? -1;
		const hasJsDoc = jsdocMatches.some(
			(i) => i >= 0 && i < methodIndex && methodIndex - i < 300,
		);
		total++;
		if (hasJsDoc) documented++;
	}

	const percentage = total === 0 ? 0 : Math.round((documented / total) * 100);

	console.info(`📊 JSDoc Coverage Report for: ${filePath}`);
	console.info(`→ Total methods: ${total}`);
	console.info(`→ Documented methods: ${documented}`);
	console.info(`→ Coverage: ${percentage}%`);
	console.info('----------------------------------------');
}

/**
 * * Recursively analyze all .ts files in a given directory
 * @param {string} dir
 */
function analyzeAllFiles(dir) {
	const entries = readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			analyzeAllFiles(fullPath);
		} else if (
			entry.isFile() &&
			entry.name.endsWith('.ts') &&
			!entry.name.endsWith('.d.ts')
		) {
			analyzeFile(fullPath);
		}
	}
}

analyzeAllFiles('src');
