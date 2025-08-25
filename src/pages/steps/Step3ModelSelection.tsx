import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AVAILABLE_MODELS, type Model } from "@/data/autoevalStaticData";
import type { AutoEvalConfiguration } from "@/types/shared";
import { Bot, Check, DollarSign, Move, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

interface Step3ModelSelectionProps {
  onConfigurationUpdate?: (config: Partial<AutoEvalConfiguration> | ((prevConfig: AutoEvalConfiguration) => AutoEvalConfiguration)) => void;
  initialConfig?: AutoEvalConfiguration;
}

export default function Step3ModelSelection({ onConfigurationUpdate, initialConfig }: Step3ModelSelectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedModels, setSelectedModels] = useState<Model[]>(initialConfig?.models || []);

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

  const handleModelToggle = (model: Model) => {
    const isCurrentlySelected = selectedModels.find(m => m.id === model.id);
    let newSelectedModels: Model[];
    
    if (isCurrentlySelected) {
      newSelectedModels = selectedModels.filter(m => m.id !== model.id);
    } else {
      newSelectedModels = [...selectedModels, model];
    }
    
    setSelectedModels(newSelectedModels);
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ models: newSelectedModels });
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

  // Mobile view with card-based selection
  if (isMobile) {
    return (
      <>
        <CardContent className="overflow-y-auto space-y-6 h-full">
          {/* Clear Selection Button - Top of Screen (Mobile) */}
          <div className="flex justify-end">
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

          <div className="flex flex-col gap-3">
            <p className="text-slate-300">Select models for evaluation by tapping on them.</p>
          </div>
          
          {/* Cost Footnote */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 text-left">
              * All costs are measured per 1 million tokens
            </p>
          </div>
          
          {/* Selected Models Section - On Top */}
          {selectedModels.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Selected Models ({selectedModels.length})
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {selectedModels.map((model) => (
                  <Card
                    key={model.id}
                    className="cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-xl border-l-4 backdrop-blur-xl bg-[#04071307] border-l-[#FFD886] border-[#FFD886] shadow-lg p-3"
                    onClick={() => handleModelToggle(model)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-1.5 rounded-lg">
                          <Bot className="h-5 w-5 text-white" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white text-sm">
                              {model.name}
                            </h3>
                            <p className="text-xs text-blue-100">
                              {model.provider}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 text-xs mt-1">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3 text-gray-400" />
                              <span className="text-blue-100">Input: {model.costPerMillionInputTokens}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3 text-gray-400" />
                              <span className="text-blue-100">Output: {model.costPerMillionOutputTokens}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Check className="h-4 w-4 text-white ml-2" strokeWidth={2} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Model Selection Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Available Models ({availableModelsList.length})
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {availableModelsList.map((model) => (
                <Card
                  key={model.id}
                  className="cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-xl border-l-4 backdrop-blur-xl bg-gradient-to-br from-[rgb(5,15,34)] to-[rgb(11,51,87)] hover:border-l-slate-300 hover:shadow-lg p-3"
                  onClick={() => handleModelToggle(model)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-1.5 rounded-lg">
                        <Bot className="h-5 w-5 text-[#FFD886]" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-300 text-sm">
                            {model.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {model.provider}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs mt-1">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-400">Input: {model.costPerMillionInputTokens}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-400">Output: {model.costPerMillionOutputTokens}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </>
    );
  }

  // Desktop view with drag and drop (original implementation)
  return (
    <>
      <CardContent className="overflow-y-auto space-y-6 h-full">
        {/* Clear Selection Button - Top of Screen (Mobile) */}
        {isMobile && (
          <div className="flex justify-end">
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

        <div className={`${isMobile ? 'flex flex-col gap-3' : 'flex items-center justify-between'}`}>
          <p className="text-slate-300">Drag models between sections to select or deselect them for evaluation.</p>
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


