import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import type { AutoEvalConfiguration } from "@/types/shared";
import { Minus, Plus, RotateCcw, Target, Thermometer } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ModelParameters {
  temperature: number;
  topP: number;
  maxTokens: number;
}

interface Step4ParameterConfigurationProps {
  onConfigurationUpdate?: (config: Partial<AutoEvalConfiguration> | ((prevConfig: AutoEvalConfiguration) => AutoEvalConfiguration)) => void;
  initialConfig?: AutoEvalConfiguration;
}

export default function Step4ParameterConfiguration({ onConfigurationUpdate, initialConfig }: Step4ParameterConfigurationProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [modelParameters, setModelParameters] = useState<Record<string, ModelParameters>>({});
  const [selectedModels, setSelectedModels] = useState<AutoEvalConfiguration['models']>([]);

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
    if (initialConfig?.models) {
      setSelectedModels(initialConfig.models);
      
      // Initialize parameters for each model
      const initialParams: Record<string, ModelParameters> = {};
      initialConfig.models.forEach(model => {
        if (initialConfig.parameters?.[model.id]) {
          initialParams[model.id] = initialConfig.parameters[model.id];
        } else {
          initialParams[model.id] = { temperature: 0, topP: 0, maxTokens: 500 };
        }
      });
      setModelParameters(initialParams);
    }
  }, [initialConfig]);

  const updateModelParameter = (modelId: string, paramType: keyof ModelParameters, value: number) => {
    const updatedParams = {
      ...modelParameters,
      [modelId]: {
        ...modelParameters[modelId],
        [paramType]: value
      }
    };
    setModelParameters(updatedParams);
    
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ parameters: updatedParams });
    }
  };

  const adjustParameter = (modelId: string, paramType: keyof ModelParameters, increment: boolean) => {
    const currentValue = modelParameters[modelId]?.[paramType] || 0;
    let newValue: number;
    let step: number;
    let min: number;
    let max: number;

    // Define step, min, max based on parameter type
    switch (paramType) {
      case 'temperature':
      case 'topP':
        step = 0.1;
        min = 0;
        max = 1;
        break;
      case 'maxTokens':
        step = 1;
        min = 100;
        max = 3000;
        break;
      default:
        return;
    }

    if (increment) {
      newValue = Math.min(currentValue + step, max);
    } else {
      newValue = Math.max(currentValue - step, min);
    }

    // Round to avoid floating point precision issues
    if (paramType === 'temperature' || paramType === 'topP') {
      newValue = Math.round(newValue * 10) / 10;
    }

    updateModelParameter(modelId, paramType, newValue);
  };

  const handleClearSelection = () => {
    const defaultParams: Record<string, ModelParameters> = {};
    selectedModels.forEach(model => {
      defaultParams[model.id] = { temperature: 0, topP: 0, maxTokens: 500 };
    });
    setModelParameters(defaultParams);
    
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ parameters: defaultParams });
    }
  };

  const applyToAllModels = (sourceModelId: string) => {
    const sourceParams = modelParameters[sourceModelId];
    if (!sourceParams) return;

    const updatedParams: Record<string, ModelParameters> = {};
    selectedModels.forEach(model => {
      updatedParams[model.id] = {
        temperature: sourceParams.temperature,
        topP: sourceParams.topP,
        maxTokens: sourceParams.maxTokens
      };
    });
    
    setModelParameters(updatedParams);
    
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ parameters: updatedParams });
    }

         // Show success toast notification
     toast.success("Configuration applied to all models successfully!", {
       position: "top-center",
       style: {
         background: "#1e293b", // slate-800 - dark grey-blue background
         color: "#f9fafb", // gray-50 - light text
         border: "1px solid #d1d5db", // gray-300 - light grey border
         padding: "16px 24px", // larger padding
         fontSize: "16px", // larger font
         fontWeight: "500",
         borderRadius: "12px", // rounded corners
         minWidth: "400px", // larger width
       },
       duration: 4000, // Show for 4 seconds
     });
  };

  if (selectedModels.length === 0) {
    return (
      <>
        <CardContent className="overflow-y-auto space-y-8 h-full">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No models selected</h3>
              <p className="text-gray-500">Please select models in the previous step to configure their parameters.</p>
            </div>
          </div>
        </CardContent>
      </>
    );
  }

  return (
    <>
      <CardContent className="overflow-y-auto space-y-8 h-full">
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
          <p className="text-slate-300">Configure parameters for each selected model individually.</p>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedModels.map((model) => {
            const params = modelParameters[model.id] || { temperature: 0, topP: 0, maxTokens: 500 };
            
            return (
              <Card key={model.id} className="p-4">
                <CardHeader className={`pb-3 ${isMobile ? '-ml-4 -mr-4' : '-ml-2'}`}>
                  <div className="flex items-center justify-between">
                    <div className={isMobile ? '' : '-ml-2'}>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        {model.name}
                      </CardTitle>
                      <p className="text-xs text-gray-600 mt-1">{model.provider}</p>
                    </div>
                    {selectedModels.length > 1 && (
                      <Button
                        onClick={() => applyToAllModels(model.id)}
                        variant="outline"
                        size="sm"
                        className={`h-8 px-3 text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-400 active:scale-95 ${isMobile ? 'ml-4' : ''}`}
                      >
                        Apply to All
                      </Button>
                    )}
                  </div>
                </CardHeader>
                
                <div className="space-y-4">
                  {/* Temperature Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-blue-600" />
                      <Label className="text-sm font-medium">Temperature</Label>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <div className="flex justify-between text-xs text-gray-400 mb-3 px-1">
                            <span>0.0</span>
                            <span>1.0</span>
                          </div>
                          <Slider
                            value={[params.temperature]}
                            onValueChange={(value) => updateModelParameter(model.id, 'temperature', value[0])}
                            max={1}
                            min={0}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => adjustParameter(model.id, 'temperature', true)}
                            className="w-6 h-6 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg border border-orange-500/30 hover:border-orange-400/50 flex items-center justify-center transition-colors"
                            disabled={params.temperature >= 1}
                          >
                            <Plus className="h-3 w-3 text-orange-300 stroke-2" />
                          </button>
                          <button
                            onClick={() => adjustParameter(model.id, 'temperature', false)}
                            className="w-6 h-6 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg border border-orange-500/30 hover:border-orange-400/50 flex items-center justify-center transition-colors"
                            disabled={params.temperature <= 0}
                          >
                            <Minus className="h-3 w-3 text-orange-300 stroke-2" />
                          </button>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-semibold text-blue-600">{params.temperature}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Top P Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <Label className="text-sm font-medium">Top P</Label>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <div className="flex justify-between text-xs text-gray-400 mb-3 px-1">
                            <span>0.0</span>
                            <span>1.0</span>
                          </div>
                          <Slider
                            value={[params.topP]}
                            onValueChange={(value) => updateModelParameter(model.id, 'topP', value[0])}
                            max={1}
                            min={0}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => adjustParameter(model.id, 'topP', true)}
                            className="w-6 h-6 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg border border-orange-500/30 hover:border-orange-400/50 flex items-center justify-center transition-colors"
                            disabled={params.topP >= 1}
                          >
                            <Plus className="h-3 w-3 text-orange-300 stroke-2" />
                          </button>
                          <button
                            onClick={() => adjustParameter(model.id, 'topP', false)}
                            className="w-6 h-6 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg border border-orange-500/30 hover:border-orange-400/50 flex items-center justify-center transition-colors"
                            disabled={params.topP <= 0}
                          >
                            <Minus className="h-3 w-3 text-orange-300 stroke-2" />
                          </button>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-semibold text-purple-600">{params.topP}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Max Tokens Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-600" />
                      <Label className="text-sm font-medium">Max Tokens</Label>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <div className="flex justify-between text-xs text-gray-400 mb-3 px-1">
                            <span>100</span>
                            <span>3000</span>
                          </div>
                          <Slider
                            value={[params.maxTokens]}
                            onValueChange={(value) => updateModelParameter(model.id, 'maxTokens', value[0])}
                            max={3000}
                            min={100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => adjustParameter(model.id, 'maxTokens', true)}
                            className="w-6 h-6 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg border border-orange-500/30 hover:border-orange-400/50 flex items-center justify-center transition-colors"
                            disabled={params.maxTokens >= 3000}
                          >
                            <Plus className="h-3 w-3 text-orange-300 stroke-2" />
                          </button>
                          <button
                            onClick={() => adjustParameter(model.id, 'maxTokens', false)}
                            className="w-6 h-6 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg border border-orange-500/30 hover:border-orange-400/50 flex items-center justify-center transition-colors"
                            disabled={params.maxTokens <= 100}
                          >
                            <Minus className="h-3 w-3 text-orange-300 stroke-2" />
                          </button>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-semibold text-green-600">{params.maxTokens}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </>
  );
}


