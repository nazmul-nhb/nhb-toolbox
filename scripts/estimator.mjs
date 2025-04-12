// @ts-check

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import progressEstimator from 'progress-estimator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * * Walks up from the current directory to find the project root (containing `package.json`).
 *
 * @param {string} fromDir Starting directory
 * @returns {string} Directory path containing package.json
 */
function findProjectRoot(fromDir) {
	let currentDir = fromDir;

	while (!existsSync(join(currentDir, 'package.json'))) {
		const parentDir = dirname(currentDir);
		if (parentDir === currentDir) {
			// Reached filesystem root without finding package.json
			break;
		}
		currentDir = parentDir;
	}

	return currentDir;
}

const projectRoot = findProjectRoot(__dirname);

/**
 * * An instance of the progress-estimator used to log progress for long-running tasks.
 *
 * Uses a `.estimator` directory in the project root to store timing metadata,
 * which helps in providing more accurate estimates in subsequent runs.
 *
 * @type {progressEstimator.ProgressEstimator}
 */
export const estimator = progressEstimator({
	storagePath: join(projectRoot, '.estimator'),
});
