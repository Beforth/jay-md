"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUi } from "./ui-context";
import { Sidebar } from "./Sidebar";
import type { GroupNode } from "@/lib/types";

/**
 * Slide-in navigation drawer for mobile / tablet. Wired to the navbar
 * hamburger via the shared UiContext.
 */
export function MobileSidebar({ groups }: { groups: GroupNode[] }) {
  const { sidebarOpen, closeSidebar } = useUi();
  const pathname = usePathname();

  // Close on route change.
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!sidebarOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sidebarOpen, closeSidebar]);

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!sidebarOpen}
    >
      <div
        className={`absolute inset-0 bg-navy/30 backdrop-blur-sm transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeSidebar}
      />
      <aside
        className={`rail-scroll absolute left-0 top-0 h-full w-72 max-w-[85vw] overflow-y-auto bg-slate-bg p-5 shadow-none transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider2 text-stone">
            Navigation
          </span>
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close navigation"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-navy transition-colors hover:bg-blue-tint"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <Sidebar groups={groups} />
      </aside>
    </div>
  );
}
