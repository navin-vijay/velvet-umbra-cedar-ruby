import { a as parseIngredientHtml, i as listingUrl, n as TGSC_ORIGIN, o as parseListingHtml } from "./tgsc-B-UjHrEs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tgsc-fetch.server-Dmyws_Zt.js
var cache = /* @__PURE__ */ new Map();
var detailCache = /* @__PURE__ */ new Map();
var requestHeaders = {
	Accept: "text/html,application/xhtml+xml",
	"User-Agent": "Mozilla/5.0 (compatible; ScentIndex/1.0; +https://www.thegoodscentscompany.com)"
};
async function loadLetter(letter) {
	const cached = cache.get(letter);
	if (cached) return cached;
	const sourceUrl = listingUrl(letter);
	const response = await fetch(sourceUrl, {
		headers: requestHeaders,
		signal: AbortSignal.timeout(25e3)
	});
	if (!response.ok) throw new Error(`TGSC returned ${response.status} for ${sourceUrl}`);
	const html = await response.text();
	const result = parseListingHtml(html, letter);
	if (result.ingredients.length === 0) throw new Error(`No ingredient links found on ${sourceUrl}`);
	cache.set(letter, result);
	return result;
}
async function loadIngredientDetail(item) {
	const cached = detailCache.get(item.path);
	if (cached) return {
		...cached,
		...item
	};
	const sourceUrl = new URL(item.path, TGSC_ORIGIN);
	const response = await fetch(sourceUrl, {
		headers: requestHeaders,
		signal: AbortSignal.timeout(2e4)
	});
	if (!response.ok) throw new Error(`TGSC returned ${response.status} for ${sourceUrl.href}`);
	const html = await response.text();
	if (!/<div\b[^>]*class=["'][^"']*\bsectionclass\b/i.test(html)) throw new Error(`No detail sections found on ${sourceUrl.href}`);
	const detail = parseIngredientHtml(html, {
		...item,
		url: sourceUrl.href
	});
	detailCache.set(item.path, detail);
	return detail;
}
//#endregion
export { loadIngredientDetail, loadLetter };
