import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, FolderKanban, X, ExternalLink, Github } from "lucide-react";
import { projectsApi } from "@/lib/adminApi";
import { useToast } from "@/hooks/use-toast";
import { PageHeader, Input, Textarea, Select, Btn, Modal, ImageDropzone } from "./_shared";

const DEFAULT_TECH_OPTIONS = [
  // Languages
  "JavaScript", "TypeScript", "Python", "Java", "PHP", "C", "C++", "C#", "Go", "Rust", "Ruby", "Kotlin", "Swift", "SQL", "Bash",
  // Frontend frameworks
  "React", "Next.js", "Vue.js", "Nuxt", "Angular", "Svelte", "Remix",
  // CSS
  "HTML", "CSS", "Tailwind CSS", "Bootstrap", "SASS", "Material UI", "Chakra UI", "Framer Motion",
  // State
  "Redux", "Zustand", "Recoil", "React Query",
  // Backend
  "Node.js", "Express", "Nest.js", "Django", "Flask", "FastAPI", "Spring Boot", "Laravel",
  // DB
  "MongoDB", "MySQL", "PostgreSQL", "SQLite", "Redis", "Firebase", "Supabase",
  // Cloud / DevOps
  "AWS", "GCP", "Azure", "Vercel", "Netlify", "Docker", "Kubernetes", "CI/CD", "Nginx",
  // Other
  "GraphQL", "REST APIs", "Socket.io", "Stripe", "Nodemailer", "JWT", "OAuth", "Prisma", "Drizzle",
  // Mobile
  "React Native", "Flutter",
];

const CATEGORIES = [
  { value: "fullstack", label: "Full Stack" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "mobile", label: "Mobile" },
  { value: "other", label: "Other" },
];

const emptyForm = {
  title: "",
  description: "",
  technologies: [],
  category: "fullstack",
  liveUrl: "",
  githubUrl: "",
  order: 0,
  imageFile: null,
  imagePreview: "",
};

function TechMultiSelect({ value, onChange, options }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options
      .filter((o) => !value.includes(o))
      .filter((o) => o.toLowerCase().includes(q))
      .slice(0, 20);
  }, [query, options, value]);

  const add = (val) => {
    const v = (val || "").trim();
    if (!v) return;
    if (value.includes(v)) return;
    onChange([...value, v]);
    setQuery("");
  };

  const remove = (v) => onChange(value.filter((x) => x !== v));

  const onKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add(query);
    } else if (e.key === "Backspace" && !query && value.length) {
      remove(value[value.length - 1]);
    }
  };

  return (
    <div className="space-y-1.5 relative">
      <label className="text-sm font-medium text-muted-foreground">
        Skills / Technologies Used (type & press Enter to add custom)
      </label>
      <div className="min-h-[48px] px-3 py-2 rounded-lg bg-[var(--input)] border border-border focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 flex flex-wrap items-center gap-1.5">
        {value.map((v) => (
          <span
            key={v}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/15 text-accent text-sm border border-accent/30"
          >
            {v}
            <button
              type="button"
              onClick={() => remove(v)}
              className="hover:bg-accent/20 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          className="flex-1 min-w-[120px] bg-transparent outline-none text-foreground text-sm py-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKey}
          placeholder={value.length ? "" : "Type or pick (e.g. React)"}
        />
      </div>

      {open && (filtered.length > 0 || query) && (
        <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {query && !options.includes(query) && !value.includes(query) && (
            <button
              type="button"
              onClick={() => add(query)}
              className="w-full text-left px-3 py-2 hover:bg-accent/10 text-sm"
            >
              + Add custom: <span className="font-medium text-accent">{query}</span>
            </button>
          )}
          {filtered.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => add(o)}
              className="w-full text-left px-3 py-2 hover:bg-accent/10 text-sm"
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminProjects() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, id: null });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Build dynamic options: defaults + any techs already used on projects
  const techOptions = useMemo(() => {
    const extras = new Set();
    items.forEach((p) => p.technologies?.forEach((t) => extras.add(t)));
    return Array.from(new Set([...DEFAULT_TECH_OPTIONS, ...extras])).sort();
  }, [items]);

  const load = async () => {
    try {
      setLoading(true);
      const d = await projectsApi.list();
      setItems(d);
    } catch (err) {
      toast({ title: "Failed to load", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm(emptyForm);
    setModal({ open: true, id: null });
  };

  const openEdit = (p) => {
    setForm({
      title: p.title || "",
      description: p.description || "",
      technologies: p.technologies || [],
      category: p.category || "fullstack",
      liveUrl: p.liveUrl || "",
      githubUrl: p.githubUrl || "",
      order: p.order || 0,
      imageFile: null,
      imagePreview: p.image || "",
    });
    setModal({ open: true, id: p._id });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("technologies", JSON.stringify(form.technologies));
      fd.append("category", form.category);
      fd.append("liveUrl", form.liveUrl);
      fd.append("githubUrl", form.githubUrl);
      fd.append("order", form.order);
      if (form.imageFile) fd.append("image", form.imageFile);
      if (modal.id) await projectsApi.update(modal.id, fd);
      else await projectsApi.create(fd);
      toast({ title: modal.id ? "Updated" : "Added", description: "Project saved." });
      setModal({ open: false, id: null });
      load();
    } catch (err) {
      toast({
        title: "Save failed",
        description: err?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await projectsApi.remove(id);
      toast({ title: "Deleted" });
      load();
    } catch (err) {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  return (
    <div>
      <PageHeader
        title="Manage Projects"
        subtitle="Add and edit featured projects shown on your portfolio."
        action={
          <Btn onClick={openNew}>
            <Plus className="w-4 h-4" /> Add Project
          </Btn>
        }
      />

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <FolderKanban className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No projects yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl bg-card/60 border border-border hover:border-accent transition-all overflow-hidden group"
            >
              {p.image ? (
                <img src={p.image} alt="" className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center">
                  <FolderKanban className="w-10 h-10 text-accent" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold truncate">{p.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent capitalize shrink-0">
                    {p.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {(p.technologies || []).slice(0, 5).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground">
                      {t}
                    </span>
                  ))}
                  {(p.technologies || []).length > 5 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground">
                      +{p.technologies.length - 5}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-accent">
                      <ExternalLink className="w-3 h-3" /> Live
                    </a>
                  )}
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-accent">
                      <Github className="w-3 h-3" /> Code
                    </a>
                  )}
                </div>
              </div>
              <div className="flex border-t border-border">
                <button
                  onClick={() => openEdit(p)}
                  className="flex-1 py-2.5 text-sm flex items-center justify-center gap-2 hover:bg-accent/5 text-accent"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <div className="w-px bg-border" />
                <button
                  onClick={() => remove(p._id)}
                  className="flex-1 py-2.5 text-sm flex items-center justify-center gap-2 hover:bg-red-500/10 text-red-400"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, id: null })}
        title={modal.id ? "Edit Project" : "Add Project"}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Project Name *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Textarea
            label="Project Summary *"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <TechMultiSelect
            value={form.technologies}
            onChange={(techs) => setForm({ ...form, technologies: techs })}
            options={techOptions}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
            <Input
              label="Display Order"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
            />
            <Input
              label="Live Demo URL"
              value={form.liveUrl}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
              placeholder="https://..."
            />
            <Input
              label="GitHub Repo URL"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Project Image (drag & drop)
            </label>
            <ImageDropzone
              value={form.imageFile}
              preview={form.imagePreview}
              onChange={(file) => setForm({ ...form, imageFile: file })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Btn type="button" variant="outline" onClick={() => setModal({ open: false, id: null })}>
              Cancel
            </Btn>
            <Btn type="submit" disabled={saving}>
              {saving ? "Saving..." : modal.id ? "Update" : "Create"}
            </Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
}
