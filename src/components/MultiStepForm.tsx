import React, { useEffect, useState, useCallback } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";

// Step configuration interface
export interface StepConfig {
  id: number;
  name: string;
  component: React.ComponentType<Record<string, unknown>>;
}

// Progress tracking interface
export interface StepProgress {
  stepId: number;
  stepName: string;
  completed: boolean;
  completedAt?: Date;
  data?: Record<string, unknown>;
}

// MultiStepForm props interface
export interface MultiStepFormProps {
  steps: StepConfig[];
  title?: string;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
  configuration: Record<string, unknown>;
  onConfigurationUpdate: (config: Record<string, unknown>) => void;
  onStepComplete?: (stepId: number, stepData?: Record<string, unknown>) => Promise<void>;
  onLaunch?: () => Promise<void>;
  showProgressDebug?: boolean;
  submitProgressToAPI?: (progress: StepProgress[]) => Promise<void>;
  renderRightPanel?: (props: {
    configuration: Record<string, unknown>;
    currentStep: number;
  }) => React.ReactNode;
  className?: string;
}

export default function MultiStepForm({
  steps,
  title = "Multi-Step Form",
  breadcrumbItems = [],
  configuration,
  onConfigurationUpdate,
  onStepComplete,
  onLaunch,
  showProgressDebug = false,
  submitProgressToAPI,
  renderRightPanel,
  className = "",
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isStep6Transition, setIsStep6Transition] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  
  // Progress tracking state
  const [stepProgress, setStepProgress] = useState<StepProgress[]>([]);
  const [isSubmittingProgress, setIsSubmittingProgress] = useState(false);

  // Hook to handle step completion
  const handleStepCompletion = useCallback(async (stepId: number, stepData?: Record<string, unknown>) => {
    const stepName = steps.find(step => step.id === stepId)?.name || `Step ${stepId}`;
    
    const newProgress: StepProgress = {
      stepId,
      stepName,
      completed: true,
      completedAt: new Date(),
      data: stepData,
    };

    // Update progress state
    setStepProgress(prev => {
      const existingIndex = prev.findIndex(p => p.stepId === stepId);
      if (existingIndex >= 0) {
        // Update existing progress
        const updated = [...prev];
        updated[existingIndex] = newProgress;
        return updated;
      } else {
        // Add new progress
        return [...prev, newProgress];
      }
    });

    // Console log the progress
    console.log(`Step ${stepId} completed:`, {
      stepName,
      completedAt: newProgress.completedAt,
      data: stepData,
      totalProgress: stepProgress.length + 1,
    });

    // Call custom step completion handler
    if (onStepComplete) {
      try {
        await onStepComplete(stepId, stepData);
      } catch (error) {
        console.warn('Step completion handler failed:', error);
      }
    }

    // Submit progress to API if provided
    if (submitProgressToAPI) {
      try {
        await submitProgressToAPI([...stepProgress, newProgress]);
      } catch (error) {
        console.warn('Failed to submit progress to API, but continuing...', error);
      }
    }
  }, [steps, stepProgress, onStepComplete, submitProgressToAPI]);

  // Trigger transition when entering final step
  useEffect(() => {
    if (currentStep === steps.length) {
      const timer = setTimeout(() => {
        setIsStep6Transition(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsStep6Transition(false);
    }
  }, [currentStep, steps.length]);

  const handleNext = async () => {
    if (currentStep < steps.length) {
      // Handle step completion before moving to next step
      await handleStepCompletion(currentStep, configuration);
      
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLaunch = async () => {
    setIsLaunching(true);
    
    // Handle final step completion
    await handleStepCompletion(steps.length, configuration);
    
    // Call custom launch handler
    if (onLaunch) {
      try {
        await onLaunch();
      } catch (error) {
        console.error('Launch handler failed:', error);
      }
    }
    
    setIsLaunching(false);
  };

  // Function to manually trigger progress submission (for testing)
  const submitCurrentProgress = async () => {
    if (!submitProgressToAPI) return;
    
    try {
      setIsSubmittingProgress(true);
      await submitProgressToAPI(stepProgress);
      console.log('Current progress submitted manually');
    } catch (error) {
      console.error('Failed to submit current progress:', error);
    } finally {
      setIsSubmittingProgress(false);
    }
  };

  // Function to check if configuration has meaningful data
  const hasConfigurationData = useCallback(() => {
    if (!configuration || typeof configuration !== 'object') return false;
    
    // Check if any of the main configuration properties have data
    const configKeys = Object.keys(configuration);
    return configKeys.some(key => {
      const value = configuration[key];
      if (value === undefined || value === null) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.keys(value).length > 0;
      return true;
    });
  }, [configuration]);

  const CurrentStepComponent = steps[currentStep - 1].component;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;
  const shouldShowRightPanel = renderRightPanel && hasConfigurationData();

  return (
    <div className={`h-full flex flex-col overflow-hidden ${className}`}>
      <div className="flex w-full h-full">
        {/* Left Container - Wizard */}
        <div 
          className={`h-full p-6 flex flex-col overflow-hidden relative transition-all duration-700 ease-in-out ${
            isStep6Transition || !shouldShowRightPanel ? 'w-full' : 'w-2/3'
          }`}
        >
          {/* Breadcrumb */}
          {breadcrumbItems.length > 0 && (
            <Breadcrumb className="mb-4 flex-shrink-0">
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {item.href ? (
                        <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
          
          {/* Main Heading */}
          <h1 className="text-3xl font-bold mb-6 flex-shrink-0">{title}</h1>
          
          {/* Progress Debug Info */}
          {showProgressDebug && (
            <div className="mb-4 p-4 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-100">
                      Progress Tracking
                    </span>
                  </div>
                  <div className="text-sm text-slate-300">
                    {stepProgress.length} of {steps.length} steps completed
                  </div>
                  {stepProgress.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-slate-400">Steps:</span>
                      <div className="flex space-x-1">
                        {stepProgress.map((p) => (
                          <span 
                            key={p.stepId}
                            className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full"
                          >
                            {p.stepId}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {submitProgressToAPI && (
                  <button 
                    onClick={submitCurrentProgress}
                    disabled={isSubmittingProgress}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:text-slate-400 rounded-md transition-colors duration-200 shadow-sm hover:shadow-md border border-emerald-500/30"
                  >
                    {isSubmittingProgress ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Submit Progress
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Content area */}
          <div className="flex-1 overflow-hidden">
            <Card className="h-full">
              <CardHeader className="relative">
                {/* Step breadcrumb */}
                <Breadcrumb className="mb-4">
                  <BreadcrumbList>
                    {steps.slice(0, currentStep).map((step, index) => (
                      <React.Fragment key={step.id}>
                        <BreadcrumbItem>
                          {index === currentStep - 1 ? (
                            <BreadcrumbPage className="text-sm text-muted-foreground">
                              {step.name}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink 
                              href="#" 
                              className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentStep(step.id);
                              }}
                            >
                              {step.name}
                            </BreadcrumbLink>
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
                    <CardTitle>Step {currentStep} of {steps.length}</CardTitle>
                    <h2 className="text-2xl font-semibold mt-2">{steps[currentStep - 1].name}</h2>
                  </div>
                  {isLastStep ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={handlePrevious}
                        className="border border-slate-400 text-white hover:bg-blue-600 hover:border-blue-600 px-4 py-2 text-sm transition-colors duration-200"
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
                            Launch
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                                              <Button
                          onClick={handlePrevious}
                          disabled={isFirstStep}
                          className={`border border-slate-400 text-white hover:bg-blue-600 hover:border-blue-600 px-4 py-2 text-sm transition-colors duration-200 ${
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
                          className={`border border-slate-400 text-white hover:bg-blue-600 hover:border-blue-600 px-4 py-2 text-sm transition-colors duration-200 ${
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
              <CurrentStepComponent 
                onConfigurationUpdate={onConfigurationUpdate}
                initialConfig={configuration}
                configuration={configuration}
                currentStep={currentStep}
              />
            </Card>
          </div>
        </div>
        
        {/* Right Container - Optional */}
        {shouldShowRightPanel && (
          <div 
            className={`h-full p-6 overflow-hidden transition-all duration-700 ease-in-out ${
              isStep6Transition 
                ? 'w-0 opacity-0 translate-x-full' 
                : 'w-1/3 opacity-100 translate-x-0'
            }`}
          >
            {renderRightPanel({ configuration, currentStep })}
          </div>
        )}
      </div>
    </div>
  );
}
