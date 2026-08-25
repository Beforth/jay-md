"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders a Mermaid diagram client-side.
 *
 * Mermaid needs the browser (it produces SVG), so it is dynamically imported
 * inside an effect and never touched during SSR. The theme mirrors the
 * navy/blue palette used across the rest of the site.
 */
export function Mermaid({ code }: { code: string }) {
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2)}`);
  const attemptRef = useRef(0);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const renderId = `${idRef.current}-${attemptRef.current++}`;
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "base",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          themeVariables: {
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            fontSize: "14px",
            primaryColor: "#EBF0FF",
            primaryTextColor: "#0D1117",
            primaryBorderColor: "#1A5BFF",
            lineColor: "#1A5BFF",
            secondaryColor: "#EDF0F8",
            tertiaryColor: "#F6F8FC",
            clusterBkg: "#FFFFFF",
            clusterBorder: "#C2CEE8",
            edgeLabelBackground: "#FFFFFF",
            actorBkg: "#EBF0FF",
            actorBorder: "#1A5BFF",
            actorTextColor: "#0D1117",
            signalColor: "#1A5BFF",
            signalTextColor: "#0D1117",
            labelBoxBkgColor: "#F6F8FC",
            labelBoxBorderColor: "#1A5BFF",
            labelTextColor: "#0D1117",
            noteBkgColor: "#EDF0F8",
            noteBorderColor: "#C2CEE8",
            noteTextColor: "#0D1117",
          },
        });
        const { svg: rendered } = await mermaid.render(renderId, code);
        if (!cancelled) setSvg(rendered);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (error) {
    return (
      <div className="my-6 overflow-hidden rounded-2xl border border-danger/40 bg-danger-bg">
        <div className="border-b border-danger/20 px-4 py-2.5">
          <span className="text-[11px] font-medium uppercase tracking-wider2 text-danger">
            Mermaid error
          </span>
        </div>
        <pre className="code-scroll overflow-x-auto p-4 text-[13px] leading-relaxed text-[#0D1117]">
          {code}
        </pre>
        <p className="border-t border-danger/20 px-4 py-2 text-xs font-light text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="group my-6 overflow-hidden rounded-2xl border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-medium uppercase tracking-wider2 text-stone">Diagram</span>
      </div>
      <div
        className="mermaid code-scroll overflow-x-auto p-4"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
