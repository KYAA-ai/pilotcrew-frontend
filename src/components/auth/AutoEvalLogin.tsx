import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import GenericForm from "@/components/form";
import type { FormField } from "@/components/form";
import apiClient from "@/lib/api";
import { useProfile } from "@/contexts/ProfileContext";

interface AutoEvalLoginProps {
  onSuccess?: () => void;
  onValidationError?: (errors: string[]) => void;
}

const autoEvalLoginFields: FormField[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "Enter your email",
    validation: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    placeholder: "Enter your password",
    validation: {
      required: true,
      minLength: 6,
    },
  },
];

export default function AutoEvalLogin({ onSuccess, onValidationError }: AutoEvalLoginProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setProfile } = useProfile();

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/v1/autoeval/auth/google/login`;
  };

  const handleSubmit = async (data: Record<string, string | string[]>) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/v1/autoeval/login', data);
      
      // Set the profile in context after successful login
      if (response.data.user) {
        setProfile(response.data.user);
      }
      
      toast.success("Login successful! Redirecting to dashboard...");
      
      onSuccess?.();
      
      setTimeout(() => {
        navigate('/autoeval/dashboard');
      }, 1500);
      
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        errorMessage = apiError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidationError = (errors: string[]) => {
    console.log("Login validation errors:", errors);
    if (errors.length > 0) {
      toast.error(errors[0]);
    }
    onValidationError?.(errors);
  };

  return (
    <div className="flex flex-col gap-4">
      <GenericForm
        fields={autoEvalLoginFields}
        submitButtonText="Continue"
        onSubmit={handleSubmit}
        onValidationError={handleValidationError}
        isLoading={isLoading}
      />

      <div className="text-center italic"> OR </div>

      <button 
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-md shadow-sm bg-foreground text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleGoogleLogin}
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5">
          <path d="M21.35 11.1h-9.09v3.7h5.82c-.25 1.46-1.5 4.3-5.82 4.3-3.5 0-6.36-2.9-6.36-6.5s2.86-6.5 6.36-6.5c2 0 3.34.88 4.09 1.63l2.8-2.8C17.57 2.46 15.46 1.5 12.32 1.5 6.46 1.5 2 5.93 2 11.7s4.46 10.2 10.32 10.2c5.93 0 9.82-4.16 9.82-10.07 0-.84-.08-1.43-.18-2.73z"/>
        </svg>
        Continue with Google
      </button>
    </div>
  );
}
