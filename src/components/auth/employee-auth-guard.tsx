import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
// import { toast } from "sonner";
// import apiClient from "@/lib/api";

interface EmployeeAuthGuardProps {
  children: React.ReactElement;
}

export function EmployeeAuthGuard({ children }: EmployeeAuthGuardProps) {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('employee-token-cookie');
      
      if (!token) {
        setIsValidating(false);
        setIsAuthenticated(false);
        return;
      }

      // TODO: Uncomment when backend profile endpoint is ready
      // try {
      //   // Verify token with backend
      //   const response = await apiClient.get('/employee/profile');
      //   
      //   if (response.status === 200) {
      //     setIsAuthenticated(true);
      //   } else {
      //     // Token is invalid
      //     localStorage.removeItem('employee-token');
      //     setIsAuthenticated(false);
      //     toast.error("Session expired. Please login again.");
      //   }
      // } catch {
      //   // Token is expired or invalid
      //   localStorage.removeItem('employee-token');
      //   setIsAuthenticated(false);
      //   toast.error("Session expired. Please login again.");
      // } finally {
      //   setIsValidating(false);
      // }

      // Temporary: Just check if token exists and add delay
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsValidating(false);
      }, 1000);
    };

    validateToken();
  }, []);

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
    return <Navigate to="/auth/employee" replace />;
  }

  return children;
} 