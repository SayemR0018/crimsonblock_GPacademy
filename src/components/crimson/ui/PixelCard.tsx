import type { HTMLAttributes, ReactNode } from "react";

type Tone = "bone" | "gold" | "crimson";

export function PixelCard({
  children,
  tone = "bone",
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement> & { tone?: Tone; children?: ReactNode }) {
  const border =
    tone === "gold" ? "border-gold" : tone === "crimson" ? "border-crimson" : "border-bone";
  return (
    <div
      className={`bg-charcoal border-[3px] ${border} shadow-[8px_8px_0_0_var(--obsidian)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
