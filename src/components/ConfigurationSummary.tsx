import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Bot,
    CheckCircle,
    Clock,
    Database,
    FileText,
    Settings,
    Target
} from "lucide-react";

interface ConfigurationData {
  dataset?: {
    name: string;
    columns: string[];
    outputColumn?: string;
  };
  tasks?: string[];
  models?: Array<{
    name: string;
    provider: string;
    pricing: string;
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
}

interface ConfigurationSummaryProps {
  config: ConfigurationData;
  currentStep: number;
  isCompact?: boolean;
}

export default function ConfigurationSummary({ 
  config, 
  currentStep, 
  isCompact = false 
}: ConfigurationSummaryProps) {
  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return Database;
      case 2: return FileText;
      case 3: return Bot;
      case 4: return Settings;
      case 5: return Target;
      default: return Clock;
    }
  };

  const getStepName = (step: number) => {
    switch (step) {
      case 1: return "Upload Dataset";
      case 2: return "Task Type Selection";
      case 3: return "Model Selection";
      case 4: return "Parameter Configuration";
      case 5: return "Metrics Selection";
      default: return "Review & Launch";
    }
  };

  const renderDatasetSection = () => {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-sm">Dataset</h4>
        </div>
        {config.dataset && (
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
        )}
      </div>
    );
  };

  const renderTasksSection = () => {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-green-600" />
          <h4 className="font-medium text-sm">Tasks</h4>
        </div>
        {config.tasks && config.tasks.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {config.tasks.map(task => (
              <Badge key={task} variant="outline" className="text-xs">
                {task}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderModelsSection = () => {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-purple-600" />
          <h4 className="font-medium text-sm">Models</h4>
        </div>
        {config.models && config.models.length > 0 && (
          <div className="space-y-1">
            {config.models.map(model => (
              <div key={model.name} className="text-sm text-gray-600">
                {model.name} ({model.provider})
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderParametersSection = () => {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-orange-600" />
          <h4 className="font-medium text-sm">Parameters</h4>
        </div>
        {config.parameters && config.models && Object.keys(config.parameters).length > 0 && (
          <div className="text-sm text-gray-600 space-y-2">
            {config.models.map(model => {
              const modelParams = config.parameters![model.name];
              if (!modelParams) return null;
              
              return (
                <div key={model.name} className="border-l-2 border-orange-200 pl-2">
                  <div className="font-medium text-xs text-gray-700">{model.name}</div>
                  <div className="text-xs text-gray-500">
                    Temp: {modelParams.temperature} | Top P: {modelParams.topP} | Top K: {modelParams.topK}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderMetricsSection = () => {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-red-600" />
          <h4 className="font-medium text-sm">Metrics</h4>
        </div>
        {config.metrics && (
          <div className="text-sm text-gray-600 space-y-1">
            {config.metrics.passAtK && (
              <div>Pass@{config.metrics.passAtK}</div>
            )}
            {config.metrics.textMetrics.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {config.metrics.textMetrics.map(metric => (
                  <Badge key={metric} variant="outline" className="text-xs">
                    {metric}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isCompact) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Configuration Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Completed sections */}
          <div className="space-y-3">
            {renderDatasetSection()}
            {renderTasksSection()}
            {renderModelsSection()}
            {renderParametersSection()}
            {renderMetricsSection()}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full version for Step 6
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-medium">Configuration Summary</h3>
      </div>
      <Card className="p-4">
        <div className="space-y-4">
          {renderDatasetSection()}
          <Separator />
          {renderTasksSection()}
          <Separator />
          {renderModelsSection()}
          <Separator />
          {renderParametersSection()}
          <Separator />
          {renderMetricsSection()}
        </div>
      </Card>
    </div>
  );
}
