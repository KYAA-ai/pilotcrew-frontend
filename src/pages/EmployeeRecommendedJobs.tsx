import { FilterTags } from '@/components/FilterTags';
import { EmployeeLayout } from "@/components/layout/EmployeeLayout";
import { RecommendedJobsView } from "@/components/recommended-jobs";
import { Filter } from '@/components/SimpleIcons';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SearchBar } from "@/components/ui/search-bar";
import { Switch } from "@/components/ui/switch";
import { useProfile } from '@/contexts/ProfileContext';
import { type ColumnDef } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type SkillCategory = { category?: string; keywords?: string[] };

interface PersonalizeJobSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skills: SkillCategory[];
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  onSubmit: (skills: string[], accuraSearch: boolean) => void;
  accuraSearch: boolean;
  setAccuraSearch: (val: boolean) => void;
}

function PersonalizeJobSearchDialog({ open, onOpenChange, skills, selectedSkills, onChange, onSubmit, accuraSearch, setAccuraSearch }: PersonalizeJobSearchDialogProps) {
  const handleToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onChange(selectedSkills.filter((s: string) => s !== skill));
    } else {
      onChange([...selectedSkills, skill]);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle>Personalize Your Job Search</DialogTitle>
          <DialogDescription>
            Select the skills you want to focus your job search on. These will be prioritized in your recommendations.
          </DialogDescription>
        </DialogHeader>
        {/* Accura Search Switch at the top */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-medium">
            <span>Accura Search</span>
            <Switch checked={accuraSearch} onCheckedChange={setAccuraSearch} />
          </label>
          <div className="text-xs text-muted-foreground mt-1 ml-1">
            This will match all jobs containing just the keywords in your resume
          </div>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {skills.map((cat: SkillCategory, idx: number) => {
            const allSelected = cat.keywords?.every(skill => selectedSkills.includes(skill)) ?? false;
            const someSelected = !!cat.keywords && cat.keywords.some(skill => selectedSkills.includes(skill)) && !allSelected;
            const handleCategoryToggle = (checked: boolean) => {
              if (checked) {
                // Add all skills in this category
                const newSkills = cat.keywords?.filter(skill => !selectedSkills.includes(skill)) ?? [];
                onChange([...selectedSkills, ...newSkills]);
              } else {
                // Remove all skills in this category
                onChange(selectedSkills.filter(skill => !(cat.keywords?.includes(skill))));
              }
            };
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2">
                  <CategoryCheckbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={handleCategoryToggle}
                    id={`cat-checkbox-${idx}`}
                    label={cat.category || ""}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.keywords?.map((skill: string, i: number) => (
                    <Badge
                      key={i}
                      variant={selectedSkills.includes(skill) ? "default" : "outline"}
                      className={`text-xs cursor-pointer select-none ${selectedSkills.includes(skill) ? "bg-primary text-primary-foreground" : ""}`}
                      onClick={() => handleToggle(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { onSubmit(selectedSkills, accuraSearch); onOpenChange(false); }} disabled={selectedSkills.length === 0 && !accuraSearch}>
            Search with Selected Skills
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CategoryCheckboxProps {
  checked: boolean;
  indeterminate: boolean;
  onCheckedChange: (checked: boolean) => void;
  id: string;
  label: string;
}

function CategoryCheckbox({ checked, indeterminate, onCheckedChange, id, label }: CategoryCheckboxProps) {
  const checkboxRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (checkboxRef.current) {
      const input = checkboxRef.current.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
      if (input) input.indeterminate = indeterminate;
    }
  }, [indeterminate]);
  return (
    <>
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        id={id}
        ref={checkboxRef}
      />
      <label htmlFor={id} className="font-medium text-sm text-gray-700 cursor-pointer select-none">
        {label}
      </label>
    </>
  );
}

export default function EmployeeRecommendedJobs() {
  const { profile } = useProfile()
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [accuraSearch, setAccuraSearch] = useState(false);
  const navigate = useNavigate();
  const [tableRequestBody, setTableRequestBody] = useState<{
    skillsByCategory: Record<string, string[]>;
    keywords: string[];
    categories: string[]; 
    accuraSearch: boolean;
    field?: string;
    searchQuery?: string;
  }>({ skillsByCategory: {}, keywords: [], categories: [], accuraSearch: false });
  const [mode, setMode] = useState<"recommended" | "search">("recommended");
  const employeeProfile = profile as { llamaResumeInfo?: { skills?: { category?: string; keywords?: string[] }[] } };
  const skillsData = employeeProfile?.llamaResumeInfo?.skills ?? [];
  const skills = skillsData;

  // Handler for new search bar
  const handleSearchSubmit = (field: string, query: string) => {
    setTableRequestBody(prev => ({
      ...prev,
      field,
      searchQuery: query,
    }));
    setMode(query ? "search" : "recommended");
  };


  const searchFields = [
    { value: "requirements", label: "Requirements" },
    { value: "description", label: "Description" },
  ];

  const handleJobAction = (action: string, row: Record<string, unknown>) => {
    if (action === "view") {
      navigate(`/employee/jobs/${row.id}`, { state: { job: row } });
    } else if (action === "apply") {
      toast.info(`Applying to job: ${row.title}`)
      console.log(`Action: ${action}`, row)
    } else {
      toast.info(`Job action: ${action} for ${row.title}`)
      console.log(`Action: ${action}`, row)
    }
  }

  // Filter removal handlers
  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = selectedSkills.filter(skill => skill !== skillToRemove);
    setSelectedSkills(updatedSkills);
    
    // Check if all filters are removed
    // No action needed when filters are removed
    
    // Update table request body
    const newSkillsByCategory: Record<string, string[]> = {};
    updatedSkills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      const cat = skillsData.find((cat: SkillCategory) => cat.keywords?.some(k => k.toLowerCase() === skillLower));
      if (cat && cat.category) {
        const catLower = cat.category.toLowerCase();
        if (!newSkillsByCategory[catLower]) {
          newSkillsByCategory[catLower] = [];
        }
        if (!newSkillsByCategory[catLower].includes(skillLower)) {
          newSkillsByCategory[catLower].push(skillLower);
        }
      }
    });
    const keywords = Array.from(new Set(updatedSkills.map(s => s.toLowerCase())));
    const categories = Array.from(new Set(Object.keys(newSkillsByCategory)));
    setTableRequestBody({
      skillsByCategory: newSkillsByCategory,
      keywords,
      categories,
      accuraSearch
    });
  };

  const handleRemoveAccuraSearch = () => {
    setAccuraSearch(false);
    
    setTableRequestBody(prev => ({
      ...prev,
      accuraSearch: false
    }));
  };

  // Custom columns configuration for jobs
  const jobColumns: ColumnDef<Record<string, unknown>>[] = [
    {
      accessorKey: "title",
      header: "Job Title",
      cell: ({ row }) => (
        <div className="font-medium text-foreground">
          {String(row.getValue("title"))}
        </div>
      ),
    },
    {
      accessorKey: "companyName",
      header: "Company",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {String(row.getValue("companyName"))}
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          {String(row.getValue("location"))}
        </Badge>
      ),
    },
    {
      accessorKey: "type",
      header: "Job Type",
      cell: ({ row }) => {
        const type = String(row.getValue("type"))
        const variant = type === "FULL_TIME" ? "default" : "secondary"
        const label = type === "FULL_TIME" ? "Full Time" : type === "PART_TIME" ? "Part Time" : type

        return (
          <Badge variant={variant} className="text-xs">
            {label}
          </Badge>
        )
      },
    },
    // {
    //   accessorKey: "salary",
    //   header: "Salary Range",
    //   cell: ({ row }) => {
    //     const salary = row.getValue("salary") as { min: number; max: number; currency: string } | null
    //     if (salary?.min && salary?.max) {
    //       return (
    //         <div className="text-sm font-medium text-default">
    //           {salary.currency} {salary.min.toLocaleString()} - {salary.max.toLocaleString()}
    //         </div>
    //       )
    //     }
    //     return <span className="text-muted-foreground">-</span>
    //   },
    // },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => {
        const duration = row.getValue("duration") as { value: number; unit: string } | null
        if (duration?.value && duration?.unit) {
          return (
            <Badge variant="outline" className="text-xs">
              {duration.value} {duration.unit.toLowerCase()}
            </Badge>
          )
        }
        return <span className="text-muted-foreground">-</span>
      },
    },
    {
      accessorKey: "features",
      header: "Features",
      cell: ({ row }) => {
        const features = row.getValue("features") as string[] | null
        if (Array.isArray(features) && features.length > 0) {
          return (
            <div className="flex flex-wrap gap-1">
              {features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature.length > 20 ? feature.substring(0, 20) + "..." : feature}
                </Badge>
              ))}
              {features.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{features.length - 2} more
                </Badge>
              )}
            </div>
          )
        }
        return <span className="text-muted-foreground">-</span>
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigate(`/employee/jobs/${row.original.id}`, { state: { job: row.original } });
            }}
          >
            View Details
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => handleJobAction("apply", row.original)}
          >
            Apply
          </Button>
        </div>
      ),
    },
  ]

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const endpoint =
    mode === "recommended"
      ? "/v1/employee/recommended-jobs"
      : "/v1/employee/search";

  return (
    <EmployeeLayout>
      <div className="flex flex-col gap-6 pb-8">
        {/* Header Section */}
        <div className="flex items-center justify-between px-8 lg:px-16">
          <div>
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-muted-foreground">
              Discover products and opportunities that match your skills and experience
            </p>
          </div>
        </div>

        {/* Recommended Jobs Table */}
        <RecommendedJobsView
          endpoint={endpoint}
          dataKey="recommendedJobs"
          title=""
          enableSelection={true}
          customColumns={jobColumns}
          onRowAction={handleJobAction}
          requestBody={tableRequestBody}
          navigationUrl="/employee/jobs/{id}?source=recommended"
          searchBarElement={
            <SearchBar
              onSubmit={handleSearchSubmit}
              fields={searchFields}
              placeholder="Search jobs..."
            />
          }
          filterTagsElement={
            <FilterTags
              selectedSkills={selectedSkills}
              accuraSearch={accuraSearch}
              onRemoveSkill={handleRemoveSkill}
              onRemoveAccuraSearch={handleRemoveAccuraSearch}
            />
          }
          customActionElement={() => {
            return (
              <>
                <Button variant="outline" className="ml-2" onClick={() => setPersonalizeOpen(true)}>
                  <Filter className="w-4 h-4 mr-2" />
                  Personalize Job Search
                </Button>
                <PersonalizeJobSearchDialog
                  open={personalizeOpen}
                  onOpenChange={setPersonalizeOpen}
                  skills={skills}
                  selectedSkills={selectedSkills}
                  onChange={setSelectedSkills}
                  accuraSearch={accuraSearch}
                  setAccuraSearch={setAccuraSearch}
                  onSubmit={(skills, accura) => {
                    setSelectedSkills(skills);
                    setAccuraSearch(accura);
                    const newSkillsByCategory: Record<string, string[]> = {};
                    skills.forEach(skill => {
                      const skillLower = skill.toLowerCase();
                      const cat = skillsData.find((cat: SkillCategory) => cat.keywords?.some(k => k.toLowerCase() === skillLower));
                      if (cat && cat.category) {
                        const catLower = cat.category.toLowerCase();
                        if (!newSkillsByCategory[catLower]) {
                          newSkillsByCategory[catLower] = [];
                        }
                        if (!newSkillsByCategory[catLower].includes(skillLower)) {
                          newSkillsByCategory[catLower].push(skillLower);
                        }
                      }
                    });
                    const keywords = Array.from(new Set(skills.map(s => s.toLowerCase())));
                    const categories = Array.from(new Set(Object.keys(newSkillsByCategory)));
                    setTableRequestBody({
                      skillsByCategory: newSkillsByCategory,
                      keywords,
                      categories,
                      accuraSearch: accura
                    });
                  }}
                />
              </>
            );
          }}
          actions={[
            { label: "View", value: "view" },
          ]}
        />
      </div>
    </EmployeeLayout>
  )
} 