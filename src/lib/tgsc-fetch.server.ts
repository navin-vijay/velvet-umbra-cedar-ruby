import {
  TGSC_ORIGIN,
  listingUrl,
  parseIngredientHtml,
  parseListingHtml,
  type ExtractResult,
  type IngredientDetail,
  type IngredientLink,
  type LetterKey,
} from "./tgsc";

const cache = new Map<LetterKey, ExtractResult>();
const detailCache = new Map<string, IngredientDetail>();

const requestHeaders = {
  Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.thegoodscentscompany.com/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
};

const REQUEST_BACKOFF_MS = 1_000;
const REQUEST_DELAY_MS = 750;
let requestQueue: Promise<void> = Promise.resolve();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: URL | string,
  init: RequestInit,
  attempt = 0,
): Promise<Response> {
  const response = await fetch(url, init);
  if ((response.status === 429 || response.status === 503 || response.status === 403) && attempt < 5) {
    const retryAfter = response.headers.get("Retry-After");
    let waitMs = REQUEST_BACKOFF_MS * 2 ** attempt;
    if (retryAfter) {
      const retrySeconds = Number.parseFloat(retryAfter);
      if (Number.isFinite(retrySeconds)) {
        waitMs = retrySeconds * 1_000;
      }
    }
    const jitter = Math.round(Math.random() * 1_000);
    await sleep(Math.max(waitMs + jitter, REQUEST_DELAY_MS));
    return fetchWithRetry(url, init, attempt + 1);
  }
  return response;
}

async function throttledFetch(url: URL | string, init: RequestInit): Promise<Response> {
  const previous = requestQueue;
  let release!: () => void;
  requestQueue = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous;
  try {
    await sleep(REQUEST_DELAY_MS);
    return await fetchWithRetry(url, init);
  } finally {
    release();
  }
}

export async function loadLetter(letter: LetterKey): Promise<ExtractResult> {
  const cached = cache.get(letter);
  if (cached) return cached;

  const sourceUrl = listingUrl(letter);
  const response = await throttledFetch(sourceUrl, {
    headers: requestHeaders,
    signal: AbortSignal.timeout(25_000),
  });

  if (!response.ok) {
    throw new Error(`TGSC returned ${response.status} for ${sourceUrl}`);
  }

  const html = await response.text();
  const result = parseListingHtml(html, letter);
  if (result.ingredients.length === 0) {
    throw new Error(`No ingredient links found on ${sourceUrl}`);
  }
  cache.set(letter, result);
  return result;
}

export async function loadIngredientDetail(item: IngredientLink): Promise<IngredientDetail> {
  const cached = detailCache.get(item.path);
  if (cached) return { ...cached, ...item };

  const sourceUrl = new URL(item.path, TGSC_ORIGIN);
  const response = await throttledFetch(sourceUrl, {
    headers: requestHeaders,
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    throw new Error(`TGSC returned ${response.status} for ${sourceUrl.href}`);
  }

  const html = await response.text();
  if (!/<div\b[^>]*class=["'][^"']*\bsectionclass\b/i.test(html)) {
    throw new Error(`No detail sections found on ${sourceUrl.href}`);
  }

  const detail = parseIngredientHtml(html, { ...item, url: sourceUrl.href });
  detailCache.set(item.path, detail);
  return detail;
}
