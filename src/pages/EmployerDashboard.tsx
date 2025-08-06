import { JobCardView } from "@/components/JobCardView";
import { EmployerLayout } from "@/components/layout/EmployerLayout";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/contexts/ProfileContext';
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function JobsContent() {
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

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header Section */}
      <div className="flex items-center justify-between px-8 lg:px-16 pt-6">
        <div>
          <h1 className="text-3xl font-bold">Posted Jobs</h1>
          <p className="text-muted-foreground">
            Manage and monitor your job postings
          </p>
        </div>
        <Link to="/employer/jobs/new">
          <Button variant="outline" size="sm">
            Post a Job
          </Button>
        </Link>
      </div>

      {/* Job Cards View */}
      <div className="px-8 lg:px-16">
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
    <EmployerLayout>
      <JobsContent />
    </EmployerLayout>
  )
}
