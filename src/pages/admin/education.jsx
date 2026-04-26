import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import { educationApi } from "@/lib/adminApi";
import { useToast } from "@/hooks/use-toast";
import { PageHeader, Input, Textarea, Select, Btn, Modal, ImageDropzone } from "./_shared";

const emptyForm = {
  degree: "",
  qualification: "",
  institution: "",
  startDate: "",
  endDate: "",
  gradeType: "Percentage",
  gradeValue: "",
  description: "",
  order: 0,
  imageFile: null,
  imagePreview: "",
};

export default function AdminEducation() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, id: null });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await educationApi.list();
      setItems(data);
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

  const openEdit = (it) => {
    setForm({
      degree: it.degree || "",
      qualification: it.qualification || "",
      institution: it.institution || "",
      startDate: it.startDate || "",
      endDate: it.endDate || "",
      gradeType: it.gradeType || "Percentage",
      gradeValue: it.gradeValue || "",
      description: it.description || "",
      order: it.order || 0,
      imageFile: null,
      imagePreview: it.image || "",
    });
    setModal({ open: true, id: it._id });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      ["degree", "qualification", "institution", "startDate", "endDate", "gradeType", "gradeValue", "description", "order"].forEach(
        (k) => fd.append(k, form[k] ?? "")
      );
      if (form.imageFile) fd.append("image", form.imageFile);
      if (modal.id) await educationApi.update(modal.id, fd);
      else await educationApi.create(fd);
      toast({ title: modal.id ? "Updated" : "Added", description: "Education saved." });
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
    if (!confirm("Delete this education entry?")) return;
    try {
      await educationApi.remove(id);
      toast({ title: "Deleted" });
      load();
    } catch (err) {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  return (
    <div>
      <PageHeader
        title="Manage Education"
        subtitle="Add, edit and remove your academic qualifications."
        action={
          <Btn onClick={openNew}>
            <Plus className="w-4 h-4" /> Add Education
          </Btn>
        }
      />

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No education entries yet. Click "Add Education" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <motion.div
              key={it._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl bg-card/60 border border-border hover:border-accent transition-all overflow-hidden"
            >
              <div className="p-5 flex gap-4">
                {it.image ? (
                  <img src={it.image} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-accent" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{it.degree}</h3>
                  <p className="text-sm text-muted-foreground truncate">{it.institution}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {it.startDate} {it.endDate ? `- ${it.endDate}` : ""}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-4">
                <p className="text-sm">
                  <span className="text-muted-foreground">Grade:</span>{" "}
                  <span className="font-medium">
                    {it.gradeValue} {it.gradeType && it.gradeType !== "Pursuing" ? it.gradeType : ""}
                  </span>
                </p>
                {it.description && (
                  <p className="text-xs text-muted-foreground line-clamp-3 mt-2">{it.description}</p>
                )}
              </div>
              <div className="flex border-t border-border">
                <button
                  onClick={() => openEdit(it)}
                  className="flex-1 py-3 text-sm flex items-center justify-center gap-2 hover:bg-accent/5 text-accent transition-colors"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <div className="w-px bg-border" />
                <button
                  onClick={() => remove(it._id)}
                  className="flex-1 py-3 text-sm flex items-center justify-center gap-2 hover:bg-red-500/10 text-red-400 transition-colors"
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
        title={modal.id ? "Edit Education" : "Add Education"}
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Degree / Qualification *"
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
              placeholder="BCA, MCA, CBSE (X), etc."
              required
            />
            <Input
              label="Short Qualification Name"
              value={form.qualification}
              onChange={(e) => setForm({ ...form, qualification: e.target.value })}
              placeholder="Bachelor of Computer Applications"
            />
          </div>
          <Input
            label="School / College / Institution *"
            value={form.institution}
            onChange={(e) => setForm({ ...form, institution: e.target.value })}
            placeholder="Amity University, Noida"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              placeholder="July 2021"
            />
            <Input
              label="End Date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              placeholder="Dec 2024 or Pursuing"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Grade Type"
              value={form.gradeType}
              onChange={(e) => setForm({ ...form, gradeType: e.target.value })}
            >
              <option value="CGPA">CGPA</option>
              <option value="SGPA">SGPA</option>
              <option value="Percentage">Percentage</option>
              <option value="Marks">Marks</option>
              <option value="Pursuing">Pursuing</option>
            </Select>
            <Input
              label="Grade Value / Marks Obtained"
              value={form.gradeValue}
              onChange={(e) => setForm({ ...form, gradeValue: e.target.value })}
              placeholder="e.g. 8.5 or 85% or 425/500"
            />
          </div>
          <Textarea
            label="Description"
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Details about your studies, subjects, achievements..."
          />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">School / Board Logo</label>
            <ImageDropzone
              value={form.imageFile}
              preview={form.imagePreview}
              onChange={(file) => setForm({ ...form, imageFile: file })}
            />
          </div>
          <Input
            label="Display Order (lower = shown first)"
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
