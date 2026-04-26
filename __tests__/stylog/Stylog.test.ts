import { Stylog } from '../../src/stylog/Stylog';

describe('Stylog.toANSI', () => {
	const originalForceColor = process.env.FORCE_COLOR;
	const hadNoColor = Object.prototype.hasOwnProperty.call(process.env, 'NO_COLOR');
	const originalNoColor = process.env.NO_COLOR;

	beforeEach(() => {
		process.env.FORCE_COLOR = '1';
		delete process.env.NO_COLOR;
	});

	afterEach(() => {
		if (originalForceColor === undefined) {
			delete process.env.FORCE_COLOR;
		} else {
			process.env.FORCE_COLOR = originalForceColor;
		}

		if (hadNoColor) {
			process.env.NO_COLOR = originalNoColor;
		} else {
			delete process.env.NO_COLOR;
		}
	});

	it('reapplies the outer foreground after a nested foreground reset', () => {
		const output = Stylog.green.bold.toANSI(
			`Hello ${Stylog.red.toANSI('I should be red and bold')} I should be green and bold!`
		);

		expect(output.startsWith('\x1b[38;2;0;128;0m\x1b[1mHello ')).toBe(true);
		expect(output).toContain(
			'\x1b[38;2;255;0;0mI should be red and bold\x1b[39m\x1b[38;2;0;128;0m I should be green and bold!'
		);
	});
});
