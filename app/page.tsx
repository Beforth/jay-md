import Link from "next/link";
import type { Metadata } from "next";
import { getFirstDoc, getNavTree } from "@/lib/content";

export const metadata: Metadata = {
  title: "Beforth Docs",
  description:
    "A markdown-first documentation framework for Beforth. Drop .md files in /content and the site builds itself.",
};

const FEATURES = [
  {
    tag: "Content",
    title: "Just add markdown",
    body: "Drop a .md or .mdx file into a folder under /content. Routing, sidebar, search and prev/next links generate automatically.",
    href: "/docs/getting-started/introduction",
  },
  {
    tag: "Search",
    title: "Fuzzy search built in",
    body: "Press ⌘K anywhere. A Fuse.js index of every title, description, heading and paragraph keeps discovery instant.",
    href: "/docs/guides/configuration#search",
  },
  {
    tag: "Authoring",
    title: "Callouts & admonitions",
    body: "Note, Tip, Warning and Danger callouts with brand-tinted backgrounds and accent borders — right inside your markdown.",
    href: "/docs/getting-started/introduction#callouts",
  },
  {
    tag: "Code",
    title: "Tabs & code groups",
    body: "Tabbed installation commands and multi-file code samples with deep-navy syntax-highlighted blocks and one-click copy.",
    href: "/docs/getting-started/installation#tabs",
  },
  {
    tag: "Code",
    title: "Highlighted code blocks",
    body: "Shiki-powered syntax highlighting on the Beforth dark theme, with language labels and copy-to-clipboard pills.",
    href: "/docs/getting-started/installation#code-blocks",
  },
  {
    tag: "Layout",
    title: "Auto table of contents",
    body: "H2/H3 headings become a sticky “On this page” rail with scrollspy — plus an automatic Table of Contents for every doc.",
    href: "/docs/guides/configuration#table-of-contents",
  },
];

export default async function Home() {
  const nav = await getNavTree();
  const firstDoc = await getFirstDoc();

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider2 text-navy">
            <span className="h-1.5 w-1.5 rounded-full bg-blue" />
            Beforth Docs · Markdown-first
          </p>

          <h1 className="mt-8 font-display text-display-xl font-normal uppercase tracking-wide2 text-navy">
            Ship banger
            <span className="block text-blue">documentation.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-stone">
            A custom-built docs framework for Beforth. Write plain markdown in{" "}
            <code className="rounded bg-blue-tint px-1.5 py-0.5 text-[0.85em] font-medium text-blue">
              /content
            </code>
            , and the site generates the sidebar, routing, search and table of
            contents for you — no config required.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {firstDoc && (
              <Link
                href={firstDoc.href}
                className="inline-flex items-center gap-2 rounded-full bg-blue px-7 py-3 text-xs font-semibold uppercase tracking-wider2 text-white transition-colors hover:bg-[#0F47D0]"
              >
                Read the docs
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m6 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
            <Link
              href="/docs/getting-started/introduction"
              className="inline-flex items-center gap-2 rounded-full border border-navy bg-navy px-7 py-3 text-xs font-semibold uppercase tracking-wider2 text-white transition-colors hover:bg-[#1C2333]"
            >
              Getting started
            </Link>
          </div>

          <p className="mt-6 text-xs font-normal text-stone">
            Tip: press{" "}
            <kbd className="rounded border border-border bg-white px-1.5 py-0.5 text-[10px]">⌘</kbd>
            <kbd className="rounded border border-border bg-white px-1.5 py-0.5 text-[10px]">K</kbd>{" "}
            to search everything.
          </p>
        </div>
      </section>

      {/* ---------- Docs groups ---------- */}
      {nav.groups.length > 0 && (
        <section className="border-t border-border bg-white/70 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-display-md font-normal uppercase tracking-wide2 text-navy">
                  Explore the docs
                </h2>
                <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-stone">
                  Every folder under /content becomes a section. Start with a
                  group and follow the prev/next flow through the whole set.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {nav.groups.map((group) => (
                <Link
                  key={group.name}
                  href={group.href || "/docs"}
                  className="group flex flex-col rounded-2xl border border-border bg-white p-6 transition-colors hover:border-dot-grid hover:bg-blue-tint/40"
                >
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue bg-blue-tint px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider2 text-blue">
                    {group.label}
                  </span>
                  <h3 className="mt-4 font-display text-display-sm font-normal uppercase tracking-wide2 text-navy transition-colors group-hover:text-blue">
                    {group.children[0]?.title ?? "Start here"}
                  </h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm font-light leading-relaxed text-stone">
                    {group.children[0]?.description ?? `${group.children.length} docs in this section.`}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider2 text-blue">
                    Open section
                    <svg viewBox="0 0 16 16" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="m6 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Features ---------- */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-display-md font-normal uppercase tracking-wide2 text-navy">
            Built in, out of the box
          </h2>
          <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-stone">
            Everything a docs site needs — no plugins to wire up, no config to
            maintain.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group flex flex-col rounded-2xl border border-border bg-white p-6 transition-colors hover:border-dot-grid hover:bg-blue-tint/40"
              >
                <span className="inline-flex w-fit rounded-full border border-border bg-slate-bg px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider2 text-stone">
                  {feature.tag}
                </span>
                <h3 className="mt-4 font-display text-display-sm font-normal uppercase tracking-wide2 text-navy transition-colors group-hover:text-blue">
                  {feature.title}
                </h3>
                <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-stone">
                  {feature.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider2 text-blue">
                  See it live
                  <svg viewBox="0 0 16 16" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="m6 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
