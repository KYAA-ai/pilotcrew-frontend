import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Target, Thermometer } from "lucide-react";
import { useState } from "react";

export default function Step4ParameterConfiguration() {
  const [temperature, setTemperature] = useState([0.7]);
  const [topP, setTopP] = useState([0.9]);
  const [topK, setTopK] = useState([50]);

  return (
    <>
      <CardContent className="overflow-y-auto space-y-8 h-full">
        <p className="text-muted-foreground">Configure the parameters for your evaluation. These settings will be applied to all selected models.</p>
        
        {/* Temperature Slider */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-blue-600" />
            <Label className="text-base font-medium">Temperature</Label>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>0.0 (Deterministic)</span>
              <span>1.0 (Creative)</span>
            </div>
            <Slider
              value={temperature}
              onValueChange={setTemperature}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-lg font-semibold text-blue-600">{temperature[0]}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Top P Slider */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            <Label className="text-base font-medium">Top P (Nucleus Sampling)</Label>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>0.0 (Conservative)</span>
              <span>1.0 (Diverse)</span>
            </div>
            <Slider
              value={topP}
              onValueChange={setTopP}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-lg font-semibold text-purple-600">{topP[0]}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Top K Slider */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            <Label className="text-base font-medium">Top K</Label>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>1 (Most Likely)</span>
              <span>100 (Diverse)</span>
            </div>
            <Slider
              value={topK}
              onValueChange={setTopK}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-lg font-semibold text-green-600">{topK[0]}</span>
            </div>
          </div>
        </div>

      </CardContent>
    </>
  );
}
