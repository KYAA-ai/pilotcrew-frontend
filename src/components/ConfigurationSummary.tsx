import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Bot, Database, Settings } from "lucide-react";

interface ConfigurationSummaryProps {
  config: {
    dataset?: {
      name: string;
      columns: string[];
      outputColumn?: string;
    };
    tasks?: string[];
    models?: Array<{
      id?: string;
      name: string;
      provider: string;
      pricing: string;
      logo?: string;
    }>;
    parameters?: Record<string, {
      temperature: number;
      topP: number;
      topK: number;
    }>;
    metrics?: {
      passAtK?: string;
      textMetrics: string[];
    };
  };
  currentStep?: number;
  isCompact?: boolean;
}

export default function ConfigurationSummary({ 
  config, 
  currentStep = 6, 
  isCompact = false 
}: ConfigurationSummaryProps) {
  return (
    <div className={`space-y-4 ${isCompact ? 'text-sm' : ''}`}>
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5" />
        <h3 className={`font-medium ${isCompact ? 'text-base' : 'text-lg'}`}>
          Configuration Summary {currentStep < 6 ? `(Step ${currentStep}/6)` : ''}
        </h3>
      </div>
      
      <div className="space-y-4">
        {/* Dataset Section */}
        {config.dataset && currentStep >= 1 && (
          <Card className={isCompact ? 'p-2' : ''}>
            <CardHeader className={isCompact ? 'pb-2' : 'pb-3'}>
              <CardTitle className={`flex items-center gap-2 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                <Database className={isCompact ? 'h-3 w-3' : 'h-4 w-4'} />
                Dataset
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Name:</span>
                  <span className="text-sm ml-2">{config.dataset.name}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Columns:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {config.dataset.columns.map((column, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {column}
                      </Badge>
                    ))}
                  </div>
                </div>
                {config.dataset.outputColumn && (
                  <div>
                    <span className="text-sm font-medium">Output Column:</span>
                    <span className="text-sm ml-2">{config.dataset.outputColumn}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks Section */}
        {config.tasks && config.tasks.length > 0 && currentStep >= 2 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1">
                {config.tasks.map((task, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {task}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Models Section */}
        {config.models && config.models.length > 0 && currentStep >= 3 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Models ({config.models.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {config.models.map((model, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{model.logo || "🤖"}</span>
                      <div>
                        <div className="text-sm font-medium">{model.name}</div>
                        <div className="text-xs text-gray-600">{model.provider}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">{model.pricing}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Parameters Section */}
        {config.parameters && Object.keys(config.parameters).length > 0 && currentStep >= 4 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {Object.entries(config.parameters).map(([modelName, params]) => (
                  <div key={modelName} className="p-2 bg-gray-50 rounded">
                    <div className="text-sm font-medium mb-1">{modelName}</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Temp:</span>
                        <span className="ml-1">{params.temperature}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Top-P:</span>
                        <span className="ml-1">{params.topP}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Top-K:</span>
                        <span className="ml-1">{params.topK}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metrics Section */}
        {config.metrics && currentStep >= 5 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {config.metrics.passAtK && (
                  <div>
                    <span className="text-sm font-medium">Pass@K:</span>
                    <span className="text-sm ml-2">{config.metrics.passAtK}</span>
                  </div>
                )}
                {config.metrics.textMetrics && config.metrics.textMetrics.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Text Metrics:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {config.metrics.textMetrics.map((metric, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
