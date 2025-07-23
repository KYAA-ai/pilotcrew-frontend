import React from "react";
import { JobForm } from "@/components/jobs/JobFormDialog";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/employer-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useState } from "react";
import api from "@/lib/api";

export default function JobFormPage() {
  const [jobCreated, setJobCreated] = React.useState(false);
  const [instructions, setInstructions] = React.useState<string>(
    `# 🚀 Getting Started with [Your Product Name]\n\nWelcome! This guide will help you get up and running with **[Your Product Name]**.\n\n---\n\n## 📦 Installation\n\n\`\`\`bash\nnpm install your-product\n# or\nyarn add your-product\`\`\`\n\n---\n\n## ✨ Usage Example\n\n\`\`\`jsx\nimport { YourProduct } from 'your-product';\n\nfunction App() {\n  return <YourProduct />;\n}\`\`\`\n\n---\n\n## 📝 Features\n\n- 🌒 **Dark mode** support out of the box.\n- 🏋️‍♂️ **Easy integration** with React.\n- 🍭 **GitHub-style** markdown rendering.\n- 🐝 **Automatic code block highlighting**.\n\n---\n\n## 💡 Tips\n\n> [!TIP]\n> You can use markdown to format your instructions, including **bold**, _italic_, and \`inline code\`.\n\n---\n\n## ❓ FAQ\n\n**Q:** How do I enable dark mode?  
**A:** Dark mode is enabled automatically based on your system settings.\n\n**Q:** Where can I find more documentation?  
**A:** Visit [our docs](https://yourproduct.com/docs).\n\n---\n\n## ⚠️ Alerts\n\n> [!NOTE]\n> Useful information that users should know, even when skimming content.\n\n> [!IMPORTANT]\n> Key information users need to know to achieve their goal.\n\n> [!WARNING]\n> Urgent info that needs immediate user attention to avoid problems.\n\n> [!CAUTION]\n> Advises about risks or negative outcomes of certain actions.\n\n---\n\n## 📬 Need Help?\n\nFor more help, contact [support@yourproduct.com](mailto:support@yourproduct.com) or visit our [GitHub Issues](https://github.com/yourorg/yourproduct/issues).\n\n---\n\nHappy building! 🚀`
  );
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [features, setFeatures] = React.useState("");
  const [requirements, setRequirements] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [type, setType] = React.useState("CONTRACT");
  const [startDate, setStartDate] = React.useState("");
  const [durationValue, setDurationValue] = React.useState<number | "">("");
  const [durationUnit, setDurationUnit] = React.useState("MONTHS");
  const [salaryMin, setSalaryMin] = React.useState<number | "">("");
  const [salaryMax, setSalaryMax] = React.useState<number | "">("");
  const [currency, setCurrency] = React.useState("USD");
  const [categories, setCategories] = React.useState<string[]>([]);
  const [submitting, setSubmitting] = React.useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFeatures("");
    setRequirements("");
    setLocation("");
    setType("CONTRACT");
    setStartDate("");
    setDurationValue("");
    setDurationUnit("MONTHS");
    setSalaryMin("");
    setSalaryMax("");
    setCurrency("USD");
    setCategories([]);
    setInstructions(`# 🚀 Getting Started with [Your Product Name]\n\nWelcome! This guide will help you get up and running with **[Your Product Name]**.\n\n---\n\n## 📦 Installation\n\n\`\`\`bash\nnpm install your-product\n# or\nyarn add your-product\`\`\`\n\n---\n\n## ✨ Usage Example\n\n\`\`\`jsx\nimport { YourProduct } from 'your-product';\n\nfunction App() {\n  return <YourProduct />;\n}\`\`\`\n\n---\n\n## 📝 Features\n\n- 🌒 **Dark mode** support out of the box.\n- 🏋️‍♂️ **Easy integration** with React.\n- 🍭 **GitHub-style** markdown rendering.\n- 🐝 **Automatic code block highlighting**.\n\n---\n\n## 💡 Tips\n\n> [!TIP]\n> You can use markdown to format your instructions, including **bold**, _italic_, and \`inline code\`.\n\n---\n\n## ❓ FAQ\n\n**Q:** How do I enable dark mode?  
**A:** Dark mode is enabled automatically based on your system settings.\n\n**Q:** Where can I find more documentation?  
**A:** Visit [our docs](https://yourproduct.com/docs).\n\n---\n\n## ⚠️ Alerts\n\n> [!NOTE]\n> Useful information that users should know, even when skimming content.\n\n> [!IMPORTANT]\n> Key information users need to know to achieve their goal.\n\n> [!WARNING]\n> Urgent info that needs immediate user attention to avoid problems.\n\n> [!CAUTION]\n> Advises about risks or negative outcomes of certain actions.\n\n---\n\n## 📬 Need Help?\n\nFor more help, contact [support@yourproduct.com](mailto:support@yourproduct.com) or visit our [GitHub Issues](https://github.com/yourorg/yourproduct/issues).\n\n---\n\nHappy building! 🚀`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }
    const payload = {
      title,
      description,
      features: features
        .split(/\n/)
        .map((feature) => feature.trim())
        .filter(Boolean),
      requirements: requirements
        .split(/\n/)
        .map((req) => req.trim())
        .filter(Boolean),
      location,
      type,
      startDate,
      duration: {
        value: durationValue ? Number(durationValue) : undefined,
        unit: durationUnit,
      },
      salary: {
        min: salaryMin ? Number(salaryMin) : undefined,
        max: salaryMax ? Number(salaryMax) : undefined,
        currency,
      },
      categories,
      instructions,
    };
    try {
      setSubmitting(true);
      await api.post("/v1/jobs", payload);
      setJobCreated(true);
      toast.success("Job posted successfully");
    } catch {
      toast.error("Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  const [tab, setTab] = useState<'edit' | 'preview'>('edit');

  return (
    <SidebarProvider
      defaultOpen={false}
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="w-full px-8 min-h-screen flex flex-col">
          {/* Top bar: Breadcrumbs left, buttons right */}
          <div className="flex items-center justify-between mb-2 mt-4 gap-4">
            <nav className="text-sm text-muted-foreground flex gap-2 items-center">
              <Link to="/employer/dashboard" className="hover:underline">Dashboard</Link>
              <span>/</span>
              <Link to="/employer/dashboard" className="hover:underline">Jobs</Link>
              <span>/</span>
              <span className="text-foreground font-semibold">Post a Job</span>
            </nav>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded border border-input bg-background text-foreground hover:bg-muted transition"
                onClick={resetForm}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Posting..." : "Post Job"}
              </button>
            </div>
          </div>
          <h1 className="text-2xl font-bold">Post a Job</h1>
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
                    onClick={() => {
                      setJobCreated(false);
                      resetForm();
                    }}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
                  >
                    Create Another Job
                  </button>
                  <Link
                    to="/employer/dashboard"
                    className="px-6 py-2 border border-input bg-background text-foreground rounded hover:bg-muted transition"
                  >
                    Go to Jobs Board
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-8 items-start flex-1 min-h-0 h-0">
              {/* Left: Job Form */}
              <div className="flex-1 min-w-0 h-full overflow-auto">
                <JobForm
                  title={title}
                  onTitleChange={setTitle}
                  description={description}
                  onDescriptionChange={setDescription}
                  features={features}
                  onFeaturesChange={setFeatures}
                  requirements={requirements}
                  onRequirementsChange={setRequirements}
                  location={location}
                  onLocationChange={setLocation}
                  type={type}
                  onTypeChange={setType}
                  startDate={startDate}
                  onStartDateChange={setStartDate}
                  durationValue={durationValue}
                  onDurationValueChange={setDurationValue}
                  durationUnit={durationUnit}
                  onDurationUnitChange={setDurationUnit}
                  salaryMin={salaryMin}
                  onSalaryMinChange={setSalaryMin}
                  salaryMax={salaryMax}
                  onSalaryMaxChange={setSalaryMax}
                  currency={currency}
                  onCurrencyChange={setCurrency}
                  categories={categories}
                  onCategoriesChange={setCategories}
                  instructions={instructions}
                  onSubmit={handleSubmit}
                />
              </div>
              {/* Right: Markdown Editor with Tabs */}
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