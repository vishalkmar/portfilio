import { useEffect, useRef, useState } from "react";
import { FileText, Trash2, UploadCloud, Save, Plus, X } from "lucide-react";
import { personalApi } from "@/lib/adminApi";
import { API_BASE as BASE } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { PageHeader, Input, Textarea, Btn, ImageDropzone } from "./_shared";

export default function AdminPersonal() {
  const { toast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [resumeBusy, setResumeBusy] = useState(false);
  const resumeRef = useRef(null);

  const load = async () => {
    try {
      setLoading(true);
      const d = await personalApi.get();
      setData({
        ...d,
        positions: d.positions?.length ? d.positions : [""],
        socialLinks: {
          github: "",
          linkedin: "",
          twitter: "",
          instagram: "",
          facebook: "",
          website: "",
          ...(d.socialLinks || {}),
        },
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

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        position: data.position,
        positions: (data.positions || []).filter(Boolean),
        summary: data.summary,
        phone: data.phone,
        address: data.address,
        socialLinks: data.socialLinks,
      };
      const updated = await personalApi.update(payload);
      if (imgFile) {
        const withImage = await personalApi.uploadImage(imgFile);
        setData((d) => ({ ...d, image: withImage.image }));
        setImgFile(null);
      }
      toast({ title: "Saved", description: "Personal details updated." });
      await load();
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

  const uploadResume = async (file) => {
    if (!file) return;
    setResumeBusy(true);
    try {
      const updated = await personalApi.uploadResume(file);
      setData((d) => ({ ...d, resumeUrl: updated.resumeUrl, resumeFilename: updated.resumeFilename }));
      toast({ title: "Resume uploaded" });
    } catch (err) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setResumeBusy(false);
    }
  };

  const removeResume = async () => {
    if (!confirm("Remove current resume?")) return;
    setResumeBusy(true);
    try {
      const updated = await personalApi.removeResume();
      setData((d) => ({ ...d, resumeUrl: "", resumeFilename: "" }));
      toast({ title: "Resume removed" });
    } catch (err) {
      toast({ title: "Remove failed", variant: "destructive" });
    } finally {
      setResumeBusy(false);
    }
  };

  if (loading || !data)
    return <div className="text-center py-16 text-muted-foreground">Loading...</div>;

  const resumeFullUrl = data.resumeUrl ? `${BASE}${data.resumeUrl}` : "";

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Personal Details"
        subtitle="Your profile information shown across the portfolio."
        action={
          <Btn onClick={save} disabled={saving}>
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </Btn>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: photo + resume */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-card/60 border border-border p-5">
            <h3 className="font-bold mb-3">Profile Image</h3>
            <ImageDropzone value={imgFile} preview={data.image} onChange={setImgFile} />
            <p className="text-xs text-muted-foreground mt-2">
              Image is uploaded on Save. Hosted on Cloudinary.
            </p>
          </div>

          <div className="rounded-2xl bg-card/60 border border-border p-5">
            <h3 className="font-bold mb-3">Resume (PDF)</h3>
            {data.resumeUrl ? (
              <div className="space-y-3">
                <a
                  href={resumeFullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-colors"
                >
                  <FileText className="w-5 h-5 text-accent" />
                  <span className="text-sm truncate flex-1">{data.resumeFilename}</span>
                </a>
                <div className="flex gap-2">
                  <Btn variant="outline" onClick={() => resumeRef.current?.click()} disabled={resumeBusy}>
                    <UploadCloud className="w-4 h-4" /> Replace
                  </Btn>
                  <Btn variant="danger" onClick={removeResume} disabled={resumeBusy}>
                    <Trash2 className="w-4 h-4" /> Remove
                  </Btn>
                </div>
              </div>
            ) : (
              <Btn variant="outline" onClick={() => resumeRef.current?.click()} disabled={resumeBusy}>
                <UploadCloud className="w-4 h-4" /> {resumeBusy ? "Uploading..." : "Upload PDF"}
              </Btn>
            )}
            <input
              ref={resumeRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => uploadResume(e.target.files?.[0])}
            />
          </div>
        </div>

        {/* Right: details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-card/60 border border-border p-5 space-y-4">
            <h3 className="font-bold">Profile Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
              <Input label="Email" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
              <Input label="Phone" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
              <Input label="Address" value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} />
              <Input
                label="Primary Position"
                value={data.position}
                onChange={(e) => setData({ ...data, position: e.target.value })}
                className="md:col-span-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Typing Positions (rotating text on hero)
              </label>
              <div className="space-y-2">
                {data.positions.map((p, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--input)] border border-border focus:border-accent outline-none text-foreground placeholder:text-muted-foreground"
                      value={p}
                      onChange={(e) => {
                        const next = [...data.positions];
                        next[idx] = e.target.value;
                        setData({ ...data, positions: next });
                      }}
                      placeholder="Frontend Developer"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = data.positions.filter((_, i) => i !== idx);
                        setData({ ...data, positions: next.length ? next : [""] });
                      }}
                      className="p-2.5 rounded-lg hover:bg-red-500/10 text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <Btn
                  variant="outline"
                  type="button"
                  onClick={() => setData({ ...data, positions: [...data.positions, ""] })}
                >
                  <Plus className="w-4 h-4" /> Add Position
                </Btn>
              </div>
            </div>

            <Textarea
              label="Professional Summary"
              rows={5}
              value={data.summary}
              onChange={(e) => setData({ ...data, summary: e.target.value })}
              placeholder="I am a Full Stack Developer skilled in MERN..."
            />
          </div>

          <div className="rounded-2xl bg-card/60 border border-border p-5 space-y-4">
            <h3 className="font-bold">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(data.socialLinks).map((k) => (
                <Input
                  key={k}
                  label={k.charAt(0).toUpperCase() + k.slice(1)}
                  value={data.socialLinks[k]}
                  onChange={(e) =>
                    setData({ ...data, socialLinks: { ...data.socialLinks, [k]: e.target.value } })
                  }
                  placeholder={`https://${k}.com/yourprofile`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
