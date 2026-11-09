import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * A chat bubble whose lines type themselves out one character at a time.
 * `onDone` fires once the last character lands, which is when `children`
 * (usually action buttons) are revealed.
 */
export default function SpeechBubble({ lines, onDone, onTypingChange, children, tail = "bottom", className = "" }) {
  const full = lines.join("\n");
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    onTypingChange?.(true);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= full.length) {
        clearInterval(timer);
        onTypingChange?.(false);
        onDone?.();
      }
    }, 26);
    return () => clearInterval(timer);
    // restart only when the message itself changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full]);

  const typed = full.slice(0, count);
  const done = count >= full.length;

  const tailClass = {
    bottom: "left-1/2 -bottom-1.5 -translate-x-1/2",
    "bottom-right": "right-10 -bottom-1.5",
    "bottom-left": "left-10 -bottom-1.5",
    left: "-left-1.5 top-8",
    right: "-right-1.5 top-8",
  }[tail];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 6, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`pointer-events-auto relative w-max rounded-2xl border border-accent/40 bg-[#0b0f24]/95 px-4 py-3 leading-relaxed text-foreground shadow-2xl shadow-accent/20 ${className}`}
    >
      <span className={`absolute h-3 w-3 rotate-45 border-b border-r border-accent/40 bg-[#0b0f24] ${tailClass}`} />
      <p className="relative whitespace-pre-line">
        {typed}
        {!done && <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-accent" />}
      </p>
      {done && children && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-3 flex flex-wrap gap-2"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
