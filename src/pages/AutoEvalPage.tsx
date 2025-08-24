import ConfigurationSummary from "@/components/ConfigurationSummary";
import MultiStepForm, { type StepConfig } from "@/components/MultiStepForm";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, Play, Wand2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import type { AutoEvalConfiguration } from "@/types/shared";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import Step1UploadDataset from "./steps/Step1UploadDataset";
import Step2TaskTypeSelection from "./steps/Step2TaskTypeSelection";
import Step3ModelSelection from "./steps/Step3ModelSelection";
import Step4ParameterConfiguration from "./steps/Step4ParameterConfiguration";
import Step5MetricsSelection from "./steps/Step5MetricsSelection";
import Step6ReviewLaunch from "./steps/Step6ReviewLaunch";

export default function AutoEvalPage() {
  const navigate = useNavigate();
  const [configuration, setConfiguration] = useState<AutoEvalConfiguration>({
    dataset: undefined,
    tasks: [],
    models: [],
    parameters: undefined,
    metrics: undefined,
  });

  const [showConfigSummary, setShowConfigSummary] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLaunching, setIsLaunching] = useState(false);

  // Check if user has started working on the page
  const hasUserStarted = () => {
    return !!(
      configuration.dataset?.datasetId ||
      configuration.tasks.length > 0 ||
      configuration.models.length > 0 ||
      configuration.parameters ||
      configuration.metrics
    );
  };

  // Validation functions for each step
  const validateStep1 = (config: AutoEvalConfiguration) => {
    const issues: string[] = [];
    
    if (!config.dataset?.datasetId) {
      issues.push("No dataset has been uploaded yet");
    }
    
    if (!config.dataset?.columns || config.dataset.columns.length === 0) {
      issues.push("Dataset columns have not been loaded");
    }
    
    if (!config.dataset?.inputColumn) {
      issues.push("Input column has not been selected");
    }
    
    if (!config.dataset?.outputColumn) {
      issues.push("Output column has not been selected");
    }
    
    return {
      isValid: issues.length === 0,
      reason: issues.length > 0 ? "Dataset configuration incomplete" : undefined,
      details: issues.length > 0 ? issues : undefined
    };
  };

  const validateStep2 = (config: AutoEvalConfiguration) => {
    const issues: string[] = [];
    
    if (!config.tasks || config.tasks.length === 0) {
      issues.push("No task type has been selected");
    }
    
    if (config.tasks && config.tasks.length > 0) {
      const task = config.tasks[0];
      if (!task.prompt || task.prompt.trim() === "") {
        issues.push("Task prompt is empty");
      }
    }
    
    return {
      isValid: issues.length === 0,
      reason: issues.length > 0 ? "Task configuration incomplete" : undefined,
      details: issues.length > 0 ? issues : undefined
    };
  };

  const validateStep3 = (config: AutoEvalConfiguration) => {
    const issues: string[] = [];
    
    if (!config.models || config.models.length === 0) {
      issues.push("No models have been selected");
    }
    
    return {
      isValid: issues.length === 0,
      reason: issues.length > 0 ? "Model selection incomplete" : undefined,
      details: issues.length > 0 ? issues : undefined
    };
  };

  const validateStep4 = (config: AutoEvalConfiguration) => {
    const issues: string[] = [];
    
    if (!config.models || config.models.length === 0) {
      issues.push("No models are available for parameter configuration");
      return {
        isValid: false,
        reason: "No models selected",
        details: issues
      };
    }
    
    if (!config.parameters) {
      issues.push("Model parameters have not been configured");
    } else {
      config.models.forEach(model => {
        if (!config.parameters![model.id]) {
          issues.push(`Parameters for ${model.name} are not configured`);
        }
      });
    }
    
    return {
      isValid: issues.length === 0,
      reason: issues.length > 0 ? "Parameter configuration incomplete" : undefined,
      details: issues.length > 0 ? issues : undefined
    };
  };

  const validateStep5 = (config: AutoEvalConfiguration) => {
    const issues: string[] = [];
    
    if (!config.metrics) {
      issues.push("No metrics have been selected");
    } else {
      if (!config.metrics.textMetrics || config.metrics.textMetrics.length === 0) {
        issues.push("No text evaluation metrics have been selected");
      }
      
      if (!config.metrics.passAtK || config.metrics.passAtK.trim() === "") {
        issues.push("Pass@K value has not been selected");
      }
    }
    
    return {
      isValid: issues.length === 0,
      reason: issues.length > 0 ? "Metrics selection incomplete" : undefined,
      details: issues.length > 0 ? issues : undefined
    };
  };

  const steps: StepConfig[] = [
    {
      id: 1,
      name: "Upload dataset",
      component: Step1UploadDataset,
      validateStep: validateStep1,
      hidePreviousButton: true,
      hideShowSummaryButton: false,
      hideNextButton: false,
    },
    {
      id: 2,
      name: "Task Type Selection",
      component: Step2TaskTypeSelection,
      validateStep: validateStep2,
      hidePreviousButton: false,
      hideShowSummaryButton: false,
      hideNextButton: false,
    },
    {
      id: 3,
      name: "Model Selection",
      component: Step3ModelSelection,
      validateStep: validateStep3,
      hidePreviousButton: false,
      hideShowSummaryButton: false,
      hideNextButton: false,
    },
    {
      id: 4,
      name: "Parameter Configuration",
      component: Step4ParameterConfiguration,
      validateStep: validateStep4,
      hidePreviousButton: false,
      hideShowSummaryButton: false,
      hideNextButton: false,
    },
    {
      id: 5,
      name: "Metrics Selection",
      component: Step5MetricsSelection,
      validateStep: validateStep5,
      hidePreviousButton: false,
      hideShowSummaryButton: false,
      hideNextButton: false,
    },
    {
      id: 6,
      name: "Review & Launch",
      component: Step6ReviewLaunch,
      hidePreviousButton: false,
      hideShowSummaryButton: true,
      hideNextButton: true,
    }
  ];

  const handleLaunch = useCallback(async (finalConfig: unknown) => {    
    setIsLaunching(true);
    const config = finalConfig as AutoEvalConfiguration;
    const generationOpts = {
      dataset: {
        name: config.dataset?.name || '',
        datasetId: config.dataset?.datasetId || '',
        columns: config.dataset?.columns || [],
        inputColumn: config.dataset?.inputColumn || '',
        outputColumn: config.dataset?.outputColumn || '',
      },
      tasks: config.tasks?.map(task => task.id) || [],
      models: config.models?.map(model => ({
        id: model.id,
        name: model.name,
        provider: model.provider,
        pricing: model.pricing,
        costPerMillionInputTokens: model.costPerMillionInputTokens,
        costPerMillionOutputTokens: model.costPerMillionOutputTokens,
        temperature: config.parameters?.[model.id]?.temperature || 0,
        topP: config.parameters?.[model.id]?.topP || 0,
        maxTokens: config.parameters?.[model.id]?.maxTokens || 500,
      })) || [],
      parameters: config.parameters || {},
      metrics: {
        passAtK: config.metrics?.passAtK || '1',
        textMetrics: config.metrics?.textMetrics || [],
      },
    };

    try {
      const response = await apiClient.post('/v1/autoeval/workflow', { generationOpts });
      console.log('✅ Evaluation launched successfully:', response.data);
      toast.success('Evaluation launched successfully!', {
        description: 'Your AutoEval workflow has been queued. Track the status in Run & Monitor.',
      });

      // Navigate to status page with configuration data
      navigate('/autoeval/status', { 
        state: { configuration: config } 
      });

    } catch (error) {
      toast.error('Failed to launch evaluation', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsLaunching(false);
    }
  }, [navigate]);

  const handleConfigurationUpdate = useCallback((newConfig: unknown) => {
    setConfiguration(newConfig as AutoEvalConfiguration);
  }, []);

  return (
    <div className="flex w-full h-full">
      <div className={`h-full p-6 flex flex-col overflow-hidden relative ${showConfigSummary ? 'w-2/3' : 'w-full'}`}>
        <div className="flex items-center gap-3 mb-6 flex-shrink-0">
          <div className="p-2 bg-purple-900/20 rounded-lg">
            <Wand2 className="h-6 w-6 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold">Evaluation Dashboard</h1>
          <div className="ml-auto">
            {!steps[currentStep - 1]?.hideShowSummaryButton && (
              <Button
                onClick={() => setShowConfigSummary(!showConfigSummary)}
                variant="outline"
                size="sm"
                className="border border-blue-400 text-white hover:text-blue-400 hover:bg-blue-400/10"
              >
                {showConfigSummary ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Summary
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Summary
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <MultiStepForm
            steps={steps}
            initialConfig={configuration}
            onConfigurationUpdate={handleConfigurationUpdate}
            onComplete={handleLaunch}
            onStepChange={setCurrentStep}
            renderHeader={(currentStep, totalSteps, stepName) => (
              <div>
                <h2 className="text-2xl font-semibold">Step {currentStep} of {totalSteps}</h2>
                <p className="text-lg text-muted-foreground mt-1">{stepName}</p>
              </div>
            )}
            renderNavigation={({ currentStep, totalSteps, onNext, onPrevious, onComplete, canGoNext, canGoPrevious, validationState, hidePreviousButton, hideNextButton }) => (
              <div className="space-y-3">
                <div className="flex gap-2">
                  {!hidePreviousButton && (
                    <Button
                      onClick={onPrevious}
                      disabled={!canGoPrevious}
                      className="border border-blue-400 text-white hover:text-blue-400 hover:bg-blue-400/10 px-4 py-2 text-sm transition-colors"
                      size="sm"
                      variant="outline"
                    >
                      Previous
                    </Button>
                  )}
                  {currentStep === totalSteps ? (
                    <Button
                      onClick={onComplete}
                      disabled={isLaunching}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm"
                      size="sm"
                    >
                      {isLaunching ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Launching...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Launch Evaluation
                        </>
                      )}
                    </Button>
                  ) : (
                    !hideNextButton && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Button
                                onClick={onNext}
                                disabled={!canGoNext}
                                className="border border-blue-400 text-white hover:text-blue-400 hover:bg-blue-400/10 px-4 py-2 text-sm transition-colors"
                                size="sm"
                                variant="outline"
                              >
                                Next
                              </Button>
                            </div>
                          </TooltipTrigger>
                          {!validationState.isValid && hasUserStarted() && (
                            <TooltipContent side="top" className="max-w-sm bg-blue-900/90 border border-blue-400/30 text-white">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-blue-300" />
                                  <p className="font-medium text-blue-200">
                                    {validationState.reason}
                                  </p>
                                </div>
                                {validationState.details && validationState.details.length > 0 && (
                                  <ul className="text-sm text-blue-100 space-y-1">
                                    {validationState.details.map((detail, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <span className="text-blue-300 mt-1">•</span>
                                        <span>{detail}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    )
                  )}
                </div>
              </div>
            )}
          />
        </div>
      </div>
      
      {showConfigSummary && (
        <div className="h-full p-6 overflow-hidden w-1/3">
          <ConfigurationSummary 
            config={configuration}
            currentStep={1}
            isCompact={true}
          />
        </div>
      )}
    </div>
  );
}
