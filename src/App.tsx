import { Switch, Route, Redirect } from "wouter";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin/login";
import AdminLayout from "@/pages/admin/layout";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminEducation from "@/pages/admin/education";
import AdminPersonal from "@/pages/admin/personal";
import AdminProjects from "@/pages/admin/projects";
import AdminSkills from "@/pages/admin/skills";
import AdminServices from "@/pages/admin/services";
import AdminHeaderPage from "@/pages/admin/header";
import AdminFooterPage from "@/pages/admin/footer";
import { isAuthed } from "@/lib/auth";

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  if (!isAuthed()) return <Redirect to="/admin/login" />;
  return (
    <AdminLayout>
      <Component />
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        <AdminRoute component={AdminDashboard} />
      </Route>
      <Route path="/admin/dashboard">
        <AdminRoute component={AdminDashboard} />
      </Route>
      <Route path="/admin/personal">
        <AdminRoute component={AdminPersonal} />
      </Route>
      <Route path="/admin/education">
        <AdminRoute component={AdminEducation} />
      </Route>
      <Route path="/admin/projects">
        <AdminRoute component={AdminProjects} />
      </Route>
      <Route path="/admin/skills">
        <AdminRoute component={AdminSkills} />
      </Route>
      <Route path="/admin/services">
        <AdminRoute component={AdminServices} />
      </Route>
      <Route path="/admin/header">
        <AdminRoute component={AdminHeaderPage} />
      </Route>
      <Route path="/admin/footer">
        <AdminRoute component={AdminFooterPage} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
