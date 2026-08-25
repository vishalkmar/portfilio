import { useEffect, useRef } from "react";

/**
 * A rotating 3D tag cloud.
 *
 * Deliberately CSS-3D rather than WebGL: the labels stay real DOM text, so
 * they are selectable, screen-reader friendly and crisp at any DPR, and the
 * section does not have to pay for a second WebGL context.
 *
 * Tags are spread with a Fibonacci lattice (even coverage, no clustering at
 * the poles), spun on every frame, then projected to 2D with depth driving
 * scale, opacity and blur.
 */
export default function TagSphere({ tags = [], radius = 170, className = "" }) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || tags.length === 0) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Fibonacci lattice -> evenly spaced points on a unit sphere
    const golden = Math.PI * (3 - Math.sqrt(5));
    const points = tags.map((_, i) => {
      const y = 1 - (i / Math.max(tags.length - 1, 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
    });

    let angleX = 0.3;
    let angleY = 0;
    let speedX = 0.0012;
    let speedY = 0.0025;
    let frame;
    let running = true;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      // pointer steers the spin instead of snapping the sphere around
      speedY = nx * 0.012;
      speedX = -ny * 0.012;
    };

    const onPointerLeave = () => {
      speedX = 0.0012;
      speedY = 0.0025;
    };

    const render = () => {
      if (!running) return;
      angleX += speedX;
      angleY += speedY;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      points.forEach((p, i) => {
        const el = itemRefs.current[i];
        if (!el) return;

        // rotate around Y then X
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // perspective: things behind the centre shrink and fade
        const depth = (z2 + 1) / 2; // 0 = far, 1 = near
        const scale = 0.55 + depth * 0.65;
        const opacity = 0.25 + depth * 0.75;

        el.style.transform = `translate3d(${x1 * radius}px, ${y2 * radius}px, 0) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.filter = depth < 0.4 ? `blur(${(0.4 - depth) * 3}px)` : "none";
      });

      frame = requestAnimationFrame(render);
    };

    // one static layout pass, then animate only if motion is welcome
    render();
    if (reduced) {
      running = false;
      cancelAnimationFrame(frame);
    } else {
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [tags, radius]);

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto flex items-center justify-center ${className}`}
      style={{ width: radius * 2.5, height: radius * 2.5, perspective: "900px" }}
    >
      {/* glow core */}
      <div className="pointer-events-none absolute h-40 w-40 rounded-full bg-gradient-to-r from-accent/30 to-secondary/30 blur-3xl" />

      <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="absolute whitespace-nowrap rounded-full border border-accent/25 bg-card/70 px-3 py-1 text-xs font-semibold text-foreground/90 backdrop-blur-sm transition-colors duration-300 hover:border-accent hover:text-accent"
            style={{ willChange: "transform, opacity" }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
