
import React from "react";

import { motion } from "framer-motion";
import bca from '../images/ignou.jpg'
import ba from '../images/ba.png';
import tenth from '../images/10.jpeg';
import twelth from '../images/12th.png';
import mca from '../images/amity.jpeg';

const Education = () => {

    
   const education = [
    {
  id: 0,
  img: tenth,
  school: "GOVT BOYS SEC SCH WELCOME COLONY DELHI",
  date: "July 2016 - July 2017",
  grade: "5.8 CGPA",
  desc: "I completed my 10th standard under CBSE from Govt. Boys Sec. School, Welcome Colony, Delhi. During this period, I studied core subjects such as Hindi, English, Mathematics, Science, Social Science, and Sanskrit. This phase of education helped me build a strong academic foundation, develop analytical and problem-solving skills, and improve my language proficiency. It also played an important role in shaping my interest towards higher studies and overall personality development.",
  degree: "CBSE (X)"
}
,
   {
  id: 1,
  img: twelth,
  school: "GOVT SARVO BAL VIDYALAYA NO-1 NEW SEELAMPUR DELHI",
  date: "July 2018 - July 2019",
  grade: "73% Precent",
  desc: "I completed my 12th standard under CBSE from Govt. Sarvo Bal Vidyalaya No-1, New Seelampur, Delhi. My subjects included Physics, Chemistry, Mathematics, English, and Computer Science. This stage of education helped me strengthen my analytical and logical reasoning skills, deepen my understanding of core scientific concepts, and prepare myself for higher studies in the field of Computer Applications and Technology. It also gave me opportunities to participate in academic activities that enhanced my confidence and overall development.",
  degree: "CBSE (XII)"
},
{
  id: 2,
  img: ba,
  school: "(SOL DU) School Of Open Learning, Delhi University",
  date: "July 2019 - Dec 2023",
  grade: "68.18% (First Division)",
  desc: "I pursued my Bachelor's degree in Arts (BA) from the School of Open Learning, Delhi University. During this course, I studied a combination of subjects such as English, Hindi, Political Science, History, and Economics. The program helped me develop critical thinking, analytical ability, communication skills, and a broad understanding of social sciences and humanities. It also gave me exposure to research-oriented assignments and discussions, which improved my perspective and overall intellectual growth.",
  degree: "BA (Bachelor of Arts)"
}
,

   {
  id: 3,
  img: bca,
  school: "(IGNOU) Indira Gandhi National Open University",
  date: "July 2021 - Dec 2024",
  grade: "63.18% (First Division)",
  desc: "I pursued my Bachelor's degree in Computer Applications (BCA) from Indira Gandhi National Open University (IGNOU). During this course, I studied a wide range of core subjects including C, C++, Java, Computer Networks, Database Management Systems, Software Engineering, and Operating Systems. This program helped me build a solid foundation in programming, problem-solving, and system design. Along with academics, I gained practical exposure through assignments and projects, which enhanced my technical knowledge and prepared me for future professional challenges.",
  degree: "BCA (Bachelor of Computer Applications)"
}
,
    {
  id: 4,
  img: mca,
  school: "Amity University, Noida, Uttar Pradesh",
  date: "July 2025 - July 2027",
  grade: "Pursuing",
  desc: "I am currently pursuing my Master's degree (MCA) with a specialization in Artificial Intelligence and Machine Learning from Amity University, Noida. My coursework includes advanced subjects such as Data Science, Machine Learning, Deep Learning, Artificial Intelligence, Neural Networks, Natural Language Processing, and Cloud Computing. This program is helping me strengthen my programming and research skills while working on real-world projects and case studies in AI/ML. Through this specialization, I aim to build expertise in developing intelligent systems, data-driven applications, and innovative AI solutions for future technologies.",
  degree: "MCA (Master of Computer Applications) - Specialization in AI & ML"
}

  ];

  return (
    <section
      id="education"
      className="py-24 pb-24 px-[12vw] md:px-[7vw] lg:px-[16vw] font-sans bg-skills-gradient clip-path-custom-3"
    >
      {/* Section Title */}
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

      {/* Education Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute sm:left-1/2 left-0 transform -translate-x-1/2 sm:-translate-x-0 w-1 bg-white h-full"></div>

        {/* Education Entries */}
        {education.map((edu, index) => (
          <div
            key={edu.id}
            className={`flex flex-col sm:flex-row items-center mb-16 ${
              index % 2 === 0 ? "sm:justify-start" : "sm:justify-end"
            }`}
          >
            {/* Timeline Circle */}
            <div className="absolute sm:left-1/2 left-0 transform -translate-x-1/2 bg-gray-400 border-4 border-[#8245ec] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex justify-center items-center z-10">
              <img
                src={edu.img}
                alt={edu.school}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Content Section */}
            <div
              className={`w-full sm:max-w-md p-4 sm:p-8 rounded-2xl shadow-2xl border border-white bg-gray-900 backdrop-blur-md shadow-[0_0_20px_1px_rgba(130,69,236,0.3)] ${
                index % 2 === 0 ? "sm:ml-0" : "sm:mr-0"
              } sm:ml-44 sm:mr-44 ml-8 transform transition-transform duration-300 hover:scale-105`}
            >
              {/* Flex container for image and text */}
              <div className="flex items-center space-x-6">
                {/* School Logo/Image */}
                <div className="w-24 h-16 bg-white rounded-md overflow-hidden">
                  <img
                    src={edu.img}
                    alt={edu.school}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Degree, School Name, and Date */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-xl font-semibold text-white">
                      {edu.degree}
                    </h3>
                    <h4 className="text-md sm:text-sm text-gray-300">
                      {edu.school}
                    </h4>
                  </div>
                  {/* Date at the bottom */}
                  <p className="text-sm text-gray-500 mt-2">{edu.date}</p>
                </div>
              </div>

              <p className="mt-4 text-gray-400 font-bold">Grade: {edu.grade}</p>
              <p className="mt-4 text-gray-400">{edu.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;

  