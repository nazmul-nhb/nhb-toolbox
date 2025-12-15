import {
	Chronos,
	cloneObject,
	Converter,
	convertObjectValues,
	Currency,
	generateAnagrams,
	generateRandomColor,
	HttpStatus,
	isNativeTimeZoneId,
	isTimeWithUnit,
	isUUID,
	isValidTimeZoneId,
	parseMs,
	sanitizeData,
} from '../src';

import { createHash } from 'node:crypto';
import d from '../__dump__/english-words.json';
import { businessPlugin } from '../src/date/plugins/businessPlugin';
import { dayPartPlugin } from '../src/date/plugins/dayPartPlugin';
import { durationPlugin } from '../src/date/plugins/durationPlugin';
import { fromNowPlugin } from '../src/date/plugins/fromNowPlugin';
import { palindromePlugin } from '../src/date/plugins/palindromePlugin';
import { relativeTimePlugin } from '../src/date/plugins/relativeTimePlugin';
import { roundPlugin } from '../src/date/plugins/roundPlugin';
import { seasonPlugin } from '../src/date/plugins/seasonPlugin';
import { timeZonePlugin } from '../src/date/plugins/timeZonePlugin';
import { zodiacPlugin } from '../src/date/plugins/zodiacPlugin';
import { formatDate, getTimeZoneIds } from '../src/date/utils';
import {
	Cipher,
	decodeUUID,
	md5,
	randomHex,
	sha1,
	sha256,
	Signet,
	utf8ToBytes,
	uuid,
} from '../src/hash';
import { bytesToHex, hmacSha256 } from '../src/hash/utils';

Chronos.use(timeZonePlugin);
Chronos.use(zodiacPlugin);
Chronos.use(dayPartPlugin);
Chronos.use(seasonPlugin);
Chronos.use(roundPlugin);
Chronos.use(relativeTimePlugin);
Chronos.use(businessPlugin);
Chronos.use(fromNowPlugin);
Chronos.use(palindromePlugin);
Chronos.use(durationPlugin);

// ! ======= Runtime Tests ======= ! //

console.info(Converter(1.5, 'centimeter').formatTo('centimeter'));

// console.log(new Chronos().timeZone('BDT'));

// console.log(new Chronos().timeZone('Europe/Helsinki').toLocalISOString());
// console.log(new Chronos().timeZone('UTC+05:45'));
// console.log(new Date().toLocaleDateString());
// console.log('Local Date: ', new Chronos().timeZone('ACWST').toLocal());
// console.log('Local Date: ', new Chronos().timeZone('UTC').toLocal());
// console.log('Local Date: ', new Chronos().toUTC().toLocal());
// console.log('Local Date: ', new Chronos().toLocal());
// console.log(new Chronos().timeZone('Australia/Darwin'));
// console.log(new Chronos().timeZone('Australia/Darwin').toISOString());
// console.log(new Chronos().timeZone('Australia/Darwin').toLocalISOString());
// console.log(new Chronos().timeZone('UTC').toISOString());
// console.log(new Chronos('2025-11-11').toUTC());
// console.log(new Chronos().diff('2026-11-29', 'year'));

// console.log(
// 	new Chronos('2025-01-15').diff('2025-02-14', 'month'), // ≈ 0.97
// 	new Chronos('2025-01-15').diff('2026-01-14', 'year') // ≈ 0.99
// );

// console.log(new Chronos().set('month', 2));
console.log(new Chronos().timeZone('UTC+00:00').getTimeZoneNameAbbr());
console.log(new Chronos().timeZone('US/Central').getTimeZoneName());

console.log(new Chronos().$getNativeTimeZoneName('Pacific/Wallis'));

console.log(new Chronos().timeZone('CHADT').getTimeZoneName());
// console.log(new Chronos().timeZone('Pacific/Wallis'));

// console.log(isValidTimeZoneId('Factory'));

// console.log(extractDuplicates([...Object.keys(TIME_ZONES), ...Object.keys(TIME_ZONE_IDS)]));

// console.log(
// 	extractDuplicates([...Object.keys(TIME_ZONES_NATIVE), ...Object.keys(TIME_ZONE_IDS)]).length
// );

console.log(isValidTimeZoneId('Hello'));
console.log(isNativeTimeZoneId('Asia/Dhaka'));

// console.log(0, new Chronos().timeZone('UTC-03:00').addDays(1).toLocalISOString());
// console.log(1, new Chronos().timeZone('UTC-03:00').addDays(1).toISOString());
// // console.log(new Chronos().timeZone('UTC-03:00'));
// console.log(2, new Chronos().timeZone('Europe/Helsinki').toLocalISOString());
// console.log(2, new Chronos().timeZone('Europe/Helsinki').addDays(2).toUTC().toString());
// console.log(3, new Chronos().timeZone('Europe/Helsinki').addDays(2).toUTC().toISOString());
// console.log(4, new Chronos().timeZone('Europe/Helsinki').addDays(2).toLocalISOString());
// console.log(5, new Chronos().timeZone('Europe/Helsinki').addDays(2).toISOString());
// console.log(6, new Chronos().toLocalISOString());
// console.log(7, new Chronos().toISOString());
// console.log(new Date());
console.log(
	new Chronos().timeZone('Asia/Kolkata').timestamp
	// "2025-01-01T05:00:00.000Z"
);

// console.log(new Chronos().startOf('week', 1));
// console.log(new Date(2025, 1, 0));

// console.log(new Date('2025-11-17T15:31:34.779-03:00'));

console.log(new Chronos('2012-12-12').timeZone('Asia/Kolkata').isEqual(new Date('2012-12-12')));

// console.log(
// 	Chronos.min('2012-12-25', new Chronos('2012-12-01').timeZone('Asia/Kolkata'), '2012-12-17')
// );

console.log(new Chronos().get('month'));

const config = {
	apiKey: new Chronos(),
	debug: new Date(),
	settings: {
		timeout: ' 30 ',
		nullValue: new Date(),
		emptyObj: [{ hello: undefined, hi: [true, { no: 2 }] }],
	},
	ignored: 'should not appear',
};
// const s = sanitizeData(
// 	config,
// 	{
// 		keysToIgnore: ['ignored', 'settings.emptyObj'],
// 		trimStrings: true,
// 		ignoreNullish: true,
// 		ignoreEmpty: true,
// 		requiredKeys: ['apiKey'],
// 	},
// 	'partial'
// );

// console.log('conf:', s);

console.log(new Date().getTimezoneOffset());

console.log(formatDate());

console.log(new Chronos('2025-11-21').fromNowShort());
const san = sanitizeData(
	[{ hello: 5, hi: { l: 6 } }],
	{
		keysToIgnore: ['hello', 'hi'],
		// ignoreEmpty: true,
	}
	// 'partial'
);
console.log(san);

// console.log(new Chronos().duration(new Chronos('2025-11-11').endOf('day'), false));

// const str = 'HEllo9World-+how*are_you HA-HA-HA NTI';

// console.log(toCamelCase(str, '+', '*'));
// console.log(toPascalCase(str, '+', '*'));
// console.log(toPascalSnakeCase(str, '+*'));
// console.log(toSnakeCase(str, '+', '*'));
// console.log(toTrainCase(str, '+*'));
// console.log(toDotCase(str, '+*'));
// console.log(toPathCase(str, '+*'));
// console.log(toKebabCase(str, '+*'));
// console.log(toConstantCase(str, '+*'));
// console.log(toTitleCase(str, '+*'));
// console.log(toSentenceCase(str, '+*'));
// console.log(convertStringCase(str, 'Title Case', { preserveAcronyms: true }));
// console.log(convertStringCase(str, 'Sentence case', { preserveAcronyms: true }));
// console.log(toTitleCase('value*with+custom', '*+'));
// console.log(Array.from({ length: 32 }, () => Math.random().toString(36).slice(2, 3)).join(''));
const uid = uuid({ version: 'v8' }); // , name: 'nazmul', namespace: uuid()
console.log(uid);
console.log(isUUID(uid));
const duid = decodeUUID('019ac926-7dc7-70eb-a1c8-cd00d2258e5e');
console.log(duid);
console.log(new Date(duid?.timestamp as number));

console.log(md5('hello'));
console.log(randomHex(16, true));

const words = (d as { words: string[] }).words;

const s = performance.now();

console.log(
	generateAnagrams('A', {
		dictionary: words,
	})
);

const e = performance.now();

console.log(e - s);
console.log(words.length);

console.log(generateRandomColor());

// console.time('md5');
// console.timeEnd('md5');
console.log(md5('hello'));
console.log(createHash('md5').update('hello').digest('hex'));
console.log(sha1('hello'));
console.log(createHash('sha1').update('hello').digest('hex'));

const crypt = new Signet('my-secret-key');
const payload = { title: 'Hello Wolrd', baal: 999 };
const token = crypt.sign(payload, { notBefore: '2d' });
console.log('token', token);

const decoded = crypt.decode<typeof payload>(token);
console.log('decoded payload', decoded);

// const verify = crypt.verify<typeof payload>(token);
// if (verify.isValid) {
// 	console.log('verified payload', verify.payload);
// } else {
// 	console.error('verify failed', verify.error);
// }

// const crypt2 = new Signet('mother knows');

// console.log(crypt2.decode(token));

// const verify2 = crypt2.verify<typeof payload>(token);
// if (verify2.isValid) {
// 	console.log('verified payload', verify2.payload);
// } else {
// 	console.error('verify failed', verify2.error);
// }

// console.log(sha256Bytes(utf8ToBytes('hello')).map((n) => _numToHex(n)));
// console.log(createHash('sha256').update('hello').digest('hex'));

const cipher = new Cipher('my-strong-secret');

const encoded = cipher.encrypt('Money is the God!');
console.log(encoded);

const decodedC = cipher.decrypt(encoded);
console.log(decodedC); // "Money is the God!"

// const c2 = new Cipher('my-strong-secret');
// const dummyToken =
// 	'vmePJeXPzlTaiOxqS61+e0VgKLN0sd1azd9Arrxigj0efMQZ3oRLlrpSTB9isWh3LGWqpRvzfSDxw3HWlDahYa0=';

// console.log(c2.isValid(dummyToken));
// console.log(c2.decrypt(dummyToken));

const testToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

const c = new Signet('a-string-secret-at-least-256-bits-long');

// console.log(crypt.decode(testToken));
console.log(c.verify(testToken));

console.log(sha256('hello'));
console.log(createHash('sha256').update('hello').digest('hex'));
const bytesTE = new TextEncoder().encode('hello');
const bytesCu = utf8ToBytes('hello');
console.log(bytesToHex(bytesTE), bytesToHex(bytesCu));

// Test with RFC 4231 test vectors
function testHmac() {
	// Test Case 1: Simple case
	const key1 = new TextEncoder().encode('key');
	const message1 = new TextEncoder().encode('The quick brown fox jumps over the lazy dog');
	const hmac1 = hmacSha256(key1, message1);
	const expected1 = 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8';
	console.log('Test 1:', bytesToHex(hmac1) === expected1);

	// Test Case 2: RFC 4231 Test Case 1
	// Key = 20 bytes of 0x0b
	const key2 = new Uint8Array(20).fill(0x0b);
	const message2 = new TextEncoder().encode('Hi There');
	const hmac2 = hmacSha256(key2, message2);
	const expected2 = 'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7';
	console.log('Test 2:', bytesToHex(hmac2) === expected2);

	// Test Case 3: RFC 4231 Test Case 2
	const key3 = new TextEncoder().encode('Jefe');
	const message3 = new TextEncoder().encode('what do ya want for nothing?');
	const hmac3 = hmacSha256(key3, message3);
	const expected3 = '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843';
	console.log('Test 3:', bytesToHex(hmac3) === expected3);

	// Test Case 4: Empty message with key
	const key4 = new Uint8Array(20).fill(0x0b);
	const message4 = new Uint8Array(0);
	const hmac4 = hmacSha256(key4, message4);
	const expected4 = 'b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad';
	console.log('Test 4:', bytesToHex(hmac4) === expected4);
}

testHmac();

console.dir(crypt.decodePayload(token));

console.dir(cloneObject(config, true), { depth: Infinity, arrayLength: Infinity });
console.log(typeof structuredClone);
const order = {
	id: '1001',
	total: '199.99taka',
	items: [
		{ id: '1', price: '49.99' },
		{ id: '2', price: '59.99' },
	],
	customer: {
		id: 5001,
		loyaltyPoints: '1000',
	},
} as const;

// Convert numbers throughout structure
const result = convertObjectValues(order, {
	keys: ['customer.loyaltyPoints'],
	convertTo: 'number',
});

console.log(result);

console.log(isTimeWithUnit('6ds'));
console.log(isTimeWithUnit('6d'));
console.log(isTimeWithUnit('6month'));

console.log(parseMs('3m'));

console.log(HttpStatus.Groups.informational);
console.log(getTimeZoneIds('UTC+06:00'));
const ch = new Chronos();

// console.time('nW');
// console.log(ch.nextWeekend());
// console.timeEnd('nW');

// console.log(ch.nextWorkday());
// console.log(ch.isWeekend());
// console.log(ch.previousWorkday([1, 6]));
// console.log(ch.previousWeekend());

console.time('workB');
console.log(ch.workdaysBetween('2027-12-21'));
console.timeEnd('workB');
console.time('workY');
console.log(new Chronos('2025-12-01').workdaysInYear());
console.timeEnd('workY');
console.time('workM');
console.log(new Chronos('2025-12-01').workdaysInMonth([5]));
console.timeEnd('workM');
console.time('range');
ch.getDatesInRange();
console.log(new Chronos('2025-12-09').diff('2027-12-10', 'year'));

console.log(new Chronos('2025-12-01').weekendsInMonth([5]));
console.log(new Chronos('2025-12-01').weekendsInYear());

new Currency(100, 'USD').convert('NZD').then(console.log);
