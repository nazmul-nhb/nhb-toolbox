// @ts-check

function scrapData() {
    const container = document.querySelector("article.main-page-content");

    const sections = [...(container?.querySelectorAll('section') || [])];

    const data = []

    sections.forEach(section => {
        const category = section.querySelector('h2 > a')?.textContent;

        const codes = [...(section.querySelectorAll('dl dt') || [])];
        const details = [...(section.querySelectorAll("dl dd") || [])];

        for (let i = 0; i < codes.length; i++) {
            const code = codes[i];
            const codeWithName = code?.querySelector('code')?.textContent?.match(/(\d+)\s+(.*)/)

            const set = {
                category: fixCategory(category?.trim()),
                link: code?.querySelector('a')?.href,
                code: Number(codeWithName?.[1]?.trim()),
                name: codeWithName?.[2]?.replace(/\W/g, "_")?.toUpperCase()?.trim(),
                readableName: codeWithName?.[2]?.trim(),
                message: codeWithName?.[2]?.trim(),
                description: details[i].textContent?.trim()
            }

            data.push(set);
        }
    });

    // Convert data to string representation
    const objString = data.reduce((acc, d) => {
        return acc + `
        /**\n * * {@link ${d.link} ${d.readableName}} \n* - ${d.description}\n  */
    ${d.name}: ${d.code},`;
    }, '{');

    // Close the object
    const finalString = objString + '\n}';

    return { data, obj: finalString };
}

/** @param {string | null | undefined} category */
function fixCategory(category) {
    switch (category) {
        case "Informational responses":
            return 'informational';
        case "Successful responses":
            return 'success';
        case "Redirection messages":
            return 'redirection';
        case "Client error responses":
            return 'clientError';
        case "Server error responses":
            return 'serverError';

        default:
            return 'unknown';
    }
}

scrapData()