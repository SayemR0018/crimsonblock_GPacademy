import { useState } from "react";
import { PixelButton } from "../ui/PixelButton";
import type { Gender } from "./sprites";

interface Props {
  onStart: (name: string, gender: Gender) => void;
}

const OPTIONS: { value: Gender; label: string; desc: string }[] = [
  { value: "builder", label: "Builder", desc: "Hard hat. Steady hands." },
  { value: "adventurer", label: "Adventurer", desc: "Sun-worn. Fearless." },
  { value: "neutral", label: "Neutral", desc: "Timeless. Undefined." },
];

export function IntroForm({ onStart }: Props) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("builder");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("A name is required to enter the arcade.");
      return;
    }
    if (trimmed.length > 40) {
      setError("Name must be under 40 characters.");
      return;
    }
    onStart(trimmed, gender);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6 max-w-md mx-auto text-left">
      <div>
        <div className="font-pixel text-[11px] text-gold uppercase tracking-widest mb-3">
          ► Insert Coin
        </div>
        <div className="font-pixel text-lg md:text-xl text-bone leading-relaxed">
          Enter your name.<br />
          Choose your avatar.<br />
          <span className="text-crimson">Earn your discount.</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="runner-name" className="font-pixel text-[10px] uppercase tracking-wider text-bone/80">
          Player Name
        </label>
        <input
          id="runner-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
          maxLength={40}
          className="bg-obsidian text-bone font-mono text-sm px-3 py-3 border-[3px] border-bone focus:border-gold outline-none placeholder:text-bone/40"
          placeholder="e.g. ADA"
          autoComplete="off"
        />
        {error && <span className="font-mono text-[11px] text-crimson-glow">{error}</span>}
      </div>

      <div className="flex flex-col gap-3">
        <span className="font-pixel text-[10px] uppercase tracking-wider text-bone/80">
          Choose Avatar
        </span>
        <div className="grid grid-cols-3 gap-2">
          {OPTIONS.map((o) => (
            <button
              type="button"
              key={o.value}
              onClick={() => setGender(o.value)}
              className={`text-left p-3 border-[3px] transition-colors font-mono ${
                gender === o.value
                  ? "border-gold bg-obsidian"
                  : "border-bone/30 bg-obsidian hover:border-bone"
              }`}
            >
              <div className="font-pixel text-[10px] uppercase text-bone">{o.label}</div>
              <div className="text-[10px] text-bone/50 mt-1 leading-snug">{o.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <PixelButton type="submit" size="lg" variant="gold" className="w-full">
        ► Start Run
      </PixelButton>
    </form>
  );
}
