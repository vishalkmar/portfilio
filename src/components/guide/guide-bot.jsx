import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue } from "framer-motion";

/*
 * "Byte" — the site's tour guide. Pure SVG, so it stays crisp at any size
 * and every limb can be animated independently.
 *
 * Arms are drawn hanging straight down from the shoulder; a rotation of
 * +90 swings the LEFT arm out to point left, -90 swings the RIGHT arm out
 * to point right.
 */

const SPRING = { type: "spring", stiffness: 140, damping: 12 };
const LOOP = (duration) => ({ duration, repeat: Infinity, ease: "easeInOut" });

const POSES = {
  idle: { left: 14, right: -14 },
  wave: { left: 14, right: [-150, -115, -150, -115, -150], rightLoop: 1.4 },
  push: { left: [86, 80, 86], right: [-86, -80, -86], leftLoop: 0.6, rightLoop: 0.6 },
  celebrate: { left: [155, 125, 155], right: [-155, -125, -155], leftLoop: 0.7, rightLoop: 0.7 },
  sad: { left: 4, right: -4 },
  "point-left": { left: [88, 100, 88], right: -12, leftLoop: 0.9, finger: "left", look: -4 },
  "point-right": { left: 12, right: [-88, -100, -88], rightLoop: 0.9, finger: "right", look: 4 },
  "point-up-left": { left: [140, 150, 140], right: -12, leftLoop: 0.9, finger: "left", look: -3 },
};

/**
 * Rotation is driven through the SVG `transform` attribute rather than CSS,
 * so it pivots exactly on the shoulder (the local origin) in every browser.
 */
function Arm({ rotate, loop, finger }) {
  const first = Array.isArray(rotate) ? rotate[0] : rotate;
  const angle = useMotionValue(first);
  const group = useRef(null);
  const key = JSON.stringify(rotate);

  useEffect(() => {
    const apply = (v) => group.current?.setAttribute("transform", `rotate(${v})`);
    apply(angle.get());
    return angle.on("change", apply);
  }, [angle]);

  useEffect(() => {
    let controls = animate(angle, first, SPRING);
    if (Array.isArray(rotate)) {
      // settle into the pose, then keep gesturing
      controls.then(() => {
        controls = animate(angle, rotate, LOOP(loop || 1));
      });
    }
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, loop]);

  return (
    <g ref={group}>
      <rect x="-7" y="0" width="14" height="42" rx="7" fill="url(#bot-limb)" />
      {/* index finger, only extended while pointing */}
      <motion.rect
        x="-3.5"
        y="50"
        width="7"
        rx="3.5"
        fill="url(#bot-shell)"
        stroke="#a5b4fc"
        strokeWidth="1.2"
        initial={false}
        animate={{ height: finger ? 20 : 0, opacity: finger ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />
      <circle cx="0" cy="46" r="11" fill="url(#bot-shell)" stroke="#a5b4fc" strokeWidth="1.5" />
    </g>
  );
}

export default function GuideBot({ pose = "idle", talking = false, className = "" }) {
  const p = POSES[pose] || POSES.idle;

  return (
    <svg viewBox="0 0 200 240" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="bot-shell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c7d2fe" />
        </linearGradient>
        <linearGradient id="bot-limb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#8b9bb8" />
        </linearGradient>
        <linearGradient id="bot-visor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0b1024" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="bot-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#00D9FF" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="bot-glow">
          <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g>
        {/* jet flames */}
        <ellipse cx="100" cy="205" rx="44" ry="16" fill="url(#bot-glow)" />
        {[85, 115].map((cx, i) => (
          <motion.ellipse
            key={cx}
            cx={cx}
            cy="200"
            rx="6"
            fill="url(#bot-flame)"
            animate={{ ry: [10, 15, 9, 14, 10] }}
            transition={{ duration: 0.35, repeat: Infinity, delay: i * 0.12 }}
          />
        ))}
        <rect x="77" y="180" width="16" height="12" rx="4" fill="url(#bot-limb)" />
        <rect x="107" y="180" width="16" height="12" rx="4" fill="url(#bot-limb)" />

        {/* antenna */}
        <line x1="100" y1="32" x2="100" y2="14" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        <motion.circle
          cx="100"
          cy="11"
          r="6"
          fill="#00D9FF"
          animate={{ opacity: [1, 0.4, 1], r: [6, 7, 6] }}
          transition={LOOP(1.6)}
          style={{ filter: "drop-shadow(0 0 6px #00D9FF)" }}
        />

        {/* ears */}
        <rect x="45" y="52" width="11" height="26" rx="5" fill="#8B5CF6" />
        <rect x="144" y="52" width="11" height="26" rx="5" fill="#8B5CF6" />

        {/* head */}
        <rect x="54" y="30" width="92" height="72" rx="28" fill="url(#bot-shell)" stroke="#ffffff" strokeOpacity="0.7" />
        <rect x="64" y="45" width="72" height="44" rx="18" fill="url(#bot-visor)" />

        {/* eyes: glance towards whatever is being pointed at, and blink */}
        <g transform={`translate(${p.look || 0} 0)`} style={{ transition: "transform 0.4s" }}>
          {[87, 113].map((cx) => (
            <motion.ellipse
              key={cx}
              cx={cx}
              cy="64"
              rx="6.5"
              fill="#00D9FF"
              style={{ filter: "drop-shadow(0 0 4px #00D9FF)" }}
              animate={{ ry: [8, 8, 1, 8] }}
              transition={{ duration: 4, times: [0, 0.92, 0.96, 1], repeat: Infinity }}
            />
          ))}
          <circle cx="89" cy="61" r="2" fill="#ffffff" />
          <circle cx="115" cy="61" r="2" fill="#ffffff" />
        </g>

        {/* mouth: chatters while the bubble is typing */}
        {talking ? (
          <motion.ellipse
            cx="100"
            cy="80"
            rx="7"
            fill="#00D9FF"
            animate={{ ry: [2, 5, 1.5, 4.5, 2] }}
            transition={{ duration: 0.45, repeat: Infinity }}
          />
        ) : (
          <path d="M91 77 Q100 85 109 77" stroke="#00D9FF" strokeWidth="3" strokeLinecap="round" fill="none" />
        )}
        <circle cx="72" cy="80" r="4" fill="#f472b6" opacity="0.55" />
        <circle cx="128" cy="80" r="4" fill="#f472b6" opacity="0.55" />

        {/* neck + body */}
        <rect x="90" y="100" width="20" height="10" rx="3" fill="url(#bot-limb)" />
        <rect x="62" y="106" width="76" height="78" rx="26" fill="url(#bot-shell)" stroke="#ffffff" strokeOpacity="0.7" />
        <rect x="78" y="124" width="44" height="30" rx="10" fill="url(#bot-visor)" />
        <motion.text
          x="100"
          y="144"
          textAnchor="middle"
          fontSize="14"
          fontWeight="800"
          fontFamily="ui-monospace, monospace"
          fill="#00D9FF"
          animate={{ opacity: [1, 0.55, 1] }}
          transition={LOOP(2)}
        >
          &lt;/&gt;
        </motion.text>
        <circle cx="86" cy="166" r="3" fill="#8B5CF6" />
        <circle cx="100" cy="166" r="3" fill="#00D9FF" />
        <circle cx="114" cy="166" r="3" fill="#f472b6" />

        {/* arms */}
        <g transform="translate(60 116)">
          <Arm rotate={p.left} loop={p.leftLoop} finger={p.finger === "left"} />
        </g>
        <g transform="translate(140 116)">
          <Arm rotate={p.right} loop={p.rightLoop} finger={p.finger === "right"} />
        </g>
      </g>
    </svg>
  );
}
