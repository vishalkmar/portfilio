import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Wrench, X } from "lucide-react";
import { skillsApi } from "@/lib/adminApi";
import { useToast } from "@/hooks/use-toast";
import { PageHeader, Input, Select, Btn, Modal, ImageDropzone } from "./_shared";

const COLORS = [
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-purple-500 to-violet-500",
  "from-orange-500 to-red-500",
  "from-pink-500 to-rose-500",
  "from-teal-500 to-cyan-500",
  "from-yellow-500 to-amber-500",
  "from-indigo-500 to-blue-500",
];

export default function AdminSkills() {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [catModal, setCatModal] = useState({ open: false, id: null });
  const [catForm, setCatForm] = useState({ title: "", color: COLORS[0], order: 0 });

  const [skillModal, setSkillModal] = useState({ open: false, catId: null, skillId: null });
  const [skillForm, setSkillForm] = useState({ name: "", icon: "", level: 80, imageFile: null, imagePreview: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setCategories(await skillsApi.list());
    } catch (err) {
      toast({ title: "Failed to load", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // -------- Category handlers --------
  const openNewCat = () => {
    setCatForm({ title: "", color: COLORS[0], order: categories.length });
    setCatModal({ open: true, id: null });
  };
  const openEditCat = (c) => {
    setCatForm({ title: c.title, color: c.color, order: c.order || 0 });
    setCatModal({ open: true, id: c._id });
  };
  const saveCat = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (catModal.id) await skillsApi.updateCategory(catModal.id, catForm);
      else await skillsApi.createCategory(catForm);
      toast({ title: catModal.id ? "Updated" : "Added" });
      setCatModal({ open: false, id: null });
      load();
    } catch (err) {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };
  const removeCat = async (id) => {
    if (!confirm("Delete this category and all its skills?")) return;
    try {
      await skillsApi.deleteCategory(id);
      toast({ title: "Deleted" });
      load();
    } catch (err) {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  // -------- Skill handlers --------
  const openNewSkill = (catId) => {
    setSkillForm({ name: "", icon: "", level: 80, imageFile: null, imagePreview: "" });
    setSkillModal({ open: true, catId, skillId: null });
  };
  const openEditSkill = (catId, s) => {
    setSkillForm({
      name: s.name || "",
      icon: s.icon || "",
      level: s.level || 80,
      imageFile: null,
      imagePreview: s.image || "",
    });
    setSkillModal({ open: true, catId, skillId: s._id });
  };
  const saveSkill = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", skillForm.name);
      fd.append("icon", skillForm.icon);
      fd.append("level", skillForm.level);
      if (skillForm.imageFile) fd.append("image", skillForm.imageFile);
      if (skillModal.skillId) await skillsApi.updateSkill(skillModal.catId, skillModal.skillId, fd);
      else await skillsApi.addSkill(skillModal.catId, fd);
      toast({ title: skillModal.skillId ? "Updated" : "Added" });
      setSkillModal({ open: false, catId: null, skillId: null });
      load();
    } catch (err) {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };
  const removeSkill = async (catId, skillId) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await skillsApi.deleteSkill(catId, skillId);
      toast({ title: "Deleted" });
      load();
    } catch (err) {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  return (
    <div>
      <PageHeader
        title="Manage Skills"
        subtitle="Organize skills into categories with levels and icons/images."
        action={
          <Btn onClick={openNewCat}>
            <Plus className="w-4 h-4" /> Add Category
          </Btn>
        }
      />

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <Wrench className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No skill categories yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-card/60 border border-border overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${cat.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                    {cat.title?.[0] || "?"}
                  </div>
                  <div>
                    <h3 className="font-bold">{cat.title}</h3>
                    <p className="text-xs text-muted-foreground">{cat.skills?.length || 0} skills</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Btn variant="outline" onClick={() => openNewSkill(cat._id)}>
                    <Plus className="w-4 h-4" /> Skill
                  </Btn>
                  <Btn variant="ghost" onClick={() => openEditCat(cat)}>
                    <Pencil className="w-4 h-4" />
                  </Btn>
                  <Btn variant="danger" onClick={() => removeCat(cat._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Btn>
                </div>
              </div>

              <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {(cat.skills || []).map((s) => (
                  <div key={s._id} className="rounded-xl bg-background/50 border border-border p-3 group">
                    <div className="flex items-center gap-2 mb-2">
                      {s.image ? (
                        <img src={s.image} alt="" className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <span className="text-xl">{s.icon || "🔧"}</span>
                      )}
                      <span className="font-medium text-sm truncate">{s.name}</span>
                    </div>
                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                        style={{ width: `${s.level}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{s.level}%</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditSkill(cat._id, s)}
                          className="p-1 hover:bg-accent/10 rounded"
                        >
                          <Pencil className="w-3 h-3 text-accent" />
                        </button>
                        <button
                          onClick={() => removeSkill(cat._id, s._id)}
                          className="p-1 hover:bg-red-500/10 rounded"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {(!cat.skills || cat.skills.length === 0) && (
                  <p className="col-span-full text-center text-sm text-muted-foreground py-4">
                    No skills in this category yet.
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Category modal */}
      <Modal
        open={catModal.open}
        onClose={() => setCatModal({ open: false, id: null })}
        title={catModal.id ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={saveCat} className="space-y-4">
          <Input
            label="Title *"
            value={catForm.title}
            onChange={(e) => setCatForm({ ...catForm, title: e.target.value })}
            required
            placeholder="Frontend, Backend, Tools..."
          />
          <Select
            label="Gradient Color"
            value={catForm.color}
            onChange={(e) => setCatForm({ ...catForm, color: e.target.value })}
          >
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {c.replace("from-", "").replace(" to-", " → ")}
              </option>
            ))}
          </Select>
          <Input
            label="Display Order"
            type="number"
            value={catForm.order}
            onChange={(e) => setCatForm({ ...catForm, order: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Btn type="button" variant="outline" onClick={() => setCatModal({ open: false, id: null })}>
              Cancel
            </Btn>
            <Btn type="submit" disabled={saving}>
              {saving ? "Saving..." : catModal.id ? "Update" : "Create"}
            </Btn>
          </div>
        </form>
      </Modal>

      {/* Skill modal */}
      <Modal
        open={skillModal.open}
        onClose={() => setSkillModal({ open: false, catId: null, skillId: null })}
        title={skillModal.skillId ? "Edit Skill" : "Add Skill"}
      >
        <form onSubmit={saveSkill} className="space-y-4">
          <Input
            label="Skill Name *"
            value={skillForm.name}
            onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
            required
            placeholder="React"
          />
          <Input
            label="Emoji Icon (fallback if no image)"
            value={skillForm.icon}
            onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
            placeholder="⚛️"
          />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Proficiency ({skillForm.level}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={skillForm.level}
              onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
              className="w-full accent-[color:var(--accent)]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Skill Image (optional)</label>
            <ImageDropzone
              value={skillForm.imageFile}
              preview={skillForm.imagePreview}
              onChange={(file) => setSkillForm({ ...skillForm, imageFile: file })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Btn type="button" variant="outline" onClick={() => setSkillModal({ open: false, catId: null, skillId: null })}>
              Cancel
            </Btn>
            <Btn type="submit" disabled={saving}>
              {saving ? "Saving..." : skillModal.skillId ? "Update" : "Create"}
            </Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
}
