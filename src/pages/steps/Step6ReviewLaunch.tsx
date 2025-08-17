import ConfigurationSummary from "@/components/ConfigurationSummary";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface Step6ReviewLaunchProps {
  configuration?: {
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
  };
  currentStep?: number;
}

export default function Step6ReviewLaunch({ configuration, currentStep = 6 }: Step6ReviewLaunchProps) {
  // Sample configuration data (fallback if no configuration is passed)
  const config = configuration || {
    dataset: {
      name: "qa_dataset.csv",
      columns: ["id", "question", "answer", "category", "difficulty"],
      outputColumn: "none"
    },
    tasks: ["qa", "classification"],
    models: [
      { name: "GPT-4", provider: "OpenAI", pricing: "$0.03/1K tokens" },
      { name: "Claude-3", provider: "Anthropic", pricing: "$0.015/1K tokens" }
    ],
    parameters: {
      "GPT-4": { temperature: 0, topP: 0, topK: 1 },
      "Claude-3": { temperature: 0, topP: 0, topK: 1 }
    },
    metrics: {
      passAtK: "1",
      textMetrics: ["bleu", "rouge", "exact_match"]
    }
  };

  return (
    <>
      <CardContent className="overflow-y-auto space-y-6 h-full">
        <p className="text-muted-foreground">Review your configuration and launch the evaluation.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Summary Card */}
          <ConfigurationSummary 
            config={config}
            currentStep={currentStep}
            isCompact={false}
          />

          {/* Estimated Cost Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium">Estimated Cost</h3>
            </div>
            <Card className="p-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">$15-25</div>
                  <p className="text-sm text-gray-600">Estimated cost for this evaluation</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Dataset Size:</span>
                    <span className="font-medium">1,000 samples</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Models:</span>
                    <span className="font-medium">{config.models?.length || 0} selected</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tasks:</span>
                    <span className="font-medium">{config.tasks?.length || 0} selected</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg. Tokens per Response:</span>
                    <span className="font-medium">~150 tokens</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-700">
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
