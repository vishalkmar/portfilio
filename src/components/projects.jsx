import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Github, Code, Database, Globe, Smartphone, FolderKanban } from "lucide-react";
import { publicApi } from "@/lib/publicApi";

const CATEGORY_META = {
  all: { label: "All Projects", icon: <Globe className="w-5 h-5" /> },
  frontend: { label: "Frontend", icon: <Code className="w-5 h-5" /> },
  fullstack: { label: "Full Stack", icon: <Database className="w-5 h-5" /> },
  backend: { label: "Backend", icon: <Database className="w-5 h-5" /> },
  mobile: { label: "Mobile", icon: <Smartphone className="w-5 h-5" /> },
  other: { label: "Other", icon: <Globe className="w-5 h-5" /> },
};

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredProject, setHoveredProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .projects()
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(["all"]);
    projects.forEach((p) => p.category && cats.add(p.category));
    return Array.from(cats).map((id) => ({
      id,
      label: CATEGORY_META[id]?.label || id.charAt(0).toUpperCase() + id.slice(1),
      icon: CATEGORY_META[id]?.icon || <Globe className="w-5 h-5" />,
    }));
  }, [projects]);

  const filteredProjects =
    activeCategory === "all" ? projects : projects.filter((p) => p.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-background via-card/30 to-background relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
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

        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setActiveCategory(category.id)}
                className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-3 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-accent to-secondary text-white shadow-2xl shadow-accent/50 scale-105"
                    : "bg-card/50 text-muted-foreground hover:text-accent hover:bg-card border border-border hover:border-accent hover:scale-105"
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
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
        )}

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <FolderKanban className="w-12 h-12 mx-auto mb-3" />
            No projects to show yet.
          </div>
        ) : (
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
                  key={project._id}
                  variants={itemVariants}
                  onHoverStart={() => setHoveredProject(project._id)}
                  onHoverEnd={() => setHoveredProject(null)}
                  className="group relative"
                >
                  <Card className="bg-card/80 backdrop-blur-sm border-border hover:border-accent transition-all duration-500 overflow-hidden h-full relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      animate={{ opacity: hoveredProject === project._id ? [0, 0.3, 0] : 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    <div className="relative overflow-hidden">
                      {project.image ? (
                        <motion.img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-48 object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center">
                          <FolderKanban className="w-12 h-12 text-accent" />
                        </div>
                      )}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent"
                        initial={{ opacity: 0.7 }}
                        whileHover={{ opacity: 0.9 }}
                      />

                      <motion.div
                        className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ y: -20 }}
                        whileHover={{ y: 0 }}
                      >
                        {project.liveUrl && (
                          <motion.a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-accent/90 text-white rounded-full backdrop-blur-sm hover:bg-accent transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </motion.a>
                        )}
                        {project.githubUrl && (
                          <motion.a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-secondary/90 text-white rounded-full backdrop-blur-sm hover:bg-secondary transition-colors"
                          >
                            <Github className="w-4 h-4" />
                          </motion.a>
                        )}
                      </motion.div>
                    </div>

                    <CardContent className="p-6 relative z-10">
                      <motion.h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                        {project.title}
                      </motion.h3>
                      <motion.p className="text-muted-foreground mb-4 line-clamp-3">
                        {project.description}
                      </motion.p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {(project.technologies || []).map((tech, techIndex) => (
                          <motion.span
                            key={tech}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            className="px-3 py-1 bg-gradient-to-r from-accent/20 to-secondary/20 text-accent text-sm rounded-full border border-accent/30 hover:border-accent transition-colors"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        {project.liveUrl && (
                          <motion.a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Live Demo
                          </motion.a>
                        )}
                        {project.githubUrl && (
                          <motion.a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
                          >
                            <Github className="h-4 w-4" />
                            View Code
                          </motion.a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
