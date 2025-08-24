import ConfigurationSummary from "@/components/ConfigurationSummary";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import type { AutoEvalConfiguration } from "@/types/shared";

interface Step6ReviewLaunchProps {
  initialConfig?: AutoEvalConfiguration;
  currentStep?: number;
}

export default function Step6ReviewLaunch({ initialConfig, currentStep = 6 }: Step6ReviewLaunchProps) {
  // Use the actual configuration data passed from the parent
  const config: AutoEvalConfiguration = initialConfig || {
    dataset: undefined,
    tasks: [],
    models: [],
    parameters: undefined,
    metrics: undefined,
  };

  return (
    <>
      <CardContent className="overflow-y-scroll space-y-6 h-full">
        <p className="text-muted-foreground">Review your configuration and launch the evaluation.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100%-4rem)]">
          {/* Configuration Summary Card */}
          <div className="h-full overflow-y-auto">
            <ConfigurationSummary 
              config={config}
              currentStep={currentStep}
              isCompact={false}
            />
          </div>

          {/* Estimated Cost Card */}
          <div className="space-y-4 h-full">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium">Estimated Cost</h3>
            </div>
            <Card className="p-4 h-[calc(100%-3rem)]">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">$15-25</div>
                  <p className="text-sm text-light-gray-600">Estimated cost for this evaluation</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-light-gray-600">Dataset Size:</span>
                    <span className="font-medium">{config.dataset?.name || "Not uploaded"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-light-gray-600">Models:</span>
                    <span className="font-medium">{config.models?.length || 0} selected</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-light-gray-600">Tasks:</span>
                    <span className="font-medium">{config.tasks?.length || 0} selected</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-light-gray-600">Max Token Limit:</span>
                    <span className="font-medium">
                      {config.parameters && config.models && config.models.length > 0 
                        ? `${config.parameters[config.models[0].name]?.maxTokens || 500} tokens`
                        : "500 tokens"
                      }
                    </span>
                  </div>
                </div>
                
                <div className="border border-[#1942abc0] p-3 rounded-lg">
                  <p className="text-xs text-gray-400">
                    <strong>Note:</strong> This is an estimate based on your configuration. Actual costs may vary depending on model usage and response lengths.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </CardContent>
    </>
  );
}
