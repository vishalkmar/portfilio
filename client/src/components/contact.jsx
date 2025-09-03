import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import pdf from '../images/resume.pdf';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter,
  Send,
  Download,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const contactInfo = [
  {
    icon: <Mail className="text-accent text-xl" />,
    title: "vk722413@gmail.com",
    subtitle: "Email me directly",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Phone className="text-accent text-xl" />,
    title: "+91 9540792427",
    subtitle: "Call for urgent matters",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <MapPin className="text-accent text-xl" />,
    title: "Shahdara Delhi India",
    subtitle: "Available for remote work",
    color: "from-purple-500 to-violet-500"
  }
];

const socialLinks = [
  { 
    icon: <Github className="text-xl" />, 
    href: "https://github.com/vishalkmar", 
    name: "GitHub",
    color: "hover:text-gray-400"
  },
  { 
    icon: <Linkedin className="text-xl" />, 
    href: "https://www.linkedin.com/in/vishal-kumar-839490327/", 
    name: "LinkedIn",
    color: "hover:text-blue-500"
  },
  { 
    icon: <Twitter className="text-xl" />, 
    href: "https://x.com/vk722413", 
    name: "Twitter",
    color: "hover:text-sky-500"
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  const { toast } = useToast();

 const handleInputChange = (e) => {
  // const { name, value } = e.target;
  setFormData({
    ...formData,        // keep existing fields
    [e.target.name]:e.target.value   // update the field that changed
  });
};

  const downloadCV = () => {
    
    const link = document.createElement('a');
    link.href = pdf
    link.download = 'vishal-kumar-CV.pdf';
    link.click();

    toast({
      title: "CV Downloaded Successfully!",
      description: "Thank you for your interest. The CV has been downloaded to your device."
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Basic validation
    alert("please wait , Your email is on the way")
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus('error');
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    else{

         axios.post('https://portfoliobackend-b8bf.onrender.com/send', formData)
          .then((res) => {
            console.log(res.data);
            alert("email send sucessfully");

             setFormData({
                 name:"",
                 email: "",
                 subject:"",
                 message:""
             })
          })
          .catch((err) => {
             alert("error in sending email");
            console.log("Error aagaya:", err);
          });

      setIsSubmitting(false);
    }
    
    

     
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-card/30 via-background to-card/30 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 left-1/4 w-80 h-80 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-full blur-3xl"
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
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-3xl"
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
            Let's <span className="gradient-text animate-glow">Connect</span>
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to bring your ideas to life? Let's discuss your project and create 
            something amazing together. I'm always excited to work on new challenges.
          </motion.p>
        </motion.div>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold mb-8 gradient-text">Get in Touch</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="group"
                  >
                    <Card className="glass-effect p-6 border-border hover:border-accent transition-all duration-300 relative overflow-hidden">
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${info.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      />
                      <div className="flex items-center space-x-4 relative z-10">
                        <motion.div 
                          className={`w-14 h-14 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center text-white shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          {info.icon}
                        </motion.div>
                        <div>
                          <p className="font-bold text-lg group-hover:text-accent transition-colors" data-testid={`contact-info-title-${index}`}>
                            {info.title}
                          </p>
                          <p className="text-muted-foreground" data-testid={`contact-info-subtitle-${index}`}>
                            {info.subtitle}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Social Links */}
            <div>
              <h4 className="text-xl font-bold mb-6">Follow Me</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.2, y: -5 }}
                    className={`w-14 h-14 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-xl flex items-center justify-center text-muted-foreground ${social.color} transition-all duration-300 border border-border hover:border-accent`}
                    data-testid={`social-link-${social.name}`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Download CV Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={downloadCV}
                  className="w-full bg-gradient-to-r from-secondary to-accent text-white py-6 text-lg font-bold rounded-xl shadow-2xl shadow-secondary/50 hover:shadow-secondary/70 transition-all duration-500 group relative overflow-hidden"
                  data-testid="button-download-cv"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Download className="w-6 h-6 group-hover:animate-bounce" />
                    Download Full CV
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="glass-effect border-border p-8 relative overflow-hidden">
              {/* Form Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              
              <CardContent className="p-0 relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Label htmlFor="name" className="text-lg font-medium">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                       className="bg-input/50 border-border focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 py-3 text-lg backdrop-blur-sm text-black"
                        data-testid="input-name"
                        required
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <Label htmlFor="email" className="text-lg font-medium">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className="bg-input/50 border-border focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 py-3 text-lg backdrop-blur-sm text-black"
                        data-testid="input-email"
                        required
                      />
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <Label htmlFor="subject" className="text-lg font-medium">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Project inquiry, collaboration, etc."
                      className="bg-input/50 border-border focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 py-3 text-lg backdrop-blur-sm text-black"
                      data-testid="input-subject"
                      required
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <Label htmlFor="message" className="text-lg font-medium">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Tell me about your project, goals, timeline, and how I can help bring your vision to life..."
                      className="bg-input/50 border-border focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 py-3 text-lg backdrop-blur-sm text-black"

                      data-testid="textarea-message"
                      required
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="magnetic-button w-full bg-gradient-to-r from-accent to-secondary text-white py-6 text-xl font-bold rounded-xl shadow-2xl shadow-accent/50 hover:shadow-accent/70 transition-all duration-500 group relative overflow-hidden"
                        data-testid="button-send-message"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        <AnimatePresence mode="wait">
                          {isSubmitting ? (
                            <motion.span
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="relative z-10 flex items-center justify-center gap-3"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                              />
                              Sending Message...
                            </motion.span>
                          ) : formStatus === 'success' ? (
                            <motion.span
                              key="success"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative z-10 flex items-center justify-center gap-3"
                            >
                              <CheckCircle className="w-6 h-6" />
                              Message Sent!
                            </motion.span>
                          ) : formStatus === 'error' ? (
                            <motion.span
                              key="error"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative z-10 flex items-center justify-center gap-3"
                            >
                              <AlertCircle className="w-6 h-6" />
                              Please Try Again
                            </motion.span>
                          ) : (
                            <motion.span
                              key="default"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="relative z-10 flex items-center justify-center gap-3"
                            >
                              <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                              Send Message
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}