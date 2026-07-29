"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { scrollStore } from "../lib/scrollStore";

/* --------------------------------------------------------------------------
   A soft round sprite so every particle is a glowing pinprick, not a square.
-------------------------------------------------------------------------- */
function makeDotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* --------------------------------------------------------------------------
   Fine star dust — matches the app's ambient galaxy ("skin"): tiny scattered
   pinpricks in warm- and cool-white with the occasional faint gold, arranged
   as a soft, fluid nebula rather than a structured spiral. Drifts slowly and
   parallaxes gently with the pointer + scroll. Kept dim so text stays crisp.
-------------------------------------------------------------------------- */
function StarDust() {
  const points = useRef<THREE.Points>(null!);
  const { camera } = useThree();

  const COUNT = 12000;
  const CLUSTERS = 9;

  const warm = useMemo(() => new THREE.Color("#fbf8f0"), []);
  const cool = useMemo(() => new THREE.Color("#dce6f6"), []);
  const gold = useMemo(() => new THREE.Color("#c9a961"), []);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const c = new THREE.Color();

    // A handful of soft cluster centres give the field a fluid, nebular
    // clumping instead of a flat uniform scatter.
    const centres: [number, number, number][] = [];
    for (let k = 0; k < CLUSTERS; k++) {
      centres.push([
        (Math.random() - 0.5) * 26,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 - 2,
      ]);
    }

    const gauss = () =>
      (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;

      // ~55% clustered around a centre, the rest free scatter — organic, loose.
      if (Math.random() < 0.55) {
        const [cxp, cyp, czp] = centres[(Math.random() * CLUSTERS) | 0];
        const spread = 3 + Math.random() * 4;
        positions[i3] = cxp + gauss() * spread;
        positions[i3 + 1] = cyp + gauss() * spread * 0.7;
        positions[i3 + 2] = czp + gauss() * spread * 0.6;
      } else {
        positions[i3] = (Math.random() - 0.5) * 34;
        positions[i3 + 1] = (Math.random() - 0.5) * 20;
        positions[i3 + 2] = (Math.random() - 0.5) * 12 - 2;
      }

      // Colour: mostly whites, a cool third, a rare faint gold.
      const roll = Math.random();
      if (roll < 0.08) c.copy(gold);
      else if (roll < 0.4) c.copy(cool);
      else c.copy(warm);

      // Uniform dim brightness across the whole field — no bright "feature"
      // stars that would bloom into big blurry blobs. Every dot is an equal,
      // tiny pinprick; only the colour varies.
      const b = 0.42 + Math.random() * 0.22;
      colors[i3] = c.r * b;
      colors[i3 + 1] = c.g * b;
      colors[i3 + 2] = c.b * b;
    }
    return { positions, colors };
  }, [warm, cool, gold]);

  const dotTex = useMemo(() => makeDotTexture(), []);

  useFrame((state, delta) => {
    const s = scrollStore;
    const t = state.clock.elapsedTime;

    if (points.current) {
      // very slow, calm drift — ambient, never busy
      points.current.rotation.y = t * 0.012;
      points.current.rotation.x = -0.04 - s.progress * 0.12;
      points.current.position.y = s.progress * 1.6;
    }

    // gentle pointer parallax + a slow scroll dolly, eased each frame
    const targetX = s.px * 0.5;
    const targetY = s.py * 0.3 + 0.2;
    const targetZ = 9 + s.progress * 2;
    const k = Math.min(1, delta * 1.8);
    camera.position.x += (targetX - camera.position.x) * k;
    camera.position.y += (targetY - camera.position.y) * k;
    camera.position.z += (targetZ - camera.position.z) * k;
    camera.lookAt(0, Math.sin(t * 0.08) * 0.04, 0);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      {/* sizeAttenuation off → every dot is the SAME minuscule pixel size no
          matter its depth, so none swell up near the camera. */}
      <pointsMaterial
        size={2}
        sizeAttenuation={false}
        vertexColors
        map={dotTex}
        alphaMap={dotTex}
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function GalaxyBackground() {
  return (
    <div className="galaxy-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.2, 9], fov: 60 }}
      >
        <StarDust />
        {/* Gentle collective glow only — the high threshold means no single
            dot blooms into a blob; dense clusters just haze softly together. */}
        <EffectComposer>
          <Bloom
            intensity={0.32}
            luminanceThreshold={0.82}
            luminanceSmoothing={0.5}
            mipmapBlur
            radius={0.5}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
