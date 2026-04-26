import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, X } from "lucide-react";

export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
    <div>
      <h1 className="text-3xl md:text-4xl font-extrabold">
        {title.split(" ").map((w, i, a) =>
          i === a.length - 1 ? (
            <span key={i} className="gradient-text">
              {" "}
              {w}
            </span>
          ) : (
            <span key={i}>{i === 0 ? "" : " "}{w}</span>
          )
        )}
      </h1>
      {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const Input = ({ label, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-muted-foreground">{label}</label>}
    <input
      {...props}
      className={`w-full px-4 py-2.5 rounded-lg bg-[var(--input)] border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-foreground placeholder:text-muted-foreground ${props.className || ""}`}
    />
  </div>
);

export const Textarea = ({ label, rows = 4, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-muted-foreground">{label}</label>}
    <textarea
      {...props}
      rows={rows}
      className={`w-full px-4 py-2.5 rounded-lg bg-[var(--input)] border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-foreground placeholder:text-muted-foreground ${props.className || ""}`}
    />
  </div>
);

export const Select = ({ label, children, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-muted-foreground">{label}</label>}
    <select
      {...props}
      className={`w-full px-4 py-2.5 rounded-lg bg-[var(--input)] border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-foreground placeholder:text-muted-foreground ${props.className || ""}`}
    >
      {children}
    </select>
  </div>
);

export const Btn = ({ variant = "primary", children, className = "", ...props }) => {
  const base = "px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-accent to-secondary text-white shadow-lg shadow-accent/30 hover:shadow-accent/50",
    outline: "border border-border hover:border-accent text-foreground hover:bg-accent/5",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30",
    ghost: "text-muted-foreground hover:text-accent hover:bg-accent/5",
  };
  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Modal = ({ open, onClose, title, children, maxWidth = "max-w-2xl" }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent/10">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
};

export function ImageDropzone({ value, onChange, preview, className = "" }) {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    onChange(file);
  };

  const previewUrl = value instanceof File ? URL.createObjectURL(value) : preview || "";

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => ref.current?.click()}
      className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all ${
        drag ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
      } ${className}`}
    >
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {previewUrl ? (
        <div className="relative h-48 rounded-xl overflow-hidden">
          <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white font-medium">Click or drop to change</span>
          </div>
        </div>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center text-muted-foreground">
          <UploadCloud className="w-10 h-10 mb-2" />
          <p className="font-medium">Drag & drop an image</p>
          <p className="text-xs">or click to browse</p>
        </div>
      )}
    </div>
  );
}
