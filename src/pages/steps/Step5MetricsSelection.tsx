import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PASS_AT_K_OPTIONS, TEXT_METRICS } from "@/data/autoevalStaticData";
import type { AutoEvalConfiguration } from "@/types/shared";
import { FileText, HelpCircle, RotateCcw, Target } from "lucide-react";
import { useEffect, useState } from "react";

interface Step5MetricsSelectionProps {
  onConfigurationUpdate?: (config: Partial<AutoEvalConfiguration> | ((prevConfig: AutoEvalConfiguration) => AutoEvalConfiguration)) => void;
  initialConfig?: AutoEvalConfiguration;
}

export default function Step5MetricsSelection({ onConfigurationUpdate, initialConfig }: Step5MetricsSelectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedPassAtK, setSelectedPassAtK] = useState<string>(initialConfig?.metrics?.passAtK || "");
  const [selectedTextMetrics, setSelectedTextMetrics] = useState<string[]>(initialConfig?.metrics?.textMetrics || []);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        {/* Clear Selection Button - Top of Screen (Mobile) */}
        {isMobile && (
          <div className="flex justify-end mb-4">
            <Button
              onClick={handleClearSelection}
              variant="outline"
              size="sm"
              className="text-slate-400 hover:text-slate-200 border-slate-600 hover:border-slate-500 hover:bg-slate-700/50 transition-colors duration-200 w-40"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear Selection
            </Button>
          </div>
        )}

        <div className={`${isMobile ? 'flex flex-col gap-2' : 'flex items-center justify-between'}`}>
          <p className="text-slate-300">Select the metrics you want to use for evaluation. You can select multiple text metrics.</p>
          {!isMobile && (
            <Button
              onClick={handleClearSelection}
              variant="outline"
              size="sm"
              className="text-slate-400 hover:text-slate-200 border-slate-600 hover:border-slate-500 hover:bg-slate-700/50 transition-colors duration-200"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear Selection
            </Button>
          )}
        </div>
        
        <TooltipProvider>
          <div className="space-y-8">
            {/* Text Metrics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-medium">Text Metrics</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TEXT_METRICS.map((metric) => (
                  <Card
                    key={metric.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedTextMetrics.includes(metric.id)
                        ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => toggleTextMetric(metric.id)}
                  >
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{metric.name}</h4>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{metric.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </CardContent>
                  </Card>
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
                  <label className="text-sm font-medium pl-1">Select Pass@k Value</label>
                  <div className="mt-4">
                    <Select value={selectedPassAtK} onValueChange={handlePassAtKChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Pass@k value" />
                      </SelectTrigger>
                      <SelectContent>
                        {PASS_AT_K_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
