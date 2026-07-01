import { useEffect, useRef, useState } from "react";
import {
  drawCoin,
  drawConcreteBlock,
  drawCone,
  drawMiniBrick,
  drawPlayer,
  type Gender,
} from "./sprites";

interface Props {
  gender: Gender;
  onGameOver: (score: number) => void;
}

const W = 640;
const H = 200;
const GROUND_Y = 172;
const GRAVITY = 0.6;
const JUMP_V = -10.5;

type Obstacle = { x: number; kind: "block" | "cone"; w: number; h: number };
type Collectible = { x: number; y: number; kind: "coin" | "brick"; taken?: boolean };

export function Game({ gender, onGameOver }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const rafRef = useRef<number | null>(null);
  const stateRef = useRef({ score: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    // Static stars
    const stars: { x: number; y: number; b: number }[] = [];
    for (let i = 0; i < 40; i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * 100, b: Math.random() > 0.5 ? 1 : 2 });
    }
    // Static skyline
    const skyline: { x: number; w: number; h: number }[] = [];
    let sx = 0;
    while (sx < W + 200) {
      const w = 20 + Math.floor(Math.random() * 40);
      const h = 30 + Math.floor(Math.random() * 45);
      skyline.push({ x: sx, w, h });
      sx += w + 4;
    }

    // Reset all mutable game state on every mount / restart.
    stateRef.current.score = 0;
    let scrollFar = 0;
    let scrollMid = 0;
    let scrollNear = 0;
    let player = { y: GROUND_Y - 16, vy: 0, onGround: true };
    const obstacles: Obstacle[] = [];
    const collectibles: Collectible[] = [];
    let obstacleTimer = 90;
    let collectibleTimer = 90;
    let frame = 0;
    // Locked, casual pace — no ramp, no acceleration across runs.
    const SPEED = 1.92;
    let alive = true;
    let paused = false;

    function jump() {
      if (player.onGround && alive && !paused) {
        player.vy = JUMP_V;
        player.onGround = false;
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    }
    function onPointer(e: PointerEvent) {
      e.preventDefault();
      jump();
    }
    function onVis() {
      paused = document.hidden;
    }

    window.addEventListener("keydown", onKey);
    canvas.addEventListener("pointerdown", onPointer);
    document.addEventListener("visibilitychange", onVis);

    function loop() {
      frame++;
      if (!paused && alive) {
        // physics
        player.vy += GRAVITY;
        player.y += player.vy;
        if (player.y >= GROUND_Y - 16) {
          player.y = GROUND_Y - 16;
          player.vy = 0;
          player.onGround = true;
        }

        // scroll
        scrollFar = (scrollFar + SPEED * 0.15) % W;
        scrollMid = (scrollMid + SPEED * 0.4) % W;
        scrollNear = (scrollNear + SPEED) % 16;

        // spawn obstacles
        obstacleTimer--;
        if (obstacleTimer <= 0) {
          const kind = Math.random() > 0.5 ? "block" : "cone";
          const w = kind === "block" ? 16 : 12;
          const h = kind === "block" ? 16 : 16;
          obstacles.push({ x: W + 20, kind, w, h });
          // wider spacing — avoids unavoidable combos. Constant across runs.
          obstacleTimer = 110 + Math.floor(Math.random() * 90);
        }
        for (const o of obstacles) o.x -= SPEED;
        while (obstacles.length && obstacles[0].x + obstacles[0].w < -4) obstacles.shift();

        // spawn collectibles
        collectibleTimer--;
        if (collectibleTimer <= 0) {
          const kind = Math.random() > 0.75 ? "brick" : "coin";
          const yOff = 30 + Math.floor(Math.random() * 60);
          collectibles.push({ x: W + 20, y: GROUND_Y - 16 - yOff, kind });
          collectibleTimer = 70 + Math.floor(Math.random() * 90);
        }
        for (const c of collectibles) c.x -= SPEED;
        while (collectibles.length && (collectibles[0].taken || collectibles[0].x < -12))
          collectibles.shift();

        // collect
        for (const c of collectibles) {
          if (c.taken) continue;
          if (
            c.x < 16 + 12 &&
            c.x + 10 > 12 &&
            c.y < player.y + 16 &&
            c.y + 8 > player.y
          ) {
            c.taken = true;
            stateRef.current.score += c.kind === "coin" ? 10 : 25;
          }
        }

        // collide — forgiving hitbox: tight around torso only
        for (const o of obstacles) {
          const px1 = 14, px2 = 14 + 8;
          const py1 = player.y + 5, py2 = player.y + 15;
          const ox1 = o.x + 3, ox2 = o.x + o.w - 3;
          const oy1 = GROUND_Y - o.h + 2, oy2 = GROUND_Y;
          if (px1 < ox2 && px2 > ox1 && py1 < oy2 && py2 > oy1) {
            alive = false;
            const finalScore = stateRef.current.score;
            setTimeout(() => {
              // Halt the RAF loop before handing control back so no leftover
              // frames leak into the next run.
              if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
              }
              onGameOver(finalScore);
            }, 700);
          }
        }

        // score over time — pace locked, no speed ramp.
        if (frame % 6 === 0) stateRef.current.score += 1;
      }

      // render
      // sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#07070a");
      grad.addColorStop(0.6, "#14141a");
      grad.addColorStop(1, "#1c1c24");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // stars (twinkle)
      for (const s of stars) {
        const on = (frame + Math.floor(s.x)) % 120 > 30;
        ctx.fillStyle = on ? "#ece7d5" : "#8a8a99";
        ctx.fillRect(s.x, s.y, s.b, s.b);
      }

      // far skyline
      ctx.save();
      ctx.translate(-scrollFar, 0);
      for (let pass = 0; pass < 2; pass++) {
        for (const b of skyline) {
          ctx.fillStyle = "#22222c";
          ctx.fillRect(b.x + pass * W, GROUND_Y - b.h, b.w, b.h);
          ctx.fillStyle = "#2c2c36";
          ctx.fillRect(b.x + pass * W, GROUND_Y - b.h, b.w, 2);
          // pixel windows
          for (let wy = GROUND_Y - b.h + 6; wy < GROUND_Y - 4; wy += 6) {
            for (let wx = b.x + 3; wx < b.x + b.w - 3; wx += 5) {
              if ((wx + wy + b.h) % 3 === 0) {
                ctx.fillStyle = "#d4af37";
                ctx.fillRect(wx + pass * W, wy, 2, 2);
              }
            }
          }
        }
      }
      ctx.restore();

      // ground line
      ctx.fillStyle = "#ece7d5";
      ctx.fillRect(0, GROUND_Y, W, 2);
      ctx.fillStyle = "#8a8a99";
      // tick marks
      for (let i = -16; i < W + 16; i += 16) {
        ctx.fillRect(i - scrollNear, GROUND_Y + 3, 6, 1);
      }
      ctx.fillStyle = "#14141a";
      ctx.fillRect(0, GROUND_Y + 2, W, H - GROUND_Y - 2);

      // obstacles
      for (const o of obstacles) {
        if (o.kind === "block") drawConcreteBlock(ctx, o.x, GROUND_Y - o.h, o.w, o.h);
        else drawCone(ctx, o.x, GROUND_Y - o.h);
      }

      // collectibles
      for (const c of collectibles) {
        if (c.taken) continue;
        if (c.kind === "coin") drawCoin(ctx, c.x, c.y, frame);
        else drawMiniBrick(ctx, c.x, c.y);
      }

      // player
      drawPlayer(ctx, 12, player.y, gender, Math.floor(frame / 6));

      // HUD
      ctx.fillStyle = "#ece7d5";
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(`SCORE ${String(stateRef.current.score).padStart(5, "0")}`, 8, 16);

      if (!alive) {
        ctx.fillStyle = "rgba(7,7,10,0.6)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#ff3b47";
        ctx.font = 'bold 20px "Press Start 2P", monospace';
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", W / 2, H / 2);
        ctx.textAlign = "left";
      }

      if (paused && alive) {
        ctx.fillStyle = "rgba(7,7,10,0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#ece7d5";
        ctx.font = 'bold 14px "Press Start 2P", monospace';
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", W / 2, H / 2);
        ctx.textAlign = "left";
      }

      // update react score display (throttled)
      if (frame % 6 === 0) setDisplayScore(stateRef.current.score);

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [gender, onGameOver]);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-between items-center font-pixel text-[10px] text-bone/70 uppercase tracking-widest">
        <span>▮ Live Score: <span className="text-gold">{displayScore}</span></span>
        <span className="hidden sm:inline">Space / Tap to Jump</span>
      </div>
      <div className="w-full border-[3px] border-bone bg-obsidian" style={{ boxShadow: "inset 0 0 0 3px var(--obsidian), inset 0 0 0 6px var(--gold)" }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="pixelated block w-full h-auto"
          style={{ aspectRatio: `${W} / ${H}`, imageRendering: "pixelated", touchAction: "manipulation" }}
        />
      </div>
    </div>
  );
}
