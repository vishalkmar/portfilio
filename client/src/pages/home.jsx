import { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Projects from "@/components/projects";
import Services from "@/components/services";
import Skills from "@/components/skills";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import Education from "../components/education";

export default function Home() {
  useEffect(() => {
    // Enhanced Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Add staggered animation for child elements
          const children = entry.target.querySelectorAll('.scroll-fade-child');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('visible');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Observe all scroll-fade elements
    document.querySelectorAll('.scroll-fade').forEach(el => {
      observer.observe(el);
    });

    // Smooth scrolling enhancement
    const handleSmoothScroll = (e) => {
      if (e.target.closest('a[href^="#"]') || e.target.closest('button[data-scroll]')) {
        e.preventDefault();
        const target = e.target.getAttribute('href') || e.target.getAttribute('data-scroll');
        if (target && target.startsWith('#')) {
          const element = document.querySelector(target);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);

    // Parallax effect for background elements
    const handleParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      const parallaxElements = document.querySelectorAll('.parallax');
      parallaxElements.forEach(element => {
        element.style.transform = `translateY(${rate}px)`;
      });
    };

    window.addEventListener('scroll', handleParallax);

    // Performance optimization - throttle scroll events
    let ticking = false;
    const handleScrollOptimized = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleParallax();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScrollOptimized, { passive: true });

    // Cleanup
    return () => {
      document.querySelectorAll('.scroll-fade').forEach(el => {
        observer.unobserve(el);
      });
      document.removeEventListener('click', handleSmoothScroll);
      window.removeEventListener('scroll', handleParallax);
      window.removeEventListener('scroll', handleScrollOptimized);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-background overflow-x-hidden"
    >
      {/* Page Load Animation */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 bg-gradient-to-br from-accent to-secondary z-50 origin-top"
      />
      
      {/* Main Content */}
      <div className="relative">
        <Header />
        
        {/* Page Sections with Enhanced Animations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <Hero />
        </motion.div>

            <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Education/>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Projects />
        </motion.div>
        
        

         <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Skills />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Services />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Contact />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Footer />
        </motion.div>
      </div>
      
      {/* Floating Action Button - Back to Top */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-accent to-secondary text-white rounded-full shadow-2xl shadow-accent/50 flex items-center justify-center z-40 hover:shadow-accent/70 transition-all duration-300"
        style={{ display: 'none' }}
        onScroll={() => {
          const button = document.querySelector('.back-to-top');
          if (window.scrollY > 500) {
            button.style.display = 'flex';
          } else {
            button.style.display = 'none';
          }
        }}
        data-testid="back-to-top-fab"
      >
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ↑
        </motion.div>
      </motion.button>
    </motion.div>
  );
}