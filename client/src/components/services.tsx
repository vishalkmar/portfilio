import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Code, 
  Server, 
  Cloud, 
  Smartphone, 
  Search, 
  Users 
} from "lucide-react";

interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const services: Service[] = [
  {
    title: "Frontend Development",
    description: "Creating responsive, interactive user interfaces with React, Vue.js, and modern CSS frameworks. Focus on performance and user experience.",
    icon: <Code className="text-2xl" />,
    features: ["React & Vue.js", "Responsive Design", "Performance Optimization"]
  },
  {
    title: "Backend Development",
    description: "Building scalable server-side applications with Node.js, Python, and cloud services. RESTful APIs and database design.",
    icon: <Server className="text-2xl" />,
    features: ["Node.js & Python", "RESTful APIs", "Database Design"]
  },
  {
    title: "Cloud & DevOps",
    description: "Deployment and infrastructure management on AWS, Azure, and Google Cloud. CI/CD pipelines and monitoring.",
    icon: <Cloud className="text-2xl" />,
    features: ["AWS & Azure", "CI/CD Pipelines", "Monitoring & Scaling"]
  },
  {
    title: "Mobile Development",
    description: "Cross-platform mobile applications using React Native and Flutter. Native performance with shared codebase.",
    icon: <Smartphone className="text-2xl" />,
    features: ["React Native", "Flutter", "App Store Deployment"]
  },
  {
    title: "SEO & Performance",
    description: "Search engine optimization and web performance optimization. Core Web Vitals and accessibility improvements.",
    icon: <Search className="text-2xl" />,
    features: ["Technical SEO", "Core Web Vitals", "Accessibility (WCAG)"]
  },
  {
    title: "Consulting & Strategy",
    description: "Technical consulting and project planning. Architecture decisions, technology stack selection, and team mentoring.",
    icon: <Users className="text-2xl" />,
    features: ["Architecture Planning", "Tech Stack Selection", "Team Mentoring"]
  }
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-card/30">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="gradient-text">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive web development services from concept to deployment, specializing in modern technologies and best practices.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="glass-effect p-8 h-full border-border hover:border-accent transition-all duration-300 hover:shadow-2xl hover:shadow-accent/15">
                <CardContent className="p-0">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="w-16 h-16 bg-gradient-to-r from-accent to-secondary rounded-lg flex items-center justify-center mb-6 text-white"
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4" data-testid={`service-title-${index}`}>
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6" data-testid={`service-description-${index}`}>
                    {service.description}
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {service.features.map((feature) => (
                      <motion.li 
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center"
                        data-testid={`service-feature-${feature}`}
                      >
                        <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
