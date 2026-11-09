import { useEffect } from "react";
import { motion } from "framer-motion";

/*
 * Theatre curtain in the site's own palette: deep indigo velvet with cyan
 * and violet light catching the crest of each pleat.
 *
 * Each fold is two layers:
 *   - outer (framer-motion) only translates, for the open/gather move
 *   - inner (pure CSS) carries the cloth: an idle sway whose phase is offset
 *     per fold so a wave travels across the curtain, and a one-shot "drag"
 *     ripple while it is pulled open.
 * Keeping the cloth motion in CSS keeps it on the compositor, so it stays
 * smooth even while the page's WebGL scenes are rendering underneath.
 */

const FOLDS = 8;
const HALF = 50; // vw
const STEP = HALF / FOLDS;
const FOLD_W = STEP * 1.6; // overlap so no seams show
const GATHERED_STEP = 1.25; // vw between folds once bunched at the edge
export const CURTAIN_OPEN_MS = 2300;

function Fold({ index, side, open }) {
  // index 0 sits at the outer edge, FOLDS-1 at the centre seam
  const closedX = index * STEP;
  const openX = index * GATHERED_STEP - 1;
  const fromCentre = FOLDS - 1 - index;
  const dir = side === "left" ? 1 : -1;

  return (
    <motion.div
      className="absolute top-0 h-full will-change-transform"
      style={{ width: `${FOLD_W}vw`, [side]: 0, zIndex: index }}
      initial={false}
      animate={{ x: `${dir * (open ? openX : closedX)}vw` }}
      transition={
        open
          ? { duration: 1.55, delay: fromCentre * 0.05, ease: [0.65, 0, 0.3, 1] }
          : { duration: 0 }
      }
    >
      <div
        className={`curtain-fold ${open ? "is-dragging" : ""}`}
        style={{ "--i": index, "--dir": dir, "--d": fromCentre * 0.05 }}
      />
    </motion.div>
  );
}

export default function CinemaCurtain({ open, onOpened }) {
  useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => onOpened?.(), CURTAIN_OPEN_MS);
    return () => clearTimeout(t);
  }, [open, onOpened]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] overflow-hidden"
      initial={false}
      animate={{ opacity: open ? 0 : 1 }}
      transition={open ? { duration: 0.6, delay: 1.6, ease: "easeOut" } : { duration: 0 }}
      style={{ pointerEvents: open ? "none" : "auto" }}
    >
      {/* stage behind the curtain, only seen through the seam */}
      {!open && <div className="absolute inset-0 bg-[#03040c]" />}

      {["left", "right"].map((side) => (
        <div key={side} className="absolute top-0 h-full w-1/2" style={{ [side]: 0 }}>
          {Array.from({ length: FOLDS }, (_, i) => (
            <Fold key={i} index={i} side={side} open={open} />
          ))}
        </div>
      ))}

      {/* light leaking through the centre seam */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2"
        style={{
          background: "linear-gradient(180deg, transparent, #00D9FF 30%, #8B5CF6 70%, transparent)",
          boxShadow: "0 0 24px 6px rgba(0,217,255,0.35)",
        }}
        animate={{ opacity: open ? 0 : [0.5, 0.9, 0.5], scaleX: open ? 8 : 1 }}
        transition={open ? { duration: 0.5 } : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* soft sheen gliding across the velvet */}
      {!open && <div aria-hidden="true" className="curtain-sheen pointer-events-none absolute inset-0" />}

      {/* spotlight pool behind the guide */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background:
            "radial-gradient(ellipse 30% 50% at 50% 58%, rgba(0,217,255,0.16), transparent 70%), radial-gradient(ellipse 50% 30% at 50% 100%, rgba(139,92,246,0.25), transparent 70%)",
        }}
      />

      {/* valance across the top */}
      <motion.div
        className="absolute inset-x-0 top-0 z-20"
        initial={false}
        animate={{ y: open ? "-115%" : 0 }}
        transition={{ duration: 1, delay: open ? 0.9 : 0, ease: [0.7, 0, 0.3, 1] }}
      >
        <div
          className="h-[9vh] min-h-[56px]"
          style={{
            background: [
              "radial-gradient(120% 100% at 50% 0%, #2a2f86 0%, #1b1f5c 45%, #0d1030 66%, transparent 67%)",
              "linear-gradient(180deg, #05060f 0%, #12153f 100%)",
            ].join(","),
            backgroundSize: "12.5vw 100%, 100% 60%",
            backgroundRepeat: "repeat-x, no-repeat",
          }}
        />
        {/* glowing trim instead of gold fringe */}
        <div
          className="h-[3px]"
          style={{
            background: "linear-gradient(90deg, #8B5CF6, #00D9FF 50%, #8B5CF6)",
            boxShadow: "0 0 18px 2px rgba(0,217,255,0.45)",
          }}
        />
      </motion.div>

      {/* floor shadow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
    </motion.div>
  );
}
