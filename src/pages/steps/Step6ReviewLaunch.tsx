import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, FileText } from "lucide-react";

export default function Step6ReviewLaunch() {
  // Sample configuration data
  const config = {
    dataset: {
      name: "qa_dataset.csv",
      columns: {
        input: "question",
        ground_truth: "answer",
        tags: "category",
        output: "none"
      }
    },
    tasks: ["qa", "classification"],
    models: [
      { name: "GPT-4", provider: "OpenAI", pricing: "$0.03/1K tokens" },
      { name: "Claude-3", provider: "Anthropic", pricing: "$0.015/1K tokens" }
    ],
    parameters: {
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9,
      samples_per_prompt: 1,
      pass_at_k: 1,
      seed: "random"
    },
    metrics: {
      pass_at_k: ["pass@1", "pass@5"],
      text_metrics: ["bleu", "rouge", "exact_match"]
    }
  };

  return (
    <>
      <CardContent className="overflow-y-auto space-y-6 h-full">
        <p className="text-muted-foreground">Review your configuration and launch the evaluation.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Summary Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium">Configuration Summary</h3>
            </div>
            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Dataset</h4>
                  <p className="text-sm text-gray-600">{config.dataset.name}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    Input: {config.dataset.columns.input} | Ground Truth: {config.dataset.columns.ground_truth}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Tasks</h4>
                  <div className="flex flex-wrap gap-1">
                    {config.tasks.map(task => (
                      <Badge key={task} variant="outline" className="text-xs">
                        {task}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Models</h4>
                  <div className="space-y-1">
                    {config.models.map(model => (
                      <div key={model.name} className="text-sm text-gray-600">
                        {model.name} ({model.provider})
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Parameters</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Temperature: {config.parameters.temperature}</div>
                    <div>Top P: {config.parameters.top_p}</div>
                    <div>Top K: 50</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Metrics</h4>
                  <div className="text-sm text-gray-600">
                    <div>Pass@k: {config.metrics.pass_at_k.length} selected</div>
                    <div>Text Metrics: {config.metrics.text_metrics.length} selected</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

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
                    <span className="font-medium">{config.models.length} selected</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tasks:</span>
                    <span className="font-medium">{config.tasks.length} selected</span>
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
