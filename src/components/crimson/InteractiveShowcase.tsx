import { useCallback, useRef, useState } from "react";
import { PixelCard } from "./ui/PixelCard";
import brickImg from "@/assets/brick-artifact.png";

type Hotspot = {
  id: string;
  label: string;
  title: string;
  body: string;
  top: string;
  left: string;
};

const HOTSPOTS: Hotspot[] = [
  {
    id: "core",
    label: "THE CORE",
    title: "Thermal Kiln Vitrification",
    body: "Hardened at 1200°C to withstand economic downturns and market volatility.",
    top: "22%",
    left: "38%",
  },
  {
    id: "facet",
    label: "THE FACET",
    title: "Zero-Radius Edges",
    body: "Precision-engineered right-angle geometry. Anti-aliased for ideal structural alignment.",
    top: "40%",
    left: "78%",
  },
  {
    id: "base",
    label: "THE BASE",
    title: "Obsidian Grip Matrix",
    body: "Micro-textured foundation footprint for permanent architectural placement.",
    top: "78%",
    left: "30%",
  },
];

const MAX_TILT = 22; // degrees

export function InteractiveShowcase() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const brickRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<Hotspot | null>(null);
  const [engaged, setEngaged] = useState(false);

  const applyTilt = useCallback((nx: number, ny: number, scale = 1.05) => {
    // nx, ny in range [-1, 1]
    const ry = nx * MAX_TILT; // rotate around Y based on X
    const rx = -ny * MAX_TILT; // rotate around X based on Y (invert for natural feel)
    if (brickRef.current) {
      brickRef.current.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale})`;
    }
    if (glowRef.current) {
      // glow shifts opposite to tilt to simulate parallax lighting
      const gx = 50 - nx * 18;
      const gy = 50 - ny * 18;
      glowRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(216,31,42,0.55) 0%, rgba(216,31,42,0.18) 28%, transparent 62%)`;
    }
  }, []);

  const reset = useCallback(() => {
    setEngaged(false);
    if (brickRef.current) {
      brickRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    }
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at 50% 50%, rgba(216,31,42,0.35) 0%, rgba(216,31,42,0.12) 32%, transparent 65%)`;
    }
  }, []);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((clientY - rect.top) / rect.height) * 2 - 1;
      setEngaged(true);
      applyTilt(Math.max(-1, Math.min(1, nx)), Math.max(-1, Math.min(1, ny)));
    },
    [applyTilt],
  );

  return (
    <section id="artifact-viewer" className="relative bg-obsidian py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <div className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-gold">
            § 03 — Interactive
          </div>
          <h2 className="font-pixel text-bone text-lg md:text-2xl mt-3 drop-shadow-[2px_2px_0_rgba(0,0,0,0.9)]">
            INTERACTIVE ARTIFACT ANALYSIS
          </h2>
        </div>

        <div
          className="bg-charcoal p-6 md:p-10"
          style={{
            border: "3px solid var(--bone)",
            boxShadow: "4px 4px 0px 0px var(--obsidian)",
          }}
        >
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 md:gap-10 items-stretch">
            <div
              ref={stageRef}
              onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
              onMouseLeave={reset}
              onTouchStart={(e) => {
                const t = e.touches[0];
                if (t) handleMove(t.clientX, t.clientY);
              }}
              onTouchMove={(e) => {
                const t = e.touches[0];
                if (t) handleMove(t.clientX, t.clientY);
              }}
              onTouchEnd={reset}
              className="relative bg-obsidian pixel-border overflow-hidden select-none"
              style={{
                aspectRatio: "4 / 3",
                perspective: "1200px",
                cursor: "grab",
                touchAction: "none",
              }}
            >
              {/* Grid backdrop */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--bone) 1px, transparent 1px), linear-gradient(90deg, var(--bone) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Dynamic crimson lens-flare glow */}
              <div
                ref={glowRef}
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(216,31,42,0.35) 0%, rgba(216,31,42,0.12) 32%, transparent 65%)",
                  transition: "background 0.25s ease-out",
                  willChange: "background",
                }}
              />

              {/* Brick artifact with 3D tilt */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  ref={brickRef}
                  className="relative"
                  style={{
                    width: "72%",
                    maxWidth: 520,
                    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
                    transition: "transform 0.15s ease-out",
                    transformStyle: "preserve-3d",
                    willChange: "transform, filter",
                    filter: engaged
                      ? "drop-shadow(0 30px 25px rgba(0,0,0,0.75)) drop-shadow(0 0 40px rgba(216,31,42,0.35))"
                      : "drop-shadow(0 18px 18px rgba(0,0,0,0.65))",
                  }}
                >
                  <img
                    src={brickImg}
                    alt="The Crimson Block — luxury pixel-art brick artifact"
                    className="w-full h-auto block"
                    style={{ imageRendering: "pixelated" }}
                    draggable={false}
                  />
                </div>
              </div>

              {/* Hotspots */}
              {HOTSPOTS.map((h) => (
                <button
                  key={h.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(h);
                  }}
                  onMouseEnter={() => setActive(h)}
                  aria-label={`Reveal ${h.label}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{ top: h.top, left: h.left }}
                >
                  <span className="relative flex items-center justify-center w-7 h-7">
                    <span className="absolute inset-0 bg-crimson/40 animate-ping" aria-hidden />
                    <span
                      className="relative w-7 h-7 flex items-center justify-center bg-obsidian text-gold font-pixel text-[12px]"
                      style={{
                        border: "2px solid var(--gold)",
                        boxShadow:
                          "0 0 0 2px var(--obsidian), 0 0 12px rgba(212,175,55,0.6)",
                      }}
                    >
                      +
                    </span>
                  </span>
                </button>
              ))}

              {/* Drag hint */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-bone/70 pointer-events-none">
                <MouseIcon />
                MOVE CURSOR TO EXAMINE
              </div>

              {/* Status readout */}
              <div className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-widest text-gold/80 pointer-events-none">
                {engaged ? "◆ TRACKING" : "◇ IDLE"}
              </div>
            </div>

            {/* Right column: data readout */}
            <div className="flex flex-col">
              <PixelCard tone="gold" className="p-5 md:p-6 flex-1 bg-obsidian/80">
                <div className="font-pixel text-[10px] text-gold uppercase tracking-widest mb-3">
                  ◆ DATA READOUT
                </div>
                {active ? (
                  <div className="animate-fade-in">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-crimson mb-2">
                      {active.label}
                    </div>
                    <div className="font-pixel text-[12px] md:text-[13px] leading-[1.6] text-bone">
                      {active.title}
                    </div>
                    <p className="mt-3 font-mono text-[12px] leading-relaxed text-bone/80">
                      {active.body}
                    </p>
                    <button
                      onClick={() => setActive(null)}
                      className="mt-6 font-pixel text-[9px] text-gold uppercase tracking-widest hover:text-crimson transition-colors"
                    >
                      ◀ RESET SIGNAL
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="font-pixel text-[12px] md:text-[13px] leading-[1.6] text-bone">
                      Awaiting Signal.
                    </div>
                    <p className="mt-3 font-mono text-[12px] leading-relaxed text-bone/70">
                      Sweep the cursor across the artifact to tilt it in 3D. Tap
                      a <span className="text-gold">+</span> hotspot to reveal a
                      classified specification.
                    </p>
                    <ul className="mt-5 space-y-2 font-mono text-[11px] text-bone/60">
                      {HOTSPOTS.map((h) => (
                        <li key={h.id} className="flex items-center gap-2">
                          <span className="text-gold">+</span>
                          <span className="uppercase tracking-widest">
                            {h.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </PixelCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MouseIcon() {
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" aria-hidden>
      <rect x="1" y="1" width="10" height="14" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="5" y="3" width="2" height="4" fill="currentColor" />
    </svg>
  );
}
