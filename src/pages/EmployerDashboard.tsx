import { SiteHeader } from "@/components/employer-header";
import { EmployerSidebar } from "@/components/employer-sidebar";
import { JobCardView } from "@/components/JobCardView";
import { Button } from "@/components/ui/button";
import {
    SidebarInset,
    SidebarProvider,
    useSidebar,
} from "@/components/ui/sidebar";
import { useProfile } from '@/contexts/ProfileContext';
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function JobsContent() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/jobs');
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleJobAction = (action: string, job: Record<string, unknown>) => {
    if (action === "view") {
      navigate(`/employer/jobs/${job._id}`, { state: { job } });
    } else {
      toast.info(`Job action: ${action} for ${job.title}`)
      console.log(`Action: ${action}`, job)
    }
  }

  // Calculate the minimum width based on viewport width
  const minWidth = "70vw"; // 70% of viewport width

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header with title and action button */}
          <div 
            className={`flex items-center justify-between transition-all duration-200 ease-linear ${
              state === "expanded" ? "px-6" : "mx-auto"
            }`}
            style={{ 
              minWidth: state === "expanded" ? "auto" : minWidth
            }}
          >
            <h1 className="text-2xl font-bold">Jobs</h1>
            <Link to="/employer/jobs/new">
              <Button variant="outline" size="sm">
                Post a Job
              </Button>
            </Link>
          </div>

          {/* Job Cards View */}
          <div 
            className={`transition-all duration-200 ease-linear ${
              state === "expanded" ? "px-6" : "mx-auto"
            }`}
            style={{ 
              minWidth: state === "expanded" ? "auto" : minWidth
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2 text-sm text-muted-foreground">Loading jobs...</span>
              </div>
            ) : jobs.length > 0 ? (
              <JobCardView 
                jobs={jobs} 
                onJobAction={handleJobAction}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No jobs found. Create your first job posting!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmployerDashboard() {
  const { profile } = useProfile();

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

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <EmployerSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <JobsContent />
      </SidebarInset>
    </SidebarProvider>
  )
}
