import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import brickAsset from "@/assets/brick.glb.asset.json";

const MODEL_URL = brickAsset.url;
useGLTF.preload(MODEL_URL);

type Hotspot = {
  id: string;
  label: string;
  title: string;
  body: string;
  position: [number, number, number];
};

const HOTSPOTS: Hotspot[] = [
  {
    id: "core",
    label: "THE CORE",
    title: "Thermal Kiln Vitrification",
    body: "Core matrix hardened at 1200°C inside a sealed obsidian kiln for 72 hours — vitrifying the silica lattice into a monolithic thermal shield that laughs at recessions, sanctions, and market corrections. Log signature: KILN-Δ1200-72H.",
    position: [0, 0.55, 0.15],
  },
  {
    id: "facet",
    label: "THE FACET",
    title: "Zero-Radius Edges",
    body: "Precision-milled 90.00° corner facets, anti-aliased to a tolerance of ±0.02mm. Every edge is a right angle — no rounded compromises, no softened commercial curves. Interlocks flawlessly with adjacent units for architectural alignment across an entire foundation grid. Log signature: FACET-R0-AA.",
    position: [0.9, 0.05, 0.4],
  },
  {
    id: "base",
    label: "THE BASE",
    title: "Obsidian Grip Matrix",
    body: "The underside is stamped with a proprietary micro-textured grip matrix: 4,096 micro-cells per square inch that lock into any mortar, epoxy, or vacuum footprint. Once placed, the block is permanent — architectural memory encoded at the sub-millimeter scale. Log signature: BASE-OGM-4K.",
    position: [-0.5, -0.5, 0.4],
  },
];

const DEFAULT_CAM: [number, number, number] = [2.2, 1.7, 2.6];
const DEFAULT_TARGET: [number, number, number] = [0, 0, 0];

type InteractState = { lastInteract: number; autoWeight: number; locked: boolean };

function BrickModel({
  interact,
  activeId,
  hoverId,
  onHover,
  onClick,
}: {
  interact: React.MutableRefObject<InteractState>;
  activeId: string | null;
  hoverId: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}) {
  const { scene } = useGLTF(MODEL_URL) as unknown as { scene: THREE.Group };
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.getElapsedTime();
    const idleFor = (performance.now() - interact.current.lastInteract) / 1000;
    const shouldAuto = !interact.current.locked && idleFor > 2.5;
    const target = shouldAuto ? 1 : 0;
    interact.current.autoWeight += (target - interact.current.autoWeight) * 0.06;
    const w = interact.current.autoWeight;

    // Cinematic zero-gravity levitation — layered harmonic sinewaves
    g.position.y = Math.sin(t * 1.2) * 0.18 * (0.3 + 0.7 * w);
    g.position.x = Math.sin(t * 0.7) * 0.05 * w;
    const targetRotX = Math.sin(t * 0.6) * 0.05;
    const targetRotZ = Math.cos(t * 0.5) * 0.04;
    g.rotation.x += (targetRotX * w - g.rotation.x) * 0.05;
    g.rotation.z += (targetRotZ * w - g.rotation.z) * 0.05;
    if (w > 0.01) {
      g.rotation.y += 0.004 * w;
    }
  });

  return (
    <Center>
      <group ref={groupRef}>
        <primitive object={scene} />
        {HOTSPOTS.map((h) => (
          <MicroHotspot
            key={h.id}
            hotspot={h}
            active={activeId === h.id}
            hovered={hoverId === h.id}
            onHover={onHover}
            onClick={onClick}
          />
        ))}
      </group>
    </Center>
  );
}

function MicroHotspot({
  hotspot,
  active,
  hovered,
  onHover,
  onClick,
}: {
  hotspot: Hotspot;
  active: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}) {
  // Visible when: parent frame hovered (group-hover), this dot hovered, or active
  return (
    <group position={hotspot.position}>
      <Html center distanceFactor={6} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <div
          className="relative flex items-center justify-center"
          style={{ pointerEvents: "auto" }}
          onMouseEnter={() => onHover(hotspot.id)}
          onMouseLeave={() => onHover(null)}
          onClick={(e) => {
            e.stopPropagation();
            onClick(hotspot.id);
          }}
        >
          {/* Hover micro-label */}
          <div
            className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap transition-opacity ease-out ${
              hovered ? "opacity-100 duration-150" : "opacity-0 duration-150"
            }`}
          >
            <span
              className="font-mono text-[8px] uppercase tracking-[0.15em] text-amber-200"
              style={{ textShadow: "0 0 6px rgba(0,0,0,0.9), 1px 1px 0 rgba(0,0,0,0.9)" }}
            >
              {hotspot.label}
            </span>
          </div>

          {/* Active pulse ring */}
          {active && (
            <span
              aria-hidden
              className="absolute w-4 h-4 rounded-full border border-amber-300/70 animate-ping"
              style={{ pointerEvents: "none" }}
            />
          )}

          {/* Micro-dot — invisible by default, visible on frame hover / self hover / active */}
          <button
            type="button"
            aria-label={hotspot.label}
            className={`w-2.5 h-2.5 rounded-full bg-amber-400 cursor-pointer transition-all ease-out duration-300 will-change-[transform,opacity] opacity-0 group-hover/canvas:opacity-100 ${
              hovered ? "opacity-100 scale-125" : ""
            } ${active ? "opacity-100 scale-150 bg-crimson" : ""}`}
            style={{
              boxShadow: active
                ? "0 0 12px rgba(216,31,42,0.95), 0 0 4px rgba(0,0,0,0.9)"
                : "0 0 8px rgba(251,191,36,0.8)",
            }}
          />
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
        style={{ textShadow: "2px 2px 0 var(--obsidian)" }}
      >
        DECODING VOXEL MESH...
      </div>
    </Html>
  );
}

export function InteractiveShowcase() {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const interactRef = useRef<InteractState>({
    lastInteract: -Infinity,
    autoWeight: 1,
    locked: false,
  });
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const bumpInteract = useCallback(() => {
    interactRef.current.lastInteract = performance.now();
  }, []);

  const handleHotspotClick = useCallback((id: string) => {
    setActiveId((prev) => {
      const next = prev === id ? null : id;
      interactRef.current.locked = next !== null;
      interactRef.current.lastInteract = performance.now();
      return next;
    });
  }, []);

  const handleReset = () => {
    setActiveId(null);
    setHoverId(null);
    interactRef.current.locked = false;
    setResetSignal((n) => n + 1);
  };

  const activeSpot = HOTSPOTS.find((h) => h.id === activeId) ?? null;

  return (
    <section id="interactive-analysis" className="relative bg-obsidian py-20 md:py-28 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <div className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-gold">
            § 03 — Interactive
          </div>
          <h2 className="font-pixel text-bone text-lg md:text-2xl mt-3 drop-shadow-[2px_2px_0_rgba(0,0,0,0.9)]">
            INTERACTIVE ARTIFACT ANALYSIS
          </h2>
        </div>

        <div
          className="bg-charcoal p-4 md:p-8"
          style={{
            border: "3px solid var(--bone)",
            boxShadow: "8px 8px 0px 0px var(--obsidian)",
          }}
        >
          <div
            className="group/canvas relative pixel-border overflow-hidden select-none mx-auto"
            style={{
              background: "#14141a",
              aspectRatio: "16 / 10",
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
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.06] pointer-events-none z-10"
              style={{
                backgroundImage:
                  "linear-gradient(var(--bone) 1px, transparent 1px), linear-gradient(90deg, var(--bone) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
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
                <BrickModel
                  interact={interactRef}
                  activeId={activeId}
                  hoverId={hoverId}
                  onHover={setHoverId}
                  onClick={handleHotspotClick}
                />
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
          </div>

          {/* Detached description readout — nested directly BELOW the canvas frame */}
          <div
            className={`mt-4 transition-all duration-300 ease-out will-change-[transform,opacity] ${
              activeSpot
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1 pointer-events-none"
            }`}
            aria-live="polite"
          >
            <div
              className="bg-obsidian/95 px-4 py-3 flex items-start gap-3"
              style={{
                border: "1px solid var(--gold)",
                outline: "1px solid var(--bone)",
                outlineOffset: "2px",
                boxShadow: "4px 4px 0 0 rgba(0,0,0,0.9)",
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[9px] uppercase tracking-widest text-crimson">
                  {activeSpot?.label ?? "—"}
                </div>
                <div className="font-pixel text-[10px] leading-[1.5] text-bone mt-1">
                  {activeSpot?.title ?? ""}
                </div>
                <div className="font-mono text-[11px] leading-relaxed text-bone/80 mt-2">
                  {activeSpot?.body ?? ""}
                </div>
              </div>
              <button
                type="button"
                aria-label="Close details"
                onClick={() => {
                  setActiveId(null);
                  interactRef.current.locked = false;
                }}
                className="font-pixel text-[10px] text-bone hover:text-crimson w-6 h-6 flex items-center justify-center transition-colors shrink-0"
                style={{ border: "1px solid var(--bone)" }}
              >
                ×
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleReset}
              className="font-pixel text-[10px] uppercase tracking-widest bg-charcoal text-bone hover:text-gold px-6 py-3 transition-all duration-300 ease-out will-change-[transform,opacity]"
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
