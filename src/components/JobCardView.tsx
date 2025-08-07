import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadialProgress } from '@/components/ui/radial-progress';
import { Skeleton } from '@/components/ui/skeleton';

import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { useCallback, useState } from 'react';

// Skeleton component for job cards
const JobCardSkeleton = () => (
  <Card className="w-full">
    <CardContent className="px-6 py-4">
      <div className="flex gap-6">
        {/* Main Content - 70% width */}
        <div className="w-[70%] flex flex-col px-2 space-y-4">
          {/* Company Name Skeleton */}
          <Skeleton className="h-4 w-32" />
          
          {/* Job Title Skeleton */}
          <Skeleton className="h-6 w-3/4" />
          
          {/* 2x2 Grid for job details skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          
          {/* Separator */}
          <div className="h-px bg-border"></div>
          
          {/* Features Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>

        {/* Stats Container - 30% width */}
        <div className="w-[30%] flex flex-col items-center justify-center">
          <Skeleton className="w-20 h-20 rounded-full" />
        </div>
      </div>
    </CardContent>
  </Card>
);

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
    completedCount?: number;
    inProgressCount?: number;
    numExpertsRequired?: number;
    completionPercentage: number;
  }>;
  onJobAction: (action: string, job: Record<string, unknown>) => void;
  hidePagination?: boolean;
  loading?: boolean;
  // External pagination props
  currentPage?: number;
  totalPages?: number;
  totalJobs?: number;
  onPageChange?: (page: number) => void;
}

export function JobCardView({ 
  jobs, 
  onJobAction, 
  loading = false,
  currentPage: externalCurrentPage,
  totalPages: externalTotalPages,
  totalJobs: externalTotalJobs,
  onPageChange: externalOnPageChange
}: JobCardViewProps) {
  // Use external pagination if provided, otherwise use internal
  const useExternalPagination = externalCurrentPage !== undefined && externalOnPageChange !== undefined;
  
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const jobsPerPage = 7;
  const internalTotalPages = Math.ceil(jobs.length / jobsPerPage);
  
  // Use external or internal pagination values
  const currentPage = useExternalPagination ? externalCurrentPage! : internalCurrentPage;
  const totalPages = useExternalPagination ? externalTotalPages! : internalTotalPages;
  
  // Calculate the jobs to show on current page
  const startIndex = useExternalPagination ? 0 : (currentPage - 1) * jobsPerPage;
  const endIndex = useExternalPagination ? jobs.length : startIndex + jobsPerPage;
  const currentJobs = useExternalPagination ? jobs : jobs.slice(startIndex, endIndex);

  const handlePageChange = useCallback((newPage: number) => {
    if (useExternalPagination) {
      externalOnPageChange!(newPage);
    } else {
      setInternalCurrentPage(newPage);
    }
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [useExternalPagination, externalOnPageChange]);

  const handleCardClick = useCallback((job: Record<string, unknown>) => {
    onJobAction('view', job);
  }, [onJobAction]);



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
        {useExternalPagination 
          ? `Showing ${jobs.length} of ${externalTotalJobs || jobs.length} jobs`
          : `Showing ${startIndex + 1} to ${Math.min(endIndex, jobs.length)} of ${jobs.length} jobs`
        }
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
      {/* Job Cards */}
      {loading ? (
        // Show skeleton loading
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        // Show actual job cards
        <>
          {currentJobs.map((job) => {
            return (
              <Card key={job._id} className="w-full transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg border-l-4 border-l-muted-foreground/20">
                <CardContent className="px-6 py-6">
                  <div 
                    className="flex gap-6 cursor-pointer transition-all duration-200 rounded-lg p-2 -m-2 hover:bg-muted/30"
                    onClick={() => handleCardClick(job)}
                  >
                    {/* Main Content - 70% width */}
                    <div className="w-[70%] flex flex-col px-2">
                      {/* Header Section */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          {/* Company Name */}
                          <div className="text-sm text-muted-foreground mb-1">
                            {job.companyName}
                          </div>

                          {/* Job Title */}
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {job.title}
                          </h3>
                        </div>
                        
                        {/* Status Badge */}
                        <Badge variant={getStatusVariant(job.status)} className="text-xs h-6">
                          {getStatusLabel(job.status)}
                        </Badge>
                      </div>

                      {/* Job Details Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{getJobTypeLabel(job.type)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {job.duration ? `${job.duration.value} ${job.duration.unit.toLowerCase()}` : 'Not specified'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {job.numExpertsRequired || 0} experts required
                          </span>
                        </div>
                      </div>

                      {/* Separator */}
                      <div className="h-px bg-border mb-4"></div>

                      {/* Features Section */}
                      <div className="text-sm font-medium text-foreground mb-2">
                        Key Features:
                      </div>
                      {renderFeatures(job.features)}
                    </div>

                    {/* Stats Container - 30% width */}
                    <div className="w-[30%] flex flex-col items-center justify-center group">
                      <div className="relative">
                        {/* Default view - Percentage */}
                        <div className="group-hover:opacity-0 group-hover:scale-x-0 transition-all duration-300 ease-in-out">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-foreground mb-2">
                              {Math.round(job.completionPercentage)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Complete
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {job.completedCount || 0}/{job.numExpertsRequired || 0}
                            </div>
                          </div>
                        </div>
                        
                        {/* Hover view - Completion details */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-x-100 scale-x-0 transition-all duration-300 ease-in-out flex items-center justify-center">
                          <RadialProgress
                            value={job?.completedCount || 0}
                            max={job?.numExpertsRequired || 0}
                            size="lg"
                            label="Experts completed tasks"
                            className="mb-2"
                            strokeWidth={6}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {/* Bottom Pagination */}
          <PaginationControls />
        </>
      )}
    </div>
  );
} 