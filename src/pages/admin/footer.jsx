import { useEffect, useState } from "react";
import { Plus, X, Save } from "lucide-react";
import { footerApi } from "@/lib/adminApi";
import { useToast } from "@/hooks/use-toast";
import { PageHeader, Input, Textarea, Btn } from "./_shared";

const emptyLink = { name: "", href: "#" };

const SECTIONS = [
  { key: "quickLinks", title: "Quick Links" },
  { key: "serviceLinks", title: "Service Links" },
  { key: "bottomLinks", title: "Bottom Links (Privacy, Terms...)" },
];

export default function AdminFooterPage() {
  const { toast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const d = await footerApi.get();
      setData({
        brand: d.brand || "",
        tagline: d.tagline || "",
        copyright: d.copyright || "",
        quickLinks: d.quickLinks?.length ? d.quickLinks : [{ ...emptyLink }],
        serviceLinks: d.serviceLinks?.length ? d.serviceLinks : [{ ...emptyLink }],
        bottomLinks: d.bottomLinks?.length ? d.bottomLinks : [{ ...emptyLink }],
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

  const update = (section, idx, field, value) => {
    const list = [...data[section]];
    list[idx] = { ...list[idx], [field]: value };
    setData({ ...data, [section]: list });
  };
  const add = (section) => {
    setData({ ...data, [section]: [...data[section], { ...emptyLink }] });
  };
  const remove = (section, idx) => {
    const list = data[section].filter((_, i) => i !== idx);
    setData({ ...data, [section]: list.length ? list : [{ ...emptyLink }] });
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        brand: data.brand,
        tagline: data.tagline,
        copyright: data.copyright,
        quickLinks: data.quickLinks.filter((l) => l.name?.trim()),
        serviceLinks: data.serviceLinks.filter((l) => l.name?.trim()),
        bottomLinks: data.bottomLinks.filter((l) => l.name?.trim()),
      };
      await footerApi.update(payload);
      toast({ title: "Saved", description: "Footer updated." });
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

  if (loading || !data)
    return <div className="text-center py-16 text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Manage Footer"
        subtitle="Brand, tagline, copyright text and footer link sections."
        action={
          <Btn onClick={save} disabled={saving}>
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </Btn>
        }
      />

      <div className="space-y-6">
        <div className="rounded-2xl bg-card/60 border border-border p-5 space-y-4">
          <h3 className="font-bold">Brand & Text</h3>
          <Input
            label="Brand Name"
            value={data.brand}
            onChange={(e) => setData({ ...data, brand: e.target.value })}
            placeholder="Vishal Kumar"
          />
          <Textarea
            label="Tagline"
            rows={3}
            value={data.tagline}
            onChange={(e) => setData({ ...data, tagline: e.target.value })}
            placeholder="Full Stack Developer passionate about creating exceptional digital experiences."
          />
          <Input
            label="Copyright Line (after the © year)"
            value={data.copyright}
            onChange={(e) => setData({ ...data, copyright: e.target.value })}
            placeholder="All rights reserved. Built with React."
          />
        </div>

        {SECTIONS.map(({ key, title }) => (
          <div key={key} className="rounded-2xl bg-card/60 border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{title}</h3>
              <Btn variant="outline" type="button" onClick={() => add(key)}>
                <Plus className="w-4 h-4" /> Add
              </Btn>
            </div>
            <div className="space-y-2">
              {data[key].map((link, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 rounded-lg bg-[var(--input)] border border-border focus:border-accent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    value={link.name}
                    onChange={(e) => update(key, idx, "name", e.target.value)}
                    placeholder="Link name (e.g. Home)"
                  />
                  <input
                    className="flex-1 px-3 py-2 rounded-lg bg-[var(--input)] border border-border focus:border-accent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    value={link.href}
                    onChange={(e) => update(key, idx, "href", e.target.value)}
                    placeholder="#section or https://..."
                  />
                  <button
                    type="button"
                    onClick={() => remove(key, idx)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
