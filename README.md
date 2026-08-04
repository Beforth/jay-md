
Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and MDX.

```
content/getting-started/introduction.md  →  /docs/getting-started/introduction
```

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static generation + type-safe build
npm run start    # serve the production build
```

## Adding a doc (the whole workflow)

1. Create a folder under `content/` (each folder = a **group** in the sidebar).
2. Drop in a `.md` or `.mdx` file with frontmatter:

```md
---
title: My Page
description: Short description shown in search and page headers.
order: 1
tags: [Guide]
---

Write markdown here. Headings, code, tables, and callouts all work.
```

That's it. The page appears at `/docs/<folder>/<filename>`, in the sidebar,
in search, and gets prev/next links chained to its neighbours.

### Frontmatter reference

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | Yes | Page header, sidebar, search, browser tab |
| `description` | string | No | Search snippet + Open Graph description |
| `order` | number | No | Sort key within its group |
| `tags` | string[] | No | Pill badges under the page title |
| `group` | string | No | Overrides the folder-derived group |
| `slug` | string | No | Overrides the route (e.g. `slug: install`) |

## Sidebar ordering

Order is resolved per group in this priority order:

1. **`_meta.json`** — `{ "order": ["introduction", "installation"], "labels": { "introduction": "Intro" } }`
   placed in the group folder. `order` entries match a page by filename, slug, or title.
2. **Frontmatter `order`** — numeric, sorts within the group.
3. **Alphabetical** — by title.

Groups themselves are ordered by the **root** `content/_meta.json`:

```json
{
  "order": ["getting-started", "guides"],
  "labels": { "getting-started": "Getting Started" }
}
```

`_meta.yaml` / `meta.yaml` / `meta.json` are accepted too. Without any meta,
labels are humanized from folder names and everything sorts alphabetically.

## Built-in MDX components

Available in any file (plain `.md` works too — everything is compiled as MDX):

### Callout

```mdx
<Callout type="note" title="Optional title">
Context that shouldn't break the flow.
</Callout>
```

`type` ∈ `note` | `tip` | `warning` | `danger`. Renders a tinted panel with a
brand accent border. (Warning/danger use semantic tints for clarity.)

### Tabs

```mdx
<Tabs>
  <Tab label="npm">…</Tab>
  <Tab label="pnpm">…</Tab>
</Tabs>
```

`defaultValue` sets the initially active tab.

### CodeGroup

```mdx
<CodeGroup>
  <Tab label="content.ts">```ts …```</Tab>
  <Tab label="page.tsx">```tsx …```</Tab>
</CodeGroup>
```

Tabbed panels with a filename-style label. Plain fenced code blocks already get
Shiki highlighting, a language label, and a copy-to-clipboard button — no
component needed:

````md
```ts
const doc = await getDocPage(slug);
```
````

## Search

Press **⌘K** / **Ctrl+K** (or the pill in the navbar). The index is built from
every page's title, description, headings, and body text at build time and
fuzzy-matched client-side with Fuse.js.

## Structure

```
app/          Routes: landing page, /docs redirect, /docs/[...slug], 404
components/   Navbar, Sidebar, TOC, Footer, CmdK, MDX component set
lib/          The framework: content loader, meta parser, headings, search, MDX pipeline
content/      ← YOUR DOCS. Only this folder needs to change.
public/logo/  Reserved for Beforth wordmark / B-mark PNGs
```

## Framework / content separation

Everything reusable lives in `app/`, `components/`, and `lib/`. Fork the repo,
delete the example files from `content/`, and drop in your own — nothing else
changes.

Key files:

- `lib/content.ts` — walks `content/`, parses frontmatter, builds the nav tree,
  search index, and prev/next links (cached per build).
- `lib/mdx.ts` — shared remark/rehype pipeline + the MDX component map.
- `lib/headings.ts` — extracts h2/h3 + plain text; ids match `rehype-slug`.
- `lib/meta.ts` — `_meta.json`/YAML parsing and ordering.
- `tailwind.config.ts` — the full Beforth palette and type tokens.

## Theming

Colors and fonts are registered in `tailwind.config.ts` and
`app/layout.tsx` (via `next/font/google`):

- **Bebas Neue** — display headings only (H1/H2/section headers), always uppercase.
- **Inter** (Light 300 body, Regular 400 nav, Medium 500 tags/active, SemiBold 600 buttons).
- Palette: navy `#0D1117`, blue `#1A5BFF`, slate-bg `#EDF0F8`,
  deep-navy `#1C2333`, stone `#6B7280`, border `#D1D8E8`,
  blue-tint `#EBF0FF`, dot-grid `#C2CEE8`.

The signature **dot grid** (radial dots at 28px spacing) is applied to the page
background only — never on dark or colored surfaces.

## Deployment

Any Node/Vercel host. `npm run build` statically generates all doc routes;
unknown slugs return a styled 404. No environment variables required.
# jay-md
