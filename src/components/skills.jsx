import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Sparkles } from "lucide-react";
import { publicApi } from "@/lib/publicApi";
import TagSphere from "@/components/tag-sphere";
import { useRevealOnScroll, useCountUp } from "@/hooks/use-gsap";

/** Tailwind cannot see `from-${x}`, so the gradients are mapped explicitly. */
const BAR_GRADIENT = {
  "from-blue-500 to-cyan-500": "linear-gradient(90deg,#3b82f6,#06b6d4)",
  "from-teal-500 to-cyan-500": "linear-gradient(90deg,#14b8a6,#06b6d4)",
  "from-green-500 to-emerald-500": "linear-gradient(90deg,#22c55e,#10b981)",
  "from-purple-500 to-violet-500": "linear-gradient(90deg,#a855f7,#8b5cf6)",
  "from-orange-500 to-red-500": "linear-gradient(90deg,#f97316,#ef4444)",
  "from-pink-500 to-rose-500": "linear-gradient(90deg,#ec4899,#f43f5e)",
  "from-indigo-500 to-blue-500": "linear-gradient(90deg,#6366f1,#3b82f6)",
  "from-yellow-500 to-amber-500": "linear-gradient(90deg,#eab308,#f59e0b)",
};
const gradientFor = (color) => BAR_GRADIENT[color] || BAR_GRADIENT["from-blue-500 to-cyan-500"];

function Stat({ value, label, suffix = "" }) {
  const ref = useCountUp(value);
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 px-4 py-3 text-center backdrop-blur-sm">
      <p className="text-2xl font-extrabold gradient-text">
        <span ref={ref}>0</span>
        {suffix}
      </p>
      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function SkillChip({ skill, color, index }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.015, 0.3) }}
      whileHover={{ y: -3 }}
      className="group/chip relative overflow-hidden rounded-xl border border-border/70 bg-card/60 p-2.5 backdrop-blur-sm transition-colors duration-300 hover:border-accent/70"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background/70 text-base ring-1 ring-border/60 transition-transform duration-300 group-hover/chip:scale-110">
          {skill.image ? (
            <img src={skill.image} alt="" className="h-5 w-5 object-contain" />
          ) : (
            <span aria-hidden="true">{skill.icon || "\u{1F527}"}</span>
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold leading-tight text-foreground/95 transition-colors group-hover/chip:text-accent">
            {skill.name}
          </span>
          <span className="mt-1 flex items-center gap-1.5">
            <span className="h-1 flex-1 overflow-hidden rounded-full bg-border/80">
              <motion.span
                className="block h-full rounded-full"
                style={{ background: gradientFor(color) }}
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.1 + Math.min(index * 0.02, 0.4), ease: "easeOut" }}
              />
            </span>
            <span className="w-7 shrink-0 text-right text-[10px] font-semibold tabular-nums text-muted-foreground">
              {skill.level}%
            </span>
          </span>
        </span>
      </div>
    </motion.li>
  );
}

export default function Skills() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("all");
  const headingRef = useRef(null);

  useEffect(() => {
    publicApi
      .skills()
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scopeRef = useRevealOnScroll("[data-reveal]", { y: 40, stagger: 0.06 }, [categories, active]);

  const allTags = useMemo(
    () => categories.flatMap((c) => (c.skills || []).map((s) => s.name)),
    [categories]
  );

  /**
   * 65 labels on one sphere is unreadable, so the cloud shows the four
   * strongest short-named skills per category. That keeps every domain
   * represented while leaving enough room between labels to read them.
   */
  const sphereTags = useMemo(
    () =>
      categories.flatMap((c) =>
        [...(c.skills || [])]
          .filter((s) => s.name.length <= 18)
          .sort((a, b) => b.level - a.level)
          .slice(0, 4)
          .map((s) => s.name)
      ),
    [categories]
  );

  const visible = useMemo(
    () => (active === "all" ? categories : categories.filter((c) => c._id === active)),
    [categories, active]
  );

  const totalSkills = allTags.length;

  return (
    <section
      id="skills"
      ref={scopeRef}
      className="relative overflow-hidden py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[15%] top-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-[10%] h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* ---------------- heading ---------------- */}
        <div ref={headingRef} className="mx-auto mb-14 max-w-3xl text-center">
          <motion.span
            data-reveal
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Tech Stack
          </motion.span>
          <h2 data-reveal className="mb-4 text-4xl font-extrabold md:text-6xl">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p data-reveal className="text-base leading-relaxed text-muted-foreground md:text-lg">
            The toolkit behind 10+ shipped platforms — from the language layer all the way
            up through databases, AI, security and the integrations that make products real.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-muted-foreground">Loading skills…</div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Wrench className="mx-auto mb-3 h-12 w-12" />
            No skills yet.
          </div>
        ) : (
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            {/* ------------- 3D tag sphere + stats ------------- */}
            <div data-reveal className="hidden lg:block lg:sticky lg:top-28">
              <TagSphere tags={sphereTags} radius={165} />
              <div className="mt-6 grid grid-cols-3 gap-3">
                <Stat value={totalSkills} label="Skills" suffix="+" />
                <Stat value={categories.length} label="Domains" />
                <Stat value={10} label="Platforms" suffix="+" />
              </div>
            </div>

            {/* ------------- filters + compact chips ------------- */}
            <div>
              <div data-reveal className="mb-7 flex flex-wrap gap-2">
                <button
                  onClick={() => setActive("all")}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    active === "all"
                      ? "bg-gradient-to-r from-accent to-secondary text-white shadow-lg shadow-accent/30"
                      : "border border-border bg-card/50 text-muted-foreground hover:border-accent/60 hover:text-accent"
                  }`}
                >
                  All
                  <span className="ml-1.5 text-xs opacity-70">{totalSkills}</span>
                </button>

                {categories.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => setActive(c._id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      active === c._id
                        ? "text-white shadow-lg shadow-accent/20"
                        : "border border-border bg-card/50 text-muted-foreground hover:border-accent/60 hover:text-accent"
                    }`}
                    style={active === c._id ? { background: gradientFor(c.color) } : undefined}
                  >
                    {c.title}
                    <span className="ml-1.5 text-xs opacity-70">{(c.skills || []).length}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-8">
                <AnimatePresence mode="popLayout">
                  {visible.map((category) => (
                    <motion.div
                      key={category._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ background: gradientFor(category.color) }}
                        />
                        <h3 className="text-lg font-bold tracking-tight text-foreground">
                          {category.title}
                        </h3>
                        <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {(category.skills || []).length}
                        </span>
                      </div>

                      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                        {(category.skills || []).map((skill, i) => (
                          <SkillChip
                            key={skill._id || skill.name}
                            skill={skill}
                            color={category.color}
                            index={i}
                          />
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
