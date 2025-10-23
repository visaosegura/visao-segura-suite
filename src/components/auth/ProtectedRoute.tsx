import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes?: ("admin" | "cliente")[];
}

export function ProtectedRoute({ children, allowedTypes }: ProtectedRouteProps) {
  const { user, userType, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedTypes && userType && !allowedTypes.includes(userType)) {
    // Redirect to correct dashboard
    const correctPath = userType === "admin" ? "/admin/dashboard" : "/cliente/dashboard";
    return <Navigate to={correctPath} replace />;
  }

  return <>{children}</>;
}
