export function launchPixelConfetti(duration = 4000) {
  if (typeof window === "undefined") return;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:80;image-rendering:pixelated;";
  document.body.appendChild(canvas);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
  };
  resize();
  window.addEventListener("resize", resize);

  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;

  const colors = ["#d81f2a", "#ff3b47", "#d4af37", "#ece7d5"];
  const count = reduce ? 40 : 160;
  const size = 6 * dpr;
  const particles = Array.from({ length: count }, () => ({
    x: (Math.random() * window.innerWidth) * dpr,
    y: -Math.random() * 200 * dpr,
    vx: (Math.random() - 0.5) * 4 * dpr,
    vy: (2 + Math.random() * 4) * dpr,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 0,
  }));

  const start = performance.now();
  let raf = 0;

  function frame(now: number) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.vy += 0.15 * dpr;
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), size, size);
    }
    if (elapsed < duration) raf = requestAnimationFrame(frame);
    else cleanup();
  }

  function cleanup() {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    canvas.remove();
  }

  raf = requestAnimationFrame(frame);
  if (reduce) setTimeout(cleanup, 800);
}
