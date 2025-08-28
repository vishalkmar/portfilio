import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution built with React, Node.js, and PostgreSQL. Features include real-time inventory, payment processing, and admin dashboard.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    technologies: ["React", "Node.js", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Social Media App",
    description: "Real-time social platform with chat, posts, and notifications. Built with React Native for mobile and Next.js for web, using Firebase backend.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    technologies: ["React Native", "Next.js", "Firebase"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Analytics Dashboard",
    description: "Comprehensive business intelligence dashboard with real-time data visualization, custom reports, and machine learning insights.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    technologies: ["Vue.js", "Python", "MongoDB"],
    liveUrl: "#",
    githubUrl: "#"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-background to-card/50">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work, demonstrating expertise in modern web technologies and user experience design.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="project-card hover:shadow-2xl hover:shadow-accent/20 transition-all duration-400"
            >
              <Card className="bg-card border-border hover:border-accent transition-colors duration-300 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2" data-testid={`project-title-${index}`}>
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4" data-testid={`project-description-${index}`}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 bg-secondary/20 text-secondary text-sm rounded-full"
                        data-testid={`project-tech-${tech}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {project.liveUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-accent hover:text-accent/80 transition-colors p-0"
                        data-testid={`project-live-${index}`}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Live Demo
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-accent hover:text-accent/80 transition-colors p-0"
                        data-testid={`project-github-${index}`}
                      >
                        <Github className="h-4 w-4 mr-1" />
                        Code
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            variant="outline"
            className="magnetic-button border border-accent text-accent px-8 py-3 font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            data-testid="button-view-all-projects"
          >
            View All Projects
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
