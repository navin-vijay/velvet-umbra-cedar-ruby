import ExcelJS from "exceljs";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Link2,
  Loader2,
  Search,
  Upload,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { extractDetailPage, extractLetter, loadCatalogPage } from "@/lib/extract";
import type { ExcelCheckpointSnapshot } from "@/lib/extract";
import { EXCEL_CHECKPOINT_INTERVAL, isSuccessfulNewExcelCheckpoint } from "@/lib/excel-checkpoint";
import { displayName, mergeIngredients } from "@/lib/export-files";
import {
  LETTER_PAGES,
  listingUrl,
  type ExtractResult,
  type IngredientLink,
  type LetterKey,
  type PageLink,
} from "@/lib/tgsc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 40;

function normalizeChemicalName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

type Catalog = {
  letters: LetterKey[];
  ingredients: IngredientLink[];
  pageLinks: PageLink[];
  extractedAt: string;
};

type ExportFormat = "csv" | "json" | "xlsx";

function mergeResults(results: ExtractResult[]): Catalog {
  const pageLinks: PageLink[] = [];
  const seenUrls = new Set<string>();
  for (const result of results) {
    for (const link of result.pageLinks) {
      if (seenUrls.has(link.url)) continue;
      seenUrls.add(link.url);
      pageLinks.push(link);
    }
  }
  return {
    letters: results.map((result) => result.letter),
    ingredients: mergeIngredients(results.map((result) => result.ingredients)),
    pageLinks,
    extractedAt: results.at(-1)?.extractedAt ?? new Date().toISOString(),
  };
}

function mergeCatalog(existing: Catalog | null, incoming: Catalog): Catalog {
  if (!existing) return incoming;
  const pageLinks = new Map(existing.pageLinks.map((link) => [link.url, link]));
  for (const link of incoming.pageLinks) pageLinks.set(link.url, link);
  return {
    letters: [...new Set([...existing.letters, ...incoming.letters])],
    ingredients: mergeIngredients([existing.ingredients, incoming.ingredients]),
    pageLinks: [...pageLinks.values()],
    extractedAt: incoming.extractedAt,
  };
}

async function loadCatalogFromDatabase(): Promise<{
  catalog: Catalog | null;
  details: Record<string, boolean>;
  failures: { path: string; error: string }[];
  excelCheckpoint: ExcelCheckpointSnapshot;
}> {
  const ingredients: IngredientLink[] = [];
  const details: Record<string, boolean> = {};
  const failures: { path: string; error: string }[] = [];
  let count = 0;
  let offset = 0;
  let letters: LetterKey[] = [];
  let pageLinks: PageLink[] = [];
  let extractedAt = "";
  let excelCheckpoint: ExcelCheckpointSnapshot = {
    completedCount: 0,
    updatedAt: null,
    lastError: null,
  };

  do {
    const result = await loadCatalogPage({ data: { offset } });
    count = result.count;
    letters = result.letters;
    extractedAt = result.extractedAt;
    if (offset === 0) {
      pageLinks = result.pageLinks;
      excelCheckpoint = result.excelCheckpoint;
    }
    for (const row of result.items) {
      const { detailStatus, detailError, ...ingredient } = row;
      ingredients.push(ingredient);
      if (detailStatus === "complete") details[ingredient.path] = true;
      if (detailStatus === "failed") {
        failures.push({
          path: ingredient.path,
          error: detailError ?? "Detail extraction failed.",
        });
      }
    }
    offset += result.items.length;
  } while (offset < count);

  return {
    catalog: ingredients.length > 0 ? { letters, ingredients, pageLinks, extractedAt } : null,
    details,
    failures,
    excelCheckpoint,
  };
}

function letterLabel(letter: LetterKey): string {
  if (letter === "jk") return "J / K";
  if (letter === "wx") return "W / X";
  return letter.toUpperCase();
}

export function ScentIndex() {
  const [selected, setSelected] = useState<LetterKey>("a");
  const [allLetters, setAllLetters] = useState(false);
  const [busy, setBusy] = useState(false);
  const [detailsBusy, setDetailsBusy] = useState(false);
  const [databaseReady, setDatabaseReady] = useState(false);
  const [progress, setProgress] = useState<{ letter: string; done: number; total: number } | null>(
    null,
  );
  const [detailProgress, setDetailProgress] = useState<{ done: number; total: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [details, setDetails] = useState<Record<string, boolean>>({});
  const [detailFailures, setDetailFailures] = useState<{ path: string; error: string }[]>([]);
  const [excelCheckpoint, setExcelCheckpoint] = useState<ExcelCheckpointSnapshot>({
    completedCount: 0,
    updatedAt: null,
    lastError: null,
  });
  const [customNames, setCustomNames] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(1);
  const [page, setPage] = useState(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const abortRef = useRef(false);
  const excelCheckpointCountRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const runInitialExtractRef = useRef<() => void>(() => {});

  const customNameSet = useMemo(() => {
    const set = new Set<string>();
    for (const name of customNames) {
      const normalized = normalizeChemicalName(name);
      if (normalized) set.add(normalized);
    }
    return set;
  }, [customNames]);

  const customMatches = useMemo(() => {
    if (!catalog || customNames.length === 0) return [];
    return catalog.ingredients.filter((item) => {
      const names = [displayName(item), item.name, item.prefix ?? "", item.cas].map((value) =>
        normalizeChemicalName(value),
      );
      return names.some((name) => name && customNameSet.has(name));
    });
  }, [catalog, customNameSet, customNames.length]);

  const filtered = useMemo(() => {
    if (!catalog) return [];
    const q = query.trim().toLowerCase();
    if (!q) return catalog.ingredients;
    return catalog.ingredients.filter((item) => {
      return (
        displayName(item).toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        item.cas.toLowerCase().includes(q) ||
        item.uses.toLowerCase().includes(q) ||
        item.kind.toLowerCase().includes(q)
      );
    });
  }, [catalog, query]);

  const totalRangeCount = catalog ? catalog.ingredients.length : 0;
  const normalizedRangeStart = Math.min(
    Math.max(rangeStart || 1, 1),
    totalRangeCount === 0 ? 1 : totalRangeCount,
  );
  const normalizedRangeEnd = Math.min(
    Math.max(rangeEnd || normalizedRangeStart, normalizedRangeStart),
    totalRangeCount === 0 ? 1 : totalRangeCount,
  );
  const selectedRangeIngredients = useMemo(() => {
    if (!catalog) return [];
    return catalog.ingredients.slice(normalizedRangeStart - 1, normalizedRangeEnd);
  }, [catalog, normalizedRangeStart, normalizedRangeEnd]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const detailCount = selectedRangeIngredients.reduce(
    (count, item) => count + (details[item.path] ? 1 : 0),
    0,
  );
  const pendingDetailCount = selectedRangeIngredients.filter((item) => !details[item.path]).length;
  const currentFailures = selectedRangeIngredients.flatMap((item) => {
    const failure = detailFailures.find((entry) => entry.path === item.path);
    return failure ? [failure] : [];
  });

  useEffect(() => {
    let active = true;
    void loadCatalogFromDatabase()
      .then((saved) => {
        if (!active) return;
        setCatalog(saved.catalog);
        if (saved.catalog) {
          setRangeStart(1);
          setRangeEnd(saved.catalog.ingredients.length);
        }
        setDetails(saved.details);
        setDetailFailures(saved.failures);
        setExcelCheckpoint(saved.excelCheckpoint);
        excelCheckpointCountRef.current = saved.excelCheckpoint.completedCount;
        setDatabaseReady(true);
        if (!saved.catalog) runInitialExtractRef.current();
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Could not load the perfume database.";
        setError(message);
        setDatabaseReady(true);
        toast.error(message);
      });
    return () => {
      active = false;
    };
  }, []);

  async function runExtract(letters: LetterKey[]) {
    abortRef.current = false;
    setBusy(true);
    setError(null);
    setProgress({ letter: letters[0] ?? "a", done: 0, total: letters.length });
    let mergedCatalog = catalog;
    try {
      for (let i = 0; i < letters.length; i += 1) {
        if (abortRef.current) break;
        const letter = letters[i]!;
        setProgress({ letter, done: i, total: letters.length });
        const result = await extractLetter({ data: { letter } });
        mergedCatalog = mergeCatalog(mergedCatalog, mergeResults([result]));
        setCatalog(mergedCatalog);
        setPage(1);
      }
      if (!mergedCatalog) {
        setError("Extraction was cancelled.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not read TGSC.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  runInitialExtractRef.current = () => {
    void runExtract(["a"]);
  };

  function onExtract() {
    void runExtract(allLetters ? [...LETTER_PAGES] : [selected]);
  }

  async function runDetailExtract() {
    if (!catalog || detailsBusy || !databaseReady) return;
    const queue = selectedRangeIngredients.filter((item) => !details[item.path]);
    if (queue.length === 0) {
      toast.success("All selected ingredient detail pages are already extracted.");
      return;
    }

    abortRef.current = false;
    setDetailsBusy(true);
    setError(null);
    setDetailProgress({ done: 0, total: queue.length });
    const failedPaths = new Set<string>();
    let done = 0;
    try {
      for (let offset = 0; offset < queue.length; offset += 1) {
        if (abortRef.current) break;
        const batch = queue.slice(offset, offset + 1);
        setDetailProgress({ done, total: queue.length });
        let result: {
          path: string;
          status: "complete" | "failed";
          error: string | null;
          excelCheckpointError?: string | null;
          excelCheckpoint?: ExcelCheckpointSnapshot;
        };
        try {
          result = await extractDetailPage({ data: { path: batch[0]!.path } });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Detail batch failed.";
          result = { path: batch[0]!.path, status: "failed", error: message };
        }
        if (result.excelCheckpoint) {
          setExcelCheckpoint(result.excelCheckpoint);
          const previousCheckpoint = excelCheckpointCountRef.current;
          excelCheckpointCountRef.current = result.excelCheckpoint.completedCount;
          if (isSuccessfulNewExcelCheckpoint(previousCheckpoint, result.excelCheckpoint)) {
            await downloadExcelCheckpointAutomatically(result.excelCheckpoint.completedCount);
          }
        }
        if (result.excelCheckpointError) {
          setError(
            `Page saved, but Excel checkpoint creation failed: ${result.excelCheckpointError}`,
          );
        }
        setDetails((current) => ({ ...current, [result.path]: result.status === "complete" }));
        if (result.status === "failed") failedPaths.add(result.path);
        setDetailFailures((current) => {
          const next = new Map(current.map((failure) => [failure.path, failure]));
          if (result.status === "complete") next.delete(result.path);
          else
            next.set(result.path, {
              path: result.path,
              error: result.error ?? "Detail extraction failed.",
            });
          return [...next.values()];
        });
        done += batch.length;
        setDetailProgress({ done, total: queue.length });
      }
      const skipped = queue.length - done;
      if (failedPaths.size > 0) {
        toast.error(
          `${failedPaths.size} detail pages failed. You can retry them; failures are listed below.`,
        );
      } else if (skipped > 0) {
        toast.message(`Paused after ${done.toLocaleString()} detail pages.`);
      } else {
        toast.success(`Extracted ${done.toLocaleString()} ingredient detail pages.`);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? `Could not save extraction progress: ${err.message}`
          : "Could not save extraction progress.";
      setError(message);
      toast.error(message);
    } finally {
      setDetailsBusy(false);
      setDetailProgress(null);
    }
  }

  async function handleExcelImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const lower = file.name.toLowerCase();
      if (!lower.endsWith(".xlsx") && !lower.endsWith(".xls") && !lower.endsWith(".csv")) {
        throw new Error("Please upload an Excel (.xlsx, .xls) or CSV file.");
      }

      const rows: string[] = [];
      if (lower.endsWith(".csv")) {
        const text = await file.text();
        const lines = text.split(/\r?\n/);
        for (const line of lines) {
          const values = line.split(",");
          for (const value of values) {
            const cleaned = value.trim();
            if (cleaned) rows.push(cleaned.replace(/^"|"$/g, ""));
          }
        }
      } else {
        const workbook = new ExcelJS.Workbook();
        const buffer = await file.arrayBuffer();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
          throw new Error("The uploaded workbook does not contain any sheets.");
        }
        worksheet.eachRow((row) => {
          row.eachCell((cell) => {
            const text = String(cell.value ?? "").trim();
            if (text) rows.push(text.replace(/\s+/g, " ").trim());
          });
        });
      }

      const uniqueNames = Array.from(
        new Set(
          rows
            .map((value) => value.replace(/\s+/g, " ").trim())
            .filter((value) => value.length > 0 && !/^\d+$/.test(value)),
        ),
      );
      if (uniqueNames.length === 0) {
        throw new Error("No ingredient names were found in the uploaded file.");
      }

      setCustomNames(uniqueNames);
      setQuery("");
      toast.success(`Loaded ${uniqueNames.length.toLocaleString()} ingredient names from ${file.name}.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not read the uploaded Excel file.";
      setCustomNames([]);
      toast.error(message);
    } finally {
      event.target.value = "";
    }
  }

  async function runCustomNameExtraction() {
    if (!catalog || customMatches.length === 0) {
      toast.error("Import an Excel list first, then match it against the extracted catalog.");
      return;
    }

    const queue = customMatches.filter((item) => !details[item.path]);
    if (queue.length === 0) {
      toast.success("All imported chemical names in the catalog are already extracted.");
      return;
    }

    abortRef.current = false;
    setDetailsBusy(true);
    setError(null);
    setDetailProgress({ done: 0, total: queue.length });
    let done = 0;

    try {
      for (const item of queue) {
        if (abortRef.current) break;
        setDetailProgress({ done, total: queue.length });
        const result = await extractDetailPage({ data: { path: item.path } });
        if (result.excelCheckpoint) {
          setExcelCheckpoint(result.excelCheckpoint);
          const previousCheckpoint = excelCheckpointCountRef.current;
          excelCheckpointCountRef.current = result.excelCheckpoint.completedCount;
          if (isSuccessfulNewExcelCheckpoint(previousCheckpoint, result.excelCheckpoint)) {
            await downloadExcelCheckpointAutomatically(result.excelCheckpoint.completedCount);
          }
        }
        setDetails((current) => ({ ...current, [result.path]: result.status === "complete" }));
        done += 1;
        setDetailProgress({ done, total: queue.length });
      }
      toast.success(`Finished ${done.toLocaleString()} imported chemical detail pages.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Custom list extraction failed.";
      setError(message);
      toast.error(message);
    } finally {
      setDetailsBusy(false);
      setDetailProgress(null);
    }
  }

  async function copyText(label: string, text: string, key?: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key ?? label);
      toast.success(`Copied ${label}`);
      window.setTimeout(() => setCopiedKey(null), 1400);
    } catch {
      toast.error("Clipboard is blocked — use the file preview below");
    }
  }

  async function downloadExcelCheckpointAutomatically(completedCount: number) {
    try {
      const response = await fetch("/api/export?format=xlsx");
      if (!response.ok) {
        throw new Error(`Workbook download failed (${response.status}).`);
      }

      const objectUrl = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = "A-Z Extracted.xlsx";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      toast.success(
        `Automatically downloading A-Z Extracted.xlsx at ${completedCount.toLocaleString()} completed pages.`,
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not automatically download the Excel checkpoint.";
      toast.error(`${message} Use Download Excel to retry.`);
    }
  }

  const headingLetter = allLetters ? "A–Z" : letterLabel(selected);
  function downloadAll(format: ExportFormat) {
    const params = new URLSearchParams({ format });
    if (catalog && totalRangeCount > 0) {
      const from = normalizedRangeStart;
      const to = normalizedRangeEnd;
      const isSubset = from !== 1 || to !== totalRangeCount;
      if (isSubset) {
        params.set("from", String(from));
        params.set("to", String(to));
      }
    }
    const anchor = document.createElement("a");
    anchor.href = `/api/export?${params.toString()}`;
    anchor.download = format === "xlsx" ? "A-Z Extracted.xlsx" : `tgsc-perfume-database.${format}`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    toast.success(
      format === "xlsx"
        ? "Downloading the latest Excel checkpoint"
        : `Preparing the perfume database ${format.toUpperCase()} export`,
    );
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "font-sans border-line bg-bg-elevated text-fg",
        }}
      />
      <div className="mx-auto min-h-dvh max-w-7xl md:grid md:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="border-b border-line bg-ink text-accent-fg md:sticky md:top-0 md:h-dvh md:overflow-y-auto md:border-r md:border-b-0">
          <div className="flex h-full flex-col gap-8 px-6 py-7 sm:px-8">
            <div>
              <p className="text-xs font-medium tracking-widest text-accent-fg/55 uppercase">
                TGSC catalog
              </p>
              <h1 className="font-display mt-3 text-4xl leading-tight tracking-tight">
                Scent Index
              </h1>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-accent-fg/70">
                Pull every ingredient HTML page from The Good Scents Company listings.
              </p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-widest text-accent-fg/50 uppercase">
                  Listing
                </p>
                <button
                  type="button"
                  className="text-xs text-accent-fg/70 underline-offset-4 hover:text-accent-fg hover:underline"
                  onClick={() => setAllLetters((value) => !value)}
                >
                  {allLetters ? "Single letter" : "All letters"}
                </button>
              </div>
              <div className="grid grid-cols-8 gap-1.5">
                {LETTER_PAGES.map((letter) => {
                  const active = !allLetters && selected === letter;
                  return (
                    <button
                      key={letter}
                      type="button"
                      disabled={busy || detailsBusy}
                      onClick={() => {
                        setAllLetters(false);
                        setSelected(letter);
                      }}
                      className={cn(
                        "h-10 rounded-md text-xs font-medium tracking-wide transition-colors duration-150",
                        active
                          ? "bg-accent-fg text-ink"
                          : "bg-accent-fg/8 text-accent-fg/80 hover:bg-accent-fg/14",
                        allLetters && "bg-accent-fg/14 text-accent-fg",
                      )}
                    >
                      {letter.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 md:mt-auto">
              <p className="font-mono text-xs leading-relaxed break-all text-accent-fg/45">
                {allLetters
                  ? "allprod-a.html … allprod-z.html"
                  : `thegoodscentscompany.com/allprod-${selected}.html`}
              </p>
              <Button
                size="lg"
                disabled={!databaseReady || busy || detailsBusy}
                onClick={onExtract}
                className="h-12 w-full rounded-lg bg-accent-fg text-ink hover:bg-accent-fg/90"
              >
                {busy ? <Loader2 className="animate-spin" /> : <Link2 />}
                {busy
                  ? progress
                    ? `Reading ${progress.letter.toUpperCase()} · ${progress.done + 1}/${progress.total}`
                    : "Extracting"
                  : allLetters
                    ? "Extract A–Z links"
                    : `Extract ${headingLetter} links`}
              </Button>
              <Button
                size="lg"
                variant="outline"
                disabled={
                  !databaseReady || !catalog || busy || detailsBusy || pendingDetailCount === 0
                }
                onClick={() => void runDetailExtract()}
                className="h-12 w-full rounded-lg border-accent-fg/30 text-accent-fg hover:bg-accent-fg/10"
              >
                {detailsBusy ? <Loader2 className="animate-spin" /> : <Download />}
                {detailsBusy && detailProgress
                  ? `Details · ${detailProgress.done.toLocaleString()}/${detailProgress.total.toLocaleString()}`
                  : pendingDetailCount > 0
                    ? `${detailCount > 0 ? "Resume" : "Extract"} ${pendingDetailCount.toLocaleString()} detail pages`
                    : "Detail pages complete"}
              </Button>
              {busy && progress && progress.total > 1 ? (
                <button
                  type="button"
                  className="text-center text-xs text-accent-fg/60 hover:text-accent-fg"
                  onClick={() => {
                    abortRef.current = true;
                  }}
                >
                  Stop after this page
                </button>
              ) : null}
              {detailsBusy ? (
                <button
                  type="button"
                  className="text-center text-xs text-accent-fg/60 hover:text-accent-fg"
                  onClick={() => {
                    abortRef.current = true;
                  }}
                >
                  Stop after this page
                </button>
              ) : null}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <header className="flex flex-col gap-5 border-b border-line pb-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-widest text-muted uppercase">
                  All ingredients listing
                </p>
                <h2 className="font-display mt-1 text-3xl tracking-tight text-fg">
                  Starting with {headingLetter}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <Stat
                  label="Ingredient pages"
                  value={catalog ? catalog.ingredients.length.toLocaleString() : "—"}
                />
                <Stat
                  label="Other page links"
                  value={catalog ? catalog.pageLinks.length.toLocaleString() : "—"}
                />
                <Stat
                  label="Detail pages"
                  value={
                    catalog
                      ? `${detailCount.toLocaleString()} / ${selectedRangeIngredients.length.toLocaleString()}`
                      : "—"
                  }
                />
                <Stat label="Excel saved" value={excelCheckpoint.completedCount.toLocaleString()} />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
                  <Input
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Filter by name, CAS, use, or URL"
                    className="h-11 rounded-lg pl-10"
                    aria-label="Filter extracted links"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-line bg-bg px-2 py-1.5">
                  <span className="text-[10px] font-medium tracking-[0.18em] text-muted uppercase">
                    Range
                  </span>
                  <Input
                    type="number"
                    min={1}
                    max={totalRangeCount || 1}
                    value={normalizedRangeStart}
                    onChange={(event) => {
                      const next = Number(event.target.value || 1);
                      setRangeStart(Number.isFinite(next) ? next : 1);
                    }}
                    className="h-9 w-20 rounded-md text-center"
                    aria-label="Start chemical number"
                  />
                  <span className="text-muted">to</span>
                  <Input
                    type="number"
                    min={1}
                    max={totalRangeCount || 1}
                    value={normalizedRangeEnd}
                    onChange={(event) => {
                      const next = Number(event.target.value || normalizedRangeStart);
                      setRangeEnd(Number.isFinite(next) ? next : normalizedRangeStart);
                    }}
                    className="h-9 w-20 rounded-md text-center"
                    aria-label="End chemical number"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRangeStart(1);
                      setRangeEnd(totalRangeCount || 1);
                    }}
                    disabled={!catalog}
                  >
                    All
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!databaseReady || !catalog || busy || detailsBusy}
                  onClick={() => downloadAll("csv")}
                >
                  <Download />
                  Database CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!databaseReady || !catalog || busy || detailsBusy}
                  onClick={() => downloadAll("json")}
                >
                  <Download />
                  Database JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={excelCheckpoint.completedCount === 0}
                  onClick={() => downloadAll("xlsx")}
                >
                  <FileSpreadsheet />
                  Download Excel
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!catalog}
                  onClick={() =>
                    catalog &&
                    copyText(
                      `${catalog.ingredients.length} URLs`,
                      catalog.ingredients.map((item) => item.url).join("\n"),
                      "all-urls",
                    )
                  }
                >
                  {copiedKey === "all-urls" ? <Check /> : <Copy />}
                  Copy URLs
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!catalog || busy || detailsBusy}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload />
                  Import Excel list
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleExcelImport}
                />
              </div>
              {customNames.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-bg px-3 py-2 text-xs text-muted">
                  <span className="font-medium text-fg">Imported list:</span>
                  <span>{customNames.length.toLocaleString()} names</span>
                  {customMatches.length > 0 ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => void runCustomNameExtraction()}
                      disabled={busy || detailsBusy || !catalog}
                    >
                      Extract imported names
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </header>

          {error ? (
            <div className="mt-6 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : null}

          {catalog ? (
            <div className="mt-6 rounded-xl border border-line bg-bg-elevated px-4 py-3 text-sm">
              <p className="font-medium">
                Perfume database detail extraction: {detailCount.toLocaleString()} of{" "}
                {selectedRangeIngredients.length.toLocaleString()} selected pages complete
              </p>
              <p className="mt-1 text-muted">
                Each record includes the source page’s sections and table data—such as identifiers,
                physical and odor information, safety, uses, references, and suppliers when present.
                Empty or unavailable source sections are preserved too. Exports include extracted
                records only; the JSON lists failed and not-yet-extracted pages.
              </p>
              <p className="mt-1 text-muted">
                Completed pages are saved to the shared perfume database as extraction runs. If a
                request is interrupted, restart the detail extraction to continue with pending or
                failed pages.
              </p>
              <p className="mt-1 text-muted">
                Once the GitHub Actions worker is configured, it resumes in scheduled batches even
                while this page and the Codespace are closed. It saves workbook checkpoints in
                Neon for download when you return.
              </p>
              <p className="mt-1 text-muted">
                {excelCheckpoint.completedCount > 0
                  ? `A-Z Extracted.xlsx has a checkpoint at ${excelCheckpoint.completedCount.toLocaleString()} completed detail pages. It downloads automatically at each next ${EXCEL_CHECKPOINT_INTERVAL}-page mark and when extraction finishes.`
                  : `A-Z Extracted.xlsx is first created at ${EXCEL_CHECKPOINT_INTERVAL} completed detail pages, then downloads automatically after every next ${EXCEL_CHECKPOINT_INTERVAL} pages and when extraction finishes.`}
              </p>
              <p className="mt-1 text-muted">
                Your browser may ask once to allow multiple automatic downloads.
              </p>
              {excelCheckpoint.lastError ? (
                <p className="mt-1 text-danger">
                  Latest Excel checkpoint failed: {excelCheckpoint.lastError}
                </p>
              ) : null}
            </div>
          ) : null}
          {currentFailures.length > 0 ? (
            <section className="mt-4 rounded-xl border border-danger/20 bg-danger/5 p-4">
              <h3 className="text-sm font-semibold">
                {currentFailures.length.toLocaleString()} detail pages need retry
              </h3>
              <ul className="mt-2 space-y-2 text-xs text-muted">
                {currentFailures.slice(0, 8).map((failure) => {
                  const item = catalog?.ingredients.find((entry) => entry.path === failure.path);
                  return (
                    <li key={failure.path} className="break-words">
                      <span className="font-medium text-fg">
                        {item ? displayName(item) : failure.path}
                      </span>
                      {" — "}
                      {failure.error}
                    </li>
                  );
                })}
              </ul>
              {currentFailures.length > 8 ? (
                <p className="mt-2 text-xs text-muted">
                  Remaining failures are included in the database JSON export.
                </p>
              ) : null}
            </section>
          ) : null}

          {busy && !catalog ? (
            <LoadingState letter={progress?.letter ?? "a"} />
          ) : catalog ? (
            <>
              <div className="mt-5 overflow-hidden rounded-xl border border-line bg-bg-elevated">
                <div className="hidden gap-3 border-b border-line px-4 py-3 text-xs font-medium tracking-wider text-subtle uppercase md:grid md:grid-cols-12">
                  <span className="md:col-span-5">Ingredient</span>
                  <span className="md:col-span-3">Use</span>
                  <span className="md:col-span-2">CAS</span>
                  <span className="text-right md:col-span-2">HTML link</span>
                </div>
                <ul>
                  {visible.length === 0 ? (
                    <li className="px-4 py-12 text-center text-sm text-muted">
                      No ingredients match that filter.
                    </li>
                  ) : (
                    visible.map((item) => {
                      const label = displayName(item);
                      return (
                        <li
                          key={`${item.letter}-${item.path}`}
                          className="grid gap-2 border-b border-line px-4 py-3 last:border-b-0 md:grid-cols-12 md:items-center md:gap-3"
                        >
                          <div className="min-w-0 md:col-span-5">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="uppercase">
                                {item.kind}
                              </Badge>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="truncate text-sm font-medium text-accent hover:underline"
                              >
                                {label}
                              </a>
                            </div>
                            <p className="mt-1 truncate font-mono text-xs text-subtle md:hidden">
                              {item.url}
                            </p>
                          </div>
                          <p className="truncate text-sm text-muted md:col-span-3">
                            {item.uses || "—"}
                          </p>
                          <p className="font-mono text-xs text-fg tabular-nums md:col-span-2">
                            {item.cas || "—"}
                          </p>
                          <div className="flex items-center justify-end gap-1 md:col-span-2">
                            <button
                              type="button"
                              className="inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-fg"
                              onClick={() => copyText("link", item.url, item.path)}
                              aria-label={`Copy ${label}`}
                            >
                              {copiedKey === item.path ? (
                                <Check className="size-4" />
                              ) : (
                                <Copy className="size-4" />
                              )}
                            </button>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-fg"
                              aria-label={`Open ${label}`}
                            >
                              <ExternalLink className="size-4" />
                            </a>
                          </div>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted">
                  Showing{" "}
                  <span className="font-medium text-fg tabular-nums">
                    {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–
                    {Math.min(safePage * PAGE_SIZE, filtered.length)}
                  </span>{" "}
                  of <span className="font-medium text-fg tabular-nums">{filtered.length}</span>
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-11"
                    disabled={safePage <= 1}
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    aria-label="Previous page"
                  >
                    <ChevronLeft />
                  </Button>
                  <span className="w-16 text-center text-sm tabular-nums">
                    {safePage} / {pageCount}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-11"
                    disabled={safePage >= pageCount}
                    onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                    aria-label="Next page"
                  >
                    <ChevronRight />
                  </Button>
                </div>
              </div>

              <section className="mt-10">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-line bg-bg-elevated px-4 py-3 text-left"
                  onClick={() => setNavOpen((value) => !value)}
                >
                  <span>
                    <span className="text-sm font-medium">Other HTML links on these pages</span>
                    <span className="ml-2 text-sm text-muted">
                      {catalog.pageLinks.length} nav and category URLs
                    </span>
                  </span>
                  <span className="text-sm text-accent">{navOpen ? "Hide" : "Show"}</span>
                </button>
                {navOpen ? (
                  <ul className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-bg-elevated">
                    {catalog.pageLinks.map((link) => (
                      <li
                        key={link.url}
                        className="flex items-center justify-between gap-3 px-4 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{link.label}</p>
                          <p className="truncate font-mono text-xs text-subtle">{link.url}</p>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-fg"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>

              <p className="mt-8 mb-4 text-xs text-subtle">
                Source{" "}
                <a
                  className="text-accent hover:underline"
                  href={listingUrl(catalog.letters[0] ?? "a")}
                  target="_blank"
                  rel="noreferrer"
                >
                  thegoodscentscompany.com/allprod-{catalog.letters[0] ?? "a"}.html
                </a>
                . Listing and ingredient detail data are read live from TGSC. Detail exports include
                every captured section, table cell, and linked reference.
              </p>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-bg-elevated px-4 py-2">
      <p className="text-xs tracking-wider text-subtle uppercase">{label}</p>
      <p className="font-display mt-0.5 text-xl tabular-nums">{value}</p>
    </div>
  );
}

function LoadingState({ letter }: { letter: string }) {
  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center gap-3 text-sm text-muted">
        <Loader2 className="size-4 animate-spin text-accent" />
        Reading allprod-{letter}.html and collecting ingredient page links
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-bg-elevated">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex gap-4 border-b border-line px-4 py-4 last:border-b-0">
            <div className="h-4 w-48 animate-pulse rounded bg-paper" />
            <div className="hidden h-4 flex-1 animate-pulse rounded bg-paper md:block" />
            <div className="h-4 w-20 animate-pulse rounded bg-paper" />
          </div>
        ))}
      </div>
    </div>
  );
}
