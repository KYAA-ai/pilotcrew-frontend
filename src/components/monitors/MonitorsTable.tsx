import { GenericDataTable } from "@/components/generic-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import api from "@/lib/api";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Filter, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

export function MonitorsTable() {
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleMonitorAction = (action: string, row: Record<string, unknown>) => {
    if (action === "view") {
      const url = `/autoeval/monitors/${row.id}`;
      navigate(url);
    } else {
      toast.info(`Monitor action: ${action} for ${row.id}`);
      console.log(`Action: ${action}`, row);
    }
  };

  // Fetch total count when status filter changes
  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const params: Record<string, string> = {};
        if (statusFilter && statusFilter !== "all") {
          params.status = statusFilter;
        }
        const response = await api.get('/v1/autoeval/monitors', { params });
        setTotalCount(response.data.totalCount || 0);
      } catch (error) {
        console.error('Error fetching total count:', error);
      }
    };
    fetchTotalCount();
  }, [statusFilter]);

  const monitorColumns: ColumnDef<Record<string, unknown>>[] = [
    {
      accessorKey: "id",
      header: "Workflow ID",
      size: 140,
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-xs">
          {String(row.getValue("id"))}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date Created",
      size: 160,
      cell: ({ row }) => {
        const dateString = row.getValue("createdAt") as string;
        if (!dateString) return <span className="text-muted-foreground">-</span>;
        
        return (
          <div className="text-sm">
            {new Date(dateString).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "models",
      header: "Models",
      size: 200,
      cell: ({ row }) => {
        const models = row.getValue("models") as ModelDef[];
        if (Array.isArray(models) && models.length > 0) {
          const modelNames = models.map(model => model.name || model.id).join(", ");
          return (
            <div className="text-sm text-muted-foreground truncate max-w-[180px]">
              {modelNames.length > 40 ? modelNames.substring(0, 40) + "..." : modelNames}
            </div>
          );
        }
        return <span className="text-muted-foreground">-</span>;
      },
    },
    {
      accessorKey: "datasetId",
      header: "Dataset ID",
      size: 150,
      cell: ({ row }) => {
        const datasetId = row.getValue("datasetId") as string;
        if (datasetId) {
          return (
            <Badge 
              variant="outline" 
              className="font-mono text-xs bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 transition-all duration-200 max-w-[130px] truncate"
            >
              {datasetId}
            </Badge>
          );
        }
        return <span className="text-muted-foreground">-</span>;
      },
    },
    {
      accessorKey: "generationOpts",
      header: "Configuration",
      size: 250,
      cell: ({ row }) => {
        const generationOpts = row.getValue("generationOpts") as GenerationOpts;
        if (generationOpts) {
          // Extract key information for summary
          const dataset = generationOpts.dataset;
          const models = generationOpts.models;
          const tasks = generationOpts.tasks;
          const metrics = generationOpts.metrics;
          
          const summary = [
            dataset?.name && `Dataset: ${dataset.name}`,
            models?.length && `${models.length} model${models.length > 1 ? 's' : ''}`,
            tasks?.length && `${tasks.length} task${tasks.length > 1 ? 's' : ''}`,
            metrics?.passAtK && `Pass@${metrics.passAtK}`
          ].filter(Boolean).join(' • ');

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {summary || "Configuration available"}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 flex-shrink-0"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-2xl p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2 shadow-lg">
                  <div className="space-y-3">
                    <div className="font-semibold text-sm border-b pb-2">
                      Workflow Configuration
                    </div>
                    
                    {/* Dataset Info */}
                    {dataset && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground">Dataset</div>
                        <div className="text-xs space-y-1 bg-white/70 dark:bg-slate-800/70 p-2 rounded backdrop-blur-sm">
                          <div><span className="font-medium">Name:</span> {dataset.name}</div>
                          <div><span className="font-medium">ID:</span> <code className="text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">{dataset.datasetId}</code></div>
                          <div><span className="font-medium">Input:</span> {dataset.inputColumn}</div>
                          <div><span className="font-medium">Output:</span> {dataset.outputColumn}</div>
                        </div>
                      </div>
                    )}

                    {/* Models Info */}
                    {models && models.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground">Models ({models.length})</div>
                        <div className="text-xs space-y-1 bg-white/70 dark:bg-slate-800/70 p-2 rounded backdrop-blur-sm">
                          {models.map((model, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span>{model.name}</span>
                              <span className="text-muted-foreground">({model.provider})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tasks Info */}
                    {tasks && tasks.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground">Tasks ({tasks.length})</div>
                        <div className="text-xs space-y-1 bg-white/70 dark:bg-slate-800/70 p-2 rounded backdrop-blur-sm">
                          {tasks.map((task, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span>{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metrics Info */}
                    {metrics && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground">Metrics</div>
                        <div className="text-xs space-y-1 bg-white/70 dark:bg-slate-800/70 p-2 rounded backdrop-blur-sm">
                          <div><span className="font-medium">Pass@K:</span> {metrics.passAtK}</div>
                          {metrics.textMetrics && (
                            <div><span className="font-medium">Text Metrics:</span> {metrics.textMetrics.join(', ')}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Parameters Info */}
                    {generationOpts.parameters && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground">Parameters</div>
                        <div className="text-xs">
                          <pre className="whitespace-pre-wrap overflow-auto max-h-32 bg-slate-200 dark:bg-slate-700 p-2 rounded text-xs border">
                            {JSON.stringify(generationOpts.parameters, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }
        return <span className="text-muted-foreground">-</span>;
      },
    },
    {
      accessorKey: "status",
      size: 120,
      header: () => (
        <div className="flex items-center gap-2">
          <span>Status</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted/50"
              >
                <Filter className="h-3 w-3 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-32 p-1">
              <div className="space-y-1">
                {["all", "queued", "running", "completed", "failed"].map((status) => (
                  <Button
                    key={status}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-xs ${
                      statusFilter === status
                        ? "bg-muted font-medium"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ),
      cell: ({ row }) => {
        const status = String(row.getValue("status"));
        let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
        let customClass = "";
        
        if (status === "running") {
          variant = "default";
        } else if (status === "completed") {
          variant = "secondary";
        } else if (status === "failed") {
          variant = "destructive";
        } else if (status === "queued") {
          variant = "outline";
          customClass = "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800";
        }
        
        return (
          <Badge variant={variant} className={`text-xs ${customClass}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      size: 100,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const url = `/autoeval/monitors/${row.original.id}`;
              console.log('View Details navigating to:', url);
              navigate(url);
            }}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-8 w-full overflow-hidden">
      {/* <div className="flex items-center gap-3 px-8 lg:px-16">
        <div className="bg-blue-900/20 rounded-lg">
          <Monitor className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Running Monitors</h1>
          <p className="text-muted-foreground">
            Track your active evaluation workflows and their progress
          </p>
        </div>
      </div> */}

      {/* Filter Indicator Container */}
      {statusFilter !== "all" && (
        <div className="flex justify-end pr-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md border">
            <Filter className="h-4 w-4" />
            <span>Filtered by status:</span>
            <Badge variant="secondary" className="text-xs">
              {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter("all")}
              className="h-6 px-2 text-xs hover:bg-muted/50"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      <GenericDataTable
        endpoint="/v1/autoeval/monitors"
        dataKey="evaluations"
        title="Running Monitors"
        enableSelection={true}
        customColumns={monitorColumns}
        onRowAction={handleMonitorAction}
        actions={[
          { label: "View", value: "view" },
        ]}
        serverSidePagination={true}
        totalCount={totalCount}
        externalFilters={statusFilter !== "all" ? { status: statusFilter } : undefined}
      />
    </div>
  );
}
