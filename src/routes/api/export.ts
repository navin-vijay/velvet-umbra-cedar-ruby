import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { EXCEL_CHECKPOINT_INTERVAL } from "@/lib/excel-checkpoint";
import { buildDetailCsv, buildDetailJson } from "@/lib/export-files";
import type { DetailSection, IngredientDetail, LetterKey } from "@/lib/tgsc";

export const Route = createFileRoute("/api/export")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const format = (url.searchParams.get("format") ?? "csv").toLowerCase();
        if (format !== "csv" && format !== "json" && format !== "xlsx") {
          return new Response("format must be csv, json, or xlsx", { status: 400 });
        }

        const parseNumber = (value: string | null, fallback: number) => {
          if (value == null || value.trim() === "") return fallback;
          const parsed = Number(value);
          return Number.isFinite(parsed) ? parsed : fallback;
        };
        const from = Math.max(1, parseNumber(url.searchParams.get("from"), 1));
        const to = url.searchParams.has("to")
          ? Math.max(from, parseNumber(url.searchParams.get("to"), from))
          : Number.MAX_SAFE_INTEGER;

        const sql = await getSql();
        if (format === "xlsx") {
          const { ensureExcelCheckpointSchema } = await import("@/lib/xlsx-checkpoint.server");
          await ensureExcelCheckpointSchema();
          const [checkpoint] = await sql.query<{ workbookBase64: string | null }>(
            `select workbook_base64 as "workbookBase64"
             from perfume_excel_checkpoint where id = 1`,
          );
          if (!checkpoint?.workbookBase64) {
            return new Response(
              `Excel workbook is generated after the first ${EXCEL_CHECKPOINT_INTERVAL} detail pages.`,
              {
                status: 409,
                headers: { "Cache-Control": "no-store" },
              },
            );
          }
          return new Response(Buffer.from(checkpoint.workbookBase64, "base64"), {
            headers: {
              "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "Content-Disposition":
                "attachment; filename=\"A-Z Extracted.xlsx\"; filename*=UTF-8''A-Z%20Extracted.xlsx",
              "Cache-Control": "no-store",
            },
          });
        }

        const rows = await sql.query<
          Omit<IngredientDetail, "extractedAt" | "title" | "synonym" | "category"> & {
            title: string | null;
            synonym: string | null;
            category: string | null;
            sections: DetailSection[];
            extractedAt: string | null;
            detailStatus: "pending" | "complete" | "failed";
            detailError: string | null;
          }
        >(
          `with numbered as (
             select *, row_number() over (order by letter, path) as row_num
             from perfume_ingredients
           )
           select path, name, prefix, url, cas, uses, kind, letter, title, synonym, category,
             detail_sections as sections, detail_extracted_at::text as "extractedAt",
             detail_status as "detailStatus", detail_error as "detailError"
           from numbered
           where row_num between $1 and $2
           order by letter, path`,
          [from, to],
        );
        const items = rows.map((item) => ({
          ...item,
          title: item.title ?? "",
          synonym: item.synonym ?? "",
          category: item.category ?? "",
          sections: item.sections ?? [],
          extractedAt: item.extractedAt ?? "",
        }));
        const [{ letters = [] } = {}] = await sql.query<{ letters: LetterKey[] }>(
          `with numbered as (
             select *, row_number() over (order by letter, path) as row_num
             from perfume_ingredients
           )
           select coalesce(array_agg(distinct letter order by letter), array[]::text[]) as letters
           from numbered
           where row_num between $1 and $2`,
          [from, to],
        );
        const stem = "tgsc-perfume-database";
        if (format === "json") {
          const completedItems = items.filter((item) => item.detailStatus === "complete");
          const pending = await sql.query<{ path: string; error: string | null }>(
            `with numbered as (
               select *, row_number() over (order by letter, path) as row_num
               from perfume_ingredients
             )
             select path, detail_error as error
             from numbered
             where detail_status != 'complete' and row_num between $1 and $2
             order by letter, path`,
            [from, to],
          );
          const failures = pending.flatMap((item) =>
            item.error ? [{ path: item.path, error: item.error }] : [],
          );
          const notExtractedPaths = pending.filter((item) => !item.error).map((item) => item.path);
          return fileResponse(
            `${stem}.json`,
            "application/json",
            buildDetailJson(completedItems, letters, failures, notExtractedPaths),
          );
        }
        return fileResponse(`${stem}.csv`, "text/csv", buildDetailCsv(items));
      },
    },
  },
});

function fileResponse(filename: string, mime: string, body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": `${mime}; charset=utf-8`,
      "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${filename}`,
      "Cache-Control": "no-store",
    },
  });
}
