import type { FormFieldWithFiles } from "@/components/form-with-files";
import GenericFormWithFiles from "@/components/form-with-files";
import { useProfile } from "@/contexts/ProfileContext";
import apiClient from "@/lib/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SignupProcessingModal } from "./SignupProcessingModal";

interface EmployeeSignupProps {
  onSuccess?: () => void;
  onValidationError?: (errors: string[]) => void;
}

const employeeSignupFields: FormFieldWithFiles[] = [
  {
    name: "name",
    label: "Full Name",
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
    name: "phone",
    label: "Phone Number",
    type: "text",
    required: false,
    placeholder: "Enter your phone number",
    validation: {
      required: false,
      custom: (value) => {
        if (!value.trim()) return null;
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(value.replace(/[\s\-()]/g, '')) ? null : "Please enter a valid phone number";
      },
    },
  },
  {
    name: "resume",
    label: "Resume/CV",
    type: "file",
    required: true,
    accept: ".pdf,.doc,.docx",
    validation: {
      required: true,
      fileSize: 5, // 5MB max
      fileTypes: ['.pdf', '.doc', '.docx', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    },
  },
  {
    name: "skills",
    label: "Skills",
    type: "textarea",
    required: false,
    placeholder: "Enter your skills (e.g., JavaScript, React, Node.js, Python...)",
    validation: {
      required: false,
      minLength: 10,
    },
  },
  {
    name: "experience",
    label: "Years of Experience",
    type: "select",
    required: false,
    options: [
      { value: "0-1", label: "0-1 years" },
      { value: "1-3", label: "1-3 years" },
      { value: "3-5", label: "3-5 years" },
      { value: "5-10", label: "5-10 years" },
      { value: "10+", label: "10+ years" },
    ],
    validation: {
      required: false,
    },
  },
];

export default function EmployeeSignup({ onSuccess, onValidationError }: EmployeeSignupProps) {
  const { setProfile } = useProfile();
  const navigate = useNavigate();
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string | File | null> | null>(null);

  const handleSubmit = (data: Record<string, string | File | null>) => {
    console.log("Form submitted, showing modal");
    // Store the form data and show modal immediately
    setFormData(data);
    setShowProcessingModal(true);
    setRegistrationError(null);
  };

  const handleValidationError = (errors: string[]) => {
    console.log("Employee signup validation errors:", errors);
    if (errors.length > 0) {
      toast.error(errors[0]);
    }
    onValidationError?.(errors);
  };

  const handleProcessingComplete = async () => {
    if (!formData) return;

    try {
      console.log("Processing complete, making API call");
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'string') {
          formDataToSend.append(key, value);
        } else if (value instanceof File) {
          formDataToSend.append(key, value);
        }
      });

      const response = await apiClient.post('/employee/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });    
      
      if (response.data.employee) {
        setProfile(response.data.employee);
      }
      
      onSuccess?.();
      toast.success("Registration successful!");
      
      // Navigate to dashboard
      navigate('/employee/dashboard');
      
    } catch (error) {
      console.error("Employee registration failed:", error);
      let errorMessage = "Registration failed. Please try again.";
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        errorMessage = apiError.response?.data?.message || errorMessage;
      }
      setRegistrationError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleModalClose = () => {
    setShowProcessingModal(false);
    setRegistrationError(null);
    setFormData(null);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <GenericFormWithFiles
          fields={employeeSignupFields}
          submitButtonText="Sign up"
          onSubmit={handleSubmit}
          onValidationError={handleValidationError}
          isLoading={false}
        />
      </div>

      <SignupProcessingModal 
        isOpen={showProcessingModal}
        onComplete={handleProcessingComplete}
        onClose={handleModalClose}
        hasError={!!registrationError}
        errorMessage={registrationError}
      />
    </>
  );
} 