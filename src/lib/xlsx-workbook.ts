import ExcelJS from "exceljs";
import type { DetailSection, IngredientDetail, LetterKey } from "./tgsc.ts";

const EXCEL_CELL_LIMIT = 32_767;
const EXCEL_CHUNK_SIZE = 30_000;
const EXCEL_MAX_ROWS = 1_048_576;

export type ExcelIngredientRecord = Omit<IngredientDetail, "extractedAt"> & {
  title: string | null;
  synonym: string | null;
  category: string | null;
  sections: DetailSection[] | null;
  detailStatus: "pending" | "complete" | "failed";
  detailError: string | null;
  extractedAt: string | null;
};

export type ExcelListingPage = {
  letter: LetterKey;
  pageLinks: unknown[];
};

function splitExcelText(value: string): string[] {
  if (value.length <= EXCEL_CELL_LIMIT) return [value];

  const chunks: string[] = [];
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

function safeCellValue(value: string): string {
  return value.length <= EXCEL_CELL_LIMIT ? value : `${value.slice(0, EXCEL_CELL_LIMIT - 1)}…`;
}

function createDetailsWorksheet(workbook: ExcelJS.Workbook, index: number): ExcelJS.Worksheet {
  const worksheet = workbook.addWorksheet(index === 1 ? "Detail Data" : `Detail Data ${index}`);
  worksheet.columns = [
    { header: "Ingredient", key: "ingredient", width: 36 },
    { header: "CAS", key: "cas", width: 20 },
    { header: "Source URL", key: "source_url", width: 58 },
    { header: "Section", key: "section", width: 40 },
    { header: "Field", key: "field", width: 38 },
    { header: "Value", key: "value", width: 54 },
    { header: "Row index", key: "row_index", width: 12 },
    { header: "Complete row JSON part", key: "row_payload_part", width: 80 },
    { header: "Part", key: "part", width: 10 },
    { header: "Total parts", key: "total_parts", width: 12 },
  ];
  worksheet.views = [{ state: "frozen", ySplit: 1 }];
  worksheet.autoFilter = { from: "A1", to: "J1" };
  return worksheet;
}

function addDetails(
  workbook: ExcelJS.Workbook,
  worksheets: ExcelJS.Worksheet[],
  ingredient: ExcelIngredientRecord,
): void {
  for (const section of ingredient.sections ?? []) {
    for (const [rowIndex, row] of section.rows.entries()) {
      const payload = JSON.stringify(row);
      const chunks = splitExcelText(payload);
      chunks.forEach((chunk, index) => {
        let worksheet = worksheets.at(-1)!;
        if (worksheet.rowCount >= EXCEL_MAX_ROWS) {
          worksheet = createDetailsWorksheet(workbook, worksheets.length + 1);
          worksheets.push(worksheet);
        }
        worksheet.addRow({
          ingredient: safeCellValue(
            ingredient.prefix ? `${ingredient.prefix} ${ingredient.name}` : ingredient.name,
          ),
          cas: safeCellValue(ingredient.cas),
          source_url: safeCellValue(ingredient.url),
          section: safeCellValue(section.title),
          field: safeCellValue(row.label),
          value: safeCellValue(row.value),
          row_index: rowIndex + 1,
          row_payload_part: chunk,
          part: index + 1,
          total_parts: chunks.length,
        });
      });
    }
  }
}

export async function buildExcelWorkbookBase64(
  records: ExcelIngredientRecord[],
  pageRows: ExcelListingPage[],
): Promise<string> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Scent Index";
  workbook.created = new Date();
  workbook.modified = new Date();

  const catalog = workbook.addWorksheet("Ingredients");
  catalog.columns = [
    { header: "Name", key: "name", width: 36 },
    { header: "Prefix", key: "prefix", width: 18 },
    { header: "CAS", key: "cas", width: 20 },
    { header: "Uses", key: "uses", width: 42 },
    { header: "Kind", key: "kind", width: 14 },
    { header: "Letter", key: "letter", width: 10 },
    { header: "Synonym", key: "synonym", width: 38 },
    { header: "Category", key: "category", width: 34 },
    { header: "Source URL", key: "url", width: 58 },
    { header: "Source path", key: "path", width: 32 },
    { header: "Detail status", key: "detailStatus", width: 16 },
    { header: "Detail error", key: "detailError", width: 52 },
    { header: "Extracted at", key: "extractedAt", width: 26 },
  ];
  catalog.addRows(
    records.map((record) => ({
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
      extractedAt: safeCellValue(record.extractedAt ?? ""),
    })),
  );
  catalog.views = [{ state: "frozen", ySplit: 1 }];
  catalog.autoFilter = { from: "A1", to: "M1" };

  const detailWorksheets = [createDetailsWorksheet(workbook, 1)];
  for (const record of records) {
    if (record.detailStatus === "complete") addDetails(workbook, detailWorksheets, record);
  }

  const links = workbook.addWorksheet("Listing Links");
  links.columns = [
    { header: "Letter page", key: "letter", width: 16 },
    { header: "Label", key: "label", width: 40 },
    { header: "URL", key: "url", width: 80 },
  ];
  for (const page of pageRows) {
    for (const link of page.pageLinks as { label?: string; url?: string }[]) {
      links.addRow({ letter: page.letter, label: link.label ?? "", url: link.url ?? "" });
    }
  }
  links.views = [{ state: "frozen", ySplit: 1 }];
  links.autoFilter = { from: "A1", to: "C1" };

  for (const sheet of [catalog, ...detailWorksheets, links]) {
    const header = sheet.getRow(1);
    header.font = { bold: true, color: { argb: "FFFFFFFF" } };
    header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF263B35" } };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer).toString("base64");
}
