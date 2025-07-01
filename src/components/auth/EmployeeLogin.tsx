import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import GenericForm from "@/components/form";
import type { FormField } from "@/components/form";
import apiClient from "@/lib/api";
import { useProfile } from "@/contexts/ProfileContext";

interface EmployeeLoginProps {
  onSuccess?: () => void;
  onValidationError?: (errors: string[]) => void;
}

const employeeLoginFields: FormField[] = [
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

export default function EmployeeLogin({ onSuccess, onValidationError }: EmployeeLoginProps) {
  const navigate = useNavigate();
  const { setProfile } = useProfile();

  const handleSubmit = async (data: Record<string, string>) => {
    try {
      const response = await apiClient.post('/employee/login', data);
      
      toast.success("Login successful! Redirecting to dashboard...");
      
      if (response.data.employee) {
        setProfile(response.data.employee);
      }
      
      onSuccess?.();
      
      setTimeout(() => {
        navigate('/employee/dashboard');
      }, 1500);
      
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        errorMessage = apiError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  const handleValidationError = (errors: string[]) => {
    console.log("Login validation errors:", errors);
    if (errors.length > 0) {
      toast.error(errors[0]);
    }
    onValidationError?.(errors);
  };

  const handleLinkedInLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/linkedin`;
  };

  return (
    <div className="flex flex-col gap-4">
      <GenericForm
        fields={employeeLoginFields}
        submitButtonText="Continue"
        onSubmit={handleSubmit}
        onValidationError={handleValidationError}
      />

      <div className="text-center italic"> OR </div>

      <button 
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleLinkedInLogin}
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5">
          <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.26 2.3-2.6 4.73-2.6C21.4 7.6 24 10 24 15v9h-5v-8.1c0-1.9-.03-4.4-2.7-4.4-2.7 0-3.1 2.1-3.1 4.2V24h-5V8z" />
        </svg>
        Continue with LinkedIn
      </button>
    </div>
  );
}
