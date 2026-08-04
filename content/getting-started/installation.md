---
title: Installation
description: Get the framework running locally, add a first doc, and preview your site — with tabs for npm, pnpm and yarn.
order: 2
tags:
  - Setup
  - CLI
---

This page is an example of what a how-to doc looks like in Beforth Docs: tabs, highlighted code blocks, and a copy button on every snippet.

## Requirements

Before you start, make sure you have a recent runtime installed:

- **Node.js** 18.17 or newer
- **npm** (or pnpm, or yarn — pick your poison)

## Install dependencies

<Callout type="note" title="Clone or fork first">
These commands assume you're already inside the project directory. If you haven't cloned the repo yet, do that first, then `cd` into it.
</Callout>

The framework itself lives in `package.json`. To install everything:

<Tabs>
<Tab label="npm">

```bash
npm install
```

</Tab>
<Tab label="pnpm">

```bash
pnpm install
```

</Tab>
<Tab label="yarn">

```bash
yarn install
```

</Tab>
</Tabs>

## Start the dev server

<Tabs defaultValue="npm">
<Tab label="npm">

```bash
npm run dev
```

</Tab>
<Tab label="pnpm">

```bash
pnpm dev
```

</Tab>
<Tab label="yarn">

```bash
yarn dev
```

</Tab>
</Tabs>

Open [http://localhost:3000](http://localhost:3000). The landing page renders, and `/docs` redirects to the first document.

## Add your first doc

Create a new file under `content` and watch the sidebar update:

```bash
mkdir -p content/guides
```

```md
---
title: My First Page
description: A page I just created.
---

Hello, docs.
```

Save the file, refresh, and `content/guides/my-first-page.md` shows up at `/docs/guides/my-first-page` with its own TOC, search entry, and prev/next links.

## Production build

To build and serve the production bundle:

```bash
npm run build && npm run start
```

The build statically generates every doc route. A missing page returns a styled 404 instead of a blank screen.

## Code blocks

Fenced code blocks are syntax-highlighted by Shiki with a Beforth dark theme, labeled by language, and come with a copy button:

```ts
export async function getFirstDoc(): Promise<DocNode | null> {
  const { flat } = await getNavTree();
  return flat[0] ?? null;
}
```

Inline code like `npm run build` renders as a blue-tint pill so it stands out from body text.

<Callout type="tip">
Use `tsx`, `ts`, `bash`, `md`, `json`, `css` or any Shiki-supported language after the opening backticks — the label and highlighting follow automatically.
</Callout>
