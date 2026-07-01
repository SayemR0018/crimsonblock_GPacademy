
# The Crimson Block — Implementation Plan

Single-page site, no backend, no auth. All state lives in a React context and mirrors to `localStorage`.

## 1. Global setup

- Fonts via `<link>` in `src/routes/__root.tsx` head: **Press Start 2P** (display/arcade), **JetBrains Mono** (body/UI) — preconnect + stylesheet, never `@import` a URL.
- Design tokens in `src/styles.css` under `@theme inline`:
  - `--obsidian #07070a`, `--charcoal #14141a`, `--crimson #d81f2a`, `--crimson-glow #ff3b47`, `--gold #d4af37`, `--bone #ece7d5`, `--bkash-pink #e2136e`
  - Font tokens: `--font-pixel`, `--font-mono`
- Global rules: `* { border-radius: 0 !important }` scoped to the app root; body gets a fixed scanline overlay (`repeating-linear-gradient` 0.06 opacity, `pointer-events:none`, `z-50`).
- `@utility` classes: `.pixel-border`, `.pixel-border-gold`, `.pixel-border-crimson`, `.pixel-shadow`, `.pixel-shadow-gold`, `.pixel-shadow-crimson`, `.pixel-shadow-lg`.

## 2. State — `CrimsonProvider`

`src/lib/crimson-store.tsx` — Context with:
- `discount: { code: string, percent: number } | null`
- `orders: Order[]` (hydrated from `localStorage['crimson_orders']`)
- Actions: `applyDiscount`, `clearDiscount`, `addOrder`
- Mounted once in `__root.tsx` around `<Outlet />`.

## 3. Route + SEO

Single route `src/routes/index.tsx`. `head()` sets unique title, meta description, og:title/description/image (brick asset), twitter card, and a JSON-LD `Product` script. Single `<h1>` in Hero.

## 4. File layout

```
src/routes/index.tsx
src/lib/crimson-store.tsx
src/components/crimson/
  ui/PixelButton.tsx
  ui/PixelCard.tsx
  ui/PixelRadio.tsx
  ui/PixelInput.tsx
  Header.tsx
  Hero.tsx
  SpecsScroll.tsx
  BrickRunner/
    index.tsx
    IntroForm.tsx
    Game.tsx
    sprites.ts        // procedural 16×16 sprite draws
    rewards.ts        // score → code mapping
  Checkout.tsx
  PixelConfetti.tsx
  SuccessDialog.tsx
  Footer.tsx
src/assets/brick.png  // generated once via imagegen (premium, transparent)
```

## 5. Sections

**Header** — sticky, `border-b-[3px] border-bone`, `bg-charcoal/90 backdrop-blur`. Logo in Press Start 2P. Desktop nav: Artifact / Specifications / Challenge / Acquire → `document.getElementById(id).scrollIntoView({behavior:'smooth'})`. Mobile: pixel hamburger opens a full-screen drawer with thick pixel borders.

**Hero (`#artifact`)** — two columns on md+, stacked on mobile. Left: `<h1>` "The Ultimate Foundation. Redefined." (Press Start 2P, clamp-scaled, "Redefined." in crimson); tag "EST. MMXXVI · LIMITED SERIES" in mono; `PixelButton` "Secure Your Block" → smooth-scroll to `#acquire`. Right: brick image on a gold pixel-frame plinth with a radial crimson back-glow.

**Specifications (`#specifications`)** — outer `h-[300vh]`, inner `sticky top-0 h-screen`. `useScroll({target,offset:['start start','end end']})` drives `useTransform` on a central `motion.img` of the brick: `rotateY 0→360`, `rotateX -10→15`, `scale 0.9→1.15`, plus subtle `x`. Three `PixelCard`s absolutely positioned, fading/sliding in at 25/55/85% via `useTransform` on opacity + y. `will-change:transform`. Guarded with `useReducedMotion` (disables rotation, keeps fades).

**Brick Runner (`#challenge`)** — arcade bezel: thick bone border, gold inner rim, marquee "THE BRICK RUNNER" in Press Start 2P with crimson glow, CRT scanlines inside.
- `IntroForm`: Name (required) + Gender toggle (Builder / Adventurer / Neutral). Submit mounts `Game`.
- `Game` canvas 640×200, scaled via CSS `image-rendering: pixelated`, `aspect-ratio: 16/5`.
  - Fixed-timestep loop in `requestAnimationFrame`, dt clamped.
  - Player auto-runs; jump on `Space` / click / tap; gravity + short-hop.
  - Obstacles: grey concrete blocks, orange cones; spawn interval decays with score.
  - Collectibles: gold coin (+10), mini brick (+25).
  - Parallax: far skyline (charcoal→obsidian gradient + static pixel stars), mid buildings, near ground with tick marks.
  - Sprites drawn from small `number[][]` palettes in `sprites.ts`, colors swapped per gender variant.
  - `visibilitychange` pauses; cleanup removes listeners on unmount.
- Game over → panel with score + code from `rewards.ts`:
  - <150 → `CRIMSON5` (5%), 150–349 → `CRIMSON10` (10%), 350–699 → `BRICK20` (20%), ≥700 → `OBSIDIAN30` (30%).
- "Copy Code" → `navigator.clipboard.writeText`, sonner toast, `applyDiscount()` immediately updates checkout summary.
- "Play Again" resets state.

**Checkout (`#acquire`)** — two-column `PixelCard` on md+, stacked on mobile.
- Left: `PixelInput`s — Name, Delivery Address (textarea), Phone (regex `^[0-9+\-\s]{7,}$`), inline error text on submit.
- Right: Payment `PixelRadio` group:
  - bKash — pink accent border + inline SVG/CSS "bK" mark
  - Cash on Delivery
  - Credit/Debit Card — expands to reveal Card Number, Expiry, CVC pixel inputs (mock, no processing)
- Order Summary card: `1 × The Crimson Block  ৳9,999`, discount line `— {code} (−{n}%)` when applied, grand total.
- "Confirm Acquisition":
  1. Generate `CB-XXXX-XXXX` (random `[A-Z0-9]{4}-[A-Z0-9]{4}`).
  2. `addOrder({id,name,address,phone,method,code,percent,total,ts})` → persisted to `localStorage['crimson_orders']`.
  3. Launch `PixelConfetti` — hand-rolled canvas, chunky 6×6 blocks in crimson/gold/bone, gravity + drift, ~4s.
  4. Open `SuccessDialog` with Order ID, "Print Receipt" (`window.print()`), "Place Another Order" (resets form + closes).

**Footer** — solid `border-t-[3px] border-bone`, mono type. Left: `© 2026 THE CRIMSON BLOCK · ALL RIGHTS RESERVED.` Right: inline 8-bit SVG icons (LinkedIn / X / Instagram) hand-drawn on a pixel grid + tribute "A tribute made at Grameenphone Academy."

## 6. Assets & dependencies

- Generate `src/assets/brick.png` with `imagegen` premium, transparent background: isometric crimson clay brick, chunky pixel art, gold specular highlights, obsidian shadow.
- Add `framer-motion` if not present (`bun add framer-motion`). Sonner is already available.
- All other visuals (sprites, confetti, plinth, arcade bezel, social icons) are procedural CSS/SVG/canvas — no extra image assets.

## 7. Performance, a11y, responsiveness

- Only `transform`/`opacity` in scroll and game animations; `will-change: transform` on the sticky brick.
- `prefers-reduced-motion` disables the specs rotation loop and confetti (fallback: static burst).
- Real semantic elements: `<button>`, `<input>` + `<label>`, `<nav>`, `<main>`, `<footer>`. Focus rings are chunky gold outlines. Color pairs verified for WCAG AA against `--charcoal` and `--obsidian`.
- Mobile: header collapses to hamburger; hero stacks; specs section shortens to `h-[220vh]`; game canvas uses `ResizeObserver` and tap-to-jump; checkout collapses to one column.
- SEO: unique route `head()`, JSON-LD Product, alt text on the brick image, single H1.

## Build order

1. Tokens, fonts, scanline, pixel utilities.
2. `CrimsonProvider` + UI primitives.
3. Header, Footer, Hero (+ generate brick asset).
4. SpecsScroll.
5. Brick Runner (IntroForm → Game → rewards → apply code).
6. Checkout + PixelConfetti + SuccessDialog.
7. SEO + reduced-motion + mobile pass + visual QA.
