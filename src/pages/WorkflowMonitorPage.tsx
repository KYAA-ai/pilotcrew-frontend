import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { HalfRadialProgress } from "@/components/ui/half-radial-progress";
import { Activity, Monitor, RefreshCw, Target, Thermometer } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

// Placeholder data for models in the workflow
const placeholderModelsData = {
  "deepseek-r1": {
    "bleu": 0.2904,
    "rougeL": 0.066,
    "meteor": 0.1556,
    "semantic": 0.4407,
    "perplexity": 21.5458,
    "bertScore": 0.4407,
    "exactMatch": 0,
    "f1Score": 0.1077,
    "passAtK": { "1": 0 },
    "topK": {
      "bleu": 0.29044197026576835,
      "rougeL": 0.06595608569959363,
      "meteor": 0.1556122448979592,
      "semantic": 0.44068029503918893,
      "perplexity": 21.545833333333334,
      "bertScore": 0.44068029503918893,
      "exactMatch": 0,
      "f1Score": 0.10771827092369313
    },
    "threshold": 0.8,
    "kValue": 1,
    "totalPasses": 0,
    "totalAttempts": 20,
    "averageScore": 0.4407,
    "inputTokens": 17527,
    "outputTokens": 8055,
    "rowsProcessed": 64,
    "totalRows": 100,
    "temperature": 0.7,
    "topP": 0.9,
    "maxTokens": 199,
    "modelStartedAt": "2025-08-19T23:33:50.189Z",
    "modelEndedAt": "2025-08-19T23:35:53.215Z",
    "tokensUsed": 25582
  },
  "claude-3-5-haiku": {
    "bleu": 0.3133,
    "rougeL": 0.0797,
    "meteor": 0.1668,
    "semantic": 0.527,
    "perplexity": 12.077,
    "bertScore": 0.527,
    "exactMatch": 0,
    "f1Score": 0.1289,
    "passAtK": { "1": 0 },
    "topK": {
      "bleu": 0.3132835281138299,
      "rougeL": 0.07971818355631163,
      "meteor": 0.16683673469387755,
      "semantic": 0.5269813712042367,
      "perplexity": 12.07702380952381,
      "bertScore": 0.5269813712042367,
      "exactMatch": 0,
      "f1Score": 0.1289028954110076
    },
    "threshold": 0.8,
    "kValue": 1,
    "totalPasses": 0,
    "totalAttempts": 20,
    "averageScore": 0.527,
    "inputTokens": 19982,
    "outputTokens": 2163,
    "rowsProcessed": 45,
    "totalRows": 100,
    "temperature": 0.9,
    "topP": 0.9,
    "maxTokens": 999,
    "modelStartedAt": "2025-08-19T23:33:50.188Z",
    "modelEndedAt": "2025-08-19T23:36:05.762Z",
    "tokensUsed": 22145
  },
  "llama3-2-1b-instruct": {
    "bleu": 0.3221,
    "rougeL": 0.1009,
    "meteor": 0.1819,
    "semantic": 0.6106,
    "perplexity": 67.4168,
    "bertScore": 0.6106,
    "exactMatch": 0,
    "f1Score": 0.3554,
    "passAtK": { "1": 0.1 },
    "topK": {
      "bleu": 0.3221189506777917,
      "rougeL": 0.10093264886727986,
      "meteor": 0.18188003062686992,
      "semantic": 0.6105734581714604,
      "perplexity": 67.41678166498204,
      "bertScore": 0.6105734581714604,
      "exactMatch": 0,
      "f1Score": 0.3553716064540319
    },
    "threshold": 0.8,
    "kValue": 1,
    "totalPasses": 2,
    "totalAttempts": 20,
    "averageScore": 0.6106,
    "inputTokens": 17816,
    "outputTokens": 16285,
    "rowsProcessed": 78,
    "totalRows": 100,
    "temperature": 0.2,
    "topP": 0.9,
    "maxTokens": 55,
    "modelStartedAt": "2025-08-19T23:33:50.189Z",
    "modelEndedAt": "2025-08-19T23:37:05.753Z",
    "tokensUsed": 34101
  }
};

// Model display names
const modelDisplayNames = {
  "deepseek-r1": "DeepSeek-R1",
  "claude-3-5-haiku": "Claude-3-5-Haiku",
  "llama3-2-1b-instruct": "Llama3-2-1B-Instruct"
};

export default function WorkflowMonitorPage() {
  const { workflowId } = useParams();
  const [selectedMonitors, setSelectedMonitors] = useState<Record<string, boolean>>({
    "deepseek-r1": true,
    "claude-3-5-haiku": true,
    "llama3-2-1b-instruct": true
  });
  const [tooltipStates, setTooltipStates] = useState<Record<string, { position: { x: number; y: number }; show: boolean }>>({});

  const handleRefresh = (modelId: string) => {
    console.log(`Refreshing data for model: ${modelId}`);
    // TODO: Implement refresh logic for specific model
  };

  const handleMonitorToggle = (modelId: string, checked: boolean) => {
    setSelectedMonitors(prev => ({
      ...prev,
      [modelId]: checked
    }));
  };

  const handleSelectAll = () => {
    const allChecked = Object.values(selectedMonitors).every(Boolean);
    const newState = Object.keys(selectedMonitors).reduce((acc, key) => {
      acc[key] = !allChecked;
      return acc;
    }, {} as Record<string, boolean>);
    setSelectedMonitors(newState);
  };

  const handleMouseMove = (modelId: string, event: React.MouseEvent) => {
    setTooltipStates(prev => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        position: { x: event.clientX, y: event.clientY }
      }
    }));
  };

  const handleMouseEnter = (modelId: string) => {
    setTooltipStates(prev => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        show: true
      }
    }));
  };

  const handleMouseLeave = (modelId: string) => {
    setTooltipStates(prev => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        show: false
      }
    }));
  };

  const formatTimeToHHMMSS = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m:${seconds.toString().padStart(2, '0')}s`;
  };

  const getTimeElapsed = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const elapsedMs = now.getTime() - start.getTime();
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    return formatTimeToHHMMSS(elapsedSeconds);
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${hours}h:${minutes}m:${seconds}s`;
  };

  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${month}-${day}-${year}`;
  };

  const visibleModels = Object.keys(placeholderModelsData).filter(
    modelId => selectedMonitors[modelId]
  );

  const allSelected = Object.values(selectedMonitors).every(Boolean);

  return (
    <div className="flex w-full h-full">
      <div className="h-full p-6 flex flex-col overflow-auto relative w-full">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4 flex-shrink-0">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/autoeval/monitors" className="text-sm text-muted-foreground hover:text-foreground">
                Running Monitors
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Workflow {workflowId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Main Heading */}
        <div className="flex items-center gap-3 mb-6 flex-shrink-0">
          <div className="p-2 bg-blue-900/20 rounded-lg">
            <Monitor className="h-6 w-6 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold">Workflow Monitor</h1>
        </div>

        {/* Combined Monitor Performance Card */}
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Monitor Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 overflow-auto">
              {/* Monitor Selection */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Select Monitors</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSelectAll}
                    className="text-xs h-7 px-2"
                  >
                    {allSelected ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {Object.keys(placeholderModelsData).map((modelId) => (
                    <div key={modelId} className="flex items-center space-x-2">
                      <Checkbox
                        id={modelId}
                        checked={selectedMonitors[modelId]}
                        onCheckedChange={(checked) => 
                          handleMonitorToggle(modelId, checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={modelId} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {modelDisplayNames[modelId as keyof typeof modelDisplayNames]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Performance Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                {visibleModels.map((modelId) => {
                  const modelData = placeholderModelsData[modelId as keyof typeof placeholderModelsData];
                  const displayName = modelDisplayNames[modelId as keyof typeof modelDisplayNames];
                  
                  return (
                    <Card key={modelId} className="flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{displayName}</CardTitle>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <Thermometer className="h-3 w-3 text-blue-600" />
                                <span className="text-xs text-gray-200">Temperature:</span>
                                <span className="text-xs font-medium text-gray-200">{modelData.temperature}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="h-3 w-3 text-purple-600" />
                                <span className="text-xs text-gray-200">Top P:</span>
                                <span className="text-xs font-medium text-gray-200">{modelData.topP}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="h-3 w-3 text-green-600" />
                                <span className="text-xs text-gray-200">Max Tokens:</span>
                                <span className="text-xs font-medium text-gray-200">{modelData.maxTokens}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRefresh(modelId)}
                            className="h-8 w-8 p-0"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-4">
                        {/* Progress Bar */}
                        <div className="flex justify-center">
                          <div
                            onMouseMove={(event) => handleMouseMove(modelId, event)}
                            onMouseEnter={() => handleMouseEnter(modelId)}
                            onMouseLeave={() => handleMouseLeave(modelId)}
                            className="relative"
                          >
                            <HalfRadialProgress
                              value={modelData.rowsProcessed}
                              max={modelData.totalRows}
                              size="lg"
                              label="Rows Processed"
                              className="mb-2"
                            />
                            {tooltipStates[modelId]?.show && (
                              <div
                                className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none"
                                style={{
                                  left: (tooltipStates[modelId]?.position.x || 0) + 10,
                                  top: (tooltipStates[modelId]?.position.y || 0) - 40,
                                }}
                              >
                                <div>Rows Processed: {modelData.rowsProcessed.toLocaleString()}</div>
                                <div>Rows Remaining: {(modelData.totalRows - modelData.rowsProcessed).toLocaleString()}</div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Mini Cards for Key Metrics - 2x3 Grid */}
                        <div className="grid grid-cols-3 gap-3">
                          {/* <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Average Score</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {(modelData.averageScore * 100).toFixed(1)}%
                            </div>
                          </div> */}
                          {/* <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">CPU Utilization</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              85.2%
                            </div>
                          </div> */}
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Tokens</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {modelData.tokensUsed.toLocaleString()}
                            </div>
                          </div>
                          {/* <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Pass@K</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {(modelData.passAtK["1"] * 100).toFixed(1)}%
                            </div>
                          </div> */}
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Input Tokens</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {modelData.inputTokens.toLocaleString()}
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Output Tokens</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {modelData.outputTokens.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Other Information - Dark Theme Nutrition Label Style */}
                        <div className="bg-gray-900 dark:bg-gray-800 rounded-lg border border-gray-700">
                          <div className="px-4 py-2 border-b border-gray-700">
                            <h4 className="text-sm font-bold text-white">Other Information</h4>
                          </div>
                          <div className="px-4 py-3 space-y-2">
                            <div className="flex justify-between items-center py-1">
                              <span className="text-xs text-gray-300">Total Time Elapsed</span>
                              <span className="text-xs font-medium text-white">{getTimeElapsed(modelData.modelStartedAt)}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                              <span className="text-xs text-gray-300">Start Time</span>
                              <span className="text-xs font-medium text-white">{formatTime(modelData.modelStartedAt)}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                              <span className="text-xs text-gray-300">Start Date</span>
                              <span className="text-xs font-medium text-white">{formatDate(modelData.modelStartedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
