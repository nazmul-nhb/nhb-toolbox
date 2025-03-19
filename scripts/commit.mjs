import chalk from 'chalk';
import { execa } from 'execa';
import fs from 'fs/promises';
import { dirname, join } from 'path';
import progressEstimator from 'progress-estimator';
import readline from 'readline/promises';
import { fileURLToPath } from 'url';

/**
 * @typedef {Object} PackageJson
 *
 * @property {string} name - The name of the package.
 * @property {string} version - The version of the package.
 * @property {string} description - The description of the package.
 * @property {string} main - The main entry point of the package.
 * @property {string} types - The type definitions entry point of the package.
 * @property {Record<string, string>} scripts - The scripts for running various commands.
 * @property {Object} publishConfig - Configuration related to publishing the package.
 * @property {string} publishConfig.access - The publish access level (e.g., "public").
 * @property {string[]} files - List of files to include when publishing the package.
 * @property {Object} repository - Information about the repository.
 * @property {string} repository.type - The type of the version control system (e.g., "git").
 * @property {string} repository.url - The URL of the repository.
 * @property {string[]} keywords - Keywords related to the package.
 * @property {Object} author - Information about the package author.
 * @property {string} author.name - The name of the author.
 * @property {string} author.email - The email of the author.
 * @property {string} license - The license for the package.
 * @property {Object} devDependencies - The development dependencies of the package.
 * @property {Record<string, string>} devDependencies - List of dev dependencies with their versions.
 * @property {string} packageManager - The package manager used (e.g., "pnpm").
 */

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const estimator = progressEstimator({
	storagePath: join(__dirname, '.estimator'),
});

/**
 * * Reads `package.json`, updates the version, and writes the changes.
 * @param {string} newVersion - The new version to set in package.json
 */
async function updateVersion(newVersion) {
	try {
		const packageJsonPath = './package.json';
		const packageData = await fs.readFile(packageJsonPath, 'utf-8');

		/** @type {PackageJson} */
		const packageJson = JSON.parse(packageData);

		packageJson.version = newVersion;
		await fs.writeFile(
			packageJsonPath,
			JSON.stringify(packageJson, null, 2) + '\n',
		);

		console.info(chalk.green(`✅ Version updated to ${newVersion}`));
	} catch (error) {
		console.error(chalk.red('🛑 Error updating package.json:', error));
		throw error;
	}
}

/**
 * * Runs Git commands to commit and push version changes.
 * @param {string} commitMessage - The commit message for version update.
 */
async function commitAndPush(commitMessage) {
	try {
		console.info(chalk.blue('📤 Committing and pushing changes...'));

		await estimator(
			execa('git', ['add', '.']).then(() =>
				execa('git', ['commit', '-m', commitMessage]).then(() =>
					execa('git', ['push'], { stdio: 'inherit' }),
				),
			),
			chalk.blue('Committing & pushing...'),
		);

		console.info(
			chalk.green(`✅ Changes pushed with message: "${commitMessage}"`),
		);
	} catch (error) {
		console.error(chalk.red('🛑 Git error:', error));
		throw error;
	}
}

/** * Runs prettier to format the codebase. */
async function runFormatter() {
	try {
		console.info(chalk.magenta('🎨 Running Prettier to format code...'));

		await estimator(
			execa('prettier', ['--write', '.'], { stdio: 'inherit' }),
			chalk.magenta('Formatting in progress...'),
		);

		console.info(chalk.green('✅ Formatting complete!'));
	} catch (error) {
		console.error(chalk.red('🛑 Error running prettier:', error));
		throw error;
	}
}

/** * Main function to handle version bump, commit, and formatting. */
(async () => {
	try {
		const packageJsonPath = './package.json';
		const packageData = await fs.readFile(packageJsonPath, 'utf-8');

		/** @type {PackageJson} */
		const packageJson = JSON.parse(packageData);
		const currentVersion = packageJson.version;

		const newVersion = await rl.question(
			chalk.cyan(
				`Current version: ${chalk.yellow(currentVersion)}\nEnter new version: `,
			),
		);
		if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
			console.info(
				chalk.yellow(
					'⚠ Invalid version format! Use semver (e.g., 1.2.3).',
				),
			);
			process.exit(1);
		}

		const commitMessage = await rl.question(
			chalk.cyan('Enter commit message: '),
		);
		rl.close();

		await updateVersion(newVersion);
		await runFormatter();
		await commitAndPush(commitMessage);
	} catch (error) {
		console.error(chalk.red('🛑 Unexpected Error:', error));
		process.exit(1);
	}
})();
