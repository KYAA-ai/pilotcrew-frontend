import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Hash, Layers, Hash as SeedIcon, Target, Thermometer } from "lucide-react";
import { useState } from "react";

export default function Step4ParameterConfiguration() {
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState("1000");
  const [topP, setTopP] = useState([0.9]);
  const [samplesPerPrompt, setSamplesPerPrompt] = useState("1");
  const [passAtK, setPassAtK] = useState("1");
  const [seed, setSeed] = useState("");

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

        {/* Max Tokens Input */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-green-600" />
            <Label htmlFor="max-tokens" className="text-base font-medium">Max Tokens</Label>
          </div>
          <div className="space-y-2">
            <Input
              id="max-tokens"
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(e.target.value)}
              placeholder="Enter max tokens"
              className="w-full"
            />
            <p className="text-sm text-gray-600">Maximum number of tokens to generate per response</p>
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

        {/* Samples per Prompt */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-orange-600" />
            <Label htmlFor="samples" className="text-base font-medium">Samples per Prompt (n)</Label>
          </div>
          <div className="space-y-2">
            <Input
              id="samples"
              type="number"
              value={samplesPerPrompt}
              onChange={(e) => setSamplesPerPrompt(e.target.value)}
              placeholder="Enter number of samples"
              min="1"
              max="10"
              className="w-full"
            />
            <p className="text-sm text-gray-600">Number of responses to generate per input prompt</p>
          </div>
        </div>

        <Separator />

        {/* Pass@k Guidance */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-red-600" />
            <Label htmlFor="pass-at-k" className="text-base font-medium">Pass@k Guidance</Label>
          </div>
          <div className="space-y-2">
            <Input
              id="pass-at-k"
              type="number"
              value={passAtK}
              onChange={(e) => setPassAtK(e.target.value)}
              placeholder="Enter k value"
              min="1"
              max="100"
              className="w-full"
            />
            <p className="text-sm text-gray-600">k value for Pass@k evaluation metric</p>
          </div>
        </div>

        <Separator />

        {/* Seed */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <SeedIcon className="h-5 w-5 text-indigo-600" />
            <Label htmlFor="seed" className="text-base font-medium">Seed (Optional)</Label>
          </div>
          <div className="space-y-2">
            <Input
              id="seed"
              type="number"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="Enter seed for reproducibility"
              className="w-full"
            />
            <p className="text-sm text-gray-600">Random seed for reproducible results (leave empty for random)</p>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Current Configuration:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Temperature:</span> {temperature[0]}
            </div>
            <div>
              <span className="font-medium">Max Tokens:</span> {maxTokens}
            </div>
            <div>
              <span className="font-medium">Top P:</span> {topP[0]}
            </div>
            <div>
              <span className="font-medium">Samples:</span> {samplesPerPrompt}
            </div>
            <div>
              <span className="font-medium">Pass@k:</span> {passAtK}
            </div>
            <div>
              <span className="font-medium">Seed:</span> {seed || "Random"}
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
}
