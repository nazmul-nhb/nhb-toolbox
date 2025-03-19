import chalk from "chalk";
import fs from "fs/promises";
import readline from "readline/promises";

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
        const packageJsonPath = "./package.json";
        const packageData = await fs.readFile(packageJsonPath, "utf-8");
        const packageJson = JSON.parse(packageData);

        packageJson.version = newVersion;
        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

        console.info(chalk.green(`✅ Version updated to ${newVersion}`));
    } catch (error) {
        console.error(chalk.red("🛑 Error updating package.json:", error));
        process.exit(1);
    }
}

/**
 * * Runs Git commands to commit and push version changes.
 * @param {string} commitMessage - The commit message for version update.
 */
async function commitAndPush(commitMessage) {
    try {
        const { exec } = await import("child_process");
        const execPromise = (cmd) =>
            new Promise((resolve, reject) => {
                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(stdout || stderr);
                    }
                });
            });

        await execPromise("git add .");
        await execPromise(`git commit -m "${commitMessage}"`);
        await execPromise("git push");

        console.info(chalk.blue(`🚀 Changes committed & pushed with message: "${commitMessage}"`));
    } catch (error) {
        console.error(chalk.red("🛑 Git error:", error));
    }
}

/** * Runs `node format.mjs`. */
async function runFormatter() {
    try {
        const { exec } = await import("child_process");
        const execPromise = (cmd) =>
            new Promise((resolve, reject) => {
                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(stdout || stderr);
                    }
                });
            });

        await execPromise("npm run format");
        console.info(chalk.magenta("🎨 Code formatting completed with format.mjs!"));
    } catch (error) {
        console.error(chalk.red("🛑 Error running format.mjs:", error));
    }
}

/** * Main function to handle version bump, commit, and formatting. */
async function main() {
    try {
        const packageJsonPath = "./package.json";
        const packageData = await fs.readFile(packageJsonPath, "utf-8");
        const packageJson = JSON.parse(packageData);
        const currentVersion = packageJson.version;

        const newVersion = await rl.question(chalk.cyan(`Current version: ${chalk.yellow(currentVersion)}\nEnter new version: `));
        if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
            console.info(chalk.yellow("⚠ Invalid version format! Use semver (e.g., 1.2.3)."));
            process.exit(1);
        }

        const commitMessage = await rl.question(chalk.cyan("Enter commit message: "));
        rl.close();

        await updateVersion(newVersion);
        await runFormatter();
        await commitAndPush(commitMessage);
    } catch (error) {
        console.error(chalk.red("🛑 Unexpected error:", error));
    }
}

main();
