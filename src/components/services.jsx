import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  Server,
  Cloud,
  Smartphone,
  Search,
  Users,
  Palette,
  Database,
  Shield,
  Zap,
  Globe,
  Layers,
  Wrench,
  Briefcase,
} from "lucide-react";
import { publicApi } from "@/lib/publicApi";

const ICON_MAP = {
  Code,
  Server,
  Cloud,
  Smartphone,
  Search,
  Users,
  Palette,
  Database,
  Shield,
  Zap,
  Globe,
  Layers,
  Wrench,
  Briefcase,
};

const renderIcon = (name) => {
  const Icon = ICON_MAP[name] || Code;
  return <Icon className="text-3xl" />;
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .services()
      .then((d) => setServices(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-card/30 via-background to-card/30 relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-accent/5 to-secondary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: [360, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-5xl md:text-7xl font-extrabold mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            My <span className="gradient-text animate-glow">Services</span>
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Comprehensive web development services from concept to deployment,
            specializing in modern technologies and industry best practices.
          </motion.p>
        </motion.div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Briefcase className="w-12 h-12 mx-auto mb-3" />
            No services to show yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group h-full"
              >
                <Card className="glass-effect p-6 h-full border-border hover:border-accent transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 relative overflow-hidden">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  <CardContent className="p-0 relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      {renderIcon(service.icon)}
                    </motion.div>

                    <motion.h3 className="text-xl font-bold mb-4 group-hover:text-accent transition-colors duration-300">
                      {service.title}
                    </motion.h3>

                    <motion.p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                      {service.description}
                    </motion.p>

                    {service.features?.length > 0 && (
                      <div className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <motion.div
                            key={feature}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 + featureIndex * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-center group/feature"
                          >
                            <motion.div
                              className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full mr-3 group-hover/feature:scale-125 transition-transform duration-200`}
                              whileHover={{ scale: 1.5 }}
                            />
                            <span className="text-sm text-muted-foreground group-hover/feature:text-foreground transition-colors duration-200">
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
            <motion.button
              className="px-12 py-6 bg-gradient-to-r from-accent to-secondary text-white text-xl font-bold rounded-full shadow-2xl shadow-accent/50 hover:shadow-accent/70 transition-all duration-500 relative overflow-hidden group"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              <span className="relative z-10 flex items-center gap-3">
                Let's Work Together
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
