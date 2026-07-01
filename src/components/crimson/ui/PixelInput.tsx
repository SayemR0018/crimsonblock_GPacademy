import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
}

const fieldBase =
  "w-full bg-obsidian text-bone font-mono text-sm px-3 py-3 border-[3px] border-bone placeholder:text-bone/40 focus:border-gold outline-none transition-colors";

export const PixelInput = forwardRef<
  HTMLInputElement,
  BaseProps & InputHTMLAttributes<HTMLInputElement>
>(({ label, error, hint, className = "", id, ...rest }, ref) => {
  const inputId = id || rest.name || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="font-pixel text-[10px] uppercase tracking-wider text-bone/80">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={`${fieldBase} ${error ? "border-crimson" : ""} ${className}`}
        {...rest}
      />
      {error ? (
        <span className="font-mono text-[11px] text-crimson-glow">{error}</span>
      ) : hint ? (
        <span className="font-mono text-[11px] text-bone/50">{hint}</span>
      ) : null}
    </div>
  );
});
PixelInput.displayName = "PixelInput";

export const PixelTextarea = forwardRef<
  HTMLTextAreaElement,
  BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ label, error, hint, className = "", id, ...rest }, ref) => {
  const inputId = id || rest.name || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="font-pixel text-[10px] uppercase tracking-wider text-bone/80">
        {label}
      </label>
      <textarea
        ref={ref}
        id={inputId}
        rows={3}
        className={`${fieldBase} resize-none ${error ? "border-crimson" : ""} ${className}`}
        {...rest}
      />
      {error ? (
        <span className="font-mono text-[11px] text-crimson-glow">{error}</span>
      ) : hint ? (
        <span className="font-mono text-[11px] text-bone/50">{hint}</span>
      ) : null}
    </div>
  );
});
PixelTextarea.displayName = "PixelTextarea";
