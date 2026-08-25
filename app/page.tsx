import Link from "next/link";
import type { Metadata } from "next";
import { getFirstDoc, getNavTree } from "@/lib/content";

export const metadata: Metadata = {
  title: "Marketing Docs",
  description:
    "Documentation for S&M Hub, Aureole Group's sales and marketing operations platform — leads, quotations, orders, events, and reporting.",
};

const FEATURES = [
  {
    tag: "Overview",
    title: "What is S&M Hub",
    body: "Aureole Group's sales and marketing operations platform — the end-to-end commercial pipeline with role-based access and row-level visibility.",
    href: "/docs/introduction",
  },
  {
    tag: "Users",
    title: "User Guide",
    body: "A plain-language manual: sign-in, navigation, every screen, example workflows, and answers to common questions.",
    href: "/docs/user-guide",
  },
  {
    tag: "Developers",
    title: "Developer Guide",
    body: "Local setup, environment variables, the 53-model data model, API reference, tests, and deployment.",
    href: "/docs/developer-guide",
  },
  {
    tag: "Architecture",
    title: "Architecture & diagrams",
    body: "Mermaid diagrams for the system landscape, auth flow, data model, integrations, and deployment.",
    href: "/docs/architecture",
  },
  {
    tag: "Inventory",
    title: "Inventory context",
    body: "What \"inventory\" means in S&M Hub — commercial master data and pipeline records — plus known limitations.",
    href: "/docs/inventory-context",
  },
  {
    tag: "Reference",
    title: "Help book",
    body: "The in-depth help reference covering every screen, from leads and quotations to DSR and administration.",
    href: "/docs/help-book",
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
            S&amp;M Hub · Sales &amp; marketing operations
          </p>

          <h1 className="mt-8 font-display text-display-xl font-normal uppercase tracking-wide2 text-navy">
            <span className="mb-4 block font-display text-display-lg font-normal tracking-wide2">
              <span className="text-blue">S&amp;M</span>-<span className="text-navy">Hub</span>
            </span>
            Documentation
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-stone">
            S&amp;M Hub is a React + FastAPI + PostgreSQL system covering the
            full commercial pipeline: domains and regions, contacts and
            customers, leads and quotations, orders, events, daily reporting,
            and dashboards. This site documents the whole product — from user
            guides to API reference.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {firstDoc && (
              <Link
                href={firstDoc.href}
                className="inline-flex items-center gap-2 rounded-full bg-blue px-7 py-3 text-xs font-semibold uppercase tracking-wider2 text-white transition-colors hover:bg-[#0F47D0]"
              >
                Read docs
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m6 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
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
                  Every page is linked from the sidebar. Start with the
                  introduction and follow the prev/next flow through the set.
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
            Documentation highlights
          </h2>
          <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-stone">
            Jump straight to the most useful pages for the product.
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
                  Open doc
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
