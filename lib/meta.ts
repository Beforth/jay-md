import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { MetaFile } from "./types";

const META_FILES = ["_meta.json", "meta.json", "_meta.yaml", "_meta.yml", "meta.yaml", "meta.yml"];

function parseMeta(content: string): Partial<MetaFile> {
  // Support both JSON and YAML syntax.
  if (content.trimStart().startsWith("{")) {
    return JSON.parse(content) as Partial<MetaFile>;
  }
  return matter(content).data as Partial<MetaFile>;
}

/** Read the _meta.json / _meta.yaml for a directory, or an empty object. */
export function readMeta(dir: string): Partial<MetaFile> {
  for (const name of META_FILES) {
    const file = path.join(dir, name);
    if (fs.existsSync(file)) {
      try {
        return parseMeta(fs.readFileSync(file, "utf8"));
      } catch {
        // Ignore malformed meta files; fall back to defaults.
        return {};
      }
    }
  }
  return {};
}

export function humanize(input: string): string {
  return input
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
