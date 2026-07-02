import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PixelCard } from "./ui/PixelCard";

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
    body: "Hardened at 1200°C to withstand economic downturns.",
    // sits over the frog indentations on the top face
    top: "34%",
    left: "44%",
  },
  {
    id: "facet",
    label: "THE FACET",
    title: "Anti-Aliased Zero-Radius Edges",
    body: "Precision-engineered for ideal structural alignment.",
    // top-right corner where the glowing edge highlights converge
    top: "40%",
    left: "72%",
  },
  {
    id: "base",
    label: "THE BASE",
    title: "Obsidian Grip Matrix",
    body: "Micro-textured foundation footprint for permanent architectural placement.",
    // near the lower-left base of the brick
    top: "70%",
    left: "34%",
  },
];

// Brick proportions (8 × 4 × 2.25) scaled to px
const W = 280; // long side (x)
const H = 78;  // height    (y)
const D = 140; // depth     (z)

// ── Deterministic pixel-noise SVG generator ─────────────────────────────
// Renders a WxH grid of 1-unit rects picked from `palette`. Produces a
// crisp, chunky clay-brick texture without shipping raster assets.
function makeNoise(
  cols: number,
  rows: number,
  palette: string[],
  seed: number,
  extras: string = "",
): string {
  let s = seed >>> 0;
  const rand = () => {
    // xorshift32
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1000) / 1000;
  };
  const rects: string[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const c = palette[Math.floor(rand() * palette.length)];
      rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>`);
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols} ${rows}" shape-rendering="crispEdges" preserveAspectRatio="none">${rects.join("")}${extras}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

// Palettes tuned against the reference asset
const PAL = {
  frontRed:  ["#c8202a", "#a5171f", "#b31c25", "#8d1219", "#d92832", "#7a0d13", "#c8202a", "#a5171f"],
  sideRed:   ["#9c161d", "#7a0d13", "#8d1219", "#5f0910", "#a5171f", "#4a070c", "#8d1219", "#7a0d13"],
  topRed:    ["#d92832", "#c8202a", "#e8404a", "#b31c25", "#c8202a", "#d92832"],
  topRim:    ["#f7b23a", "#f28b1e", "#ffcf5c", "#e07a15"], // gold/orange kiln glow
  frogDark:  ["#3a070b", "#26060a", "#4a0a10", "#1a0407"],
  bottom:    ["#1a0407", "#26060a", "#3a070b"],
};

export function InteractiveShowcase() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  // Match the reference isometric viewpoint
  const [rot, setRot] = useState({ x: -30, y: -35 });
  const [dragging, setDragging] = useState(false);
  const [active, setActive] = useState<Hotspot | null>(null);
  const idleRef = useRef({ paused: false });
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      if (!idleRef.current.paused && !dragging) {
        const t = (now - start) / 1000;
        setRot((r) => ({
          x: r.x + Math.sin(t * 0.5) * 0.03,
          y: r.y + 0.08,
        }));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [dragging]);

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
        x: Math.max(-85, Math.min(85, r.x - dy * 0.5)),
        y: r.y + dx * 0.5,
      }));
    },
    [dragging],
  );

  const endDrag = useCallback(() => {
    setDragging(false);
    lastRef.current = null;
  }, []);

  // Dynamic gallery-spotlight shading based on current rotation
  // Faces closer to the +Y (top-front) get brighter, back faces darken.
  const yaw = ((rot.y % 360) + 360) % 360;
  const frontLight = 0.55 + 0.45 * Math.cos((yaw * Math.PI) / 180);
  const rightLight = 0.55 + 0.45 * Math.cos(((yaw - 90) * Math.PI) / 180);
  const backLight  = 0.55 + 0.45 * Math.cos(((yaw - 180) * Math.PI) / 180);
  const leftLight  = 0.55 + 0.45 * Math.cos(((yaw + 90) * Math.PI) / 180);

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
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={endDrag}
              className="relative bg-obsidian pixel-border overflow-hidden select-none"
              style={{
                aspectRatio: "4 / 3",
                perspective: "1400px",
                cursor: dragging ? "grabbing" : "grab",
                touchAction: "none",
                background:
                  "radial-gradient(circle at 45% 40%, rgba(216,31,42,0.18) 0%, transparent 65%), var(--obsidian)",
              }}
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--bone) 1px, transparent 1px), linear-gradient(90deg, var(--bone) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

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
                <SideFace w={W} h={H} transform={`translateZ(${D / 2}px)`} kind="long" seed={11} light={frontLight} />
                <SideFace w={W} h={H} transform={`rotateY(180deg) translateZ(${D / 2}px)`} kind="long" seed={22} light={backLight} />
                <SideFace w={D} h={H} transform={`rotateY(90deg) translateZ(${W / 2}px)`} kind="short" seed={33} light={rightLight} />
                <SideFace w={D} h={H} transform={`rotateY(-90deg) translateZ(${W / 2}px)`} kind="short" seed={44} light={leftLight} />
                <TopFace w={W} h={D} transform={`rotateX(90deg) translateZ(${H / 2}px)`} />
                <BottomFace w={W} h={D} transform={`rotateX(-90deg) translateZ(${H / 2}px)`} />
              </div>

              {HOTSPOTS.map((h) => (
                <button
                  key={h.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(h);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  aria-label={`Reveal ${h.label}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ top: h.top, left: h.left }}
                >
                  <span className="relative flex items-center justify-center w-8 h-8">
                    <span className="absolute inset-0 bg-crimson/30 animate-ping" aria-hidden />
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

              <div className="absolute bottom-3 left-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-bone/70 pointer-events-none">
                <MouseIcon />
                CLICK &amp; DRAG TO EXAMINE
              </div>

              <div className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-widest text-gold/80 pointer-events-none">
                X {Math.round(rot.x)}° · Y {Math.round(yaw)}°
              </div>
            </div>

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
                      Select a <span className="text-gold">+</span> hotspot on the
                      artifact to reveal a classified specification. Drag the brick
                      to inspect all six faces.
                    </p>
                    <ul className="mt-5 space-y-2 font-mono text-[11px] text-bone/60">
                      {HOTSPOTS.map((h) => (
                        <li key={h.id} className="flex items-center gap-2">
                          <span className="text-gold">+</span>
                          <span className="uppercase tracking-widest">{h.label}</span>
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

// ── Faces ───────────────────────────────────────────────────────────────

function SideFace({
  w,
  h,
  transform,
  kind,
  seed,
  light,
}: {
  w: number;
  h: number;
  transform: string;
  kind: "long" | "short";
  seed: number;
  light: number; // 0..1
}) {
  // Pixel grid: keep chunky (~5px per cell)
  const cols = kind === "long" ? 56 : 28;
  const rows = 16;
  const noise = useMemo(
    () => makeNoise(cols, rows, kind === "long" ? PAL.frontRed : PAL.sideRed, seed),
    [cols, rows, kind, seed],
  );
  // Kiln-glow rim along the top edge (2 rows of gold speckle)
  const rim = useMemo(
    () =>
      makeNoise(cols, 2, PAL.topRim, seed + 100),
    [cols, seed],
  );

  const brightness = 0.55 + light * 0.6; // 0.55 .. 1.15
  return (
    <div
      className="absolute left-0 top-0"
      style={{
        width: w,
        height: h,
        transform,
        backfaceVisibility: "hidden",
        willChange: "transform",
        outline: "1px solid rgba(0,0,0,0.7)",
        filter: `brightness(${brightness.toFixed(3)})`,
      }}
    >
      {/* Base pixel-clay texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: noise,
          backgroundSize: "100% 100%",
          imageRendering: "pixelated",
        }}
      />
      {/* Vertical clay drip imperfections */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.35) 0 2px, transparent 2px 11px)",
        }}
      />
      {/* Top kiln-glow highlight rim */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: Math.max(4, h * 0.09),
          backgroundImage: rim,
          backgroundSize: "100% 100%",
          imageRendering: "pixelated",
          boxShadow: "0 1px 0 rgba(255,180,60,0.4)",
        }}
      />
      {/* Bottom shadow band */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: Math.max(3, h * 0.07),
          background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
        }}
      />
      {/* Inner vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 40% 40%, transparent 55%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </div>
  );
}

function TopFace({
  w,
  h,
  transform,
}: {
  w: number;
  h: number;
  transform: string;
}) {
  const cols = 56;
  const rows = 28;
  const noise = useMemo(() => makeNoise(cols, rows, PAL.topRed, 77), []);
  const rim = useMemo(() => makeNoise(cols, 2, PAL.topRim, 88), []);
  return (
    <div
      className="absolute left-0 top-0"
      style={{
        width: w,
        height: h,
        transform,
        backfaceVisibility: "hidden",
        willChange: "transform",
        outline: "1px solid rgba(0,0,0,0.7)",
      }}
    >
      {/* Base pixel-clay top surface */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: noise,
          backgroundSize: "100% 100%",
          imageRendering: "pixelated",
        }}
      />
      {/* Kiln-glow rim on all four edges */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 4, backgroundImage: rim, backgroundSize: "100% 100%", imageRendering: "pixelated" }} />
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 4, backgroundImage: rim, backgroundSize: "100% 100%", imageRendering: "pixelated", opacity: 0.7 }} />
      <div className="absolute top-0 bottom-0 left-0" style={{ width: 4, background: "linear-gradient(to bottom, #f7b23a, #a5171f)", opacity: 0.6 }} />
      <div className="absolute top-0 bottom-0 right-0" style={{ width: 4, background: "linear-gradient(to bottom, #f7b23a, #a5171f)", opacity: 0.6 }} />

      {/* Recessed inner lip (the "frog") */}
      <div
        className="absolute"
        style={{
          top: "18%",
          bottom: "18%",
          left: "12%",
          right: "12%",
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.35), rgba(0,0,0,0.15))",
          boxShadow:
            "inset 2px 2px 0 rgba(0,0,0,0.55), inset -2px -2px 0 rgba(255,140,60,0.35)",
        }}
      >
        {/* Three classic brick frog indentations */}
        <div className="absolute inset-0 flex items-center justify-around px-[8%]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "18%",
                height: "58%",
                background:
                  "linear-gradient(135deg, #1a0407 0%, #3a070b 60%, #5f0910 100%)",
                boxShadow:
                  "inset 2px 2px 0 rgba(0,0,0,0.75), inset -1px -1px 0 rgba(255,140,60,0.35)",
                outline: "1px solid rgba(0,0,0,0.6)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Top vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 45% 40%, transparent 55%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </div>
  );
}

function BottomFace({
  w,
  h,
  transform,
}: {
  w: number;
  h: number;
  transform: string;
}) {
  const noise = useMemo(() => makeNoise(40, 20, PAL.bottom, 55), []);
  return (
    <div
      className="absolute left-0 top-0"
      style={{
        width: w,
        height: h,
        transform,
        backfaceVisibility: "hidden",
        willChange: "transform",
        outline: "1px solid rgba(0,0,0,0.8)",
        backgroundImage: noise,
        backgroundSize: "100% 100%",
        imageRendering: "pixelated",
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.75)",
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
