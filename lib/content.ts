import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { extractDocData } from "./headings";
import { humanize, readMeta } from "./meta";
import type {
  DocNode,
  GroupNode,
  MetaFile,
  NavTree,
  PageFrontmatter,
  SearchItem,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const DOC_EXT = new Set([".md", ".mdx"]);

function isIgnored(name: string): boolean {
  return name.startsWith(".") || name.startsWith("_");
}

/** Recursively list all markdown files under a directory, skipping _ and . entries. */
function listDocs(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (isIgnored(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listDocs(full));
    } else if (entry.isFile() && DOC_EXT.has(path.extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

function basenameOf(slug: string): string {
  return slug.split("/").pop() ?? slug;
}

/** Position of a doc inside a meta.order list (matched by slug, basename or title). */
function metaIndex(doc: Pick<DocNode, "slug" | "title">, order: string[] | undefined): number {
  if (!order) return -1;
  const basename = basenameOf(doc.slug);
  const lowered = doc.title.toLowerCase();
  for (let i = 0; i < order.length; i++) {
    const key = order[i];
    if (key === doc.slug || key === basename || key === lowered) return i;
  }
  return -1;
}

async function parseFile(
  filePath: string,
  groupLabels: Record<string, string>,
  pageLabels: Record<string, string>
): Promise<DocNode | null> {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as PageFrontmatter;

  const rel = path.relative(CONTENT_DIR, filePath).replace(/\\/g, "/");
  const relNoExt = rel.replace(/\.(md|mdx)$/i, "");
  const segments = relNoExt.split("/");
  const group = fm.group ?? (segments.length > 1 ? segments[0] : "general");
  const slug = (fm.slug ?? relNoExt).replace(/\\/g, "/");
  const basename = basenameOf(slug);

  const { headings, text } = await extractDocData(content);

  return {
    slug,
    filePath,
    title: pageLabels[basename] ?? fm.title ?? humanize(basename),
    description: fm.description ?? "",
    order: fm.order ?? 999,
    group,
    groupLabel: groupLabels[group] ?? humanize(group),
    tags: fm.tags ?? [],
    href: `/docs/${slug}`,
    headings,
    searchText: text,
    source: content,
  };
}

async function buildNavTree(): Promise<NavTree> {
  const rootMeta: Partial<MetaFile> = readMeta(CONTENT_DIR);
  const groupLabels = rootMeta.labels ?? {};

  const entries = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });
  const groupDirs = entries
    .filter((e) => e.isDirectory() && !isIgnored(e.name))
    .map((e) => e.name);
  const rootFiles = entries
    .filter(
      (e) => e.isFile() && !isIgnored(e.name) && DOC_EXT.has(path.extname(e.name).toLowerCase())
    )
    .map((e) => e.name);

  const docsByGroup = new Map<string, DocNode[]>();

  for (const dir of groupDirs) {
    const pageLabels = readMeta(path.join(CONTENT_DIR, dir)).labels ?? {};
    const docs: DocNode[] = [];
    for (const file of listDocs(path.join(CONTENT_DIR, dir))) {
      const doc = await parseFile(file, groupLabels, pageLabels);
      if (doc) docs.push(doc);
    }
    docsByGroup.set(dir, docs);
  }

  // Root-level files go into a group (frontmatter override or "general").
  for (const file of rootFiles) {
    const doc = await parseFile(path.join(CONTENT_DIR, file), groupLabels, {});
    if (doc) {
      const arr = docsByGroup.get(doc.group) ?? [];
      arr.push(doc);
      docsByGroup.set(doc.group, arr);
    }
  }

  const sortDocs = (docs: DocNode[], order: string[] | undefined) => {
    const ranked = docs.map((doc) => {
      const idx = metaIndex(doc, order);
      const tier = idx >= 0 ? 0 : doc.order !== 999 ? 1 : 2;
      return { doc, tier, rank: idx >= 0 ? idx : doc.order, alpha: doc.title.toLowerCase() };
    });
    return ranked
      .sort((a, b) => a.tier - b.tier || a.rank - b.rank || a.alpha.localeCompare(b.alpha))
      .map((r) => r.doc);
  };

  const groupOrder = rootMeta.order ?? [];
  const groups: GroupNode[] = groupDirs.map((name, i) => {
    const meta = readMeta(path.join(CONTENT_DIR, name));
    const children = sortDocs(docsByGroup.get(name) ?? [], meta.order);
    const orderIndex = metaIndex({ slug: name, title: humanize(name) }, groupOrder);
    return {
      name,
      label: groupLabels[name] ?? humanize(name),
      order: orderIndex >= 0 ? orderIndex : 1000 + i,
      href: children[0]?.href ?? "",
      children,
    };
  });

  // Groups not present as folders (e.g. created by a root file's `group` field).
  for (const [name, docs] of docsByGroup) {
    if (groups.some((g) => g.name === name)) continue;
    const orderIndex = metaIndex({ slug: name, title: humanize(name) }, groupOrder);
    groups.push({
      name,
      label: groupLabels[name] ?? humanize(name),
      order: orderIndex >= 0 ? orderIndex : 2000,
      href: docs[0]?.href ?? "",
      children: sortDocs(docs, undefined),
    });
  }

  groups.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));

  const flat = groups.flatMap((g) => g.children);

  return { groups, flat };
}

export const getNavTree = cache(async (): Promise<NavTree> => buildNavTree());

export interface DocPage {
  doc: DocNode;
  prev: DocNode | null;
  next: DocNode | null;
}

export async function getDocPage(slug: string): Promise<DocPage | null> {
  const { flat } = await getNavTree();
  const index = flat.findIndex((doc) => doc.slug === slug);
  if (index === -1) return null;
  return {
    doc: flat[index],
    prev: index > 0 ? flat[index - 1] : null,
    next: index < flat.length - 1 ? flat[index + 1] : null,
  };
}

export const getFirstDoc = cache(async (): Promise<DocNode | null> => {
  const { flat } = await getNavTree();
  return flat[0] ?? null;
});

export const getSearchIndex = cache(async (): Promise<SearchItem[]> => {
  const nav = await getNavTree();
  const groupNameToLabel = new Map(nav.groups.map((g) => [g.name, g.label]));
  return nav.flat.map((doc) => ({
    slug: doc.slug,
    href: doc.href,
    title: doc.title,
    description: doc.description,
    group: doc.group,
    groupLabel: groupNameToLabel.get(doc.group) ?? doc.groupLabel,
    tags: doc.tags,
    headings: doc.headings.map((h) => h.text),
    text: doc.searchText,
  }));
});
