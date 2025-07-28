import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import GenericForm from "@/components/form";
import type { FormField } from "@/components/form";
import apiClient from "@/lib/api";
import { useProfile } from "@/contexts/ProfileContext";

interface EmployerSignupProps {
  onSuccess?: () => void;
  onValidationError?: (errors: string[]) => void;
}

const employerSignupFields: FormField[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    required: true,
    placeholder: "Enter your full name",
    validation: {
      required: true,
      minLength: 2,
    },
  },
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
  {
    name: "companyName",
    label: "Company Name",
    type: "text",
    required: true,
    placeholder: "Enter your company name",
    validation: {
      required: true,
      minLength: 2,
    },
  },
  {
    name: "companyWebsite",
    label: "Company Website",
    type: "text",
    required: false,
    placeholder: "https://example.com",
    validation: {
      required: false,
      custom: (value) => {
        if (!value.trim()) return null;
        const websiteRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
        return websiteRegex.test(value) ? null : "Please enter a valid website URL";
      },
    },
  },
];

export default function EmployerSignup({ onSuccess, onValidationError }: EmployerSignupProps) {
  const navigate = useNavigate();
  const { setProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Record<string, string | string[]>) => {
    try {
      setIsLoading(true);
      const normalizedData: Record<string, string | string[]> = {};
      Object.entries(data).forEach(([key, value]) => {
        normalizedData[key] = value;
      });

      const response = await apiClient.post('/v1/employer/register', normalizedData);
      setIsLoading(false);
      toast.success("Registration successful! Redirecting to dashboard...");
      
      if (response.data.employer) {
        setProfile(response.data.employer);
      }
      
      onSuccess?.();
      
      setTimeout(() => {
        navigate('/employer/jobs');
      }, 1500);
      
    } catch (error) {
      setIsLoading(false);
      console.error("Registration failed:", error);
      let errorMessage = "Registration failed. Please try again.";
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        errorMessage = apiError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  const handleValidationError = (errors: string[]) => {
    if (errors.length > 0) {
      toast.error(errors[0]);
    }
    onValidationError?.(errors);
  };

  return (
    <div className="flex flex-col gap-4">
      <GenericForm
        fields={employerSignupFields}
        submitButtonText="Sign up"
        onSubmit={handleSubmit}
        onValidationError={handleValidationError}
        isLoading={isLoading}
      />
    </div>
  );
} 