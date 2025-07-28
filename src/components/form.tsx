import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'number' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select fields
  validation?: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null; // Returns error message or null
  };
  multiple?: boolean; // For select fields
}

export interface FormConfig {
  fields: FormField[];
  submitButtonText?: string;
  onSubmit: (data: Record<string, string | string[]>) => void | Promise<void>;
  onValidationError?: (errors: string[]) => void;
  isLoading?: boolean;
  validateCallback?: (data: Record<string, string>) => Promise<{ [key: string]: string } | null>;
}

export default function GenericForm({ 
  fields, 
  submitButtonText = "Submit", 
  onSubmit, 
  onValidationError,
  isLoading = false,
  validateCallback
}: FormConfig) {
  const [formData, setFormData] = useState<Record<string, string | string[]>>(() => {
    const initialData: Record<string, string | string[]> = {};
    fields.forEach(field => {
      if (field.type === 'select' && field.multiple) {
        initialData[field.name] = [];
      } else {
        initialData[field.name] = "";
      }
    });
    return initialData;
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: FormField, value: string): string | null => {
    const { validation } = field;

    if (!validation) return null;

    // Required validation
    if (validation.required && !value.trim()) {
      return `${field.label} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value.trim() && !validation.required) {
      return null;
    }

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

    return null;
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: { [key: string]: string } = {};

    // Validate individual fields
    fields.forEach(field => {
      const value = formData[field.name];
      const error = validateField(field, Array.isArray(value) ? value.join(", ") : value || "");
      if (error) {
        newErrors[field.name] = error;
      }
    });

    // Call external validation callback if provided
    if (validateCallback) {
      try {
        const stringFormData: Record<string, string> = {};
        Object.entries(formData).forEach(([k, v]) => {
          stringFormData[k] = Array.isArray(v) ? v.join(",") : v;
        });
        const externalErrors = await validateCallback(stringFormData);
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

  const handleInputChange = (name: string, value: string | string[]) => {
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

  const renderField = (field: FormField) => {
    const { name, label, type, required, placeholder, options, multiple } = field;
    const value = formData[name] || (multiple ? [] : "");
    const error = errors[name];

    switch (type) {
      case 'select':
        if (multiple) {
          // Use MultiSelect component
          return (
            <MultiSelect
              options={options || []}
              onValueChange={(vals) => handleInputChange(name, vals)}
              defaultValue={value as string[]}
              placeholder={placeholder || `Select ${label.toLowerCase()}`}
              variant="default"
              maxCount={3}
            />
          );
        } else {
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
        }

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={`min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-red-500" : ""}`}
            placeholder={placeholder}
            rows={4}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={error ? "border-red-500" : ""}
            placeholder={placeholder}
            required={required}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={error ? "border-red-500" : ""}
            placeholder={placeholder}
            required={required}
          />
        );

      default:
        return (
          <Input
            type={type}
            value={value}
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
