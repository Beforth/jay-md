"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUi } from "./ui-context";
import { BMark, Wordmark } from "./Logo";

export function Navbar() {
  const { openSearch, toggleSidebar, sidebarOpen } = useUi();
  const pathname = usePathname();
  const onDocs = pathname.startsWith("/docs");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-slate-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-3 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Beforth home">
          <span className="sm:hidden">
            <BMark />
          </span>
          <span className="hidden sm:block">
            <Wordmark />
          </span>
        </Link>

        <div className="flex-1" />

        {/* Search pill */}
        <button
          type="button"
          onClick={openSearch}
          className="group flex items-center gap-2 rounded-full border border-border bg-white py-2 pl-4 pr-2 text-left transition-colors hover:border-dot-grid hover:bg-blue-tint/60 sm:w-64"
          aria-label="Open search"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-stone" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" />
            <path d="m10.5 10.5 3 3" strokeLinecap="round" />
          </svg>
          <span className="hidden flex-1 truncate text-sm font-normal text-stone sm:block">Search docs</span>
          <kbd className="hidden rounded-full border border-border bg-slate-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide2 text-stone sm:inline-block">
            ⌘K
          </kbd>
        </button>

        {/* Mobile hamburger — only on docs pages (where the sidebar exists) */}
        {onDocs && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={sidebarOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-navy transition-colors hover:bg-blue-tint lg:hidden"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              {sidebarOpen ? (
                <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" strokeLinecap="round" />
              ) : (
                <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h7" strokeLinecap="round" />
              )}
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
