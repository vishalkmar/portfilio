import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Eye, ArrowRight } from "lucide-react";
import { publicApi } from "@/lib/publicApi";
import { API_BASE } from "@/lib/api";

const FALLBACK_TEXTS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
];

export default function Hero() {
  const [currentText, setCurrentText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [data, setData] = useState({
    name: "Vishal Kumar",
    image: "",
    summary: "",
    positions: FALLBACK_TEXTS,
    resumeUrl: "",
    resumeFilename: "",
  });

  useEffect(() => {
    publicApi
      .personal()
      .then((d) => {
        setData({
          name: d.name || "Vishal Kumar",
          image: d.image || "",
          summary: d.summary || "",
          positions:
            d.positions?.length ? d.positions : d.position ? [d.position] : FALLBACK_TEXTS,
          resumeUrl: d.resumeUrl || "",
          resumeFilename: d.resumeFilename || "",
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const texts = data.positions?.length ? data.positions : FALLBACK_TEXTS;
    let typeIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer;

    const type = () => {
      const fullText = texts[typeIndex];

      setCurrentText((prev) =>
        deleting
          ? fullText.substring(0, prev.length - 1)
          : fullText.substring(0, prev.length + 1)
      );

      if (!deleting && charIndex === fullText.length) {
        deleting = true;
        timer = setTimeout(type, 2000);
        return;
      }

      if (deleting && charIndex === 0) {
        deleting = false;
        typeIndex = (typeIndex + 1) % texts.length;
      }

      charIndex = deleting ? charIndex - 1 : charIndex + 1;
      timer = setTimeout(type, deleting ? 50 : 100);
    };

    timer = setTimeout(type, 500);
    return () => clearTimeout(timer);
  }, [data.positions]);

  useEffect(() => {
    const cursorTimer = setInterval(() => setShowCursor((p) => !p), 500);
    return () => clearInterval(cursorTimer);
  }, []);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const downloadResume = () => {
    if (!data.resumeUrl) return;
    const url = data.resumeUrl.startsWith("http") ? data.resumeUrl : `${API_BASE}${data.resumeUrl}`;
    window.open(url, "_blank");
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-accent/30 to-secondary/30 rounded-full blur-3xl animate-pulse"
        />
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, -20, 0], scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-secondary/30 to-accent/30 rounded-full blur-3xl animate-pulse"
        />
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 15, 0], scale: [1, 0.9, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-full blur-2xl"
        />
      </div>

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -100, 0], x: [0, Math.random() * 100 - 50, 0], opacity: [0, 1, 0] }}
          transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, delay: Math.random() * 5 }}
          className="absolute w-2 h-2 bg-accent/50 rounded-full"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        />
      ))}

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0], x: [0, 10, 0] }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut", repeatType: "loop" }}
            className="relative mx-auto mb-8 w-48 h-48 md:w-64 md:h-64"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent/50 via-secondary/50 to-accent/50 rounded-full blur-3xl opacity-70 animate-pulse p-1" />
            <div
              className="w-full h-full bg-background rounded-lg p-2 overflow-hidden flex items-center justify-center"
              style={{
                borderRadius: "50%",
                border: "6px solid #111",
                boxShadow: "0 0 20px rgba(30,144,255,0.6)",
              }}
            >
              <div
                className="w-full h-full bg-gradient-to-br from-accent/20 to-secondary/20 rounded-lg flex items-center justify-center overflow-hidden"
                style={{ borderRadius: "50%" }}
              >
                {data.image ? (
                  <img
                    src={data.image}
                    alt={data.name}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-bold gradient-text">
                    {data.name?.[0] || "V"}
                  </div>
                )}
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-accent to-secondary rounded-full opacity-30 blur-xl"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-accent text-xl md:text-2xl mb-4 font-medium"
          >
            Hello, I'm
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-6xl md:text-8xl lg:text-9xl font-extrabold mb-6"
          >
            <motion.span
              className="gradient-text block"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              {data.name}
            </motion.span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-3xl md:text-5xl text-muted-foreground mb-8 min-h-[4rem] flex items-center justify-center"
          >
            <span className="font-semibold">
              {currentText}
              <motion.span animate={{ opacity: showCursor ? 1 : 0 }} className="text-accent ml-1">
                |
              </motion.span>
            </span>
          </motion.div>

          {data.summary && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              {data.summary}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={scrollToProjects}
                className="magnetic-button bg-gradient-to-r from-accent to-secondary text-white px-10 py-6 text-xl font-bold rounded-full shadow-2xl shadow-accent/50 hover:shadow-accent/70 transition-all duration-500 animate-glow group relative overflow-hidden"
                data-testid="button-view-work"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Eye className="w-6 h-6" />
                  View My Work
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>

            {data.resumeUrl && (
              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={downloadResume}
                  className="magnetic-button border-2 border-accent text-accent px-10 py-6 text-xl font-bold rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-500 group relative overflow-hidden backdrop-blur-sm"
                  data-testid="button-download-resume"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Download className="w-6 h-6 group-hover:animate-bounce" />
                    Download CV
                  </span>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-14 border-2 border-accent rounded-full flex justify-center cursor-pointer relative group"
            onClick={scrollToProjects}
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-4 bg-accent rounded-full mt-3"
            />
            <div className="absolute inset-0 bg-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-accent text-sm mt-2 font-medium"
          >
            Scroll Down
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
