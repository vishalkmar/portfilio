import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Code,
  Database,
  Globe,
  Smartphone,
  FolderKanban,
  Brain,
  Layers,
  Github,
  Lock,
  ChevronDown,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { publicApi } from "@/lib/publicApi";
import { useTilt } from "@/hooks/use-gsap";

const CATEGORY_META = {
  all: { label: "All Projects", icon: Layers },
  frontend: { label: "Frontend", icon: Code },
  fullstack: { label: "Full Stack", icon: Database },
  backend: { label: "Backend", icon: Database },
  mobile: { label: "Mobile", icon: Smartphone },
  ai: { label: "AI & Automation", icon: Brain },
  other: { label: "Other", icon: Globe },
};

/** First page fills three full rows: the featured card spans two columns. */
const PAGE = 8;
const MORE = 6;

/** Deterministic palette so a project keeps the same cover on every load. */
const COVER_PALETTES = [
  ["#0ea5e9", "#8b5cf6"],
  ["#22c55e", "#0ea5e9"],
  ["#f97316", "#ec4899"],
  ["#8b5cf6", "#ec4899"],
  ["#06b6d4", "#3b82f6"],
  ["#eab308", "#f97316"],
];

const hashOf = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const initialsOf = (title) =>
  title
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

/**
 * Some descriptions were saved as UTF-8 that got decoded as Latin-1
 * ("â€”" instead of "—"). Re-decoding repairs them; clean text is untouched.
 */
const fixText = (text = "") => {
  if (!/[ÃÂâ][\u0080-ÿ]/.test(text)) return text;
  try {
    return decodeURIComponent(escape(text));
  } catch {
    return text;
  }
};

const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

/* ------------------------------------------------------------------ */

/** Generated cover for projects without a screenshot. */
function GeneratedCover({ project }) {
  const [from, to] = COVER_PALETTES[hashOf(project.title) % COVER_PALETTES.length];
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${from}22, ${to}33)` }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(circle at 50% 50%, #000 25%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 25%, transparent 75%)",
        }}
      />
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full blur-3xl" style={{ background: from, opacity: 0.35 }} />
      <div className="absolute -bottom-10 -left-6 h-36 w-36 rounded-full blur-3xl" style={{ background: to, opacity: 0.3 }} />
      <span
        className="relative select-none text-6xl font-black tracking-tighter transition-transform duration-700 group-hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${from}, ${to})`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {initialsOf(project.title)}
      </span>
    </div>
  );
}

/**
 * The project shown inside a little browser window. On hover a tall
 * screenshot scrolls from top to bottom, as if someone were browsing it.
 */
function BrowserWindow({ project, featured }) {
  const host = hostOf(project.liveUrl);
  const winH = featured ? "20rem" : "13rem";

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#070a1a] shadow-2xl shadow-black/40">
      {/* chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#0b0f24] px-3 py-2">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-2 flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-white/[0.05] px-2.5 py-1 text-[11px] text-muted-foreground">
          <Lock className="h-3 w-3 shrink-0 text-emerald-400" />
          <span className="truncate">{host || "localhost"}</span>
        </span>
      </div>

      {/* viewport */}
      <div className="relative overflow-hidden" style={{ height: winH, "--win-h": winH }}>
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            style={{ transitionDuration: "4s" }}
            className="absolute left-0 top-0 w-full min-h-full object-cover object-top transition-transform ease-in-out group-hover:[transform:translateY(calc(-100%_+_var(--win-h)))]"
          />
        ) : (
          <GeneratedCover project={project} />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#070a1a] to-transparent" />
      </div>
    </div>
  );
}

function ProjectCard({ project, index, featured }) {
  const tiltRef = useTilt({ max: featured ? 3 : 6, scale: 1.01 });
  // every technology saved for the project is shown, no "+N" truncation
  const techs = (project.technologies || []).map((t) => String(t).trim()).filter(Boolean);
  const description = fixText(project.description);
  const categoryLabel = CATEGORY_META[project.category]?.label || project.category;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={`h-full [perspective:1200px] ${featured ? "md:col-span-2" : ""}`}
    >
      <article
        ref={tiltRef}
        className="group relative h-full rounded-2xl bg-card/60 p-3 backdrop-blur-md"
        style={{ "--glare-opacity": 0, "--glare-x": "50%", "--glare-y": "50%" }}
      >
        {/* static hairline border */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl border border-border/70" />
        {/* border that lights up under the cursor */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: "var(--glare-opacity)",
            padding: 1.5,
            background:
              "radial-gradient(360px circle at var(--glare-x) var(--glare-y), #00D9FF, #8B5CF6 40%, transparent 70%)",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
          }}
        />
        {/* soft inner glare */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: "var(--glare-opacity)",
            background:
              "radial-gradient(300px circle at var(--glare-x) var(--glare-y), rgba(0,217,255,0.08), transparent 65%)",
          }}
        />

        <div className={`relative h-full ${featured ? "grid gap-6 lg:grid-cols-[1.35fr_1fr]" : "flex flex-col"}`}>
          <BrowserWindow project={project} featured={featured} />

          <div className={`flex flex-1 flex-col ${featured ? "py-2 pr-2" : "px-2 pb-2 pt-5"}`}>
            <div className="mb-3 flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-6 bg-border" />
              {featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                  <Star className="h-3 w-3 fill-current" />
                  Featured
                </span>
              )}
              {categoryLabel && (
                <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                  {categoryLabel}
                </span>
              )}
            </div>

            <h3
              className={`mb-2 font-extrabold leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent ${
                featured ? "text-2xl md:text-3xl" : "text-lg"
              }`}
            >
              {project.title}
            </h3>

            <p
              className={`mb-4 text-sm leading-relaxed text-muted-foreground ${
                featured ? "line-clamp-6 md:text-[15px]" : "line-clamp-3"
              }`}
            >
              {description}
            </p>

            {techs.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-1.5">
                {techs.map((tech, i) => (
                  <span
                    key={`${tech}-${i}`}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-foreground/80 transition-colors duration-200 hover:border-accent/50 hover:text-accent"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto flex items-center gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/cta inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-secondary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-accent/25 transition-transform duration-300 hover:scale-[1.04]"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Site
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Source code"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    publicApi
      .projects()
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(["all"]);
    projects.forEach((p) => p.category && cats.add(p.category));
    return Array.from(cats).map((id) => ({
      id,
      label: CATEGORY_META[id]?.label || id.charAt(0).toUpperCase() + id.slice(1),
      Icon: CATEGORY_META[id]?.icon || Globe,
      count: id === "all" ? projects.length : projects.filter((p) => p.category === id).length,
    }));
  }, [projects]);

  const filtered = useMemo(
    () => (activeCategory === "all" ? projects : projects.filter((p) => p.category === activeCategory)),
    [projects, activeCategory]
  );
  const visible = filtered.slice(0, limit);
  const remaining = filtered.length - visible.length;

  const pick = (id) => {
    setActiveCategory(id);
    setLimit(PAGE);
  };

  return (
    <section id="projects" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/5 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <FolderKanban className="h-3.5 w-3.5" />
            Selected Work
          </span>
          <h2 className="mb-4 text-4xl font-extrabold md:text-6xl">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Production platforms serving real users — marketplaces, booking engines, CRMs,
            exam platforms and autonomous AI tooling. Hover a window to scroll the live page.
          </p>
        </motion.div>

        {categories.length > 1 && (
          <div className="mb-12 flex justify-center">
            <div className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-border/60 bg-card/40 p-1.5 backdrop-blur-md">
              {categories.map(({ id, label, Icon, count }) => {
                const on = activeCategory === id;
                return (
                  <button
                    key={id}
                    onClick={() => pick(id)}
                    className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                      on ? "text-white" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="project-filter"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-secondary shadow-lg shadow-accent/30"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className="relative h-4 w-4" />
                    <span className="relative">{label}</span>
                    <span className="relative text-xs opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-muted-foreground">Loading projects…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <FolderKanban className="mx-auto mb-3 h-12 w-12" />
            No projects to show yet.
          </div>
        ) : (
          <>
            <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visible.map((project, i) => (
                  <ProjectCard
                    key={`${activeCategory}-${project._id}`}
                    project={project}
                    index={i}
                    featured={i === 0 && filtered.length > 2}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {remaining > 0 && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setLimit((l) => l + MORE)}
                  className="group inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-7 py-3 text-sm font-bold text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Show {Math.min(MORE, remaining)} more
                  <span className="text-xs opacity-70">({remaining} left)</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
