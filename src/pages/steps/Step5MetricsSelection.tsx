import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileText, HelpCircle, RotateCcw, Target } from "lucide-react";
import { useEffect, useState } from "react";

interface Metric {
  id: string;
  name: string;
  description: string;
}

const passAtKOptions = [
  { value: "1", label: "Pass@1" },
  { value: "4", label: "Pass@4" },
  { value: "16", label: "Pass@16" },
  { value: "64", label: "Pass@64" }
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
  },
  {
    id: "perplexity",
    name: "Perplexity",
    description: "Measures how well a language model predicts a sample of text, lower values indicate better performance"
  }
];

interface Step5MetricsSelectionProps {
  onConfigurationUpdate?: (config: { metrics: { passAtK?: string; textMetrics: string[] } }) => void;
  initialConfig?: { metrics?: { passAtK?: string; textMetrics: string[] } };
}

export default function Step5MetricsSelection({ onConfigurationUpdate, initialConfig }: Step5MetricsSelectionProps) {
  const [selectedPassAtK, setSelectedPassAtK] = useState<string>("");
  const [selectedTextMetrics, setSelectedTextMetrics] = useState<string[]>([]);

  // Initialize from initialConfig if provided
  useEffect(() => {
    if (initialConfig?.metrics) {
      setSelectedPassAtK(initialConfig.metrics.passAtK || "");
      setSelectedTextMetrics(initialConfig.metrics.textMetrics || []);
    }
  }, [initialConfig]);

  const toggleTextMetric = (metricId: string) => {
    const newSelectedTextMetrics = selectedTextMetrics.includes(metricId) 
      ? selectedTextMetrics.filter(id => id !== metricId)
      : [...selectedTextMetrics, metricId];
    
    setSelectedTextMetrics(newSelectedTextMetrics);
    
    // Update configuration
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ 
        metrics: { 
          passAtK: selectedPassAtK, 
          textMetrics: newSelectedTextMetrics 
        } 
      });
    }
  };

  const handlePassAtKChange = (value: string) => {
    setSelectedPassAtK(value);
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ 
        metrics: { 
          passAtK: value, 
          textMetrics: selectedTextMetrics 
        } 
      });
    }
  };

  const handleClearSelection = () => {
    setSelectedPassAtK("");
    setSelectedTextMetrics([]);
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ 
        metrics: { 
          passAtK: undefined, 
          textMetrics: [] 
        } 
      });
    }
  };

  return (
    <>
      <CardContent className="overflow-y-auto space-y-6 h-full">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Select the metrics you want to use for evaluation. You can select multiple text metrics.</p>
          <Button
            onClick={handleClearSelection}
            variant="outline"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear Selection
          </Button>
        </div>
        
        <TooltipProvider>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            {/* Pass@k Metrics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Pass@k Metrics</h3>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Pass@k Value</Label>
                  <Select value={selectedPassAtK} onValueChange={handlePassAtKChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Pass@k value" />
                    </SelectTrigger>
                    <SelectContent>
                      {passAtKOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600">
                    Measures if at least one correct answer is generated in the first k attempts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>

      </CardContent>
    </>
  );
}
