import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadialProgress } from '@/components/ui/radial-progress';
import { Separator } from '@/components/ui/separator';
import { getJobCompletionStats, type JobCompletionStats } from '@/data/jobCompletionStats';
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { useCallback, useState } from 'react';

interface JobCardViewProps {
  jobs: Array<{
    _id: string;
    title: string;
    companyName: string;
    location: string;
    type: string;
    duration?: { value: number; unit: string };
    status: string;
    features?: string[];
  }>;
  onJobAction: (action: string, job: Record<string, unknown>) => void;
}

export function JobCardView({ jobs, onJobAction }: JobCardViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 7;
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  
  // Calculate the jobs to show on current page
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCardClick = useCallback((job: Record<string, unknown>) => {
    onJobAction('view', job);
  }, [onJobAction]);

  // Get job completion stats from data frame
  const getJobStats = useCallback((jobId: string): JobCompletionStats => {
    return getJobCompletionStats(jobId);
  }, []);

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'FULL_TIME':
        return 'Full Time';
      case 'PART_TIME':
        return 'Part Time';
      case 'CONTRACT':
        return 'Contract';
      case 'INTERNSHIP':
        return 'Internship';
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Published';
      case 'DRAFT':
        return 'Draft';
      case 'CLOSED':
        return 'Closed';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'default';
      case 'DRAFT':
        return 'secondary';
      case 'CLOSED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const renderFeatures = (features: string[] | undefined) => {
    if (!features || features.length === 0) {
      return <span className="text-sm text-muted-foreground">No features specified</span>;
    }

    // Show first 4 features, then "+X more" if there are more
    const maxVisible = 4;
    const visibleFeatures = features.slice(0, maxVisible);
    const remainingCount = features.length - maxVisible;

    return (
      <div className="flex items-center gap-2 overflow-hidden w-full">
        {visibleFeatures.map((feature, index) => (
          <Badge key={index} variant="outline" className="text-xs flex-shrink-0">
            {feature.length > 15 ? feature.substring(0, 15) + "..." : feature}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Badge variant="outline" className="text-xs flex-shrink-0">
            +{remainingCount} more
          </Badge>
        )}
      </div>
    );
  };

  const PaginationControls = () => (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {startIndex + 1} to {Math.min(endIndex, jobs.length)} of {jobs.length} jobs
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Top Pagination */}
      <PaginationControls />
      
      {/* Job Cards */}
      {currentJobs.map((job) => {
        const stats = getJobStats(job._id);
        return (
          <Card key={job._id} className="w-full">
            <CardContent className="px-6 py-4">
              <div 
                className="flex gap-6 cursor-pointer transition-all duration-200 hover:bg-muted/50 rounded-lg p-2 -m-2"
                onClick={() => handleCardClick(job)}
              >
                {/* Main Content - 70% width */}
                <div className="w-[70%] flex flex-col px-2">
                  {/* Company Name */}
                  <div className="text-sm text-muted-foreground mb-2">
                    Company: {job.companyName}
                  </div>

                  {/* Job Title */}
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {job.title}
                  </h3>

                  {/* 2x2 Grid for job details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{getJobTypeLabel(job.type)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {job.duration ? `${job.duration.value} ${job.duration.unit.toLowerCase()}` : 'Not specified'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <Badge variant={getStatusVariant(job.status)} className="text-xs">
                        {getStatusLabel(job.status)}
                      </Badge>
                    </div>
                  </div>

                  {/* Separator */}
                  <Separator className="my-4" />

                  {/* Features */}
                  <div className="text-sm font-medium text-foreground mb-2">
                    Features:
                  </div>
                  {renderFeatures(job.features)}
                </div>

                {/* Stats Container - 30% width */}
                <div className="w-[30%] flex flex-col items-center justify-center">
                  <RadialProgress
                    value={stats.completed}
                    max={stats.total}
                    size="lg"
                    label="jobs completed"
                    className="mb-2"
                    strokeWidth={6}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {/* Bottom Pagination */}
      <PaginationControls />
    </div>
  );
} 