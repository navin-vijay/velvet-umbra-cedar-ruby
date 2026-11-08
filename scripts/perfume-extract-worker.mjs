#!/usr/bin/env node
import pg from "pg";
import { buildExcelWorkbookBase64 } from "../src/lib/xlsx-workbook.ts";
import { getExcelCheckpointTarget } from "../src/lib/excel-checkpoint.ts";
import {
  LETTER_PAGES,
  TGSC_ORIGIN,
  listingUrl,
  parseIngredientHtml,
  parseListingHtml,
} from "../src/lib/tgsc.ts";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required. Configure it as a GitHub Actions repository secret.");
}

const maxAttempts = readPositiveInteger(process.env.PERFUME_MAX_ATTEMPTS, 250);
const runBudgetMs = readPositiveInteger(process.env.PERFUME_RUN_BUDGET_SECONDS, 660) * 1000;
const requestDelayMs = readPositiveInteger(process.env.PERFUME_REQUEST_DELAY_MS, 750);
const maxDetailAttempts = 5;
const requestHeaders = {
  Accept: "text/html,application/xhtml+xml",
  "User-Agent": "Mozilla/5.0 (compatible; ScentIndex/1.0; +https://www.thegoodscentscompany.com)",
};
const pool = new pg.Pool({ connectionString: databaseUrl, max: 2 });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function readPositiveInteger(value, fallback) {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`Expected a positive integer; received ${value}.`);
  }
  return parsed;
}

async function fetchHtml(url, timeoutMs) {
  const response = await fetch(url, {
    headers: requestHeaders,
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`TGSC returned ${response.status} for ${url}`);
  return response.text();
}

async function ensureListings() {
  const { rows } = await pool.query("select letter from perfume_listing_pages");
  const available = new Set(rows.map((row) => row.letter));
  const failures = [];

  for (const letter of LETTER_PAGES) {
    if (available.has(letter)) continue;
    try {
      if (available.size > 0 || failures.length > 0) await sleep(requestDelayMs);
      const sourceUrl = listingUrl(letter);
      const result = parseListingHtml(await fetchHtml(sourceUrl, 25_000), letter);
      if (result.ingredients.length === 0) {
        throw new Error(`No ingredient links found on ${sourceUrl}`);
      }

      await pool.query(
        `insert into perfume_ingredients (
           path, name, prefix, url, cas, uses, kind, letter, listing_extracted_at, updated_at
         )
         select item.path, item.name, item.prefix, item.url, item.cas, item.uses,
           item.kind, item.letter, now(), now()
         from jsonb_to_recordset($1::jsonb) as item(
           path text, name text, prefix text, url text, cas text, uses text, kind text, letter text
         )
         on conflict (path) do update set
           name = excluded.name, prefix = excluded.prefix, url = excluded.url,
           cas = excluded.cas, uses = excluded.uses, kind = excluded.kind,
           letter = excluded.letter, listing_extracted_at = now(), updated_at = now()`,
        [JSON.stringify(result.ingredients)],
      );
      await pool.query(
        `insert into perfume_listing_pages (letter, source_url, page_links, extracted_at)
         values ($1, $2, $3::jsonb, now())
         on conflict (letter) do update set
           source_url = excluded.source_url, page_links = excluded.page_links, extracted_at = now()`,
        [letter, result.sourceUrl, JSON.stringify(result.pageLinks)],
      );
      available.add(letter);
      console.log(
        `[worker] saved ${letter.toUpperCase()} listing (${result.ingredients.length} ingredients)`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${letter}: ${message}`);
      console.error(`[worker] listing ${letter.toUpperCase()} failed: ${message}`);
    }
  }

  if (available.size === 0) {
    throw new Error(`Could not load any ingredient listings. ${failures.join("; ")}`);
  }
  if (failures.length > 0) {
    console.warn(`[worker] ${failures.length} listing page(s) will be retried on a later run.`);
  }
}

async function readCheckpointStatus() {
  const { rows } = await pool.query(
    `select completed_count as "completedCount", updated_at::text as "updatedAt",
       last_error as "lastError"
     from perfume_excel_checkpoint where id = 1`,
  );
  return rows[0] ?? { completedCount: 0, updatedAt: null, lastError: null };
}

async function saveCheckpointIfDue() {
  const counts = await pool.query(
    `select
       count(*) filter (where detail_status = 'complete')::int as "completedCount",
       count(*)::int as "totalCount"
     from perfume_ingredients`,
  );
  const { completedCount, totalCount } = counts.rows[0];
  const targetCount = getExcelCheckpointTarget(completedCount, totalCount);
  const checkpoint = await readCheckpointStatus();
  if (targetCount <= checkpoint.completedCount) return checkpoint.completedCount;

  const records = await pool.query(
    `select path, name, prefix, url, cas, uses, kind, letter, title, synonym, category,
       detail_sections as sections, detail_status as "detailStatus",
       detail_error as "detailError", detail_extracted_at::text as "extractedAt"
     from perfume_ingredients order by letter, path`,
  );
  const pageRows = await pool.query(
    `select letter, page_links as "pageLinks"
     from perfume_listing_pages order by letter`,
  );
  let workbookBase64;
  try {
    workbookBase64 = await buildExcelWorkbookBase64(records.rows, pageRows.rows);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Background Excel checkpoint creation failed.";
    await pool.query(
      `insert into perfume_excel_checkpoint (id, completed_count, last_error)
       values (1, $1, $2)
       on conflict (id) do update set last_error = excluded.last_error`,
      [checkpoint.completedCount, message],
    );
    throw error;
  }
  await pool.query(
    `insert into perfume_excel_checkpoint
       (id, completed_count, workbook_base64, updated_at, last_error)
     values (1, $1, $2, now(), null)
     on conflict (id) do update set
       completed_count = excluded.completed_count,
       workbook_base64 = excluded.workbook_base64,
       updated_at = now(),
       last_error = null
     where perfume_excel_checkpoint.completed_count < excluded.completed_count`,
    [targetCount, workbookBase64],
  );
  console.log(`[worker] saved A-Z Extracted.xlsx at ${targetCount} completed detail pages`);
  return targetCount;
}

async function claimNextIngredient() {
  const { rows } = await pool.query(
    `with next_ingredient as (
       select path
       from perfume_ingredients
       where detail_status = 'pending'
          or (detail_status = 'failed'
              and detail_attempts < $1
              and (detail_retry_at is null or detail_retry_at <= now()))
       order by letter, path
       limit 1
       for update skip locked
     )
     update perfume_ingredients as ingredient
     set detail_attempts = ingredient.detail_attempts + 1,
         detail_retry_at = null,
         updated_at = now()
     from next_ingredient
     where ingredient.path = next_ingredient.path
     returning ingredient.path, ingredient.name, ingredient.prefix, ingredient.url,
       ingredient.cas, ingredient.uses, ingredient.kind, ingredient.letter,
       ingredient.detail_attempts as attempts`,
    [maxDetailAttempts],
  );
  return rows[0] ?? null;
}

async function saveFailedAttempt(item, error) {
  const message = error instanceof Error ? error.message : String(error);
  const retryDelaySeconds = Math.min(3600, 60 * 2 ** Math.max(0, item.attempts - 1));
  await pool.query(
    `update perfume_ingredients
     set detail_status = 'failed',
         detail_error = $2,
         detail_retry_at = case when detail_attempts < $3
           then now() + ($4 * interval '1 second')
           else null end,
         updated_at = now()
     where path = $1`,
    [item.path, message, maxDetailAttempts, retryDelaySeconds],
  );
  console.error(
    `[worker] ${item.path} attempt ${item.attempts}/${maxDetailAttempts} failed: ${message}`,
  );
}

async function extractIngredient(item) {
  const url = new URL(item.path, TGSC_ORIGIN).href;
  const html = await fetchHtml(url, 20_000);
  if (!/<div\b[^>]*class=["'][^"']*\bsectionclass\b/i.test(html)) {
    throw new Error(`No detail sections found on ${url}`);
  }
  const detail = parseIngredientHtml(html, { ...item, url });
  await pool.query(
    `update perfume_ingredients
     set title = $2, synonym = $3, category = $4, detail_sections = $5::jsonb,
         detail_status = 'complete', detail_error = null, detail_retry_at = null,
         detail_extracted_at = now(), updated_at = now()
     where path = $1`,
    [detail.path, detail.title, detail.synonym, detail.category, JSON.stringify(detail.sections)],
  );
}

async function main() {
  const startedAt = Date.now();
  await pool.query("select 1");
  await ensureListings();
  await saveCheckpointIfDue();

  let attempted = 0;
  let completed = 0;
  let failed = 0;
  while (attempted < maxAttempts && Date.now() - startedAt < runBudgetMs) {
    const item = await claimNextIngredient();
    if (!item) break;
    if (attempted > 0) await sleep(requestDelayMs);
    attempted += 1;
    try {
      await extractIngredient(item);
    } catch (error) {
      failed += 1;
      await saveFailedAttempt(item, error);
      continue;
    }

    completed += 1;
    if (completed % 25 === 0) {
      console.log(`[worker] this run completed ${completed} detail pages`);
    }
    await saveCheckpointIfDue();
  }

  const counts = await pool.query(
    `select
       count(*) filter (where detail_status = 'complete')::int as "completedCount",
       count(*) filter (where detail_status = 'pending')::int as "pendingCount",
       count(*) filter (where detail_status = 'failed')::int as "failedCount"
     from perfume_ingredients`,
  );
  const status = counts.rows[0];
  console.log(
    `[worker] run finished: attempted=${attempted}, completed=${completed}, failed=${failed}; ` +
      `database complete=${status.completedCount}, pending=${status.pendingCount}, failed=${status.failedCount}`,
  );
}

main()
  .catch((error) => {
    console.error("[worker] run failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
