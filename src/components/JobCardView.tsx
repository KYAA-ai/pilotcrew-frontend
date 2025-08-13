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
    <CardContent className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-4">
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
            {/* Mobile skeleton - 2 rows of 3 */}
            <div className="grid grid-cols-3 gap-2 md:hidden">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-18 rounded-full" />
              <Skeleton className="h-6 w-22 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            {/* Desktop skeleton - 1 row */}
            <div className="hidden md:flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-18 rounded-full" />
            </div>
          </div>
        </div>

        {/* Stats Container - Bottom on mobile, right on desktop */}
        <div className="flex justify-center md:justify-end">
          <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
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

    // For mobile: Show first 6 features in 2 rows (3 per row), then "+X more" if there are more
    // For desktop: Show first 4 features in 1 row, then "+X more" if there are more
    const maxVisibleMobile = 6;
    const maxVisibleDesktop = 4;
    const visibleFeaturesMobile = features.slice(0, maxVisibleMobile);
    const visibleFeaturesDesktop = features.slice(0, maxVisibleDesktop);
    const remainingCountMobile = features.length - maxVisibleMobile;
    const remainingCountDesktop = features.length - maxVisibleDesktop;

    return (
      <div className="space-y-2">
        {/* Mobile view - 2 rows of 3 features each */}
        <div className="grid grid-cols-3 gap-2 md:hidden">
          {visibleFeaturesMobile.map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs text-center truncate">
              {feature.length > 12 ? feature.substring(0, 12) + "..." : feature}
            </Badge>
          ))}
          {remainingCountMobile > 0 && (
            <Badge variant="outline" className="text-xs text-center">
              +{remainingCountMobile} more
            </Badge>
          )}
        </div>
        
        {/* Desktop view - 1 row of 4 features */}
        <div className="hidden md:flex items-center gap-2 overflow-hidden w-full">
          {visibleFeaturesDesktop.map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs flex-shrink-0">
              {feature.length > 15 ? feature.substring(0, 15) + "..." : feature}
            </Badge>
          ))}
          {remainingCountDesktop > 0 && (
            <Badge variant="outline" className="text-xs flex-shrink-0">
              +{remainingCountDesktop} more
            </Badge>
          )}
        </div>
      </div>
    );
  };

  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground text-center sm:text-left">
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
              <Card key={job._id} className="w-full transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-lg border-l-4 border-l-muted-foreground/20">
                <CardContent className="p-4 md:p-6">
                  <div 
                    className="flex flex-col md:flex-row gap-4 md:gap-6 cursor-pointer transition-all duration-200 rounded-lg p-2 -m-2 hover:bg-muted/30"
                    onClick={() => handleCardClick(job)}
                  >
                    {/* Main Content - Job Description at Top */}
                    <div className="flex-1 flex flex-col">
                      {/* Header Section */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          {/* Company Name */}
                          <div className="text-sm text-muted-foreground mb-1">
                            {job.companyName}
                          </div>

                          {/* Job Title */}
                          <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                            {job.title}
                          </h3>
                        </div>
                        
                        {/* Status Badge */}
                        <Badge variant={getStatusVariant(job.status)} className="text-xs h-6 flex-shrink-0">
                          {getStatusLabel(job.status)}
                        </Badge>
                      </div>

                      {/* Job Details Grid */}
                      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm font-medium truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm font-medium">{getJobTypeLabel(job.type)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm font-medium">
                            {job.duration ? `${job.duration.value} ${job.duration.unit.toLowerCase()}` : 'Not specified'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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

                                                                                   {/* Stats Container - Progress Radial at Bottom */}
                      <div className="flex justify-center md:justify-end group md:w-[20vw]">
                                                                                                 {/* Mobile view - Horizontal progress bar */}
                          <div className="md:hidden w-full">
                            {/* Header with Completed Tasks */}
                            <div className="flex items-center justify-between w-full mb-2">
                              <div className="text-sm font-medium text-foreground">
                                Completed Tasks
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {job.completedCount || 0}/{job.numExpertsRequired || 0}
                              </div>
                            </div>
                            
                                                         {/* Progress Bar */}
                             <div className="w-full bg-muted rounded-full h-2 mb-2">
                               <div 
                                 className="bg-primary h-2 rounded-full transition-all duration-300"
                                 style={{ width: `${job.completionPercentage}%` }}
                               />
                             </div>
                             
                             {/* Percentage */}
                             <div className="flex justify-end">
                               <div className="text-md font-bold text-foreground">
                                 {Math.round(job.completionPercentage)}%
                               </div>
                             </div>
                         </div>
                       
                       {/* Desktop view - Overlapping hover effect */}
                       <div className="relative md:w-full md:flex md:justify-center md:items-center hidden md:block">
                         {/* Default view - Percentage */}
                         <div className="group-hover:opacity-0 group-hover:scale-x-0 transition-all duration-300 ease-in-out absolute inset-0 flex items-center justify-center">
                           <div className="text-center">
                             <div className="text-2xl md:text-4xl font-bold text-foreground mb-1 md:mb-2">
                               {Math.round(job.completionPercentage)}%
                             </div>
                             <div className="text-xs md:text-sm text-muted-foreground">
                               Complete
                             </div>
                             <div className="text-xs text-muted-foreground mt-1">
                               {job.completedCount || 0}/{job.numExpertsRequired || 0}
                             </div>
                           </div>
                         </div>
                         
                         {/* Hover view - Completion details */}
                         <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex items-center justify-center">
                           <RadialProgress
                             value={job?.completedCount || 0}
                             max={job?.numExpertsRequired || 0}
                             size="md"
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