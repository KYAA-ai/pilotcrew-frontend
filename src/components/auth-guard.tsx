import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  children: JSX.Element;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/employee" replace />;
  }

  return children;
} 