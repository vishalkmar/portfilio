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
  Zap
} from "lucide-react";

const services = [
  {
    title: "Frontend Development",
    description: "Creating stunning, responsive user interfaces with React, Vue.js, and modern CSS frameworks. Focus on performance, accessibility, and exceptional user experience.",
    icon: <Code className="text-3xl" />,
    features: ["React & Vue.js", "Responsive Design", "Performance Optimization", "Accessibility (WCAG)"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Backend Development", 
    description: "Building robust, scalable server-side applications with Node.js, Python, and modern frameworks. RESTful APIs, GraphQL, and microservices architecture.",
    icon: <Server className="text-3xl" />,
    features: ["Node.js & Python", "RESTful APIs", "Database Design", "Microservices"],
    color: "from-green-500 to-emerald-500"
  },
  // {
  //   title: "Cloud & DevOps",
  //   description: "Complete cloud infrastructure setup and management on AWS, Azure, and Google Cloud. CI/CD pipelines, containerization, and monitoring solutions.",
  //   icon: <Cloud className="text-3xl" />,
  //   features: ["AWS & Azure", "Docker & Kubernetes", "CI/CD Pipelines", "Monitoring & Scaling"],
  //   color: "from-purple-500 to-violet-500"
  // },
  // {
  //   title: "Mobile Development",
  //   description: "Cross-platform mobile applications using React Native and Flutter. Native performance with shared codebase for iOS and Android platforms.",
  //   icon: <Smartphone className="text-3xl" />,
  //   features: ["React Native", "Flutter", "App Store Deployment", "Push Notifications"],
  //   color: "from-pink-500 to-rose-500"
  // },
  {
    title: "UI/UX Design",
    description: "Creating intuitive, beautiful user interfaces and experiences. User research, wireframing, prototyping, and design system development.",
    icon: <Palette className="text-3xl" />,
    features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Database Solutions",
    description: "Designing and optimizing database architectures for performance and scalability. SQL, NoSQL, and modern database technologies.",
    icon: <Database className="text-3xl" />,
    features: ["PostgreSQL & MongoDB", "Database Optimization", "Data Modeling", "Performance Tuning"],
    color: "from-teal-500 to-cyan-500"
  },
  {
    title: "Security & Testing",
    description: "Implementing robust security measures and comprehensive testing strategies. Code reviews, vulnerability assessments, and quality assurance.",
    icon: <Shield className="text-3xl" />,
    features: ["Security Audits", "Unit Testing", "Integration Testing", "Code Reviews"],
    color: "from-amber-500 to-yellow-500"
  },
  {
    title: "Performance Optimization",
    description: "Optimizing applications for speed, efficiency, and scalability. Core Web Vitals, code splitting, and advanced performance techniques.",
    icon: <Zap className="text-3xl" />,
    features: ["Core Web Vitals", "Code Splitting", "Caching Strategies", "Bundle Optimization"],
    color: "from-indigo-500 to-blue-500"
  },
  {
    title: "SEO & Analytics",
    description: "Search engine optimization and comprehensive analytics implementation. Technical SEO, performance monitoring, and data-driven insights.",
    icon: <Search className="text-3xl" />,
    features: ["Technical SEO", "Google Analytics", "Performance Monitoring", "Conversion Optimization"],
    color: "from-lime-500 to-green-500"
  },
  {
    title: "Consulting & Strategy",
    description: "Technical consulting and project planning. Architecture decisions, technology stack selection, code reviews, and team mentoring.",
    icon: <Users className="text-3xl" />,
    features: ["Architecture Planning", "Tech Stack Selection", "Team Mentoring", "Code Reviews"],
    color: "from-red-500 to-pink-500"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-card/30 via-background to-card/30 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-accent/5 to-secondary/5 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group h-full"
            >
              <Card className="glass-effect p-6 h-full border-border hover:border-accent transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 relative overflow-hidden">
                {/* Glow Effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                
                {/* Floating Particles */}
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    y: [0, -10, 0],
                    x: [0, 5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 bg-gradient-to-r ${service.color} rounded-full`}
                      style={{
                        top: `${i * 30}%`,
                        left: `${i * 20}%`
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </motion.div>

                <CardContent className="p-0 relative z-10">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    {service.icon}
                  </motion.div>
                  
                  <motion.h3 
                    className="text-xl font-bold mb-4 group-hover:text-accent transition-colors duration-300"
                    data-testid={`service-title-${index}`}
                  >
                    {service.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-muted-foreground mb-6 text-sm leading-relaxed"
                    data-testid={`service-description-${index}`}
                  >
                    {service.description}
                  </motion.p>
                  
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <motion.div 
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 + featureIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center group/feature"
                        data-testid={`service-feature-${feature}`}
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
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.button
              className="px-12 py-6 bg-gradient-to-r from-accent to-secondary text-white text-xl font-bold rounded-full shadow-2xl shadow-accent/50 hover:shadow-accent/70 transition-all duration-500 relative overflow-hidden group"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-get-started"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
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