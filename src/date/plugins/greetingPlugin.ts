import { getGreeting } from '../greet';
import type { $Chronos, ClockTime, GreetingConfigs } from '../types';

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Returns a greeting message based on current instance of `Chronos` time or provided time in the `configs`.
		 *
		 * @remarks This method internally uses {@link https://nhb-toolbox.vercel.app/docs/utilities/date/getGreeting getGreeting} function.
		 *
		 * @param configs - Configuration options for greeting times and messages.
		 * @returns The appropriate greeting message.
		 */
		getGreeting(configs?: GreetingConfigs): string;

		/**
		 * @instance Returns a greeting message based on current instance of `Chronos` time or provided time in the `configs`.
		 *
		 * @remarks This method is an alias for {@link https://nhb-toolbox.vercel.app/docs/classes/Chronos/format#getgreeting getGreeting} method.
		 *
		 * @param configs - Configuration options for greeting times and messages.
		 * @returns The appropriate greeting message.
		 */
		greet(configs?: GreetingConfigs): string;
	}
}

/** * Plugin to inject `getGreeting`/`greet` method */
export const greetingPlugin = ($Chronos: $Chronos): void => {
	$Chronos.prototype.getGreeting = function (configs) {
		const currentTime = this.formatStrict('HH:mm') as ClockTime;

		return getGreeting({ currentTime, ...configs });
	};

	$Chronos.prototype.greet = function (configs) {
		return this.getGreeting(configs);
	};
};
