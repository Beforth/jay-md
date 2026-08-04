"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/types";

/**
 * Sticky "On this page" rail. Scrollspy highlights the h2/h3 currently in view.
 * Rendered only on large screens (see usage in the docs page).
 */
export function Toc({ headings, className = "" }: { headings: Heading[]; className?: string }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return;

    setActiveId(headings[0]?.id ?? null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-90px 0px -65% 0px", threshold: 0 }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className={className} aria-label="On this page">
      <p className="text-[11px] font-semibold uppercase tracking-wider2 text-stone">On this page</p>
      <ul className="mt-3 space-y-1 border-l border-border pl-3 text-sm">
        {headings.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block py-1 leading-snug transition-colors ${
                  heading.level === 3 ? "pl-3" : ""
                } ${active ? "font-medium text-blue" : "font-normal text-stone hover:text-navy"}`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
