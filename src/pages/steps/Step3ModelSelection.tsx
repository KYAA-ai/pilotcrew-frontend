import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bot, DollarSign, Move } from "lucide-react";
import { useState } from "react";

interface Model {
  id: string;
  name: string;
  provider: string;
  pricing: string;
  logo: string;
}

const availableModels: Model[] = [
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI", pricing: "$0.03/1K tokens", logo: "🤖" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI", pricing: "$0.002/1K tokens", logo: "🤖" },
  { id: "claude-3", name: "Claude-3", provider: "Anthropic", pricing: "$0.015/1K tokens", logo: "🤖" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google", pricing: "$0.001/1K tokens", logo: "🤖" },
  { id: "llama-2", name: "Llama-2", provider: "Meta", pricing: "$0.0006/1K tokens", logo: "🤖" },
  { id: "mistral", name: "Mistral", provider: "Mistral AI", pricing: "$0.0014/1K tokens", logo: "🤖" },
];

export default function Step3ModelSelection() {
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);
  const [useLocalEndpoints, setUseLocalEndpoints] = useState(false);

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
        setSelectedModels(prev => [...prev, model]);
      }
    } else {
      setSelectedModels(prev => prev.filter(m => m.id !== model.id));
    }
  };

  const removeModel = (modelId: string) => {
    setSelectedModels(prev => prev.filter(m => m.id !== modelId));
  };

  const availableModelsList = availableModels.filter(
    model => !selectedModels.find(m => m.id === model.id)
  );

  return (
    <>
      <CardContent className="overflow-hidden space-y-6">
        <p className="text-muted-foreground">Drag models from the left to the right to select them for evaluation.</p>
        
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
                <div className="space-y-3">
                  {availableModelsList.map((model) => (
                    <Card
                      key={model.id}
                      className="p-4 cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, model)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{model.logo}</span>
                          <div>
                            <h4 className="font-medium">{model.name}</h4>
                            <p className="text-sm text-gray-600">{model.provider}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{model.pricing}</span>
                          <Move className="h-4 w-4 text-gray-400" />
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
              className="border-2 border-dashed border-blue-300 rounded-lg p-4 min-h-[400px] bg-blue-50"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'selected')}
            >
              {selectedModels.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>Drag models here to select</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedModels.map((model) => (
                    <Card
                      key={model.id}
                      className="p-4 bg-white border-blue-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{model.logo}</span>
                          <div>
                            <h4 className="font-medium">{model.name}</h4>
                            <p className="text-sm text-gray-600">{model.provider}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{model.pricing}</span>
                          <button
                            onClick={() => removeModel(model.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Local Endpoints Toggle */}
        <div className="flex items-center space-x-2 p-4 border rounded-lg">
          <Switch
            id="local-endpoints"
            checked={useLocalEndpoints}
            onCheckedChange={setUseLocalEndpoints}
          />
          <Label htmlFor="local-endpoints" className="text-sm font-medium">
            Use local endpoints for model instances (Optional)
          </Label>
        </div>

        {/* Selection Summary */}
        {selectedModels.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Selected Models ({selectedModels.length}):</h4>
            <div className="flex flex-wrap gap-2">
              {selectedModels.map((model) => (
                <Badge key={model.id} variant="outline" className="bg-white">
                  {model.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </>
  );
}
