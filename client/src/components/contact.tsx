import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter 
} from "lucide-react";

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const contactInfo: ContactInfo[] = [
  {
    icon: <Mail className="text-accent text-xl" />,
    title: "alex.chen@example.com",
    subtitle: "Email me directly"
  },
  {
    icon: <Phone className="text-accent text-xl" />,
    title: "+1 (555) 123-4567",
    subtitle: "Call for urgent matters"
  },
  {
    icon: <MapPin className="text-accent text-xl" />,
    title: "San Francisco, CA",
    subtitle: "Available for remote work"
  }
];

const socialLinks = [
  { icon: <Github className="text-xl" />, href: "#", name: "GitHub" },
  { icon: <Linkedin className="text-xl" />, href: "#", name: "LinkedIn" },
  { icon: <Twitter className="text-xl" />, href: "#", name: "Twitter" }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Message sent successfully!",
      description: "Thank you for your message. I'll get back to you soon."
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <section id="contact" className="py-20 bg-card/30">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to bring your ideas to life? Let's discuss your project and create something amazing together.
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    {info.icon}
                  </div>
                  <div>
                    <p className="font-medium" data-testid={`contact-info-title-${index}`}>
                      {info.title}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid={`contact-info-subtitle-${index}`}>
                      {info.subtitle}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Social Links */}
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-4">Follow Me</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                    data-testid={`social-link-${social.name}`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="glass-effect border-border">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="bg-input border-border focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                      data-testid="input-name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="bg-input border-border focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                      data-testid="input-email"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Project inquiry"
                      className="bg-input border-border focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                      data-testid="input-subject"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell me about your project..."
                      className="bg-input border-border focus:ring-2 focus:ring-accent focus:border-accent transition-colors resize-none"
                      data-testid="textarea-message"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="magnetic-button w-full bg-accent text-accent-foreground py-3 font-semibold hover:bg-accent/90 transition-all duration-300"
                    data-testid="button-send-message"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
