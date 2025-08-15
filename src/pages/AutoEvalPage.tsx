
import { SiteHeader } from "@/components/employer-header";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Play } from "lucide-react";
import React, { useEffect, useState } from "react"; // Added useEffect import
import { AutoEvalSidebar } from "./AutoEvalSidebar";

// Import all step components
import Step1UploadDataset from "./steps/Step1UploadDataset";
import Step2TaskTypeSelection from "./steps/Step2TaskTypeSelection";
import Step3ModelSelection from "./steps/Step3ModelSelection";
import Step4ParameterConfiguration from "./steps/Step4ParameterConfiguration";
import Step5MetricsSelection from "./steps/Step5MetricsSelection";
import Step6ReviewLaunch from "./steps/Step6ReviewLaunch";

// Step configuration
const STEPS = [
  { id: 1, name: "Upload dataset", component: Step1UploadDataset },
  { id: 2, name: "Task Type Selection", component: Step2TaskTypeSelection },
  { id: 3, name: "Model Selection", component: Step3ModelSelection },
  { id: 4, name: "Parameter Configuration", component: Step4ParameterConfiguration },
  { id: 5, name: "Metrics Selection", component: Step5MetricsSelection },
  { id: 6, name: "Review & Launch", component: Step6ReviewLaunch },
];

export default function AutoEvalPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isStep6Transition, setIsStep6Transition] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  // Trigger transition when entering Step 6
  useEffect(() => {
    if (currentStep === 6) {
      // Small delay to ensure the step change is rendered first
      const timer = setTimeout(() => {
        setIsStep6Transition(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsStep6Transition(false);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLaunch = () => {
    setIsLaunching(true);
    // Simulate launch process
    setTimeout(() => {
      setIsLaunching(false);
      // Here you would typically navigate to results page or show success message
    }, 2000);
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === STEPS.length;

  return (
    <SidebarProvider
      defaultOpen={false}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AutoEvalSidebar collapsible="offcanvas" />
      <SidebarInset>
        <SiteHeader />
        <div className="h-[calc(100vh-var(--header-height))] bg-[var(--background)] flex flex-col overflow-hidden">
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
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>AutoEval</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
              {/* Main Heading */}
              <h1 className="text-3xl font-bold mb-6 flex-shrink-0">Evaluation Setup Wizard</h1>
              
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
                        <CardTitle>Step {currentStep} of 6</CardTitle>
                        <h2 className="text-2xl font-semibold mt-2">{STEPS[currentStep - 1].name}</h2>
                      </div>
                      {currentStep === 6 ? (
                        <div className="flex gap-2">
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
                            className={`border border-primary text-primary hover:bg-primary/10 px-4 py-2 text-sm ${
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
                            className={`border border-blue-400 text-blue-400 hover:bg-blue-400/10 px-4 py-2 text-sm ${
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
                  <CurrentStepComponent />
                </Card>
              </div>
            </div>
            
            {/* Right Container - Configuration Summary and Estimated Cost */}
            <div 
              className={`h-full p-6 flex flex-col gap-4 overflow-hidden transition-all duration-700 ease-in-out ${
                isStep6Transition 
                  ? 'w-0 opacity-0 translate-x-full' 
                  : 'w-1/3 opacity-100 translate-x-0'
              }`}
            >
              {/* Top Container - Configuration Summary */}
              <Card className="flex-1 overflow-hidden">
                <CardHeader className="flex-shrink-0">
                  <CardTitle>Configuration Summary</CardTitle>
                </CardHeader>
                <CardContent className="overflow-hidden">
                  {/* Configuration summary content will go here */}
                  <p className="text-sm text-muted-foreground">
                    Current Step: {STEPS[currentStep - 1].name}
                  </p>
                </CardContent>
              </Card>
              
              {/* Bottom Container - Estimated Cost */}
              <Card className="flex-1 overflow-hidden">
                <CardHeader className="flex-shrink-0">
                  <CardTitle>Estimated Cost</CardTitle>
                </CardHeader>
                <CardContent className="overflow-hidden">
                  {/* Estimated cost content will go here */}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
