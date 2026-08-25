import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const ACCENT = "#00D9FF";
const SECONDARY = "#8B5CF6";

/* ------------------------------------------------------------------ */
/* A slowly drifting starfield. The whole cloud parallaxes with the     */
/* pointer and rolls forward as the page scrolls.                       */
/* ------------------------------------------------------------------ */
function StarField({ count = 1400, scrollRef }) {
  const points = useRef();

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const accent = new THREE.Color(ACCENT);
    const secondary = new THREE.Color(SECONDARY);
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i += 1) {
      // spherical shell so the camera always sits inside the cloud
      const radius = 6 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const roll = Math.random();
      const c = roll > 0.75 ? accent : roll > 0.5 ? secondary : white;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 0.06 + 0.02;
    }
    return { positions, colors, sizes };
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    const { pointer } = state;
    points.current.rotation.y += delta * 0.018;
    points.current.rotation.x += delta * 0.006;
    // pointer parallax, eased so it never snaps
    points.current.position.x +=
      (pointer.x * 0.9 - points.current.position.x) * 0.02;
    points.current.position.y +=
      (pointer.y * 0.6 - points.current.position.y) * 0.02;
    // scroll pushes the cloud towards the camera
    points.current.position.z = (scrollRef.current || 0) * 5;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.085}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Wireframe solids that hang in the background and tumble very slowly. */
/* ------------------------------------------------------------------ */
function FloatingSolid({ geometry, position, color, speed, scale, scrollRef }) {
  const mesh = useRef();
  const seed = useMemo(() => Math.random() * 100, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime + seed;
    mesh.current.rotation.x += delta * speed;
    mesh.current.rotation.y += delta * speed * 0.7;
    mesh.current.position.y = position[1] + Math.sin(t * 0.4) * 0.5;
    mesh.current.position.z =
      position[2] + (scrollRef.current || 0) * 3;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      {geometry}
      <meshBasicMaterial color={color} wireframe transparent opacity={0.16} />
    </mesh>
  );
}

function Solids({ scrollRef }) {
  return (
    <>
      <FloatingSolid
        geometry={<icosahedronGeometry args={[1, 1]} />}
        position={[-5.0, 1.6, -6]}
        color={ACCENT}
        speed={0.12}
        scale={1.3}
        scrollRef={scrollRef}
      />
      <FloatingSolid
        geometry={<torusGeometry args={[1, 0.32, 12, 40]} />}
        position={[5.2, -1.6, -8]}
        color={SECONDARY}
        speed={0.16}
        scale={0.85}
        scrollRef={scrollRef}
      />
      <FloatingSolid
        geometry={<octahedronGeometry args={[1, 0]} />}
        position={[3.2, 2.4, -7]}
        color={ACCENT}
        speed={0.2}
        scale={0.9}
        scrollRef={scrollRef}
      />
      <FloatingSolid
        geometry={<dodecahedronGeometry args={[1, 0]} />}
        position={[-3.6, -2.2, -6]}
        color={SECONDARY}
        speed={0.14}
        scale={0.85}
        scrollRef={scrollRef}
      />
    </>
  );
}

/* Nudges the camera with the pointer for a little extra depth. */
function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.25 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
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
          <StarField scrollRef={scrollRef} />
          <Solids scrollRef={scrollRef} />
          <CameraRig />
        </Suspense>
      </Canvas>
      {/* keeps text readable over the busiest part of the field */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_45%,rgba(5,5,10,0.45)_100%)]" />
    </div>
  );
}
