import ConfigurationSummary from "@/components/ConfigurationSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AutoEvalConfiguration } from "@/types/shared";
import { DollarSign, Loader2, Play, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api";

interface CostEstimate {
  totalRows: number;
  models: Array<{
    modelId: string;
    tokensPerRow: number;
    fromTiktoken: boolean;
    addDisclaimer: boolean;
    totalRows: number;
    inputTokens: number;
    outputTokens: number;
    rates: {
      dollarsPerMillionInputTokens: number;
      dollarsPerMillionOutputTokens: number;
    };
    costs: {
      inputCost: number;
      outputCost: number;
      totalCost: number;
    };
  }>;
  inputCost: number;
  outputCost: number;
  grandTotal: number;
}

interface Step6ReviewLaunchProps {
  initialConfig?: AutoEvalConfiguration;
  currentStep?: number;
  onComplete?: (finalConfig: unknown) => Promise<void> | void;
  isProcessing?: boolean;
}

export default function Step6ReviewLaunch({ 
  initialConfig, 
  currentStep = 6, 
  onComplete,
  isProcessing = false 
}: Step6ReviewLaunchProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [costEstimate, setCostEstimate] = useState<CostEstimate | null>(null);
  const [loadingCost, setLoadingCost] = useState(false);
  const [costError, setCostError] = useState<string | null>(null);

  // Use the actual configuration data passed from the parent
  const config: AutoEvalConfiguration = initialConfig || {
    dataset: undefined,
    tasks: [],
    models: [],
    parameters: undefined,
    metrics: undefined,
  };

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch cost estimate function
  const fetchCostEstimate = async () => {
    if (!config.dataset?.preview || !config.models || config.models.length === 0) {
      setCostEstimate(null);
      return;
    }

    setLoadingCost(true);
    setCostError(null);

    try {
      const requestBody = {
        rows: config.dataset.preview,
        estimatedTotalRows: config.dataset.estimatedTotalRows,
        models: config.models.map(model => ({
          id: model.id,
          maxTokens: config.parameters?.[model.id]?.maxTokens || 500,
          costPerMillionInputTokens: model.costPerMillionInputTokens,
          costPerMillionOutputTokens: model.costPerMillionOutputTokens,
        })),
        metrics: {
          passAtK: config.metrics?.passAtK || "1",
          textMetrics: config.metrics?.textMetrics || [],
        },
      };

      const response = await apiClient.post('/v1/autoeval/cost-estimate', requestBody);
      setCostEstimate(response.data);
    } catch (error) {
      console.error('Failed to fetch cost estimate:', error);
      setCostError('Failed to calculate cost estimate');
    } finally {
      setLoadingCost(false);
    }
  };

  // Fetch cost estimate when config changes
  useEffect(() => {
    fetchCostEstimate();
  }, [config]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      <CardContent className="overflow-y-scroll space-y-6 h-full">
        <p className="text-muted-foreground">Review your configuration and launch the evaluation.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100%-4rem)]">
          {/* Configuration Summary Card */}
          {isMobile ? (
            <ConfigurationSummary 
              config={config}
              currentStep={currentStep}
              isCompact={false}
              isMobile={true}
            />
          ) : (
            <div className="h-full overflow-y-auto">
              <ConfigurationSummary 
                config={config}
                currentStep={currentStep}
                isCompact={false}
                isMobile={false}
              />
            </div>
          )}

          {/* Estimated Cost Card */}
          <div className="space-y-4 h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-medium">Estimated Cost</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchCostEstimate}
                disabled={loadingCost || !config.dataset?.preview || !config.models || config.models.length === 0}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={`h-4 w-4 ${loadingCost ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <Card className="p-4 h-[calc(100%-3rem)]">
              <div className="space-y-4">
                {loadingCost ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-green-600" />
                    <p className="text-sm text-muted-foreground">Calculating cost estimate...</p>
                  </div>
                ) : costError ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-red-600 mb-2">{costError}</p>
                    <p className="text-xs text-muted-foreground">Cost estimate unavailable</p>
                  </div>
                ) : costEstimate ? (
                  <>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {formatCurrency(costEstimate.grandTotal)}
                      </div>
                      <p className="text-sm text-muted-foreground">Total estimated cost</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Input Cost:</span>
                        <span className="font-medium">{formatCurrency(costEstimate.inputCost)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Output Cost:</span>
                        <span className="font-medium">{formatCurrency(costEstimate.outputCost)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Rows:</span>
                        <span className="font-medium">{costEstimate.totalRows.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Models:</span>
                        <span className="font-medium">{config.models?.length || 0} selected</span>
                      </div>
                    </div>

                    {/* Per-model breakdown */}
                    <div className="border-t pt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Per Model Details:</p>
                      <div className="space-y-3">
                        {costEstimate.models.map((model) => (
                          <Card key={model.modelId} className="p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-foreground">{model.modelId}</span>
                              <span className="font-bold text-green-600">{formatCurrency(model.costs.totalCost)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground">Input:</span>
                                <span className="ml-1 font-medium">{formatCurrency(model.costs.inputCost)}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Output:</span>
                                <span className="ml-1 font-medium">{formatCurrency(model.costs.outputCost)}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Tokens/Row:</span>
                                <span className="ml-1 font-medium">{model.tokensPerRow.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Total Tokens:</span>
                                <span className="ml-1 font-medium">{(model.inputTokens + model.outputTokens).toLocaleString()}</span>
                              </div>
                            </div>
                            {model.addDisclaimer && (
                              <div className="mt-2 border border-[#1942abc0] p-2 rounded text-xs text-gray-400">
                                ⚠️ Token count estimated using tiktoken (may differ from model's native tokenizer)
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-400 mb-2">--</div>
                    <p className="text-sm text-muted-foreground">No data available</p>
                  </div>
                )}
                
                <div className="border border-[#1942abc0] p-3 rounded-lg">
                  <p className="text-xs text-gray-400">
                    <strong>Note:</strong> This is an estimate based on your configuration and sample data. Actual costs may vary depending on model usage and response lengths.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Mobile Launch Button - Positioned at bottom */}
        {isMobile && onComplete && (
          <div className="mt-6">
            <Button
              onClick={() => onComplete(config)}
              disabled={isProcessing || loadingCost}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-base"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Launching...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Launch Evaluation
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </>
  );
}
