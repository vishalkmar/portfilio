import { useEffect, useState, lazy, Suspense } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Education from "@/components/education";
import Projects from "@/components/projects";
import Services from "@/components/services";
import Skills from "@/components/skills";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import { ScrollTrigger } from "@/hooks/use-gsap";

// three.js is ~700kB, so it is fetched after the page is interactive
const SceneBackground = lazy(() => import("@/components/three/scene-background"));

export default function Home() {
  const [showTop, setShowTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // sections render from API data, so the trigger positions are only
    // correct once those responses have landed and images have laid out
    const refresh = () => ScrollTrigger.refresh();
    const timer = setTimeout(refresh, 1200);
    window.addEventListener("load", refresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* one WebGL backdrop shared by every section */}
      <Suspense fallback={null}>
        <SceneBackground />
      </Suspense>

      {/* scroll progress rail */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 right-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent via-secondary to-accent"
      />

      {/* curtain wipe on first paint */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: [0.76, 0, 0.24, 1] }}
        className="pointer-events-none fixed inset-0 z-[70] origin-top bg-gradient-to-br from-accent to-secondary"
      />

      <div className="relative">
        <Header />
        <Hero />
        <Education />
        <Projects />
        <Skills />
        <Services />
        <Contact />
        <Footer />
      </div>

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            data-testid="back-to-top-fab"
            className="fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-accent to-secondary text-white shadow-2xl shadow-accent/50"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
