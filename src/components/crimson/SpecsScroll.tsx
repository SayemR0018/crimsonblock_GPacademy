import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import brickImg from "@/assets/brick.png";
import { PixelCard } from "./ui/PixelCard";

const SPECS = [
  {
    tag: "MATERIAL",
    title: "100% Organic Earth-Forged Terracotta",
    body: "Sourced from a single, undisclosed alluvial bed. Fired for 72 continuous hours in an obsidian kiln.",
  },
  {
    tag: "GEOMETRY",
    title: "Ergonomic 8×4×2.25 Geometric Form Factor",
    body: "The canonical proportions. Refined to the millimetre. A weight in the hand that reminds you of consequence.",
  },
  {
    tag: "LEGACY",
    title: "Resistant to Trends. Forged for Eternity.",
    body: "It will outlast your apartment, your city, and the algorithm that recommended it to you.",
  },
];

export function SpecsScroll() {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const rotateY = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [0, 360]);
  const rotateX = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [-10, 15]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.15, 1]);

  return (
    <section
      id="specifications"
      ref={ref}
      className="relative bg-obsidian border-t-[3px] border-b-[3px] border-bone/20"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* grid backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
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
          <h2 className="font-pixel text-bone text-lg md:text-3xl mt-2">
            The Anatomy of a Foundation
          </h2>
        </div>

        {/* Brick */}
        <div className="relative" style={{ perspective: "1000px" }}>
          <motion.img
            src={brickImg}
            alt=""
            width={512}
            height={512}
            style={{ rotateX, rotateY, scale, willChange: "transform" }}
            className="pixelated w-[220px] sm:w-[320px] md:w-[420px] h-auto drop-shadow-[0_25px_0_rgba(0,0,0,0.6)]"
          />
          <div
            aria-hidden
            className="absolute -inset-20 -z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, var(--crimson) 0%, transparent 55%)",
              opacity: 0.35,
              filter: "blur(30px)",
            }}
          />
        </div>

        {/* Spec cards */}
        {SPECS.map((spec, i) => {
          const starts = [0.15, 0.45, 0.72];
          const ends = [0.32, 0.62, 0.9];
          const start = starts[i];
          const end = ends[i];
          const opacity = useTransform(
            scrollYProgress,
            [Math.max(0, start - 0.05), start, end, Math.min(1, end + 0.08)],
            [0, 1, 1, 0],
          );
          const y = useTransform(scrollYProgress, [Math.max(0, start - 0.05), start], [30, 0]);
          const side = i % 2 === 0 ? "left" : "right";
          return (
            <motion.div
              key={spec.tag}
              style={{ opacity, y, willChange: "transform, opacity" }}
              className={`absolute z-10 w-[86%] md:w-[360px] ${
                side === "left"
                  ? "left-4 md:left-16 bottom-16 md:bottom-24"
                  : "right-4 md:right-16 top-24 md:top-32"
              }`}
            >
              <PixelCard tone="gold" className="p-5 md:p-6">
                <div className="font-pixel text-[10px] text-gold uppercase tracking-widest mb-3">
                  ◆ {spec.tag}
                </div>
                <div className="font-pixel text-[13px] md:text-[15px] leading-[1.5] text-bone">
                  {spec.title}
                </div>
                <p className="mt-3 font-mono text-[12px] leading-relaxed text-bone/70">
                  {spec.body}
                </p>
              </PixelCard>
            </motion.div>
          );
        })}

        {/* Scroll cue */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-pixel text-[9px] text-bone/40 uppercase tracking-widest">
          ↓ Scroll ↓
        </div>
      </div>
    </section>
  );
}
