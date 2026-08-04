import type { ReactNode } from "react";

const STYLES = {
  note: {
    border: "#1A5BFF",
    bg: "#EBF0FF",
    color: "#1A5BFF",
    icon: (
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 7.5V11" strokeLinecap="round" />
        <circle cx="8" cy="5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  tip: {
    border: "#0D1117",
    bg: "#EEF1F6",
    color: "#0D1117",
    icon: (
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M8 1.5c2.5 1.5 4 3.5 4 6a4 4 0 1 1-8 0c0-2.5 1.5-4.5 4-6Z" strokeLinejoin="round" />
        <path d="M6.5 11.5h3M7 13.5h2" strokeLinecap="round" />
      </svg>
    ),
  },
  warning: {
    border: "#B45309",
    bg: "#FDF5E7",
    color: "#B45309",
    icon: (
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M8 2 14.5 13.5H1.5L8 2Z" strokeLinejoin="round" />
        <path d="M8 6.5V9.5" strokeLinecap="round" />
        <circle cx="8" cy="11.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  danger: {
    border: "#C0392B",
    bg: "#FCECEC",
    color: "#C0392B",
    icon: (
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" />
        <path d="m5.5 5.5 5 5M10.5 5.5l-5 5" strokeLinecap="round" />
      </svg>
    ),
  },
};

export type CalloutType = keyof typeof STYLES;

const LABELS: Record<CalloutType, string> = {
  note: "Note",
  tip: "Tip",
  warning: "Warning",
  danger: "Danger",
};

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  const style = STYLES[type] ?? STYLES.note;
  return (
    <div
      className="my-6 rounded-r-xl rounded-l-md border-l-4 px-5 py-4"
      style={{ borderLeftColor: style.border, backgroundColor: style.bg }}
    >
      <div className="mb-1.5 flex items-center gap-2" style={{ color: style.color }}>
        {style.icon}
        <span className="text-xs font-semibold uppercase tracking-wider2">
          {title ?? LABELS[type]}
        </span>
      </div>
      <div className="text-[15px] font-light leading-relaxed text-navy">{children}</div>
    </div>
  );
}
