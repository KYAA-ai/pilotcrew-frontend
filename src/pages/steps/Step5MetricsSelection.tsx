import { CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileText, HelpCircle, Target } from "lucide-react";
import { useState } from "react";

interface Metric {
  id: string;
  name: string;
  description: string;
}

const passAtKMetrics: Metric[] = [
  {
    id: "pass@1",
    name: "Pass@1",
    description: "Measures if at least one correct answer is generated in the first attempt"
  },
  {
    id: "pass@5",
    name: "Pass@5",
    description: "Measures if at least one correct answer is generated in the first 5 attempts"
  },
  {
    id: "pass@10",
    name: "Pass@10",
    description: "Measures if at least one correct answer is generated in the first 10 attempts"
  },
  {
    id: "pass@20",
    name: "Pass@20",
    description: "Measures if at least one correct answer is generated in the first 20 attempts"
  },
  {
    id: "pass@50",
    name: "Pass@50",
    description: "Measures if at least one correct answer is generated in the first 50 attempts"
  },
  {
    id: "pass@100",
    name: "Pass@100",
    description: "Measures if at least one correct answer is generated in the first 100 attempts"
  }
];

const textMetrics: Metric[] = [
  {
    id: "bleu",
    name: "BLEU",
    description: "Bilingual Evaluation Understudy - measures n-gram overlap between generated and reference text"
  },
  {
    id: "rouge",
    name: "ROUGE",
    description: "Recall-Oriented Understudy for Gisting Evaluation - measures word overlap and n-gram similarity"
  },
  {
    id: "meteor",
    name: "METEOR",
    description: "Metric for Evaluation of Translation with Explicit ORdering - considers synonyms and word order"
  },
  {
    id: "bertscore",
    name: "BERTScore",
    description: "Uses BERT embeddings to compute similarity between generated and reference text"
  },
  {
    id: "exact_match",
    name: "Exact Match",
    description: "Measures if the generated text exactly matches the reference text"
  },
  {
    id: "f1_score",
    name: "F1 Score",
    description: "Harmonic mean of precision and recall for text matching"
  }
];

export default function Step5MetricsSelection() {
  const [selectedPassAtK, setSelectedPassAtK] = useState<string[]>([]);
  const [selectedTextMetrics, setSelectedTextMetrics] = useState<string[]>([]);

  const togglePassAtK = (metricId: string) => {
    setSelectedPassAtK(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const toggleTextMetric = (metricId: string) => {
    setSelectedTextMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  return (
    <>
      <CardContent className="overflow-y-auto space-y-6 h-full">
        <p className="text-muted-foreground">Select the metrics you want to use for evaluation. You can select multiple metrics from each category.</p>
        
        <TooltipProvider>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pass@k Metrics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Pass@k Metrics</h3>
              </div>
              <div className="space-y-3">
                {passAtKMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={metric.id}
                      checked={selectedPassAtK.includes(metric.id)}
                      onCheckedChange={() => togglePassAtK(metric.id)}
                    />
                    <div className="flex items-center gap-2">
                      <Label htmlFor={metric.id} className="text-sm font-medium cursor-pointer">
                        {metric.name}
                      </Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{metric.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Metrics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-medium">Text Metrics</h3>
              </div>
              <div className="space-y-3">
                {textMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={metric.id}
                      checked={selectedTextMetrics.includes(metric.id)}
                      onCheckedChange={() => toggleTextMetric(metric.id)}
                    />
                    <div className="flex items-center gap-2">
                      <Label htmlFor={metric.id} className="text-sm font-medium cursor-pointer">
                        {metric.name}
                      </Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{metric.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TooltipProvider>

        {/* Selection Summary */}
        {(selectedPassAtK.length > 0 || selectedTextMetrics.length > 0) && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Selected Metrics:</h4>
            <div className="space-y-2">
              {selectedPassAtK.length > 0 && (
                <div>
                  <span className="font-medium text-sm text-gray-700">Pass@k Metrics:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedPassAtK.map((metricId) => {
                      const metric = passAtKMetrics.find(m => m.id === metricId);
                      return (
                        <span key={metricId} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {metric?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {selectedTextMetrics.length > 0 && (
                <div>
                  <span className="font-medium text-sm text-gray-700">Text Metrics:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedTextMetrics.map((metricId) => {
                      const metric = textMetrics.find(m => m.id === metricId);
                      return (
                        <span key={metricId} className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {metric?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </>
  );
}
