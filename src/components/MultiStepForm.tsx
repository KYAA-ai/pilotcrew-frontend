import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import type { AutoEvalConfiguration } from '@/types/shared';
import React, { useCallback, useEffect, useState } from 'react';

export interface StepConfig {
  id: number;
  name: string;
  component: React.ComponentType<Record<string, unknown>>;
  onStepComplete?: (stepData: unknown, fullConfig: unknown) => Promise<void> | void;
  onStepEnter?: (stepData: unknown, fullConfig: unknown) => Promise<void> | void;
  validateStep?: (config: AutoEvalConfiguration) => { isValid: boolean; reason?: string; details?: string[] };
  hidePreviousButton?: boolean;
  hideShowSummaryButton?: boolean;
  hideNextButton?: boolean;
}

export interface MultiStepFormProps {
  steps: StepConfig[];
  initialConfig?: unknown;
  onConfigurationUpdate?: (config: unknown) => void;
  onComplete?: (finalConfig: unknown) => Promise<void> | void;
  onStepChange?: (step: number) => void;
  renderHeader?: (currentStep: number, totalSteps: number, stepName: string) => React.ReactNode;
  renderNavigation?: (props: {
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onPrevious: () => void;
    onComplete?: () => void;
    canGoNext: boolean;
    canGoPrevious: boolean;
    validationState: { isValid: boolean; reason?: string; details?: string[] };
    hidePreviousButton?: boolean;
    hideShowSummaryButton?: boolean;
    hideNextButton?: boolean;
  }) => React.ReactNode;
}

export default function MultiStepForm({
  steps,
  initialConfig = {},
  onConfigurationUpdate,
  onComplete,
  onStepChange,
  renderHeader,
  renderNavigation
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [configuration, setConfiguration] = useState(initialConfig);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Add step-specific state storage
  const [stepStates, setStepStates] = useState<Record<number, unknown>>({});
  // Add validation state
  const [validationState, setValidationState] = useState<{ isValid: boolean; reason?: string; details?: string[] }>({ isValid: false });

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleConfigurationUpdate = useCallback((stepConfig: unknown) => {
    setConfiguration((prev: unknown) => {
      let newConfig: unknown;
      
      // Check if stepConfig is a function (updater pattern)
      if (typeof stepConfig === 'function') {
        newConfig = (stepConfig as (prev: unknown) => unknown)(prev);
      } else {
        // Direct object update - spread previous state
        newConfig = {
          ...(prev as Record<string, unknown>),
          ...(stepConfig as Record<string, unknown>)
        };
      }
      
      return newConfig;
    });
  }, [currentStep, configuration]);

  // Handle configuration updates to parent component
  useEffect(() => {
    if (onConfigurationUpdate) {
      onConfigurationUpdate(configuration);
    }
  }, [configuration, onConfigurationUpdate]);

  // Notify parent of step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  // Add function to update step-specific state
  const handleStepStateUpdate = useCallback((stepId: number, stepState: unknown) => {
    setStepStates((prev) => ({
      ...prev,
      [stepId]: stepState
    }));
  }, []);

  // Add function to get step-specific state
  const getStepState = useCallback((stepId: number) => {
    return stepStates[stepId] || {};
  }, [stepStates]);

  const handleStepComplete = useCallback(async (stepData: unknown) => {
    const currentStepConfig = steps[currentStep - 1];
    if (currentStepConfig.onStepComplete) {
      try {
        setIsProcessing(true);
        await currentStepConfig.onStepComplete(stepData, configuration);
      } catch (error) {
        console.error('❌ Step completion callback failed:', error);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    }
  }, [currentStep, configuration, steps]);

  const handleStepEnter = useCallback(async () => {
    const currentStepConfig = steps[currentStep - 1];
    if (currentStepConfig.onStepEnter) {
      try {
        setIsProcessing(true);
        await currentStepConfig.onStepEnter(configuration, configuration);
      } catch (error) {
        console.error('❌ Step entry callback failed:', error);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    }
  }, [currentStep, configuration, steps, stepStates]);

  useEffect(() => {
    handleStepEnter();
  }, [currentStep, handleStepEnter]);


  useEffect(() => {
    const currentStepConfig = steps[currentStep - 1];
    if (currentStepConfig?.validateStep) {
      const validation = currentStepConfig.validateStep(configuration as AutoEvalConfiguration);
      setValidationState(validation);
    } else {
      setValidationState({ isValid: true });
    }
  }, [configuration, currentStep, steps]);

  const handleNext = useCallback(async () => {
    
    try {
      await handleStepComplete(configuration);
      
      if (currentStep < steps.length) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
      }
    } catch (error) {
      console.error('❌ Failed to complete step:', error);
    }
  }, [currentStep, steps.length, configuration, handleStepComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
    }
  }, [currentStep]);

  const handleComplete = useCallback(async () => {    
    try {
      await handleStepComplete(configuration);
      
      if (onComplete) {
        await onComplete(configuration);
      }
    } catch (error) {
      console.error('❌ Failed to complete final step:', error);
      throw error;
    }
  }, [currentStep, configuration, handleStepComplete, onComplete]);

  const CurrentStepComponent = steps[currentStep - 1]?.component;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;
  const canGoNext = !isLastStep && !isProcessing && validationState.isValid;
  const canGoPrevious = !isFirstStep && !isProcessing;

  if (!CurrentStepComponent) {
    return <div>Error: Step {currentStep} not found</div>;
  }

  return (
    <div className="flex w-full h-full">
      <div className={`h-full flex flex-col overflow-auto relative w-full ${isMobile ? 'p-3' : 'p-6'}`}>
        <Breadcrumb className={`mb-4 flex-shrink-0 ${isMobile ? 'text-xs' : ''}`}>
          <BreadcrumbList className={isMobile ? 'flex-wrap' : ''}>
            {steps.slice(0, currentStep).map((step, index) => (
              <React.Fragment key={step.id}>
                <BreadcrumbItem>
                  {index === currentStep - 1 ? (
                    <BreadcrumbPage className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {step.name}
                    </BreadcrumbPage>
                  ) : (
                    <button 
                      className={`text-muted-foreground hover:text-foreground cursor-pointer ${isMobile ? 'text-xs' : 'text-sm'}`}
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

        <div className={`flex justify-between items-start ${isMobile ? 'flex-col gap-4' : ''}`}>
          {renderHeader ? (
            renderHeader(currentStep, steps.length, steps[currentStep - 1]?.name || '')
          ) : (
            <div>
              <CardTitle className={`pb-2 ${isMobile ? 'text-lg' : ''}`}>Step {currentStep} of {steps.length}</CardTitle>
              <h2 className={`font-semibold mt-2 ${isMobile ? 'text-xl' : 'text-2xl'}`}>{steps[currentStep - 1]?.name}</h2>
            </div>
          )}

          {renderNavigation ? (
            renderNavigation({
              currentStep,
              totalSteps: steps.length,
              onNext: handleNext,
              onPrevious: handlePrevious,
              onComplete: handleComplete,
              canGoNext,
              canGoPrevious,
              validationState,
              hidePreviousButton: steps[currentStep - 1]?.hidePreviousButton,
              hideShowSummaryButton: steps[currentStep - 1]?.hideShowSummaryButton,
              hideNextButton: steps[currentStep - 1]?.hideNextButton
            })
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handlePrevious}
                disabled={!canGoPrevious}
                className="border border-blue-400 text-white hover:text-blue-400 hover:bg-blue-400/10 px-4 py-2 text-sm transition-colors"
                size="sm"
                variant="outline"
              >
                Previous
              </Button>
              {isLastStep ? (
                <Button
                  onClick={handleComplete}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm"
                  size="sm"
                >
                  {isProcessing ? 'Processing...' : 'Complete'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className="border border-blue-400 text-white hover:text-blue-400 hover:bg-blue-400/10 px-4 py-2 text-sm transition-colors"
                  size="sm"
                  variant="outline"
                >
                  Next
                </Button>
              )}
            </div>
          )}
        </div>

        <Card className={`flex-1 mt-4 overflow-hidden ${isMobile ? 'mt-2 w-full h-auto' : ''}`}>
          <CardContent className={`${isMobile ? 'h-auto p-0 overflow-visible' : 'h-full overflow-auto p-0'}`}>
            {(() => {
              try {
                const stepProps = {
                  onConfigurationUpdate: handleConfigurationUpdate,
                  initialConfig: configuration,
                  currentStep,
                  totalSteps: steps.length,
                  // Add step state management props
                  stepState: getStepState(currentStep),
                  onStepStateUpdate: (state: unknown) => handleStepStateUpdate(currentStep, state)
                };

                // Add additional props for Step 6 (mobile launch button)
                if (currentStep === 6) {
                  Object.assign(stepProps, {
                    onComplete,
                    isProcessing
                  });
                }

                return (
                  <CurrentStepComponent 
                    {...stepProps}
                  />
                );
              } catch (error) {
                console.error('❌ Error rendering step component:', error);
                return (
                  <div className={isMobile ? 'p-3' : 'p-6'}>
                    <p className="text-red-500">Error loading step {currentStep}. Please try refreshing the page.</p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
