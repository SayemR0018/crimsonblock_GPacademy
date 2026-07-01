import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { PixelCard } from "./ui/PixelCard";

const SPECS = [
  {
    tag: "MATERIAL",
    title: "100% Organic Earth-Forged Terracotta",
    body: "Sourced from a single, undisclosed alluvial bed. Fired for 72 continuous hours in an obsidian kiln.",
    at: 0.25,
  },
  {
    tag: "GEOMETRY",
    title: "Ergonomic 8×4×2.25 Geometric Form Factor",
    body: "The canonical proportions. Refined to the millimetre. A weight in the hand that reminds you of consequence.",
    at: 0.55,
  },
  {
    tag: "LEGACY",
    title: "Resistant to Trends. Forged for Eternity.",
    body: "It will outlast your apartment, your city, and the algorithm that recommended it to you.",
    at: 0.85,
  },
] as const;

export function SpecsScroll() {
  const ref = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const targetTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Smooth scrub loop — updates currentTime with lerp, avoids React re-renders.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const v = videoRef.current;
      if (v && v.duration && !Number.isNaN(v.duration)) {
        const current = v.currentTime;
        const target = targetTimeRef.current;
        const diff = target - current;
        // snap when close, else lerp for buttery scrub
        if (Math.abs(diff) < 0.02) {
          v.currentTime = target;
        } else {
          v.currentTime = current + diff * 0.25;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const v = videoRef.current;
    if (!v || !v.duration || Number.isNaN(v.duration)) return;
    const clamped = Math.min(0.999, Math.max(0, p));
    targetTimeRef.current = clamped * v.duration;
  });

  return (
    <section
      id="specifications"
      ref={ref}
      className="relative bg-obsidian border-t-[3px] border-b-[3px] border-bone/20"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Scrubbable background video */}
        <video
          ref={videoRef}
          src="/specs-transition.mp4"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ filter: "contrast(1.05) saturate(1.1)", willChange: "contents" }}
          onLoadedMetadata={() => {
            const v = videoRef.current;
            if (v) v.currentTime = 0;
          }}
        />
        {/* Vignette + grid overlays */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(7,7,10,0.85) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--bone) 1px, transparent 1px), linear-gradient(90deg, var(--bone) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Section title */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center px-4 z-20 pointer-events-none">
          <div className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-gold">
            § 02 — Specifications
          </div>
          <h2 className="font-pixel text-bone text-lg md:text-3xl mt-2 drop-shadow-[2px_2px_0_rgba(0,0,0,0.9)]">
            The Anatomy of a Foundation
          </h2>
        </div>

        {/* Spec cards */}
        {SPECS.map((spec, i) => (
          <SpecCard
            key={spec.tag}
            spec={spec}
            side={i % 2 === 0 ? "left" : "right"}
            progress={scrollYProgress}
            reduced={!!prefersReduced}
          />
        ))}

        {/* Scroll cue */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-pixel text-[9px] text-bone/60 uppercase tracking-widest z-20">
          ↓ Scroll ↓
        </div>
      </div>
    </section>
  );
}

function SpecCard({
  spec,
  side,
  progress,
  reduced,
}: {
  spec: (typeof SPECS)[number];
  side: "left" | "right";
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduced: boolean;
}) {
  const start = spec.at;
  const holdEnd = Math.min(1, start + 0.15);
  const fadeOut = Math.min(1, start + 0.22);
  const opacity = useTransform(
    progress,
    [Math.max(0, start - 0.08), start, holdEnd, fadeOut],
    reduced ? [1, 1, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    [Math.max(0, start - 0.08), start],
    reduced ? [0, 0] : [40, 0],
  );
  return (
    <motion.div
      style={{ opacity, y, willChange: "transform, opacity" }}
      className={`absolute z-10 w-[86%] md:w-[380px] ${
        side === "left"
          ? "left-4 md:left-16 bottom-16 md:bottom-24"
          : "right-4 md:right-16 top-24 md:top-32"
      }`}
    >
      <PixelCard tone="gold" className="p-5 md:p-6 bg-obsidian/85 backdrop-blur-[2px]">
        <div className="font-pixel text-[10px] text-gold uppercase tracking-widest mb-3">
          ◆ {spec.tag}
        </div>
        <div className="font-pixel text-[13px] md:text-[15px] leading-[1.5] text-bone">
          {spec.title}
        </div>
        <p className="mt-3 font-mono text-[12px] leading-relaxed text-bone/80">
          {spec.body}
        </p>
      </PixelCard>
    </motion.div>
  );
}
