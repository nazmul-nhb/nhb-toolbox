import { isValidTime } from './guards';
import type { GreetingConfigs } from './types';
import {
	extractHourMinute,
	getCurrentDateTime,
	getTotalMinutes,
} from './utils';

/**
 * * Returns a greeting message based on the provided time or current time.
 *
 * @param configs - Configuration options for greeting times and messages.
 * @returns The appropriate greeting message.
 */
export function getGreeting(configs?: GreetingConfigs): string {
	const {
		morningEnds = '11:59',
		noonEnds = '12:59',
		afternoonEnds = '17:59',
		eveningEnds = '23:59',
		midnightEnds = '02:59',
		currentTime,
		appendToMsg = '',
		prependToMsg = '',
		morningMessage = 'Good Morning!',
		noonMessage = 'Good Noon!',
		afternoonMessage = 'Good Afternoon!',
		eveningMessage = 'Good Evening!',
		midnightMessage = 'Hello, Night Owl!',
		defaultMessage = 'Greetings!',
	} = configs || {};

	let hour: number;
	let minute: number;

	if (currentTime && isValidTime(currentTime)) {
		[hour, minute] = extractHourMinute(currentTime);
	} else {
		hour = getCurrentDateTime().getHours();
		minute = getCurrentDateTime().getMinutes();
	}

	const currentTotalMinutes = hour * 60 + minute;

	const morningEndMinutes = getTotalMinutes(morningEnds);
	const noonEndMinutes = getTotalMinutes(noonEnds);
	const afternoonEndMinutes = getTotalMinutes(afternoonEnds);
	const eveningEndMinutes = getTotalMinutes(eveningEnds);
	const midnightEndMinutes = getTotalMinutes(midnightEnds);

	if (currentTotalMinutes <= midnightEndMinutes) {
		return prependToMsg.concat(midnightMessage.concat(appendToMsg));
	} else if (currentTotalMinutes <= morningEndMinutes) {
		return prependToMsg.concat(morningMessage.concat(appendToMsg));
	} else if (currentTotalMinutes <= noonEndMinutes) {
		return prependToMsg.concat(noonMessage.concat(appendToMsg));
	} else if (currentTotalMinutes <= afternoonEndMinutes) {
		return prependToMsg.concat(afternoonMessage.concat(appendToMsg));
	} else if (currentTotalMinutes <= eveningEndMinutes) {
		return prependToMsg.concat(eveningMessage.concat(appendToMsg));
	} else {
		return prependToMsg.concat(defaultMessage.concat(appendToMsg));
	}
}
