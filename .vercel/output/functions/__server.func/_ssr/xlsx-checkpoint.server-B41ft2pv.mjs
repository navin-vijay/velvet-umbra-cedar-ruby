import { o as __toESM } from "../_runtime.mjs";
import { n as getSql, t as getExcelCheckpointTarget } from "./excel-checkpoint-D4xESMik.mjs";
import { t as require_excel } from "../_libs/exceljs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/xlsx-checkpoint.server-B41ft2pv.js
var import_excel = /* @__PURE__ */ __toESM(require_excel());
var EXCEL_CELL_LIMIT = 32767;
var EXCEL_CHUNK_SIZE = 3e4;
var EXCEL_MAX_ROWS = 1048576;
function splitExcelText(value) {
	if (value.length <= EXCEL_CELL_LIMIT) return [value];
	const chunks = [];
	let chunk = "";
	for (const character of value) {
		if (chunk.length + character.length > EXCEL_CHUNK_SIZE) {
			chunks.push(chunk);
			chunk = "";
		}
		chunk += character;
	}
	if (chunk) chunks.push(chunk);
	return chunks;
}
function safeCellValue(value) {
	return value.length <= EXCEL_CELL_LIMIT ? value : `${value.slice(0, 32766)}…`;
}
function createDetailsWorksheet(workbook, index) {
	const worksheet = workbook.addWorksheet(index === 1 ? "Detail Data" : `Detail Data ${index}`);
	worksheet.columns = [
		{
			header: "Ingredient",
			key: "ingredient",
			width: 36
		},
		{
			header: "CAS",
			key: "cas",
			width: 20
		},
		{
			header: "Source URL",
			key: "source_url",
			width: 58
		},
		{
			header: "Section",
			key: "section",
			width: 40
		},
		{
			header: "Field",
			key: "field",
			width: 38
		},
		{
			header: "Value",
			key: "value",
			width: 54
		},
		{
			header: "Row index",
			key: "row_index",
			width: 12
		},
		{
			header: "Complete row JSON part",
			key: "row_payload_part",
			width: 80
		},
		{
			header: "Part",
			key: "part",
			width: 10
		},
		{
			header: "Total parts",
			key: "total_parts",
			width: 12
		}
	];
	worksheet.views = [{
		state: "frozen",
		ySplit: 1
	}];
	worksheet.autoFilter = {
		from: "A1",
		to: "J1"
	};
	return worksheet;
}
function addDetails(workbook, worksheets, ingredient) {
	for (const section of ingredient.sections ?? []) for (const [rowIndex, row] of section.rows.entries()) {
		const chunks = splitExcelText(JSON.stringify(row));
		chunks.forEach((chunk, index) => {
			let worksheet = worksheets.at(-1);
			if (worksheet.rowCount >= EXCEL_MAX_ROWS) {
				worksheet = createDetailsWorksheet(workbook, worksheets.length + 1);
				worksheets.push(worksheet);
			}
			worksheet.addRow({
				ingredient: safeCellValue(ingredient.prefix ? `${ingredient.prefix} ${ingredient.name}` : ingredient.name),
				cas: safeCellValue(ingredient.cas),
				source_url: safeCellValue(ingredient.url),
				section: safeCellValue(section.title),
				field: safeCellValue(row.label),
				value: safeCellValue(row.value),
				row_index: rowIndex + 1,
				row_payload_part: chunk,
				part: index + 1,
				total_parts: chunks.length
			});
		});
	}
}
async function buildExcelWorkbookBase64(records, pageRows) {
	const workbook = new import_excel.default.Workbook();
	workbook.creator = "Scent Index";
	workbook.created = /* @__PURE__ */ new Date();
	workbook.modified = /* @__PURE__ */ new Date();
	const catalog = workbook.addWorksheet("Ingredients");
	catalog.columns = [
		{
			header: "Name",
			key: "name",
			width: 36
		},
		{
			header: "Prefix",
			key: "prefix",
			width: 18
		},
		{
			header: "CAS",
			key: "cas",
			width: 20
		},
		{
			header: "Uses",
			key: "uses",
			width: 42
		},
		{
			header: "Kind",
			key: "kind",
			width: 14
		},
		{
			header: "Letter",
			key: "letter",
			width: 10
		},
		{
			header: "Synonym",
			key: "synonym",
			width: 38
		},
		{
			header: "Category",
			key: "category",
			width: 34
		},
		{
			header: "Source URL",
			key: "url",
			width: 58
		},
		{
			header: "Source path",
			key: "path",
			width: 32
		},
		{
			header: "Detail status",
			key: "detailStatus",
			width: 16
		},
		{
			header: "Detail error",
			key: "detailError",
			width: 52
		},
		{
			header: "Extracted at",
			key: "extractedAt",
			width: 26
		}
	];
	catalog.addRows(records.map((record) => ({
		name: safeCellValue(record.title || record.name),
		prefix: safeCellValue(record.prefix),
		cas: safeCellValue(record.cas),
		uses: safeCellValue(record.uses),
		kind: safeCellValue(record.kind),
		letter: safeCellValue(record.letter),
		synonym: safeCellValue(record.synonym ?? ""),
		category: safeCellValue(record.category ?? ""),
		url: safeCellValue(record.url),
		path: safeCellValue(record.path),
		detailStatus: safeCellValue(record.detailStatus),
		detailError: safeCellValue(record.detailError ?? ""),
		extractedAt: safeCellValue(record.extractedAt ?? "")
	})));
	catalog.views = [{
		state: "frozen",
		ySplit: 1
	}];
	catalog.autoFilter = {
		from: "A1",
		to: "M1"
	};
	const detailWorksheets = [createDetailsWorksheet(workbook, 1)];
	for (const record of records) if (record.detailStatus === "complete") addDetails(workbook, detailWorksheets, record);
	const links = workbook.addWorksheet("Listing Links");
	links.columns = [
		{
			header: "Letter page",
			key: "letter",
			width: 16
		},
		{
			header: "Label",
			key: "label",
			width: 40
		},
		{
			header: "URL",
			key: "url",
			width: 80
		}
	];
	for (const page of pageRows) for (const link of page.pageLinks) links.addRow({
		letter: page.letter,
		label: link.label ?? "",
		url: link.url ?? ""
	});
	links.views = [{
		state: "frozen",
		ySplit: 1
	}];
	links.autoFilter = {
		from: "A1",
		to: "C1"
	};
	for (const sheet of [
		catalog,
		...detailWorksheets,
		links
	]) {
		const header = sheet.getRow(1);
		header.font = {
			bold: true,
			color: { argb: "FFFFFFFF" }
		};
		header.fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: "FF263B35" }
		};
	}
	const buffer = await workbook.xlsx.writeBuffer();
	return Buffer.from(buffer).toString("base64");
}
var checkpointSchemaPromise = null;
async function ensureExcelCheckpointSchema() {
	if (checkpointSchemaPromise) return checkpointSchemaPromise;
	checkpointSchemaPromise = (async () => {
		await (await getSql()).query(`create table if not exists perfume_excel_checkpoint (
         id smallint primary key default 1 check (id = 1),
         completed_count integer not null default 0,
         workbook_base64 text,
         updated_at timestamptz not null default now(),
         last_error text
       )`);
	})().catch((error) => {
		checkpointSchemaPromise = null;
		throw error;
	});
	return checkpointSchemaPromise;
}
async function getExcelCheckpointStatus() {
	await ensureExcelCheckpointSchema();
	const [row] = await (await getSql()).query(`select completed_count as "completedCount", updated_at::text as "updatedAt",
       last_error as "lastError"
     from perfume_excel_checkpoint where id = 1`);
	return {
		completedCount: row?.completedCount ?? 0,
		updatedAt: row?.updatedAt ?? null,
		lastError: row?.lastError ?? null
	};
}
async function buildExcelCheckpoint() {
	await ensureExcelCheckpointSchema();
	const sql = await getSql();
	const [{ completedCount = 0, totalCount = 0 } = {}] = await sql.query(`select
       count(*) filter (where detail_status = 'complete')::int as "completedCount",
       count(*)::int as "totalCount"
     from perfume_ingredients`);
	const currentStatus = await getExcelCheckpointStatus();
	const targetCount = getExcelCheckpointTarget(completedCount, totalCount);
	if (targetCount <= currentStatus.completedCount) return {
		status: currentStatus,
		workbookBase64: targetCount === currentStatus.completedCount ? (await sql.query("select workbook_base64 as \"workbookBase64\" from perfume_excel_checkpoint where id = 1"))[0]?.workbookBase64 ?? null : null
	};
	try {
		const workbookBase64 = await buildExcelWorkbookBase64(await sql.query(`select path, name, prefix, url, cas, uses, kind, letter, title, synonym, category,
         detail_sections as sections, detail_status as "detailStatus",
         detail_error as "detailError", detail_extracted_at::text as "extractedAt"
       from perfume_ingredients
       order by letter, path`), await sql.query("select letter, page_links as \"pageLinks\" from perfume_listing_pages order by letter"));
		await sql.query(`insert into perfume_excel_checkpoint (id, completed_count, workbook_base64, updated_at, last_error)
       values (1, $1, $2, now(), null)
       on conflict (id) do update set
         completed_count = excluded.completed_count,
         workbook_base64 = excluded.workbook_base64,
         updated_at = now(),
         last_error = null
       where perfume_excel_checkpoint.completed_count < excluded.completed_count`, [targetCount, workbookBase64]);
		return {
			status: {
				completedCount: targetCount,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
				lastError: null
			},
			workbookBase64
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "Excel checkpoint creation failed.";
		await sql.query(`insert into perfume_excel_checkpoint (id, completed_count, last_error)
       values (1, 0, $1)
       on conflict (id) do update set last_error = excluded.last_error`, [message]);
		throw error;
	}
}
//#endregion
export { buildExcelCheckpoint, ensureExcelCheckpointSchema, getExcelCheckpointStatus };
