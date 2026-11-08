//#region node_modules/.nitro/vite/services/ssr/assets/tgsc-B-UjHrEs.js
var TGSC_ORIGIN = "https://www.thegoodscentscompany.com";
/** TGSC groups J/K and W/X onto shared listing pages. */
var LETTER_PAGES = [
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"jk",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"wx",
	"y",
	"z"
];
function isLetterKey(value) {
	return LETTER_PAGES.includes(value);
}
function listingUrl(letter) {
	return `${TGSC_ORIGIN}/allprod-${letter}.html`;
}
var ENTITY_MAP = {
	amp: "&",
	lt: "<",
	gt: ">",
	quot: "\"",
	apos: "'",
	nbsp: " ",
	deg: "°",
	plusmn: "±",
	times: "×",
	micro: "µ",
	ndash: "–",
	mdash: "—",
	lsquo: "‘",
	rsquo: "’",
	ldquo: "“",
	rdquo: "”",
	hellip: "…",
	copy: "©",
	reg: "®"
};
function decodeEntities(value) {
	return value.replace(/&#(\d+);/g, (_, n) => {
		const code = Number(n);
		return Number.isInteger(code) && code >= 0 && code <= 1114111 ? String.fromCodePoint(code) : _;
	}).replace(/&#x([0-9a-f]+);/gi, (_, n) => {
		const code = Number.parseInt(n, 16);
		return Number.isInteger(code) && code >= 0 && code <= 1114111 ? String.fromCodePoint(code) : _;
	}).replace(/&([a-z]+);/gi, (match, name) => {
		return ENTITY_MAP[name.toLowerCase()] ?? match;
	});
}
function stripTags(html) {
	return decodeEntities(html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}
function firstMatch(source, pattern) {
	return source.match(pattern)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
}
var ROW_RE = /<td>(?:\s*<div class="chtols">([\s\S]*?)<\/div>)?\s*<a href="#" onclick="openMainWindow\('(\/data\/[^']+)'\);return false;">([\s\S]*?)<\/a>([\s\S]*?)<\/td>/gi;
var HREF_RE = /<a\b[^>]*href="([^"#][^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
function parseListingHtml(html, letter) {
	const ingredients = [];
	const seenPaths = /* @__PURE__ */ new Set();
	for (const match of html.matchAll(ROW_RE)) {
		const prefix = stripTags(match[1] ?? "");
		const path = match[2] ?? "";
		const name = stripTags(match[3] ?? "");
		const rest = match[4] ?? "";
		if (!path || !name || seenPaths.has(path)) continue;
		seenPaths.add(path);
		const restText = stripTags(rest);
		const kind = (path.split("/").pop() ?? "").replace(/\d.*$/, "").replace(/\.html$/i, "") || "data";
		ingredients.push({
			name,
			prefix,
			path,
			url: `${TGSC_ORIGIN}${path}`,
			cas: firstMatch(restText, /CAS:\s*([0-9][0-9\-., ]*)/i),
			uses: firstMatch(restText, /Use\(s\):\s*(.+)$/i),
			kind,
			letter
		});
	}
	const pageLinks = [];
	const seenHrefs = /* @__PURE__ */ new Set();
	for (const match of html.matchAll(HREF_RE)) {
		const href = (match[1] ?? "").trim();
		if (!href || href.startsWith("javascript:") || href.startsWith("mailto:")) continue;
		const absolute = href.startsWith("http") ? href : `${TGSC_ORIGIN}${href.startsWith("/") ? href : `/${href}`}`;
		if (seenHrefs.has(absolute)) continue;
		seenHrefs.add(absolute);
		pageLinks.push({
			href,
			url: absolute,
			label: stripTags(match[2] ?? "") || href
		});
	}
	const title = firstMatch(html, /<title>([\s\S]*?)<\/title>/i) || `All Ingredients Listing : Starting with ${letter.toUpperCase()}`;
	return {
		letter,
		sourceUrl: listingUrl(letter),
		title: stripTags(title),
		ingredients,
		pageLinks,
		extractedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function parseCellLinks(html) {
	const links = [];
	for (const match of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
		const href = decodeEntities(match[1] ?? "").trim();
		if (!href || /^(javascript:|mailto:|#)/i.test(href)) continue;
		let url;
		try {
			url = new URL(href, TGSC_ORIGIN).href;
		} catch {
			continue;
		}
		links.push({
			href,
			url,
			label: stripTags(match[2] ?? "") || href
		});
	}
	return links;
}
function parseDetailRow(html) {
	const cells = [];
	for (const match of html.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)) {
		const cellHtml = match[1] ?? "";
		cells.push({
			text: stripTags(cellHtml),
			links: parseCellLinks(cellHtml)
		});
	}
	return {
		label: cells[0]?.text ?? "",
		value: cells.length > 1 ? cells.slice(1).map((cell) => cell.text).filter(Boolean).join(" | ") : "",
		cells
	};
}
function parseIngredientHtml(html, item) {
	const sections = [];
	for (const match of html.matchAll(/<div\b[^>]*class=["'][^"']*\bsectionclass\b[^"']*["'][^>]*>([\s\S]*?)<\/div>([\s\S]*?)(?=<div\b[^>]*class=["'][^"']*\bsectionclass\b[^"']*["'][^>]*>|<\/section>|$)/gi)) {
		const title = stripTags(match[1] ?? "");
		const rows = [...(match[2] ?? "").matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((row) => parseDetailRow(row[1] ?? "")).filter((row) => row.cells.length > 0);
		sections.push({
			title,
			rows
		});
	}
	const title = firstMatch(html, /<span\b[^>]*itemprop=["']name["'][^>]*>([\s\S]*?)<\/span>/i) || firstMatch(html, /<title>([\s\S]*?)<\/title>/i) || item.name;
	const synonym = firstMatch(html, /<span\b[^>]*class=["'][^"']*\bheadsynonym\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
	const category = firstMatch(html, /<div\b[^>]*class=["'][^"']*\bqinfr2\b[^"']*["'][^>]*>[\s\S]*?<span\b[^>]*>([\s\S]*?)<\/span>/i);
	return {
		...item,
		title: stripTags(title),
		synonym: stripTags(synonym),
		category: stripTags(category),
		sections,
		extractedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
export { parseIngredientHtml as a, listingUrl as i, TGSC_ORIGIN as n, parseListingHtml as o, isLetterKey as r, LETTER_PAGES as t };
