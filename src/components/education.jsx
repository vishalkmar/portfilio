import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { GraduationCap, CalendarDays, Award } from "lucide-react";
import { publicApi } from "@/lib/publicApi";
import { useRevealOnScroll, useTilt } from "@/hooks/use-gsap";

const formatGrade = (it) => {
  if (!it.gradeValue && it.gradeType !== "Pursuing") return "";
  if (it.gradeType === "Pursuing") return "Pursuing";
  // some records already carry the unit inside the value ("73%", "Grade: 63.18%")
  const value = String(it.gradeValue).replace(/^grade:\s*/i, "").trim();
  if (it.gradeType === "Percentage") return value.includes("%") ? value : `${value}%`;
  if (it.gradeType === "Marks") return `${value} Marks`;
  return `${value} ${it.gradeType}`;
};

function TimelineCard({ edu, side }) {
  const tiltRef = useTilt({ max: 6, scale: 1.01 });
  const [expanded, setExpanded] = useState(false);
  const grade = formatGrade(edu);

  return (
    <div className="[perspective:1100px]">
      <article
        ref={tiltRef}
        className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-md transition-colors duration-500 hover:border-accent/70"
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
              {edu.degree}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{edu.institution}</p>

            <div className={`mt-3 flex flex-wrap items-center gap-2 ${side === "right" ? "" : "md:justify-start"}`}>
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
            </div>
          </div>
        </div>

        {edu.description && (
          <div className="relative mt-4">
            <p
              className={`text-sm leading-relaxed text-muted-foreground ${
                expanded ? "" : "line-clamp-3"
              }`}
            >
              {edu.description}
            </p>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 text-xs font-semibold text-accent transition-opacity hover:opacity-75"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          </div>
        )}
      </article>
    </div>
  );
}

export default function Education() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const timelineRef = useRef(null);

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
                        <TimelineCard edu={edu} side="left" />
                        <div className="hidden md:block" />
                      </>
                    ) : (
                      <>
                        <div className="hidden md:block" />
                        <TimelineCard edu={edu} side="right" />
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
