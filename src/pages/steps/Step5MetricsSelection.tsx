import { CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileText, HelpCircle, Target } from "lucide-react";
import { useState } from "react";

interface Metric {
  id: string;
  name: string;
  description: string;
}

const passAtKOptions = [
  { value: "1", label: "Pass@1" },
  { value: "5", label: "Pass@5" },
  { value: "10", label: "Pass@10" }
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
  const [selectedPassAtK, setSelectedPassAtK] = useState<string>("");
  const [selectedTextMetrics, setSelectedTextMetrics] = useState<string[]>([]);

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
        <p className="text-muted-foreground">Select the metrics you want to use for evaluation. You can select multiple text metrics.</p>
        
        <TooltipProvider>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pass@k Metrics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Pass@k Metrics</h3>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Pass@k Value</Label>
                  <Select value={selectedPassAtK} onValueChange={setSelectedPassAtK}>
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

      </CardContent>
    </>
  );
}
