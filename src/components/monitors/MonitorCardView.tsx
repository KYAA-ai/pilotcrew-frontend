import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

import { BarChart3, ChevronLeft, ChevronRight, Clock, Settings, X } from 'lucide-react';
import { useCallback, useState } from 'react';

// Configuration Modal Component
const ConfigurationModal = ({ generationOpts }: { generationOpts: GenerationOpts }) => {
  if (!generationOpts) {
    return (
      <div className="p-6 text-center text-slate-400">
        <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
          No configuration data available
        </div>
      </div>
    );
  }

  const { dataset, models, tasks, metrics, parameters } = generationOpts;

  return (
    <div className="space-y-4 max-h-[70vh] overflow-auto">
      {/* Dataset Info */}
      {dataset && (
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <Settings className="h-4 w-4 text-blue-300" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm">Dataset Configuration</h4>
              <p className="text-xs text-slate-400">Data source and column mapping</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-600/30 rounded border border-slate-500/30">
              <span className="text-sm text-slate-300">Name:</span>
              <span className="text-sm text-slate-100 font-medium">{dataset.name}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-600/30 rounded border border-slate-500/30">
              <span className="text-sm text-slate-300">Dataset ID:</span>
              <code className="text-xs bg-slate-800 text-blue-300 px-2 py-1 rounded border border-slate-600">{dataset.datasetId}</code>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-600/30 rounded border border-slate-500/30">
              <span className="text-sm text-slate-300">Input Column:</span>
              <span className="text-sm text-slate-100 font-medium">{dataset.inputColumn}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-600/30 rounded border border-slate-500/30">
              <span className="text-sm text-slate-300">Output Column:</span>
              <span className="text-sm text-slate-100 font-medium">{dataset.outputColumn}</span>
            </div>
          </div>
        </div>
      )}

      {/* Models Info */}
      {models && models.length > 0 && (
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <Settings className="h-4 w-4 text-purple-300" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm">Models ({models.length})</h4>
              <p className="text-xs text-slate-400">Selected AI models for evaluation</p>
            </div>
          </div>
          <div className="space-y-2">
            {models.map((model, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-600/30 rounded border border-slate-500/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm text-slate-200 font-medium">{model.name}</span>
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs">
                  {model.provider}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks Info */}
      {tasks && tasks.length > 0 && (
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
              <Settings className="h-4 w-4 text-green-300" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm">Tasks ({tasks.length})</h4>
              <p className="text-xs text-slate-400">Evaluation task types</p>
            </div>
          </div>
          <div className="space-y-2">
            {tasks.map((task, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-600/30 rounded border border-slate-500/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-slate-200 font-medium">{task}</span>
                </div>
                <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 text-xs">
                  Task
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Info */}
      {metrics && (
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
              <BarChart3 className="h-4 w-4 text-orange-300" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm">Metrics Configuration</h4>
              <p className="text-xs text-slate-400">Evaluation metrics and thresholds</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-600/30 rounded border border-slate-500/30">
              <span className="text-sm text-slate-300">Pass@K:</span>
              <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs">
                {metrics.passAtK}
              </Badge>
            </div>
            {metrics.textMetrics && (
              <div className="p-2 bg-slate-600/30 rounded border border-slate-500/30">
                <span className="text-sm text-slate-300 block mb-2">Text Metrics:</span>
                <div className="flex flex-wrap gap-1">
                  {metrics.textMetrics.map((metric, idx) => (
                    <Badge key={idx} className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs">
                      {metric}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Parameters Info */}
      {parameters && (
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
              <Settings className="h-4 w-4 text-cyan-300" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm">Parameters</h4>
              <p className="text-xs text-slate-400">Model-specific configuration</p>
            </div>
          </div>
          <div className="p-3 bg-slate-600/30 rounded border border-slate-500/30">
            <pre className="text-xs overflow-auto max-h-32 text-slate-300 whitespace-pre-wrap">
              {JSON.stringify(parameters, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

// Skeleton component for monitor cards
const MonitorCardSkeleton = () => (
  <Card className="w-full">
    <CardContent className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Workflow ID Skeleton */}
          <Skeleton className="h-4 w-32" />
          
          {/* Status Skeleton */}
          <Skeleton className="h-6 w-24" />
          
          {/* 2x2 Grid for workflow details skeleton */}
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
          
          {/* Configuration Summary Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        
        {/* Action Button - Desktop */}
        <div className="hidden md:flex md:flex-col md:justify-center md:items-center md:min-w-[120px]">
          <Skeleton className="h-10 w-20" />
        </div>
        
        {/* Action Button - Mobile */}
        <div className="flex md:hidden justify-end">
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </CardContent>
  </Card>
);

interface ModelDef {
  id: string;
  name: string;
  provider: string;
}

interface DatasetConfig {
  name: string;
  datasetId: string;
  inputColumn: string;
  outputColumn: string;
}

interface MetricsConfig {
  passAtK: string;
  textMetrics: string[];
}

interface GenerationOpts {
  dataset: DatasetConfig;
  models: ModelDef[];
  tasks: string[];
  metrics: MetricsConfig;
  parameters: Record<string, unknown>;
}

interface MonitorCardViewProps {
  monitors: Record<string, unknown>[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalMonitors?: number;
  onPageChange?: (page: number) => void;
}

export function MonitorCardView({ 
  monitors, 
  loading = false,
  currentPage: externalCurrentPage,
  totalPages: externalTotalPages,
  totalMonitors: externalTotalMonitors,
  onPageChange: externalOnPageChange
}: MonitorCardViewProps) {
  
  const useExternalPagination = externalCurrentPage !== undefined && externalOnPageChange !== undefined;
  
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const monitorsPerPage = 7;
  const internalTotalPages = Math.ceil(monitors.length / monitorsPerPage);
  
  // Use external or internal pagination values
  const currentPage = useExternalPagination ? externalCurrentPage! : internalCurrentPage;
  const totalPages = useExternalPagination ? externalTotalPages! : internalTotalPages;
  
  // Calculate the monitors to show on current page
  const startIndex = useExternalPagination ? 0 : (currentPage - 1) * monitorsPerPage;
  const endIndex = useExternalPagination ? monitors.length : startIndex + monitorsPerPage;
  const currentMonitors = useExternalPagination ? monitors : monitors.slice(startIndex, endIndex);

  const handlePageChange = useCallback((newPage: number) => {
    if (useExternalPagination) {
      externalOnPageChange!(newPage);
    } else {
      setInternalCurrentPage(newPage);
    }
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [useExternalPagination, externalOnPageChange]);



  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'running':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'queued':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    
    if (statusLower === 'queued') {
      return (
        <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800 text-xs">
          {label}
        </Badge>
      );
    } else {
      return (
        <Badge variant={getStatusVariant(statusLower)} className="text-xs">
          {label}
        </Badge>
      );
    }
  };



  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleProgressClick = (monitor: Record<string, unknown>) => {
    const url = `/autoeval/monitors/${monitor.id}`;
    window.location.href = url;
  };

  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground text-center sm:text-left">
        {useExternalPagination 
          ? `Showing ${monitors.length} of ${externalTotalMonitors || monitors.length} monitors`
          : `Showing ${startIndex + 1} to ${Math.min(endIndex, monitors.length)} of ${monitors.length} monitors`
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
      {/* Monitor Cards */}
      {loading ? (
        // Show skeleton loading
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <MonitorCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        // Show actual monitor cards
        <>
          {currentMonitors.map((monitor) => {
            const generationOpts = monitor.generationOpts as GenerationOpts;
            const models = generationOpts?.models as ModelDef[];
            
            return (
                             <Card key={String(monitor.id)} className="w-full transition-all duration-300 ease-out hover:shadow-lg border">
                <CardContent className="px-4 py-2">
                  {/* 1. Top section: Workflow ID and Dataset ID with horizontal ruler */}
                  <div className="mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                      <div className="text-sm">
                        <span className="font-medium">Workflow ID:</span>{' '}
                        <code className="bg-muted px-2 py-1 rounded text-xs break-all whitespace-normal">{String(monitor.id)}</code>
                      </div>
                                             <div className="text-sm flex items-start gap-2">
                         <span className="font-medium whitespace-nowrap">Dataset ID:</span>
                         <Badge className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 transition-all duration-200 font-mono text-xs break-all whitespace-normal flex-1 min-w-0">
                           {generationOpts?.dataset?.datasetId || String(monitor.datasetId) || 'N/A'}
                         </Badge>
                       </div>
                    </div>
                    <hr className="border-border" />
                  </div>

                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left side content */}
                    <div className="flex-1 space-y-4">
                      {/* 2. Models section */}
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Models:</div>
                                                 <div className="flex flex-wrap gap-2">
                           {models && models.length > 0 ? (
                             models.map((model, idx) => (
                               <Badge key={idx} variant="outline" className="text-xs break-words whitespace-normal max-w-full">
                                 {model.name} ({model.provider})
                               </Badge>
                             ))
                           ) : (
                             <span className="text-sm text-muted-foreground">No models configured</span>
                           )}
                         </div>
                      </div>

                                             {/* 3. Task section */}
                       <div>
                         <div className="text-sm">
                           <span className="font-medium">Task:</span>{' '}
                           {generationOpts?.tasks && generationOpts.tasks.length > 0 ? (
                             <div className="flex flex-wrap gap-1 mt-1">
                               {generationOpts.tasks.map((task, idx) => (
                                 <Badge key={idx} className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs break-words whitespace-normal max-w-full">
                                   {task}
                                 </Badge>
                               ))}
                             </div>
                           ) : (
                             <span className="text-muted-foreground">Not specified</span>
                           )}
                         </div>
                       </div>

                      {/* 4. Date created */}
                      <div>
                        <div className="text-sm">
                          <span className="font-medium">Date Created:</span>{' '}
                          {formatDate(String(monitor.createdAt))}
                        </div>
                      </div>
                    </div>

                    {/* Right side content */}
                    <div className="lg:w-48 space-y-4">
                                             {/* 5. Status section */}
                       <div>
                         <div className="text-sm font-medium text-muted-foreground mb-2">Status:</div>
                         {getStatusBadge(String(monitor.status))}
                       </div>

                      {/* 6. View section with buttons */}
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">View:</div>
                        <div className="space-y-2">
                          {/* Progress button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProgressClick(monitor);
                            }}
                            className="w-full flex items-center gap-2"
                          >
                            <BarChart3 className="h-4 w-4" />
                            Progress
                          </Button>

                          {/* Config button */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full flex items-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Settings className="h-4 w-4" />
                                Config
                              </Button>
                            </DialogTrigger>
                                                         <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl w-full max-h-[90vh] p-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50" showCloseButton={false}>
                              <div className="p-4 pb-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1"></div>
                                  <div className="flex items-center gap-3 text-slate-100">
                                    <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                                      <Settings className="h-5 w-5 text-emerald-300" />
                                    </div>
                                    <div>
                                      <div className="text-lg font-semibold">Workflow Configuration</div>
                                      <div className="text-xs text-slate-400 font-normal">Detailed settings & parameters</div>
                                    </div>
                                  </div>
                                  <div className="flex-1 flex justify-end">
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all duration-200"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                  </div>
                                </div>
                              </div>
                              <div className="overflow-y-auto px-4 pb-4">
                                <ConfigurationModal generationOpts={generationOpts} />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationControls />
          )}
        </>
      )}
      
      {/* Empty State */}
      {!loading && monitors.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No monitors found</h3>
            <p className="text-muted-foreground">
              No workflow monitors match the current filters. Try adjusting your search criteria or create a new evaluation workflow.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
