// @ts-check

/**
 *  @typedef {Object} TimeZone
 *  @property {string} timeZoneId
 *  @property {string} sdtOffset
 *  @property {string} sdtTzName
 *  @property {string} sdtTzAbr
 */

// * @property {string} country
// * @property { string } dstOffset
// * @property { string } dstTzName
// * @property { string } dstTzAbr

function scrapTimeZone() {
	const zoneContainer = document.querySelector('tbody');

	const rows = [...(zoneContainer?.querySelectorAll('tr') || [])];

	/** @type {Array<TimeZone>} Array of TimeZone objects */
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

		// const isDoubleCol = cols[6].hasAttribute('colspan');

		/** @type {TimeZone} Timezone object */
		const zone = {
			// country: textContent(0),
			timeZoneId: textContent(1),
			sdtOffset: `UTC${textContent(4)}`,
			// dstOffset: `UTC${textContent(5)}`,
			sdtTzName: titleValue(6),
			// dstTzName: isDoubleCol ? '' : titleValue(7),
			sdtTzAbr: textContent(6),
			// dstTzAbr: isDoubleCol ? '' : textContent(7)
		};

		result.push(zone);
	});

	return result;
}

console.log(scrapTimeZone());
