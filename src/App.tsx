import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Monitoring from "./pages/Monitoring";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Automation from "./pages/Automation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Component to handle root redirect
const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Root redirect */}
            <Route path="/" element={<RootRedirect />} />
            
            {/* Protected Routes - Dashboard (all roles) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            
            {/* Protected Routes - Monitoring (Teknisi & Admin) */}
            <Route
              path="/monitoring"
              element={
                <ProtectedRoute allowedRoles={["admin", "teknisi"]}>
                  <Monitoring />
                </ProtectedRoute>
              }
            />
            
            {/* Protected Routes - Analytics (Manajer, Mahasiswa & Admin) */}
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={["admin", "manajer", "mahasiswa"]}>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            
            {/* Protected Routes - Reports (Manajer & Admin) */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={["admin", "manajer"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            
            {/* Protected Routes - Users (Admin only) */}
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Users />
                </ProtectedRoute>
              }
            />
            
            {/* Protected Routes - Automation (Admin only) */}
            <Route
              path="/automation"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Automation />
                </ProtectedRoute>
              }
            />
            
            {/* Protected Routes - Settings (all roles) */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
