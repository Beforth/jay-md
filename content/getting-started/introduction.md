---
title: Introduction
description: What Beforth Docs is, how the markdown-first workflow works, and how this site generates itself from plain files.
order: 1
tags:
  - Overview
  - Markdown
---

Welcome to **Beforth Docs**. This site is a documentation framework that generates itself from plain markdown files. You never configure a route, update a sidebar, or hand-write a table of contents — the site does all of that for you.

## How it works

The entire content layer lives in the top-level `content` folder. Each subfolder becomes a **group** in the sidebar, and every `.md` or `.mdx` file inside becomes a **page**:

- `content/getting-started/introduction.md` → `/docs/getting-started/introduction`
- `content/guides/configuration.md` → `/docs/guides/configuration`

The build walks that folder, reads each file's frontmatter, and produces four things automatically:

1. The **sidebar navigation tree** (groups and their pages)
2. A flat **search index** powering the ⌘K dialog
3. **Prev / Next** links that chain every page together
4. A per-page **Table of Contents** from your h2 and h3 headings

## Authoring

A page is just markdown with a little frontmatter on top:

```md
---
title: Introduction
description: One or two sentences, shown in search and page headers.
order: 1
tags: [Overview]
---

Body copy goes here. That's it.
```

The only required field is `title`. `order` controls sorting within a group (otherwise pages sort alphabetically, or by the `_meta.json` `order` array). `tags` render as little pills under the page title.

<Callout type="note" title="Plain markdown is fine">
You never need JSX. Every `.md` file is compiled with the MDX toolchain, so you can also drop in components — callouts, tabs, code groups — whenever you want extra polish.
</Callout>

## The reading experience

Body copy renders in **Inter Light**, sized for comfortable long-form reading at roughly 760px, with a 1.8 line-height. Page and section titles use the Beforth display face, **Bebas Neue**, always uppercase.

Headings get anchor links automatically — hover any h2 or h3 to reveal the `#` link, and the right-hand "On this page" rail tracks your scroll position.

## Callouts

Use callouts to highlight context without breaking the flow of the page:

<Callout type="tip">
Your page descriptions double as the search snippet and the Open Graph preview — write them like a hook.
</Callout>

<Callout type="warning">
Check the order of your callouts in the source. Nesting one inside a list can trip up markdown parsers.
</Callout>

<Callout type="danger">
Don't delete the `title` from your frontmatter. The page header, sidebar, search, and prev/next links all depend on it.
</Callout>

Each callout takes an optional `title` and a `type` of `note`, `tip`, `warning`, or `danger`.

## What's next

- Move on to [Installation](/docs/getting-started/installation) to see tabs, code blocks, and the copy-to-clipboard button in action.
- Jump to the [Configuration guide](/docs/guides/configuration) for ordering rules, tables, and deeper headings.
- Press **⌘K** anytime to search the whole site.

> No cap, just clean code and good vibes.
