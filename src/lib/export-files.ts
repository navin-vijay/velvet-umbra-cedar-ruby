import type { IngredientDetail, IngredientLink, LetterKey } from "./tgsc";

export function displayName(item: IngredientLink): string {
  return item.prefix ? `${item.prefix} ${item.name}` : item.name;
}

function csvCell(value: string): string {
  const firstContent = value.trimStart()[0] ?? "";
  const safeValue = ["=", "+", "-", "@"].includes(firstContent) ? `'${value}` : value;
  return `"${safeValue.replace(/"/g, '""')}"`;
}

export function mergeIngredients(groups: IngredientLink[][]): IngredientLink[] {
  const out: IngredientLink[] = [];
  const seen = new Set<string>();
  for (const group of groups) {
    for (const item of group) {
      if (seen.has(item.path)) continue;
      seen.add(item.path);
      out.push(item);
    }
  }
  return out;
}

export type ExportLink = {
  name: string;
  url: string;
  path: string;
  cas: string;
  uses: string;
  kind: string;
  letter: LetterKey;
};

export function toExportLinks(items: IngredientLink[]): ExportLink[] {
  return items.map((item) => ({
    name: displayName(item),
    url: item.url,
    path: item.path,
    cas: item.cas,
    uses: item.uses,
    kind: item.kind,
    letter: item.letter,
  }));
}

export function buildCsv(items: IngredientLink[]): string {
  const header = ["name", "url", "path", "cas", "uses", "kind", "letter"];
  const rows = toExportLinks(items).map((item) =>
    [item.name, item.url, item.path, item.cas, item.uses, item.kind, item.letter]
      .map(csvCell)
      .join(","),
  );
  return `\uFEFF${[header.join(","), ...rows].join("\r\n")}\r\n`;
}

export function buildJson(items: IngredientLink[], letters: LetterKey[]): string {
  const links = toExportLinks(items);
  return `${JSON.stringify(
    {
      count: links.length,
      letters,
      extractedAt: new Date().toISOString(),
      links,
    },
    null,
    2,
  )}\n`;
}

export function buildDetailCsv(
  items: (IngredientDetail & { detailStatus?: string; detailError?: string | null })[],
): string {
  const header = [
    "name",
    "cas",
    "uses",
    "kind",
    "letter",
    "url",
    "path",
    "synonym",
    "category",
    "sections_json",
    "extracted_at",
    "detail_status",
    "detail_error",
  ];
  const rows = items.map((item) =>
    [
      displayName(item),
      item.cas,
      item.uses,
      item.kind,
      item.letter,
      item.url,
      item.path,
      item.synonym,
      item.category,
      JSON.stringify(item.sections),
      item.extractedAt,
      item.detailStatus ?? "complete",
      item.detailError ?? "",
    ]
      .map(csvCell)
      .join(","),
  );
  return `\uFEFF${[header.join(","), ...rows].join("\r\n")}\r\n`;
}

export function buildDetailJson(
  items: IngredientDetail[],
  letters: LetterKey[],
  failures: { path: string; error: string }[],
  notExtractedPaths: string[],
): string {
  return `${JSON.stringify(
    {
      schema: "tgsc-perfume-catalog/v1",
      source: "The Good Scents Company",
      count: items.length,
      letters,
      extractedAt: new Date().toISOString(),
      failedPages: failures,
      notExtractedPaths,
      ingredients: items,
    },
    null,
    2,
  )}\n`;
}

export function triggerDownload(filename: string, contents: string) {
  const href = URL.createObjectURL(new Blob([contents], { type: "application/octet-stream" }));
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  window.setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(href);
  }, 4000);
}
