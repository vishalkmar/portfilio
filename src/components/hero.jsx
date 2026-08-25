import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Download, Eye, ArrowRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { publicApi } from "@/lib/publicApi";
import { API_BASE } from "@/lib/api";
import { gsap } from "@/hooks/use-gsap";

// shares the three.js chunk with the page backdrop
const HeroOrb = lazy(() => import("@/components/three/hero-orb"));

const FALLBACK_TEXTS = [
  "Full Stack Developer",
  "MERN & Next.js Developer",
  "Generative AI, RAG & LangChain",
  "AWS, Docker & CI/CD",
];

/** Shipped with the frontend build, so the CV is downloadable even if the API is down. */
const LOCAL_RESUME = "/resume.pdf";

const HIGHLIGHTS = [
  { value: "1.5+", label: "Years Experience" },
  { value: "10+", label: "Live Platforms" },
  { value: "50K+", label: "Monthly Users" },
];

/** Glass chips that float around the portrait. */
const ORBIT_BADGES = [
  { label: "React", icon: "\u{269B}\u{FE0F}", position: { top: "8%", left: "-4%" } },
  { label: "Node.js", icon: "\u{1F7E9}", position: { top: "26%", right: "-8%" } },
  { label: "Next.js", icon: "\u{25B2}", position: { bottom: "22%", left: "-9%" } },
  { label: "RAG / LLM", icon: "\u{1F916}", position: { bottom: "6%", right: "-2%" } },
];

/** Scrolls under the hero as a quick read of the stack. */
const STACK_TICKER = [
  "React.js", "Next.js", "Node.js", "Express.js", "TypeScript", "MongoDB",
  "PostgreSQL", "MySQL", "React Native", "Tailwind CSS", "Redis", "Docker",
  "AWS", "LangChain", "Vector DB", "Razorpay", "Stripe", "Firebase",
];

export default function Hero() {
  const [currentText, setCurrentText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [data, setData] = useState({
    name: "Vishal Kumar",
    image: "",
    summary: "",
    address: "",
    email: "",
    positions: FALLBACK_TEXTS,
    resumeUrl: "",
    socialLinks: {},
  });

  const ctaRef = useRef(null);

  useEffect(() => {
    publicApi
      .personal()
      .then((d) => {
        setData({
          name: d.name || "Vishal Kumar",
          image: d.image || "",
          summary: d.summary || "",
          address: d.address || "",
          email: d.email || "",
          positions: d.positions?.length
            ? d.positions
            : d.position
            ? [d.position]
            : FALLBACK_TEXTS,
          resumeUrl: d.resumeUrl || "",
          socialLinks: d.socialLinks || {},
        });
      })
      .catch(() => {});
  }, []);

  /* ---------------- typewriter ---------------- */
  useEffect(() => {
    const texts = data.positions?.length ? data.positions : FALLBACK_TEXTS;
    let typeIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer;

    const type = () => {
      const fullText = texts[typeIndex];
      setCurrentText((prev) =>
        deleting
          ? fullText.substring(0, prev.length - 1)
          : fullText.substring(0, prev.length + 1)
      );

      if (!deleting && charIndex === fullText.length) {
        deleting = true;
        timer = setTimeout(type, 1800);
        return;
      }
      if (deleting && charIndex === 0) {
        deleting = false;
        typeIndex = (typeIndex + 1) % texts.length;
      }
      charIndex = deleting ? charIndex - 1 : charIndex + 1;
      timer = setTimeout(type, deleting ? 40 : 85);
    };

    timer = setTimeout(type, 500);
    return () => clearTimeout(timer);
  }, [data.positions]);

  useEffect(() => {
    const cursorTimer = setInterval(() => setShowCursor((p) => !p), 500);
    return () => clearInterval(cursorTimer);
  }, []);

  /* ---------------- magnetic CTA ---------------- */
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return undefined;
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const buttons = el.querySelectorAll("[data-magnetic]");
    const cleanups = [];

    buttons.forEach((btn) => {
      const toX = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
      const toY = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });

      const onMove = (e) => {
        const r = btn.getBoundingClientRect();
        toX((e.clientX - (r.left + r.width / 2)) * 0.25);
        toY((e.clientY - (r.top + r.height / 2)) * 0.35);
      };
      const onLeave = () => {
        toX(0);
        toY(0);
      };

      btn.addEventListener("pointermove", onMove);
      btn.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        btn.removeEventListener("pointermove", onMove);
        btn.removeEventListener("pointerleave", onLeave);
        gsap.killTweensOf(btn);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const scrollToProjects = () =>
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });

  /**
   * Resolves where the CV actually lives.
   *
   * The API endpoint is preferred because it sets Content-Disposition, so the
   * browser saves the file instead of previewing it. But a host with an
   * ephemeral filesystem can lose the uploaded PDF, so the endpoint is probed
   * once and the button falls back to the copy bundled with this build rather
   * than sending anyone to a 404.
   */
  const [resumeHref, setResumeHref] = useState(LOCAL_RESUME);

  useEffect(() => {
    if (!data.resumeUrl) {
      setResumeHref(LOCAL_RESUME);
      return undefined;
    }

    const url = `${API_BASE}/api/personal/resume/download`;
    const controller = new AbortController();

    fetch(url, { method: "HEAD", signal: controller.signal })
      .then((res) => setResumeHref(res.ok ? url : LOCAL_RESUME))
      .catch(() => setResumeHref(LOCAL_RESUME));

    return () => controller.abort();
  }, [data.resumeUrl]);

  const socials = [
    { key: "github", Icon: Github, href: data.socialLinks?.github, label: "GitHub" },
    { key: "linkedin", Icon: Linkedin, href: data.socialLinks?.linkedin, label: "LinkedIn" },
    { key: "email", Icon: Mail, href: data.email ? `mailto:${data.email}` : "", label: "Email" },
  ].filter((s) => s.href);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24"
    >
      {/* spotlight that lifts the headline off the star field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_40%,rgba(0,217,255,0.10),transparent_70%)]"
      />

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ------------------- copy ------------------- */}
          <div className="text-center lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Available for work
            </motion.span>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-3 text-lg font-medium text-muted-foreground"
            >
              Hello, I&apos;m
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="mb-5 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl xl:text-8xl"
            >
              <span className="gradient-text animate-gradient">{data.name}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-6 flex min-h-[3rem] items-center justify-center text-xl font-semibold text-foreground/90 md:text-3xl lg:justify-start"
            >
              <span className="text-muted-foreground">&lt;</span>
              <span className="mx-2">{currentText}</span>
              <span
                className={`text-accent transition-opacity ${showCursor ? "opacity-100" : "opacity-0"}`}
              >
                |
              </span>
              <span className="text-muted-foreground">/&gt;</span>
            </motion.div>

            {data.summary && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg lg:mx-0"
              >
                {data.summary}
              </motion.p>
            )}

            {/* highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mx-auto mb-9 grid max-w-md grid-cols-3 gap-3 lg:mx-0"
            >
              {HIGHLIGHTS.map((h) => (
                <div
                  key={h.label}
                  className="rounded-2xl border border-border/60 bg-card/40 px-3 py-3 text-center backdrop-blur-sm"
                >
                  <p className="text-xl font-extrabold gradient-text md:text-2xl">{h.value}</p>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {h.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              ref={ctaRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <button
                data-magnetic
                onClick={scrollToProjects}
                data-testid="button-view-work"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-accent to-secondary px-8 py-4 text-base font-bold text-white shadow-2xl shadow-accent/40 transition-shadow duration-500 hover:shadow-accent/70"
              >
                <Eye className="h-5 w-5" />
                View My Work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* a real anchor, so the browser handles the save */}
              <a
                data-magnetic
                href={resumeHref}
                download="Vishal-Kumar-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-download-resume"
                className="group inline-flex items-center gap-3 rounded-full border-2 border-accent px-8 py-4 text-base font-bold text-accent backdrop-blur-sm transition-colors duration-500 hover:bg-accent hover:text-accent-foreground"
              >
                <Download className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
                Download CV
              </a>
            </motion.div>

            {/* meta row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-5 lg:justify-start"
            >
              {data.address && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-accent" />
                  {data.address}
                </span>
              )}
              {socials.length > 0 && (
                <div className="flex items-center gap-3">
                  {socials.map(({ key, Icon, href, label }) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:text-accent"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* ------------------- 3D portrait ------------------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.5, ease: "easeOut" }}
            className="relative mx-auto aspect-square w-full max-w-[380px]"
          >
            <Suspense fallback={null}>
              <HeroOrb />
            </Suspense>

            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-[20%]"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/40 to-secondary/40 blur-2xl" />

              {/* rotating gradient ring: the spinning conic sits behind an
                  opaque inner circle, so only the 3px rim shows through */}
              <div className="relative h-full w-full overflow-hidden rounded-full p-[3px]">
                <div className="conic-ring absolute inset-[-25%]" />
                <div className="relative h-full w-full overflow-hidden rounded-full bg-background">
                  {data.image ? (
                    <img src={data.image} alt={data.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 to-secondary/20 text-6xl font-black gradient-text">
                      {data.name?.[0] || "V"}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* floating stack badges */}
            {ORBIT_BADGES.map((badge, i) => (
              <motion.span
                key={badge.label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1, y: [0, -9, 0] }}
                transition={{
                  opacity: { duration: 0.5, delay: 1.1 + i * 0.12 },
                  scale: { duration: 0.5, delay: 1.1 + i * 0.12 },
                  y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 },
                }}
                className="absolute z-20 hidden rounded-full border border-accent/25 bg-card/80 px-3 py-1.5 text-[11px] font-semibold text-foreground/90 shadow-lg shadow-black/40 backdrop-blur-md sm:block"
                style={badge.position}
              >
                <span className="mr-1.5" aria-hidden="true">
                  {badge.icon}
                </span>
                {badge.label}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* ------------------- stack ticker ------------------- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="relative mt-16 overflow-hidden border-y border-border/50 py-4"
          style={{
            maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          }}
        >
          {/* the list is rendered twice so the loop has no visible seam */}
          <div className="animate-marquee flex w-max items-center gap-8">
            {[...STACK_TICKER, ...STACK_TICKER].map((tech, i) => (
              <span
                key={`${tech}-${i}`}
                className="flex shrink-0 items-center gap-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground/70"
              >
                {tech}
                <span className="h-1 w-1 rounded-full bg-accent/50" />
              </span>
            ))}
          </div>
        </motion.div>
      </div>

    </section>
  );
}
