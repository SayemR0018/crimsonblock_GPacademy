import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
  const currentTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Passive scroll listener → derives targetTime from viewport-relative section progress.
  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const updateTarget = () => {
      const v = videoRef.current;
      if (!v || !v.duration || Number.isNaN(v.duration)) return;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const raw = -rect.top / total;
      const p = Math.min(0.999, Math.max(0, raw));
      targetTimeRef.current = p * v.duration;
    };

    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
    };
  }, []);

  // Lerp rAF loop — liquid-smooth video scrub, no React re-renders.
  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const v = videoRef.current;
      if (v && v.duration && !Number.isNaN(v.duration)) {
        const target = targetTimeRef.current;
        currentTimeRef.current += (target - currentTimeRef.current) * 0.1;
        if (Math.abs(target - currentTimeRef.current) < 0.004) {
          currentTimeRef.current = target;
        }
        // Only write when the delta is meaningful — avoids decoder thrash.
        if (Math.abs(v.currentTime - currentTimeRef.current) > 0.016) {
          try {
            v.currentTime = currentTimeRef.current;
          } catch {
            /* seek races on some browsers; ignore */
          }
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

  return (
    <section
      id="specifications"
      ref={ref}
      className="relative bg-obsidian border-t-[3px] border-b-[3px] border-bone/20"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Crimson aura */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(216,31,42,0.18) 0%, rgba(216,31,42,0.06) 35%, transparent 70%)",
          }}
        />

        {/* Museum frame: gold outer hairline + bone inner border */}
        <div
          className="relative z-10 pixel-border bg-obsidian/60"
          style={{
            padding: "10px",
            boxShadow:
              "0 0 0 1px var(--gold), 0 0 0 12px var(--obsidian), 0 0 0 13px var(--gold), 0 30px 80px -20px rgba(216,31,42,0.35)",
            width: "min(88vw, 1100px)",
            aspectRatio: "16 / 9",
            willChange: "transform",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
        >
          <video
            ref={videoRef}
            src="/specs-transition.mp4"
            muted
            playsInline
            preload="auto"
            loop={false}
            disablePictureInPicture
            className="block w-full h-full object-cover pointer-events-none"
            style={{
              filter: "contrast(1.12) saturate(1.18) brightness(1.02)",
              willChange: "transform",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
            onLoadedMetadata={() => {
              const v = videoRef.current;
              if (v) v.currentTime = 0;
            }}
          />
          {/* Inner vignette for depth */}
          <div
            aria-hidden
            className="absolute inset-[10px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 55%, rgba(7,7,10,0.75) 100%)",
            }}
          />
        </div>

        {/* Grid overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
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
  // Crisp 8-bit snap: very short fade window centered on the key angle.
  const snapIn = Math.max(0, start - 0.03);
  const holdEnd = Math.min(1, start + 0.14);
  const snapOut = Math.min(1, start + 0.2);
  const opacity = useTransform(
    progress,
    [snapIn, start, holdEnd, snapOut],
    reduced ? [1, 1, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    [snapIn, start],
    reduced ? [0, 0] : [24, 0],
  );
  return (
    <motion.div
      style={{ opacity, y, willChange: "transform, opacity" }}
      className={`absolute z-20 w-[86%] md:w-[360px] ${
        side === "left"
          ? "left-4 md:left-10 bottom-16 md:bottom-20"
          : "right-4 md:right-10 top-24 md:top-28"
      }`}
    >
      <PixelCard tone="gold" className="p-5 md:p-6 bg-obsidian/90 backdrop-blur-[2px]">
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
