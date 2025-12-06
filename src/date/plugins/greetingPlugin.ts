import { getGreeting } from '../greet';
import type { ClockTime, GreetingConfigs } from '../types';

type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Returns a greeting message based on current instance of `Chronos` time or provided time in the `configs`.
		 *
		 * @remarks This method internally uses {@link https://toolbox.nazmul-nhb.dev/docs/utilities/date/getGreeting getGreeting} function.
		 *
		 * @param configs - Configuration options for greeting times and messages.
		 * @returns The appropriate greeting message.
		 */
		getGreeting(configs?: GreetingConfigs): string;

		/**
		 * @instance Returns a greeting message based on current instance of `Chronos` time or provided time in the `configs`.
		 *
		 * @remarks This method is an alias for {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/format#getgreeting getGreeting} method.
		 *
		 * @param configs - Configuration options for greeting times and messages.
		 * @returns The appropriate greeting message.
		 */
		greet(configs?: GreetingConfigs): string;
	}
}

/** * Plugin to inject `getGreeting`/`greet` method */
export const greetingPlugin = (ChronosClass: MainChronos): void => {
	ChronosClass.prototype.getGreeting = function (configs) {
		const currentTime = this.formatStrict('HH:mm') as ClockTime;

		return getGreeting({ currentTime, ...configs });
	};

	ChronosClass.prototype.greet = function (configs) {
		return this.getGreeting(configs);
	};
};
