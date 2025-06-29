import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface FormFieldWithFiles {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select fields
  accept?: string; // For file fields
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
        return (
          <div className="space-y-2">
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleInputChange(name, file);
              }}
              className={error ? "border-red-500" : ""}
              accept={accept}
              required={required}
            />
            {value instanceof File && (
              <p className="text-sm text-gray-600">
                Selected: {value.name} ({(value.size / 1024 / 1024).toFixed(2)} MB)
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