import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  GraduationCap,
  FolderKanban,
  Wrench,
  Briefcase,
  User,
  PanelTop,
  PanelBottom,
} from "lucide-react";
import {
  educationApi,
  projectsApi,
  skillsApi,
  servicesApi,
} from "@/lib/adminApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ edu: 0, proj: 0, skills: 0, services: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [e, p, s, sv] = await Promise.all([
          educationApi.list(),
          projectsApi.list(),
          skillsApi.list(),
          servicesApi.list(),
        ]);
        setStats({
          edu: e.length,
          proj: p.length,
          skills: s.reduce((a, c) => a + (c.skills?.length || 0), 0),
          services: sv.length,
        });
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const cards = [
    { label: "Education", count: stats.edu, icon: GraduationCap, href: "/admin/education", color: "from-blue-500 to-cyan-500" },
    { label: "Projects", count: stats.proj, icon: FolderKanban, href: "/admin/projects", color: "from-purple-500 to-violet-500" },
    { label: "Skills", count: stats.skills, icon: Wrench, href: "/admin/skills", color: "from-green-500 to-emerald-500" },
    { label: "Services", count: stats.services, icon: Briefcase, href: "/admin/services", color: "from-orange-500 to-red-500" },
  ];

  const quick = [
    { label: "Personal Details", icon: User, href: "/admin/personal" },
    { label: "Header", icon: PanelTop, href: "/admin/header" },
    { label: "Footer", icon: PanelBottom, href: "/admin/footer" },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          Welcome <span className="gradient-text">back</span>
        </h1>
        <p className="text-muted-foreground mb-8">Manage every piece of content on your portfolio.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={c.href}>
                <a className="block p-6 rounded-2xl bg-card/60 border border-border hover:border-accent transition-all group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${c.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-extrabold">{c.count}</div>
                  <div className="text-sm text-muted-foreground group-hover:text-accent transition-colors">{c.label}</div>
                </a>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quick.map((q) => {
          const Icon = q.icon;
          return (
            <Link key={q.label} href={q.href}>
              <a className="flex items-center gap-3 p-5 rounded-xl bg-card/40 border border-border hover:border-accent hover:bg-accent/5 transition-all">
                <Icon className="w-5 h-5 text-accent" />
                <span className="font-medium">{q.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
