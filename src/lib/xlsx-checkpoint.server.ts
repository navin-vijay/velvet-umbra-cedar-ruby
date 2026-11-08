import { getSql } from "@/lib/db";
import { getExcelCheckpointTarget } from "./excel-checkpoint";
import type { ExcelCheckpointStatus } from "./excel-checkpoint";
import {
  buildExcelWorkbookBase64,
  type ExcelIngredientRecord,
  type ExcelListingPage,
} from "./xlsx-workbook";

let checkpointSchemaPromise: Promise<void> | null = null;

export async function ensureExcelCheckpointSchema(): Promise<void> {
  if (checkpointSchemaPromise) return checkpointSchemaPromise;
  // The migration also handles fresh starts; this creates the table in an already-running preview.
  checkpointSchemaPromise = (async () => {
    const sql = await getSql();
    await sql.query(
      `create table if not exists perfume_excel_checkpoint (
         id smallint primary key default 1 check (id = 1),
         completed_count integer not null default 0,
         workbook_base64 text,
         updated_at timestamptz not null default now(),
         last_error text
       )`,
    );
  })().catch((error: unknown) => {
    checkpointSchemaPromise = null;
    throw error;
  });
  return checkpointSchemaPromise;
}

export async function getExcelCheckpointStatus(): Promise<ExcelCheckpointStatus> {
  await ensureExcelCheckpointSchema();
  const sql = await getSql();
  const [row] = await sql.query<ExcelCheckpointStatus>(
    `select completed_count as "completedCount", updated_at::text as "updatedAt",
       last_error as "lastError"
     from perfume_excel_checkpoint where id = 1`,
  );
  return {
    completedCount: row?.completedCount ?? 0,
    updatedAt: row?.updatedAt ?? null,
    lastError: row?.lastError ?? null,
  };
}

export async function buildExcelCheckpoint(): Promise<{
  status: ExcelCheckpointStatus;
  workbookBase64: string | null;
}> {
  await ensureExcelCheckpointSchema();
  const sql = await getSql();
  const [{ completedCount = 0, totalCount = 0 } = {}] = await sql.query<{
    completedCount: number;
    totalCount: number;
  }>(
    `select
       count(*) filter (where detail_status = 'complete')::int as "completedCount",
       count(*)::int as "totalCount"
     from perfume_ingredients`,
  );
  const currentStatus = await getExcelCheckpointStatus();
  const targetCount = getExcelCheckpointTarget(completedCount, totalCount);
  if (targetCount <= currentStatus.completedCount) {
    return {
      status: currentStatus,
      workbookBase64:
        targetCount === currentStatus.completedCount
          ? ((
              await sql.query<{ workbookBase64: string | null }>(
                'select workbook_base64 as "workbookBase64" from perfume_excel_checkpoint where id = 1',
              )
            )[0]?.workbookBase64 ?? null)
          : null,
    };
  }

  try {
    const records = await sql.query<ExcelIngredientRecord>(
      `select path, name, prefix, url, cas, uses, kind, letter, title, synonym, category,
         detail_sections as sections, detail_status as "detailStatus",
         detail_error as "detailError", detail_extracted_at::text as "extractedAt"
       from perfume_ingredients
       order by letter, path`,
    );
    const pageRows = await sql.query<ExcelListingPage>(
      'select letter, page_links as "pageLinks" from perfume_listing_pages order by letter',
    );
    const workbookBase64 = await buildExcelWorkbookBase64(records, pageRows);
    await sql.query(
      `insert into perfume_excel_checkpoint (id, completed_count, workbook_base64, updated_at, last_error)
       values (1, $1, $2, now(), null)
       on conflict (id) do update set
         completed_count = excluded.completed_count,
         workbook_base64 = excluded.workbook_base64,
         updated_at = now(),
         last_error = null
       where perfume_excel_checkpoint.completed_count < excluded.completed_count`,
      [targetCount, workbookBase64],
    );
    return {
      status: {
        completedCount: targetCount,
        updatedAt: new Date().toISOString(),
        lastError: null,
      },
      workbookBase64,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Excel checkpoint creation failed.";
    await sql.query(
      `insert into perfume_excel_checkpoint (id, completed_count, last_error)
       values (1, 0, $1)
       on conflict (id) do update set last_error = excluded.last_error`,
      [message],
    );
    throw error;
  }
}
