/**
 * {@link Console.log} wrapper to avoid linting issues.
 * @param data Data to log in the console.
 */
export function _logToConsole(...data: unknown[]) {
	console.log(data);
}
