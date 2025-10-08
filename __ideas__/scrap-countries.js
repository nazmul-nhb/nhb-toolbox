// @ts-check

/** Extract country info from {@link https://countrycode.org/} */
function getCountries() {
	const contents = document.querySelector('tbody');

	const rows = [...(contents?.querySelectorAll('tr') || [])];

	/** @type Array<{ country_name: string; country_code: string; iso_code: string; iso_code_short: string; }> */
	const results = [];

	rows.forEach((row) => {
		const data = [...(row?.querySelectorAll('td') || [])];

		const info = {
			country_name: data[0].innerText,
			country_code: data[1].innerText,
			iso_code_short: data[2].innerText?.split('/')[0]?.trim(),
			iso_code: data[2].innerText?.split('/')[1]?.trim(),
		};

		results.push(info);
	});

	return results;
}

console.log(getCountries());
