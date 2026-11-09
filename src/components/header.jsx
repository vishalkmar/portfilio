import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicApi } from "@/lib/publicApi";
import { useResumeHref } from "@/hooks/use-resume-href";
import { useTour } from "@/components/guide/tour-context";
import { byteReact } from "@/components/guide/byte-events";

const DEFAULT_NAV = [
  { id: "home", label: "Home" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [brand, setBrand] = useState("Full Stack Developer");
  const [name, setName] = useState("Vishal Kumar");
  const [resumeUrl, setResumeUrl] = useState("");
  const resumeHref = useResumeHref(resumeUrl);
  const { revealed } = useTour();
  const [navItems, setNavItems] = useState(DEFAULT_NAV);

  useEffect(() => {
    publicApi
      .header()
      .then((d) => {
        if (d?.brand) setBrand(d.brand);
        if (Array.isArray(d?.navItems) && d.navItems.length) setNavItems(d.navItems);
      })
      .catch(() => {});
    publicApi
      .personal()
      .then((d) => {
        if (d?.name) setName(d.name);
        if (d?.resumeUrl) setResumeUrl(d.resumeUrl);
      })
      .catch(() => {});
  }, []);

  const nameParts = name.trim().split(" ");
  const lastName = nameParts.length > 1 ? nameParts.pop() : "";
  const firstName = nameParts.join(" ");

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      let current = 'home';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute('id') || 'home';
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={revealed ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-effect backdrop-blur-xl shadow-2xl shadow-accent/20'
          : 'border-b border-accent/10 bg-background/30 backdrop-blur-md'
      }`}
    >
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group flex cursor-pointer items-center gap-3"
            onClick={() => scrollToSection('home')}
            whileHover={{ scale: 1.03 }}
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 font-mono text-base font-black shadow-[0_0_20px_-6px_rgba(0,217,255,0.8)]">
              <motion.span
                animate={{ rotate: [0, 0, 180, 180, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-xl border border-dashed border-secondary/40"
              />
              <span className="gradient-text">&lt;/&gt;</span>
            </span>
            <span className="leading-tight">
              <span className="block text-xl font-extrabold text-foreground">
                {firstName} {lastName && <span className="gradient-text animate-gradient">{lastName}</span>}
              </span>
              <span className="block text-xs font-medium text-muted-foreground">{brand}</span>
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 rounded-full border border-border/50 bg-card/30 p-1 backdrop-blur-md">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                onClick={() => scrollToSection(item.id)}
                className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${
                  activeSection === item.id
                    ? 'text-white'
                    : 'text-foreground/80 hover:text-accent'
                }`}
                data-testid={`nav-link-${item.id}`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeSection === item.id && (
                  <motion.span
                    layoutId="activeSection"
                    className="absolute inset-0 rounded-full border border-accent/60 bg-gradient-to-r from-accent/25 to-secondary/25 shadow-[0_0_18px_-4px_rgba(0,217,255,0.7)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </motion.button>
            ))}
          </div>

          <motion.a
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            href={resumeHref}
            download="Vishal-Kumar-Resume.pdf"
            onClick={() => byteReact("cv")}
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden items-center gap-2 rounded-full border-2 border-accent/80 px-5 py-2 text-sm font-bold text-foreground shadow-[0_0_20px_-8px_rgba(0,217,255,0.9)] transition-colors duration-300 hover:bg-accent hover:text-accent-foreground lg:inline-flex"
          >
            <Download className="h-4 w-4 text-accent transition-all group-hover:translate-y-0.5 group-hover:text-accent-foreground" />
            Download CV
          </motion.a>

          {/* Mobile Menu Button */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:hidden"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-accent hover:bg-accent/20 hover:scale-110 transition-all duration-300"
              data-testid="mobile-menu-toggle"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            opacity: isMenuOpen ? 1 : 0,
            height: isMenuOpen ? "auto" : 0,
            y: isMenuOpen ? 0 : -20
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`lg:hidden overflow-hidden ${isMenuOpen ? 'mt-4 pt-4 border-t border-border' : ''}`}
        >
          <div className="flex flex-col space-y-4">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isMenuOpen ? 1 : 0,
                  x: isMenuOpen ? 0 : -20
                }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => scrollToSection(item.id)}
                className={`nav-link text-left text-lg font-medium transition-all duration-300 hover:text-accent hover:translate-x-2 ${
                  activeSection === item.id ? 'text-accent' : 'text-foreground'
                }`}
                data-testid={`mobile-nav-link-${item.id}`}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </nav>
    </motion.header>
  );
}
