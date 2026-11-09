import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  Download,
  Eye,
  ArrowRight,
  CalendarDays,
  Layers,
  Users,
  BrainCircuit,
  Sparkles,
  Code2,
} from "lucide-react";
import {
  SiNextdotjs,
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiDocker,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { publicApi } from "@/lib/publicApi";
import { gsap } from "@/hooks/use-gsap";
import { useResumeHref } from "@/hooks/use-resume-href";
import { useTour } from "@/components/guide/tour-context";
import { byteReact } from "@/components/guide/byte-events";

// both share the three.js chunk with the page backdrop
const HeroOrb = lazy(() => import("@/components/three/hero-orb"));
const HeroWave = lazy(() => import("@/components/three/hero-wave"));

const FALLBACK_TEXTS = [
  "Full Stack Developer",
  "MERN & Next.js Developer",
  "Generative AI, RAG & LangChain",
  "AWS, Docker & CI/CD",
];

const HIGHLIGHTS = [
  { value: 1.5, decimals: 1, suffix: "+", label: "Years Experience", Icon: CalendarDays },
  { value: 10, decimals: 0, suffix: "+", label: "Live Platforms", Icon: Layers },
  { value: 50, decimals: 0, suffix: "K+", label: "Monthly Users", Icon: Users },
];

/** Glass chips that float around the portrait. */
const ORBIT_BADGES = [
  { label: "React", Icon: SiReact, color: "#61DAFB", pos: { top: "4%", left: "4%" } },
  { label: "Node.js", Icon: SiNodedotjs, color: "#5FA04E", pos: { top: "10%", right: "-6%" } },
  { label: "Next.js", Icon: SiNextdotjs, color: "#FFFFFF", pos: { top: "42%", left: "-12%" } },
  { label: "MongoDB", Icon: SiMongodb, color: "#47A248", pos: { top: "48%", right: "-14%" } },
  { label: "MySQL", Icon: SiMysql, color: "#4FA3D1", pos: { bottom: "12%", left: "-4%" } },
  { label: "RAG / LLM", Icon: BrainCircuit, color: "#A78BFA", pos: { bottom: "6%", right: "-6%" } },
];

const TECH_STACK = [
  { label: "Next.js", Icon: SiNextdotjs, color: "#FFFFFF" },
  { label: "React", Icon: SiReact, color: "#61DAFB" },
  { label: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
  { label: "Express", Icon: SiExpress, color: "#E5E7EB" },
  { label: "MongoDB", Icon: SiMongodb, color: "#47A248" },
  { label: "MySQL", Icon: SiMysql, color: "#4FA3D1" },
  { label: "PostgreSQL", Icon: SiPostgresql, color: "#6C8EEF" },
  { label: "Docker", Icon: SiDocker, color: "#2496ED" },
  { label: "AWS", Icon: FaAws, color: "#FF9900" },
  { label: "Tailwind CSS", Icon: SiTailwindcss, color: "#38BDF8" },
  { label: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
];

/** Counts up from zero the first time it scrolls into view. */
function CountUp({ value, decimals, suffix, start = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState((0).toFixed(decimals));

  useEffect(() => {
    if (!inView || !start) return undefined;
    const controls = animate(0, value, {
      duration: 1.8,
      delay: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, start, value, decimals]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function Hero() {
  const [currentText, setCurrentText] = useState("");
  const [data, setData] = useState({
    name: "Vishal Kumar",
    image: "",
    positions: FALLBACK_TEXTS,
    resumeUrl: "",
  });

  const ctaRef = useRef(null);
  const { revealed } = useTour();

  // entrance animations wait until the intro curtain has parted
  const fadeUp = (delay = 0, y = 24) => ({
    initial: { opacity: 0, y },
    animate: revealed ? { opacity: 1, y: 0 } : { opacity: 0, y },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  });
  const resumeHref = useResumeHref(data.resumeUrl);

  useEffect(() => {
    publicApi
      .personal()
      .then((d) => {
        setData({
          name: d.name || "Vishal Kumar",
          image: d.image || "",
          positions: d.positions?.length
            ? d.positions
            : d.position
            ? [d.position]
            : FALLBACK_TEXTS,
          resumeUrl: d.resumeUrl || "",
        });
      })
      .catch(() => {});
  }, []);

  /* ---------------- typewriter ---------------- */
  useEffect(() => {
    if (!revealed) return undefined;
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

    timer = setTimeout(type, 900);
    return () => clearTimeout(timer);
  }, [data.positions, revealed]);

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

  const nameWords = (data.name || "Vishal Kumar").split(" ");

  return (
    <section
      id="home"
      className="relative flex flex-col justify-center overflow-hidden pb-6 pt-24 lg:min-h-[100svh] lg:pt-20"
    >
      {/* spotlight that lifts the headline off the star field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_25%_40%,rgba(0,217,255,0.09),transparent_70%),radial-gradient(ellipse_45%_45%_at_75%_45%,rgba(139,92,246,0.12),transparent_70%)]"
      />

      {/* three.js dot swell along the bottom edge */}
      <Suspense fallback={null}>
        <HeroWave className="h-[48%]" />
      </Suspense>

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* ------------------- copy ------------------- */}
          <div className="text-center lg:text-left">
            <motion.span
              {...fadeUp(0.2, 16)}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent shadow-[0_0_24px_-6px_rgba(0,217,255,0.6)] backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Available for work
              <motion.span
                animate={{ rotate: [0, 18, -12, 0], scale: [1, 1.25, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2 }}
                className="inline-flex"
              >
                <Sparkles className="h-3.5 w-3.5 text-secondary" />
              </motion.span>
            </motion.span>

            <motion.p
              {...fadeUp(0.3)}
              className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-5xl"
            >
              Hi, I&apos;m
            </motion.p>

            {/* each word slides up out of its own mask */}
            <h1 className="mb-3 text-5xl font-extrabold leading-[1.1] tracking-tight md:text-6xl xl:text-7xl">
              {nameWords.map((word, i) => (
                <span key={`${word}-${i}`} className="mr-[0.22em] inline-block overflow-hidden pb-1 align-bottom last:mr-0">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: revealed ? 0 : "110%" }}
                    transition={{ duration: 0.9, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className="gradient-text animate-gradient inline-block"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* typewriter: every new character springs in */}
            <motion.div
              {...fadeUp(0.7, 16)}
              className="mb-4 flex min-h-[2.25rem] items-center justify-center font-mono text-lg font-semibold text-foreground/90 md:text-xl lg:justify-start"
            >
              <Code2 className="mr-2 h-5 w-5 shrink-0 text-accent" />
              <span className="text-muted-foreground">&lt;</span>
              <span className="mx-1.5 whitespace-pre">
                {currentText.split("").map((ch, i) => (
                  <motion.span
                    key={`${i}-${ch}`}
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.25 }}
                    className="inline-block"
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-accent"
              >
                |
              </motion.span>
              <span className="ml-1.5 text-muted-foreground">/&gt;</span>
            </motion.div>

            <motion.p
              {...fadeUp(0.8, 16)}
              className="mx-auto mb-3 max-w-xl text-base leading-relaxed text-foreground/85 md:text-lg lg:mx-0"
            >
              Full Stack Developer with{" "}
              <span className="font-bold text-accent">1.5+ years</span> of experience shipping
              production-grade web and mobile applications.
            </motion.p>

            <motion.p
              {...fadeUp(0.9, 16)}
              className="mx-auto mb-6 max-w-xl border-l-2 border-accent/70 pl-4 text-left text-sm leading-relaxed text-muted-foreground md:text-[15px] lg:mx-0"
            >
              I build and deploy scalable, real-world applications using React.js, Next.js,
              Node.js, Express.js, MongoDB, MySQL and PostgreSQL. I also create AI-powered
              products, CRM systems, real-time platforms and secure payment integrations.
            </motion.p>

            {/* CTAs */}
            <motion.div
              ref={ctaRef}
              {...fadeUp(1, 20)}
              className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <button
                data-magnetic
                onClick={scrollToProjects}
                data-testid="button-view-work"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-accent to-secondary px-7 py-3 text-sm font-bold text-white shadow-2xl shadow-accent/40 transition-shadow duration-500 hover:shadow-accent/70"
              >
                {/* sheen that sweeps across on hover */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
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
                onClick={() => byteReact("cv")}
                className="group inline-flex items-center gap-3 rounded-full border-2 border-accent px-7 py-3 text-sm font-bold text-accent backdrop-blur-sm transition-colors duration-500 hover:bg-accent hover:text-accent-foreground"
              >
                <Download className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
                Download CV
              </a>
            </motion.div>

            {/* highlights */}
            <div className="mx-auto grid max-w-xl grid-cols-3 gap-3 lg:mx-0">
              {HIGHLIGHTS.map(({ Icon, label, ...h }, i) => (
                <motion.div
                  key={label}
                  {...fadeUp(1.1 + i * 0.1, 20)}
                  whileHover={{ y: -4 }}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-accent/20 bg-card/50 px-3 py-3 backdrop-blur-md transition-colors duration-300 hover:border-accent/60 sm:flex-row sm:gap-3 sm:px-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-500 group-hover:rotate-[360deg]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-center sm:text-left">
                    <span className="block text-xl font-extrabold leading-none text-foreground md:text-2xl">
                      <CountUp {...h} start={revealed} />
                    </span>
                    <span className="mt-1 block text-[11px] font-medium text-muted-foreground sm:whitespace-nowrap md:text-xs">
                      {label}
                    </span>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ------------------- 3D portrait ------------------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 1.1, delay: 0.5, ease: "easeOut" }}
            className="relative mx-auto aspect-square w-full max-w-[300px] sm:max-w-[420px] xl:max-w-[480px]"
          >
            <Suspense fallback={null}>
              <HeroOrb />
            </Suspense>

            {/* slow orbit track with travelling glow dots */}
            <motion.svg
              aria-hidden="true"
              viewBox="0 0 200 200"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute inset-[6%]"
            >
              <defs>
                <linearGradient id="orbit-stroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.7" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="98" fill="none" stroke="url(#orbit-stroke)" strokeWidth="0.6" />
              <circle cx="100" cy="100" r="88" fill="none" stroke="#00D9FF" strokeOpacity="0.12" strokeWidth="0.5" strokeDasharray="2 4" />
              {[0, 72, 150, 215, 290].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <circle
                    key={deg}
                    cx={100 + 98 * Math.cos(rad)}
                    cy={100 + 98 * Math.sin(rad)}
                    r={i % 2 ? 1.6 : 2.2}
                    fill={i % 2 ? "#8B5CF6" : "#00D9FF"}
                    style={{ filter: "drop-shadow(0 0 3px currentColor)" }}
                  />
                );
              })}
            </motion.svg>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-[18%]"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/40 to-secondary/40 blur-2xl" />

              {/* rotating gradient ring: the spinning conic sits behind an
                  opaque inner circle, so only the 3px rim shows through */}
              <div className="relative h-full w-full overflow-hidden rounded-full p-[3px] shadow-[0_0_60px_-10px_rgba(0,217,255,0.6)]">
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
            {ORBIT_BADGES.map(({ label, Icon, color, pos }, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={revealed ? { opacity: 1, scale: 1, y: [0, -8, 0] } : { opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.1 }}
                transition={{
                  opacity: { duration: 0.5, delay: 1.1 + i * 0.12 },
                  scale: { type: "spring", stiffness: 260, damping: 18, delay: 1.1 + i * 0.12 },
                  y: { duration: 3.5 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
                }}
                className="absolute z-20 hidden items-center gap-2 rounded-xl border border-accent/25 bg-card/80 py-1.5 pl-1.5 pr-3 text-xs font-semibold text-foreground shadow-lg shadow-black/40 backdrop-blur-md sm:flex"
                style={pos}
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{ background: `${color}1f`, boxShadow: `0 0 14px -4px ${color}` }}
                >
                  <motion.span
                    animate={label === "React" ? { rotate: 360 } : { rotate: [0, -10, 10, 0] }}
                    transition={
                      label === "React"
                        ? { duration: 8, repeat: Infinity, ease: "linear" }
                        : { duration: 3, repeat: Infinity, repeatDelay: 2 + i * 0.4 }
                    }
                    className="inline-flex"
                  >
                    <Icon className="h-4 w-4" style={{ color }} />
                  </motion.span>
                </span>
                {label}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* ------------------- tech stack bar ------------------- */}
        <motion.div
          {...fadeUp(1.3, 30)}
          className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-accent/15 bg-card/40 px-5 py-4 backdrop-blur-md md:flex-row md:gap-6 lg:mt-10"
        >
          <div className="flex shrink-0 items-center gap-2 md:border-r md:border-border/60 md:pr-6">
            <Code2 className="h-5 w-5 text-accent" />
            <span className="text-lg font-bold text-foreground">Tech Stack</span>
          </div>

          <div className="flex flex-1 flex-wrap items-center justify-center gap-3 md:justify-between">
            {TECH_STACK.map(({ label, Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16, scale: 0.8 }}
                animate={revealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 240, damping: 16, delay: 1.45 + i * 0.05 }}
                whileHover={{ y: -6, scale: 1.12 }}
                className="group relative"
              >
                <div
                  title={label}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-background/70 transition-all duration-300 group-hover:border-transparent md:h-12 md:w-12"
                  style={{ "--glow": color }}
                >
                  <Icon className="h-6 w-6 transition-[filter] duration-300 group-hover:[filter:drop-shadow(0_0_8px_var(--glow))]" style={{ color }} />
                </div>
                <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-card px-2 py-0.5 text-[10px] font-semibold text-foreground opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
