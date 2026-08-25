# Marketing Docs

Documentation site for **S&M Hub** — Aureole Group's sales and marketing
operations platform. S&M Hub manages the end-to-end commercial pipeline:
domains and regions, contacts, customers, organizations, leads, quotations,
orders, events, and daily reporting (DSR), with role-based access and
row-level visibility enforced by the backend.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and MDX.
Every markdown file in `content/` automatically becomes a page at
`/docs/<filename>`, complete with sidebar navigation, ⌘K search, table of
contents, and prev/next links.

```
content/introduction.md  →  /docs/introduction
```

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static generation + type-safe build
npm run start    # serve the production build
```

## The docs

All content lives in `content/`. Each file becomes a page in the sidebar:

| File | Route | Contents |
| --- | --- | --- |
| `introduction.md` | `/docs/introduction` | What S&M Hub is, who it's for, how the docs are organised |
| `overview.md` | `/docs/overview` | The two repos at a glance — stacks, environments, auth flow |
| `user-guide.md` | `/docs/user-guide` | Non-technical manual — every screen and workflow |
| `developer-guide.md` | `/docs/developer-guide` | Setup, data model, API reference, deployment |
| `architecture.md` | `/docs/architecture` | Diagram-first system reference |
| `changelog-template.md` | `/docs/changelog-template` | Blank release log template |
| `help-book.md` | `/docs/help-book` | Screen-by-screen guide: prerequisites, steps, permissions, FAQ |
| `inventory-context.md` | `/docs/inventory-context` | What "inventory" means in S&M Hub (master data + pipeline), and what it doesn't do |
| `readme.md` | `/docs/readme` | Project overview — features, stack, architecture, quick start |

Sidebar order follows the sequence Introduction → Overview → User guide → Developer guide → Architecture → Changelog → Help book → Inventory context (see `content/_meta.json` and each file's frontmatter `order`).

### Adding or editing a doc

Edit any `.md` file in `content/`, or drop in a new one:

```md
---
title: My Page
description: Short description shown in search and page headers.
order: 1
tags: [Guide]
---

Write markdown here. Headings, code, tables, callouts, and tabs all work.
```

The page appears at `/docs/<filename>`, in the sidebar, in search, and gets
prev/next links chained to its neighbours. No config required.

| Frontmatter field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | Yes | Page header, sidebar, search, browser tab |
| `description` | string | No | Search snippet + Open Graph description |
| `order` | number | No | Sort key within the docs list |
| `tags` | string[] | No | Pill badges under the page title |

Sidebar ordering across the five files is controlled by
`content/_meta.json`.

## Search

Press **⌘K** / **Ctrl+K** (or the pill in the navbar). The index is built
from every page's title, description, headings, and body text at build time
and fuzzy-matched client-side.

## Structure

```
app/          Routes: landing page, /docs redirect, /docs/[...slug], 404
components/   Navbar, Sidebar, TOC, Footer, CmdK, MDX component set
lib/          Content loader, meta parser, headings, search, MDX pipeline
content/      ← THE DOCS. Only this folder changes day to day.
public/logo/  Beforth wordmark / B-mark PNGs
```
