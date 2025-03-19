import chalk from 'chalk';
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import progressEstimator from 'progress-estimator';
import { globby } from 'globby';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up progress-estimator cache
const estimator = progressEstimator({ storagePath: join(__dirname, '.estimator') });

// Function to determine icon based on file extension
const getFileIcon = (filePath) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    return ext === 'js' ? '📄' : '📁';
};

(async () => {
    const startTime = performance.now();

    try {
        // Clean and Build
        await estimator(execa('rimraf', ['dist']).then(() => execa('tsc', [], { stdio: 'inherit' })),
            chalk.yellowBright('Building Your Package...')
        );

        // Gather Transformed Files
        const outputFiles = await globby(['dist/**/*'], { stats: true });

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

        console.info(chalk.green(`\n✓ Package was built in ${chalk.blueBright.bold(buildTime)} seconds!`));
    } catch (error) {
        console.error(chalk.red('🛑 Build Failed!'), error);
        process.exit(1);
    }
})();
