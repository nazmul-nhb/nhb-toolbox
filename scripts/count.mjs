// @ts-check

import chalk from 'chalk';
import fs from 'fs/promises';
import { extname, join, resolve } from 'path';
import { createInterface } from 'readline/promises';
import tsModule from 'typescript';

/**
 * @typedef {Object} Exports Object defining different export counts.
 *
 * @property {number} default Default export count.
 * @property {number} namedExportsTotal Total named export count.
 * @property {number} namedExportsDirect Original named export count.
 * @property {number} namedExportsAliased Aliased named export count.
 * @property {number} namedTypeExports Total named type export count.
 */

/**
 * Prompts the user to enter a JS/TS/MJS (with extension) file path.
 * @returns {Promise<string>} The resolved file path with extension or directory path.
 */
async function getFilePath() {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const inputPath = await rl.question(
		chalk.cyanBright(
			`───────────────────────────────────────────────────────────────────────────────\n` +
				`🎯 Please specify the path to a ${chalk.yellowBright.bold('"JavaScript/TypeScript/MJS"')} file or folder.\n` +
				`   - Enter the full file path (with extension) to process a specific file.\n` +
				`   - Enter a folder path to scan all ${chalk.bold.yellowBright('*.js')}, ${chalk.bold.yellowBright('*.ts')}, or ${chalk.bold.yellowBright('*.mjs')} files within.\n` +
				`   - Leave it empty to scan the default file: ${chalk.bgYellowBright.bold.whiteBright(' src/index.ts ')}.\n` +
				`───────────────────────────────────────────────────────────────────────────────\n`,
		),
	);

	rl.close();

	const filePath = inputPath.trim() || 'src/index.ts';

	return resolve(filePath);
}

/**
 * * Counts the types of exports in a JS/TS file.
 * @param {string} filePath - Full path to the file.
 * @returns {Promise<Exports>}
 */
async function countExports(filePath) {
	try {
		const content = await fs.readFile(filePath, 'utf-8');
		const sourceFile = tsModule.createSourceFile(
			filePath,
			content,
			tsModule.ScriptTarget.Latest,
			true,
		);

		let namedExportsTotal = 0;
		let defaultExports = 0;
		let aliasedExports = 0;
		let namedTypeExports = 0;

		/** @param {tsModule.Node} node */
		const checkNode = (node) => {
			if (tsModule.isExportAssignment(node)) {
				if (!node.isExportEquals) defaultExports += 1;
			} else if (
				tsModule.isFunctionDeclaration(node) ||
				tsModule.isClassDeclaration(node) ||
				tsModule.isInterfaceDeclaration(node) ||
				tsModule.isEnumDeclaration(node) ||
				tsModule.isTypeAliasDeclaration(node) ||
				tsModule.isVariableStatement(node)
			) {
				if (
					node.modifiers?.some(
						(m) => m.kind === tsModule.SyntaxKind.ExportKeyword,
					)
				) {
					if (
						node.modifiers.some(
							(m) =>
								m.kind === tsModule.SyntaxKind.DefaultKeyword,
						)
					) {
						defaultExports += 1;
					} else {
						namedExportsTotal += 1;
					}
				}
			} else if (
				tsModule.isExportDeclaration(node) &&
				node.exportClause &&
				tsModule.isNamedExports(node.exportClause)
			) {
				if (node.isTypeOnly) {
					// Count type exports separately
					namedTypeExports += node.exportClause.elements.length;
				} else {
					// Normal named exports
					namedExportsTotal += node.exportClause.elements.length;
					for (const el of node.exportClause.elements) {
						if (
							el.propertyName &&
							el.propertyName.text !== el.name.text
						) {
							aliasedExports += 1;
						}
					}
				}
			}

			tsModule.forEachChild(node, checkNode);
		};

		tsModule.forEachChild(sourceFile, checkNode);

		return {
			default: defaultExports,
			namedExportsTotal,
			namedExportsDirect: namedExportsTotal - aliasedExports,
			namedExportsAliased: aliasedExports,
			namedTypeExports,
		};
	} catch (err) {
		console.error(chalk.red('🛑 Failed to parse or read file:\n'), err);
		process.exit(1);
	}
}

/**
 * Scans a folder recursively and returns an array of all .js, .ts, and .mjs files.
 * @param {string} folderPath - Folder to scan.
 * @returns {Promise<string[]>} List of file paths.
 */
async function getFilesFromFolder(folderPath) {
	const files = await fs.readdir(folderPath, { withFileTypes: true });

	/** @type {string[]} */
	let filePaths = [];

	for (const file of files) {
		const fullPath = join(folderPath, file.name);
		if (file.isDirectory()) {
			filePaths = filePaths.concat(await getFilesFromFolder(fullPath));
		} else if (['.js', '.ts', '.mjs'].includes(extname(file.name))) {
			filePaths.push(fullPath);
		}
	}

	return filePaths;
}

/** * Main execution block. */
(async () => {
	try {
		const filePath = await getFilePath();

		let filesToProcess = [];
		const stats = await fs.stat(filePath);

		if (stats.isDirectory()) {
			// If it's a directory, scan for .js/.ts/.mjs files inside
			filesToProcess = await getFilesFromFolder(filePath);
			if (filesToProcess.length === 0) {
				throw new Error(
					'No `.js`, `.mjs` or `.ts` files found in the folder.',
				);
			}
		} else {
			// If it's a file, just process that file
			filesToProcess = [filePath];
		}

		// Process each file in the list
		for (const file of filesToProcess) {
			const result = await countExports(file);

			console.info(chalk.green(`\n📦 Export Summary for "${file}":`));
			console.info(
				chalk.yellow(`🔸 Default Exports        : ${result.default}`),
			);
			console.info(
				chalk.yellow(
					`🔹 Named Exports (Total)  : ${result.namedExportsTotal}`,
				),
			);
			console.info(
				chalk.yellow(
					`   ┣ Direct               : ${result.namedExportsDirect}`,
				),
			);
			console.info(
				chalk.yellow(
					`   ┗ Aliased              : ${result.namedExportsAliased}`,
				),
			);
			console.info(
				chalk.yellow(
					`🔺 Total Type Exports	  : ${result.namedTypeExports}`,
				),
			);
		}
	} catch (error) {
		console.error(chalk.red('🛑 Unexpected Error:\n'), error);
		process.exit(1);
	}
})();
