import { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Projects from "@/components/projects";
import Services from "@/components/services";
import Skills from "@/components/skills";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-fade').forEach(el => {
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll('.scroll-fade').forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <Header />
      <Hero />
      <Projects />
      <Services />
      <Skills />
      <Contact />
      <Footer />
    </motion.div>
  );
}
