import { chronos } from '../../src/index';

describe('Time must be same as the Date constructor', () => {
	const stringifyDate = (date: Date) => {
		return JSON.stringify(date).split('.')[0];
	};

	it('chronos.toDate() and new Date() should be equal after trimming milliseconds', () => {
		expect(stringifyDate(chronos().toDate())).toBe(
			stringifyDate(new Date())
		);
	});

	it('chronos.toDate() and new Date() should be equal after trimming milliseconds for UTC times', () => {
		expect(stringifyDate(chronos().toUTC().toDate())).toBe(
			stringifyDate(new Date())
		);
	});
});
