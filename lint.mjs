import { execa } from 'execa';
import { globby } from 'globby';
import chalk from 'chalk';
import progressEstimator from 'progress-estimator';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up progress-estimator cache
const estimator = progressEstimator({ storagePath: join(__dirname, '.estimator') });

// Function to visualize linting process
(async () => {
    const startTime = performance.now();

    try {
        // Get all TypeScript files for linting
        const files = await globby(['src/**/*.ts']);

        // Start linting...
        await estimator(execa('eslint', ['src'], { stdio: 'inherit', reject: false }),
            chalk.yellowBright('Linting Your Code...')
        );

        // Calculate total files and time
        const totalFiles = files.length;
        const endTime = performance.now();
        const lintTime = ((endTime - startTime) / 1000).toFixed(2);

        console.info(chalk.green(`\n✓ Total Scanned Files: ${chalk.blueBright.bold(totalFiles)}`));
        console.info(chalk.green(`✓ Linting completed in ${chalk.blueBright.bold(lintTime)} seconds!`));
    } catch (error) {
        console.error(chalk.red('🛑 Linting Failed!'), error);
        process.exit(1);
    }
})();
