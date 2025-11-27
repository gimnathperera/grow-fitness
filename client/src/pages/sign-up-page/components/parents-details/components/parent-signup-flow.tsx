import React, { useState, useCallback } from 'react';
import { useForm, type FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/typeform-flow/progress-bar';
import {
  parentSignupQuestions,
  parentSignupSchema,
  type ParentSignupFormData,
} from '@/types/sign-up';
import QuestionRenderer from '../../question-renderer';

interface ParentSignupFlowProps {
  onSubmit: (data: ParentSignupFormData) => Promise<void> | void;
  onCancel?: () => void;
  onSubmitSuccess?: () => void;
}

const ParentSignupFlow: React.FC<ParentSignupFlowProps> = ({
  onSubmit,
  onCancel,
  onSubmitSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const {
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ParentSignupFormData>({
    resolver: zodResolver(parentSignupSchema),
    mode: 'onChange',
  });

  const currentQuestion = parentSignupQuestions[currentStep];
  const isLastStep = currentStep === parentSignupQuestions.length - 1;
  const isFirstStep = currentStep === 0;
  const progress = ((currentStep + 1) / parentSignupQuestions.length) * 100;

  const goToNext = useCallback(async () => {
    const fieldName = currentQuestion.id;
    const isValid = await trigger(fieldName);

    if (isValid && !isLastStep) {
      setCurrentStep(prev => prev + 1);
    } else if (isValid && isLastStep) {
      const formData = getValues();
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        setIsSubmitting(false);
        setIsSubmitSuccess(true);
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setIsSubmitting(false);
      }
    }
  }, [
    currentQuestion.id,
    isLastStep,
    trigger,
    getValues,
    onSubmit,
    onSubmitSuccess,
  ]);

  const goToPrevious = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  }, [isFirstStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col relative">
      {!isSubmitSuccess ? (
        <>
          <ProgressBar
            progress={progress}
            currentStep={currentStep + 1}
            totalSteps={parentSignupQuestions.length}
          />

          <div className="flex-1 flex flex-col px-4">
            <motion.div
              className="flex-1 flex flex-col w-full max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Question */}
              <div className="flex-1 flex flex-col justify-center py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/70 backdrop-blur rounded-2xl shadow-xl border border-white/50 p-6"
                  >
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold text-gray-800">
                        {currentQuestion.title}
                      </h1>
                      {currentQuestion.subtitle && (
                        <p className="text-gray-600">
                          {currentQuestion.subtitle}
                        </p>
                      )}
                    </div>

                    <QuestionRenderer
                      question={currentQuestion}
                      control={control}
                      error={
                        errors[currentQuestion.id] as FieldError | undefined
                      }
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center py-4 border-t border-amber-100 bg-white/70 backdrop-blur rounded-t-2xl shadow-md">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPrevious}
                  disabled={isFirstStep}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>

                <div className="text-sm text-gray-500">
                  {currentStep + 1} / {parentSignupQuestions.length}
                </div>

                <Button
                  type="button"
                  onClick={goToNext}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 mr-5 !bg-emerald-500 !text-white hover:!bg-emerald-600 !border-0"
                >
                  {isSubmitting ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  ) : isLastStep ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Sign Up</span>
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>

          {onCancel && (
            <div className="p-4 text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </Button>
            </div>
          )}
        </>
      ) : (
        <motion.div
          className="flex flex-1 items-center justify-center text-center px-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-white/50 p-8">
            <Check className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Signup Successful!
            </h2>
            <p className="text-gray-600">
              Welcome aboard 🎉 Your account has been created.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ParentSignupFlow;
