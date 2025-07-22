import React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox";

// If the Category enum is not available in the frontend, define it here or import from a shared location
const Category = {
  ADMINISTRATION_OFFICE_SUPPORT: "Administration & Office Support",
  ARTS_DESIGN_CREATIVE: "Arts, Design & Creative",
  BUSINESS_MANAGEMENT: "Business & Management",
  CUSTOMER_SERVICE: "Customer Service",
  EDUCATION_TRAINING: "Education & Training",
  ENGINEERING: "Engineering",
  FINANCE_ACCOUNTING: "Finance & Accounting",
  HEALTHCARE_MEDICAL: "Healthcare & Medical",
  HOSPITALITY_TOURISM: "Hospitality & Tourism",
  HUMAN_RESOURCES: "Human Resources",
  SOFTWARE_ENGINEERING: "Software Engineering",
  INFORMATION_TECHNOLOGY_IT: "Information Technology (IT)",
  LEGAL: "Legal",
  MANUFACTURING_PRODUCTION: "Manufacturing & Production",
  MARKETING_ADVERTISING: "Marketing & Advertising",
  MEDIA_COMMUNICATIONS: "Media & Communications",
  OPERATIONS_LOGISTICS: "Operations & Logistics",
  RETAIL_SALES: "Retail & Sales",
  SCIENCE_RESEARCH: "Science & Research",
  SKILLED_TRADES_TECHNICAL: "Skilled Trades & Technical",
  SOCIAL_SERVICES_NONPROFIT: "Social Services & Nonprofit",
  TRANSPORTATION_WAREHOUSING: "Transportation & Warehousing"
};

export interface JobFormProps {
  title: string;
  onTitleChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  features: string;
  onFeaturesChange: (v: string) => void;
  requirements: string;
  onRequirementsChange: (v: string) => void;
  location: string;
  onLocationChange: (v: string) => void;
  type: string;
  onTypeChange: (v: string) => void;
  startDate: string;
  onStartDateChange: (v: string) => void;
  durationValue: number | "";
  onDurationValueChange: (v: number | "") => void;
  durationUnit: string;
  onDurationUnitChange: (v: string) => void;
  salaryMin: number | "";
  onSalaryMinChange: (v: number | "") => void;
  salaryMax: number | "";
  onSalaryMaxChange: (v: number | "") => void;
  currency: string;
  onCurrencyChange: (v: string) => void;
  categories: string[];
  onCategoriesChange: (v: string[]) => void;
  instructions?: string;
  onSubmit: (e: React.FormEvent) => void;
}

export function JobForm(props: JobFormProps) {
  return (
    <form onSubmit={props.onSubmit} className="grid gap-4 py-4">
      {/* Hidden input for instructions markdown */}
      {props.instructions !== undefined && (
        <input type="hidden" name="instructions" value={props.instructions} />
      )}
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={props.title} onChange={(e) => props.onTitleChange(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={props.description}
          onChange={(e) => props.onDescriptionChange(e.target.value)}
          className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="features">Features (one per line)</Label>
        <textarea
          id="features"
          value={props.features}
          onChange={(e) => props.onFeaturesChange(e.target.value)}
          className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="requirements">Requirements (one per line)</Label>
        <textarea
          id="requirements"
          value={props.requirements}
          onChange={(e) => props.onRequirementsChange(e.target.value)}
          className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={props.location} onChange={(e) => props.onLocationChange(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label>Categories</Label>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 max-h-72 overflow-y-auto border rounded-md p-2 bg-muted/20 min-h-[180px]">
          {Object.entries(Category).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={props.categories.includes(value)}
                onCheckedChange={(checked) => {
                  props.onCategoriesChange(
                    checked
                      ? [...props.categories, value]
                      : props.categories.filter((cat) => cat !== value)
                  );
                }}
              />
              {value}
            </label>
          ))}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="type">Type</Label>
        <Select value={props.type} onValueChange={props.onTypeChange}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FULL_TIME">Full Time</SelectItem>
            <SelectItem value="PART_TIME">Part Time</SelectItem>
            <SelectItem value="CONTRACT">Contract</SelectItem>
            <SelectItem value="TEMPORARY">Temporary</SelectItem>
            <SelectItem value="INTERN">Intern</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input id="startDate" type="date" value={props.startDate} onChange={(e) => props.onStartDateChange(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label>Duration</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            min={1}
            placeholder="Value"
            value={props.durationValue as number | undefined}
            onChange={(e) => props.onDurationValueChange(e.target.value ? Number(e.target.value) : "")}
            className="w-24"
          />
          <Select value={props.durationUnit} onValueChange={props.onDurationUnitChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAYS">Days</SelectItem>
              <SelectItem value="WEEKS">Weeks</SelectItem>
              <SelectItem value="MONTHS">Months</SelectItem>
              <SelectItem value="YEARS">Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Salary Range</Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            type="number"
            min={0}
            placeholder="Min"
            value={props.salaryMin as number | undefined}
            onChange={(e) => props.onSalaryMinChange(e.target.value ? Number(e.target.value) : "")}
          />
          <Input
            type="number"
            min={0}
            placeholder="Max"
            value={props.salaryMax as number | undefined}
            onChange={(e) => props.onSalaryMaxChange(e.target.value ? Number(e.target.value) : "")}
          />
          <Select value={props.currency} onValueChange={props.onCurrencyChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  )
} 