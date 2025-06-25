import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import GenericForm from "@/components/form";
import type { FormField } from "@/components/form";
import apiClient from "@/lib/api";

interface EmployerSignupProps {
  onSuccess?: () => void;
  onValidationError?: (errors: string[]) => void;
}

const employerSignupFields: FormField[] = [
  {
    name: "name",
    label: "Employer Name",
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
    required: true,
    placeholder: "https://example.com",
    validation: {
      required: true,
      custom: (value) => {
        if (!value.trim()) return null; // Skip if empty and not required
        const websiteRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
        return websiteRegex.test(value) ? null : "Please enter a valid website URL";
      },
    },
  },
];

export default function EmployerSignup({ onSuccess, onValidationError }: EmployerSignupProps) {
  const navigate = useNavigate();

  const handleSubmit = async (data: Record<string, string>) => {
    try {
      console.log("Signup form data:", data);
      const response = await apiClient.post('/employer/register', data);
      console.log("Registration successful:", response.data);
    
      toast.success("Registration successful! Please check your email to verify your account.");
      
      if (response.data.token) {
        localStorage.setItem('employer-token', response.data.token);
      }
      
      onSuccess?.();

      setTimeout(() => {
        navigate('/employer/dashboard');
      }, 1500);
      
    } catch (error) {
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
    console.log("Signup validation errors:", errors);
    if (errors.length > 0) {
      toast.error(errors[0]);
    }
    onValidationError?.(errors);
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
    window.location.href = `${import.meta.env.VITE_API_URL}/employer/auth/google`;
  };

  return (
    <div className="flex flex-col gap-4">
      <GenericForm
        fields={employerSignupFields}
        submitButtonText="Sign up"
        onSubmit={handleSubmit}
        onValidationError={handleValidationError}
      />

      <div className="text-center italic"> OR </div>

      <button 
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleGoogleSignup}
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5">
          <path d="M21.35 11.1h-9.09v3.7h5.82c-.25 1.46-1.5 4.3-5.82 4.3-3.5 0-6.36-2.9-6.36-6.5s2.86-6.5 6.36-6.5c2 0 3.34.88 4.09 1.63l2.8-2.8C17.57 2.46 15.46 1.5 12.32 1.5 6.46 1.5 2 5.93 2 11.7s4.46 10.2 10.32 10.2c5.93 0 9.82-4.16 9.82-10.07 0-.84-.08-1.43-.18-2.73z"/>
        </svg>
        Signup with Google
      </button>
    </div>
  );
} 