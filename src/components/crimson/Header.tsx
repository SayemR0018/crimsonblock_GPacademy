import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { id: "artifact", label: "Artifact" },
  { id: "specifications", label: "Specifications" },
  { id: "challenge", label: "Challenge" },
  { id: "acquire", label: "Acquire" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-charcoal/90 backdrop-blur border-b-[3px] border-bone">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-4">
        <button
          onClick={() => scrollTo("artifact")}
          className="font-pixel text-[10px] md:text-[13px] text-bone hover:text-crimson-glow transition-colors tracking-widest"
          aria-label="The Crimson Block — home"
        >
          <span className="text-crimson">▮</span> THE CRIMSON BLOCK
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="font-pixel text-[10px] uppercase text-bone/80 hover:text-gold transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <button
          className="md:hidden text-bone p-2 border-[3px] border-bone"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-obsidian flex flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b-[3px] border-bone">
            <span className="font-pixel text-[10px] text-bone tracking-widest">
              <span className="text-crimson">▮</span> THE CRIMSON BLOCK
            </span>
            <button
              className="text-bone p-2 border-[3px] border-bone"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center gap-8 flex-1 px-6">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => scrollTo(l.id), 50);
                }}
                className="font-pixel text-lg text-bone hover:text-gold border-b-[3px] border-transparent hover:border-gold pb-2 uppercase"
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="p-6 border-t-[3px] border-bone/30 text-center font-mono text-[11px] text-bone/50">
            EST. MMXXVI · LIMITED SERIES
          </div>
        </div>
      )}
    </header>
  );
}
