import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code, Server, Cloud, Smartphone, Search, Users, Palette, Database,
  Shield, Zap, Globe, Layers, Wrench, Briefcase, Brain, Check, ArrowRight,
  Compass, PenTool, Rocket, LifeBuoy, MessageSquareText,
} from "lucide-react";
import { publicApi } from "@/lib/publicApi";
import { useRevealOnScroll } from "@/hooks/use-gsap";
import { byteReact } from "@/components/guide/byte-events";

const ICON_MAP = {
  Code, Server, Cloud, Smartphone, Search, Users, Palette, Database,
  Shield, Zap, Globe, Layers, Wrench, Briefcase, Brain,
};

/** Tailwind cannot see `from-${x}`, so colours are mapped explicitly. */
const PALETTE = {
  "from-blue-500 to-cyan-500": ["#3b82f6", "#06b6d4"],
  "from-teal-500 to-cyan-500": ["#14b8a6", "#06b6d4"],
  "from-green-500 to-emerald-500": ["#22c55e", "#10b981"],
  "from-purple-500 to-violet-500": ["#a855f7", "#8b5cf6"],
  "from-orange-500 to-red-500": ["#f97316", "#ef4444"],
  "from-pink-500 to-rose-500": ["#ec4899", "#f43f5e"],
  "from-indigo-500 to-blue-500": ["#6366f1", "#3b82f6"],
  "from-yellow-500 to-amber-500": ["#eab308", "#f59e0b"],
};
const colorsFor = (c) => PALETTE[c] || PALETTE["from-blue-500 to-cyan-500"];

const ROTATE_MS = 6500;

const PROCESS = [
  { Icon: Compass, title: "Discover", text: "Goals, users and constraints — agreed before a line of code." },
  { Icon: PenTool, title: "Design", text: "Data model, API contract and UI flows, reviewed together." },
  { Icon: Rocket, title: "Build & Ship", text: "Iterative releases to a live URL you can click every week." },
  { Icon: LifeBuoy, title: "Support", text: "Monitoring, fixes and the next round of features." },
];

/** Hands the chosen service to the contact form and lets Byte acknowledge it. */
function discuss(service) {
  window.dispatchEvent(
    new CustomEvent("contact:prefill", { detail: { subject: `Enquiry: ${service.title}` } })
  );
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  byteReact("service", { title: service.title });
}

function DetailPanel({ service, index, total }) {
  const Icon = ICON_MAP[service.icon] || Code;
  const [a, b] = colorsFor(service.color);

  return (
    <motion.div
      key={service._id}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-full flex-col p-7 md:p-10"
    >
      {/* colour wash for the active service */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-25 blur-3xl"
        style={{ background: `radial-gradient(circle, ${a}, transparent 70%)` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{ background: `radial-gradient(circle, ${b}, transparent 70%)` }}
      />

      <div className="relative flex items-start justify-between gap-6">
        {/* icon inside spinning rings */}
        <div className="relative h-24 w-24 shrink-0">
          <motion.div
            className="absolute inset-0 rounded-3xl border border-dashed"
            style={{ borderColor: `${a}80` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            initial={{ scale: 0.6, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="absolute inset-3 flex items-center justify-center rounded-2xl text-white shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${a}, ${b})`, boxShadow: `0 18px 40px -12px ${a}` }}
          >
            <Icon className="h-8 w-8" />
          </motion.div>
        </div>

        <span
          className="select-none font-mono text-6xl font-black leading-none opacity-15 md:text-7xl"
          style={{ color: b }}
        >
          {String(index + 1).padStart(2, "0")}
          <span className="text-2xl">/{String(total).padStart(2, "0")}</span>
        </span>
      </div>

      <h3 className="relative mt-6 text-2xl font-extrabold leading-tight tracking-tight text-foreground md:text-3xl">
        {service.title}
      </h3>
      <p className="relative mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
        {service.description}
      </p>

      {service.features?.length > 0 && (
        <ul className="relative mt-6 grid gap-3 sm:grid-cols-2">
          {service.features.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-3.5 py-2.5 text-sm text-foreground/90"
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
              >
                <Check className="h-3 w-3 text-white" strokeWidth={3.5} />
              </span>
              {f}
            </motion.li>
          ))}
        </ul>
      )}

      <div className="relative mt-auto flex flex-wrap items-center gap-3 pt-8">
        <button
          onClick={() => discuss(service)}
          className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.03]"
          style={{ background: `linear-gradient(135deg, ${a}, ${b})`, boxShadow: `0 12px 30px -10px ${a}` }}
        >
          <MessageSquareText className="h-4 w-4" />
          Discuss this service
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
        <span className="text-xs text-muted-foreground">Usually replies within 24 hours</span>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    publicApi
      .services()
      .then((d) => setServices(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scopeRef = useRevealOnScroll("[data-reveal]", { y: 50, stagger: 0.06 }, [services]);

  // only auto-rotate while the section is actually on screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [loading]);

  useEffect(() => {
    if (paused || !inView || services.length < 2) return undefined;
    const t = setTimeout(() => setActive((i) => (i + 1) % services.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [active, paused, inView, services.length]);

  const current = services[active];

  return (
    <section
      id="services"
      ref={(el) => {
        scopeRef.current = el;
        sectionRef.current = el;
      }}
      className="relative overflow-hidden py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/3 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span
            data-reveal
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent"
          >
            <Briefcase className="h-3.5 w-3.5" />
            What I Do
          </span>
          <h2 data-reveal className="mb-4 text-4xl font-extrabold md:text-6xl">
            My <span className="gradient-text">Services</span>
          </h2>
          <p data-reveal className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Everything it takes to get a product from an idea to something live, secure and
            fast — build, integrate, deploy and harden.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-muted-foreground">Loading services…</div>
        ) : services.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Briefcase className="mx-auto mb-3 h-12 w-12" />
            No services to show yet.
          </div>
        ) : (
          <div
            data-reveal
            className="grid overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-md lg:grid-cols-[380px_minmax(0,1fr)]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* ---------- service list ---------- */}
            <div className="flex gap-2 overflow-x-auto border-b border-border/60 p-3 lg:flex-col lg:gap-1 lg:overflow-visible lg:border-b-0 lg:border-r lg:p-4">
              {services.map((s, i) => {
                const Icon = ICON_MAP[s.icon] || Code;
                const [a, b] = colorsFor(s.color);
                const on = i === active;
                return (
                  <button
                    key={s._id}
                    onClick={() => setActive(i)}
                    className={`group relative flex shrink-0 items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 text-left transition-colors duration-300 lg:w-full ${
                      on ? "text-foreground" : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="service-active"
                        className="absolute inset-0 rounded-2xl border border-white/10 bg-white/[0.06]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative w-6 font-mono text-[11px] font-bold opacity-60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                        on ? "text-white" : "bg-background/60 group-hover:scale-110"
                      }`}
                      style={on ? { background: `linear-gradient(135deg, ${a}, ${b})` } : undefined}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="relative whitespace-nowrap text-sm font-semibold lg:whitespace-normal">
                      {s.title}
                    </span>

                    {/* auto-advance timer */}
                    {on && (
                      <span className="absolute inset-x-3 bottom-1 h-[2px] overflow-hidden rounded-full bg-white/5">
                        <motion.span
                          key={`${active}-${paused}-${inView}`}
                          className="block h-full origin-left rounded-full"
                          style={{ background: `linear-gradient(90deg, ${a}, ${b})` }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: paused || !inView ? 0 : 1 }}
                          transition={{ duration: paused || !inView ? 0.2 : ROTATE_MS / 1000, ease: "linear" }}
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ---------- detail ---------- */}
            <div className="relative min-h-[460px]">
              <AnimatePresence mode="wait">
                {current && (
                  <DetailPanel key={current._id} service={current} index={active} total={services.length} />
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ---------- how I work ---------- */}
        <div className="relative mt-16">
          <h3 data-reveal className="mb-8 text-center text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
            How I work
          </h3>
          <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* connecting line that draws itself */}
            <motion.span
              aria-hidden="true"
              className="absolute left-[12%] right-[12%] top-7 hidden h-px origin-left bg-gradient-to-r from-accent via-secondary to-accent lg:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
            {PROCESS.map(({ Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                className="relative text-center"
              >
                <span className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/40 bg-background text-accent shadow-[0_0_30px_-8px_rgba(0,217,255,0.6)]">
                  <Icon className="h-6 w-6" />
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-accent to-secondary text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                </span>
                <p className="font-bold text-foreground">{title}</p>
                <p className="mx-auto mt-1 max-w-[220px] text-sm text-muted-foreground">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-accent to-secondary px-10 py-4 text-base font-bold text-white shadow-2xl shadow-accent/40 transition-shadow duration-500 hover:shadow-accent/70"
          >
            Let&apos;s Work Together
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
