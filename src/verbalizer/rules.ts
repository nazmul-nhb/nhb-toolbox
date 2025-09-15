import type { VerbRule } from './types';

/** Irregular verb mappings: base → past → past participle */
export const irregularVerbs: Readonly<Array<[string, string, string]>> =
	/* @__PURE__ */ Object.freeze([
		['am', 'was', 'been'],
		['is', 'was', 'been'],
		['are', 'were', 'been'],

		['be', 'were', 'been'],

		['can', 'could', 'been able'],
		['may', 'might', ''],
		['must', 'had to', ''],
		['will', 'would', ''],
		['shall', 'should', ''],

		// ['spell', 'spelt', 'spelt'],
		// ['spill', 'spilt', 'spilt'],

		['arise', 'arose', 'arisen'],
		['awake', 'awoke', 'awoken'],
		['bear', 'bore', 'born'],
		['bear', 'bore', 'borne'],
		['beat', 'beat', 'beaten'],
		['become', 'became', 'become'],
		['begin', 'began', 'begun'],
		['bend', 'bent', 'bent'],
		['bet', 'bet', 'bet'],
		['bind', 'bound', 'bound'],
		['bite', 'bit', 'bitten'],
		['bleed', 'bled', 'bled'],
		['blow', 'blew', 'blown'],
		['break', 'broke', 'broken'],
		['breed', 'bred', 'bred'],
		['bring', 'brought', 'brought'],
		['broadcast', 'broadcast', 'broadcast'],
		['build', 'built', 'built'],
		['burn', 'burnt', 'burnt'],
		['burst', 'burst', 'burst'],
		['buy', 'bought', 'bought'],
		['catch', 'caught', 'caught'],
		['choose', 'chose', 'chosen'],
		['cling', 'clung', 'clung'],
		['come', 'came', 'come'],
		['cost', 'cost', 'cost'],
		['creep', 'crept', 'crept'],
		['cut', 'cut', 'cut'],
		['deal', 'dealt', 'dealt'],
		['dig', 'dug', 'dug'],
		['do', 'did', 'done'],
		['draw', 'drew', 'drawn'],
		['dream', 'dreamt', 'dreamt'],
		['drink', 'drank', 'drunk'],
		['drive', 'drove', 'driven'],
		['eat', 'ate', 'eaten'],
		['fall', 'fell', 'fallen'],
		['feed', 'fed', 'fed'],
		['feel', 'felt', 'felt'],
		['fight', 'fought', 'fought'],
		['find', 'found', 'found'],
		['fly', 'flew', 'flown'],
		['forbid', 'forbade', 'forbidden'],
		['forget', 'forgot', 'forgotten'],
		['forgive', 'forgave', 'forgiven'],
		['freeze', 'froze', 'frozen'],
		['get', 'got', 'got'],
		['give', 'gave', 'given'],
		['go', 'went', 'gone'],
		['grind', 'ground', 'ground'],
		['grow', 'grew', 'grown'],
		['hang', 'hung', 'hung'],
		['have', 'had', 'had'],
		['hear', 'heard', 'heard'],
		['hide', 'hid', 'hidden'],
		['hit', 'hit', 'hit'],
		['hold', 'held', 'held'],
		['hurt', 'hurt', 'hurt'],
		['keep', 'kept', 'kept'],
		['kneel', 'knelt', 'knelt'],
		['know', 'knew', 'known'],
		['lay', 'laid', 'laid'],
		['lead', 'led', 'led'],
		['lean', 'leant', 'leant'],
		['learn', 'learnt', 'learnt'],
		['leave', 'left', 'left'],
		['lend', 'lent', 'lent'],
		['lie', 'lay', 'lain'],
		['lie', 'lied', 'lied'],
		['light', 'lit', 'lit'],
		['lose', 'lost', 'lost'],
		['make', 'made', 'made'],
		['mean', 'meant', 'meant'],
		['meet', 'met', 'met'],
		['mow', 'mowed', 'mown'],
		['overtake', 'overtook', 'overtaken'],
		['pay', 'paid', 'paid'],
		['put', 'put', 'put'],
		['read', 'read', 'read'],
		['ride', 'rode', 'ridden'],
		['ring', 'rang', 'rung'],
		['rise', 'rose', 'risen'],
		['run', 'ran', 'run'],
		['saw', 'sawed', 'sawn'],
		['say', 'said', 'said'],
		['see', 'saw', 'seen'],
		['sell', 'sold', 'sold'],
		['send', 'sent', 'sent'],
		['set', 'set', 'set'],
		['sew', 'sewed', 'sewn'],
		['shake', 'shook', 'shaken'],
		['shed', 'shed', 'shed'],
		['shine', 'shone', 'shone'],
		['shoot', 'shot', 'shot'],
		['show', 'showed', 'shown'],
		['shrink', 'shrank', 'shrunk'],
		['shut', 'shut', 'shut'],
		['sing', 'sang', 'sung'],
		['sink', 'sank', 'sunk'],
		['sit', 'sat', 'sat'],
		['sleep', 'slept', 'slept'],
		['slide', 'slid', 'slid'],
		['smell', 'smelt', 'smelt'],
		['sow', 'sowed', 'sown'],
		['speak', 'spoke', 'spoken'],
		['spend', 'spent', 'spent'],
		['spin', 'spun', 'spun'],
		['spit', 'spat', 'spat'],
		['spread', 'spread', 'spread'],
		['stand', 'stood', 'stood'],
		['steal', 'stole', 'stolen'],
		['stick', 'stuck', 'stuck'],
		['sting', 'stung', 'stung'],
		['stink', 'stank', 'stunk'],
		['strike', 'struck', 'struck'],
		['swear', 'swore', 'sworn'],
		['sweep', 'swept', 'swept'],
		['swell', 'swelled', 'swollen'],
		['swim', 'swam', 'swum'],
		['swing', 'swung', 'swung'],
		['take', 'took', 'taken'],
		['teach', 'taught', 'taught'],
		['tear', 'tore', 'torn'],
		['tell', 'told', 'told'],
		['think', 'thought', 'thought'],
		['throw', 'threw', 'thrown'],
		['understand', 'understood', 'understood'],
		['wake', 'woke', 'woken'],
		['wear', 'wore', 'worn'],
		['weep', 'wept', 'wept'],
		['win', 'won', 'won'],
		['wind', 'wound', 'wound'],
		['write', 'wrote', 'written'],
	]);

/** Past tense conjugation rules with regex and replacements */
export const pastRules: readonly VerbRule[] = /* @__PURE__ */ Object.freeze([
	[/([aeiou])y$/i, '$1yed'], // play → played, stay → stayed
	[/e$/i, 'ed'], // bake → baked
	[/([aeiou])lf$/i, '$1lved'],
	[/([^aeiou])y$/i, '$1ied'], // study → studied, mummify → mummified
	[/([^aeiou])([aeiou])([^aeiou])$/i, '$1$2$3$3ed'], // stop → stopped
	[/$/i, 'ed'], // walk → walked
]);

/** Past participle conjugation rules with regex and replacements */
export const pastParticipleRules: readonly VerbRule[] = /* @__PURE__ */ Object.freeze([
	[/([aeiou])y$/i, '$1yed'], // play → played
	[/e$/i, 'ed'], // bake → baked
	[/([aeiou])lf$/i, '$1lved'],
	[/([^aeiou])y$/i, '$1ied'], // study → studied, mummify → mummified
	[/([^aeiou])([aeiou])([^aeiou])$/i, '$1$2$3$3ed'], // stop → stopped
	[/$/i, 'ed'], // walk → walked
]);

/** Base form recovery rules (reverse of pastRules) */
export const baseRules: readonly VerbRule[] = Object.freeze([
	[/([aeiou])yed$/i, '$1y'], // played → play
	[/ied$/i, 'y'], // studied → study
	[/([aeiou])lved$/i, '$1lf'], // shelved → shelf
	[/([bcdfghjklmnpqrstvwxyz])\1ed$/i, '$1'], // stopped → stop
	[/ed$/i, ''], // walked → walk, baked → bake
]);
