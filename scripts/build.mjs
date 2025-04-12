// @ts-check

import chalk from 'chalk';
import { execa } from 'execa';
import { globby } from 'globby';
import { extname } from 'path';
import { estimator } from './estimator.mjs';

/**
 * * Get the icon for the file.
 * @param {string} filePath - The path of the file.
 * @returns {string} - The icon for the file.
 */
const getFileIcon = (filePath) => {
	switch (extname(filePath)) {
		case '.js':
			return '🟨';
		case '.ts':
			return '🟦';
		case '.map':
			return '🟩';

		default:
			return '🗃️ ';
	}
};

(async () => {
	const startTime = performance.now();

	try {
		// Clean and Build
		await estimator(
			execa('rimraf', ['dist']).then(() =>
				execa('tsc', ['-p', 'tsconfig.cjs.json']).then(() =>
					execa('tsc', ['-p', 'tsconfig.esm.json'], {
						stdio: 'inherit',
					}).then(() =>
						execa('node', ['./scripts/types.mjs'], {
							stdio: 'inherit',
						}),
					),
				),
			),

			chalk.yellowBright('Building Your Package...'),
		);

		// Gather Transformed Files
		const outputFiles = await globby(['dist/**/*'], {
			stats: true,
			objectMode: true,
		});

		// Log Transformed Files
		console.info(chalk.green('\n✓ Transformed Files:'));

		let totalSize = 0;

		const rows = outputFiles.map(({ path, stats }) => {
			const sizeInKB = (stats?.size || 0) / 1024;

			totalSize += sizeInKB;

			const fileIcon = getFileIcon(path);

			return [
				chalk.yellow(`${fileIcon} ${path}`),
				chalk.cyan(`${sizeInKB.toFixed(2)} kB`),
			];
		});

		const columnWidth = 80;

		rows.forEach(([left, right]) => {
			console.info(`${left.padEnd(columnWidth)}${right}`);
		});

		// Log Total Size and Build Time
		const totalSizeInKB = totalSize.toFixed(2);

		const endTime = performance.now();

		const buildTime = ((endTime - startTime) / 1000).toFixed(2);

		const totalFiles = `Total Files: ${chalk.blueBright.bold(outputFiles.length)}`;

		const totalFileSize = `Total Size: ${chalk.blueBright.bold(totalSizeInKB)} kB`;

		console.info(chalk.green(`\n✓ ${totalFiles}; ${totalFileSize}`));

		console.info(
			chalk.green(
				`\n✓ Package was built in ${chalk.blueBright.bold(buildTime)} seconds!`,
			),
		);
	} catch (error) {
		console.error(chalk.red('🛑 Build Failed!'), error);
		process.exit(1);
	}
})();
