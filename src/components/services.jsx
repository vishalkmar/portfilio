import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Code, Server, Cloud, Smartphone, Search, Users, Palette, Database,
  Shield, Zap, Globe, Layers, Wrench, Briefcase, Brain, Check, ArrowRight,
} from "lucide-react";
import { publicApi } from "@/lib/publicApi";
import { useRevealOnScroll, useTilt } from "@/hooks/use-gsap";

const ICON_MAP = {
  Code, Server, Cloud, Smartphone, Search, Users, Palette, Database,
  Shield, Zap, Globe, Layers, Wrench, Briefcase, Brain,
};

/** Tailwind cannot see `from-${x}`, so the gradients are mapped explicitly. */
const GRADIENT = {
  "from-blue-500 to-cyan-500": "linear-gradient(135deg,#3b82f6,#06b6d4)",
  "from-teal-500 to-cyan-500": "linear-gradient(135deg,#14b8a6,#06b6d4)",
  "from-green-500 to-emerald-500": "linear-gradient(135deg,#22c55e,#10b981)",
  "from-purple-500 to-violet-500": "linear-gradient(135deg,#a855f7,#8b5cf6)",
  "from-orange-500 to-red-500": "linear-gradient(135deg,#f97316,#ef4444)",
  "from-pink-500 to-rose-500": "linear-gradient(135deg,#ec4899,#f43f5e)",
  "from-indigo-500 to-blue-500": "linear-gradient(135deg,#6366f1,#3b82f6)",
  "from-yellow-500 to-amber-500": "linear-gradient(135deg,#eab308,#f59e0b)",
};
const gradientFor = (c) => GRADIENT[c] || GRADIENT["from-blue-500 to-cyan-500"];

function ServiceCard({ service }) {
  const tiltRef = useTilt({ max: 8, scale: 1.02 });
  const Icon = ICON_MAP[service.icon] || Code;
  const gradient = gradientFor(service.color);

  return (
    <div data-reveal className="h-full [perspective:1000px]">
      <article
        ref={tiltRef}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-md transition-colors duration-500 hover:border-accent/70"
        style={{ "--glare-opacity": 0, "--glare-x": "50%", "--glare-y": "50%" }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: "var(--glare-opacity)",
            background:
              "radial-gradient(300px circle at var(--glare-x) var(--glare-y), rgba(0,217,255,0.13), transparent 65%)",
          }}
        />
        {/* accent hairline that lights up on hover */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-0.5 opacity-40 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: gradient }}
        />

        <div className="relative">
          <div
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
            style={{ background: gradient }}
          >
            <Icon className="h-6 w-6" />
          </div>

          <h3 className="mb-3 text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-accent">
            {service.title}
          </h3>

          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            {service.description}
          </p>

          {service.features?.length > 0 && (
            <ul className="mt-auto space-y-2 border-t border-border/60 pt-4">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                  <span
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                    style={{ background: gradient }}
                  >
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3.5} />
                  </span>
                  <span className="transition-colors duration-200 group-hover:text-foreground/90">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </div>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .services()
      .then((d) => setServices(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scopeRef = useRevealOnScroll("[data-reveal]", { y: 50, stagger: 0.06 }, [services]);

  return (
    <section id="services" ref={scopeRef} className="relative overflow-hidden py-24">
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
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}

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
