import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root path where the dist/dts folder is located
const distPath = path.join(__dirname, '../dist/dts');

// Get all the folders inside dist/dts (e.g., object, number, etc.)
const getModulePaths = () => {
	const moduleDirs = fs
		.readdirSync(distPath, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	return moduleDirs;
};

// Create exports entries based on folder structure
const createExports = (modulePaths) => {
	const exports = {
		'.': {
			import: './dist/esm/index.js',
			require: './dist/cjs/index.js',
			types: './dist/dts/index.d.ts',
		},
		'./package.json': './package.json',
	};

	modulePaths.forEach((module) => {
		const relativePath = `./dist/dts/${module}/types.d.ts`;
		exports[`./${module}/types`] = {
			types: relativePath,
			default: relativePath,
		};
	});

	return exports;
};

// Update package.json with new exports
const updatePackageJson = (exports) => {
	const packageJsonPath = path.join(__dirname, '../package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

	packageJson.exports = exports;

	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
	console.info('Package.json has been updated with the new exports!');
};

// Run the script
const modulePaths = getModulePaths();
const exports = createExports(modulePaths);

updatePackageJson(exports);
