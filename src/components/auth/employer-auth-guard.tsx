import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import employerApiClient from "@/lib/api";
import { useProfile } from "@/contexts/ProfileContext";

interface EmployerAuthGuardProps {
  children: React.ReactElement;
}

export function EmployerAuthGuard({ children }: EmployerAuthGuardProps) {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setProfile } = useProfile();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await employerApiClient.get('/employer/profile');
        
        if (response.status === 200) {
          setIsAuthenticated(true);
          // Set profile information in context
          setProfile(response.data.employer);
        } else {
          setIsAuthenticated(false);
          setProfile(null);
          toast.error("Session expired. Please login again.");
        }
      } catch (error: unknown) {
        const apiError = error as { response?: { status?: number; data?: { error?: string; message?: string } } };
        
        if (apiError.response?.status === 403) {
          toast.error("Access forbidden. Please login again.");
          setIsAuthenticated(false);
          setProfile(null);
        } else if (apiError.response?.status === 401) {
          const errorType = apiError.response?.data?.error;
          const errorMessage = apiError.response?.data?.message;
          
          if (errorType === 'TOKEN_EXPIRED') {
            toast.error("Session expired. Please login again.");
          } else if (errorType === 'INVALID_TOKEN') {
            toast.error("Invalid session. Please login again.");
          } else {
            toast.error(errorMessage || "Session expired. Please login again.");
          }
          setIsAuthenticated(false);
          setProfile(null);
        } else {
          console.error("Auth validation error:", error);
          toast.error("Authentication error. Please try again.");
          setIsAuthenticated(false);
          setProfile(null);
        }
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [setProfile]);

  if (isValidating) {
    // Show loading state while validating token
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Validating session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
} 