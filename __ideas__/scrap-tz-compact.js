// @ts-check

/**
 *  @typedef {Object} TimeZoneCompact
 *  @property {string} tzName
 *  @property {string} offset
 *
 * @typedef {Record<string, TimeZoneCompact>} TzDetailsCompact
 */

/** Scrap timezone data from {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones IANA TZ Database on Wikipedia} */
function scrapTimeZone() {
	const zoneContainer = document.querySelector('tbody');

	const rows = [...(zoneContainer?.querySelectorAll('tr') || [])];

	/** @type {TzDetailsCompact} Record of timezone id against UTC Offset */
	const result = {};

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

		/** @type {TimeZoneCompact} Timezone object */
		const zone = {
			tzName: titleValue(6),
			offset: `UTC${textContent(4).replace('−', '-')}`,
		};

		result[textContent(1)] = zone;
	});

	return result;
}

console.log(scrapTimeZone());

/** Scrap timezone data from {@link https://en.wikipedia.org/wiki/List_of_time_zone_abbreviations time zone abbreviations on Wikipedia} */
function scrapTzAbbreviation() {
	const zoneContainer =
		/** @type {HTMLTableSectionElement | null} */
		(document.querySelector('table.wikitable.sortable.jquery-tablesorter > tbody'));

	const rows = [...(zoneContainer?.querySelectorAll('tr') || [])];

	/** @type {TzDetailsCompact} Record of timezone abbreviation against timezone details */
	const result = {};

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

		const baseAbbr = textContent(0);

		/** @type {TimeZoneCompact} Timezone object */
		const zone = {
			tzName: textContent(1),
			offset: textContent(2)?.replace('−', '-'),
		};

		let abbr = baseAbbr;
		let count = 1;

		// Incrementally suffix duplicates as “ABBR-1”, “ABBR-2”, etc.
		while (Object.prototype.hasOwnProperty.call(result, abbr)) {
			abbr = baseAbbr.concat('-', String(count++));
		}

		result[abbr] = zone;
	});

	return result;
}

console.log(scrapTzAbbreviation());
