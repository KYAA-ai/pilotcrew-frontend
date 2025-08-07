import { SiteHeader } from "@/components/employer-header";
import { EmployerSidebar } from "@/components/employer-sidebar";
import GenericForm, { type FormField } from "@/components/form";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import api from "@/lib/api";
import MarkdownPreview from '@uiw/react-markdown-preview';
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function JobFormPage() {
  const [jobCreated, setJobCreated] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [instructions, setInstructions] = React.useState<string>(
    `# 🚀 Getting Started with [Your Product Name]\n\nWelcome! This guide will help you get up and running with **[Your Product Name]**.\n\n---\n\n## 📦 Installation\n\n\`\`\`bash\nnpm install your-product\n# or\nyarn add your-product\n\`\`\`\n\n---\n\n## ✨ Usage Example\n\n\`\`\`jsx\nimport { YourProduct } from 'your-product';\n\nfunction App() {\n  return <YourProduct />;\n}\n\`\`\`\n\n---\n\n## 📝 Features\n\n- 🌒 **Dark mode** support out of the box.\n- 🏋️‍♂️ **Easy integration** with React.\n- 🍭 **GitHub-style** markdown rendering.\n- 🐝 **Automatic code block highlighting**.\n\n---\n\n## 💡 Tips\n\n> [!TIP]\n> You can use markdown to format your instructions, including **bold**, _italic_, and \`inline code\`.\n\n---\n\n## ❓ FAQ\n\n**Q:** How do I enable dark mode?  \n**A:** Dark mode is enabled automatically based on your system settings.\n\n**Q:** Where can I find more documentation?  \n**A:** Visit [our docs](https://yourproduct.com/docs).\n\n---\n\n## ⚠️ Alerts\n\n> [!NOTE]\n> Useful information that users should know, even when skimming content.\n\n> [!IMPORTANT]\n> Key information users need to know to achieve their goal.\n\n> [!WARNING]\n> Urgent info that needs immediate user attention to avoid problems.\n\n> [!CAUTION]\n> Advises about risks or negative outcomes of certain actions.\n\n---\n\n## 📬 Need Help?\n\nFor more help, contact [support@yourproduct.com](mailto:support@yourproduct.com) or visit our [GitHub Issues](https://github.com/yourorg/yourproduct/issues).\n\n---\n\nHappy building! 🚀`
  );
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');

  // Category options copied from backend enum
  const categoryOptions = [
    { value: "Administration & Office Support", label: "Administration & Office Support" },
    { value: "Arts, Design & Creative", label: "Arts, Design & Creative" },
    { value: "Business & Management", label: "Business & Management" },
    { value: "Customer Service", label: "Customer Service" },
    { value: "Education & Training", label: "Education & Training" },
    { value: "Engineering", label: "Engineering" },
    { value: "Finance & Accounting", label: "Finance & Accounting" },
    { value: "Healthcare & Medical", label: "Healthcare & Medical" },
    { value: "Hospitality & Tourism", label: "Hospitality & Tourism" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Software Engineering", label: "Software Engineering" },
    { value: "Information Technology (IT)", label: "Information Technology (IT)" },
    { value: "Legal", label: "Legal" },
    { value: "Manufacturing & Production", label: "Manufacturing & Production" },
    { value: "Marketing & Advertising", label: "Marketing & Advertising" },
    { value: "Media & Communications", label: "Media & Communications" },
    { value: "Operations & Logistics", label: "Operations & Logistics" },
    { value: "Retail & Sales", label: "Retail & Sales" },
    { value: "Science & Research", label: "Science & Research" },
    { value: "Skilled Trades & Technical", label: "Skilled Trades & Technical" },
    { value: "Social Services & Nonprofit", label: "Social Services & Nonprofit" },
    { value: "Transportation & Warehousing", label: "Transportation & Warehousing" },
  ];

  const jobFields: FormField[] = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "features", label: "Features (one per line)", type: "textarea", required: true },
    { name: "requirements", label: "Requirements (one per line)", type: "textarea", required: true },
    { name: "location", label: "Location", type: "text", required: true },
    {
      name: "categories",
      label: "Categories",
      type: "select",
      required: false,
      options: categoryOptions,
      multiple: true,
    },
    { name: "type", label: "Type", type: "select", required: true, options: [
      { value: "API", label: "API" },
      { value: "LLM", label: "LLM" },
      { value: "AIAGENT", label: "AI Agent" },
    ] },
    { name: "startDate", label: "Start Date", type: "date", required: true, placeholder: "YYYY-MM-DD" },
    { name: "durationValue", label: "Duration Value", type: "number", required: true },
    { name: "durationUnit", label: "Duration Unit", type: "select", required: true, options: [
      { value: "DAYS", label: "Days" },
      { value: "WEEKS", label: "Weeks" },
      { value: "MONTHS", label: "Months" },
      { value: "YEARS", label: "Years" },
      { value: "PERMANENT", label: "Permanent" },
    ] },
    { name: "salaryMin", label: "Salary Min", type: "number", required: true },
    { name: "salaryMax", label: "Salary Max", type: "number", required: true },
    { name: "currency", label: "Currency", type: "select", required: true, options: [
      { value: "USD", label: "USD" },
      { value: "EUR", label: "EUR" },
      { value: "GBP", label: "GBP" },
    ] },
    { name: "numExpertsRequired", label: "Number of Experts Required", type: "number", required: true },
  ];

  // 2. Handle form submission
  const handleJobSubmit = async (data: Record<string, string | string[]>) => {
    setIsSubmitting(true);
    const payload = {
      title: data.title,
      description: data.description,
      features: typeof data.features === 'string' ? data.features.split("\n").map(f => f.trim()).filter(Boolean) : [],
      requirements: typeof data.requirements === 'string' ? data.requirements.split("\n").map(r => r.trim()).filter(Boolean) : [],
      location: data.location,
      type: data.type,
      startDate: data.startDate,
      duration: {
        value: data.durationValue ? Number(data.durationValue) : undefined,
        unit: data.durationUnit,
      },
      salary: {
        min: data.salaryMin ? Number(data.salaryMin) : undefined,
        max: data.salaryMax ? Number(data.salaryMax) : undefined,
        currency: data.currency,
      },
      categories: Array.isArray(data.categories) ? data.categories : typeof data.categories === 'string' && data.categories ? [data.categories] : [],
      numExpertsRequired: data.numExpertsRequired ? Number(data.numExpertsRequired) : 1,
      instructions, // merge from markdown editor state
    };

    try {
      await api.post("/v1/jobs", payload);
      setJobCreated(true);
    } catch (error) {
      toast.error("Failed to create job", {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarProvider
      defaultOpen={false}
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <EmployerSidebar variant="sidebar" />
      <SidebarInset>
        <SiteHeader />
        <div className="w-full px-8 py-6 min-h-screen flex flex-col">
          {/* Top bar: Back button left, breadcrumbs right */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <Link 
              to="/employer/jobs" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Jobs
            </Link>
            <nav className="text-sm text-muted-foreground flex gap-2 items-center">
              <Link to="/employer/jobs" className="hover:underline">Jobs</Link>
              <span>/</span>
              <span className="text-foreground font-semibold">Post a Job</span>
            </nav>
          </div>
          <h1 className="text-3xl font-bold mb-8">Post a Job</h1>
          {jobCreated ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Job Created Successfully!</h2>
                  <p className="text-muted-foreground">Your job posting has been created and is now live.</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setJobCreated(false)}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
                  >
                    Create Another Job
                  </button>
                  <Link
                    to="/employer/jobs"
                    className="px-6 py-2 border border-input bg-background text-foreground rounded hover:bg-muted transition"
                  >
                    Go to Jobs Board
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-8 items-start flex-1 min-h-0 h-0">
              <div className="flex-1 min-w-0 h-full overflow-auto">
                <GenericForm
                  fields={jobFields}
                  submitButtonText={isSubmitting ? "Submitting..." : undefined}
                  onSubmit={handleJobSubmit}
                  isLoading={isSubmitting}
                />
              </div>
              {/* Markdown Preview for Instructions */}
              <div className="flex-1 min-w-0 bg-muted/30 rounded-lg p-4 border border-muted-foreground/20 shadow-sm flex flex-col h-full overflow-auto" style={{height: '100%'}}>
                <div className="mb-2 font-semibold text-muted-foreground">Product Instructions (Markdown)</div>
                <div className="flex gap-2 mb-4">
                  <button
                    className={`px-3 py-1 rounded-t font-medium text-sm border-b-2 transition-colors ${tab === 'edit' ? 'border-primary text-primary bg-background' : 'border-transparent text-muted-foreground bg-transparent'}`}
                    onClick={() => setTab('edit')}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className={`px-3 py-1 rounded-t font-medium text-sm border-b-2 transition-colors ${tab === 'preview' ? 'border-primary text-primary bg-background' : 'border-transparent text-muted-foreground bg-transparent'}`}
                    onClick={() => setTab('preview')}
                    type="button"
                  >
                    Preview
                  </button>
                </div>
                {tab === 'edit' ? (
                  <textarea
                    className="w-full h-full flex-1 resize-none rounded border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    style={{minHeight: 0}}
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    placeholder="Enter instructions in markdown..."
                  />
                ) : (
                  <div className="prose prose-sm prose-invert max-w-none text-zinc-100 rounded p-2 border border-zinc-800 flex-1 overflow-auto">
                    <MarkdownPreview source={instructions} style={{ padding: 16 }} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 