import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { n as getSql, t as getExcelCheckpointTarget } from "./excel-checkpoint-D4xESMik.mjs";
import { buildExcelCheckpoint, getExcelCheckpointStatus } from "./xlsx-checkpoint.server-B41ft2pv.mjs";
import { r as isLetterKey } from "./tgsc-B-UjHrEs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/extract-B7T9o82p.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var extractLetter_createServerFn_handler = createServerRpc({
	id: "1dc521f17c4a7f82bbfa0a1c2e19e0ca29afd62a3e757622ae4f5b3fe552dc5e",
	name: "extractLetter",
	filename: "src/lib/extract.ts"
}, (opts) => extractLetter.__executeServer(opts));
var extractLetter = createServerFn({ method: "POST" }).validator((input) => {
	const letter = input.letter.trim().toLowerCase();
	if (!isLetterKey(letter)) throw new Error(`Unknown listing page: ${input.letter}`);
	return { letter };
}).handler(extractLetter_createServerFn_handler, async ({ data }) => {
	const { loadLetter } = await import("./tgsc-fetch.server-Dmyws_Zt.mjs");
	const result = await loadLetter(data.letter);
	const sql = await getSql();
	await sql.query(`insert into perfume_ingredients (
         path, name, prefix, url, cas, uses, kind, letter, listing_extracted_at, updated_at
       )
       select item.path, item.name, item.prefix, item.url, item.cas, item.uses,
         item.kind, item.letter, now(), now()
       from jsonb_to_recordset($1::jsonb) as item(
         path text, name text, prefix text, url text, cas text, uses text, kind text, letter text
       )
       on conflict (path) do update set
         name = excluded.name,
         prefix = excluded.prefix,
         url = excluded.url,
         cas = excluded.cas,
         uses = excluded.uses,
         kind = excluded.kind,
         letter = excluded.letter,
         listing_extracted_at = now(),
         updated_at = now()`, [JSON.stringify(result.ingredients)]);
	await sql.query(`insert into perfume_listing_pages (letter, source_url, page_links, extracted_at)
       values ($1, $2, $3::jsonb, now())
       on conflict (letter) do update set
         source_url = excluded.source_url,
         page_links = excluded.page_links,
         extracted_at = now()`, [
		result.letter,
		result.sourceUrl,
		JSON.stringify(result.pageLinks)
	]);
	return result;
});
var loadCatalogPage_createServerFn_handler = createServerRpc({
	id: "f4b155c1d41c5d127d0efdd0aadeee67ff1ac39e7fc00760efbb79b704c4c5a3",
	name: "loadCatalogPage",
	filename: "src/lib/extract.ts"
}, (opts) => loadCatalogPage.__executeServer(opts));
var loadCatalogPage = createServerFn({ method: "POST" }).validator((input) => {
	if (!Number.isSafeInteger(input.offset) || input.offset < 0) throw new Error("Invalid catalog page offset.");
	return { offset: input.offset };
}).handler(loadCatalogPage_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	let excelCheckpoint = await getExcelCheckpointStatus();
	if (data.offset === 0) {
		const [{ completedCount = 0, totalCount = 0 } = {}] = await sql.query(`select
           count(*) filter (where detail_status = 'complete')::int as "completedCount",
           count(*)::int as "totalCount"
         from perfume_ingredients`);
		if (getExcelCheckpointTarget(completedCount, totalCount) > excelCheckpoint.completedCount) try {
			excelCheckpoint = (await buildExcelCheckpoint()).status;
		} catch (error) {
			excelCheckpoint = {
				...excelCheckpoint,
				lastError: error instanceof Error ? error.message : "Could not create the Excel checkpoint from saved detail pages."
			};
		}
	}
	const rows = await sql.query(`select path, name, prefix, url, cas, uses, kind, letter,
         detail_status as "detailStatus", detail_error as "detailError",
         count(*) over()::int as "catalogCount"
       from perfume_ingredients
       order by letter, path
       limit 1000 offset $1`, [data.offset]);
	const { catalogCount = 0 } = rows[0] ?? {};
	const items = rows.map(({ catalogCount: _catalogCount, ...item }) => item);
	const [metadata] = data.offset === 0 ? await sql.query(`select
               coalesce((
                 select jsonb_agg(entries.link)
                 from perfume_listing_pages pages
                 cross join lateral jsonb_array_elements(pages.page_links) as entries(link)
               ), '[]'::jsonb) as "pageLinks",
               coalesce((
                 select array_agg(distinct letter order by letter)
                 from perfume_ingredients
               ), array[]::text[]) as letters,
               coalesce((
                 select max(listing_extracted_at)::text
                 from perfume_ingredients
               ), '') as "extractedAt"`) : [];
	return {
		count: catalogCount,
		items,
		pageLinks: metadata?.pageLinks ?? [],
		letters: metadata?.letters ?? [],
		extractedAt: metadata?.extractedAt ?? "",
		excelCheckpoint
	};
});
var extractDetailPage_createServerFn_handler = createServerRpc({
	id: "1655da6959b6a57bf024f3a4c843c1d0ae3c706a6fc90f23195229a952006422",
	name: "extractDetailPage",
	filename: "src/lib/extract.ts"
}, (opts) => extractDetailPage.__executeServer(opts));
var extractDetailPage = createServerFn({ method: "POST" }).validator((input) => {
	if (!/^\/data\/[a-z0-9_-]+\.html$/i.test(input.path)) throw new Error("Invalid ingredient detail path.");
	return { path: input.path };
}).handler(extractDetailPage_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const [item] = await sql.query(`select path, name, prefix, url, cas, uses, kind, letter,
         detail_status as "detailStatus"
       from perfume_ingredients where path = $1`, [data.path]);
	if (!item) throw new Error("Ingredient is not in the saved catalog. Extract its listing first.");
	if (item.detailStatus === "complete") {
		let excelCheckpointError = null;
		try {
			await buildExcelCheckpoint();
		} catch (error) {
			excelCheckpointError = error instanceof Error ? error.message : "Could not update the Excel checkpoint.";
		}
		return {
			path: item.path,
			status: "complete",
			error: null,
			excelCheckpointError,
			excelCheckpoint: await getExcelCheckpointStatus()
		};
	}
	const { loadIngredientDetail } = await import("./tgsc-fetch.server-Dmyws_Zt.mjs");
	let detail;
	try {
		detail = await loadIngredientDetail(item);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown detail page error.";
		await sql.query(`update perfume_ingredients
         set detail_status = 'failed', detail_error = $2, updated_at = now()
         where path = $1`, [item.path, message]);
		return {
			path: item.path,
			status: "failed",
			error: message
		};
	}
	await sql.query(`update perfume_ingredients
       set title = $2, synonym = $3, category = $4, detail_sections = $5::jsonb,
         detail_status = 'complete', detail_error = null,
         detail_extracted_at = now(), updated_at = now()
       where path = $1`, [
		detail.path,
		detail.title,
		detail.synonym,
		detail.category,
		JSON.stringify(detail.sections)
	]);
	let excelCheckpointError = null;
	try {
		await buildExcelCheckpoint();
	} catch (error) {
		excelCheckpointError = error instanceof Error ? error.message : "Could not update the Excel checkpoint.";
	}
	return {
		path: detail.path,
		status: "complete",
		error: null,
		excelCheckpointError,
		excelCheckpoint: await getExcelCheckpointStatus()
	};
});
//#endregion
export { extractDetailPage_createServerFn_handler, extractLetter_createServerFn_handler, loadCatalogPage_createServerFn_handler };
