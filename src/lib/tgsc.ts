export const TGSC_ORIGIN = "https://www.thegoodscentscompany.com";

/** TGSC groups J/K and W/X onto shared listing pages. */
export const LETTER_PAGES = [
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
  "z",
] as const;

export type LetterKey = (typeof LETTER_PAGES)[number];

export function isLetterKey(value: string): value is LetterKey {
  return (LETTER_PAGES as readonly string[]).includes(value);
}

export function listingUrl(letter: LetterKey): string {
  return `${TGSC_ORIGIN}/allprod-${letter}.html`;
}

export type IngredientLink = {
  name: string;
  prefix: string;
  path: string;
  url: string;
  cas: string;
  uses: string;
  kind: string;
  letter: LetterKey;
};

export type DetailCell = {
  text: string;
  links: PageLink[];
};

export type DetailRow = {
  label: string;
  value: string;
  cells: DetailCell[];
};

export type DetailSection = {
  title: string;
  rows: DetailRow[];
};

export type IngredientDetail = IngredientLink & {
  title: string;
  synonym: string;
  category: string;
  sections: DetailSection[];
  extractedAt: string;
};

export type PageLink = {
  href: string;
  url: string;
  label: string;
};

export type ExtractResult = {
  letter: LetterKey;
  sourceUrl: string;
  title: string;
  ingredients: IngredientLink[];
  pageLinks: PageLink[];
  extractedAt: string;
};

const ENTITY_MAP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
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
  reg: "®",
};

function decodeEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, n: string) => {
      const code = Number(n);
      return Number.isInteger(code) && code >= 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : _;
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => {
      const code = Number.parseInt(n, 16);
      return Number.isInteger(code) && code >= 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : _;
    })
    .replace(/&([a-z]+);/gi, (match, name: string) => {
      return ENTITY_MAP[name.toLowerCase()] ?? match;
    });
}

function stripTags(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function firstMatch(source: string, pattern: RegExp): string {
  const match = source.match(pattern);
  return match?.[1]?.replace(/\s+/g, " ").trim() ?? "";
}

const ROW_RE =
  /<td>(?:\s*<div class="chtols">([\s\S]*?)<\/div>)?\s*<a href="#" onclick="openMainWindow\('(\/data\/[^']+)'\);return false;">([\s\S]*?)<\/a>([\s\S]*?)<\/td>/gi;

const HREF_RE = /<a\b[^>]*href="([^"#][^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;

export function parseListingHtml(html: string, letter: LetterKey): ExtractResult {
  const ingredients: IngredientLink[] = [];
  const seenPaths = new Set<string>();

  for (const match of html.matchAll(ROW_RE)) {
    const prefix = stripTags(match[1] ?? "");
    const path = match[2] ?? "";
    const name = stripTags(match[3] ?? "");
    const rest = match[4] ?? "";
    if (!path || !name || seenPaths.has(path)) continue;
    seenPaths.add(path);

    const restText = stripTags(rest);
    const file = path.split("/").pop() ?? "";
    const kind = file.replace(/\d.*$/, "").replace(/\.html$/i, "") || "data";

    ingredients.push({
      name,
      prefix,
      path,
      url: `${TGSC_ORIGIN}${path}`,
      cas: firstMatch(restText, /CAS:\s*([0-9][0-9\-., ]*)/i),
      uses: firstMatch(restText, /Use\(s\):\s*(.+)$/i),
      kind,
      letter,
    });
  }

  const pageLinks: PageLink[] = [];
  const seenHrefs = new Set<string>();
  for (const match of html.matchAll(HREF_RE)) {
    const href = (match[1] ?? "").trim();
    if (!href || href.startsWith("javascript:") || href.startsWith("mailto:")) continue;
    const absolute = href.startsWith("http")
      ? href
      : `${TGSC_ORIGIN}${href.startsWith("/") ? href : `/${href}`}`;
    if (seenHrefs.has(absolute)) continue;
    seenHrefs.add(absolute);
    pageLinks.push({
      href,
      url: absolute,
      label: stripTags(match[2] ?? "") || href,
    });
  }

  const title =
    firstMatch(html, /<title>([\s\S]*?)<\/title>/i) ||
    `All Ingredients Listing : Starting with ${letter.toUpperCase()}`;

  return {
    letter,
    sourceUrl: listingUrl(letter),
    title: stripTags(title),
    ingredients,
    pageLinks,
    extractedAt: new Date().toISOString(),
  };
}

function parseCellLinks(html: string): PageLink[] {
  const links: PageLink[] = [];
  for (const match of html.matchAll(
    /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
  )) {
    const href = decodeEntities(match[1] ?? "").trim();
    if (!href || /^(javascript:|mailto:|#)/i.test(href)) continue;
    let url: string;
    try {
      url = new URL(href, TGSC_ORIGIN).href;
    } catch {
      continue;
    }
    links.push({ href, url, label: stripTags(match[2] ?? "") || href });
  }
  return links;
}

function parseDetailRow(html: string): DetailRow {
  const cells: DetailCell[] = [];
  for (const match of html.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)) {
    const cellHtml = match[1] ?? "";
    cells.push({ text: stripTags(cellHtml), links: parseCellLinks(cellHtml) });
  }

  const label = cells[0]?.text ?? "";
  const value =
    cells.length > 1
      ? cells
          .slice(1)
          .map((cell) => cell.text)
          .filter(Boolean)
          .join(" | ")
      : "";
  return { label, value, cells };
}

export function parseIngredientHtml(html: string, item: IngredientLink): IngredientDetail {
  const sections: DetailSection[] = [];
  const sectionPattern =
    /<div\b[^>]*class=["'][^"']*\bsectionclass\b[^"']*["'][^>]*>([\s\S]*?)<\/div>([\s\S]*?)(?=<div\b[^>]*class=["'][^"']*\bsectionclass\b[^"']*["'][^>]*>|<\/section>|$)/gi;

  for (const match of html.matchAll(sectionPattern)) {
    const title = stripTags(match[1] ?? "");
    const sectionHtml = match[2] ?? "";
    const rows = [...sectionHtml.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
      .map((row) => parseDetailRow(row[1] ?? ""))
      .filter((row) => row.cells.length > 0);
    sections.push({ title, rows });
  }

  const title =
    firstMatch(html, /<span\b[^>]*itemprop=["']name["'][^>]*>([\s\S]*?)<\/span>/i) ||
    firstMatch(html, /<title>([\s\S]*?)<\/title>/i) ||
    item.name;
  const synonym = firstMatch(
    html,
    /<span\b[^>]*class=["'][^"']*\bheadsynonym\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
  );
  const category = firstMatch(
    html,
    /<div\b[^>]*class=["'][^"']*\bqinfr2\b[^"']*["'][^>]*>[\s\S]*?<span\b[^>]*>([\s\S]*?)<\/span>/i,
  );

  return {
    ...item,
    title: stripTags(title),
    synonym: stripTags(synonym),
    category: stripTags(category),
    sections,
    extractedAt: new Date().toISOString(),
  };
}
