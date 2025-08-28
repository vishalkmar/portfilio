import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface SkillCategory {
  title: string;
  skills: Array<{
    name: string;
    icon: string;
  }>;
}

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: "⚛️" },
      { name: "Vue.js", icon: "🟢" },
      { name: "TypeScript", icon: "🔷" }
    ]
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: "🟢" },
      { name: "Python", icon: "🐍" },
      { name: "PostgreSQL", icon: "🐘" }
    ]
  },
  {
    title: "Cloud",
    skills: [
      { name: "AWS", icon: "☁️" },
      { name: "Docker", icon: "🐳" },
      { name: "Kubernetes", icon: "⚙️" }
    ]
  },
  {
    title: "Tools",
    skills: [
      { name: "Git", icon: "🌿" },
      { name: "CI/CD", icon: "🔄" },
      { name: "Analytics", icon: "📊" }
    ]
  }
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-background to-card/50">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit of modern technologies and frameworks for building exceptional digital experiences.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-lg font-semibold mb-4 text-accent" data-testid={`skill-category-${category.title}`}>
                {category.title}
              </h3>
              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: categoryIndex * 0.1 + skillIndex * 0.1 
                    }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group"
                  >
                    <Card className="skill-item p-3 bg-card border border-border hover:border-accent transition-colors duration-300 cursor-pointer">
                      <CardContent className="p-0 text-center">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="text-2xl mb-2"
                          data-testid={`skill-icon-${skill.name}`}
                        >
                          {skill.icon}
                        </motion.div>
                        <p className="text-sm font-medium" data-testid={`skill-name-${skill.name}`}>
                          {skill.name}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
