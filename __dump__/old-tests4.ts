// console.info(new Chronos().toUTC().isSame(new Chronos().timeZone('UTC'), 'week'));

// const x = generateRandomColor({ colorType: 'rgb' });

// console.log(x);

// console.log(new Chronos('2025-11-22').duration(new Date(), false));
// console.log(
// 	new Chronos('2025-11-01').durationString({
// 		toTime: '2025-11-03',
// 		// showZero: true,
// 		maxUnits: 2,
// 	})
// );

// removeDuplicates([
// 	...Object.values({ ...TIME_ZONE_IDS, ...TIME_ZONES }).map((v) => v.offset),
// 	...(Object.keys(TIME_ZONE_LABELS) as UTCOffset[]),
// ]).forEach((offset) => {
// 	console.log(offset, ':', new Chronos().timeZone(offset).getTimeZoneNameAbbr());
// });

// /**
//  * * Retrieves comprehensive time zone details using the {@link Intl} API.
//  * @param tzId Optional timezone identifier; defaults to the system timezone.
//  * @param date Optional date for which to resolve the information.
//  * @returns Object containing time zone identifier, names, and offset.
//  */
// export function _getTimeZoneDetails(tzId?: $TimeZoneIdentifier, date?: Date) {
//     const TZ_NAME_TYPES = ['long', 'longOffset'] as const;

//     const $tzId = tzId || Intl.DateTimeFormat().resolvedOptions().timeZone;

//     const obj = { tzId: $tzId } as {
//         tzId: $TimeZoneIdentifier;
//         tzName: LooseLiteral<TimeZoneName> | undefined;
//         offset: LooseLiteral<UTCOffset> | undefined;
//     };

//     for (const type of TZ_NAME_TYPES) {
//         const parts = new Intl.DateTimeFormat('en', {
//             timeZone: $tzId,
//             timeZoneName: type,
//         }).formatToParts(date);

//         const tzPart = parts.find((p) => p.type === 'timeZoneName');
//         const key = type === 'long' ? 'tzName' : 'offset';
//         const value =
//             type === 'longOffset' ?
//                 tzPart?.value === 'GMT' ?
//                     'UTC+00:00'
//                 :	tzPart?.value?.replace(/^GMT/, 'UTC')
//             :	tzPart?.value;
//         obj[key] = value;
//     }

//     return obj;
// }

// const test = Object.keys(TIME_ZONE_IDS).filter((abbr) =>
// 	'1234567890'.split('').some((l) => abbr.includes(l) && !abbr.includes('/'))
// );

// console.log(test);
// console.log(_getTimeZoneDetails('EST5EDT'));

// const zones = Intl.supportedValuesOf('timeZone');

// const ids: Array<ReturnType<typeof _getTimeZoneDetails>> = [];
// console.log(ids.length);

// const tz_obj = {} as Record<string, { tzName?: string; offset?: string }>;

// zones.forEach((id) => {
// 	// console.log(zones.includes(id));

// 	// ids.push(_getTimeZoneDetails(id as $TimeZoneIdentifier));

// 	const { tzId, tzName, offset } = _getTimeZoneDetails(id as $TimeZoneIdentifier);

// 	tz_obj[tzId] = { tzName, offset };
// });

// function saveIds() {
//     const file = path.join(process.cwd(), 'tz-ids-iana-arr.json');

//     writeFileSync(file, JSON.stringify(Object.keys(TIME_ZONE_IDS), null, 2) + '\n');
// }

// // saveIds();

// console.log(zones.includes('EST'));
// console.log(zones.length);

// console.log(new Chronos().duration('1992-01-18'));

// console.log('TZ_DATA:', TZ_DATA.length);
// console.log('TZ:', removeDuplicates(TZ_DATA.map((tz) => tz.sdtTzName)).length);
// console.log('TZ_ABBR_Names:', Object.keys(TIME_ZONES).length);
// console.log(
// 	'TZ_Full_Names:',
// 	removeDuplicates(Object.values(TIME_ZONES).map((tz) => tz.tzName)).length
// );
// console.log('TZ_IDS:', Object.keys(TIME_ZONE_IDS).length);
