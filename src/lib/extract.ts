import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { getExcelCheckpointTarget } from "./excel-checkpoint";
import { buildExcelCheckpoint, getExcelCheckpointStatus } from "./xlsx-checkpoint.server";
import {
  isLetterKey,
  type ExtractResult,
  type IngredientDetail,
  type IngredientLink,
  type LetterKey,
} from "./tgsc";

export const extractLetter = createServerFn({ method: "POST" })
  .validator((input: { letter: string }) => {
    const letter = input.letter.trim().toLowerCase();
    if (!isLetterKey(letter)) {
      throw new Error(`Unknown listing page: ${input.letter}`);
    }
    return { letter };
  })
  .handler(async ({ data }): Promise<ExtractResult> => {
    const { loadLetter } = await import("./tgsc-fetch.server");
    const result = await loadLetter(data.letter);
    const sql = await getSql();
    await sql.query(
      `insert into perfume_ingredients (
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
         updated_at = now()`,
      [JSON.stringify(result.ingredients)],
    );
    await sql.query(
      `insert into perfume_listing_pages (letter, source_url, page_links, extracted_at)
       values ($1, $2, $3::jsonb, now())
       on conflict (letter) do update set
         source_url = excluded.source_url,
         page_links = excluded.page_links,
         extracted_at = now()`,
      [result.letter, result.sourceUrl, JSON.stringify(result.pageLinks)],
    );
    return result;
  });

export type CatalogPageItem = IngredientLink & {
  detailStatus: "pending" | "complete" | "failed";
  detailError: string | null;
};

export type ExcelCheckpointSnapshot = {
  completedCount: number;
  updatedAt: string | null;
  lastError: string | null;
};

export const loadCatalogPage = createServerFn({ method: "POST" })
  .validator((input: { offset: number }) => {
    if (!Number.isSafeInteger(input.offset) || input.offset < 0) {
      throw new Error("Invalid catalog page offset.");
    }
    return { offset: input.offset };
  })
  .handler(async ({ data }) => {
    const sql = await getSql();
    let excelCheckpoint = await getExcelCheckpointStatus();
    if (data.offset === 0) {
      const [{ completedCount = 0, totalCount = 0 } = {}] = await sql.query<{
        completedCount: number;
        totalCount: number;
      }>(
        `select
           count(*) filter (where detail_status = 'complete')::int as "completedCount",
           count(*)::int as "totalCount"
         from perfume_ingredients`,
      );
      const expectedCheckpoint = getExcelCheckpointTarget(completedCount, totalCount);
      if (expectedCheckpoint > excelCheckpoint.completedCount) {
        try {
          excelCheckpoint = (await buildExcelCheckpoint()).status;
        } catch (error) {
          excelCheckpoint = {
            ...excelCheckpoint,
            lastError:
              error instanceof Error
                ? error.message
                : "Could not create the Excel checkpoint from saved detail pages.",
          };
        }
      }
    }
    const rows = await sql.query<CatalogPageItem & { catalogCount: number }>(
      `select path, name, prefix, url, cas, uses, kind, letter,
         detail_status as "detailStatus", detail_error as "detailError",
         count(*) over()::int as "catalogCount"
       from perfume_ingredients
       order by letter, path
       limit 1000 offset $1`,
      [data.offset],
    );
    const { catalogCount = 0 } = rows[0] ?? {};
    const items = rows.map(({ catalogCount: _catalogCount, ...item }) => item);
    const [metadata] =
      data.offset === 0
        ? await sql.query<{
            pageLinks: ExtractResult["pageLinks"];
            letters: LetterKey[];
            extractedAt: string;
          }>(
            `select
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
               ), '') as "extractedAt"`,
          )
        : [];
    return {
      count: catalogCount,
      items,
      pageLinks: metadata?.pageLinks ?? [],
      letters: metadata?.letters ?? [],
      extractedAt: metadata?.extractedAt ?? "",
      excelCheckpoint,
    };
  });

export const extractDetailPage = createServerFn({ method: "POST" })
  .validator((input: { path: string }) => {
    if (!/^\/data\/[a-z0-9_-]+\.html$/i.test(input.path)) {
      throw new Error("Invalid ingredient detail path.");
    }
    return { path: input.path };
  })
  .handler(async ({ data }) => {
    const sql = await getSql();
    const [item] = await sql.query<IngredientLink & { detailStatus: string }>(
      `select path, name, prefix, url, cas, uses, kind, letter,
         detail_status as "detailStatus"
       from perfume_ingredients where path = $1`,
      [data.path],
    );
    if (!item)
      throw new Error("Ingredient is not in the saved catalog. Extract its listing first.");
    if (item.detailStatus === "complete") {
      let excelCheckpointError: string | null = null;
      try {
        await buildExcelCheckpoint();
      } catch (error) {
        excelCheckpointError =
          error instanceof Error ? error.message : "Could not update the Excel checkpoint.";
      }
      return {
        path: item.path,
        status: "complete" as const,
        error: null,
        excelCheckpointError,
        excelCheckpoint: await getExcelCheckpointStatus(),
      };
    }

    const { loadIngredientDetail } = await import("./tgsc-fetch.server");
    let detail: IngredientDetail;
    try {
      detail = await loadIngredientDetail(item);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown detail page error.";
      await sql.query(
        `update perfume_ingredients
         set detail_status = 'failed', detail_error = $2, updated_at = now()
         where path = $1`,
        [item.path, message],
      );
      return { path: item.path, status: "failed" as const, error: message };
    }

    await sql.query(
      `update perfume_ingredients
       set title = $2, synonym = $3, category = $4, detail_sections = $5::jsonb,
         detail_status = 'complete', detail_error = null,
         detail_extracted_at = now(), updated_at = now()
       where path = $1`,
      [detail.path, detail.title, detail.synonym, detail.category, JSON.stringify(detail.sections)],
    );
    let excelCheckpointError: string | null = null;
    try {
      await buildExcelCheckpoint();
    } catch (error) {
      excelCheckpointError =
        error instanceof Error ? error.message : "Could not update the Excel checkpoint.";
    }
    return {
      path: detail.path,
      status: "complete" as const,
      error: null,
      excelCheckpointError,
      excelCheckpoint: await getExcelCheckpointStatus(),
    };
  });
