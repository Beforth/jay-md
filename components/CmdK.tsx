"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import type { SearchItem } from "@/lib/types";
import { useUi } from "./ui-context";

const MAX_RESULTS = 8;

/**
 * Command-palette style search dialog (⌘K / Ctrl+K). Fuzzy matching over the
 * build-time search index via Fuse.js.
 */
export function CmdK({ index }: { index: SearchItem[] }) {
  const { searchOpen, openSearch, closeSearch } = useUi();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(index, {
        keys: [
          { name: "title", weight: 0.4 },
          { name: "description", weight: 0.25 },
          { name: "headings", weight: 0.15 },
          { name: "groupLabel", weight: 0.1 },
          { name: "text", weight: 0.1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [index]
  );

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return index.slice(0, MAX_RESULTS);
    return fuse.search(q).slice(0, MAX_RESULTS).map((r) => r.item);
  }, [fuse, query, index]);

  // Global ⌘K / Ctrl+K to open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSearch]);

  // Focus + body scroll lock while open.
  useEffect(() => {
    if (!searchOpen) return;
    setQuery("");
    setActive(0);
    const id = window.setTimeout(() => inputRef.current?.focus(), 20);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  useEffect(() => setActive(0), [query]);

  // Keep the active result visible.
  useEffect(() => {
    const el = resultsRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!searchOpen) return null;

  function goTo(href: string) {
    closeSearch();
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) goTo(item.href);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeSearch();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search docs">
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={closeSearch} />

      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-white">
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-stone" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" />
            <path d="m10.5 10.5 3 3" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search the docs…"
            className="w-full bg-transparent text-[15px] font-light text-navy outline-none placeholder:text-stone"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="shrink-0 rounded-full border border-border bg-slate-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide2 text-stone">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <ul ref={resultsRef} className="rail-scroll max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-4 py-10 text-center">
              <p className="font-display text-2xl uppercase tracking-wide2 text-navy">No results</p>
              <p className="mt-1 text-sm font-light text-stone">
                Try a different keyword — or the full text below.
              </p>
            </li>
          ) : (
            results.map((item, i) => {
              const selected = i === active;
              return (
                <li key={item.slug}>
                  <button
                    type="button"
                    data-index={i}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => goTo(item.href)}
                    className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${
                      selected ? "bg-blue-tint" : "hover:bg-blue-tint/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-navy">{item.title}</span>
                      <span className="shrink-0 rounded-full border border-border bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide2 text-stone">
                        {item.groupLabel}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-0.5 line-clamp-1 text-[13px] font-light text-stone">
                        {item.description}
                      </p>
                    )}
                  </button>
                </li>
              );
            })
          )}
        </ul>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-border bg-slate-bg/60 px-5 py-2.5 text-[11px] font-normal text-stone">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-white px-1.5 py-0.5 text-[10px]">↑</kbd>
            <kbd className="rounded border border-border bg-white px-1.5 py-0.5 text-[10px]">↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-white px-1.5 py-0.5 text-[10px]">↵</kbd>
            open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-white px-1.5 py-0.5 text-[10px]">esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
