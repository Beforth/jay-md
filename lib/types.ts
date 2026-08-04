export interface PageFrontmatter {
  title?: string;
  description?: string;
  order?: number;
  group?: string;
  slug?: string;
  tags?: string[];
}

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface DocNode {
  /** Route slug, e.g. "getting-started/introduction". */
  slug: string;
  /** Absolute file path on disk. */
  filePath: string;
  title: string;
  description: string;
  order: number;
  /** Group key (folder name, or frontmatter group override). */
  group: string;
  groupLabel: string;
  tags: string[];
  href: string;
  headings: Heading[];
  /** Plain-text body (for the search index). */
  searchText: string;
  /** Raw markdown/mdx source (frontmatter stripped). */
  source: string;
}

export interface GroupNode {
  name: string;
  label: string;
  order: number;
  href: string;
  children: DocNode[];
}

export interface NavTree {
  groups: GroupNode[];
  flat: DocNode[];
}

export interface SearchItem {
  slug: string;
  href: string;
  title: string;
  description: string;
  group: string;
  groupLabel: string;
  tags: string[];
  headings: string[];
  text: string;
}

export interface MetaFile {
  order?: string[];
  labels?: Record<string, string>;
}
