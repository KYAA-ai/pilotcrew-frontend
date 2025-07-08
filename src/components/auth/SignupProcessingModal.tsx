import { AlertCircle, CheckCircle, FileText, Search, Sparkles, UserCheck } from '@/components/SimpleIcons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';

interface SignupProcessingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose?: () => void;
  hasError?: boolean;
  errorMessage?: string | null;
}

interface ProcessingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  illustration: string;
}

const processingSteps: ProcessingStep[] = [
  {
    id: 1,
    title: "Parsing Information",
    description: "Extracting key details from your resume",
    icon: FileText,
    illustration: "📄✨"
  },
  {
    id: 2,
    title: "Updating Skills",
    description: "Analyzing and categorizing your expertise",
    icon: Sparkles,
    illustration: "🎯💡"
  },
  {
    id: 3,
    title: "Finding Best Matches",
    description: "Discovering opportunities that fit your profile",
    icon: Search,
    illustration: "🔍🎯"
  },
  {
    id: 4,
    title: "Customizing Suggestions",
    description: "Preparing personalized recommendations for you",
    icon: UserCheck,
    illustration: "🎨📋"
  }
];

export function SignupProcessingModal({ 
  isOpen, 
  onComplete, 
  onClose,
  hasError = false,
  errorMessage
}: SignupProcessingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setIsCompleted(false);
      setIsSubmitting(false);
      return;
    }

    // If there's an error, don't start the processing animation
    if (hasError) {
      return;
    }

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < processingSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setIsCompleted(true);
          return prev;
        }
      });
    }, 5000); // 5 seconds per step

    return () => clearInterval(stepInterval);
  }, [isOpen, hasError]);

  const handleContinueClick = async () => {
    setIsSubmitting(true);
    try {
      await onComplete();
    } catch (error) {
      console.error('Error during registration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepData = processingSteps[currentStep];
  const progress = hasError ? 0 : ((currentStep + 1) / processingSteps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="relative">
          {/* Background gradient */}
          <div className={`absolute inset-0 ${
            hasError 
              ? 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50' 
              : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
          }`} />
          
          {/* Content */}
          <div className="relative p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {hasError ? 'Registration Error' : 'Setting up your profile'}
              </h2>
              <p className="text-gray-600">
                {hasError ? 'Something went wrong during registration' : 'We\'re preparing everything for you'}
              </p>
            </div>

            {/* Error state */}
            {hasError && (
              <div className="text-center mb-8">
                <div className="mb-4">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Registration Failed
                </h3>
                <p className="text-gray-600 mb-6">
                  {errorMessage || 'An error occurred during registration. Please try again.'}
                </p>
                <div className="flex gap-3">
                  <Button 
                    onClick={onClose}
                    variant="outline"
                    className="flex-1"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Processing state */}
            {!hasError && (
              <>
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Step {currentStep + 1} of {processingSteps.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Current step */}
                <div className="text-center mb-8">
                  <div className="relative mb-6">
                    {/* Animated illustration */}
                    <div className="text-6xl mb-4 animate-bounce">
                      {currentStepData.illustration}
                    </div>
                    
                    {/* Icon */}
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-white rounded-full p-2 shadow-lg">
                        <currentStepData.icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentStepData.title}
                  </h3>
                  <p className="text-gray-600">
                    {currentStepData.description}
                  </p>
                </div>

                {/* Completion state */}
                {isCompleted && (
                  <div className="text-center">
                    <div className="mb-4">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      All set! 🎉
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Your profile is ready. Welcome to KYAA.ai!
                    </p>
                    <Button 
                      onClick={handleContinueClick}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Submitting...
                        </>
                      ) : (
                        'Continue to Dashboard'
                      )}
                    </Button>
                  </div>
                )}

                {/* Step indicators */}
                <div className="flex justify-center space-x-2 mt-6">
                  {processingSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index <= currentStep 
                          ? 'bg-blue-500 animate-pulse' 
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 