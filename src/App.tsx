import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import CadastroAdmin from "./pages/CadastroAdmin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ClienteDashboard from "./pages/cliente/ClienteDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cadastro-admin/:token" element={<CadastroAdmin />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedTypes={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Cliente Routes */}
            <Route path="/cliente/dashboard" element={
              <ProtectedRoute allowedTypes={["cliente"]}>
                <ClienteDashboard />
              </ProtectedRoute>
            } />
            
            {/* Legacy routes - redirect to appropriate dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/clientes" element={
              <ProtectedRoute allowedTypes={["admin"]}>
                <Clients />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
