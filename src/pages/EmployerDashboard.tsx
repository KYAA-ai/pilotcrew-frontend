import { JobCardView } from "@/components/JobCardView";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/contexts/ProfileContext';
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {  Loader } from "@/components/SimpleIcons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { EmployerSidebar } from "@/components/employer-sidebar";
import { SiteHeader } from "@/components/employer-header";

function JobsContent() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchJobs = async (page = 1, size = pageSize) => {
    try {
      setLoading(true);
      const response = await api.get(`/v1/jobs?page=${page}&limit=${size}`);
      setJobs(response.data.jobs || []);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
      setTotalJobs(response.data.pagination.totalJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true); // Also set loading to show skeleton
    try {
      const response = await api.get(`/v1/jobs?page=${currentPage}&limit=${pageSize}`);
      setJobs(response.data.jobs || []);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
      setTotalJobs(response.data.pagination.totalJobs);
      toast.success('Jobs refreshed successfully');
    } catch (error) {
      console.error('Error refreshing jobs:', error);
      toast.error('Failed to refresh jobs');
    } finally {
      setRefreshing(false);
      setLoading(false); // Also reset loading
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchJobs(page);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const size = parseInt(newPageSize);
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
    fetchJobs(1, size);
  };

  const handleJobAction = (action: string, job: Record<string, unknown>) => {
    if (action === "view") {
      navigate(`/employer/jobs/${job._id}`, { state: { job } });
    } else {
      toast.info(`Job action: ${action} for ${job.title}`)
      console.log(`Action: ${action}`, job)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header with title and action buttons */}
          <div 
            className="flex items-center justify-between mx-auto"
            style={{ 
              minWidth: "70vw"
            }}
          >
            <h1 className="text-2xl font-bold">Jobs</h1>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <Loader className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Link to="/employer/jobs/new">
                <Button variant="outline" size="sm">
                  Post a Job
                </Button>
              </Link>
            </div>
          </div>

          {/* Job Cards View */}
          <div 
            className="mx-auto"
            style={{ 
              minWidth: "70vw"
            }}
          >
            <JobCardView 
              jobs={jobs} 
              onJobAction={handleJobAction}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              totalJobs={totalJobs}
              onPageChange={handlePageChange}
            />
            {!loading && jobs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No jobs found. Create your first job posting!</p>
              </div>
            )}
            
            {/* Page Size Selector - Bottom */}
            {!loading && jobs.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <span className="text-sm text-muted-foreground">Show:</span>
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
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
      defaultOpen={false}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <EmployerSidebar/>
      <SidebarInset>
        <SiteHeader />
        <JobsContent />
      </SidebarInset>
    </SidebarProvider>
  )
}
