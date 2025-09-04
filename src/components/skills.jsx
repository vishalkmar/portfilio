import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const skillCategories = [
  {
    title: "Frontend",
    color: "from-blue-500 to-cyan-500",
    skills: [
      { name: "HTML5", icon: "🌐", level: 95 },
      { name: "CSS3", icon: "🎨", level: 92 },
      { name: "JavaScript", icon: "⚡", level: 90 },
      { name: "React", icon: "⚛️", level: 95 },
      { name: "Redux", icon: "🔄", level: 85 },
      { name: "Next.js", icon: "🚀", level: 88 },
      { name: "Tailwind CSS", icon: "💨", level: 90 },
      { name: "Bootstrap", icon: "🅱️", level: 85 }
    ]
  },
  {
    title: "Backend",
    color: "from-green-500 to-emerald-500", 
    skills: [
      { name: "Node.js", icon: "🟢", level: 90 },
      { name: "Express.js", icon: "🚄", level: 88 },
      { name: "MongoDB", icon: "🍃", level: 85 },
      { name: "MySQL", icon: "🐬", level: 82 },
      { name: "PostgreSQL", icon: "🐘", level: 85 },
      { name: "REST APIs", icon: "🔗", level: 92 },
      { name: "GraphQL", icon: "📊", level: 78 },
      { name: "Postman", icon: "📮", level: 90 }
    ]
  },
  {
    title: "Tools",
    color: "from-purple-500 to-violet-500",
    skills: [
      { name: "VS Code", icon: "💻", level: 95 },
      { name: "Git", icon: "🌿", level: 90 },
      { name: "GitHub", icon: "🐙", level: 88 },
      { name: "Docker", icon: "🐳", level: 80 },
      { name: "CI/CD", icon: "🔄", level: 82 },
      { name: "Webpack", icon: "📦", level: 75 },
      { name: "Vite", icon: "⚡", level: 85 },
      { name: "npm/yarn", icon: "📦", level: 90 }
    ]
  },
  {
    title: "Languages",
    color: "from-orange-500 to-red-500",
    skills: [
      { name: "JavaScript", icon: "💛", level: 95 },
      { name: "TypeScript", icon: "🔷", level: 88 },
      { name: "Python", icon: "🐍", level: 85 },
      { name: "Java", icon: "☕", level: 75 },
      { name: "PHP", icon: "🐘", level: 70 },
      { name: "C++", icon: "⚙️", level: 72 },
      { name: "SQL", icon: "🗄️", level: 85 },
      { name: "Bash", icon: "🖥️", level: 78 }
    ]
  }
];

export default function Skills() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.05
      }
    }
  };

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-background via-card/20 to-background relative overflow-hidden">
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
          className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-3xl"
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
            Technical <span className="gradient-text animate-glow">Skills</span>
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            A comprehensive toolkit of modern technologies and frameworks for building 
            exceptional digital experiences across the full development stack.
          </motion.p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8"
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              variants={categoryVariants}
              className="group"
            >
              <Card className="glass-effect border-border hover:border-accent transition-all duration-500 p-6 h-full relative overflow-hidden">
                {/* Glow Effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                
                {/* Category Header */}
                <motion.div className="text-center mb-8 relative z-10">
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.span 
                      className="text-2xl text-white font-bold"
                      animate={{ 
                        textShadow: [
                          "0 0 0px rgba(255,255,255,0)",
                          "0 0 10px rgba(255,255,255,0.5)",
                          "0 0 0px rgba(255,255,255,0)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {category.title.charAt(0)}
                    </motion.span>
                  </motion.div>
                  <h3 
                    className={`text-2xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}
                    data-testid={`skill-category-${category.title}`}
                  >
                    {category.title}
                  </h3>
                </motion.div>

                <CardContent className="p-0 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        variants={skillVariants}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -5,
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                        }}
                        className="group/skill relative"
                      >
                        <Card className="skill-item p-4 bg-card/50 border border-border hover:border-accent transition-all duration-300 cursor-pointer relative overflow-hidden">
                          {/* Skill Glow */}
                          <motion.div
                            className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover/skill:opacity-20 transition-opacity duration-300`}
                          />
                          
                          <CardContent className="p-0 text-center relative z-10">
                            <motion.div
                              whileHover={{ rotate: 360, scale: 1.2 }}
                              transition={{ duration: 0.5 }}
                              className="text-3xl mb-2"
                              data-testid={`skill-icon-${skill.name}`}
                            >
                              {skill.icon}
                            </motion.div>
                            <p 
                              className="text-sm font-semibold mb-2 group-hover/skill:text-accent transition-colors"
                              data-testid={`skill-name-${skill.name}`}
                            >
                              {skill.name}
                            </p>
                            
                            {/* Skill Level Bar */}
                            <div className="w-full bg-border rounded-full h-2 mb-1">
                              <motion.div
                                className={`h-2 bg-gradient-to-r ${category.color} rounded-full relative overflow-hidden`}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                transition={{ duration: 1, delay: skillIndex * 0.1 }}
                                viewport={{ once: true }}
                              >
                                <motion.div
                                  className="absolute inset-0 bg-white/30"
                                  animate={{ x: ["-100%", "100%"] }}
                                  transition={{ 
                                    duration: 2, 
                                    repeat: Infinity,
                                    repeatDelay: 3
                                  }}
                                />
                              </motion.div>
                            </div>
                            <span className="text-xs text-muted-foreground font-medium">
                              {skill.level}%
                            </span>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          {/* <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-effect p-6 rounded-xl border border-border hover:border-accent transition-all duration-300"
            >
              <motion.div
                className="text-4xl font-bold text-accent mb-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                5+
              </motion.div>
              <p className="text-muted-foreground">Years Experience</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-effect p-6 rounded-xl border border-border hover:border-accent transition-all duration-300"
            >
              <motion.div
                className="text-4xl font-bold text-secondary mb-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                50+
              </motion.div>
              <p className="text-muted-foreground">Projects Completed</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-effect p-6 rounded-xl border border-border hover:border-accent transition-all duration-300"
            >
              <motion.div
                className="text-4xl font-bold gradient-text mb-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                100%
              </motion.div>
              <p className="text-muted-foreground">Client Satisfaction</p>
            </motion.div>
          </div> */}
        </motion.div>
      </div>
    </section>
  );
}