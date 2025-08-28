import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "Projects", href: "#projects" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" }
];

const services = [
  { name: "Frontend Development", href: "#" },
  { name: "Backend Development", href: "#" },
  { name: "Mobile Apps", href: "#" },
  { name: "Consulting", href: "#" }
];

const socialLinks = [
  { icon: <Github className="text-xl" />, href: "#", name: "GitHub" },
  { icon: <Linkedin className="text-xl" />, href: "#", name: "LinkedIn" },
  { icon: <Twitter className="text-xl" />, href: "#", name: "Twitter" }
];

export default function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <div className="text-2xl font-bold mb-4">
              <span className="gradient-text">Alex Chen</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Full Stack Developer passionate about creating exceptional digital experiences with modern technologies and best practices.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="text-muted-foreground hover:text-accent transition-colors duration-300"
                  data-testid={`footer-social-${social.name}`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="hover:text-accent transition-colors duration-300 text-left"
                    data-testid={`footer-link-${link.name}`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-muted-foreground">
              {services.map((service) => (
                <li key={service.name}>
                  <button
                    className="hover:text-accent transition-colors duration-300 text-left"
                    data-testid={`footer-service-${service.name}`}
                  >
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-border pt-8 text-center text-muted-foreground"
        >
          <p>&copy; 2024 Alex Chen. All rights reserved. Built with React and modern web technologies.</p>
        </motion.div>
      </div>
    </footer>
  );
}
