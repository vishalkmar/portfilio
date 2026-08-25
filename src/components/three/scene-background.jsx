import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ACCENT = new THREE.Color("#00D9FF");
const SECONDARY = new THREE.Color("#8B5CF6");
const WHITE = new THREE.Color("#ffffff");

/* ------------------------------------------------------------------ */
/* Star shader                                                          */
/*                                                                      */
/* three's default pointsMaterial draws hard square sprites, which is   */
/* what made the old field read as scattered pixels. This draws a soft  */
/* round dot with a radial falloff and gives every star its own twinkle */
/* phase, so the sky has depth and never looks static.                  */
/* ------------------------------------------------------------------ */
const STAR_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aTwinkle;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // aTwinkle controls how hard this star pulses; far ones stay steadier
    float pulse = 1.0 - aTwinkle * 0.5 + aTwinkle * 0.5 * sin(uTime * 1.6 + aPhase);
    vAlpha = 0.35 + 0.65 * pulse;

    gl_PointSize = aSize * uPixelRatio * (320.0 / -mvPosition.z) * (0.75 + pulse * 0.25);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const STAR_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;

    // tight core plus a wider, fainter halo
    float core = smoothstep(0.5, 0.0, d);
    float alpha = pow(core, 2.2) + pow(core, 6.0) * 0.6;

    gl_FragColor = vec4(vColor, alpha * vAlpha);
  }
`;

function StarField({ count = 2200, scrollRef }) {
  const points = useRef();
  const material = useRef();

  const { positions, colors, sizes, phases, twinkles } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const twinkles = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      // three depth bands: a few big near stars over a dense far haze
      const band = Math.random();
      const radius =
        band < 0.18
          ? 7 + Math.random() * 5
          : band < 0.6
          ? 12 + Math.random() * 9
          : 21 + Math.random() * 14;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const roll = Math.random();
      const c = roll > 0.82 ? ACCENT : roll > 0.66 ? SECONDARY : WHITE;
      // near stars keep full colour, far ones wash towards the background
      const fade = band < 0.18 ? 1 : band < 0.6 ? 0.75 : 0.45;
      colors[i * 3] = c.r * fade;
      colors[i * 3 + 1] = c.g * fade;
      colors[i * 3 + 2] = c.b * fade;

      sizes[i] =
        band < 0.18
          ? 0.1 + Math.random() * 0.07
          : band < 0.6
          ? 0.05 + Math.random() * 0.04
          : 0.03 + Math.random() * 0.025;
      phases[i] = Math.random() * Math.PI * 2;
      twinkles[i] = band < 0.18 ? 0.9 : band < 0.6 ? 0.6 : 0.3;
    }

    return { positions, colors, sizes, phases, twinkles };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: {
        value: Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio, 1.75),
      },
    }),
    []
  );

  useFrame((state, delta) => {
    if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (!points.current) return;

    const { pointer } = state;
    points.current.rotation.y += delta * 0.012;
    points.current.rotation.x += delta * 0.004;

    // eased pointer parallax
    points.current.position.x += (pointer.x * 1.1 - points.current.position.x) * 0.02;
    points.current.position.y += (pointer.y * 0.7 - points.current.position.y) * 0.02;
    // scrolling drifts the whole sky towards the camera
    points.current.position.z = (scrollRef.current || 0) * 6;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aColor" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" count={count} array={phases} itemSize={1} />
        <bufferAttribute attach="attributes-aTwinkle" count={count} array={twinkles} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={STAR_VERT}
        fragmentShader={STAR_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Nebula                                                               */
/*                                                                      */
/* This is what replaced the tumbling wireframe solids: soft coloured   */
/* clouds that drift behind the stars and give the sky depth without    */
/* ever putting a hard edge behind the text.                            */
/* ------------------------------------------------------------------ */
const NEBULA_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const NEBULA_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;

  void main() {
    float d = length(vUv - 0.5);

    // slow breathing so the cloud is never perfectly still
    float breathe = 0.42 + 0.06 * sin(uTime * 0.25 + uSeed);
    float alpha = smoothstep(breathe, 0.0, d);
    alpha = pow(alpha, 2.6) * 0.3;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

function Nebula({ color, position, scale, seed, speed, scrollRef }) {
  const mesh = useRef();
  const material = useRef();

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uTime: { value: 0 },
      uSeed: { value: seed },
    }),
    [color, seed]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (material.current) material.current.uniforms.uTime.value = t;
    if (!mesh.current) return;
    mesh.current.position.x = position[0] + Math.sin(t * speed + seed) * 1.2;
    mesh.current.position.y = position[1] + Math.cos(t * speed * 0.8 + seed) * 0.9;
    mesh.current.position.z = position[2] + (scrollRef.current || 0) * 4;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={NEBULA_VERT}
        fragmentShader={NEBULA_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/**
 * Fixed, full-viewport 3D backdrop that sits behind every section.
 * Renders nothing at all when the visitor prefers reduced motion or the
 * device is too small to spend the frames on it.
 */
export default function SceneBackground() {
  const scrollRef = useRef(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tooSmall = window.innerWidth < 640;
    setEnabled(!reduced && !tooSmall);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.body.scrollHeight - window.innerHeight;
        scrollRef.current = max > 0 ? window.scrollY / max : 0;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  if (!enabled) {
    // static gradient stand-in so the page never looks unfinished
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(0,217,255,0.10),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.12),transparent_45%)]"
      />
    );
  }

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Nebula
            color="#00D9FF"
            position={[-6, 2.5, -12]}
            scale={22}
            seed={0.6}
            speed={0.12}
            scrollRef={scrollRef}
          />
          <Nebula
            color="#8B5CF6"
            position={[7, -3, -14]}
            scale={26}
            seed={2.4}
            speed={0.09}
            scrollRef={scrollRef}
          />
          <StarField scrollRef={scrollRef} />
        </Suspense>
      </Canvas>
      {/* keeps text readable over the busiest part of the field */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_50%,rgba(5,5,10,0.5)_100%)]" />
    </div>
  );
}
