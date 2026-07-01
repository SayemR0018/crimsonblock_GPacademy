import brickImg from "@/assets/brick.png";
import { PixelButton } from "./ui/PixelButton";
import { FomoCountdown } from "./FomoCountdown";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  return (
    <section
      id="artifact"
      className="relative overflow-hidden border-b-[3px] border-bone/20"
    >
      {/* background grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--bone) 1px, transparent 1px), linear-gradient(90deg, var(--bone) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 font-mono text-[11px] text-gold uppercase tracking-widest">
            <span className="inline-block w-3 h-3 bg-gold" />
            EST. MMXXVI · LIMITED SERIES
          </div>

          <h1 className="font-pixel text-bone leading-[1.15] text-[clamp(1.75rem,5.5vw,4.25rem)]">
            The Ultimate <br />
            Foundation. <br />
            <span className="text-crimson text-glow-crimson">Redefined.</span>
          </h1>

          <p className="font-mono text-bone/70 text-sm md:text-base max-w-md leading-relaxed">
            One brick. Hand-fired in obsidian kilns. Sold as a monument, not a
            material. For those who understand that scarcity is the last true
            luxury.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <PixelButton size="lg" onClick={() => scrollTo("acquire")}>
              ► Secure Your Block
            </PixelButton>
            <button
              onClick={() => scrollTo("specifications")}
              className="font-pixel text-[10px] text-bone/70 hover:text-gold uppercase underline underline-offset-4 decoration-2"
            >
              Read specifications
            </button>
          </div>

          <dl className="grid grid-cols-3 gap-6 pt-8 border-t-[3px] border-bone/20 max-w-md">
            {[
              ["01", "Numbered"],
              ["৳9,999", "One Unit"],
              ["∞", "Longevity"],
            ].map(([v, k]) => (
              <div key={k} className="flex flex-col gap-1">
                <dt className="font-pixel text-[16px] text-gold">{v}</dt>
                <dd className="font-mono text-[10px] uppercase tracking-wider text-bone/60">
                  {k}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative flex flex-col items-center gap-8 md:gap-10">
          {/* Brick stage */}
          <div className="relative w-full flex items-center justify-center">
            {/* radial glow */}
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className="w-[70%] aspect-square"
                style={{
                  background:
                    "radial-gradient(circle, var(--crimson-glow) 0%, transparent 60%)",
                  opacity: 0.55,
                  filter: "blur(20px)",
                }}
              />
            </div>

            {/* plinth */}
            <div className="relative flex flex-col items-center">
              <img
                src={brickImg}
                alt="The Crimson Block — an isometric pixel-rendered luxury red brick"
                width={520}
                height={520}
                className="pixelated relative z-10 drop-shadow-[0_20px_0_rgba(0,0,0,0.6)] w-[240px] sm:w-[300px] md:w-[380px] h-auto"
                style={{ animation: "hero-float 6s ease-in-out infinite", willChange: "transform" }}
              />
              <div className="relative z-0 -mt-6 w-[220px] sm:w-[260px] md:w-[320px] h-6 bg-gold border-[3px] border-obsidian" />
              <div className="relative z-0 w-[200px] sm:w-[240px] md:w-[300px] h-3 bg-[color:var(--gold)]/40 border-x-[3px] border-b-[3px] border-obsidian" />
            </div>

            <div className="absolute top-0 left-0 font-pixel text-[10px] text-bone/40">
              [ SPEC-001 ]
            </div>
          </div>

          {/* FOMO timer — isolated in its own row, never overlaps the plinth */}
          <div className="w-full flex justify-center md:justify-end">
            <FomoCountdown />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="hero-float"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
