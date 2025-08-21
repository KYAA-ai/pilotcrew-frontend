
import ConfigurationSummary from "@/components/ConfigurationSummary";
import MultiStepForm from "@/components/MultiStepForm";
import type { StepConfig, StepProgress } from "@/components/MultiStepForm";
import { SiteHeader } from "@/components/employer-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { useState, useCallback } from "react";
import { AutoEvalSidebar } from "./AutoEvalSidebar";


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
        <div className="autoeval-page h-[calc(100vh-var(--header-height))] bg-[var(--background)]">
          <MultiStepForm
            steps={STEPS}
            title="Evaluation Setup Wizard"
            breadcrumbItems={[
              { label: "Home", href: "/" },
              { label: "AutoEval" }
            ]}
            configuration={configuration}
            onConfigurationUpdate={handleConfigurationUpdate}
            onStepComplete={handleStepComplete}
            onLaunch={handleLaunch}
            showProgressDebug={true}
            submitProgressToAPI={submitProgressToAPI}
            renderRightPanel={renderRightPanel}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
