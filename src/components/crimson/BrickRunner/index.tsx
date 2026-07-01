import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useCrimson } from "@/lib/crimson-store";
import { PixelButton } from "../ui/PixelButton";
import { PixelCard } from "../ui/PixelCard";
import { IntroForm } from "./IntroForm";
import { Game } from "./Game";
import { rewardForScore } from "./rewards";
import type { Gender } from "./sprites";

type Phase = "intro" | "playing" | "result";

export function BrickRunner() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("builder");
  const [score, setScore] = useState(0);
  const { applyDiscount, discount } = useCrimson();

  const handleStart = useCallback((n: string, g: Gender) => {
    setName(n);
    setGender(g);
    setPhase("playing");
  }, []);

  const handleGameOver = useCallback((s: number) => {
    setScore(s);
    setPhase("result");
  }, []);

  const reward = rewardForScore(score);
  const alreadyApplied = discount?.code === reward.code;

  function copyAndApply() {
    navigator.clipboard.writeText(reward.code).catch(() => {});
    applyDiscount(reward);
    toast.success(`${reward.code} copied · ${reward.percent}% off applied`, {
      description: "Redeem it at checkout below.",
    });
  }

  function playAgain() {
    setPhase("intro");
    setScore(0);
  }

  return (
    <section id="challenge" className="relative bg-charcoal border-t-[3px] border-b-[3px] border-bone/20 py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="text-center mb-8">
          <div className="font-mono text-[11px] uppercase tracking-widest text-gold">
            § 03 — The Challenge
          </div>
          <h2 className="font-pixel text-bone text-xl md:text-3xl mt-2">
            Play. Earn. Redeem.
          </h2>
          <p className="font-mono text-bone/60 text-sm mt-3 max-w-lg mx-auto">
            One run at the arcade. Your score becomes your discount code —
            automatically applied to the checkout.
          </p>
        </div>

        {/* Arcade bezel */}
        <div className="relative bg-obsidian border-[3px] border-bone shadow-[8px_8px_0_0_var(--crimson)] p-3 md:p-5">
          {/* Marquee */}
          <div className="relative -mx-3 md:-mx-5 -mt-3 md:-mt-5 mb-4 md:mb-6 border-b-[3px] border-bone bg-crimson">
            <div className="py-3 px-4 text-center">
              <div className="font-pixel text-bone text-[12px] md:text-[16px] tracking-widest text-glow-crimson">
                ▮ THE BRICK RUNNER ▮
              </div>
            </div>
          </div>

          <div className="relative bg-obsidian border-[3px] border-gold p-4 md:p-8 min-h-[360px] md:min-h-[440px] flex items-center justify-center">
            {/* CRT scanlines on the arcade screen */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(to bottom, rgba(236,231,213,0.05) 0 1px, transparent 1px 3px)",
              }}
            />
            <div className="relative w-full">
              {phase === "intro" && <IntroForm onStart={handleStart} />}
              {phase === "playing" && <Game gender={gender} onGameOver={handleGameOver} />}
              {phase === "result" && (
                <div className="max-w-md mx-auto text-center flex flex-col gap-6">
                  <div>
                    <div className="font-pixel text-[10px] text-bone/60 uppercase tracking-widest">
                      Run Complete · {name}
                    </div>
                    <div className="font-pixel text-3xl md:text-5xl text-crimson-glow mt-3">
                      {score}
                    </div>
                    <div className="font-mono text-[11px] text-bone/60 mt-1">POINTS SCORED</div>
                  </div>

                  <PixelCard tone="gold" className="p-5 text-left">
                    <div className="font-pixel text-[10px] uppercase tracking-widest text-gold mb-2">
                      ◆ Discount Unlocked
                    </div>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="font-pixel text-xl md:text-2xl text-bone">{reward.code}</div>
                      <div className="font-pixel text-crimson text-lg">−{reward.percent}%</div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <PixelButton size="sm" onClick={copyAndApply} disabled={alreadyApplied}>
                        {alreadyApplied ? "✓ Applied" : "► Copy & Apply"}
                      </PixelButton>
                      <PixelButton size="sm" variant="ghost" onClick={playAgain}>
                        ↻ Play Again
                      </PixelButton>
                    </div>
                  </PixelCard>
                </div>
              )}
            </div>
          </div>

          {/* Bottom bezel details */}
          <div className="mt-4 flex justify-between items-center font-pixel text-[9px] text-bone/40 uppercase tracking-widest">
            <span>◆ CRIMSON ARCADE // 1985–{new Date().getFullYear()}</span>
            <span className="hidden sm:inline">CREDITS: ∞</span>
          </div>
        </div>

        {/* Reward legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 font-mono text-[11px]">
          {[
            ["< 150", "CRIMSON5", "5%"],
            ["150–349", "CRIMSON10", "10%"],
            ["350–699", "BRICK20", "20%"],
            ["≥ 700", "OBSIDIAN30", "30%"],
          ].map(([range, code, pct]) => (
            <div key={code} className="bg-obsidian border-[3px] border-bone/20 p-3">
              <div className="text-bone/50 uppercase text-[10px]">{range} pts</div>
              <div className="font-pixel text-[10px] text-gold mt-1">{code}</div>
              <div className="text-crimson-glow mt-1">−{pct}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
