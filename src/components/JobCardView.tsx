import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, CheckCircle, Clock, MapPin } from 'lucide-react';

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

    // Show first 3 features, then "+X more" if there are more
    const maxVisible = 3;
    const visibleFeatures = features.slice(0, maxVisible);
    const remainingCount = features.length - maxVisible;

    return (
      <div className="flex items-center gap-2 overflow-hidden">
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

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job._id} className="w-full">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {/* Main Content - 70% width */}
              <div className="flex-1">
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
                <div className="mb-4">
                  <div className="text-sm font-medium text-foreground mb-2">
                    Features:
                  </div>
                  {renderFeatures(job.features)}
                </div>
              </div>

              {/* Actions Container - 30% width */}
              <div className="w-[30%] flex flex-col items-end justify-start">
                <div className="text-sm font-medium text-foreground mb-3">
                  Actions
                </div>
                <Button 
                  onClick={() => onJobAction('view', job)}
                  className="w-full"
                >
                  Apply now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 