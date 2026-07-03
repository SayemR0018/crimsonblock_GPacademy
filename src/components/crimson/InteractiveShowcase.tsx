import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { PixelCard } from "./ui/PixelCard";
import brickAsset from "@/assets/brick.glb.asset.json";

const MODEL_URL = brickAsset.url;
useGLTF.preload(MODEL_URL);

type Hotspot = {
  id: string;
  label: string;
  title: string;
  body: string;
  // normalised 3D position on the model (x, y, z after Center)
  position: [number, number, number];
};

const HOTSPOTS: Hotspot[] = [
  {
    id: "core",
    label: "THE CORE",
    title: "Thermal Kiln Vitrification",
    body: "Hardened at 1200°C to withstand economic downturns and market volatility.",
    position: [0, 0.55, 0.15],
  },
  {
    id: "facet",
    label: "THE FACET",
    title: "Zero-Radius Edges",
    body: "Precision-engineered right-angle geometry. Anti-aliased for ideal structural alignment.",
    position: [0.9, 0.05, 0.4],
  },
  {
    id: "base",
    label: "THE BASE",
    title: "Obsidian Grip Matrix",
    body: "Micro-textured foundation footprint for permanent architectural placement.",
    position: [-0.5, -0.5, 0.4],
  },
];

const DEFAULT_CAM: [number, number, number] = [2.2, 1.7, 2.6];
const DEFAULT_TARGET: [number, number, number] = [0, 0, 0];

// Shared mutable interaction state (avoids React re-renders in the frame loop)
type InteractState = {
  lastInteract: number; // performance.now() timestamp
  autoWeight: number; // 0..1, how much auto-orbit contributes
};

function BrickModel({
  interact,
  activeId,
}: {
  interact: React.MutableRefObject<InteractState>;
  activeId: string | null;
}) {
  const { scene } = useGLTF(MODEL_URL) as unknown as { scene: THREE.Group };
  const groupRef = useRef<THREE.Group>(null);
  const autoYawRef = useRef(0);

  // enhance materials once
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && "roughness" in mat) {
          mat.roughness = Math.min(1, (mat.roughness ?? 0.8) * 0.95);
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.getElapsedTime();
    const idleFor = (performance.now() - interact.current.lastInteract) / 1000;
    // ease auto weight: 0 while interacting, ramps to 1 after 2.5s idle
    const target = idleFor > 2.5 ? 1 : 0;
    interact.current.autoWeight += (target - interact.current.autoWeight) * 0.06;
    const w = interact.current.autoWeight;

    // gentle vertical float always on
    g.position.y = Math.sin(t * 1.5) * 0.12;

    // auto rotation contributes proportionally to w
    autoYawRef.current += 0.005 * w;
    // Blend rotation: when w=1, we drive rotation; when w=0, OrbitControls owns it
    if (w > 0.01) {
      g.rotation.y += 0.005 * w;
      g.rotation.x += (Math.sin(t * 0.6) * 0.08 - g.rotation.x) * 0.02 * w;
    }
  });

  return (
    <Center>
      <group
        ref={groupRef}
        scale={activeId ? 1.06 : 1}
      >
        <primitive object={scene} />
        {HOTSPOTS.map((h) => (
          <Hotspot3D key={h.id} hotspot={h} active={activeId === h.id} />
        ))}
      </group>
    </Center>
  );
}

function Hotspot3D({ hotspot, active }: { hotspot: Hotspot; active: boolean }) {
  return (
    <group position={hotspot.position}>
      <Html center distanceFactor={6} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <div
          className="relative flex items-center justify-center w-7 h-7"
          style={{ pointerEvents: "auto" }}
        >
          {!active && (
            <span
              aria-hidden
              className="absolute inset-0 bg-crimson/40 animate-ping"
            />
          )}
          <span
            className={`relative w-7 h-7 flex items-center justify-center bg-obsidian font-pixel text-[12px] ${
              active ? "text-crimson" : "text-gold"
            }`}
            style={{
              border: `2px solid ${active ? "var(--crimson)" : "var(--gold)"}`,
              boxShadow: active
                ? "0 0 0 2px var(--obsidian), 0 0 16px rgba(216,31,42,0.85)"
                : "0 0 0 2px var(--obsidian), 0 0 12px rgba(212,175,55,0.6)",
            }}
          >
            +
          </span>
        </div>
      </Html>
    </group>
  );
}

function CameraRig({
  resetSignal,
  controlsRef,
}: {
  resetSignal: number;
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();
  const anim = useRef<{
    active: boolean;
    start: number;
    duration: number;
    fromPos: THREE.Vector3;
    fromTarget: THREE.Vector3;
    toPos: THREE.Vector3;
    toTarget: THREE.Vector3;
  } | null>(null);

  useEffect(() => {
    if (!resetSignal) return;
    const controls = controlsRef.current;
    anim.current = {
      active: true,
      start: performance.now(),
      duration: 400,
      fromPos: camera.position.clone(),
      fromTarget: controls ? controls.target.clone() : new THREE.Vector3(),
      toPos: new THREE.Vector3(...DEFAULT_CAM),
      toTarget: new THREE.Vector3(...DEFAULT_TARGET),
    };
  }, [resetSignal, camera, controlsRef]);

  useFrame(() => {
    const a = anim.current;
    if (!a || !a.active) return;
    const t = Math.min(1, (performance.now() - a.start) / a.duration);
    // easeOutCubic
    const e = 1 - Math.pow(1 - t, 3);
    camera.position.lerpVectors(a.fromPos, a.toPos, e);
    const controls = controlsRef.current;
    if (controls) {
      controls.target.lerpVectors(a.fromTarget, a.toTarget, e);
      controls.update();
    }
    if (t >= 1) a.active = false;
  });

  return null;
}

function LoaderOverlay() {
  return (
    <Html center>
      <div
        className="font-pixel text-[10px] md:text-[11px] text-gold uppercase tracking-widest whitespace-nowrap"
        style={{
          textShadow: "2px 2px 0 var(--obsidian)",
        }}
      >
        DECODING VOXEL MESH...
      </div>
    </Html>
  );
}

export function InteractiveShowcase() {
  const [active, setActive] = useState<Hotspot | null>(null);
  const [engaged, setEngaged] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const interactRef = useRef<InteractState>({
    lastInteract: -Infinity, // start in idle/auto mode
    autoWeight: 1,
  });
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const engagedTimer = useRef<number | null>(null);

  const bumpInteract = useCallback(() => {
    interactRef.current.lastInteract = performance.now();
    setEngaged(true);
    if (engagedTimer.current) window.clearTimeout(engagedTimer.current);
    engagedTimer.current = window.setTimeout(() => setEngaged(false), 2600);
  }, []);

  useEffect(() => {
    return () => {
      if (engagedTimer.current) window.clearTimeout(engagedTimer.current);
    };
  }, []);

  const handleReset = () => {
    setActive(null);
    setResetSignal((n) => n + 1);
  };

  return (
    <section id="artifact-viewer" className="relative bg-obsidian py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <div className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-gold">
            § 03 — Interactive
          </div>
          <h2 className="font-pixel text-bone text-lg md:text-2xl mt-3 drop-shadow-[2px_2px_0_rgba(0,0,0,0.9)]">
            INTERACTIVE ARTIFACT ANALYSIS
          </h2>
        </div>

        <div
          className="bg-charcoal p-6 md:p-10"
          style={{
            border: "3px solid var(--bone)",
            boxShadow: "4px 4px 0px 0px var(--obsidian)",
          }}
        >
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 md:gap-10 items-stretch">
            <div
              className="relative pixel-border overflow-hidden select-none"
              style={{
                background: "#14141a",
                aspectRatio: "4 / 3",
                cursor: "grab",
                touchAction: "none",
              }}
              onPointerDown={bumpInteract}
              onPointerMove={(e) => {
                if (e.buttons > 0) bumpInteract();
              }}
              onWheel={bumpInteract}
              onMouseEnter={bumpInteract}
              onTouchStart={bumpInteract}
            >
              {/* Grid backdrop */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.06] pointer-events-none z-10"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--bone) 1px, transparent 1px), linear-gradient(90deg, var(--bone) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Crimson aura */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 55%, rgba(216,31,42,0.35) 0%, rgba(216,31,42,0.12) 32%, transparent 65%)",
                }}
              />

              <Canvas
                dpr={[1, 2]}
                gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
                camera={{ position: DEFAULT_CAM, fov: 35, near: 0.1, far: 100 }}
                style={{ position: "absolute", inset: 0, willChange: "transform" }}
                shadows
              >
                <ambientLight intensity={0.55} />
                <hemisphereLight args={["#ffe6c2", "#1a0308", 0.35]} />
                <spotLight
                  position={[4, 6, 4]}
                  angle={0.5}
                  penumbra={0.6}
                  intensity={1.6}
                  color="#fff2d6"
                  castShadow
                />
                <spotLight
                  position={[-3, 2, -3]}
                  angle={0.7}
                  penumbra={0.9}
                  intensity={0.9}
                  color="#ff3b47"
                />

                <Suspense fallback={<LoaderOverlay />}>
                  <BrickModel interact={interactRef} activeId={active?.id ?? null} />
                </Suspense>

                <OrbitControls
                  ref={controlsRef as unknown as React.Ref<OrbitControlsImpl>}
                  enablePan={false}
                  enableZoom={false}
                  enableDamping
                  dampingFactor={0.08}
                  rotateSpeed={0.9}
                  minPolarAngle={Math.PI / 6}
                  maxPolarAngle={Math.PI / 1.6}
                  onStart={bumpInteract}
                  onChange={bumpInteract}
                />

                <CameraRig resetSignal={resetSignal} controlsRef={controlsRef} />
              </Canvas>

              {/* Drag hint */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-bone/70 pointer-events-none z-20">
                <MouseIcon />
                CLICK & DRAG TO EXAMINE
              </div>

              {/* Status readout */}
              <div className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-widest text-gold/80 pointer-events-none z-20">
                {engaged ? "◆ TRACKING" : "◇ AUTO ORBIT"}
              </div>
            </div>

            {/* Right column: data readout */}
            <div className="flex flex-col gap-4">
              <PixelCard tone="gold" className="p-5 md:p-6 flex-1 bg-obsidian/80">
                <div className="font-pixel text-[10px] text-gold uppercase tracking-widest mb-3">
                  ◆ DATA READOUT
                </div>
                {active ? (
                  <div className="animate-fade-in">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-crimson mb-2">
                      {active.label}
                    </div>
                    <div className="font-pixel text-[12px] md:text-[13px] leading-[1.6] text-bone">
                      {active.title}
                    </div>
                    <p className="mt-3 font-mono text-[12px] leading-relaxed text-bone/80">
                      {active.body}
                    </p>
                    <button
                      onClick={() => setActive(null)}
                      className="mt-6 font-pixel text-[9px] text-gold uppercase tracking-widest hover:text-crimson transition-colors"
                    >
                      ◀ CLEAR SIGNAL
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="font-pixel text-[12px] md:text-[13px] leading-[1.6] text-bone">
                      Awaiting Signal.
                    </div>
                    <p className="mt-3 font-mono text-[12px] leading-relaxed text-bone/70">
                      Click and drag to rotate the artifact in 3D. Select a hotspot
                      below to reveal its classified specification.
                    </p>
                    <ul className="mt-5 space-y-2 font-mono text-[11px] text-bone/60">
                      {HOTSPOTS.map((h) => (
                        <li key={h.id}>
                          <button
                            onClick={() => setActive(h)}
                            className="w-full text-left flex items-center gap-2 hover:text-gold transition-colors uppercase tracking-widest"
                          >
                            <span className="text-gold">+</span>
                            {h.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </PixelCard>

              <button
                onClick={handleReset}
                className="w-full font-pixel text-[10px] uppercase tracking-widest bg-charcoal text-bone hover:text-gold py-3 transition-colors"
                style={{
                  border: "2px solid var(--gold)",
                  boxShadow: "3px 3px 0 0 var(--obsidian)",
                }}
              >
                ▲ RESET VIEWPORT
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MouseIcon() {
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" aria-hidden>
      <rect x="1" y="1" width="10" height="14" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="5" y="3" width="2" height="4" fill="currentColor" />
    </svg>
  );
}
