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
} from "lucide-react";
import { publicApi } from "@/lib/publicApi";
import { useRevealOnScroll, useTilt } from "@/hooks/use-gsap";

const CATEGORY_META = {
  all: { label: "All Projects", icon: Layers },
  frontend: { label: "Frontend", icon: Code },
  fullstack: { label: "Full Stack", icon: Database },
  backend: { label: "Backend", icon: Database },
  mobile: { label: "Mobile", icon: Smartphone },
  ai: { label: "AI & Automation", icon: Brain },
  other: { label: "Other", icon: Globe },
};

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
 * Cover art for a project. Uses the uploaded image when there is one and
 * otherwise generates a stable gradient + mesh cover so the grid never shows
 * an empty box.
 */
function ProjectCover({ project }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={project.title}
        loading="lazy"
        className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    );
  }

  const [from, to] = COVER_PALETTES[hashOf(project.title) % COVER_PALETTES.length];

  return (
    <div
      className="relative flex h-52 w-full items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${from}22, ${to}33)` }}
    >
      {/* mesh grid */}
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
      <div
        className="absolute -right-8 -top-8 h-40 w-40 rounded-full blur-3xl"
        style={{ background: from, opacity: 0.35 }}
      />
      <div
        className="absolute -bottom-10 -left-6 h-36 w-36 rounded-full blur-3xl"
        style={{ background: to, opacity: 0.3 }}
      />
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

function ProjectCard({ project }) {
  const tiltRef = useTilt({ max: 7, scale: 1.015 });
  const techs = project.technologies || [];
  const shown = techs.slice(0, 6);
  const overflow = techs.length - shown.length;

  return (
    <div data-reveal className="h-full [perspective:1000px]">
      <article
        ref={tiltRef}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur-sm transition-colors duration-500 hover:border-accent/70"
        style={{
          "--glare-opacity": 0,
          "--glare-x": "50%",
          "--glare-y": "50%",
        }}
      >
        {/* cursor glare */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: "var(--glare-opacity)",
            background:
              "radial-gradient(320px circle at var(--glare-x) var(--glare-y), rgba(0,217,255,0.12), transparent 65%)",
          }}
        />

        <div className="relative overflow-hidden">
          <ProjectCover project={project} />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

          {project.category && (
            <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent backdrop-blur-md">
              {CATEGORY_META[project.category]?.label || project.category}
            </span>
          )}
        </div>

        <div className="relative z-10 flex flex-1 flex-col p-6">
          <h3 className="mb-2.5 text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-accent">
            {project.title}
          </h3>

          <p className="mb-5 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          {shown.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-1.5">
              {shown.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-accent/20 bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent/90"
                >
                  {tech}
                </span>
              ))}
              {overflow > 0 && (
                <span
                  className="rounded-md border border-border bg-card/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                  title={techs.slice(6).join(", ")}
                >
                  +{overflow} more
                </span>
              )}
            </div>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/cta mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Live Site
              <span className="transition-transform duration-300 group-hover/cta:translate-x-1">
                &rarr;
              </span>
            </a>
          )}
        </div>
      </article>
    </div>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const filtered =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const scopeRef = useRevealOnScroll("[data-reveal]", { y: 50, stagger: 0.07 }, [
    projects,
    activeCategory,
  ]);

  return (
    <section id="projects" ref={scopeRef} className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/5 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span
            data-reveal
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent"
          >
            <FolderKanban className="h-3.5 w-3.5" />
            Selected Work
          </span>
          <h2 data-reveal className="mb-4 text-4xl font-extrabold md:text-6xl">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p data-reveal className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Production platforms serving real users — marketplaces, booking engines, CRMs,
            exam platforms and autonomous AI tooling. Every one of them is live.
          </p>
        </div>

        {categories.length > 1 && (
          <div data-reveal className="mb-12 flex flex-wrap justify-center gap-3">
            {categories.map(({ id, label, Icon, count }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  activeCategory === id
                    ? "scale-105 bg-gradient-to-r from-accent to-secondary text-white shadow-xl shadow-accent/30"
                    : "border border-border bg-card/50 text-muted-foreground hover:border-accent/60 hover:text-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                <span className="text-xs opacity-70">{count}</span>
              </button>
            ))}
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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid gap-7 md:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
