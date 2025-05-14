// @ts-check

import chalk from 'chalk';
import { execa } from 'execa';
import { globby } from 'globby';
import { estimator } from './estimator.mjs';

// Function to visualize fixing process
(async () => {
	const startTime = performance.now();

	try {
		// Get all TypeScript files for linting and fixing
		const files = await globby(['src/**/*.ts']);

		// Start fixing linting issues...
		await estimator(
			execa('npx', ['eslint', 'src', '--fix'], {
				stdio: 'inherit',
				reject: false,
			}),
			chalk.yellowBright('Fixing Fixable Linting Errors...'),
		);

		// Calculate total files and time
		const totalFiles = files.length;
		const endTime = performance.now();
		const fixTime = ((endTime - startTime) / 1000).toFixed(2);

		console.info(
			chalk.green(
				`\n✓ Total Scanned Files: ${chalk.blueBright.bold(totalFiles)}`,
			),
		);
		console.info(
			chalk.green(
				`✓ Linting completed in ${chalk.blueBright.bold(fixTime)} seconds!`,
			),
		);
	} catch (error) {
		console.error(chalk.red('🛑 Fixing Failed!'), error);
		process.exit(1);
	}
})();
