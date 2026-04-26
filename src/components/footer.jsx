import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Globe,
} from "lucide-react";
import { publicApi } from "@/lib/publicApi";

const SOCIAL_META = {
  github: { icon: Github, color: "hover:text-gray-400" },
  linkedin: { icon: Linkedin, color: "hover:text-blue-500" },
  twitter: { icon: Twitter, color: "hover:text-sky-500" },
  instagram: { icon: Instagram, color: "hover:text-pink-500" },
  facebook: { icon: Facebook, color: "hover:text-blue-600" },
  website: { icon: Globe, color: "hover:text-accent" },
};

export default function Footer() {
  const [footer, setFooter] = useState({
    brand: "Vishal Kumar",
    tagline: "",
    copyright: "All rights reserved.",
    quickLinks: [],
    serviceLinks: [],
    bottomLinks: [],
  });
  const [personal, setPersonal] = useState({
    email: "",
    phone: "",
    address: "",
    socialLinks: {},
  });

  useEffect(() => {
    publicApi.footer().then((d) => setFooter({ ...footer, ...d })).catch(() => {});
    publicApi
      .personal()
      .then((d) =>
        setPersonal({
          email: d.email || "",
          phone: d.phone || "",
          address: d.address || "",
          socialLinks: d.socialLinks || {},
        })
      )
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSection = (href) => {
    if (!href) return;
    if (href.startsWith("#")) {
      const element = document.getElementById(href.slice(1));
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(href, "_blank");
    }
  };

  const currentYear = new Date().getFullYear();

  const contactInfo = [
    personal.email && { icon: <Mail className="w-4 h-4" />, text: personal.email },
    personal.phone && { icon: <Phone className="w-4 h-4" />, text: personal.phone },
    personal.address && { icon: <MapPin className="w-4 h-4" />, text: personal.address },
  ].filter(Boolean);

  const socialLinks = Object.entries(personal.socialLinks || {})
    .filter(([, href]) => href && href.trim())
    .map(([key, href]) => {
      const meta = SOCIAL_META[key] || { icon: Globe, color: "hover:text-accent" };
      const Icon = meta.icon;
      return { name: key, href, color: meta.color, icon: <Icon className="text-xl" /> };
    });

  return (
    <footer className="py-16 bg-gradient-to-t from-card/50 to-background border-t border-border relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-accent/5 to-secondary/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <motion.div className="text-3xl font-extrabold mb-6" whileHover={{ scale: 1.05 }}>
              <span className="gradient-text">{footer.brand}</span>
            </motion.div>
            {footer.tagline && (
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed max-w-md">
                {footer.tagline}
              </p>
            )}

            {contactInfo.length > 0 && (
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
                    <motion.div whileHover={{ scale: 1.2, rotate: 5 }} className="text-accent">
                      {contact.icon}
                    </motion.div>
                    <span className="text-sm break-all">{contact.text}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.2, y: -5 }}
                    className={`w-12 h-12 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-xl flex items-center justify-center text-muted-foreground ${social.color} transition-all duration-300 border border-border hover:border-accent`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>

          {footer.quickLinks?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-xl mb-6 gradient-text">Quick Links</h4>
              <ul className="space-y-3">
                {footer.quickLinks.map((link, index) => (
                  <motion.li
                    key={`${link.name}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.button
                      onClick={() => scrollToSection(link.href)}
                      className="text-muted-foreground hover:text-accent transition-all duration-300 text-left group flex items-center gap-2"
                      whileHover={{ x: 10 }}
                    >
                      <motion.div className="w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                      {link.name}
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {footer.serviceLinks?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-xl mb-6 gradient-text">Services</h4>
              <ul className="space-y-3">
                {footer.serviceLinks.map((service, index) => (
                  <motion.li
                    key={`${service.name}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.button
                      onClick={() => scrollToSection(service.href)}
                      className="text-muted-foreground hover:text-accent transition-all duration-300 text-left group flex items-center gap-2 text-sm"
                      whileHover={{ x: 10 }}
                    >
                      <motion.div className="w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                      {service.name}
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

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
              &copy; {currentYear} {footer.brand}. {footer.copyright}
            </motion.p>

            {footer.bottomLinks?.length > 0 && (
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                {footer.bottomLinks.map((link, index) => (
                  <motion.button
                    key={`${link.name}-${index}`}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => scrollToSection(link.href)}
                    className="hover:text-accent transition-colors"
                  >
                    {link.name}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <motion.button
              onClick={() => scrollToSection("#home")}
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors group"
              whileHover={{ y: -5 }}
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
