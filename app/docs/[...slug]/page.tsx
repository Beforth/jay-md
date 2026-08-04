import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getDocPage, getNavTree } from "@/lib/content";
import { mdxComponents, mdxOptions } from "@/lib/mdx";
import type { DocNode, PageFrontmatter } from "@/lib/types";
import { Sidebar } from "@/components/Sidebar";
import { MobileSidebar } from "@/components/MobileSidebar";
import { Toc } from "@/components/Toc";
import { Pagination } from "@/components/Pagination";

interface DocParams {
  slug: string[];
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string[] }>> {
  const nav = await getNavTree();
  return nav.flat.map((doc) => ({ slug: doc.slug.split("/") }));
}

export async function generateMetadata({ params }: { params: DocParams }): Promise<Metadata> {
  const page = await getDocPage(params.slug.join("/"));
  if (!page) return {};
  return {
    title: page.doc.title,
    description: page.doc.description || undefined,
  };
}

function DocHeader({ doc }: { doc: DocNode }) {
  return (
    <header className="mb-10">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-blue bg-blue-tint px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider2 text-blue">
          {doc.groupLabel}
        </span>
        {doc.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-white px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider2 text-stone"
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="mt-5 font-display text-display-lg font-normal uppercase tracking-wide2 text-navy">
        {doc.title}
      </h1>

      {doc.description && (
        <p className="mt-4 text-lg font-light leading-relaxed text-stone">{doc.description}</p>
      )}

      <div className="mt-8 border-b border-border" />
    </header>
  );
}

export default async function DocPage({ params }: { params: DocParams }) {
  const slug = params.slug.join("/");
  const [page, nav] = await Promise.all([getDocPage(slug), getNavTree()]);
  if (!page) notFound();

  const { content } = await compileMDX<PageFrontmatter>({
    source: page.doc.source,
    options: { parseFrontmatter: true, mdxOptions },
    components: mdxComponents,
  });

  return (
    <div className="mx-auto flex max-w-[1320px] px-4 sm:px-6">
      <Sidebar
        groups={nav.groups}
        className="rail-scroll sticky top-16 hidden max-h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto py-10 pr-2 lg:block"
      />

      <main className="min-w-0 flex-1 px-0 py-10 sm:px-8 lg:px-12">
        <article className="mx-auto max-w-prose pb-8">
          <DocHeader doc={page.doc} />
          <div className="md-body">{content}</div>
          <Pagination prev={page.prev} next={page.next} />
        </article>
      </main>

      <Toc
        headings={page.doc.headings}
        className="rail-scroll sticky top-16 hidden max-h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto py-10 pl-2 xl:block"
      />

      <MobileSidebar groups={nav.groups} />
    </div>
  );
}
