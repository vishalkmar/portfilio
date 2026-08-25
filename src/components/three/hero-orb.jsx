import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ACCENT = "#00D9FF";
const SECONDARY = "#8B5CF6";

/** Two counter-rotating wireframe shells that orbit the avatar. */
function Shells() {
  const outer = useRef();
  const inner = useRef();
  const knot = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (outer.current) {
      outer.current.rotation.y += delta * 0.25;
      outer.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.4;
      inner.current.rotation.z += delta * 0.15;
    }
    if (knot.current) {
      knot.current.rotation.x += delta * 0.3;
      knot.current.rotation.y += delta * 0.2;
      knot.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.04);
    }
  });

  return (
    <group>
      <mesh ref={outer}>
        <icosahedronGeometry args={[2.35, 1]} />
        <meshBasicMaterial
          color={ACCENT}
          wireframe
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={inner}>
        <icosahedronGeometry args={[2.05, 0]} />
        <meshBasicMaterial
          color={SECONDARY}
          wireframe
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={knot} position={[0, 0, -1.2]}>
        <torusKnotGeometry args={[1.5, 0.06, 128, 12]} />
        <meshBasicMaterial
          color={ACCENT}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/**
 * Sits behind the hero portrait. Falls back to a plain glow when motion is
 * reduced so the layout is identical either way.
 */
export default function HeroOrb({ className = "" }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!enabled) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-accent/30 to-secondary/30 blur-2xl ${className}`}
      />
    );
  }

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Shells />
        </Suspense>
      </Canvas>
    </div>
  );
}
