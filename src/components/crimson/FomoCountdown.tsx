import { useEffect, useState } from "react";

const TOTAL_MS = (2 * 60 * 60 + 14 * 60 + 45) * 1000;
const KEY = "crimson_fomo_deadline";

function getDeadline(): number {
  if (typeof window === "undefined") return Date.now() + TOTAL_MS;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw) {
      const n = Number(raw);
      if (!Number.isNaN(n) && n > Date.now()) return n;
    }
  } catch {
    /* ignore */
  }
  const d = Date.now() + TOTAL_MS;
  try {
    window.sessionStorage.setItem(KEY, String(d));
  } catch {
    /* ignore */
  }
  return d;
}

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

export function FomoCountdown() {
  const [remaining, setRemaining] = useState<number>(TOTAL_MS);

  useEffect(() => {
    const deadline = getDeadline();
    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        // reset gracefully for the session
        try {
          window.sessionStorage.removeItem(KEY);
        } catch {
          /* ignore */
        }
        setRemaining(TOTAL_MS);
        return;
      }
      setRemaining(diff);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const totalSec = Math.floor(remaining / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  return (
    <div
      className="inline-flex flex-col gap-2 bg-obsidian border-[3px] border-crimson p-3 md:p-4"
      style={{ boxShadow: "6px 6px 0 0 rgba(0,0,0,0.65), inset 0 0 0 1px rgba(216,31,42,0.35)" }}
      role="timer"
      aria-live="off"
    >
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-crimson-glow">
        <span className="inline-block w-2 h-2 bg-crimson animate-pulse" />
        Limited Time Offer · Ends Soon
      </div>
      <div className="flex items-end gap-2">
        <Unit value={pad(h)} label="Hrs" />
        <span className="font-pixel text-gold text-lg md:text-2xl pb-1">:</span>
        <Unit value={pad(m)} label="Min" />
        <span className="font-pixel text-gold text-lg md:text-2xl pb-1">:</span>
        <Unit value={pad(s)} label="Sec" />
      </div>
    </div>
  );
}

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-pixel text-lg md:text-2xl text-bone bg-charcoal border-[2px] border-bone/40 px-2 py-1 min-w-[46px] md:min-w-[56px] text-center">
        {value}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-widest text-bone/60">
        {label}
      </span>
    </div>
  );
}
