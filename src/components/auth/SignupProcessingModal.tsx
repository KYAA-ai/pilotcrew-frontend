import { AlertCircle, CheckCircle, FileText, Search } from '@/components/SimpleIcons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

interface SignupProcessingModalProps {
  isOpen: boolean;
  stage: 1 | 2;
  processing: boolean;
  categories: string[];
  selectedCategories: string[];
  onCategoriesConfirm: (selected: string[]) => void;
  onComplete: () => void;
  onClose?: () => void;
  hasError?: boolean;
  errorMessage?: string | null;
}


export function SignupProcessingModal({
  isOpen,
  stage,
  processing,
  categories,
  selectedCategories: initialSelectedCategories,
  onCategoriesConfirm,
  onComplete,
  onClose,
  hasError = false,
  errorMessage
}: SignupProcessingModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialSelectedCategories || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  useEffect(() => {
    setSelectedCategories(initialSelectedCategories || []);
  }, [initialSelectedCategories]);

  // Progress bar animation for stage 2 only
  useEffect(() => {
    if (stage === 2 && processing) {
      setProgressValue(0);
      const startTime = Date.now();
      const estimatedDuration = 30000; // 30 seconds estimated

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / estimatedDuration) * 100, 95);
        setProgressValue(progress);
      }, 500);

      return () => clearInterval(interval);
    } else if (stage === 2 && !processing) {
      setProgressValue(100);
    }
  }, [stage, processing]);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleCategoriesConfirm = async () => {
    setIsSubmitting(true);
    await onCategoriesConfirm(selectedCategories);
    setIsSubmitting(false);
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] min-h-64 min-w-1/3 p-4 overflow-hidden flex items-center justify-center">
        <div className="relative">
          <div className={`absolute inset-0`} />
          <div className="relative p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {hasError ? 'Registration Error' : stage === 1 ? 'Analyzing your domain' : 'Analyzing your resume'}
              </h2>
              <p className="text-muted-foreground">
                {hasError ? 'Something went wrong during registration' : stage === 1 ? 'We are analyzing your profile domain to suggest categories.' : 'We are analyzing your resume for deeper insights.'}
              </p>
            </div>
            {hasError && (
              <div className="text-center mb-8 p-6">
                <div className="mb-4">
                  <AlertCircle className="w-16 h-16 text-primary mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Registration Failed
                </h3>
                <p className="text-muted-foreground mb-6">
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
            {!hasError && stage === 1 && (
              <>
                {processing ? (
                  <div className="flex flex-col items-center justify-center gap-6 mb-8">
                    <FileText className="w-16 h-16 text-primary animate-pulse" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Analyzing Domain</h3>
                    <p className="text-base text-muted-foreground text-center">Please wait while we analyze your domain...</p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="text-center mb-6">
                      <h2 className="text-lg font-medium text-foreground">Select your top 3 categories</h2>
                    </div>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Only 3 categories can be chosen to go ahead with account creation
                    </p>

                    {/* Selection Counter */}
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                        <span className="text-sm font-medium text-primary">
                          Selected {selectedCategories.length}/3
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {categories.map((cat) => (
                        <Button
                          key={cat}
                          variant={selectedCategories.includes(cat) ? "default" : "outline"}
                          className={`relative ${selectedCategories.includes(cat) ? "bg-primary" : ""}`}
                          onClick={() => handleCategoryToggle(cat)}
                          disabled={
                            !selectedCategories.includes(cat) && selectedCategories.length >= 3
                          }
                        >
                          {cat}
                          {selectedCategories.includes(cat) && (
                            <CheckCircle className="w-4 h-4 ml-2 flex-shrink-0" />
                          )}
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={handleCategoriesConfirm}
                      disabled={selectedCategories.length !== 3 || isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Saving...' : 'Continue'}
                    </Button>
                  </div>
                )}
              </>
            )}
            {!hasError && stage === 2 && (
              <>
                {processing ? (
                  <div className="flex flex-col items-center justify-center gap-4 mb-6">
                    <Search className="w-14 h-14 text-primary animate-pulse" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Matching jobs for you…
                    </h3>
                    <p className="text-center text-muted-foreground mb-4">
                      We're analyzing your resume and finding the best matches.<br />
                      This may take a few minutes.
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full max-w-md">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Processing...</span>
                        <span>{Math.min(Math.round(progressValue), 100)}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-3">
                        <div
                          className="bg-primary h-3 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${Math.min(progressValue, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mb-4">
                      <CheckCircle className="w-16 h-16 text-primary mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      All set!
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Your profile is ready. Welcome to Pilotcrew.ai!
                    </p>
                    <Button
                      onClick={handleContinueClick}
                      disabled={processing || isSubmitting}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary"
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
              </>
            )}
            {!hasError && (
              <div className="flex justify-center space-x-2 mt-6">
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${step === stage
                      ? 'bg-primary animate-pulse'
                      : 'bg-muted'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 