import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Database, FileText, Settings, Target } from "lucide-react";

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
  config
}: ConfigurationSummaryProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuration Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {/* Current Configuration Details */}
        {(config.dataset || config.tasks?.length || config.models?.length || config.parameters || config.metrics) ? (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Current Configuration</h4>
            
            {/* Dataset */}
            {config.dataset && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium text-sm">Dataset</h4>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="font-medium">{config.dataset.name}</div>
                  <div className="text-xs text-gray-500">
                    Columns: {config.dataset.columns.join(", ")}
                  </div>
                  {config.dataset.outputColumn && (
                    <div className="text-xs text-gray-500">
                      Output: {config.dataset.outputColumn}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tasks */}
            {config.tasks && config.tasks.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <h4 className="font-medium text-sm">Tasks</h4>
                </div>
                <div className="flex flex-wrap gap-1">
                  {config.tasks.map((task, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {task}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Models */}
            {config.models && config.models.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-purple-600" />
                  <h4 className="font-medium text-sm">Models</h4>
                </div>
                <div className="space-y-1">
                  {config.models.map((model, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {model.name} ({model.provider})
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Parameters */}
            {config.parameters && Object.keys(config.parameters).length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-orange-600" />
                  <h4 className="font-medium text-sm">Parameters</h4>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  {Object.entries(config.parameters).map(([modelName, params]) => (
                    <div key={modelName} className="border-l-2 border-orange-200 pl-2">
                      <div className="font-medium text-xs text-gray-700">{modelName}</div>
                      <div className="text-xs text-gray-500">
                        Temp: {params.temperature} | Top P: {params.topP} | Top K: {params.topK}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metrics */}
            {config.metrics && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-600" />
                  <h4 className="font-medium text-sm">Metrics</h4>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {config.metrics.passAtK && (
                    <div>Pass@{config.metrics.passAtK}</div>
                  )}
                  {config.metrics.textMetrics && config.metrics.textMetrics.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {config.metrics.textMetrics.map((metric, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">No configuration set yet</p>
            <p className="text-xs mt-1">Complete the steps to see your configuration</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
