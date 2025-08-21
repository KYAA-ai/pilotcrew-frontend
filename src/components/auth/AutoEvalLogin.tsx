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
    </div>
  );
}
