import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ACCENT = new THREE.Color("#00D9FF");
const SECONDARY = new THREE.Color("#8B5CF6");

/* Same soft round dot as the page backdrop, so the hero reads as part of
   the same sky rather than a separate widget. */
const DOT_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    float pulse = 0.6 + 0.4 * sin(uTime * 2.0 + aPhase);
    vAlpha = 0.45 + 0.55 * pulse;

    gl_PointSize = aSize * uPixelRatio * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const DOT_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float alpha = pow(core, 2.0) + pow(core, 6.0) * 0.7;
    gl_FragColor = vec4(vColor, alpha * vAlpha);
  }
`;

function useDotUniforms() {
  return useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: {
        value: Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio, 2),
      },
    }),
    []
  );
}

/** A ring of dots orbiting on its own tilted plane. */
function OrbitRing({ radius, count, tilt, speed, color, dotSize }) {
  const group = useRef();
  const material = useRef();
  const uniforms = useDotUniforms();

  const { positions, colors, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const c = new THREE.Color(color);

    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2;
      // a little jitter so the ring reads as a band of dust, not a drawn line
      const r = radius + (Math.random() - 0.5) * 0.12;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 2] = Math.sin(angle) * r;

      const bright = 0.55 + Math.random() * 0.45;
      colors[i * 3] = c.r * bright;
      colors[i * 3 + 1] = c.g * bright;
      colors[i * 3 + 2] = c.b * bright;

      sizes[i] = dotSize * (0.5 + Math.random() * 0.9);
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, colors, sizes, phases };
  }, [radius, count, color, dotSize]);

  useFrame((state, delta) => {
    if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (group.current) group.current.rotation.y += delta * speed;
  });

  return (
    <group rotation={tilt}>
      <points ref={group}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-aColor" count={count} array={colors} itemSize={3} />
          <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
          <bufferAttribute attach="attributes-aPhase" count={count} array={phases} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          vertexShader={DOT_VERT}
          fragmentShader={DOT_FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/** A loose spherical shell of dots that surrounds the portrait. */
function DotShell({ count = 420, radius = 2.5 }) {
  const points = useRef();
  const material = useRef();
  const uniforms = useDotUniforms();

  const { positions, colors, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const r = radius + (Math.random() - 0.5) * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const c = Math.random() > 0.5 ? ACCENT : SECONDARY;
      const bright = 0.35 + Math.random() * 0.5;
      colors[i * 3] = c.r * bright;
      colors[i * 3 + 1] = c.g * bright;
      colors[i * 3 + 2] = c.b * bright;

      sizes[i] = 0.035 + Math.random() * 0.05;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, colors, sizes, phases };
  }, [count, radius]);

  useFrame((state, delta) => {
    if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (!points.current) return;
    points.current.rotation.y += delta * 0.08;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aColor" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" count={count} array={phases} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={DOT_VERT}
        fragmentShader={DOT_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Orb() {
  const group = useRef();

  // the whole assembly leans towards the pointer for a bit of parallax
  useFrame((state) => {
    if (!group.current) return;
    const { pointer } = state;
    group.current.rotation.y += (pointer.x * 0.3 - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (-pointer.y * 0.25 - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group}>
      <DotShell />
      <OrbitRing
        radius={2.7}
        count={190}
        tilt={[Math.PI / 2.6, 0, 0.25]}
        speed={0.32}
        color="#00D9FF"
        dotSize={0.075}
      />
      <OrbitRing
        radius={3.05}
        count={210}
        tilt={[Math.PI / 2.1, 0.5, -0.4]}
        speed={-0.22}
        color="#8B5CF6"
        dotSize={0.065}
      />
      <OrbitRing
        radius={2.45}
        count={150}
        tilt={[Math.PI / 3.4, -0.7, 0.6]}
        speed={0.42}
        color="#00D9FF"
        dotSize={0.055}
      />
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
        camera={{ position: [0, 0, 6.4], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Orb />
        </Suspense>
      </Canvas>
    </div>
  );
}
