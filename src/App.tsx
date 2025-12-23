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
import AdminDashboard from "./pages/admin/AdminDashboard";
import DealerDashboard from "@/pages/dealer/DashboardDealer";
import DesignerDashboard from "@/pages/designer/designerDashboard";
import PrinterDashboard from "@/pages/printer/printerDashboard";
import FinanceDashboard from "@/pages/finance/financeDashboard";
import SalesDashboard from '@/pages/sales/salesDashboard';
import StockDashboard from '@/pages/stock/stockDashboard';
import PanCardDashboard from '@/pages/pancard/pancardDashboard';
import SealDashboard from '@/pages/seal/sealDashboard';

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

      <Route path="/dealer" element={<ProtectedRoute><DealerDashboard /></ProtectedRoute>} />
      <Route path="/dealer" element={<ProtectedRoute><DealerDashboard /></ProtectedRoute>} />
      <Route path="/designer" element={<ProtectedRoute><DesignerDashboard /></ProtectedRoute>} />
      <Route path="/finance" element={<ProtectedRoute><FinanceDashboard /></ProtectedRoute>} />
      <Route path="/printer" element={<ProtectedRoute><PrinterDashboard /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><SalesDashboard /></ProtectedRoute>} />
      <Route path="/stock" element={<ProtectedRoute><StockDashboard /></ProtectedRoute>} />
      <Route path="/pancard" element={<ProtectedRoute><PanCardDashboard /></ProtectedRoute>} />
      <Route path="/seal" element={<ProtectedRoute><SealDashboard /></ProtectedRoute>} />

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
