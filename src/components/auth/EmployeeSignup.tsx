import type { FormFieldWithFiles } from "@/components/form-with-files";
import GenericFormWithFiles from "@/components/form-with-files";
import apiClient from "@/lib/api";
import { useState } from "react";
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
    name: "resume",
    label: "Resume/CV",
    type: "file",
    required: true,
    accept: ".pdf,.doc,.docx",
    validation: {
      required: true,
      fileSize: 2, // 2MB max
      fileTypes: ['.pdf', '.doc', '.docx', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    },
  },
];

export default function EmployeeSignup({ onSuccess, onValidationError }: EmployeeSignupProps) {
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [modalStage, setModalStage] = useState<1 | 2>(1);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [currentRetry, setCurrentRetry] = useState(0);
  const [maxRetries] = useState(5);

  const startPollingLlamaExtraction = (employeeId: string) => {
    let isActive = true;
    let retries = 0;
    
    // Reset retry counter when starting
    setCurrentRetry(0);
    
    const poll = async () => {
      try {
        setCurrentRetry(retries);
        const response = await apiClient.put(`/v1/employee/llama-extraction-status`, { employeeId });
        const status = response.data.status;
        if (!isActive) return;
        if (status === "SUCCESS") {
          setProcessing(false);
          setCurrentRetry(maxRetries); // Set to 100% completion
          console.log("Navigating to /employee/recommended-jobs after registration SUCCESS");
          onSuccess?.();
          toast.success("Registration successful!");
        } else if (status === "FAILED") {
          setProcessing(false);
          setRegistrationError("Resume analysis failed. Please try again later.");
        } else if (status === "PENDING") {
          setProcessing(true);
          if (retries < maxRetries) {
            retries++;
            setTimeout(poll, 10000);
          } else {
            setProcessing(false);
            setRegistrationError("Resume analysis is taking too long. Please try again later.");
          }
        } else {
          setProcessing(false);
          setRegistrationError("Unknown status from server.");
        }
      } catch {
        setProcessing(false);
        setRegistrationError("Error checking resume analysis status. Please try again later.");
      }
    };
    poll();
    return () => { isActive = false; };
  };

  const handleSubmit = async (data: Record<string, string | File | null>) => {
    setShowProcessingModal(true);
    setRegistrationError(null);
    setModalStage(1);
    setProcessing(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string') {
          formDataToSend.append(key, value);
        } else if (value instanceof File) {
          formDataToSend.append(key, value);
        }
      });
      const response = await apiClient.post('/v2/employee/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setEmployeeId(response.data?.employee?.id);
      setCategories(response.data?.employee?.categories || []);
      setSelectedCategories([]);
      setProcessing(false);
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        errorMessage = apiError.response?.data?.message || errorMessage;
      }
      setRegistrationError(errorMessage);
      setProcessing(false);
      toast.error(errorMessage);
    }
  };

  const handleValidationError = (errors: string[]) => {
    if (errors.length > 0) {
      toast.error(errors[0]);
    }
    onValidationError?.(errors);
  };

  const handleCategoriesConfirm = async () => {
    if (!employeeId) return;
    setRegistrationError(null);
    setModalStage(2);
    setProcessing(true);
    try {
      await apiClient.put('/v1/employee/profile', {
        categories: selectedCategories,
      });
      startPollingLlamaExtraction(employeeId);
    } catch (error) {
      let errorMessage = "Failed to update categories. Please try again.";
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        errorMessage = apiError.response?.data?.message || errorMessage;
      }
      setRegistrationError(errorMessage);
      setProcessing(false);
      toast.error(errorMessage);
    }
  };

  const handleModalClose = () => {
    setShowProcessingModal(false);
    setRegistrationError(null);
    setModalStage(1);
    setEmployeeId(null);
    setCategories([]);
    setSelectedCategories([]);
    setProcessing(false);
    setCurrentRetry(0);
  };

  const handleComplete = () => {
    // navigate('/employee/recommended-jobs');
    window.location.href = '/employee/recommended-jobs';
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
        stage={modalStage}
        processing={processing}
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoriesConfirm={handleCategoriesConfirm}
        onComplete={handleComplete}
        onClose={handleModalClose}
        hasError={!!registrationError}
        errorMessage={registrationError}
        currentRetry={currentRetry}
        maxRetries={maxRetries}
      />
    </>
  );
} 