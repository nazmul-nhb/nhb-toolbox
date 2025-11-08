// @ts-check

/**
 *  @typedef {Object} TimeZone
 *  @property {string} tzAbbr
 *  @property {string} tzName
 *  @property {string} offset
 *
 * @typedef {Record<string, TimeZone>} TzAbbrWithTzDetails
 */

/** Scrap timezone data from {@link https://en.wikipedia.org/wiki/List_of_time_zone_abbreviations time zone abbreviations on Wikipedia} */
function scrapTzAbbreviation() {
	const zoneContainer =
		/** @type {HTMLTableSectionElement | null} */
		(document.querySelector('table.wikitable.sortable.jquery-tablesorter > tbody'));

	const rows = [...(zoneContainer?.querySelectorAll('tr') || [])];

	// /** @type {TzAbbrWithTzDetails} Record of timezone abbreviation against timezone details */
	// const result = {};

	/** @type {Array<TimeZone>} */
	const result = [];

	rows.forEach((row) => {
		const cols = [...(row?.querySelectorAll('td') || [])];

		/**
		 * Get text content from a table cell.
		 * @param {number} idx Index from {@link cols} array.
		 * @returns {string} Text content.
		 */
		const textContent = (idx) => {
			return cols?.[idx]?.innerText?.replaceAll(/\s+/g, ' ');
		};

		/** @type {TimeZone} Timezone object */
		const zone = {
			tzAbbr: textContent(0),
			tzName: textContent(1),
			offset: textContent(2)?.replace('−', '-'),
		};

		// /** @type {TimeZone} Timezone object */
		// const zone = {
		//     tzName: textContent(1),
		//     offset: textContent(2)?.replace('−', '-'),
		// };

		// result[textContent(0)] = zone;

		result.push(zone);
	});

	return result;
}

console.log(scrapTzAbbreviation());
