import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Play, Settings } from "lucide-react";
import { useState } from "react";

export default function Step6ReviewLaunch() {
  const [isLaunching, setIsLaunching] = useState(false);

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

  const handleLaunch = () => {
    setIsLaunching(true);
    // Simulate launch process
    setTimeout(() => {
      setIsLaunching(false);
      // Here you would typically navigate to results page or show success message
    }, 2000);
  };

  return (
    <>
      <CardContent className="overflow-y-auto space-y-6 h-full">
        <p className="text-muted-foreground">Review your configuration and launch the evaluation.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* YAML Configuration Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium">Configuration Preview</h3>
            </div>
            <Card className="p-4">
              <pre className="text-xs text-gray-700 overflow-auto max-h-96">
{`dataset:
  name: ${config.dataset.name}
  columns:
    input: ${config.dataset.columns.input}
    ground_truth: ${config.dataset.columns.ground_truth}
    tags: ${config.dataset.columns.tags}
    output: ${config.dataset.columns.output}

tasks: ${JSON.stringify(config.tasks)}

models:
${config.models.map(model => `  - name: ${model.name}
    provider: ${model.provider}
    pricing: ${model.pricing}`).join('\n')}

parameters:
  temperature: ${config.parameters.temperature}
  max_tokens: ${config.parameters.max_tokens}
  top_p: ${config.parameters.top_p}
  samples_per_prompt: ${config.parameters.samples_per_prompt}
  pass_at_k: ${config.parameters.pass_at_k}
  seed: ${config.parameters.seed}

metrics:
  pass_at_k: ${JSON.stringify(config.metrics.pass_at_k)}
  text_metrics: ${JSON.stringify(config.metrics.text_metrics)}`}
              </pre>
            </Card>
          </div>

          {/* Summary Table */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium">Summary</h3>
            </div>
            <Card className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Dataset</TableCell>
                    <TableCell>{config.dataset.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tasks</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {config.tasks.map(task => (
                          <Badge key={task} variant="outline" className="text-xs">
                            {task}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Models</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {config.models.map(model => (
                          <div key={model.name} className="text-sm">
                            {model.name} ({model.provider})
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Parameters</TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>Temp: {config.parameters.temperature}</div>
                        <div>Max Tokens: {config.parameters.max_tokens}</div>
                        <div>Top P: {config.parameters.top_p}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Metrics</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Pass@k: {config.metrics.pass_at_k.length}</div>
                        <div>Text: {config.metrics.text_metrics.length}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>

        {/* Launch Button */}
        <div className="flex justify-center pt-6">
          <Button
            onClick={handleLaunch}
            disabled={isLaunching}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            size="lg"
          >
            {isLaunching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Launching Evaluation...
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Launch Evaluation
              </>
            )}
          </Button>
        </div>

        {/* Estimated Cost */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Estimated Cost</h4>
          <p className="text-sm text-blue-700">
            Based on your configuration, the estimated cost is approximately <strong>$15-25</strong> for this evaluation.
          </p>
        </div>
      </CardContent>
    </>
  );
}
