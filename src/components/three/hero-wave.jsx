import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTour } from "@/components/guide/tour-context";

/*
 * A field of glowing dots rolling like a sea swell along the bottom of the
 * hero. All motion happens in the vertex shader, so the CPU cost is one
 * uniform update per frame regardless of how many dots there are.
 */

const WAVE_VERT = /* glsl */ `
  attribute vec2 aGrid;      // 0..1 across (x) and deep (y)
  attribute float aPhase;

  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2 uPointer;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float t = uTime * 0.55;

    // layered swells, rising slightly towards the right like the reference
    float h = sin(p.x * 0.55 + t) * 0.45
            + sin(p.z * 0.9 + t * 1.3) * 0.25
            + sin((p.x + p.z) * 0.35 - t * 0.7) * 0.35
            + aGrid.x * 1.1;

    // the swell bulges gently towards the pointer
    float d = distance(vec2(aGrid.x, 1.0 - aGrid.y), uPointer * 0.5 + 0.5);
    h += smoothstep(0.35, 0.0, d) * 0.6;

    p.y += h;

    vec3 cyan = vec3(0.0, 0.85, 1.0);
    vec3 violet = vec3(0.55, 0.36, 0.96);
    vColor = mix(violet, cyan, smoothstep(0.1, 0.9, aGrid.x + h * 0.15));

    // fade the back rows and both side edges into the page
    float edge = smoothstep(0.0, 0.18, aGrid.x) * smoothstep(1.0, 0.82, aGrid.x);
    float depth = smoothstep(1.0, 0.25, aGrid.y);
    float twinkle = 0.7 + 0.3 * sin(uTime * 2.0 + aPhase);
    vAlpha = edge * depth * twinkle;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = 0.075 * uPixelRatio * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const WAVE_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, pow(core, 1.6) * vAlpha);
  }
`;

function Wave({ cols = 170, rows = 46, width = 26, depth = 9 }) {
  const material = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uPointer: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  const { positions, grid, phases, count } = useMemo(() => {
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const grid = new Float32Array(count * 2);
    const phases = new Float32Array(count);

    let i = 0;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const u = c / (cols - 1);
        const v = r / (rows - 1);
        positions[i * 3] = (u - 0.5) * width;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = -v * depth;
        grid[i * 2] = u;
        grid[i * 2 + 1] = v;
        phases[i] = Math.random() * Math.PI * 2;
        i += 1;
      }
    }
    return { positions, grid, phases, count };
  }, [cols, rows, width, depth]);

  useFrame((state) => {
    const m = material.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uPointer.value.lerp(state.pointer, 0.05);
  });

  return (
    <points position={[0, -1.6, 1]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aGrid" count={count} array={grid} itemSize={2} />
        <bufferAttribute attach="attributes-aPhase" count={count} array={phases} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={WAVE_VERT}
        fragmentShader={WAVE_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroWave({ className = "" }) {
  const { revealed } = useTour();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 ${className}`}
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, #000 35%, #000 80%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, #000 35%, #000 80%, transparent 100%)",
      }}
    >
      <Canvas
        frameloop={revealed ? "always" : "demand"}
        camera={{ position: [0, 1.4, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ camera }) => camera.lookAt(0, -0.6, -2)}
      >
        <Suspense fallback={null}>
          <Wave />
        </Suspense>
      </Canvas>
    </div>
  );
}
