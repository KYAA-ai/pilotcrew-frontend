import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, DollarSign, Move, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import type { AutoEvalConfiguration } from "@/types/shared";
import { AVAILABLE_MODELS, type Model } from "@/data/autoevalStaticData";

interface Step3ModelSelectionProps {
  onConfigurationUpdate?: (config: Partial<AutoEvalConfiguration> | ((prevConfig: AutoEvalConfiguration) => AutoEvalConfiguration)) => void;
  initialConfig?: AutoEvalConfiguration;
}

export default function Step3ModelSelection({ onConfigurationUpdate, initialConfig }: Step3ModelSelectionProps) {
  const [selectedModels, setSelectedModels] = useState<Model[]>(initialConfig?.models || []);

  // Initialize from initialConfig if provided
  useEffect(() => {
    if (initialConfig?.models) {
      setSelectedModels(initialConfig.models);
    }
  }, [initialConfig]);

  const handleDragStart = (e: React.DragEvent, model: Model) => {
    e.dataTransfer.setData('application/json', JSON.stringify(model));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetList: 'available' | 'selected') => {
    e.preventDefault();
    const modelData = e.dataTransfer.getData('application/json');
    const model: Model = JSON.parse(modelData);

    if (targetList === 'selected') {
      if (!selectedModels.find(m => m.id === model.id)) {
        const newSelectedModels = [...selectedModels, model];
        setSelectedModels(newSelectedModels);
        if (onConfigurationUpdate) {
          onConfigurationUpdate({ models: newSelectedModels });
        }
      }
    } else {
      const newSelectedModels = selectedModels.filter(m => m.id !== model.id);
      setSelectedModels(newSelectedModels);
      if (onConfigurationUpdate) {
        onConfigurationUpdate({ models: newSelectedModels });
      }
    }
  };



  const handleClearSelection = () => {
    setSelectedModels([]);
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ models: [] });
    }
  };

  const availableModelsList = AVAILABLE_MODELS.filter(
    model => !selectedModels.find(m => m.id === model.id)
  );

  return (
    <>
      <CardContent className="overflow-y-auto space-y-6 h-full">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Drag models between sections to select or deselect them for evaluation.</p>
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
        
        {/* Cost Footnote */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 text-left">
            * All costs are measured per 1 million tokens
          </p>
        </div>
        
        {/* Model Selection Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Models */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Available Models
            </h3>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[400px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'available')}
            >
              {availableModelsList.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>All models selected</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableModelsList.map((model) => (
                    <Card
                      key={model.id}
                      className="p-3 cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, model)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-medium text-sm">{model.name}</h4>
                            <p className="text-xs text-gray-600">{model.provider}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">Input: {model.costPerMillionInputTokens}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">Output: {model.costPerMillionOutputTokens}</span>
                          </div>
                          <Move className="h-3 w-3 text-gray-400" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Models */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Selected Models
            </h3>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[400px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'selected')}
            >
              {selectedModels.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>Drag models here to select</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedModels.map((model) => (
                    <Card
                      key={model.id}
                      className="p-3 cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, model)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-medium text-sm">{model.name}</h4>
                            <p className="text-xs text-gray-600">{model.provider}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">Input: {model.costPerMillionInputTokens}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">Output: {model.costPerMillionOutputTokens}</span>
                          </div>
                          <Move className="h-3 w-3 text-gray-400" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
}


