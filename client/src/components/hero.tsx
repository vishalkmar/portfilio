import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const [currentText, setCurrentText] = useState("Full Stack Developer");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const texts = [
    "Full Stack Developer",
    "React Expert",
    "Node.js Developer",
    "Cloud Architect"
  ];

  useEffect(() => {
    const typeWriter = () => {
      const current = texts[currentIndex];
      
      if (isDeleting) {
        setCurrentText(current.substring(0, currentText.length - 1));
      } else {
        setCurrentText(current.substring(0, currentText.length + 1));
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && currentText === current) {
        typeSpeed = 2000;
        setIsDeleting(true);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentIndex((currentIndex + 1) % texts.length);
      }

      setTimeout(typeWriter, typeSpeed);
    };

    const timer = setTimeout(typeWriter, 1000);
    return () => clearTimeout(timer);
  }, [currentText, currentIndex, isDeleting, texts]);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const downloadResume = () => {
    // Placeholder for resume download functionality
    console.log('Download resume clicked');
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            x: [0, -10, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full blur-3xl"
        />
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="scroll-fade"
        >
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-accent text-lg mb-4"
          >
            Hello, I'm
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="gradient-text">Alex Chen</span>
          </motion.h1>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-2xl md:text-4xl text-muted-foreground mb-6 min-h-[3rem]"
          >
            <span className="typing-cursor">{currentText}</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Crafting exceptional digital experiences with modern technologies. 
            Specializing in React, Node.js, and cloud architecture.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={scrollToProjects}
              className="magnetic-button bg-accent text-accent-foreground px-8 py-4 text-lg font-semibold hover:bg-accent/90 transition-all duration-300 animate-glow"
              data-testid="button-view-work"
            >
              View My Work
            </Button>
            <Button
              variant="outline"
              onClick={downloadResume}
              className="magnetic-button border border-accent text-accent px-8 py-4 text-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              data-testid="button-download-resume"
            >
              Download Resume
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-accent rounded-full flex justify-center cursor-pointer"
            onClick={scrollToProjects}
            data-testid="scroll-indicator"
          >
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-accent rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
