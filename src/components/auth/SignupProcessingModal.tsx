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
  useEffect(() => {
    setSelectedCategories(initialSelectedCategories || []);
  }, [initialSelectedCategories]);

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
      <DialogContent className="max-w-xl p-0 overflow-hidden">
        <div className="relative">
          {/* Background gradient */}
          <div className={`absolute inset-0 ${
            hasError 
              ? 'bg-gradient-to-br from-destructive/10 via-warning/10 to-yellow-50' 
              : 'bg-gradient-to-br from-primary/5 via-secondary/5 to-muted'
          }`} />
          {/* Content */}
          <div className="relative p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {hasError ? 'Registration Error' : stage === 1 ? 'Analyzing your domain' : 'Analyzing your resume'}
              </h2>
              <p className="text-muted-foreground">
                {hasError ? 'Something went wrong during registration' : stage === 1 ? 'We are analyzing your profile domain to suggest categories.' : 'We are analyzing your resume for deeper insights.'}
              </p>
            </div>
            {/* Error state */}
            {hasError && (
              <div className="text-center mb-8">
                <div className="mb-4">
                  <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
            {/* Stage 1: Category selection */}
            {!hasError && stage === 1 && (
              <>
                {processing ? (
                  <div className="flex flex-col items-center justify-center gap-4 mb-8">
                    <FileText className="w-12 h-12 text-primary animate-pulse" />
                    <p className="text-muted-foreground">Analyzing domain, please wait...</p>
                  </div>
                ) : (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Select your top 3 categories</h3>
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {categories.map((cat) => (
                        <Button
                          key={cat}
                          variant={selectedCategories.includes(cat) ? "default" : "outline"}
                          className={selectedCategories.includes(cat) ? "bg-primary text-white" : ""}
                          onClick={() => handleCategoryToggle(cat)}
                          disabled={
                            !selectedCategories.includes(cat) && selectedCategories.length >= 3
                          }
                        >
                          {cat}
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
            {/* Stage 2: Resume analysis and completion */}
            {!hasError && stage === 2 && (
              <>
                {processing ? (
                  <div className="flex flex-col items-center justify-center gap-4 mb-8">
                    <Search className="w-12 h-12 text-primary animate-pulse" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Matching jobs for you…
                    </h3>
                    <p className="text-muted-foreground">
                      We’re analyzing your resume and finding the best matches.<br />
                      This may take a few minutes.
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mb-4">
                      <CheckCircle className="w-16 h-16 text-primary mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      All set! 🎉
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Your profile is ready. Welcome to KYAA.ai!
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
            {/* Step indicators */}
            {!hasError && (
              <div className="flex justify-center space-x-2 mt-6">
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      step === stage 
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