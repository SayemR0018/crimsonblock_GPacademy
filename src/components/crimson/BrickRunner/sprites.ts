export type Gender = "builder" | "adventurer" | "neutral";

// 0=transparent, 1=skin, 2=eyes, 3=accent, 4=secondary, 5=boots, 6=outline
export const HUMAN_RUNNER_SPRITE: number[][] = [
  [0,0,0,0,6,6,6,6,6,0,0,0,0,0,0,0],
  [0,0,0,6,3,3,3,3,3,6,0,0,0,0,0,0],
  [0,0,0,6,3,1,1,3,1,6,0,0,0,0,0,0],
  [0,0,0,6,1,1,1,1,1,6,0,0,0,0,0,0],
  [0,0,0,6,1,2,1,2,1,6,0,0,0,0,0,0],
  [0,0,0,6,1,1,1,1,1,6,0,0,0,0,0,0],
  [0,0,0,0,6,6,1,1,6,0,0,0,0,0,0,0],
  [0,0,0,6,4,4,4,4,4,6,0,0,0,0,0,0],
  [0,0,6,4,4,3,3,3,4,4,6,0,0,0,0,0],
  [0,0,6,4,4,4,4,4,4,4,6,0,0,0,0,0],
  [0,0,0,6,4,4,4,4,4,6,0,0,0,0,0,0],
  [0,0,0,0,6,5,5,5,6,0,0,0,0,0,0,0],
  [0,0,0,0,6,5,0,5,6,0,0,0,0,0,0,0],
  [0,0,0,0,6,5,0,5,6,0,0,0,0,0,0,0],
  [0,0,0,6,6,6,0,6,6,6,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Alt frame — legs swapped for running cycle
export const HUMAN_RUNNER_SPRITE_ALT: number[][] = [
  [0,0,0,0,6,6,6,6,6,0,0,0,0,0,0,0],
  [0,0,0,6,3,3,3,3,3,6,0,0,0,0,0,0],
  [0,0,0,6,3,1,1,3,1,6,0,0,0,0,0,0],
  [0,0,0,6,1,1,1,1,1,6,0,0,0,0,0,0],
  [0,0,0,6,1,2,1,2,1,6,0,0,0,0,0,0],
  [0,0,0,6,1,1,1,1,1,6,0,0,0,0,0,0],
  [0,0,0,0,6,6,1,1,6,0,0,0,0,0,0,0],
  [0,0,0,6,4,4,4,4,4,6,0,0,0,0,0,0],
  [0,0,6,4,4,3,3,3,4,4,6,0,0,0,0,0],
  [0,0,6,4,4,4,4,4,4,4,6,0,0,0,0,0],
  [0,0,0,6,4,4,4,4,4,6,0,0,0,0,0,0],
  [0,0,0,0,6,5,5,5,6,0,0,0,0,0,0,0],
  [0,0,0,6,5,0,0,0,5,6,0,0,0,0,0,0],
  [0,0,6,5,0,0,0,0,0,5,6,0,0,0,0,0],
  [0,0,6,6,0,0,0,0,0,6,6,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

type Palette = { 1: string; 2: string; 3: string; 4: string; 5: string; 6: string };

export const PALETTES: Record<Gender, Palette> = {
  // CRIMSON VANGUARD
  builder: {
    1: "#f0c090", // skin
    2: "#e6f2ff", // eyes
    3: "#d81f2a", // accent — crimson
    4: "#d4af37", // secondary — gold
    5: "#2a1810", // boots
    6: "#07070a", // outline
  },
  // OBSIDIAN OPERATIVE
  adventurer: {
    1: "#e8b585",
    2: "#9ad5ff",
    3: "#07070a", // accent — obsidian
    4: "#ff3b47", // secondary — crimson glow
    5: "#14141a",
    6: "#07070a",
  },
  neutral: {
    1: "#eac0a0",
    2: "#ece7d5",
    3: "#5a3a4a",
    4: "#d4af37",
    5: "#2a2028",
    6: "#07070a",
  },
};

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  gender: Gender,
  frame: number,
) {
  const palette = PALETTES[gender];
  const sprite = frame % 2 === 0 ? HUMAN_RUNNER_SPRITE : HUMAN_RUNNER_SPRITE_ALT;
  const scale = 1;
  for (let row = 0; row < sprite.length; row++) {
    const line = sprite[row];
    for (let col = 0; col < line.length; col++) {
      const v = line[col];
      if (v === 0) continue;
      ctx.fillStyle = palette[v as 1 | 2 | 3 | 4 | 5 | 6];
      ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
    }
  }
}

export function drawConcreteBlock(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = "#4a4a52";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#5a5a62";
  ctx.fillRect(x + 1, y + 1, w - 2, 2);
  ctx.fillStyle = "#2a2a30";
  ctx.fillRect(x, y + h - 2, w, 2);
  ctx.fillStyle = "#3a3a42";
  for (let i = 2; i < w - 2; i += 4) {
    ctx.fillRect(x + i, y + 4, 1, 1);
    ctx.fillRect(x + i + 1, y + 8, 1, 1);
  }
}

export function drawCone(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "#e85d1a";
  const steps: [number, number, number][] = [
    [5, 0, 2],
    [4, 2, 4],
    [3, 4, 6],
    [2, 6, 8],
    [1, 8, 10],
    [0, 10, 12],
  ];
  for (const [dx, dy, w] of steps) ctx.fillRect(x + dx, y + dy, w, 2);
  ctx.fillStyle = "#ece7d5";
  ctx.fillRect(x + 2, y + 8, 8, 1);
  ctx.fillRect(x + 1, y + 11, 10, 1);
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
