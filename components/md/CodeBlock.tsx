import type { ReactNode } from "react";
import { isValidElement } from "react";
import { CopyButton } from "./CopyButton";

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return extractText(node.props?.children);
  return "";
}

/**
 * Wraps a syntax-highlighted <pre> (produced by rehype-pretty-code) in the
 * Beforth deep-navy card with a language label and copy-to-clipboard pill.
 */
export function CodeBlock({ children, node: _node, ...props }: { children?: ReactNode; node?: unknown }) {
  const language = (props as Record<string, string>)["data-language"];
  const label = language && language !== "text" ? language : "Code";
  const code = extractText(children);

  return (
    <div className="group my-6 overflow-hidden rounded-2xl border border-white/10 bg-deep-navy">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="text-[11px] font-medium uppercase tracking-wider2 text-[#8B97AC]">
          {label}
        </span>
        <CopyButton code={code} />
      </div>
      <pre {...props} className="code-scroll overflow-x-auto p-4 text-[13.5px] leading-relaxed text-[#E6EDF3]">
        {children}
      </pre>
    </div>
  );
}
