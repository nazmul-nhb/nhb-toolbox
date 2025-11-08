// @ts-check

/**
 *  @typedef {Object} TimeZone
 *  @property {string} country
 *  @property {string} timeZoneId
 *  @property {string} sdtOffset
 *  @property {string} dstOffset
 *  @property {string} sdtTzName
 *  @property {string} sdtTzAbr
 *  @property {string} dstTzName
 *  @property {string} dstTzAbr
 */

/**
 * @typedef {Record<string, string>} TimeZoneWithUTC
 */

/** Scrap timezone data from {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones IANA TZ Database on Wikipedia} */
function scrapTimeZone() {
	const zoneContainer = document.querySelector('tbody');

	const rows = [...(zoneContainer?.querySelectorAll('tr') || [])];

	/** @type {Array<TimeZone>} Array of TimeZone objects */
	const result = [];

	// /** @type {TimeZoneWithUTC} Record of timezone id against UTC Offset */
	// const result = {};

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

		/**
		 * Get title attribute from the <a> inside a table cell.
		 * @param {number} idx Index from {@link cols} array.
		 * @returns {string} Title attribute or empty string.
		 */
		const titleValue = (idx) => {
			return (
				cols[idx]?.querySelector('a')?.getAttribute('title')?.replaceAll(/\s+/g, ' ') ??
				''
			);
		};

		/** Check if a table cell has attribute `colspan` */
		const hasColSpan = cols[6].hasAttribute('colspan');

		/** @type {TimeZone} Timezone object */
		const zone = {
			country: textContent(0),
			timeZoneId: textContent(1),
			sdtOffset: `UTC${textContent(4).replace('−', '-')}`,
			dstOffset: `UTC${textContent(5).replace('−', '-')}`,
			sdtTzName: titleValue(6),
			dstTzName: hasColSpan ? '' : titleValue(7),
			sdtTzAbr: textContent(6),
			dstTzAbr: hasColSpan ? '' : textContent(7),
		};

		// result[textContent(1)] = `UTC${textContent(4).replace('−', '-')}`;

		result.push(zone);
	});

	return result;
}

console.log(scrapTimeZone());
