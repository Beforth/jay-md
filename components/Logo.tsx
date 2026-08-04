"use client";

import { useState } from "react";

/**
 * Beforth logo components. Assets live in /public/logo — swap in the real PNGs
 * (or keep the styled-text fallback, which renders out of the box).
 *
 * Expected files (drop them in /public/logo):
 *   beforth-wordmark-navy.png   — wordmark for light backgrounds
 *   beforth-wordmark-white.png  — wordmark for dark backgrounds
 *   beforth-mark-black.png      — B-mark icon on light backgrounds
 *   beforth-mark-white.png      — B-mark icon on dark backgrounds
 */

interface LogoProps {
  className?: string;
}

export function Wordmark({ className = "" }: LogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`font-display text-[1.4rem] font-normal uppercase tracking-wide2 text-navy ${className}`}>
        Beforth
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo/beforth-wordmark-navy.png"
      alt="Beforth"
      onError={() => setFailed(true)}
      className={`h-7 w-auto object-contain ${className}`}
      draggable={false}
    />
  );
}

export function WordmarkWhite({ className = "" }: LogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`font-display text-[1.4rem] font-normal uppercase tracking-wide2 text-white ${className}`}>
        Beforth
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo/beforth-wordmark-white.png"
      alt="Beforth"
      onError={() => setFailed(true)}
      className={`h-7 w-auto object-contain ${className}`}
      draggable={false}
    />
  );
}

export function BMark({ variant = "black", className = "" }: LogoProps & { variant?: "black" | "white" }) {
  const [failed, setFailed] = useState(false);
  const src = variant === "white" ? "/logo/beforth-mark-white.png" : "/logo/beforth-mark-black.png";

  if (failed) {
    return (
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg font-display text-xl uppercase text-white ${
          variant === "white" ? "bg-white/10" : "bg-navy"
        } ${className}`}
      >
        B
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Beforth"
      onError={() => setFailed(true)}
      className={`h-8 w-8 object-contain ${className}`}
      draggable={false}
    />
  );
}
