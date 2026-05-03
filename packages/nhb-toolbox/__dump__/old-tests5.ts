import { createHash } from 'node:crypto';
import d from '../__dump__/english-words.json';
import {
	Chronos,
	Converter,
	Currency,
	cloneObject,
	convertObjectValues,
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
	Signet,
	sha1,
	sha256,
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
const san = sanitizeData(
	[{ hello: 5, hi: { l: 6 } }],
	{
		keysToIgnore: ['hello', 'hi'],
		// ignoreEmpty: true,
	}
	// 'partial'
);

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
const duid = decodeUUID('019ac926-7dc7-70eb-a1c8-cd00d2258e5e');

const words = (d as { words: string[] }).words;

const s = performance.now();

const e = performance.now();

const crypt = new Signet('my-secret-key');
const payload = { title: 'Hello Wolrd', baal: 999 };
const token = crypt.sign(payload, { notBefore: '2d' });

const decoded = crypt.decode<typeof payload>(token);

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

const decodedC = cipher.decrypt(encoded);

// const c2 = new Cipher('my-strong-secret');
// const dummyToken =
// 	'vmePJeXPzlTaiOxqS61+e0VgKLN0sd1azd9Arrxigj0efMQZ3oRLlrpSTB9isWh3LGWqpRvzfSDxw3HWlDahYa0=';

// console.log(c2.isValid(dummyToken));
// console.log(c2.decrypt(dummyToken));

const testToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

const c = new Signet('a-string-secret-at-least-256-bits-long');
const bytesTE = new TextEncoder().encode('hello');
const bytesCu = utf8ToBytes('hello');

// Test with RFC 4231 test vectors
function testHmac() {
	// Test Case 1: Simple case
	const key1 = new TextEncoder().encode('key');
	const message1 = new TextEncoder().encode('The quick brown fox jumps over the lazy dog');
	const hmac1 = hmacSha256(key1, message1);
	const expected1 = 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8';

	// Test Case 2: RFC 4231 Test Case 1
	// Key = 20 bytes of 0x0b
	const key2 = new Uint8Array(20).fill(0x0b);
	const message2 = new TextEncoder().encode('Hi There');
	const hmac2 = hmacSha256(key2, message2);
	const expected2 = 'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7';

	// Test Case 3: RFC 4231 Test Case 2
	const key3 = new TextEncoder().encode('Jefe');
	const message3 = new TextEncoder().encode('what do ya want for nothing?');
	const hmac3 = hmacSha256(key3, message3);
	const expected3 = '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843';

	// Test Case 4: Empty message with key
	const key4 = new Uint8Array(20).fill(0x0b);
	const message4 = new Uint8Array(0);
	const hmac4 = hmacSha256(key4, message4);
	const expected4 = 'b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad';
}

testHmac();

console.dir(crypt.decodePayload(token));

console.dir(cloneObject(config, true), { depth: Infinity, arrayLength: Infinity });
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
const ch = new Chronos();

// console.time('nW');
// console.log(ch.nextWeekend());
// console.timeEnd('nW');

// console.log(ch.nextWorkday());
// console.log(ch.isWeekend());
// console.log(ch.previousWorkday([1, 6]));
// console.log(ch.previousWeekend());

console.time('workB');
console.timeEnd('workB');
console.time('workY');
console.timeEnd('workY');
console.time('workM');
console.timeEnd('workM');
console.time('range');
ch.getDatesInRange();

new Currency(100, 'USD').convert('NZD').then(console.log);
