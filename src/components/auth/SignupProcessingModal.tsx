"use client"

import { AlertCircle, CheckCircle, FileText, Search } from "@/components/SimpleIcons"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useEffect, useState } from "react"

interface SignupProcessingModalProps {
  isOpen: boolean
  stage: 1 | 2
  processing: boolean
  categories: string[]
  selectedCategories: string[]
  onCategoriesConfirm: (selected: string[]) => void
  onComplete: () => void
  onClose?: () => void
  hasError?: boolean
  errorMessage?: string | null
  currentRetry?: number
  maxRetries?: number
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
  errorMessage,
  currentRetry = 0,
  maxRetries = 10,
}: SignupProcessingModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialSelectedCategories || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progressValue, setProgressValue] = useState(0)

  useEffect(() => {
    setSelectedCategories(initialSelectedCategories || [])
  }, [initialSelectedCategories])

  useEffect(() => {
    if (stage === 2 && processing) {
      const progress = Math.min((currentRetry / maxRetries) * 100, 95)
      setProgressValue(progress)
    } else if (stage === 2 && !processing) {
      setProgressValue(100)
    }
  }, [stage, processing, currentRetry, maxRetries])

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleCategoriesConfirm = async () => {
    setIsSubmitting(true)
    await onCategoriesConfirm(selectedCategories)
    setIsSubmitting(false)
  }

  const handleContinueClick = async () => {
    setIsSubmitting(true)
    try {
      await onComplete()
    } catch (error) {
      console.error("Error during registration:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] p-4 sm:p-6 flex flex-col">
        <div className="flex flex-col h-full min-h-0">
          <div className="text-center mb-4 flex-shrink-0">
            <h2 className="text-base sm:text-lg font-bold text-white mb-2">
              {hasError ? "Registration Error" : stage === 1 ? "Analyzing your domain" : "Analyzing your resume"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {hasError
                ? "Something went wrong during registration"
                : stage === 1
                  ? "We are analyzing your profile domain to suggest categories."
                  : "We are analyzing your resume for deeper insights."}
            </p>
          </div>

          {hasError && (
            <div className="text-center mb-4 p-4 flex-shrink-0">
              <div className="mb-3">
                <AlertCircle className="w-12 h-12 text-primary mx-auto" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Registration Failed</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {errorMessage || "An error occurred during registration. Please try again."}
              </p>
              <Button onClick={onClose} variant="outline" className="w-full text-sm py-3 h-auto bg-transparent">
                Try Again
              </Button>
            </div>
          )}

          {!hasError && stage === 1 && (
            <div className="flex flex-col h-full min-h-0">
              {processing ? (
                <div className="flex flex-col items-center justify-center gap-4 flex-1 py-8">
                  <FileText className="w-12 h-12 text-primary animate-pulse" />
                  <h3 className="text-base font-semibold text-foreground">Analyzing Domain</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Please wait while we analyze your domain...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col h-full min-h-0">
                  <div className="text-center mb-3 flex-shrink-0">
                    <h2 className="text-sm font-medium text-foreground">Select your top 3 categories</h2>
                  </div>
                  <p className="text-sm text-muted-foreground text-center mb-3 flex-shrink-0">
                    Only 3 categories can be chosen
                  </p>

                  <div className="text-center mb-4 flex-shrink-0">
                    <div className="inline-flex items-center px-3 py-2 bg-primary/10 rounded-full">
                      <span className="text-sm font-medium text-primary">{selectedCategories.length}/3</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto min-h-0 mb-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {categories.map((cat) => (
                        <Button
                          key={cat}
                          variant={selectedCategories.includes(cat) ? "default" : "outline"}
                          className={`text-sm px-3 py-2 h-auto min-h-[44px] ${selectedCategories.includes(cat) ? "bg-primary" : ""}`}
                          onClick={() => handleCategoryToggle(cat)}
                          disabled={!selectedCategories.includes(cat) && selectedCategories.length >= 3}
                        >
                          {cat}
                          {selectedCategories.includes(cat) && <CheckCircle className="w-4 h-4 ml-2" />}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Button
                      onClick={handleCategoriesConfirm}
                      disabled={selectedCategories.length !== 3 || isSubmitting}
                      className="w-full text-sm py-3 h-auto"
                    >
                      {isSubmitting ? "Saving..." : "Continue"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!hasError && stage === 2 && (
            <div className="flex flex-col h-full min-h-0">
              {processing ? (
                <div className="flex flex-col items-center justify-center gap-4 flex-1 py-8">
                  <Search className="w-12 h-12 text-primary animate-pulse" />
                  <h3 className="text-base font-semibold text-foreground text-center">Matching jobs for you…</h3>
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    We're analyzing your resume and finding the best matches.
                  </p>

                  <div className="w-full max-w-xs">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Processing...</span>
                      <span>{Math.min(Math.round(progressValue), 100)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${Math.min(progressValue, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center flex-1 flex flex-col justify-center py-8">
                  <div className="mb-4">
                    <CheckCircle className="w-12 h-12 text-primary mx-auto" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">All set!</h3>
                  <p className="text-sm text-muted-foreground mb-6">Your profile is ready. Welcome to Pilotcrew.ai!</p>
                  <Button
                    onClick={handleContinueClick}
                    disabled={processing || isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-sm py-3 h-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting...
                      </>
                    ) : (
                      "Continue to Dashboard"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {!hasError && (
            <div className="flex justify-center space-x-2 mt-4 flex-shrink-0">
              {[1, 2].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    step === stage ? "bg-primary animate-pulse" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
