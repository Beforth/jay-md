import Link from "next/link";
import { WordmarkWhite } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-deep-navy">
      <div className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <WordmarkWhite className="h-6" />
            <p className="mt-4 font-display text-2xl uppercase leading-none tracking-wide2 text-white">
              Ship banger docs.
            </p>
            <p className="mt-3 text-sm font-light leading-relaxed text-[#9AA7BD]">
              A markdown-first documentation framework for Beforth. Drop files in{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-[#C2CEE8]">/content</code>{" "}
              and the site builds itself.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:gap-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider2 text-[#8B97AC]">Docs</p>
              <ul className="mt-3 space-y-2 text-sm font-normal text-[#C2CEE8]">
                <li>
                  <Link href="/docs" className="transition-colors hover:text-white">
                    Getting started
                  </Link>
                </li>
                <li>
                  <Link href="/docs/guides/configuration" className="transition-colors hover:text-white">
                    Configuration
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider2 text-[#8B97AC]">Beforth</p>
              <ul className="mt-3 space-y-2 text-sm font-normal text-[#C2CEE8]">
                <li>
                  <a href="https://beforth.in" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                    beforth.in
                  </a>
                </li>
                <li>
                  <a href="https://brand.beforth.in" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                    Brand guidelines
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs font-normal text-[#8B97AC] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Beforth. All rights reserved.</p>
          <p className="font-light">No cap, just clean code and good vibes.</p>
        </div>
      </div>
    </footer>
  );
}
