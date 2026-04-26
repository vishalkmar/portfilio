import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Briefcase, X } from "lucide-react";
import { servicesApi } from "@/lib/adminApi";
import { useToast } from "@/hooks/use-toast";
import { PageHeader, Input, Textarea, Select, Btn, Modal } from "./_shared";

const ICON_OPTIONS = [
  "Code", "Server", "Cloud", "Smartphone", "Palette", "Database",
  "Shield", "Zap", "Search", "Users", "Globe", "Layers", "Wrench",
];

const COLORS = [
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-purple-500 to-violet-500",
  "from-orange-500 to-red-500",
  "from-pink-500 to-rose-500",
  "from-teal-500 to-cyan-500",
  "from-yellow-500 to-amber-500",
  "from-indigo-500 to-blue-500",
  "from-amber-500 to-yellow-500",
  "from-lime-500 to-green-500",
  "from-red-500 to-pink-500",
];

const emptyForm = {
  title: "",
  description: "",
  icon: "Code",
  color: COLORS[0],
  features: [""],
  order: 0,
};

export default function AdminServices() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, id: null });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setItems(await servicesApi.list());
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
    setForm({ ...emptyForm, order: items.length });
    setModal({ open: true, id: null });
  };

  const openEdit = (s) => {
    setForm({
      title: s.title || "",
      description: s.description || "",
      icon: s.icon || "Code",
      color: s.color || COLORS[0],
      features: s.features?.length ? [...s.features] : [""],
      order: s.order || 0,
    });
    setModal({ open: true, id: s._id });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        features: form.features.filter(Boolean),
      };
      if (modal.id) await servicesApi.update(modal.id, payload);
      else await servicesApi.create(payload);
      toast({ title: modal.id ? "Updated" : "Added", description: "Service saved." });
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
    if (!confirm("Delete this service?")) return;
    try {
      await servicesApi.remove(id);
      toast({ title: "Deleted" });
      load();
    } catch (err) {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  return (
    <div>
      <PageHeader
        title="Manage Services"
        subtitle="Services you offer with descriptions and feature points."
        action={
          <Btn onClick={openNew}>
            <Plus className="w-4 h-4" /> Add Service
          </Btn>
        }
      />

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No services yet. Add your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((s, i) => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl bg-card/60 border border-border hover:border-accent transition-all overflow-hidden"
            >
              <div className="p-5">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${s.color} flex items-center justify-center text-white font-bold text-xl shadow-lg mb-4`}>
                  {s.icon?.[0] || "S"}
                </div>
                <h3 className="font-bold text-lg">{s.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mt-1">{s.description}</p>
                {s.features?.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {s.features.slice(0, 4).map((f, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${s.color}`} />
                        {f}
                      </li>
                    ))}
                    {s.features.length > 4 && (
                      <li className="text-xs text-muted-foreground/60">+{s.features.length - 4} more</li>
                    )}
                  </ul>
                )}
              </div>
              <div className="flex border-t border-border">
                <button
                  onClick={() => openEdit(s)}
                  className="flex-1 py-2.5 text-sm flex items-center justify-center gap-2 hover:bg-accent/5 text-accent"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <div className="w-px bg-border" />
                <button
                  onClick={() => remove(s._id)}
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
        title={modal.id ? "Edit Service" : "Add Service"}
      >
        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Service Name *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Frontend Development"
            required
          />
          <Textarea
            label="About this Service *"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what you offer in this service..."
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Icon"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            >
              {ICON_OPTIONS.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </Select>
            <Select
              label="Gradient Color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            >
              {COLORS.map((c) => (
                <option key={c} value={c}>
                  {c.replace("from-", "").replace(" to-", " → ")}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Feature Points (Add and Remove freely)
            </label>
            <div className="space-y-2">
              {form.features.map((f, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--input)] border border-border focus:border-accent outline-none text-foreground placeholder:text-muted-foreground"
                    value={f}
                    onChange={(e) => {
                      const next = [...form.features];
                      next[idx] = e.target.value;
                      setForm({ ...form, features: next });
                    }}
                    placeholder="e.g. React & Vue.js"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = form.features.filter((_, i) => i !== idx);
                      setForm({ ...form, features: next.length ? next : [""] });
                    }}
                    className="p-2.5 rounded-lg hover:bg-red-500/10 text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Btn
                type="button"
                variant="outline"
                onClick={() => setForm({ ...form, features: [...form.features, ""] })}
              >
                <Plus className="w-4 h-4" /> Add Point
              </Btn>
            </div>
          </div>

          <Input
            label="Display Order"
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
          />

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
