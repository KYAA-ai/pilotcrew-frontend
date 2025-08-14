import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export interface FormFieldWithFiles {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select fields
  accept?: string; // For file fields
  dragAndDrop?: boolean; // Enable drag and drop for file fields
  validation?: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null; // Returns error message or null
    fileSize?: number; // Max file size in MB for file fields
    fileTypes?: string[]; // Allowed file types for file fields
  };
}

export interface FormConfigWithFiles {
  fields: FormFieldWithFiles[];
  submitButtonText?: string;
  onSubmit: (data: Record<string, string | File | null>) => void | Promise<void>;
  onValidationError?: (errors: string[]) => void;
  isLoading?: boolean;
  validateCallback?: (data: Record<string, string | File | null>) => Promise<{ [key: string]: string } | null>;
}

export default function GenericFormWithFiles({ 
  fields, 
  submitButtonText = "Submit", 
  onSubmit, 
  onValidationError,
  isLoading = false,
  validateCallback
}: FormConfigWithFiles) {
  const [formData, setFormData] = useState<Record<string, string | File | null>>(() => {
    const initialData: Record<string, string | File | null> = {};
    fields.forEach(field => {
      initialData[field.name] = field.type === 'file' ? null : "";
    });
    return initialData;
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: FormFieldWithFiles, value: string | File | null): string | null => {
    const { validation } = field;

    if (!validation) return null;

    // Required validation
    if (validation.required) {
      if (field.type === 'file') {
        if (!value || value === null) {
          return `${field.label} is required`;
        }
      } else {
        if (!value || (typeof value === 'string' && !value.trim())) {
          return `${field.label} is required`;
        }
      }
    }

    // Skip other validations if field is empty and not required
    if (field.type === 'file') {
      if (!value || value === null) {
        return null;
      }
    } else {
      if (!value || (typeof value === 'string' && !value.trim() && !validation.required)) {
        return null;
      }
    }

    // File-specific validations
    if (field.type === 'file' && value instanceof File) {
      // File size validation
      if (validation.fileSize && value.size > validation.fileSize * 1024 * 1024) {
        return `${field.label} must be smaller than ${validation.fileSize}MB`;
      }

      // File type validation
      if (validation.fileTypes && validation.fileTypes.length > 0) {
        const fileExtension = value.name.split('.').pop()?.toLowerCase();
        const mimeType = value.type;
        
        const isValidType = validation.fileTypes.some(type => {
          if (type.startsWith('.')) {
            return fileExtension === type.substring(1);
          }
          return mimeType.startsWith(type);
        });

        if (!isValidType) {
          return `${field.label} must be one of: ${validation.fileTypes.join(', ')}`;
        }
      }
    }

    // String-specific validations
    if (typeof value === 'string') {
      // Min length validation
      if (validation.minLength && value.length < validation.minLength) {
        return `${field.label} must be at least ${validation.minLength} characters long`;
      }

      // Pattern validation
      if (validation.pattern && !validation.pattern.test(value)) {
        return `Please enter a valid ${field.label.toLowerCase()}`;
      }

      // Custom validation
      if (validation.custom) {
        return validation.custom(value);
      }
    }

    return null;
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: { [key: string]: string } = {};

    // Validate individual fields
    fields.forEach(field => {
      const error = validateField(field, formData[field.name] || "");
      if (error) {
        newErrors[field.name] = error;
      }
    });

    // Call external validation callback if provided
    if (validateCallback) {
      try {
        const externalErrors = await validateCallback(formData);
        if (externalErrors) {
          // Merge external errors with field errors
          Object.assign(newErrors, externalErrors);
        }
      } catch (error) {
        console.error("Validation callback error:", error);
        // You can handle callback errors here if needed
      }
    }

    setErrors(newErrors);

    // Call validation error callback if there are errors
    if (Object.keys(newErrors).length > 0) {
      onValidationError?.(Object.values(newErrors));
      return false;
    }

    return true;
  };

  const handleInputChange = (name: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!await validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const renderField = (field: FormFieldWithFiles) => {
    const { name, label, type, required, placeholder, options, accept } = field;
    const value = formData[name];
    const error = errors[name];

    switch (type) {
      case 'select':
        return (
          <Select value={value as string} onValueChange={(value) => handleInputChange(name, value)}>
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'textarea':
        return (
          <textarea
            value={value as string}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={`min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-red-500" : ""}`}
            placeholder={placeholder}
            rows={4}
          />
        );

      case 'file':
        if (field.dragAndDrop) {
          return (
            <div className="space-y-2">
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  error ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const files = Array.from(e.dataTransfer.files);
                  if (files.length > 0) {
                    const file = files[0];
                    // Validate file type
                    if (accept && !accept.split(',').some(type => {
                      if (type.startsWith('.')) {
                        return file.name.toLowerCase().endsWith(type);
                      }
                      return file.type.startsWith(type.trim());
                    })) {
                      return; // Invalid file type
                    }
                    handleInputChange(name, file);
                  }
                }}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div className="text-sm">
                    <span className="font-medium">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </div>
                  <p className="text-xs text-gray-500">
                    {accept ? `Accepted formats: ${accept}` : "All file types accepted"}
                  </p>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept={accept}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleInputChange(name, file);
                  }}
                />
              </div>
              {value instanceof File && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">{value.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange(name, null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        }
        
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const fileInput = document.createElement('input');
                  fileInput.type = 'file';
                  fileInput.accept = accept || '';
                  fileInput.required = required || false;
                  fileInput.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0] || null;
                    handleInputChange(name, file);
                  };
                  fileInput.click();
                }}
                className={error ? "border-red-500" : ""}
              >
                Browse Files
              </Button>
              <span className="text-sm text-muted-foreground">
                {value instanceof File ? value.name : "No file selected"}
              </span>
            </div>
            {value instanceof File && (
              <p className="text-sm text-gray-600">
                File size: {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>
        );

      default:
        return (
          <Input
            type={type}
            value={value as string}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={error ? "border-red-500" : ""}
            placeholder={placeholder}
            required={required}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {fields.map((field) => (
        <div key={field.name} className="grid gap-2">
          <Label htmlFor={field.name}>
            {field.label} 
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          {renderField(field)}
          {errors[field.name] && (
            <p className="text-sm text-red-500">{errors[field.name]}</p>
          )}
        </div>
      ))}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Submitting..." : submitButtonText}
      </Button>
    </form>
  );
} 