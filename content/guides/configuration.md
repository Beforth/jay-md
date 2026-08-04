---
title: Configuration
description: How sidebar ordering works, the frontmatter reference, search indexing, and the auto table of contents — with a full data table.
order: 1
tags:
  - Reference
  - Advanced
---

The docs site is configurable through three layers, in order of precedence:

1. Per-folder `_meta.json` (ordering and labels)
2. Frontmatter `order` on each page
3. Alphabetical fallback

## Ordering

Every page has an implicit sort order. Here's the decision flow:

| Layer | Example | When it wins |
| --- | --- | --- |
| `_meta.json` `order` | `["introduction", "installation"]` | Always — position wins, listed pages first |
| Frontmatter `order` | `order: 2` | When a page isn't listed in `_meta.json` |
| Alphabetical | `Aardvark`, `Zebra` | When neither of the above exists |

<Callout type="tip">
Frontmatter `order` only matters *within* its own group. To reorder groups themselves, use the root `content/_meta.json` with the folder names.
</Callout>

### Group ordering

```json
{
  "order": ["getting-started", "guides"],
  "labels": {
    "getting-started": "Getting Started"
  }
}
```

Place this at the root of `content/`. The `order` array sorts the sidebar groups; `labels` overrides how a group name is displayed. Without it, group names are humanized from folder names (`getting-started` → `Getting Started`).

### Page ordering

The same shape works inside any group folder:

```json
{
  "order": ["introduction", "installation"],
  "labels": {
    "introduction": "Intro"
  }
}
```

Entries in `order` may match a page by filename, full slug, or (lowercased) title. A page listed here sorts by its position in the array; unlisted pages use frontmatter `order`, then alphabetical.

## Frontmatter reference

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | Yes | Used in the page header, sidebar, TOC of search, and browser tab |
| `description` | string | No | Search snippet + Open Graph description |
| `order` | number | No | Sort key within its group |
| `tags` | string[] | No | Rendered as pills under the page title |
| `group` | string | No | Overrides the folder-derived group |
| `slug` | string | No | Overrides the route, e.g. `slug: install` |

<Callout type="danger">
`title` is required. If it's missing, the loader falls back to the filename — and your search results will look sad.
</Callout>

## Code groups

When one feature spans multiple files, group them as tabs:

<CodeGroup>
<Tab label="content.ts">

```ts
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");
```

</Tab>
<Tab label="page.tsx">

```tsx
export const dynamicParams = false;

export function generateStaticParams() {
  return nav.flat.map((doc) => ({ slug: doc.slug.split("/") }));
}
```

</Tab>
</CodeGroup>

Each tab carries a filename-style label, and the active panel keeps the deep-navy code surface.

## Search

Every page contributes to the site-wide search index, indexed at build time from:

- `title` (highest weight)
- `description`
- h2/h3 `headings`
- the full plain-text body

Press **⌘K** (or **Ctrl+K**) to open the command palette and type to fuzzy match. Results show the page title, its group pill, and the description snippet.

<Callout type="note">
Because the index is generated at build time, it stays in sync with the docs automatically — there's nothing to regenerate by hand.
</Callout>

## Table of contents

The "On this page" rail is generated from your h2 and h3 headings, in document order. H3 headings are indented under their parent h2. Heading ids are slugified with `github-slugger`, so in-page links like `#table-of-contents` always resolve — including when two headings share a name.

### Nested h3s

A h3 like this one creates a TOC entry nested under its h2 parent. It also gets its own hover-revealed anchor link.
