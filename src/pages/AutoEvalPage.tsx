import ConfigurationSummary from "@/components/ConfigurationSummary";
import type { StepConfig, StepProgress } from "@/components/MultiStepForm";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";
import React, { useCallback, useState } from "react"; // Added useEffect import


import Step1UploadDataset from "./steps/Step1UploadDataset";
import Step2TaskTypeSelection from "./steps/Step2TaskTypeSelection";
import Step3ModelSelection from "./steps/Step3ModelSelection";
import Step4ParameterConfiguration from "./steps/Step4ParameterConfiguration";
import Step5MetricsSelection from "./steps/Step5MetricsSelection";
import Step6ReviewLaunch from "./steps/Step6ReviewLaunch";

// Step configuration
const STEPS: StepConfig[] = [
  { id: 1, name: "Upload dataset", component: Step1UploadDataset },
  { id: 2, name: "Task Type Selection", component: Step2TaskTypeSelection },
  { id: 3, name: "Model Selection", component: Step3ModelSelection },
  { id: 4, name: "Parameter Configuration", component: Step4ParameterConfiguration },
  { id: 5, name: "Metrics Selection", component: Step5MetricsSelection },
  { id: 6, name: "Review & Launch", component: Step6ReviewLaunch },
];

export default function AutoEvalPage() {
  const [configuration, setConfiguration] = useState<{
    dataset?: { name: string; columns: string[]; inputColumn?: string; outputColumn?: string };
    tasks: string[];
    models: Array<{ id: string; name: string; provider: string; pricing: string; costPerMillionInputTokens: string; costPerMillionOutputTokens: string; logo: string }>;
    parameters?: Record<string, { temperature: number; topP: number; maxTokens: number }>;
    metrics?: { passAtK?: string; textMetrics: string[] };
  }>({
    dataset: undefined,
    tasks: [],
    models: [],
    parameters: undefined,
    metrics: undefined,
  });

  const submitProgressToAPI = useCallback(async (progress: StepProgress[]) => {
    try {
      const response = await fetch('/api/autoeval/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progress,
          configuration,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Progress submitted successfully:', result);
      return result;
    } catch (error) {
      console.error('Error submitting progress:', error);
      throw error;
    }
  }, [configuration]);

  const handleStepComplete = useCallback(async (stepId: number, stepData?: Record<string, unknown>) => {
    console.log(`AutoEval Step ${stepId} completed with data:`, stepData);
    switch (stepId) {
      case 1:
        console.log('Dataset upload completed');
        break;
      case 2:
        console.log('Task selection completed');
        break;
      case 3:
        console.log('Model selection completed');
        break;
      case 4:
        console.log('Parameter configuration completed');
        break;
      case 5:
        console.log('Metrics selection completed');
        break;
      case 6:
        console.log('Final review completed');
        break;
    }
  }, []);

  const handleLaunch = useCallback(async () => {
    console.log('Launching AutoEval evaluation with configuration:', configuration);
    try {
      const response = await fetch('/api/autoeval/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configuration),
      });

      if (!response.ok) {
        throw new Error(`Launch failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Evaluation launched successfully:', result);

    } catch (error) {
      console.error('Failed to launch evaluation:', error);
      throw error;
    }
  }, [configuration]);

  const handleConfigurationUpdate = (stepConfig: Partial<typeof configuration>) => {
    setConfiguration(prev => ({
      ...prev,
      ...stepConfig
    }));
  };

  const renderRightPanel = ({ configuration, currentStep }: { configuration: Record<string, unknown>; currentStep: number }) => (
    <ConfigurationSummary
      config={configuration}
      currentStep={currentStep}
      isCompact={true}
    />
  );

  return (
    <div className="flex w-full h-full">
      {/* Left Container - Wizard */}
      <div 
        className={`h-full p-6 flex flex-col overflow-hidden relative transition-all duration-700 ease-in-out ${
          isStep6Transition ? 'w-full' : 'w-2/3'
        }`}
      >
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
              <BreadcrumbPage>Wizard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Main Heading */}
        <div className="flex items-center gap-3 mb-6 flex-shrink-0">
          <div className="p-2 bg-purple-900/20 rounded-lg">
            <Wand2 className="h-6 w-6 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold">Evaluation Setup Wizard</h1>
        </div>
        
        {/* Content area for future components */}
        <div className="flex-1 overflow-hidden">
          <Card className="h-full">
            <CardHeader className="relative">
              {/* Breadcrumb at the top */}
              <Breadcrumb className="mb-4">
                <BreadcrumbList>
                  {STEPS.slice(0, currentStep).map((step, index) => (
                    <React.Fragment key={step.id}>
                      <BreadcrumbItem>
                        {index === currentStep - 1 ? (
                          // Current step - not clickable
                          <BreadcrumbPage className="text-sm text-muted-foreground">
                            {step.name}
                          </BreadcrumbPage>
                        ) : (
                          // Previous steps - clickable
                                                          <button 
                                  className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                                  onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    setCurrentStep(step.id);
                                  }}
                                >
                                  {step.name}
                                </button>
                        )}
                      </BreadcrumbItem>
                      {index < currentStep - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
              
              {/* Step title and navigation buttons */}
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Step {currentStep} of 6</CardTitle>
                  <h2 className="text-2xl font-semibold mt-2">{STEPS[currentStep - 1].name}</h2>
                </div>
                {currentStep === 6 ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={handlePrevious}
                      className="border border-blue-400 text-white hover:text-blue-400 hover:bg-blue-400/10 px-4 py-2 text-sm transition-colors"
                      size="sm"
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={handleLaunch}
                      disabled={isLaunching}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm"
                      size="sm"
                    >
                      {isLaunching ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                          Launching...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Launch Evaluation
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handlePrevious}
                      disabled={isFirstStep}
                      className={`border border-blue-400 text-white hover:text-blue-400 hover:bg-blue-400/10 px-4 py-2 text-sm transition-colors ${
                        isFirstStep ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      size="sm"
                      variant="outline"
                    >
                      Previous
                    </Button>

                    <Button
                      onClick={handleNext}
                      disabled={isLastStep}
                      className={`border border-blue-400 text-white hover:text-blue-400 hover:bg-blue-400/10 px-4 py-2 text-sm transition-colors ${
                        isLastStep ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      size="sm"
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            {currentStep === 6 ? (
              <CurrentStepComponent configuration={configuration} currentStep={currentStep} />
            ) : (
              <CurrentStepComponent 
                onConfigurationUpdate={handleConfigurationUpdate}
                initialConfig={configuration}
              />
            )}
          </Card>
        </div>
      </div>
      
      {/* Right Container - Configuration Summary */}
      <div 
        className={`h-full p-6 overflow-hidden transition-all duration-700 ease-in-out ${
          isStep6Transition 
            ? 'w-0 opacity-0 translate-x-full' 
            : 'w-1/3 opacity-100 translate-x-0'
        }`}
      >
        <ConfigurationSummary 
          config={configuration}
          currentStep={currentStep}
          isCompact={true}
        />
      </div>
    </div>
  );
}
