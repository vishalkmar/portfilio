import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Sparkles, Search, X, Trophy, Layers, Cpu } from "lucide-react";
import { publicApi } from "@/lib/publicApi";
import { useRevealOnScroll } from "@/hooks/use-gsap";
import { useTour } from "@/components/guide/tour-context";

/*
 * "Skill Lab": every category is a station. The left of a station holds its
 * stats and a spot where Byte stands to present it; the right is a honeycomb
 * of hexagonal skill tiles whose outline is drawn to the skill's level.
 * Tiles stay dimmed until Byte reaches the station, then power on one by one.
 */

/** Tailwind cannot see `from-${x}`, so category colours are mapped explicitly. */
const PALETTE = {
  "from-blue-500 to-cyan-500": ["#3b82f6", "#06b6d4"],
  "from-teal-500 to-cyan-500": ["#14b8a6", "#06b6d4"],
  "from-green-500 to-emerald-500": ["#22c55e", "#10b981"],
  "from-purple-500 to-violet-500": ["#a855f7", "#8b5cf6"],
  "from-orange-500 to-red-500": ["#f97316", "#ef4444"],
  "from-pink-500 to-rose-500": ["#ec4899", "#f43f5e"],
  "from-indigo-500 to-blue-500": ["#6366f1", "#3b82f6"],
  "from-yellow-500 to-amber-500": ["#eab308", "#f59e0b"],
};
const colorsFor = (c) => PALETTE[c] || PALETTE["from-blue-500 to-cyan-500"];

const tierOf = (level) => (level >= 90 ? "Expert" : level >= 75 ? "Advanced" : "Proficient");

/* pointy-top hexagon in a 100 × 115.47 box */
const HEX_POINTS = "50,1 99,29.3 99,86.2 50,114.5 1,86.2 1,29.3";
const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
const HEX_RATIO = 1.1547;

/* ------------------------------------------------------------------ */

function HexTile({ skill, colors, index, lit, match, gradId }) {
  const level = Math.max(0, Math.min(100, Number(skill.level) || 0));
  const dimmed = match === false;

  return (
    <motion.div
      className="group relative h-full w-full"
      initial={false}
      animate={{
        opacity: dimmed ? 0.18 : lit ? 1 : 0.35,
        scale: match === true ? 1.06 : 1,
        filter: lit ? "grayscale(0)" : "grayscale(0.9)",
      }}
      transition={{ duration: 0.45, delay: lit ? Math.min(index * 0.06, 1.2) : 0 }}
      whileHover={{ y: -6, scale: 1.08 }}
      title={`${skill.name} · ${level}%`}
    >
      {/* glow behind a lit tile */}
      <div
        className="absolute inset-[12%] rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-80"
        style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
      />

      {/* glass body */}
      <div
        className="absolute inset-[3px] bg-[#0b0f24]/85 transition-colors duration-300 group-hover:bg-[#10163a]/95"
        style={{ clipPath: HEX_CLIP }}
      />

      {/* outline: dim track + the level drawn in the category colour */}
      <svg viewBox="0 0 100 115.47" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <polygon points={HEX_POINTS} fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="1.6" />
        <motion.polygon
          points={HEX_POINTS}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: lit ? level / 100 : 0 }}
          transition={{ duration: 1.1, delay: lit ? 0.15 + Math.min(index * 0.06, 1.2) : 0, ease: "easeOut" }}
        />
      </svg>

      {/* content */}
      <div className="relative flex h-full flex-col items-center justify-center px-3 text-center">
        <span className="mb-1 flex h-8 items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-125">
          {skill.image ? (
            <img src={skill.image} alt="" className="h-7 w-7 object-contain" />
          ) : (
            <span aria-hidden="true">{skill.icon || "\u{1F527}"}</span>
          )}
        </span>
        <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-foreground md:text-xs">
          {skill.name}
        </span>
        <span
          className="mt-1 text-[10px] font-bold tabular-nums"
          style={{ color: colors[1] }}
        >
          {level}%
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Lays tiles out as a true honeycomb: the column count follows the
 * container width, and every other row is shifted by half a tile so the
 * hexagons interlock.
 */
function HoneyComb({ skills, colors, lit, query, gradId }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const hexW = width < 420 ? 92 : 112;
  const gap = 8;
  const cols = Math.max(2, Math.floor((width - hexW / 2) / (hexW + gap)) || 2);
  const hexH = hexW * HEX_RATIO;

  const rows = [];
  for (let i = 0; i < skills.length; i += cols) rows.push(skills.slice(i, i + cols));

  const q = query.trim().toLowerCase();

  return (
    <div ref={ref} className="w-full">
      {width > 0 &&
        rows.map((row, r) => (
          <div
            key={r}
            className="flex"
            style={{
              gap,
              marginLeft: r % 2 ? (hexW + gap) / 2 : 0,
              // interlock: pull each row up by a quarter tile
              marginTop: r === 0 ? 0 : -hexH * 0.25 + gap * 0.6,
            }}
          >
            {row.map((skill, c) => {
              const index = r * cols + c;
              const match = q ? skill.name.toLowerCase().includes(q) : undefined;
              return (
                <div key={skill._id || skill.name} style={{ width: hexW, height: hexH }} className="shrink-0">
                  <HexTile
                    skill={skill}
                    colors={colors}
                    index={index}
                    lit={lit}
                    match={match}
                    gradId={gradId}
                  />
                </div>
              );
            })}
          </div>
        ))}
    </div>
  );
}

function MasteryRing({ value, colors, lit, id }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="6" />
        <motion.circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={false}
          animate={{ strokeDashoffset: lit ? circ * (1 - value / 100) : circ }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold tabular-nums text-foreground">{lit ? value : "--"}%</span>
        <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">avg</span>
      </div>
    </div>
  );
}

function Station({ category, index, active, lit, query }) {
  const colors = colorsFor(category.color);
  const skills = useMemo(
    () => [...(category.skills || [])].sort((a, b) => b.level - a.level),
    [category.skills]
  );
  const avg = skills.length ? Math.round(skills.reduce((s, k) => s + (Number(k.level) || 0), 0) / skills.length) : 0;
  const top = skills[0];
  const tiers = ["Expert", "Advanced", "Proficient"].map((t) => ({
    t,
    n: skills.filter((s) => tierOf(s.level) === t).length,
  }));
  const q = query.trim().toLowerCase();
  const matches = q ? skills.filter((s) => s.name.toLowerCase().includes(q)).length : null;
  const gradId = `hex-grad-${category._id}`;

  return (
    <motion.article
      id={`skill-station-${category._id}`}
      data-skill-station={index}
      data-title={category.title}
      data-count={skills.length}
      data-top={top?.name || ""}
      data-top-level={top?.level ?? ""}
      data-avg={avg}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-3xl border bg-card/40 backdrop-blur-md transition-[border-color,box-shadow] duration-700 ${
        active ? "border-accent/60 shadow-[0_0_50px_-15px_rgba(0,217,255,0.55)]" : "border-border/60"
      } ${q && matches === 0 ? "opacity-40" : ""}`}
    >
      {/* gradient for this station's tile outlines */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
      </svg>

      {/* category colour rail + faint circuit grid */}
      <span
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: `linear-gradient(180deg, ${colors[0]}, ${colors[1]})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* power-on sweep */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-1/3"
        style={{ background: `linear-gradient(90deg, transparent, ${colors[1]}22, transparent)` }}
        initial={false}
        animate={lit ? { left: ["-35%", "110%"], opacity: [1, 0] } : { left: "-35%", opacity: 0 }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />

      <div className="relative grid gap-6 p-6 md:p-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10">
        {/* ---------- station info ---------- */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold tracking-[0.3em] text-muted-foreground">
                STATION {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                {category.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {skills.length} skills
                {matches !== null && (
                  <span className="ml-2 font-semibold text-accent">· {matches} match{matches === 1 ? "" : "es"}</span>
                )}
              </p>
            </div>
            <MasteryRing value={avg} colors={colors} lit={lit} id={`ring-${category._id}`} />
          </div>

          {/* tier breakdown */}
          <div className="mt-5 space-y-2">
            {tiers.map(({ t, n }) => (
              <div key={t} className="flex items-center gap-3 text-xs">
                <span className="w-20 shrink-0 font-semibold text-muted-foreground">{t}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-border/60">
                  <motion.span
                    className="block h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})` }}
                    initial={false}
                    animate={{ width: lit && skills.length ? `${(n / skills.length) * 100}%` : 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  />
                </span>
                <span className="w-5 shrink-0 text-right font-bold tabular-nums text-foreground">{n}</span>
              </div>
            ))}
          </div>

          {top && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border/60 bg-background/40 px-4 py-3">
              <Trophy className="h-4 w-4 shrink-0" style={{ color: colors[1] }} />
              <span className="min-w-0 text-xs text-muted-foreground">
                Strongest:{" "}
                <span className="font-semibold text-foreground">{top.name}</span>
                <span className="ml-1 font-bold" style={{ color: colors[1] }}>
                  {top.level}%
                </span>
              </span>
            </div>
          )}

          {/* Byte stands here while presenting this station (desktop) */}
          <div data-byte-anchor className="mt-auto hidden min-h-[280px] flex-1 lg:block" />
        </div>

        {/* ---------- honeycomb ---------- */}
        <div className="flex items-center">
          <HoneyComb skills={skills} colors={colors} lit={lit} query={query} gradId={gradId} />
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */

export default function Skills() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { activeSkill, reachedSkill } = useTour();

  useEffect(() => {
    publicApi
      .skills()
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scopeRef = useRevealOnScroll("[data-reveal]", { y: 40, stagger: 0.06 }, [categories]);

  const totalSkills = useMemo(
    () => categories.reduce((n, c) => n + (c.skills || []).length, 0),
    [categories]
  );
  const expertCount = useMemo(
    () => categories.reduce((n, c) => n + (c.skills || []).filter((s) => s.level >= 90).length, 0),
    [categories]
  );

  const jumpTo = (id) =>
    document.getElementById(`skill-station-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section id="skills" ref={scopeRef} className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[15%] top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-[10%] h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* ---------------- heading ---------------- */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <motion.span
            data-reveal
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Skill Lab
          </motion.span>
          <h2 data-reveal className="mb-4 text-4xl font-extrabold md:text-6xl">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p data-reveal className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Every station is one domain of the toolkit. Byte powers each one up as you
            scroll — or search for a skill to light it up directly.
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
          <>
            {/* ---------------- control deck ---------------- */}
            <div
              data-reveal
              className="sticky top-20 z-20 mb-10 rounded-2xl border border-border/60 bg-background/80 p-3 shadow-xl shadow-black/30 backdrop-blur-xl md:p-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex shrink-0 items-center gap-4 px-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-accent" />
                    <b className="text-base text-foreground">{totalSkills}</b> skills
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-secondary" />
                    <b className="text-base text-foreground">{categories.length}</b> stations
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Trophy className="h-4 w-4 text-amber-400" />
                    <b className="text-base text-foreground">{expertCount}</b> expert
                  </span>
                </div>

                <label className="relative flex-1 lg:max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search a skill… e.g. React"
                    className="h-10 w-full rounded-xl border border-border bg-card/60 pl-9 pr-9 text-sm text-foreground caret-accent outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-accent"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </label>

                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0">
                  {categories.map((c, i) => {
                    const [a, b] = colorsFor(c.color);
                    const on = activeSkill === i;
                    return (
                      <button
                        key={c._id}
                        onClick={() => jumpTo(c._id)}
                        className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                          on
                            ? "border-transparent text-white shadow-lg"
                            : "border-border bg-card/50 text-muted-foreground hover:border-accent/60 hover:text-accent"
                        }`}
                        style={on ? { background: `linear-gradient(90deg, ${a}, ${b})` } : undefined}
                      >
                        {c.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ---------------- stations ---------------- */}
            <div className="space-y-8">
              {categories.map((category, i) => (
                <Station
                  key={category._id}
                  category={category}
                  index={i}
                  active={activeSkill === i}
                  // a search lights everything so matches are visible straight away
                  lit={reachedSkill >= i || query.trim().length > 0}
                  query={query}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
