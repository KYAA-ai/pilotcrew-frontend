import { useProfile } from "@/contexts/ProfileContext";
import apiClient from "@/lib/api";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

interface EmployeeAuthGuardProps {
  children: React.ReactElement;
}

export function EmployeeAuthGuard({ children }: EmployeeAuthGuardProps) {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOverriding, setIsOverriding] = useState(false);
  const { profile, setProfile, userType, isLoading: isProfileLoading, isLoggingOut } = useProfile();

  useEffect(() => {
    const validateToken = async () => {
      if (isProfileLoading) {
        return;
      }
      if (isOverriding) {
        setIsOverriding(false);
        return;
      }
      
      // Don't validate if user is logging out
      if (isLoggingOut) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }
      
      if (profile && userType === 'employer') {
        setIsOverriding(true);
        setProfile(null);
        localStorage.setItem('userType', 'employee');
        return;
      }

      if (profile && userType === 'employee') {
        setIsAuthenticated(true);
        setIsValidating(false);
        return;
      }

      if (!profile) {
        try {
          const profileResponse = await apiClient.get('/v1/employee/profile');
          setProfile(profileResponse.data.employee);
          setIsAuthenticated(true);
          setIsValidating(false);
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
          setIsValidating(false);
        }
      } else {
        setIsAuthenticated(false);
        setProfile(null);
        toast.error("Invalid user type. Please login again.");
        setIsValidating(false);
      }
    };

    validateToken();
  }, [profile, userType, setProfile, isProfileLoading, isOverriding, isLoggingOut]);

  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm">
            {isProfileLoading ? "Loading profile..." : "Validating Expert Session..."}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/employee" replace />;
  }

  return children;
} 