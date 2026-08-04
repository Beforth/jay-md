"use client";

import { Children, isValidElement, useState, type ReactNode } from "react";

/**
 * Tabs / CodeGroup — client components for tabbed content in MDX.
 *
 * Usage:
 *   <Tabs>
 *     <Tab label="npm">...</Tab>
 *     <Tab label="pnpm">...</Tab>
 *   </Tabs>
 *
 *   <CodeGroup>
 *     <Tab label="content.ts">```ts ...```</Tab>
 *     <Tab label="page.tsx">```tsx ...```</Tab>
 *   </CodeGroup>
 */
export function Tab({ children }: { label: string; children: ReactNode }) {
  return <>{children}</>;
}

function collectTabs(children: ReactNode): Array<{ label: string; content: ReactNode }> {
  const tabs: Array<{ label: string; content: ReactNode }> = [];
  for (const child of Children.toArray(children)) {
    if (isValidElement<{ label?: string; children?: ReactNode }>(child)) {
      tabs.push({ label: child.props.label ?? "Content", content: child.props.children });
    }
  }
  return tabs;
}

interface TabsProps {
  children: ReactNode;
  defaultValue?: string;
}

export function Tabs({ children, defaultValue }: TabsProps) {
  const tabs = collectTabs(children);
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.label);

  if (tabs.length === 0) return <>{children}</>;
  if (tabs.length === 1) return <div className="my-6">{tabs[0].content}</div>;

  return (
    <div className="my-6">
      <div
        role="tablist"
        className="inline-flex flex-wrap gap-1 rounded-full border border-border bg-slate-bg p-1"
      >
        {tabs.map((tab) => {
          const selected = tab.label === active;
          return (
            <button
              key={tab.label}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(tab.label)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wide2 transition-colors ${
                selected
                  ? "bg-blue text-white"
                  : "text-stone hover:bg-blue-tint hover:text-navy"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4" role="tabpanel">
        {tabs.find((tab) => tab.label === active)?.content}
      </div>
    </div>
  );
}

export function CodeGroup({ children, defaultValue }: TabsProps) {
  const tabs = collectTabs(children);
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.label);

  if (tabs.length === 0) return <>{children}</>;
  if (tabs.length === 1) return <div className="my-6">{tabs[0].content}</div>;

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-white/10 bg-deep-navy">
      <div role="tablist" className="flex flex-wrap gap-1 border-b border-white/10 bg-[#171d2b] px-3 py-2">
        {tabs.map((tab) => {
          const selected = tab.label === active;
          return (
            <button
              key={tab.label}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(tab.label)}
              className={`rounded-full px-3.5 py-1 text-xs font-medium uppercase tracking-wide2 transition-colors ${
                selected ? "bg-blue text-white" : "text-[#8B97AC] hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="[&_div]:!my-0 [&_div]:!rounded-none [&_div]:border-0">
        {tabs.find((tab) => tab.label === active)?.content}
      </div>
    </div>
  );
}
