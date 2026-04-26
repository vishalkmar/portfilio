import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { publicApi } from "@/lib/publicApi";

export default function Education() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .education()
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatGrade = (it) => {
    if (!it.gradeValue && it.gradeType !== "Pursuing") return "";
    if (it.gradeType === "Pursuing") return "Pursuing";
    if (it.gradeType === "Percentage") return `${it.gradeValue}%`;
    if (it.gradeType === "Marks") return `${it.gradeValue} Marks`;
    return `${it.gradeValue} ${it.gradeType}`;
  };

  return (
    <section
      id="education"
      className="py-24 pb-24 px-[12vw] md:px-[7vw] lg:px-[16vw] font-sans bg-skills-gradient clip-path-custom-3"
    >
      <div className="text-center mb-16">
        <motion.h2
          className="text-5xl md:text-7xl font-extrabold mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          Education <span className="gradient-text animate-glow">Qualification</span>
        </motion.h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-semibold">
          My education has been a journey of learning and development. Here are the details of my academic background
        </p>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-500" />
          No education entries yet.
        </div>
      ) : (
        <div className="relative">
          <div className="absolute sm:left-1/2 left-0 transform -translate-x-1/2 sm:-translate-x-0 w-1 bg-white h-full"></div>

          {items.map((edu, index) => (
            <div
              key={edu._id}
              className={`flex flex-col sm:flex-row items-center mb-16 ${
                index % 2 === 0 ? "sm:justify-start" : "sm:justify-end"
              }`}
            >
              <div className="absolute sm:left-1/2 left-0 transform -translate-x-1/2 bg-gray-400 border-4 border-[#8245ec] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex justify-center items-center z-10 overflow-hidden">
                {edu.image ? (
                  <img
                    src={edu.image}
                    alt={edu.institution}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                )}
              </div>

              <div
                className={`w-full sm:max-w-md p-4 sm:p-8 rounded-2xl shadow-2xl border border-white bg-gray-900 backdrop-blur-md shadow-[0_0_20px_1px_rgba(130,69,236,0.3)] ${
                  index % 2 === 0 ? "sm:ml-0" : "sm:mr-0"
                } sm:ml-44 sm:mr-44 ml-8 transform transition-transform duration-300 hover:scale-105`}
              >
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-16 bg-white rounded-md overflow-hidden flex items-center justify-center">
                    {edu.image ? (
                      <img src={edu.image} alt={edu.institution} className="w-full h-full object-cover" />
                    ) : (
                      <GraduationCap className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl sm:text-xl font-semibold text-white">
                        {edu.degree}
                      </h3>
                      <h4 className="text-md sm:text-sm text-gray-300">
                        {edu.institution}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {edu.startDate}
                      {edu.endDate ? ` - ${edu.endDate}` : ""}
                    </p>
                  </div>
                </div>

                {formatGrade(edu) && (
                  <p className="mt-4 text-gray-400 font-bold">Grade: {formatGrade(edu)}</p>
                )}
                {edu.description && <p className="mt-4 text-gray-400">{edu.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
