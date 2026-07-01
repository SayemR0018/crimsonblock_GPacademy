export type Gender = "builder" | "adventurer" | "neutral";

// Simple color palettes per variant
export const PALETTE: Record<Gender, {
  skin: string; hair: string; body: string; accent: string; hat: string;
}> = {
  builder:    { skin: "#f0c090", hair: "#3a2418", body: "#d4af37", accent: "#7a4a1e", hat: "#d81f2a" },
  adventurer: { skin: "#e8b585", hair: "#8b3a20", body: "#4a6b3a", accent: "#c9a84c", hat: "#2a1810" },
  neutral:    { skin: "#eac0a0", hair: "#2a2028", body: "#5a3a4a", accent: "#ece7d5", hat: "#d4af37" },
};

// 16x16 pixel character. 0 = transparent, then palette keys.
// Simple humanoid: hat top, head, torso with accent stripe, legs.
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  gender: Gender,
  frame: number,
) {
  const p = PALETTE[gender];
  const px = (dx: number, dy: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + dx, y + dy, w, h);
  };
  // hat (visor for builder, cap for adventurer, band for neutral)
  px(3, 0, 10, 2, p.hat);
  px(2, 2, 12, 1, p.hat);
  // head
  px(4, 3, 8, 5, p.skin);
  // hair strand
  px(4, 3, 8, 1, p.hair);
  // eyes
  px(6, 5, 1, 1, "#07070a");
  px(9, 5, 1, 1, "#07070a");
  // torso
  px(4, 8, 8, 5, p.body);
  // accent stripe
  px(4, 10, 8, 1, p.accent);
  // arms swing
  const armSwing = frame % 2 === 0 ? 0 : 1;
  px(3, 9 + armSwing, 1, 3, p.body);
  px(12, 9 - armSwing, 1, 3, p.body);
  // legs run animation
  if (frame % 2 === 0) {
    px(5, 13, 2, 3, p.accent);
    px(9, 13, 2, 2, p.accent);
  } else {
    px(5, 13, 2, 2, p.accent);
    px(9, 13, 2, 3, p.accent);
  }
  // feet
  px(4, 15, 3, 1, "#07070a");
  px(9, 15, 3, 1, "#07070a");
}

export function drawConcreteBlock(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = "#4a4a52";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#5a5a62";
  ctx.fillRect(x + 1, y + 1, w - 2, 2);
  ctx.fillStyle = "#2a2a30";
  ctx.fillRect(x, y + h - 2, w, 2);
  // pixel bumps
  ctx.fillStyle = "#3a3a42";
  for (let i = 2; i < w - 2; i += 4) {
    ctx.fillRect(x + i, y + 4, 1, 1);
    ctx.fillRect(x + i + 1, y + 8, 1, 1);
  }
}

export function drawCone(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // 12 wide, 16 tall
  ctx.fillStyle = "#e85d1a";
  // triangle-ish
  const steps = [
    [5, 0, 2],
    [4, 2, 4],
    [3, 4, 6],
    [2, 6, 8],
    [1, 8, 10],
    [0, 10, 12],
  ];
  for (const [dx, dy, w] of steps) ctx.fillRect(x + dx, y + dy, w, 2);
  // white bands
  ctx.fillStyle = "#ece7d5";
  ctx.fillRect(x + 2, y + 8, 8, 1);
  ctx.fillRect(x + 1, y + 11, 10, 1);
  // base
  ctx.fillStyle = "#2a2a30";
  ctx.fillRect(x, y + 14, 12, 2);
}

export function drawCoin(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  const w = frame % 20 < 10 ? 8 : 4;
  const offset = (8 - w) / 2;
  ctx.fillStyle = "#d4af37";
  ctx.fillRect(x + offset, y, w, 8);
  ctx.fillStyle = "#f5d76e";
  ctx.fillRect(x + offset, y + 1, w, 1);
  ctx.fillStyle = "#8b7a20";
  ctx.fillRect(x + offset, y + 6, w, 1);
}

export function drawMiniBrick(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "#d81f2a";
  ctx.fillRect(x, y, 10, 6);
  ctx.fillStyle = "#ff3b47";
  ctx.fillRect(x + 1, y + 1, 8, 1);
  ctx.fillStyle = "#8a1520";
  ctx.fillRect(x, y + 5, 10, 1);
  ctx.fillStyle = "#d4af37";
  ctx.fillRect(x, y, 1, 1);
  ctx.fillRect(x + 9, y, 1, 1);
}
