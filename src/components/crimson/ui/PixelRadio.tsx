import type { ReactNode } from "react";

export interface PixelRadioOption<T extends string> {
  value: T;
  label: string;
  sublabel?: string;
  accent?: string; // hex or css color for accent border
  icon?: ReactNode;
}

interface Props<T extends string> {
  name: string;
  value: T;
  onChange: (v: T) => void;
  options: PixelRadioOption<T>[];
}

export function PixelRadio<T extends string>({ name, value, onChange, options }: Props<T>) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <label
            key={opt.value}
            className={`flex items-center gap-4 cursor-pointer bg-obsidian px-4 py-3 border-[3px] transition-colors ${
              selected ? "border-gold" : "border-bone/30 hover:border-bone"
            }`}
            style={selected && opt.accent ? { borderColor: opt.accent } : undefined}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            {/* pixel dot */}
            <span
              aria-hidden
              className={`shrink-0 w-5 h-5 border-[3px] border-bone flex items-center justify-center`}
            >
              {selected && (
                <span
                  className="w-2 h-2"
                  style={{ backgroundColor: opt.accent || "var(--gold)" }}
                />
              )}
            </span>
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span className="flex-1">
              <span className="block font-pixel text-[11px] uppercase tracking-wider text-bone">
                {opt.label}
              </span>
              {opt.sublabel && (
                <span className="block font-mono text-[11px] text-bone/60 mt-1">
                  {opt.sublabel}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}
