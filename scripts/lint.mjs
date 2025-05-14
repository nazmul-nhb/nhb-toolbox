// @ts-check

import chalk from 'chalk';
import { execa } from 'execa';
import { globby } from 'globby';
import { estimator } from './estimator.mjs';

// Function to visualize linting process
(async () => {
	const startTime = performance.now();

	try {
		// Get all TypeScript files for linting
		const files = await globby(['src/**/*.ts']);

		// Start linting...
		await estimator(
			execa('npx', ['eslint', 'src'], {
				stdio: 'inherit',
				reject: false,
			}),
			chalk.yellowBright('Linting Your Code...'),
		);

		// Calculate total files and time
		const totalFiles = files.length;
		const endTime = performance.now();
		const lintTime = ((endTime - startTime) / 1000).toFixed(2);

		console.info(
			chalk.green(
				`\n✓ Total Scanned Files: ${chalk.blueBright.bold(totalFiles)}`,
			),
		);
		console.info(
			chalk.green(
				`✓ Linting completed in ${chalk.blueBright.bold(lintTime)} seconds!`,
			),
		);
	} catch (error) {
		console.error(chalk.red('🛑 Linting Failed!'), error);
		process.exit(1);
	}
})();
