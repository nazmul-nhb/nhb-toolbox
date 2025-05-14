import chalk from 'chalk';
import { execa } from 'execa';
import fs from 'fs/promises';
import readline from 'readline/promises';
import { estimator } from './estimator.mjs';

/**
 * @typedef {Object} PackageJson - Contents from `package.json`.
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
 * @property {string} homepage - The URL of the homepage for the package.
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
 * @param {string} version - The updated version number.
 */
async function commitAndPush(commitMessage, version) {
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
			chalk.green(
				`✅ Version ${version} pushed with message: "${commitMessage}"`,
			),
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

/**
 * * Checks if the new version is equal or greater than the current version.
 * @param {string} newVersion - The new version entered.
 * @param {string} oldVersion - The current version.
 * @returns {boolean} True if newVersion is equal or greater, otherwise false.
 */
function isValidVersion(newVersion, oldVersion) {
	if (newVersion === oldVersion) return true;

	const [major1, minor1, patch1] = newVersion.split('.').map(Number);
	const [major2, minor2, patch2] = oldVersion.split('.').map(Number);

	return (
		major1 > major2 ||
		(major1 === major2 && minor1 > minor2) ||
		(major1 === major2 && minor1 === minor2 && patch1 > patch2)
	);
}

/** * Main function to handle version bump, commit, and formatting. */
(async () => {
	try {
		const packageJsonPath = './package.json';
		const packageData = await fs.readFile(packageJsonPath, 'utf-8');

		/** @type {PackageJson} */
		const packageJson = JSON.parse(packageData);
		const currentVersion = packageJson.version;

		/** @type {string} - New Version */
		let newVersion;

		while (true) {
			newVersion = await rl.question(
				chalk.cyan(
					`Current version: ${chalk.yellow(currentVersion)}\nEnter new version: `,
				),
			);

			if (!newVersion?.trim()) {
				newVersion = currentVersion;
				console.info(
					chalk.cyanBright(
						`✅ Continuing with version ${chalk.yellow(newVersion)}`,
					),
				);
				break;
			}

			if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
				console.info(
					chalk.yellow(
						'⚠ Invalid version format! Use semver (e.g., 1.2.3).',
					),
				);
				continue;
			}

			if (!isValidVersion(newVersion, currentVersion)) {
				console.info(
					chalk.yellow(
						'⚠ New version must be equal or greater than the current version!',
					),
				);
				continue;
			}

			break;
		}

		const commitMessage = await rl.question(
			chalk.cyan('Enter commit message: '),
		);

		rl.close();

		if (newVersion === currentVersion) {
			console.info(
				chalk.yellowBright(
					`✅ No version change detected. Current version: ${newVersion}`,
				),
			);
		} else {
			await updateVersion(newVersion);
		}

		await runFormatter();
		await commitAndPush(commitMessage, newVersion);
	} catch (error) {
		console.error(chalk.red('🛑 Unexpected Error:', error));
		process.exit(1);
	}
})();
