import { unified } from "unified";
import remarkParse from "remark-parse";
import GithubSlugger from "github-slugger";
import type { Root, RootContent } from "mdast";
import type { Heading } from "./types";

/**
 * Extract headings (h2/h3 with ids that match rehype-slug) and a plain-text
 * body from a markdown/mdx source string.
 *
 * A fresh GithubSlugger is used per document so the generated ids line up
 * exactly with what rehype-slug produces at render time.
 */
export async function extractDocData(source: string): Promise<{
  headings: Heading[];
  text: string;
}> {
  const tree = unified().use(remarkParse).parse(source);
  const active = new GithubSlugger();

  const headings: Heading[] = [];
  const chunks: string[] = [];

  function nodeText(node: Root | RootContent): string {
    if (node.type === "text" || node.type === "inlineCode") {
      return String(node.value);
    }
    if (hasChildren(node)) {
      return (node as { children: RootContent[] }).children
        .map((child) => nodeText(child))
        .join("");
    }
    return "";
  }

  function hasChildren(node: Root | RootContent): boolean {
    return "children" in node;
  }

  function walk(node: Root | RootContent): void {
    switch (node.type) {
      case "heading": {
        const text = nodeText(node).trim();
        // Advance the slugger for every heading level so ids stay in sync
        // with the ones rehype-slug generates at render time.
        const id = active.slug(text);
        if (node.depth === 2 || node.depth === 3) {
          headings.push({ id, text, level: node.depth === 2 ? 2 : 3 });
        }
        chunks.push(text);
        return;
      }
      case "code":
      case "inlineCode":
      case "html":
        return;
      case "text":
        chunks.push(node.value);
        return;
      default:
        if (hasChildren(node)) {
          for (const child of (node as { children: RootContent[] }).children) {
            walk(child);
          }
        }
    }
  }

  walk(tree);

  const text = chunks.join(" ").replace(/\s+/g, " ").trim();

  return { headings, text };
}
