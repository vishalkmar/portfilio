import { useState } from "react";
import { Redirect, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Lock, User, LogIn } from "lucide-react";
import { authApi } from "@/lib/adminApi";
import { setToken, isAuthed } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (isAuthed()) return <Redirect to="/admin/dashboard" />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token } = await authApi.login(form.username, form.password);
      setToken(token);
      toast({ title: "Welcome back!", description: "Signed in successfully." });
      navigate("/admin/dashboard");
    } catch (err) {
      toast({
        title: "Login failed",
        description: err?.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ rotate: [360, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-effect border border-border rounded-2xl p-8 shadow-2xl shadow-accent/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-accent to-secondary flex items-center justify-center shadow-lg shadow-accent/50">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold gradient-text">Admin Login</h1>
            <p className="text-muted-foreground mt-2">Sign in to manage your portfolio</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Username</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--input)] border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--input)] border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-accent to-secondary text-white font-semibold shadow-lg shadow-accent/40 hover:shadow-accent/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" /> Sign In
                </>
              )}
            </motion.button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-6">
            Credentials are hardcoded in backend .env (ADMIN_USERNAME / ADMIN_PASSWORD)
          </p>
        </div>
      </motion.div>
    </div>
  );
}
