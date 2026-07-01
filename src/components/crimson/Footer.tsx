import gpAcademyAsset from "@/assets/gp-academy.png.asset.json";

// All social marks share the same 16x16 viewBox and 24x24 rendered size for pixel-perfect balance.
const ICON_CLS = "w-6 h-6";
const socials = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    svg: (
      <svg viewBox="0 0 16 16" className={ICON_CLS} shapeRendering="crispEdges" fill="currentColor">
        <rect x="1" y="1" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="0" />
        <rect x="2" y="2" width="3" height="3" />
        <rect x="2" y="6" width="3" height="8" />
        <rect x="7" y="6" width="3" height="8" />
        <rect x="10" y="6" width="4" height="2" />
        <rect x="11" y="8" width="3" height="6" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com",
    svg: (
      <svg viewBox="0 0 16 16" className={ICON_CLS} shapeRendering="crispEdges" fill="currentColor">
        {/* diagonal 1 */}
        <rect x="1" y="1" width="2" height="2" />
        <rect x="3" y="3" width="2" height="2" />
        <rect x="5" y="5" width="2" height="2" />
        <rect x="7" y="7" width="2" height="2" />
        <rect x="9" y="9" width="2" height="2" />
        <rect x="11" y="11" width="2" height="2" />
        <rect x="13" y="13" width="2" height="2" />
        {/* diagonal 2 */}
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
      <svg viewBox="0 0 16 16" className={ICON_CLS} shapeRendering="crispEdges" fill="currentColor">
        {/* frame */}
        <rect x="1" y="1" width="14" height="2" />
        <rect x="1" y="13" width="14" height="2" />
        <rect x="1" y="1" width="2" height="14" />
        <rect x="13" y="1" width="2" height="14" />
        {/* lens */}
        <rect x="5" y="5" width="6" height="2" />
        <rect x="5" y="9" width="6" height="2" />
        <rect x="3" y="7" width="2" height="2" />
        <rect x="11" y="7" width="2" height="2" />
        {/* diode */}
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
              className="text-bone hover:text-gold transition-colors inline-flex items-center justify-center w-8 h-8"
            >
              {s.svg}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 font-mono text-[12px] text-bone/80 text-center md:text-right">
          <span className="uppercase tracking-wider">A tribute made at</span>
          <img
            src={gpAcademyAsset.url}
            alt="Grameenphone Academy"
            className="h-10 md:h-12 w-auto"
            style={{
              imageRendering: "auto",
              filter: "brightness(0) invert(1) drop-shadow(0 0 6px rgba(212,175,55,0.25))",
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>
    </footer>
  );
}
