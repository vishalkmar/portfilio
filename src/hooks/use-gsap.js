import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scroll-triggered stagger reveal.
 *
 * Returns a ref for the section wrapper; every descendant matching
 * `selector` animates in as the section enters the viewport.
 *
 * `deps` matters: these sections render from API data, so the reveal has to
 * be rebuilt once the items actually exist in the DOM.
 */
export function useRevealOnScroll(selector = "[data-reveal]", options = {}, deps = []) {
  const scopeRef = useRef(null);

  const {
    y = 60,
    opacity = 0,
    scale = 1,
    duration = 0.8,
    stagger = 0.08,
    start = "top 85%",
  } = options;

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return undefined;

    const targets = scope.querySelectorAll(selector);
    if (!targets.length) return undefined;

    if (prefersReducedMotion()) {
      gsap.set(targets, { clearProps: "all", opacity: 1, y: 0, scale: 1 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, opacity, scale },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration,
          stagger,
          ease: "power3.out",
          scrollTrigger: { trigger: scope, start, once: true },
        }
      );
    }, scope);

    // layout settles after images/fonts land
    ScrollTrigger.refresh();

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}

/**
 * Pointer-driven 3D tilt for a card. Attach the returned ref to the element
 * you want to tilt; it rotates towards the cursor and eases back on exit.
 */
export function useTilt({ max = 10, scale = 1.02, glare = true } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    // coarse pointers have no hover, so tilt would only ever fight the scroll
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;

    const quickX = gsap.quickTo(el, "rotationX", { duration: 0.4, ease: "power2.out" });
    const quickY = gsap.quickTo(el, "rotationY", { duration: 0.4, ease: "power2.out" });

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      quickY(px * max * 2);
      quickX(-py * max * 2);
      if (glare) {
        el.style.setProperty("--glare-x", `${(px + 0.5) * 100}%`);
        el.style.setProperty("--glare-y", `${(py + 0.5) * 100}%`);
      }
    };

    const onEnter = () => {
      gsap.to(el, { scale, duration: 0.35, ease: "power2.out" });
      el.style.setProperty("--glare-opacity", "1");
    };

    const onLeave = () => {
      quickX(0);
      quickY(0);
      gsap.to(el, { scale: 1, duration: 0.45, ease: "power2.out" });
      el.style.setProperty("--glare-opacity", "0");
    };

    gsap.set(el, { transformPerspective: 900, transformStyle: "preserve-3d" });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [max, scale, glare]);

  return ref;
}

/**
 * Counts a number up when it scrolls into view.
 */
export function useCountUp(target, { duration = 1.6 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (prefersReducedMotion()) {
      el.textContent = String(target);
      return undefined;
    }

    const state = { value: 0 };
    const ctx = gsap.context(() => {
      gsap.to(state, {
        value: target,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = String(Math.round(state.value));
        },
      });
    });

    return () => ctx.revert();
  }, [target, duration]);

  return ref;
}
