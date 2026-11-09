import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { GraduationCap, CalendarDays, Award } from "lucide-react";
import { publicApi } from "@/lib/publicApi";
import { useRevealOnScroll, useTilt } from "@/hooks/use-gsap";
import { useTour } from "@/components/guide/tour-context";

const formatGrade = (it) => {
  if (!it.gradeValue && it.gradeType !== "Pursuing") return "";
  if (it.gradeType === "Pursuing") return "Pursuing";
  // some records already carry the unit inside the value ("73%", "Grade: 63.18%")
  const value = String(it.gradeValue).replace(/^grade:\s*/i, "").trim();
  if (it.gradeType === "Percentage") return value.includes("%") ? value : `${value}%`;
  if (it.gradeType === "Marks") return `${value} Marks`;
  return `${value} ${it.gradeType}`;
};

/**
 * Streams a fixed-length text in, like a chat model writing its reply.
 * Returns how many characters are visible; it never runs backwards.
 */
function useStream(length, start, { cps = 75, delay = 650 } = {}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || !length) return undefined;
    let raf = 0;
    let t0 = 0;
    const timer = setTimeout(() => {
      const step = (ts) => {
        if (!t0) t0 = ts;
        const n = Math.min(length, Math.floor(((ts - t0) / 1000) * cps));
        setCount((prev) => Math.max(prev, n));
        if (n < length) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [start, length, cps, delay]);

  return count;
}

/**
 * Shows `text` up to `count - from` characters. The rest is still laid out
 * but invisible, so the card keeps its final size while it is written.
 */
function Streamed({ text, from, count }) {
  const shown = Math.max(0, Math.min(text.length, count - from));
  const writing = shown > 0 && shown < text.length;
  return (
    <>
      {text.slice(0, shown)}
      {writing && <span className="stream-caret" aria-hidden="true" />}
      <span className="opacity-0">{text.slice(shown)}</span>
    </>
  );
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-accent"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

function TimelineCard({ edu, side, active, reached }) {
  const tiltRef = useTilt({ max: 6, scale: 1.01 });
  const grade = formatGrade(edu);

  const degree = edu.degree || "";
  const institution = edu.institution || "";
  const description = edu.description || "";
  const total = degree.length + institution.length + description.length;
  const count = useStream(total, reached);

  const headDone = count >= degree.length + institution.length;
  const allDone = count >= total;

  return (
    <div className="[perspective:1100px]">
      <article
        ref={tiltRef}
        data-edu-card
        data-edu-side={side}
        data-edu-degree={degree}
        data-edu-institution={institution}
        className={`group relative overflow-hidden rounded-2xl border bg-card/70 p-6 backdrop-blur-md transition-all duration-500 hover:border-accent/70 ${
          active ? "border-accent/80 shadow-[0_0_40px_-10px_rgba(0,217,255,0.6)]" : "border-border"
        }`}
        style={{ "--glare-opacity": 0, "--glare-x": "50%", "--glare-y": "50%" }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: "var(--glare-opacity)",
            background:
              "radial-gradient(280px circle at var(--glare-x) var(--glare-y), rgba(139,92,246,0.14), transparent 65%)",
          }}
        />

        {/* chat-style status line above the reply */}
        <div className="relative mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-accent to-secondary text-[9px] font-black text-white">
            AI
          </span>
          {count === 0 ? (
            <>
              <span>{reached ? "Thinking" : "Waiting for the guide"}</span>
              <ThinkingDots />
            </>
          ) : allDone ? (
            <span className="text-accent">Done</span>
          ) : (
            <span className="text-accent">Writing…</span>
          )}
        </div>

        <div className="relative flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent to-secondary opacity-50 blur-md transition-opacity duration-500 group-hover:opacity-90" />
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-background ring-1 ring-border">
              {edu.image ? (
                <img src={edu.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <GraduationCap className="h-7 w-7 text-accent" />
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold leading-snug text-foreground transition-colors group-hover:text-accent md:text-lg">
              <Streamed text={degree} from={0} count={count} />
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              <Streamed text={institution} from={degree.length} count={count} />
            </p>

            <motion.div
              initial={false}
              animate={{ opacity: headDone ? 1 : 0, y: headDone ? 0 : 6 }}
              transition={{ duration: 0.4 }}
              className="mt-3 flex flex-wrap items-center gap-2"
            >
              {(edu.startDate || edu.endDate) && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  <CalendarDays className="h-3 w-3" />
                  {edu.startDate}
                  {edu.endDate ? ` — ${edu.endDate}` : ""}
                </span>
              )}
              {grade && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
                  <Award className="h-3 w-3" />
                  {grade}
                </span>
              )}
            </motion.div>
          </div>
        </div>

        {description && (
          <p className="relative mt-4 text-sm leading-relaxed text-muted-foreground">
            <Streamed text={description} from={degree.length + institution.length} count={count} />
          </p>
        )}
      </article>
    </div>
  );
}

export default function Education() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const timelineRef = useRef(null);
  const { activeEdu, reachedEdu } = useTour();

  useEffect(() => {
    publicApi
      .education()
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scopeRef = useRevealOnScroll("[data-reveal]", { y: 45, stagger: 0.1 }, [items]);

  // the spine fills as the timeline scrolls past
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 60%"],
  });
  const spine = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });

  return (
    <section id="education" ref={scopeRef} className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span
            data-reveal
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary"
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Academics
          </span>
          <h2 data-reveal className="mb-4 text-4xl font-extrabold md:text-6xl">
            Education <span className="gradient-text">Journey</span>
          </h2>
          <p data-reveal className="text-base leading-relaxed text-muted-foreground md:text-lg">
            From a CBSE classroom in Delhi to an MCA in Artificial Intelligence — the path
            that built the foundation everything else is written on.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-muted-foreground">Loading…</div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <GraduationCap className="mx-auto mb-3 h-12 w-12" />
            No education entries yet.
          </div>
        ) : (
          <div ref={timelineRef} className="relative mx-auto max-w-5xl">
            {/* spine — left rail on mobile, centred on desktop */}
            <div className="absolute left-[19px] top-0 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2">
              <motion.div
                className="h-full w-full origin-top bg-gradient-to-b from-accent via-secondary to-accent"
                style={{ scaleY: spine }}
              />
            </div>

            <div className="space-y-10 md:space-y-14">
              {items.map((edu, index) => {
                const side = index % 2 === 0 ? "left" : "right";
                return (
                  <div
                    key={edu._id}
                    data-reveal
                    className="relative pl-14 md:grid md:grid-cols-2 md:gap-12 md:pl-0"
                  >
                    {/* node */}
                    <span className="absolute left-[10px] top-6 z-10 flex h-5 w-5 items-center justify-center md:left-1/2 md:-translate-x-1/2">
                      <span className="absolute h-5 w-5 animate-ping rounded-full bg-accent/40" />
                      <span className="relative h-3 w-3 rounded-full bg-gradient-to-r from-accent to-secondary ring-4 ring-background" />
                    </span>

                    {side === "left" ? (
                      <>
                        <TimelineCard edu={edu} side="left" active={activeEdu === index} reached={reachedEdu >= index} />
                        <div className="hidden md:block" />
                      </>
                    ) : (
                      <>
                        <div className="hidden md:block" />
                        <TimelineCard edu={edu} side="right" active={activeEdu === index} reached={reachedEdu >= index} />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
