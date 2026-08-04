import Link from "next/link";
import type { DocNode } from "@/lib/types";

export function Pagination({ prev, next }: { prev: DocNode | null; next: DocNode | null }) {
  if (!prev && !next) return null;

  return (
    <div className="mt-16 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-1 flex-col rounded-2xl border border-border bg-white p-5 transition-colors hover:border-dot-grid hover:bg-blue-tint sm:max-w-[48%]"
        >
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider2 text-stone transition-colors group-hover:text-blue">
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M10.5 3 5.5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </span>
          <span className="mt-1.5 text-sm font-medium text-navy transition-colors group-hover:text-blue">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block sm:flex-1" />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex flex-1 flex-col rounded-2xl border border-border bg-white p-5 text-left transition-colors hover:border-dot-grid hover:bg-blue-tint sm:max-w-[48%] sm:text-right"
        >
          <span className="flex items-center justify-start gap-1.5 text-[11px] font-semibold uppercase tracking-wider2 text-stone transition-colors group-hover:text-blue sm:justify-end">
            Next
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m5.5 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="mt-1.5 text-sm font-medium text-navy transition-colors group-hover:text-blue">
            {next.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block sm:flex-1" />
      )}
    </div>
  );
}
