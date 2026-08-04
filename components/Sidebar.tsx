"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { GroupNode } from "@/lib/types";

function isActive(href: string, pathname: string): boolean {
  return href === pathname;
}

/**
 * Left navigation. Active item gets blue-tint background + blue text (Inter
 * Medium); inactive items are stone (Inter Regular); hover adds a blue-tint wash.
 */
export function Sidebar({ groups, className = "" }: { groups: GroupNode[]; className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const group of groups) {
      initial[group.name] = group.children.some((doc) => isActive(doc.href, pathname));
    }
    return initial;
  });

  useEffect(() => {
    setOpen((prev) => {
      const next = { ...prev };
      for (const group of groups) {
        if (group.children.some((doc) => isActive(doc.href, pathname))) {
          next[group.name] = true;
        }
      }
      return next;
    });
  }, [pathname, groups]);

  return (
    <nav className={className} aria-label="Docs navigation">
      {groups.map((group) => {
        const isOpen = open[group.name];
        return (
          <div key={group.name} className="mb-6">
            <button
              type="button"
              onClick={() => setOpen((prev) => ({ ...prev, [group.name]: !prev[group.name] }))}
              className="group/label flex w-full items-center justify-between gap-2 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider2 text-stone transition-colors group-hover/label:text-navy">
                {group.label}
              </span>
              <svg
                viewBox="0 0 16 16"
                className={`h-3 w-3 shrink-0 text-stone transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                aria-hidden="true"
              >
                <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {isOpen && (
              <ul className="mt-2.5 space-y-0.5">
                {group.children.map((doc) => {
                  const active = isActive(doc.href, pathname);
                  return (
                    <li key={doc.slug}>
                      <Link
                        href={doc.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center rounded-full px-3 py-1.5 text-sm transition-colors ${
                          active
                            ? "bg-blue-tint font-medium text-blue"
                            : "font-normal text-stone hover:bg-blue-tint hover:text-navy"
                        }`}
                      >
                        <span className="truncate">{doc.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
