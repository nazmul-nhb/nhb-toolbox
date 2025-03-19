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
 * @param {string} newVersion - The new version for commit message.
 */
async function commitAndPush(newVersion) {
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
        await execPromise(`git commit -m "chore: updated version to ${newVersion}"`);
        await execPromise("git push");

        console.info(chalk.blue(`🚀 Version ${newVersion} committed & pushed successfully!`));
    } catch (error) {
        console.error(chalk.red("🛑 Git error:", error));
    }
}

/** * Main function to prompt for version, update `package.json`, and commit changes. */
async function main() {
    try {
        const packageJsonPath = "./package.json";
        const packageData = await fs.readFile(packageJsonPath, "utf-8");
        const packageJson = JSON.parse(packageData);
        const currentVersion = packageJson.version;

        const newVersion = await rl.question(chalk.cyan(`Current version: ${chalk.yellow(currentVersion)}\nEnter new version: `));
        rl.close();

        if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
            console.info(chalk.yellow("⚠ Invalid version format! Use semver (e.g., 2.4.7)."));
            process.exit(1);
        }

        await updateVersion(newVersion);
        await commitAndPush(newVersion);
    } catch (error) {
        console.error(chalk.red("🛑 Unexpected error:", error));
    }
}

main();
