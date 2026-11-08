#!/usr/bin/env node
import { spawn, spawnSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";

const DEFAULT_URL = "http://127.0.0.1:8080/";
const DEFAULT_BATCH_SIZE = 100;
const DEFAULT_TIMEOUT_MS = 250_000;
const LETTER_ORDER = [
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
];

function printUsage() {
  console.log(`Usage:
  node scripts/auto-batch-extract.mjs --letter a --from 1 --to 500 --batch-size 100
  node scripts/auto-batch-extract.mjs --letter a --from 1 --to 500 --batch-size 100 --dry-run

Options:
  --letter <key>          Letter to process, e.g. a, jk, wx.
  --from <n>              First chemical number in the selected letter range.
  --to <n>                Last chemical number in the selected letter range.
  --batch-size <n>        Number of entries per extracted batch. Default: 100.
  --base-url <url>        App URL. Default: http://127.0.0.1:8080/
  --dry-run               Print the batch plan without opening the browser.
  --headless              Run browser in headless mode. Default: true.
  --timeout <ms>          Browser automation timeout in ms. Default: 250000.
  --help                  Show this message.
`);
}

function parseArgs(argv) {
  const options = {
    letter: null,
    from: null,
    to: null,
    batchSize: DEFAULT_BATCH_SIZE,
    baseUrl: DEFAULT_URL,
    dryRun: false,
    headless: true,
    timeoutMs: DEFAULT_TIMEOUT_MS,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--letter":
        options.letter = argv[++i];
        break;
      case "--from":
        options.from = Number(argv[++i]);
        break;
      case "--to":
        options.to = Number(argv[++i]);
        break;
      case "--batch-size":
        options.batchSize = Number(argv[++i]);
        break;
      case "--base-url":
        options.baseUrl = argv[++i];
        break;
      case "--timeout":
        options.timeoutMs = Number(argv[++i]);
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--headless":
        options.headless = true;
        break;
      case "--headed":
        options.headless = false;
        break;
      case "--help":
        printUsage();
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!options.letter) throw new Error("--letter is required, for example --letter a");
  if (!Number.isFinite(options.from) || !Number.isFinite(options.to)) {
    throw new Error("--from and --to are required and must be integers");
  }
  if (options.from < 1 || options.to < options.from) {
    throw new Error("--from must be >= 1 and --to must be >= --from");
  }
  if (!Number.isFinite(options.batchSize) || options.batchSize < 1) {
    throw new Error("--batch-size must be >= 1");
  }
  return options;
}

function letterButtonName(letter) {
  if (letter === "jk") return "JK";
  if (letter === "wx") return "WX";
  return letter.toUpperCase();
}

async function ensureServer(baseUrl) {
  try {
    const response = await fetch(baseUrl, { signal: AbortSignal.timeout(10_000) });
    if (response.ok) return;
  } catch {
    // fall through to starting the app
  }

  console.log("App is not responding at the expected URL. Starting it automatically...");
  const repoRoot = new URL("..", import.meta.url);
  const child = spawn("npm", ["run", "dev"], {
    cwd: repoRoot,
    stdio: "ignore",
    detached: true,
  });

  child.unref();
  for (let i = 0; i < 60; i += 1) {
    try {
      const response = await fetch(baseUrl, { signal: AbortSignal.timeout(5_000) });
      if (response.ok) return;
    } catch {
      // keep retrying until the dev server becomes available
    }
    await delay(1000);
  }

  throw new Error(`The app did not start successfully at ${baseUrl}`);
}

function getBatches(from, to, batchSize) {
  const batches = [];
  for (let start = from; start <= to; start += batchSize) {
    const end = Math.min(start + batchSize - 1, to);
    batches.push({ start, end });
  }
  return batches;
}

async function clickDetailExtractionIfNeeded(page) {
  const button = page.getByRole("button", { name: /detail pages/i });
  const maybeEnabled = await button.isVisible().catch(() => false);
  if (!maybeEnabled) return;

  const text = (await button.textContent()) ?? "";
  if (!text || text.toLowerCase().includes("complete")) return;

  await button.click();
  await page.waitForFunction(() => {
    const bodies = Array.from(document.querySelectorAll("button"));
    const busyText = bodies.find((el) => (el.textContent ?? "").includes("Details") || (el.textContent ?? "").includes("Reading"));
    return !busyText || !busyText.textContent?.includes("Details") && !busyText.textContent?.includes("Reading");
  }, { timeout: 250000 });
}

async function runRange(page, letter, start, end) {
  const letterName = letterButtonName(letter);
  const letterButton = page.getByRole("button", { name: new RegExp(`^${letterName}$`, "i") });
  await letterButton.click();

  const startInput = page.getByRole("spinbutton", { name: "Start chemical number" });
  const endInput = page.getByRole("spinbutton", { name: "End chemical number" });

  await startInput.fill(String(start));
  await endInput.fill(String(end));

  const extractButton = page.getByRole("button", { name: new RegExp(`^Extract ${letterName} links$|^Extract ${letterName} pages$|^Extract .* links$`, "i") });
  await extractButton.click();

  await page.waitForFunction(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const busyButton = buttons.find((btn) => (btn.textContent ?? "").includes("Reading") || (btn.textContent ?? "").includes("Extracting"));
    if (busyButton) {
      return false;
    }
    return true;
  }, { timeout: DEFAULT_TIMEOUT_MS });

  await page.waitForTimeout(2_000);

  await clickDetailExtractionIfNeeded(page);
}

async function ensureBrowserRuntime() {
  try {
    const browser = await chromium.launch({ headless: true });
    await browser.close();
    return;
  } catch (error) {
    const message = String(error?.message ?? error ?? "");
    const needsBrowserInstall = /Executable doesn't exist|cannot open shared object file|libatk-1\.0\.so\.0|missing shared library|browserType\.launch/i.test(message);
    if (!needsBrowserInstall) {
      throw error;
    }
  }

  console.log("Playwright browser runtime is missing. Installing Chromium dependencies...");
  const result = spawnSync("npx", ["playwright", "install", "--with-deps", "chromium"], {
    stdio: "inherit",
    cwd: new URL("..", import.meta.url),
  });

  if (result.status !== 0) {
    throw new Error("Failed to install the Playwright Chromium runtime for browser automation.");
  }
}

async function run() {
  const options = parseArgs(process.argv.slice(2));
  const batches = getBatches(options.from, options.to, options.batchSize);

  if (options.dryRun) {
    console.log(`Dry run for letter ${options.letter} using ${options.batchSize}-item batches`);
    for (const batch of batches) {
      console.log(`  ${batch.start} - ${batch.end}`);
    }
    return;
  }

  await ensureServer(options.baseUrl);
  await ensureBrowserRuntime();

  const browser = await chromium.launch({ headless: options.headless });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  try {
    await page.goto(options.baseUrl, { waitUntil: "domcontentloaded", timeout: options.timeoutMs });
    await page.waitForLoadState("networkidle", { timeout: options.timeoutMs });

    console.log(`Preparing ${batches.length} batch(es) for letter ${options.letter} from ${options.from} to ${options.to}`);
    for (const [index, batch] of batches.entries()) {
      console.log(`\nBatch ${index + 1}/${batches.length}: ${batch.start} to ${batch.end}`);
      await runRange(page, options.letter, batch.start, batch.end);
      await delay(3_000);
    }

    console.log("\nAll requested batch ranges have completed.");
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error("Batch extraction failed:", error);
  process.exit(1);
});
