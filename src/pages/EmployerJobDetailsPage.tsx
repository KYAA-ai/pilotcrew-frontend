import { SiteHeader } from "@/components/employer-header";
import { EmployerSidebar } from "@/components/employer-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Link, useLocation, useNavigate } from "react-router-dom";

interface EmployerJobDetails {
  _id?: string;
  title: string;
  location: string;
  type: string;
  status?: string;
  description: string;
  features: string[];
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  duration?: {
    value: number;
    unit: string;
  };
  startDate?: string;
  createdAt?: string;
  instructions?: string;
  categories?: string[];
  numExpertsRequired?: number;
}

export default function EmployerJobDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = (location.state as { job?: EmployerJobDetails } | null)?.job;

  if (!job) {
    return (
      <SidebarProvider defaultOpen={false}>
        <EmployerSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="w-full px-8 min-h-screen flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
                <p className="text-muted-foreground mb-4">Job not found or no data passed.</p>
                <Button onClick={() => navigate("/employer/jobs")}>Back to Jobs</Button>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <EmployerSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="m-4 w-full px-8 min-h-screen flex flex-col">
          {/* Breadcrumb and Back Button */}
          <div className="mt-4 mb-8 flex items-center justify-between">
            <nav className="text-sm text-muted-foreground flex gap-2 items-center">
              <Link to="/employer/jobs" className="hover:underline">Jobs</Link>
              <span>/</span>
              <span className="text-foreground font-semibold">{job.title}</span>
            </nav>
            <Button size="lg" onClick={() => navigate("/employer/jobs")}>Back to Jobs</Button>
          </div>

          <div className="flex gap-8 items-start flex-1 min-h-0 h-0">
            {/* Left: Job Metadata */}
            <div className="flex-1 min-w-0 h-full overflow-auto">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="outline">{job.location}</Badge>
                    <Badge variant={job.type === "FULL_TIME" ? "default" : "secondary"}>
                      {job.type === "FULL_TIME" ? "Full Time" : job.type === "PART_TIME" ? "Part Time" : job.type}
                    </Badge>
                    {job.status && (
                      <Badge variant={job.status === "PUBLISHED" ? "default" : "secondary"}>
                        {job.status === "PUBLISHED" ? "Published" : job.status === "DRAFT" ? "Draft" : job.status}
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Compensation & Duration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Compensation & Duration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Salary Range</label>
                      {job.salary?.min && job.salary?.max ? (
                        <p className="text-lg font-semibold text-default">
                          {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">-</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Duration</label>
                      {job.duration?.value && job.duration?.unit ? (
                        <p className="text-sm">
                          {job.duration.value} {job.duration.unit.toLowerCase()}
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
                      {job.description || "No description available."}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Features</h3>
                  {job.features && job.features.length > 0 ? (
                    <div className="space-y-2">
                      {job.features.map((feature, index) => (
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
                  {job.requirements && job.requirements.length > 0 ? (
                    <div className="space-y-2">
                      {job.requirements.map((requirement, index) => (
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
                {job.categories && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Categories</h3>
                    {job.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {job.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No categories specified.</p>
                    )}
                  </div>
                )}

                <Separator />

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="font-medium text-muted-foreground">Start Date</label>
                      <p>{job.startDate ? new Date(job.startDate).toLocaleDateString() : "-"}</p>
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground">Created</label>
                      <p>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "-"}</p>
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground">Number of Experts Required</label>
                      <p>{job.numExpertsRequired ?? "-"}</p>
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
                <MarkdownPreview source={job.instructions || "# No instructions available"} style={{ padding: 16 }} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 