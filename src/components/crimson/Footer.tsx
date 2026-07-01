const socials = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    // 8-bit "in" mark
    svg: (
      <svg viewBox="0 0 16 16" className="w-6 h-6" shapeRendering="crispEdges" fill="currentColor">
        <rect x="2" y="2" width="3" height="3" />
        <rect x="2" y="6" width="3" height="8" />
        <rect x="7" y="6" width="3" height="8" />
        <rect x="11" y="8" width="3" height="6" />
        <rect x="10" y="6" width="4" height="2" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com",
    svg: (
      <svg viewBox="0 0 16 16" className="w-6 h-6" shapeRendering="crispEdges" fill="currentColor">
        <rect x="1" y="1" width="2" height="2" />
        <rect x="3" y="3" width="2" height="2" />
        <rect x="5" y="5" width="2" height="2" />
        <rect x="7" y="7" width="2" height="2" />
        <rect x="9" y="9" width="2" height="2" />
        <rect x="11" y="11" width="2" height="2" />
        <rect x="13" y="13" width="2" height="2" />
        <rect x="13" y="1" width="2" height="2" />
        <rect x="11" y="3" width="2" height="2" />
        <rect x="9" y="5" width="2" height="2" />
        <rect x="5" y="9" width="2" height="2" />
        <rect x="3" y="11" width="2" height="2" />
        <rect x="1" y="13" width="2" height="2" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    svg: (
      <svg viewBox="0 0 16 16" className="w-6 h-6" shapeRendering="crispEdges" fill="currentColor">
        <rect x="1" y="1" width="14" height="2" />
        <rect x="1" y="13" width="14" height="2" />
        <rect x="1" y="1" width="2" height="14" />
        <rect x="13" y="1" width="2" height="14" />
        <rect x="5" y="5" width="6" height="2" />
        <rect x="5" y="9" width="6" height="2" />
        <rect x="3" y="7" width="2" height="2" />
        <rect x="11" y="7" width="2" height="2" />
        <rect x="11" y="3" width="2" height="2" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="border-t-[3px] border-bone bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-mono text-[11px] text-bone/70 uppercase tracking-widest text-center md:text-left">
          © 2026 THE CRIMSON BLOCK · ALL RIGHTS RESERVED.
        </div>

        <div className="flex items-center gap-5">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-bone hover:text-gold transition-colors"
            >
              {s.svg}
            </a>
          ))}
        </div>

        <div className="font-mono text-[11px] text-bone/50 text-center md:text-right">
          A tribute made at <span className="text-gold">Grameenphone Academy</span>.
        </div>
      </div>
    </footer>
  );
}
