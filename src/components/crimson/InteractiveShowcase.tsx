import { useCallback, useEffect, useRef, useState } from "react";
import { PixelCard } from "./ui/PixelCard";

type Hotspot = {
  id: string;
  label: string;
  title: string;
  body: string;
  /** position on the stage (percent) */
  top: string;
  left: string;
};

const HOTSPOTS: Hotspot[] = [
  {
    id: "core",
    label: "THE CORE",
    title: "Thermal Kiln Vitrification",
    body: "Hardened at 1200°C to withstand economic downturns.",
    top: "26%",
    left: "50%",
  },
  {
    id: "facet",
    label: "THE FACET",
    title: "Anti-Aliased Zero-Radius Edges",
    body: "Precision-engineered for ideal structural alignment.",
    top: "48%",
    left: "78%",
  },
  {
    id: "base",
    label: "THE BASE",
    title: "Obsidian Grip Matrix",
    body: "Micro-textured foundation footprint for permanent architectural placement.",
    top: "72%",
    left: "34%",
  },
];

// Brick dimensions in px (proportional to 8×4×2.25)
const W = 260; // width  (x)
const H = 72;  // height (y) — 2.25
const D = 130; // depth  (z) — 4

export function InteractiveShowcase() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [rot, setRot] = useState({ x: -18, y: -28 });
  const [dragging, setDragging] = useState(false);
  const [active, setActive] = useState<Hotspot | null>(null);
  const idleRef = useRef({ paused: false });
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<{ x: number; y: number } | null>(null);

  // Idle floating rotation
  useEffect(() => {
    let start = performance.now();
    const tick = (now: number) => {
      if (!idleRef.current.paused && !dragging) {
        const t = (now - start) / 1000;
        setRot((r) => ({
          x: r.x + Math.sin(t * 0.6) * 0.04,
          y: r.y + 0.15,
        }));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [dragging]);

  // Freeze idle when a hotspot is active
  useEffect(() => {
    idleRef.current.paused = !!active;
  }, [active]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(true);
    lastRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !lastRef.current) return;
      const dx = e.clientX - lastRef.current.x;
      const dy = e.clientY - lastRef.current.y;
      lastRef.current = { x: e.clientX, y: e.clientY };
      setRot((r) => ({
        x: Math.max(-80, Math.min(80, r.x - dy * 0.5)),
        y: r.y + dx * 0.5,
      }));
    },
    [dragging],
  );

  const endDrag = useCallback(() => {
    setDragging(false);
    lastRef.current = null;
  }, []);

  return (
    <section
      id="artifact-viewer"
      className="relative bg-obsidian py-20 md:py-28 px-4"
    >
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
            {/* 3D Stage */}
            <div
              ref={stageRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={endDrag}
              className="relative bg-obsidian pixel-border overflow-hidden select-none"
              style={{
                aspectRatio: "4 / 3",
                perspective: "1200px",
                cursor: dragging ? "grabbing" : "grab",
                touchAction: "none",
                background:
                  "radial-gradient(circle at center, rgba(216,31,42,0.14) 0%, transparent 70%), var(--obsidian)",
              }}
            >
              {/* Grid floor */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--bone) 1px, transparent 1px), linear-gradient(90deg, var(--bone) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Cube */}
              <div
                className="absolute left-1/2 top-1/2 pointer-events-none"
                style={{
                  width: W,
                  height: H,
                  transformStyle: "preserve-3d",
                  transform: `translate(-50%, -50%) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
                  willChange: "transform",
                }}
              >
                {/* Front */}
                <Face
                  w={W}
                  h={H}
                  transform={`translateZ(${D / 2}px)`}
                  shade="front"
                />
                {/* Back */}
                <Face
                  w={W}
                  h={H}
                  transform={`rotateY(180deg) translateZ(${D / 2}px)`}
                  shade="back"
                />
                {/* Right */}
                <Face
                  w={D}
                  h={H}
                  transform={`rotateY(90deg) translateZ(${W / 2}px)`}
                  shade="side"
                />
                {/* Left */}
                <Face
                  w={D}
                  h={H}
                  transform={`rotateY(-90deg) translateZ(${W / 2}px)`}
                  shade="side"
                />
                {/* Top */}
                <Face
                  w={W}
                  h={D}
                  transform={`rotateX(90deg) translateZ(${H / 2}px)`}
                  shade="top"
                />
                {/* Bottom */}
                <Face
                  w={W}
                  h={D}
                  transform={`rotateX(-90deg) translateZ(${H / 2}px)`}
                  shade="bottom"
                />
              </div>

              {/* Hotspots */}
              {HOTSPOTS.map((h) => (
                <button
                  key={h.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(h);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  aria-label={`Reveal ${h.label}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ top: h.top, left: h.left }}
                >
                  <span className="relative flex items-center justify-center w-8 h-8">
                    <span
                      className="absolute inset-0 bg-crimson/30 animate-ping"
                      aria-hidden
                    />
                    <span
                      className="relative w-8 h-8 flex items-center justify-center bg-obsidian text-gold font-pixel text-[14px]"
                      style={{
                        border: "2px solid var(--gold)",
                        boxShadow: "0 0 0 2px var(--obsidian), 0 0 12px rgba(212,175,55,0.6)",
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
                CLICK &amp; DRAG TO EXAMINE
              </div>

              {/* Rotation readout */}
              <div className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-widest text-gold/80 pointer-events-none">
                X {Math.round(rot.x)}° · Y {Math.round(((rot.y % 360) + 360) % 360)}°
              </div>
            </div>

            {/* Data readout */}
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
                      ◀ RESUME ORBIT
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="font-pixel text-[12px] md:text-[13px] leading-[1.6] text-bone">
                      Awaiting Signal.
                    </div>
                    <p className="mt-3 font-mono text-[12px] leading-relaxed text-bone/70">
                      Select a{" "}
                      <span className="text-gold">+</span> hotspot on the
                      artifact to reveal a classified specification. Drag the
                      brick to inspect all six faces.
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

function Face({
  w,
  h,
  transform,
  shade,
}: {
  w: number;
  h: number;
  transform: string;
  shade: "front" | "back" | "side" | "top" | "bottom";
}) {
  const palette: Record<typeof shade, { base: string; accent: string; mortar: string }> = {
    front:  { base: "#c21f28", accent: "#8b1219", mortar: "#3a0a0e" },
    back:   { base: "#a71a22", accent: "#6f0f15", mortar: "#2e080b" },
    side:   { base: "#8a161d", accent: "#5c0d13", mortar: "#26070a" },
    top:    { base: "#e0343f", accent: "#a71a22", mortar: "#4a0d11" },
    bottom: { base: "#4a0d11", accent: "#2a0709", mortar: "#150304" },
  };
  const p = palette[shade];
  // Pixel brick pattern using layered linear-gradients
  const bg =
    `repeating-linear-gradient(0deg, ${p.mortar} 0 2px, transparent 2px ${Math.max(12, h / 4)}px),` +
    `repeating-linear-gradient(90deg, ${p.mortar} 0 2px, transparent 2px 32px),` +
    `repeating-linear-gradient(90deg, ${p.accent} 0 6px, ${p.base} 6px 14px)`;
  return (
    <div
      className="absolute left-0 top-0"
      style={{
        width: w,
        height: h,
        transform,
        background: bg,
        outline: "1px solid rgba(0,0,0,0.6)",
        boxShadow: "inset 0 0 24px rgba(0,0,0,0.45)",
        backfaceVisibility: "hidden",
        willChange: "transform",
      }}
    />
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
