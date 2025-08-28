import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Code, Database, Globe, Smartphone } from "lucide-react";

const projectCategories = [
  { id: 'all', label: 'All Projects', icon: <Globe className="w-5 h-5" /> },
  { id: 'frontend', label: 'Frontend', icon: <Code className="w-5 h-5" /> },
  { id: 'fullstack', label: 'Full Stack', icon: <Database className="w-5 h-5" /> },
  { id: 'mobile', label: 'Mobile', icon: <Smartphone className="w-5 h-5" /> }
];

const projects = [
  {
    id: 1,
    title: "React E-Commerce Platform",
    description: "Modern e-commerce solution with React, Redux, and responsive design. Features shopping cart, user authentication, and payment integration.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    technologies: ["React", "Redux", "Tailwind CSS", "Stripe"],
    category: "frontend",
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 2,
    title: "Full Stack Social Media App",
    description: "Complete social platform with real-time chat, posts, notifications. Built with MERN stack and WebSocket for real-time features.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
    category: "fullstack",
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 3,
    title: "React Native Fitness App",
    description: "Cross-platform mobile app for fitness tracking with workout plans, progress monitoring, and social features.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    technologies: ["React Native", "Firebase", "Redux"],
    category: "mobile",
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 4,
    title: "Vue.js Dashboard",
    description: "Advanced analytics dashboard with beautiful charts, real-time data updates, and responsive design using Vue.js ecosystem.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    technologies: ["Vue.js", "Vuex", "Chart.js", "SCSS"],
    category: "frontend",
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 5,
    title: "Full Stack Food Delivery",
    description: "Complete food delivery platform with restaurant management, order tracking, payment processing, and delivery coordination.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    technologies: ["React", "Express", "PostgreSQL", "Stripe"],
    category: "fullstack",
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 6,
    title: "Flutter Travel App",
    description: "Beautiful travel planning app with destination discovery, booking integration, and offline capabilities built with Flutter.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    technologies: ["Flutter", "Dart", "Firebase", "Maps API"],
    category: "mobile",
    liveUrl: "#",
    githubUrl: "#"
  }
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredProject, setHoveredProject] = useState(null);

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-background via-card/30 to-background relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-full blur-3xl"
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
            Featured <span className="gradient-text animate-glow">Projects</span>
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            A showcase of my recent work, demonstrating expertise in modern web technologies, 
            mobile development, and full-stack solutions.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {projectCategories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setActiveCategory(category.id)}
              className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-3 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-accent to-secondary text-white shadow-2xl shadow-accent/50 scale-105'
                  : 'bg-card/50 text-muted-foreground hover:text-accent hover:bg-card border border-border hover:border-accent hover:scale-105'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              data-testid={`category-${category.id}`}
            >
              <motion.div
                animate={{ rotate: activeCategory === category.id ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {category.icon}
              </motion.div>
              {category.label}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                onHoverStart={() => setHoveredProject(project.id)}
                onHoverEnd={() => setHoveredProject(null)}
                className="group relative"
              >
                <Card className="bg-card/80 backdrop-blur-sm border-border hover:border-accent transition-all duration-500 overflow-hidden h-full relative">
                  {/* Glow Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    animate={{
                      opacity: hoveredProject === project.id ? [0, 0.3, 0] : 0
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  <div className="relative overflow-hidden">
                    <motion.img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent"
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 0.9 }}
                    />
                    
                    {/* Floating Action Buttons */}
                    <motion.div
                      className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ y: -20 }}
                      whileHover={{ y: 0 }}
                    >
                      <motion.a
                        href={project.liveUrl}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-accent/90 text-white rounded-full backdrop-blur-sm hover:bg-accent transition-colors"
                        data-testid={`project-live-${index}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </motion.a>
                      <motion.a
                        href={project.githubUrl}
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-secondary/90 text-white rounded-full backdrop-blur-sm hover:bg-secondary transition-colors"
                        data-testid={`project-github-${index}`}
                      >
                        <Github className="w-4 h-4" />
                      </motion.a>
                    </motion.div>
                  </div>
                  
                  <CardContent className="p-6 relative z-10">
                    <motion.h3 
                      className="text-xl font-bold mb-3 group-hover:text-accent transition-colors"
                      data-testid={`project-title-${index}`}
                    >
                      {project.title}
                    </motion.h3>
                    <motion.p 
                      className="text-muted-foreground mb-4 line-clamp-3"
                      data-testid={`project-description-${index}`}
                    >
                      {project.description}
                    </motion.p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIndex) => (
                        <motion.span 
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: techIndex * 0.1 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="px-3 py-1 bg-gradient-to-r from-accent/20 to-secondary/20 text-accent text-sm rounded-full border border-accent/30 hover:border-accent transition-colors"
                          data-testid={`project-tech-${tech}`}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      <motion.a
                        href={project.liveUrl}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
                        data-testid={`project-live-link-${index}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live Demo
                      </motion.a>
                      <motion.a
                        href={project.githubUrl}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
                        data-testid={`project-code-link-${index}`}
                      >
                        <Github className="h-4 w-4" />
                        View Code
                      </motion.a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="magnetic-button border-2 border-accent text-accent px-12 py-6 text-xl font-bold rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-500 group relative overflow-hidden"
              data-testid="button-view-all-projects"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="relative z-10 flex items-center gap-3">
                View All Projects
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}