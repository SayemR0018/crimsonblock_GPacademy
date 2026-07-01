import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "gold" | "ghost";

export interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

const base =
  "inline-flex items-center justify-center font-pixel uppercase tracking-wider select-none transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-crimson text-bone border-[3px] border-bone shadow-[4px_4px_0_0_var(--obsidian)] hover:bg-crimson-glow",
  gold:
    "bg-gold text-obsidian border-[3px] border-obsidian shadow-[4px_4px_0_0_var(--crimson)] hover:brightness-110",
  ghost:
    "bg-transparent text-bone border-[3px] border-bone hover:bg-bone hover:text-obsidian",
};

const sizes = {
  sm: "text-[10px] px-3 py-2",
  md: "text-[11px] px-5 py-3",
  lg: "text-[13px] px-7 py-4",
};

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ variant = "primary", size = "md", className = "", ...rest }, ref) => (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    />
  ),
);
PixelButton.displayName = "PixelButton";
