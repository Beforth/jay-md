import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="inline-flex rounded-full border border-border bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider2 text-stone">
        404 · Page not found
      </p>

      <h1 className="mt-8 font-display text-display-xl font-normal uppercase tracking-wide2 text-navy">
        Lost <span className="text-blue">in space</span>
      </h1>

      <p className="mt-5 max-w-md text-base font-light leading-relaxed text-stone">
        The page you&apos;re looking for doesn&apos;t exist, or it moved to a new
        home in the docs.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-blue px-6 py-2.5 text-xs font-semibold uppercase tracking-wider2 text-white transition-colors hover:bg-[#0F47D0]"
        >
          Back home
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider2 text-navy transition-colors hover:bg-blue-tint"
        >
          Browse the docs
        </Link>
      </div>
    </div>
  );
}
