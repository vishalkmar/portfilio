import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "Projects", href: "#projects" },
  { name: "Services", href: "#services" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" }
];

const services = [
  { name: "Frontend Development", href: "#services" },
  { name: "Backend Development", href: "#services" },
  { name: "Mobile Apps", href: "#services" },
  { name: "Cloud & DevOps", href: "#services" },
  { name: "UI/UX Design", href: "#services" },
  { name: "Consulting", href: "#services" }
];

const socialLinks = [
  { 
    icon: <Github className="text-xl" />, 
    href: "#", 
    name: "GitHub",
    color: "hover:text-gray-400"
  },
  { 
    icon: <Linkedin className="text-xl" />, 
    href: "#", 
    name: "LinkedIn",
    color: "hover:text-blue-500"
  },
  { 
    icon: <Twitter className="text-xl" />, 
    href: "#", 
    name: "Twitter",
    color: "hover:text-sky-500"
  }
];

const contactInfo = [
  { icon: <Mail className="w-4 h-4" />, text: "alex.chen@example.com" },
  { icon: <Phone className="w-4 h-4" />, text: "+1 (555) 123-4567" },
  { icon: <MapPin className="w-4 h-4" />, text: "San Francisco, CA" }
];

export default function Footer() {
  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 bg-gradient-to-t from-card/50 to-background border-t border-border relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-accent/5 to-secondary/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <motion.div 
              className="text-3xl font-extrabold mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <span className="gradient-text">Alex Chen</span>
            </motion.div>
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed max-w-md">
              Full Stack Developer passionate about creating exceptional digital experiences 
              with cutting-edge technologies and modern development practices.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              {contactInfo.map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="text-accent"
                  >
                    {contact.icon}
                  </motion.div>
                  <span className="text-sm">{contact.text}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.2, y: -5 }}
                  className={`w-12 h-12 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-xl flex items-center justify-center text-muted-foreground ${social.color} transition-all duration-300 border border-border hover:border-accent relative group`}
                  data-testid={`footer-social-${social.name}`}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <span className="relative z-10">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold text-xl mb-6 gradient-text">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.button
                    onClick={() => scrollToSection(link.href)}
                    className="text-muted-foreground hover:text-accent transition-all duration-300 text-left group flex items-center gap-2"
                    data-testid={`footer-link-${link.name}`}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div
                      className="w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300"
                    />
                    {link.name}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold text-xl mb-6 gradient-text">Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <motion.li 
                  key={service.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.button
                    onClick={() => scrollToSection(service.href)}
                    className="text-muted-foreground hover:text-accent transition-all duration-300 text-left group flex items-center gap-2 text-sm"
                    data-testid={`footer-service-${service.name}`}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div
                      className="w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300"
                    />
                    {service.name}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-border pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p 
              className="text-muted-foreground text-center md:text-left"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              &copy; {currentYear} Alex Chen. All rights reserved. Built with React and modern web technologies.
            </motion.p>
            
            {/* Additional Links */}
            <div className="flex gap-6 text-sm text-muted-foreground">
              <motion.button
                whileHover={{ scale: 1.05, color: "var(--accent)" }}
                className="hover:text-accent transition-colors"
              >
                Privacy Policy
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, color: "var(--accent)" }}
                className="hover:text-accent transition-colors"
              >
                Terms of Service
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, color: "var(--accent)" }}
                className="hover:text-accent transition-colors"
              >
                Sitemap
              </motion.button>
            </div>
          </div>
          
          {/* Back to Top */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <motion.button
              onClick={() => scrollToSection('#home')}
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors group"
              whileHover={{ y: -5 }}
              data-testid="back-to-top"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-lg"
              >
                ↑
              </motion.div>
              <span className="font-medium">Back to Top</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}