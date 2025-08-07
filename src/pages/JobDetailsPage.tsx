import { EmployeeHeader } from "@/components/employee-header";
import { EmployeeSidebar } from "@/components/employee-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import api from "@/lib/api";
import { generateUUID } from "@/lib/utils";
import React, { type CSSProperties } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import MarkdownPreview from "@uiw/react-markdown-preview";

interface JobDetails {
  id: string;
  title: string;
  companyName: string;
  location: string;
  type: string;
  status: string;
  description: string;
  features: string[];
  requirements: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  } | null;
  duration: {
    value: number;
    unit: string;
  } | null;
  startDate: string;
  createdAt: string;
  instructions: string;
  categories: string[];
}

export default function JobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [jobDetails, setJobDetails] = React.useState<JobDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Get the source from URL params or default to 'apply'
  const searchParams = new URLSearchParams(location.search);
  const source = searchParams.get('source') || 'apply';
  
  React.useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        setError("Job ID is required");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get(`/v1/employee/job/${jobId}`);
        setJobDetails(response.data.job);
      } catch (error) {
        console.error("Failed to load job details:", error);
        setError("Failed to load job details");
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  const handleApply = async () => {
    try {
      const workflowResponse = await api.post("/v1/employee/workflow/startJobWorkflow", {
        jobId: jobId
      });
      
      if (workflowResponse.status.toString().startsWith("2")) {
        const chatId = generateUUID();
        navigate(`/employee/workflow?jobId=${jobId}&chatId=${chatId}`);
      }
    } catch (error) {
      console.error("Failed to create job workflow:", error);
      const errorStr = String(error);
      if (errorStr.includes('400') || errorStr.includes('completed')) {
        toast.error("Job is completed, cannot be started again.");
      } else {
        toast.error("Failed to start job. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <SidebarProvider
        defaultOpen={false}
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties}
      >
        <EmployeeSidebar variant="inset" />
        <SidebarInset>
          <EmployeeHeader />
          <div className="w-full px-8 min-h-screen flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading job details...</p>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error || !jobDetails) {
    return (
      <SidebarProvider
        defaultOpen={false}
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties}
      >
        <EmployeeSidebar variant="inset" />
        <SidebarInset>
          <EmployeeHeader />
          <div className="w-full px-8 min-h-screen flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
                <p className="text-muted-foreground mb-4">{error || "Job not found"}</p>
                <Button onClick={() => navigate("/employee/recommended-jobs")}>
                  Back to Jobs
                </Button>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider
      defaultOpen={false}
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as CSSProperties}
    >
      <EmployeeSidebar variant="inset" />
      <SidebarInset>
        <EmployeeHeader />
        <div className="m-4 w-full px-8 min-h-screen flex flex-col">
          {/* Breadcrumb and Start Review Button */}
          <div className="mt-4 mb-8 flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              ← Back
            </Button>
            {source !== 'complete' && (
              <Button 
                size="lg" 
                onClick={source === 'in-progress' ? () => navigate(`/employee/workflow?jobId=${jobId}&chatId=${generateUUID()}`) : handleApply}
              >
                {source === 'apply' ? 'Start Job' : source === 'in-progress' ? 'Continue Job' : 'Start Job'}
              </Button>
            )}
          </div>

          <div className="flex gap-8 items-start flex-1 min-h-0 h-0">
            {/* Left: Job Metadata */}
            <div className="flex-1 min-w-0 h-full overflow-auto">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold mb-2">{jobDetails.title}</h1>
                  <p className="text-xl text-muted-foreground mb-4">{jobDetails.companyName}</p>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="outline">{jobDetails.location}</Badge>
                    <Badge variant="default">
                      {jobDetails.type === "API" ? "API" : jobDetails.type === "AIAGENT" ? "AI Agent" : jobDetails.type === "LLM" ? "LLM" : jobDetails.type}
                    </Badge>
                    <Badge variant={jobDetails.status === "PUBLISHED" ? "default" : "secondary"}>
                      {jobDetails.status === "PUBLISHED" ? "Published" : jobDetails.status === "DRAFT" ? "Draft" : jobDetails.status}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Compensation & Duration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Compensation & Duration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Salary Range</label>
                      {jobDetails.salary?.min && jobDetails.salary?.max ? (
                        <p className="text-lg font-semibold text-default">
                          {jobDetails.salary.currency} {jobDetails.salary.min.toLocaleString()} - {jobDetails.salary.max.toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">-</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Duration</label>
                      {jobDetails.duration?.value && jobDetails.duration?.unit ? (
                        <p className="text-sm">
                          {jobDetails.duration.value} {jobDetails.duration.unit.toLowerCase()}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">-</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Description</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm leading-relaxed">
                      {jobDetails.description || "No description available."}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Features</h3>
                  {jobDetails.features && jobDetails.features.length > 0 ? (
                    <div className="space-y-2">
                      {jobDetails.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">{feature}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No features specified.</p>
                  )}
                </div>

                <Separator />

                {/* Requirements */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Requirements</h3>
                  {jobDetails.requirements && jobDetails.requirements.length > 0 ? (
                    <div className="space-y-2">
                      {jobDetails.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">{requirement}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No requirements specified.</p>
                  )}
                </div>

                <Separator />

                {/* Categories */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Categories</h3>
                  {jobDetails.categories && jobDetails.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {jobDetails.categories.map((category, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No categories specified.</p>
                  )}
                </div>

                <Separator />

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="font-medium text-muted-foreground">Start Date</label>
                      <p>{jobDetails.startDate ? new Date(jobDetails.startDate).toLocaleDateString() : "-"}</p>
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground">Created</label>
                      <p>{jobDetails.createdAt ? new Date(jobDetails.createdAt).toLocaleDateString() : "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Instructions Markdown */}
            <div className="flex-1 min-w-0 bg-muted/30 rounded-lg p-4 border border-muted-foreground/20 shadow-sm flex flex-col h-full overflow-auto">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-muted-foreground">Product Instructions</h3>
                <p className="text-sm text-muted-foreground">How to use this product or service</p>
              </div>
              <div className="prose prose-sm prose-invert max-w-none text-zinc-100 rounded border border-zinc-800 flex-1 overflow-auto">
                <MarkdownPreview source={jobDetails.instructions || "# No instructions available"} style={{ padding: 16 }} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 