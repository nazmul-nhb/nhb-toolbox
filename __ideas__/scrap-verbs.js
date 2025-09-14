// @ts-check

// https://www.gingersoftware.com/content/grammar-rules/verbs/list-of-irregular-verbs

function loadVerbs() {
	const body = document.querySelector('tbody');

	const rows = [...(body?.querySelectorAll('tr') || [])];

	/** @type {Array<[string, string, string]>} */
	const data = [];

	rows?.forEach((row) => {
		const verbs = [...(row?.querySelectorAll('td') || [])];

		/** @type {string[]} */
		const group = [];

		verbs?.forEach((verb) => {
			group.push(verb.innerText);
		});

		data.push(/** @type {[string, string, string]} */ (group));
	});

	return data;
}

loadVerbs();
