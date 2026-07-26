"use client";

import { useEffect, useState } from "react";

/**
 * The placeholder system.
 * Tries to load `/assets/{src}`. If the file doesn't exist yet, renders a
 * labeled colored box instead. Drop the real PNG at the exact path from the
 * asset naming list and it replaces the box automatically — no code changes.
 */
export function GameImage({
  src,
  label,
  className,
  tone = "wood",
}: {
  /** Path relative to /public/assets, e.g. "scenes/project-doghouse-stage-00-empty-yard.png" */
  src: string;
  /** Text shown on the placeholder box (usually the filename or a friendly label). */
  label: string;
  className?: string;
  /** Placeholder box color family, just to visually group asset types. */
  tone?: "wood" | "sky" | "grass" | "sun" | "steel";
}) {
  const [missing, setMissing] = useState(false);

  // If the src changes (e.g. customize preview swapping paint variants),
  // forget any earlier load failure and try the new image fresh.
  useEffect(() => {
    setMissing(false);
  }, [src]);

  if (missing) {
    return (
      <div className={`ph ph-${tone} ${className ?? ""}`} role="img" aria-label={label}>
        <span className="ph-label">{label}</span>
        <span className="ph-file">{src}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/assets/${src}`}
      alt={label}
      className={className}
      onError={() => setMissing(true)}
      draggable={false}
    />
  );
}
