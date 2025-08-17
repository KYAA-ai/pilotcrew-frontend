import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, Target, Thermometer } from "lucide-react";
import { useEffect, useState } from "react";

interface Model {
  name: string;
  provider: string;
  pricing: string;
}

interface ModelParameters {
  temperature: number;
  topP: number;
  topK: number;
}

interface Step4ParameterConfigurationProps {
  onConfigurationUpdate?: (config: { parameters: Record<string, ModelParameters> }) => void;
  initialConfig?: { 
    parameters?: Record<string, ModelParameters>;
    models?: Model[];
  };
}

export default function Step4ParameterConfiguration({ onConfigurationUpdate, initialConfig }: Step4ParameterConfigurationProps) {
  const [modelParameters, setModelParameters] = useState<Record<string, ModelParameters>>({});
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);

  // Initialize from initialConfig if provided
  useEffect(() => {
    if (initialConfig?.models) {
      setSelectedModels(initialConfig.models);
      
      // Initialize parameters for each model
      const initialParams: Record<string, ModelParameters> = {};
      initialConfig.models.forEach(model => {
        if (initialConfig.parameters?.[model.name]) {
          initialParams[model.name] = initialConfig.parameters[model.name];
        } else {
          initialParams[model.name] = { temperature: 0, topP: 0, topK: 1 };
        }
      });
      setModelParameters(initialParams);
    }
  }, [initialConfig]);

  const updateModelParameter = (modelName: string, paramType: keyof ModelParameters, value: number) => {
    const updatedParams = {
      ...modelParameters,
      [modelName]: {
        ...modelParameters[modelName],
        [paramType]: value
      }
    };
    setModelParameters(updatedParams);
    
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ parameters: updatedParams });
    }
  };

  const handleClearSelection = () => {
    const defaultParams: Record<string, ModelParameters> = {};
    selectedModels.forEach(model => {
      defaultParams[model.name] = { temperature: 0, topP: 0, topK: 1 };
    });
    setModelParameters(defaultParams);
    
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ parameters: defaultParams });
    }
  };

  if (selectedModels.length === 0) {
    return (
      <>
        <CardContent className="overflow-y-auto space-y-8 h-full">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No models selected</h3>
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
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Configure parameters for each selected model individually.</p>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedModels.map((model) => {
            const params = modelParameters[model.name] || { temperature: 0, topP: 0, topK: 1 };
            
            return (
              <Card key={model.name} className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    {model.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{model.provider}</p>
                </CardHeader>
                
                <div className="space-y-6">
                  {/* Temperature Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-blue-600" />
                      <Label className="text-sm font-medium">Temperature</Label>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>0.0</span>
                        <span>1.0</span>
                      </div>
                      <Slider
                        value={[params.temperature]}
                        onValueChange={(value) => updateModelParameter(model.name, 'temperature', value[0])}
                        max={1}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="text-center">
                        <span className="text-sm font-semibold text-blue-600">{params.temperature}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Top P Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <Label className="text-sm font-medium">Top P</Label>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>0.0</span>
                        <span>1.0</span>
                      </div>
                      <Slider
                        value={[params.topP]}
                        onValueChange={(value) => updateModelParameter(model.name, 'topP', value[0])}
                        max={1}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="text-center">
                        <span className="text-sm font-semibold text-purple-600">{params.topP}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Top K Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-600" />
                      <Label className="text-sm font-medium">Top K</Label>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>1</span>
                        <span>1000</span>
                      </div>
                      <Slider
                        value={[params.topK]}
                        onValueChange={(value) => updateModelParameter(model.name, 'topK', value[0])}
                        max={1000}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center">
                        <span className="text-sm font-semibold text-green-600">{params.topK}</span>
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
