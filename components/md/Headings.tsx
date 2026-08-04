import type { HTMLAttributes, ReactNode } from "react";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  children?: ReactNode;
  node?: unknown;
};

const ANCHOR_TARGET = "scroll-mt-24";

export function H1({ children, node: _node, className = "", ...props }: HeadingProps) {
  return (
    <h1
      {...props}
      className={`font-display text-display-md font-normal uppercase tracking-wide2 text-navy ${ANCHOR_TARGET} ${className}`}
    >
      {children}
    </h1>
  );
}

export function H2({ children, node: _node, className = "", ...props }: HeadingProps) {
  return (
    <h2
      {...props}
      className={`mt-12 font-display text-display-md font-normal uppercase tracking-wide2 text-blue ${ANCHOR_TARGET} ${className}`}
    >
      {children}
    </h2>
  );
}

export function H3({ children, node: _node, className = "", ...props }: HeadingProps) {
  return (
    <h3
      {...props}
      className={`mt-8 font-display text-display-sm font-normal uppercase tracking-wide2 text-navy ${ANCHOR_TARGET} ${className}`}
    >
      {children}
    </h3>
  );
}

export function H4({ children, node: _node, className = "", ...props }: HeadingProps) {
  return (
    <h4
      {...props}
      className={`mt-7 text-base font-semibold text-navy ${ANCHOR_TARGET} ${className}`}
    >
      {children}
    </h4>
  );
}

export function H5({ children, node: _node, className = "", ...props }: HeadingProps) {
  return (
    <h5
      {...props}
      className={`mt-6 text-sm font-semibold uppercase tracking-wide2 text-navy ${ANCHOR_TARGET} ${className}`}
    >
      {children}
    </h5>
  );
}

export function H6({ children, node: _node, className = "", ...props }: HeadingProps) {
  return (
    <h6
      {...props}
      className={`mt-6 text-sm font-semibold text-stone ${ANCHOR_TARGET} ${className}`}
    >
      {children}
    </h6>
  );
}
