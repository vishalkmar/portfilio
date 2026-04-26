import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { publicApi } from "@/lib/publicApi";

export default function Skills() {
  const [skillCategories, setSkillCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .skills()
      .then((d) => setSkillCategories(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.05 } },
  };

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-background via-card/20 to-background relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: [360, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
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

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading skills...</div>
        ) : skillCategories.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Wrench className="w-12 h-12 mx-auto mb-3" />
            No skills yet.
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8"
          >
            {skillCategories.map((category) => (
              <motion.div key={category._id} variants={categoryVariants} className="group">
                <Card className="glass-effect border-border hover:border-accent transition-all duration-500 p-6 h-full relative overflow-hidden">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

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
                            "0 0 0px rgba(255,255,255,0)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {category.title?.charAt(0) || "?"}
                      </motion.span>
                    </motion.div>
                    <h3
                      className={`text-2xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}
                    >
                      {category.title}
                    </h3>
                  </motion.div>

                  <CardContent className="p-0 relative z-10">
                    <div className="grid grid-cols-2 gap-4">
                      {(category.skills || []).map((skill, skillIndex) => (
                        <motion.div
                          key={skill._id || skill.name}
                          variants={skillVariants}
                          whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                          className="group/skill relative"
                        >
                          <Card className="skill-item p-4 bg-card/50 border border-border hover:border-accent transition-all duration-300 cursor-pointer relative overflow-hidden">
                            <motion.div
                              className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover/skill:opacity-20 transition-opacity duration-300`}
                            />

                            <CardContent className="p-0 text-center relative z-10">
                              <motion.div
                                whileHover={{ rotate: 360, scale: 1.2 }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl mb-2 flex items-center justify-center h-10"
                              >
                                {skill.image ? (
                                  <img
                                    src={skill.image}
                                    alt={skill.name}
                                    className="w-10 h-10 object-contain"
                                  />
                                ) : (
                                  <span>{skill.icon || "🔧"}</span>
                                )}
                              </motion.div>
                              <p className="text-sm font-semibold mb-2 group-hover/skill:text-accent transition-colors">
                                {skill.name}
                              </p>

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
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
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
        )}
      </div>
    </section>
  );
}
