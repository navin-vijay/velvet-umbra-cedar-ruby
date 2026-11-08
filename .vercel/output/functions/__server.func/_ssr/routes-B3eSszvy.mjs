import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { r as isSuccessfulNewExcelCheckpoint } from "./excel-checkpoint-D4xESMik.mjs";
import { i as listingUrl, r as isLetterKey, t as LETTER_PAGES } from "./tgsc-B-UjHrEs.mjs";
import { a as FileSpreadsheet, c as Copy, d as Check, i as Link2, l as ChevronRight, n as Search, o as ExternalLink, r as LoaderCircle, s as Download, u as ChevronLeft } from "../_libs/lucide-react.mjs";
import { n as displayName, r as mergeIngredients } from "./router-BfBV9kCm.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B3eSszvy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var extractLetter = createServerFn({ method: "POST" }).validator((input) => {
	const letter = input.letter.trim().toLowerCase();
	if (!isLetterKey(letter)) throw new Error(`Unknown listing page: ${input.letter}`);
	return { letter };
}).handler(createSsrRpc("1dc521f17c4a7f82bbfa0a1c2e19e0ca29afd62a3e757622ae4f5b3fe552dc5e"));
var loadCatalogPage = createServerFn({ method: "POST" }).validator((input) => {
	if (!Number.isSafeInteger(input.offset) || input.offset < 0) throw new Error("Invalid catalog page offset.");
	return { offset: input.offset };
}).handler(createSsrRpc("f4b155c1d41c5d127d0efdd0aadeee67ff1ac39e7fc00760efbb79b704c4c5a3"));
var extractDetailPage = createServerFn({ method: "POST" }).validator((input) => {
	if (!/^\/data\/[a-z0-9_-]+\.html$/i.test(input.path)) throw new Error("Invalid ingredient detail path.");
	return { path: input.path };
}).handler(createSsrRpc("1655da6959b6a57bf024f3a4c843c1d0ae3c706a6fc90f23195229a952006422"));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[0.6875rem] font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-accent-soft text-accent",
		outline: "border border-line text-muted",
		ink: "bg-ink text-accent-fg"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,color,border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-accent-soft text-accent hover:bg-line",
			outline: "border border-line bg-bg-elevated text-fg hover:bg-paper",
			ghost: "text-fg hover:bg-paper",
			danger: "bg-danger text-accent-fg hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-[0.8125rem]",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md border border-line bg-bg-elevated px-3 text-sm text-fg shadow-none transition-[border-color,box-shadow] duration-150 placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var PAGE_SIZE = 40;
function mergeResults(results) {
	const pageLinks = [];
	const seenUrls = /* @__PURE__ */ new Set();
	for (const result of results) for (const link of result.pageLinks) {
		if (seenUrls.has(link.url)) continue;
		seenUrls.add(link.url);
		pageLinks.push(link);
	}
	return {
		letters: results.map((result) => result.letter),
		ingredients: mergeIngredients(results.map((result) => result.ingredients)),
		pageLinks,
		extractedAt: results.at(-1)?.extractedAt ?? (/* @__PURE__ */ new Date()).toISOString()
	};
}
function mergeCatalog(existing, incoming) {
	if (!existing) return incoming;
	const pageLinks = new Map(existing.pageLinks.map((link) => [link.url, link]));
	for (const link of incoming.pageLinks) pageLinks.set(link.url, link);
	return {
		letters: [.../* @__PURE__ */ new Set([...existing.letters, ...incoming.letters])],
		ingredients: mergeIngredients([existing.ingredients, incoming.ingredients]),
		pageLinks: [...pageLinks.values()],
		extractedAt: incoming.extractedAt
	};
}
async function loadCatalogFromDatabase() {
	const ingredients = [];
	const details = {};
	const failures = [];
	let count = 0;
	let offset = 0;
	let letters = [];
	let pageLinks = [];
	let extractedAt = "";
	let excelCheckpoint = {
		completedCount: 0,
		updatedAt: null,
		lastError: null
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
			if (detailStatus === "failed") failures.push({
				path: ingredient.path,
				error: detailError ?? "Detail extraction failed."
			});
		}
		offset += result.items.length;
	} while (offset < count);
	return {
		catalog: ingredients.length > 0 ? {
			letters,
			ingredients,
			pageLinks,
			extractedAt
		} : null,
		details,
		failures,
		excelCheckpoint
	};
}
function letterLabel(letter) {
	if (letter === "jk") return "J / K";
	if (letter === "wx") return "W / X";
	return letter.toUpperCase();
}
function ScentIndex() {
	const [selected, setSelected] = (0, import_react.useState)("a");
	const [allLetters, setAllLetters] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [detailsBusy, setDetailsBusy] = (0, import_react.useState)(false);
	const [databaseReady, setDatabaseReady] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(null);
	const [detailProgress, setDetailProgress] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [catalog, setCatalog] = (0, import_react.useState)(null);
	const [details, setDetails] = (0, import_react.useState)({});
	const [detailFailures, setDetailFailures] = (0, import_react.useState)([]);
	const [excelCheckpoint, setExcelCheckpoint] = (0, import_react.useState)({
		completedCount: 0,
		updatedAt: null,
		lastError: null
	});
	const [query, setQuery] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const [copiedKey, setCopiedKey] = (0, import_react.useState)(null);
	const [navOpen, setNavOpen] = (0, import_react.useState)(false);
	const abortRef = (0, import_react.useRef)(false);
	const excelCheckpointCountRef = (0, import_react.useRef)(0);
	const runInitialExtractRef = (0, import_react.useRef)(() => {});
	const filtered = (0, import_react.useMemo)(() => {
		if (!catalog) return [];
		const q = query.trim().toLowerCase();
		if (!q) return catalog.ingredients;
		return catalog.ingredients.filter((item) => {
			return displayName(item).toLowerCase().includes(q) || item.url.toLowerCase().includes(q) || item.cas.toLowerCase().includes(q) || item.uses.toLowerCase().includes(q) || item.kind.toLowerCase().includes(q);
		});
	}, [catalog, query]);
	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(page, pageCount);
	const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
	const detailCount = catalog ? catalog.ingredients.reduce((count, item) => count + (details[item.path] ? 1 : 0), 0) : 0;
	const pendingDetailCount = catalog ? catalog.ingredients.filter((item) => !details[item.path]).length : 0;
	const currentFailures = catalog ? detailFailures.filter((failure) => catalog.ingredients.some((item) => item.path === failure.path)) : [];
	(0, import_react.useEffect)(() => {
		let active = true;
		loadCatalogFromDatabase().then((saved) => {
			if (!active) return;
			setCatalog(saved.catalog);
			setDetails(saved.details);
			setDetailFailures(saved.failures);
			setExcelCheckpoint(saved.excelCheckpoint);
			excelCheckpointCountRef.current = saved.excelCheckpoint.completedCount;
			setDatabaseReady(true);
			if (!saved.catalog) runInitialExtractRef.current();
		}).catch((err) => {
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
	async function runExtract(letters) {
		abortRef.current = false;
		setBusy(true);
		setError(null);
		setProgress({
			letter: letters[0] ?? "a",
			done: 0,
			total: letters.length
		});
		let mergedCatalog = catalog;
		try {
			for (let i = 0; i < letters.length; i += 1) {
				if (abortRef.current) break;
				const letter = letters[i];
				setProgress({
					letter,
					done: i,
					total: letters.length
				});
				const result = await extractLetter({ data: { letter } });
				mergedCatalog = mergeCatalog(mergedCatalog, mergeResults([result]));
				setCatalog(mergedCatalog);
				setPage(1);
			}
			if (!mergedCatalog) setError("Extraction was cancelled.");
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
		runExtract(["a"]);
	};
	function onExtract() {
		runExtract(allLetters ? [...LETTER_PAGES] : [selected]);
	}
	async function runDetailExtract() {
		if (!catalog || detailsBusy || !databaseReady) return;
		const queue = catalog.ingredients.filter((item) => !details[item.path]);
		if (queue.length === 0) {
			toast.success("All ingredient detail pages are already extracted.");
			return;
		}
		abortRef.current = false;
		setDetailsBusy(true);
		setError(null);
		setDetailProgress({
			done: 0,
			total: queue.length
		});
		const failedPaths = /* @__PURE__ */ new Set();
		let done = 0;
		try {
			for (let offset = 0; offset < queue.length; offset += 1) {
				if (abortRef.current) break;
				const batch = queue.slice(offset, offset + 1);
				setDetailProgress({
					done,
					total: queue.length
				});
				let result;
				try {
					result = await extractDetailPage({ data: { path: batch[0].path } });
				} catch (err) {
					const message = err instanceof Error ? err.message : "Detail batch failed.";
					result = {
						path: batch[0].path,
						status: "failed",
						error: message
					};
				}
				if (result.excelCheckpoint) {
					setExcelCheckpoint(result.excelCheckpoint);
					const previousCheckpoint = excelCheckpointCountRef.current;
					excelCheckpointCountRef.current = result.excelCheckpoint.completedCount;
					if (isSuccessfulNewExcelCheckpoint(previousCheckpoint, result.excelCheckpoint)) await downloadExcelCheckpointAutomatically(result.excelCheckpoint.completedCount);
				}
				if (result.excelCheckpointError) setError(`Page saved, but Excel checkpoint creation failed: ${result.excelCheckpointError}`);
				setDetails((current) => ({
					...current,
					[result.path]: result.status === "complete"
				}));
				if (result.status === "failed") failedPaths.add(result.path);
				setDetailFailures((current) => {
					const next = new Map(current.map((failure) => [failure.path, failure]));
					if (result.status === "complete") next.delete(result.path);
					else next.set(result.path, {
						path: result.path,
						error: result.error ?? "Detail extraction failed."
					});
					return [...next.values()];
				});
				done += batch.length;
				setDetailProgress({
					done,
					total: queue.length
				});
			}
			const skipped = queue.length - done;
			if (failedPaths.size > 0) toast.error(`${failedPaths.size} detail pages failed. You can retry them; failures are listed below.`);
			else if (skipped > 0) toast.message(`Paused after ${done.toLocaleString()} detail pages.`);
			else toast.success(`Extracted ${done.toLocaleString()} ingredient detail pages.`);
		} catch (err) {
			const message = err instanceof Error ? `Could not save extraction progress: ${err.message}` : "Could not save extraction progress.";
			setError(message);
			toast.error(message);
		} finally {
			setDetailsBusy(false);
			setDetailProgress(null);
		}
	}
	async function copyText(label, text, key) {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedKey(key ?? label);
			toast.success(`Copied ${label}`);
			window.setTimeout(() => setCopiedKey(null), 1400);
		} catch {
			toast.error("Clipboard is blocked — use the file preview below");
		}
	}
	async function downloadExcelCheckpointAutomatically(completedCount) {
		try {
			const response = await fetch("/api/export?format=xlsx");
			if (!response.ok) throw new Error(`Workbook download failed (${response.status}).`);
			const objectUrl = URL.createObjectURL(await response.blob());
			const anchor = document.createElement("a");
			anchor.href = objectUrl;
			anchor.download = "A-Z Extracted.xlsx";
			document.body.appendChild(anchor);
			anchor.click();
			anchor.remove();
			window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1e3);
			toast.success(`Automatically downloading A-Z Extracted.xlsx at ${completedCount.toLocaleString()} completed pages.`);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Could not automatically download the Excel checkpoint.";
			toast.error(`${message} Use Download Excel to retry.`);
		}
	}
	const headingLetter = allLetters ? "A–Z" : letterLabel(selected);
	function downloadAll(format) {
		const anchor = document.createElement("a");
		anchor.href = `/api/export?format=${format}`;
		anchor.download = format === "xlsx" ? "A-Z Extracted.xlsx" : `tgsc-perfume-database.${format}`;
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		toast.success(format === "xlsx" ? "Downloading the latest Excel checkpoint" : `Preparing the perfume database ${format.toUpperCase()} export`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			position: "bottom-center",
			toastOptions: { className: "font-sans border-line bg-bg-elevated text-fg" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto min-h-dvh max-w-7xl md:grid md:grid-cols-[20rem_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "border-b border-line bg-ink text-accent-fg md:sticky md:top-0 md:h-dvh md:overflow-y-auto md:border-r md:border-b-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full flex-col gap-8 px-6 py-7 sm:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-widest text-accent-fg/55 uppercase",
								children: "TGSC catalog"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display mt-3 text-4xl leading-tight tracking-tight",
								children: "Scent Index"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-xs text-sm leading-relaxed text-accent-fg/70",
								children: "Pull every ingredient HTML page from The Good Scents Company listings."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-widest text-accent-fg/50 uppercase",
								children: "Listing"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-xs text-accent-fg/70 underline-offset-4 hover:text-accent-fg hover:underline",
								onClick: () => setAllLetters((value) => !value),
								children: allLetters ? "Single letter" : "All letters"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-8 gap-1.5",
							children: LETTER_PAGES.map((letter) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: busy || detailsBusy,
									onClick: () => {
										setAllLetters(false);
										setSelected(letter);
									},
									className: cn("h-10 rounded-md text-xs font-medium tracking-wide transition-colors duration-150", !allLetters && selected === letter ? "bg-accent-fg text-ink" : "bg-accent-fg/8 text-accent-fg/80 hover:bg-accent-fg/14", allLetters && "bg-accent-fg/14 text-accent-fg"),
									children: letter.toUpperCase()
								}, letter);
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 md:mt-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs leading-relaxed break-all text-accent-fg/45",
									children: allLetters ? "allprod-a.html … allprod-z.html" : `thegoodscentscompany.com/allprod-${selected}.html`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "lg",
									disabled: !databaseReady || busy || detailsBusy,
									onClick: onExtract,
									className: "h-12 w-full rounded-lg bg-accent-fg text-ink hover:bg-accent-fg/90",
									children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, {}), busy ? progress ? `Reading ${progress.letter.toUpperCase()} · ${progress.done + 1}/${progress.total}` : "Extracting" : allLetters ? "Extract A–Z links" : `Extract ${headingLetter} links`]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "lg",
									variant: "outline",
									disabled: !databaseReady || !catalog || busy || detailsBusy || pendingDetailCount === 0,
									onClick: () => void runDetailExtract(),
									className: "h-12 w-full rounded-lg border-accent-fg/30 text-accent-fg hover:bg-accent-fg/10",
									children: [detailsBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), detailsBusy && detailProgress ? `Details · ${detailProgress.done.toLocaleString()}/${detailProgress.total.toLocaleString()}` : pendingDetailCount > 0 ? `${detailCount > 0 ? "Resume" : "Extract"} ${pendingDetailCount.toLocaleString()} detail pages` : "Detail pages complete"]
								}),
								busy && progress && progress.total > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-center text-xs text-accent-fg/60 hover:text-accent-fg",
									onClick: () => {
										abortRef.current = true;
									},
									children: "Stop after this page"
								}) : null,
								detailsBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-center text-xs text-accent-fg/60 hover:text-accent-fg",
									onClick: () => {
										abortRef.current = true;
									},
									children: "Stop after this page"
								}) : null
							]
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex flex-col gap-5 border-b border-line pb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-end justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-widest text-muted uppercase",
								children: "All ingredients listing"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-display mt-1 text-3xl tracking-tight text-fg",
								children: ["Starting with ", headingLetter]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Ingredient pages",
										value: catalog ? catalog.ingredients.length.toLocaleString() : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Other page links",
										value: catalog ? catalog.pageLinks.length.toLocaleString() : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Detail pages",
										value: catalog ? `${detailCount.toLocaleString()} / ${catalog.ingredients.length.toLocaleString()}` : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Excel saved",
										value: excelCheckpoint.completedCount.toLocaleString()
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 md:flex-row md:items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: query,
									onChange: (event) => {
										setQuery(event.target.value);
										setPage(1);
									},
									placeholder: "Filter by name, CAS, use, or URL",
									className: "h-11 rounded-lg pl-10",
									"aria-label": "Filter extracted links"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										disabled: !databaseReady || !catalog || busy || detailsBusy,
										onClick: () => downloadAll("csv"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Database CSV"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										disabled: !databaseReady || !catalog || busy || detailsBusy,
										onClick: () => downloadAll("json"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Database JSON"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										disabled: excelCheckpoint.completedCount === 0,
										onClick: () => downloadAll("xlsx"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, {}), "Download Excel"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "secondary",
										size: "sm",
										disabled: !catalog,
										onClick: () => catalog && copyText(`${catalog.ingredients.length} URLs`, catalog.ingredients.map((item) => item.url).join("\n"), "all-urls"),
										children: [copiedKey === "all-urls" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), "Copy URLs"]
									})
								]
							})]
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger",
						children: error
					}) : null,
					catalog ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 rounded-xl border border-line bg-bg-elevated px-4 py-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-medium",
								children: [
									"Perfume database detail extraction: ",
									detailCount.toLocaleString(),
									" of",
									" ",
									catalog.ingredients.length.toLocaleString(),
									" pages complete"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-muted",
								children: "Each record includes the source page’s sections and table data—such as identifiers, physical and odor information, safety, uses, references, and suppliers when present. Empty or unavailable source sections are preserved too. Exports include extracted records only; the JSON lists failed and not-yet-extracted pages."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-muted",
								children: "Completed pages are saved to the shared perfume database as extraction runs. If a request is interrupted, restart the detail extraction to continue with pending or failed pages."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-muted",
								children: "Once the GitHub Actions worker is configured, it resumes in scheduled batches even while this page and the Codespace are closed. It saves workbook checkpoints in Neon for download when you return."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-muted",
								children: excelCheckpoint.completedCount > 0 ? `A-Z Extracted.xlsx has a checkpoint at ${excelCheckpoint.completedCount.toLocaleString()} completed detail pages. It downloads automatically at each next 250-page mark and when extraction finishes.` : `A-Z Extracted.xlsx is first created at 250 completed detail pages, then downloads automatically after every next 250 pages and when extraction finishes.`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-muted",
								children: "Your browser may ask once to allow multiple automatic downloads."
							}),
							excelCheckpoint.lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-danger",
								children: ["Latest Excel checkpoint failed: ", excelCheckpoint.lastError]
							}) : null
						]
					}) : null,
					currentFailures.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-4 rounded-xl border border-danger/20 bg-danger/5 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-semibold",
								children: [currentFailures.length.toLocaleString(), " detail pages need retry"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-2 text-xs text-muted",
								children: currentFailures.slice(0, 8).map((failure) => {
									const item = catalog?.ingredients.find((entry) => entry.path === failure.path);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "break-words",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-fg",
												children: item ? displayName(item) : failure.path
											}),
											" — ",
											failure.error
										]
									}, failure.path);
								})
							}),
							currentFailures.length > 8 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: "Remaining failures are included in the database JSON export."
							}) : null
						]
					}) : null,
					busy && !catalog ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { letter: progress?.letter ?? "a" }) : catalog ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 overflow-hidden rounded-xl border border-line bg-bg-elevated",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden gap-3 border-b border-line px-4 py-3 text-xs font-medium tracking-wider text-subtle uppercase md:grid md:grid-cols-12",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "md:col-span-5",
										children: "Ingredient"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "md:col-span-3",
										children: "Use"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "md:col-span-2",
										children: "CAS"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-right md:col-span-2",
										children: "HTML link"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "px-4 py-12 text-center text-sm text-muted",
								children: "No ingredients match that filter."
							}) : visible.map((item) => {
								const label = displayName(item);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "grid gap-2 border-b border-line px-4 py-3 last:border-b-0 md:grid-cols-12 md:items-center md:gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 md:col-span-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "uppercase",
													children: item.kind
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: item.url,
													target: "_blank",
													rel: "noreferrer",
													className: "truncate text-sm font-medium text-accent hover:underline",
													children: label
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 truncate font-mono text-xs text-subtle md:hidden",
												children: item.url
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm text-muted md:col-span-3",
											children: item.uses || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-xs text-fg tabular-nums md:col-span-2",
											children: item.cas || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1 md:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-fg",
												onClick: () => copyText("link", item.url, item.path),
												"aria-label": `Copy ${label}`,
												children: copiedKey === item.path ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: item.url,
												target: "_blank",
												rel: "noreferrer",
												className: "inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-fg",
												"aria-label": `Open ${label}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })
											})]
										})
									]
								}, `${item.letter}-${item.path}`);
							}) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									"Showing",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-fg tabular-nums",
										children: [
											filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1,
											"–",
											Math.min(safePage * PAGE_SIZE, filtered.length)
										]
									}),
									" ",
									"of ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-fg tabular-nums",
										children: filtered.length
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "icon",
										className: "size-11",
										disabled: safePage <= 1,
										onClick: () => setPage((value) => Math.max(1, value - 1)),
										"aria-label": "Previous page",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "w-16 text-center text-sm tabular-nums",
										children: [
											safePage,
											" / ",
											pageCount
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "icon",
										className: "size-11",
										disabled: safePage >= pageCount,
										onClick: () => setPage((value) => Math.min(pageCount, value + 1)),
										"aria-label": "Next page",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex w-full items-center justify-between rounded-xl border border-line bg-bg-elevated px-4 py-3 text-left",
								onClick: () => setNavOpen((value) => !value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: "Other HTML links on these pages"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 text-sm text-muted",
									children: [catalog.pageLinks.length, " nav and category URLs"]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-accent",
									children: navOpen ? "Hide" : "Show"
								})]
							}), navOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-bg-elevated",
								children: catalog.pageLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between gap-3 px-4 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-medium",
											children: link.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate font-mono text-xs text-subtle",
											children: link.url
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: link.url,
										target: "_blank",
										rel: "noreferrer",
										className: "inline-flex size-10 shrink-0 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-fg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })
									})]
								}, link.url))
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-8 mb-4 text-xs text-subtle",
							children: [
								"Source",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									className: "text-accent hover:underline",
									href: listingUrl(catalog.letters[0] ?? "a"),
									target: "_blank",
									rel: "noreferrer",
									children: [
										"thegoodscentscompany.com/allprod-",
										catalog.letters[0] ?? "a",
										".html"
									]
								}),
								". Listing and ingredient detail data are read live from TGSC. Detail exports include every captured section, table cell, and linked reference."
							]
						})
					] }) : null
				]
			})]
		})]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-line bg-bg-elevated px-4 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-wider text-subtle uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display mt-0.5 text-xl tabular-nums",
			children: value
		})]
	});
}
function LoadingState({ letter }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center gap-3 text-sm text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-accent" }),
				"Reading allprod-",
				letter,
				".html and collecting ingredient page links"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl border border-line bg-bg-elevated",
			children: Array.from({ length: 8 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4 border-b border-line px-4 py-4 last:border-b-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-48 animate-pulse rounded bg-paper" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden h-4 flex-1 animate-pulse rounded bg-paper md:block" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-20 animate-pulse rounded bg-paper" })
				]
			}, index))
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScentIndex, {});
}
//#endregion
export { Home as component };
