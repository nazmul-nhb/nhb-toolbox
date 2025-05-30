/** Default Western Seasons */
const DEFAULT_SEASONS = /* @__PURE__ */ Object.freeze([
	{ name: 'Spring', boundary: { startMonth: 2, endMonth: 4 } },
	{ name: 'Summer', boundary: { startMonth: 5, endMonth: 7 } },
	{ name: 'Autumn', boundary: { startMonth: 8, endMonth: 10 } },
	{ name: 'Winter', boundary: { startMonth: 11, endMonth: 1 } },
]);

/**Default Bangladeshi Seasons */
const BANGLADESH_SEASONS = /* @__PURE__ */ Object.freeze([
	{
		name: 'Grishsho (Summer)',
		boundary: { startDate: '04-15', endDate: '06-14' },
	},
	{
		name: 'Bôrsha (Monsoon)',
		boundary: { startDate: '06-15', endDate: '08-14' },
	},
	{
		name: 'Shôrot (Autumn)',
		boundary: { startDate: '08-15', endDate: '10-14' },
	},
	{
		name: 'Hemonto (Late Autumn)',
		boundary: { startDate: '10-15', endDate: '12-14' },
	},
	{
		name: 'Sheet (Winter)',
		boundary: { startDate: '12-15', endDate: '02-14' },
	},
	{
		name: 'Bôshonto (Spring)',
		boundary: { startDate: '02-15', endDate: '04-14' },
	},
]);

/** Indian Seasons */
const INDIA_IMD_SEASONS = /* @__PURE__ */ Object.freeze([
	{ name: 'Winter', boundary: { startMonth: 0, endMonth: 1 } },
	{ name: 'Pre-Monsoon', boundary: { startMonth: 2, endMonth: 4 } },
	{ name: 'Monsoon', boundary: { startMonth: 5, endMonth: 8 } },
	{ name: 'Post-Monsoon', boundary: { startMonth: 9, endMonth: 10 } },
	{ name: 'Cool Season', boundary: { startMonth: 11, endMonth: 11 } },
]);

/** Indian Vedic Seasons */
const INDIA_VEDIC_SEASONS = /* @__PURE__ */ Object.freeze([
	{
		name: 'Shishir (Winter)',
		boundary: { startDate: '12-15', endDate: '02-14' },
	}, // Mid-Dec to Mid-Feb
	{
		name: 'Vasanta (Spring)',
		boundary: { startDate: '02-15', endDate: '04-14' },
	}, // Mid-Feb to Mid-Apr
	{
		name: 'Grishma (Summer)',
		boundary: { startDate: '04-15', endDate: '06-14' },
	}, // Mid-Apr to Mid-Jun
	{
		name: 'Varsha (Monsoon)',
		boundary: { startDate: '06-15', endDate: '08-14' },
	}, // Mid-Jun to Mid-Aug
	{
		name: 'Sharad (Autumn)',
		boundary: { startDate: '08-15', endDate: '10-14' },
	}, // Mid-Aug to Mid-Oct
	{
		name: 'Hemant (Late Autumn',
		boundary: { startDate: '10-15', endDate: '12-14' },
	}, // Mid-Oct to Mid-Dec
]);

/** Indian Tamil Seasons */
const INDIA_TAMIL_SEASONS = /* @__PURE__ */ Object.freeze([
	{ name: 'Ilavenil (Mid-Summer)', boundary: { startMonth: 4, endMonth: 5 } }, // May – June
	{
		name: 'Mutuvenil (Peak-Summer)',
		boundary: { startMonth: 6, endMonth: 7 },
	}, // July – August
	{ name: 'Kaar (Monsoon)', boundary: { startMonth: 7, endMonth: 9 } }, // Aug – Oct
	{ name: 'Koothir (Autumn)', boundary: { startMonth: 9, endMonth: 10 } }, // Oct – Nov
	{
		name: 'Munpani (Early-Winter)',
		boundary: { startMonth: 10, endMonth: 0 },
	}, // Nov – Jan
	{ name: 'Pinpani (Late-Winter)', boundary: { startMonth: 0, endMonth: 2 } }, // Jan – Mar
]);

/** Philippines Seasons */
const PHILIPPINES_SEASONS = /* @__PURE__ */ Object.freeze([
	{ name: 'Dry Season', boundary: { startMonth: 11, endMonth: 4 } }, // Dec–May
	{ name: 'Wet Season', boundary: { startMonth: 5, endMonth: 10 } }, // Jun–Nov
]);

/** US Academic Seasons */
const US_ACADEMIC_SEASONS = /* @__PURE__ */ Object.freeze([
	{
		name: 'Spring',
		boundary: { startDate: '01-10', endDate: '05-15' },
	},
	{
		name: 'Summer',
		boundary: { startDate: '05-16', endDate: '08-15' },
	},
	{
		name: 'Fall',
		boundary: { startDate: '08-16', endDate: '12-20' },
	},
	{
		name: 'Winter',
		boundary: { startDate: '12-21', endDate: '01-09' },
	},
]);

/** Japanese Seasons */
const JAPAN_SEASONS = /* @__PURE__ */ Object.freeze([
	{
		name: 'Haru (Spring)',
		boundary: { startDate: '03-01', endDate: '05-31' },
	},
	{
		name: 'Natsu (Summer)',
		boundary: { startDate: '06-01', endDate: '08-31' },
	},
	{
		name: 'Aki (Autumn)',
		boundary: { startDate: '09-01', endDate: '11-30' },
	},
	{
		name: 'Fuyu (Winter)',
		boundary: { startDate: '12-01', endDate: '02-28' },
	},
]);

/** Australian Seasons */
const AUSTRALIA_SEASONS = /* @__PURE__ */ Object.freeze([
	{ name: 'Summer', boundary: { startMonth: 11, endMonth: 1 } },
	{ name: 'Autumn', boundary: { startMonth: 2, endMonth: 4 } },
	{ name: 'Winter', boundary: { startMonth: 5, endMonth: 7 } },
	{ name: 'Spring', boundary: { startMonth: 8, endMonth: 10 } },
]);

/** Ethiopian Seasons */
const ETHIOPIA_SEASONS = /* @__PURE__ */ Object.freeze([
	{ name: 'Bega (Dry)', boundary: { startMonth: 10, endMonth: 1 } },
	{ name: 'Belg (Short Rain)', boundary: { startMonth: 2, endMonth: 4 } },
	{ name: 'Kiremt (Main Rain)', boundary: { startMonth: 5, endMonth: 9 } },
]);

/** All the Season Presets for `new Chronos.season()` method */
export const SEASON_PRESETS = /* @__PURE__ */ Object.freeze({
	default: DEFAULT_SEASONS,
	bangladesh: BANGLADESH_SEASONS,
	india: INDIA_IMD_SEASONS,
	tamil: INDIA_TAMIL_SEASONS,
	vedic: INDIA_VEDIC_SEASONS,
	philippines: PHILIPPINES_SEASONS,
	academic_us: US_ACADEMIC_SEASONS,
	japan: JAPAN_SEASONS,
	australia: AUSTRALIA_SEASONS,
	ethiopia: ETHIOPIA_SEASONS,
} as const);
