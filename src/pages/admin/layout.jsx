import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  GraduationCap,
  User,
  FolderKanban,
  Wrench,
  Briefcase,
  PanelTop,
  PanelBottom,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { clearToken } from "@/lib/auth";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/personal", label: "Personal Details", icon: User },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/header", label: "Header", icon: PanelTop },
  { href: "/admin/footer", label: "Footer", icon: PanelBottom },
];

export default function AdminLayout({ children }) {
  const [location, navigate] = useLocation();
  const [open, setOpen] = useState(false);

  const logout = () => {
    clearToken();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-72 bg-card/95 backdrop-blur-xl border-r border-border transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-accent to-secondary flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg gradient-text">Portfolio Admin</h2>
              <p className="text-xs text-muted-foreground">Manage your content</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location === item.href || (item.href === "/admin/dashboard" && location === "/admin");
            return (
              <Link key={item.href} href={item.href}>
                <a
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? "bg-gradient-to-r from-accent to-secondary text-white shadow-lg shadow-accent/30"
                      : "text-muted-foreground hover:bg-accent/10 hover:text-accent"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card/95 backdrop-blur-xl">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-2"
          >
            <ExternalLink className="w-4 h-4" /> View Site
          </a>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent/10"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="text-sm text-muted-foreground hidden md:block">
              Signed in as <span className="text-accent font-medium">admin</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
