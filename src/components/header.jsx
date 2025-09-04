import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

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

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'education', label: 'education' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'glass-effect backdrop-blur-xl shadow-2xl shadow-accent/20' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl font-bold cursor-pointer"
            onClick={() => scrollToSection('home')}
            whileHover={{ scale: 1.05 }}
          >
            <span className="gradient-text animate-glow">Vishal Kumar</span>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                onClick={() => scrollToSection(item.id)}
                className={`nav-link relative text-lg font-medium transition-all duration-300 hover:scale-110 ${
                  activeSection === item.id 
                    ? 'text-accent' 
                    : 'text-foreground hover:text-accent'
                }`}
                data-testid={`nav-link-${item.id}`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-secondary rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:hidden"
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
          className={`md:hidden overflow-hidden ${isMenuOpen ? 'mt-4 pt-4 border-t border-border' : ''}`}
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