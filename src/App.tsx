import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { getDashboardPath } from "@/config/navigation";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/adminDashboard";
import DealerLayout from "@/layouts/DealerLayout";
import DealerDashboard from "@/pages/dealer/DashboardDealer";
import DesignerDashboard from "@/pages/designer/designerDashboard";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      {/* Role-based Dashboards */}
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

      {/* Dealer Routes */}
      <Route path="/dealer" element={<ProtectedRoute><DealerLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DealerDashboard />} />
      </Route>
      <Route path="/designer" element={<ProtectedRoute><DesignerDashboard /></ProtectedRoute>} />
      <Route path="/finance" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/printer" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/stock" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

      {/* Fallback for generic /dashboard */}
      <Route
        path="/dashboard"
        element={
          user ? <Navigate to={getDashboardPath(user.role)} replace /> : <Navigate to="/login" replace />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
