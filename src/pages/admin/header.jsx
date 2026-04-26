import { useEffect, useState } from "react";
import { Plus, X, Save, GripVertical } from "lucide-react";
import { headerApi } from "@/lib/adminApi";
import { useToast } from "@/hooks/use-toast";
import { PageHeader, Input, Btn } from "./_shared";

export default function AdminHeaderPage() {
  const { toast } = useToast();
  const [data, setData] = useState({ brand: "", navItems: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const d = await headerApi.get();
      setData({
        brand: d.brand || "",
        navItems: d.navItems?.length ? d.navItems : [{ id: "home", label: "Home" }],
      });
    } catch (err) {
      toast({ title: "Failed to load", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateNav = (idx, field, value) => {
    const next = [...data.navItems];
    next[idx] = { ...next[idx], [field]: value };
    setData({ ...data, navItems: next });
  };

  const addNav = () => {
    setData({ ...data, navItems: [...data.navItems, { id: "", label: "" }] });
  };

  const removeNav = (idx) => {
    const next = data.navItems.filter((_, i) => i !== idx);
    setData({ ...data, navItems: next.length ? next : [{ id: "home", label: "Home" }] });
  };

  const move = (idx, dir) => {
    const next = [...data.navItems];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setData({ ...data, navItems: next });
  };

  const save = async () => {
    setSaving(true);
    try {
      const cleaned = {
        brand: data.brand,
        navItems: data.navItems.filter((n) => n.id?.trim() && n.label?.trim()),
      };
      await headerApi.update(cleaned);
      toast({ title: "Saved", description: "Header updated." });
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

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Manage Header"
        subtitle="Brand name and navigation items shown in the site header."
        action={
          <Btn onClick={save} disabled={saving}>
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </Btn>
        }
      />

      <div className="space-y-6">
        <div className="rounded-2xl bg-card/60 border border-border p-5">
          <h3 className="font-bold mb-3">Brand</h3>
          <Input
            label="Brand / Site Name"
            value={data.brand}
            onChange={(e) => setData({ ...data, brand: e.target.value })}
            placeholder="Vishal Kumar"
          />
        </div>

        <div className="rounded-2xl bg-card/60 border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Navigation Items</h3>
            <Btn variant="outline" type="button" onClick={addNav}>
              <Plus className="w-4 h-4" /> Add Item
            </Btn>
          </div>

          <div className="space-y-3">
            {data.navItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 text-xs text-muted-foreground hover:text-accent disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, 1)}
                    disabled={idx === data.navItems.length - 1}
                    className="p-1 text-xs text-muted-foreground hover:text-accent disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <input
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--input)] border border-border focus:border-accent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                  value={item.id}
                  onChange={(e) => updateNav(idx, "id", e.target.value)}
                  placeholder="section-id (e.g. home)"
                />
                <input
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--input)] border border-border focus:border-accent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                  value={item.label}
                  onChange={(e) => updateNav(idx, "label", e.target.value)}
                  placeholder="Display Label"
                />
                <button
                  type="button"
                  onClick={() => removeNav(idx)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            <strong>id</strong>: must match a section id on your homepage (e.g. <code>home</code>, <code>education</code>, <code>projects</code>).{" "}
            <strong>label</strong>: text shown in the menu.
          </p>
        </div>
      </div>
    </div>
  );
}
