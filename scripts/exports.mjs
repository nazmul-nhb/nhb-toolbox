import chalk from 'chalk';
import fs from 'fs/promises';
import { extname, resolve } from 'path';
import { createInterface } from 'readline/promises';
import tsModule from 'typescript';

/**
 * @typedef {Object} Exports Object defining different export counts.
 *
 * @property {number} default Default export count.
 * @property {number} namedExportsTotal Total named export count.
 * @property {number} namedExportsDirect Original named export count.
 * @property {number} namedExportsAliased Aliased named export count.
 */

/**
 * Prompts the user to enter a JS/TS file path (with or without extension).
 * @returns {Promise<string>} The resolved file path with extension.
 */
async function getFilePath() {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const inputPath = await rl.question(
		chalk.cyan(
			'Enter the path to the JS/TS file (with or without extension): ',
		),
	);
	rl.close();

	const ext = extname(inputPath);
	let fullPath = inputPath;

	if (!ext) {
		const tryPaths = [inputPath + '.ts', inputPath + '.js'];
		for (const path of tryPaths) {
			try {
				await fs.access(path);
				fullPath = path;
				break;
			} catch {
				continue;
			}
		}
		if (fullPath === inputPath) {
			throw new Error('File not found with either .ts or .js extension.');
		}
	}

	return resolve(fullPath);
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
				node.exportClause
			) {
				if (tsModule.isNamedExports(node.exportClause)) {
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
		};
	} catch (err) {
		console.error(chalk.red('🛑 Failed to parse or read file:\n'), err);
		process.exit(1);
	}
}

/** * Main execution block. */
(async () => {
	try {
		const filePath = await getFilePath();
		const result = await countExports(filePath);

		console.info(chalk.green(`\n📦 Export Summary for "${filePath}":`));
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
	} catch (error) {
		console.error(chalk.red('🛑 Unexpected Error:\n'), error);
		process.exit(1);
	}
})();
