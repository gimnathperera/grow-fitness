import React, { useState, useCallback } from 'react';
import {
  useForm,
  useFieldArray,
  type FieldError,
  type FieldPath,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Plus, Trash2 } from 'lucide-react';
import {
  childAttributeSteps,
  createEmptyChild,
  kidsDetailsSchema,
} from '@/types/kids-details';
import type { KidsDetailsFormData } from '@/types/kids-details';
import type { QuestionConfig } from '@/types/question-config';
import { Button } from '@/components/ui/button';
import ConfettiCelebration from '@/components/confetti-celebration';
import { ProgressBar } from '@/components/typeform-flow';
import QuestionRenderer from '../../question-renderer';

interface TypeformFlowProps {
  onSubmit: (data: KidsDetailsFormData) => void;
  onCancel?: () => void;
  onSubmitSuccess?: () => void;
}

type StepConfig =
  | {
      id: 'names';
      type: 'names';
      title: string;
      subtitle: string;
    }
  | {
      id: string;
      type: 'attribute';
      title: string;
      subtitle?: string;
      attributeIndex: number;
    };

const steps: StepConfig[] = [
  {
    id: 'names',
    type: 'names',
    title: "What are your kids' names?",
    subtitle:
      'Add each child below. Use “Add another child” so we can prepare everything in one go.',
  },
  ...childAttributeSteps.map((step, index) => ({
    id: step.field,
    type: 'attribute' as const,
    title: step.stepTitle,
    subtitle: step.stepSubtitle,
    attributeIndex: index,
  })),
];

const slideVariants = {
  enter: {
    opacity: 0,
    scale: 0.95,
  },
  center: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
  },
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

const TypeformFlow: React.FC<TypeformFlowProps> = ({
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
    handleSubmit,
    setFocus,
    watch,
    formState: { errors },
  } = useForm<KidsDetailsFormData>({
    resolver: zodResolver(kidsDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      kids: [createEmptyChild()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'kids',
  });

  const kids = watch('kids');

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentStepConfig = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const focusNameField = useCallback(
    (index: number) => {
      const path = `kids.${index}.kidsName` as FieldPath<KidsDetailsFormData>;
      setTimeout(() => setFocus(path), 50);
    },
    [setFocus],
  );

  const handleAddChild = () => {
    append(createEmptyChild());
    focusNameField(fields.length); // new child sits at current length index
  };

  const handleRemoveChild = (index: number) => {
    if (fields.length === 1) {
      return;
    }
    remove(index);
  };

  const getFieldErrors = (
    kidIndex: number,
    field: keyof KidsDetailsFormData['kids'][number],
  ) =>
    (errors.kids?.[kidIndex]?.[field] as FieldError | undefined) ?? undefined;

  const getPathsForCurrentStep = useCallback(() => {
    if (currentStepConfig.type === 'names') {
      return fields.map(
        (_, index) =>
          `kids.${index}.kidsName` as FieldPath<KidsDetailsFormData>,
      );
    }

    const attribute = childAttributeSteps[currentStepConfig.attributeIndex];

    return fields.map(
      (_, index) =>
        `kids.${index}.${attribute.field}` as FieldPath<KidsDetailsFormData>,
    );
  }, [currentStepConfig, fields]);

  const handleNext = useCallback(async () => {
    const fieldsToValidate = getPathsForCurrentStep();
    const isValid = await trigger(fieldsToValidate);

    if (!isValid) {
      return;
    }

    if (!isLastStep) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    setIsSubmitting(true);
    await handleSubmit(async formData => {
      try {
        await onSubmit(formData);
        setIsSubmitSuccess(true);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    })();
  }, [getPathsForCurrentStep, handleSubmit, isLastStep, onSubmit, trigger]);

  const goToPrevious = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  }, [isFirstStep]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleNext();
      }
    },
    [handleNext],
  );

  React.useEffect(() => {
    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [handleKeyPress]);

  const renderStep = () => {
    if (currentStepConfig.type === 'names') {
      return (
        <div className="space-y-4">
          {fields.map((field, index) => {
            const question: QuestionConfig<FieldPath<KidsDetailsFormData>> = {
              id: `kids.${index}.kidsName` as FieldPath<KidsDetailsFormData>,
              type: 'text',
              placeholder: "Enter your child's name",
              required: true,
            };

            const fieldError = getFieldErrors(index, 'kidsName');
            const displayIndex = index + 1;

            return (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 rounded-xl border border-amber-100 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Child {displayIndex}
                  </h3>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveChild(index)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">
                        Remove child {displayIndex}
                      </span>
                    </Button>
                  )}
                </div>

                <QuestionRenderer<KidsDetailsFormData>
                  question={question}
                  control={control}
                  error={fieldError}
                  shouldAutoFocus={index === fields.length - 1}
                />
              </motion.div>
            );
          })}

          <div className="flex justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddChild}
              className="flex items-center gap-2 px-4 py-2 !border-emerald-200 !text-emerald-600 !bg-emerald-50 hover:!bg-emerald-100"
            >
              <Plus className="h-4 w-4" />
              Add another child
            </Button>
          </div>
        </div>
      );
    }

    const attribute = childAttributeSteps[currentStepConfig.attributeIndex];

    return (
      <div className="space-y-4">
        {fields.map((field, index) => {
          const question: QuestionConfig<FieldPath<KidsDetailsFormData>> = {
            id: `kids.${index}.${attribute.field}` as FieldPath<KidsDetailsFormData>,
            type: attribute.type,
            placeholder: attribute.placeholder,
            options: attribute.options,
            required: true,
          };

          const kid = kids?.[index];
          const labelName = kid?.kidsName?.trim() || `Child ${index + 1}`;
          const perChildLabel = attribute.perChildLabel.replace(
            '{name}',
            labelName,
          );

          const fieldError = getFieldErrors(
            index,
            attribute.field as keyof KidsDetailsFormData['kids'][number],
          );

          return (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 rounded-xl border border-amber-100 p-4"
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {perChildLabel}
                </h3>
              </div>

              <QuestionRenderer<KidsDetailsFormData>
                question={question}
                control={control}
                error={fieldError}
                shouldAutoFocus={index === 0}
              />
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col relative z-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-[5%] w-28 h-28 bg-emerald-200/15 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-[15%] right-[8%] w-20 h-20 bg-yellow-200/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-1/3 left-[10%] w-36 h-36 bg-orange-200/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[12%] w-16 h-16 bg-emerald-300/20 rounded-full blur-md animate-bounce"></div>
        <div className="absolute top-[25%] right-[15%] text-4xl opacity-[0.03] transform rotate-12 animate-pulse">
          💪
        </div>
        <div className="absolute bottom-[35%] left-[8%] text-4xl opacity-[0.03] transform -rotate-12 animate-bounce">
          🏃‍♂️
        </div>
        <div className="absolute top-[45%] right-[5%] text-3xl opacity-[0.03] transform rotate-45 animate-pulse">
          ⚽
        </div>
        <div className="absolute bottom-[25%] left-[15%] text-4xl opacity-[0.03] transform -rotate-6 animate-bounce">
          🤸‍♀️
        </div>
        <div className="absolute top-[35%] left-[45%] text-2xl opacity-[0.03] transform rotate-12 animate-pulse">
          🌟
        </div>
        <div className="absolute bottom-[45%] right-[35%] text-3xl opacity-[0.03] transform -rotate-18 animate-pulse">
          🏊‍♀️
        </div>
      </div>

      <ProgressBar
        progress={progress}
        currentStep={currentStep + 1}
        totalSteps={totalSteps}
      />

      <div className="flex-1 flex flex-col px-2 sm:px-4">
        <motion.div
          className="flex-1 flex flex-col w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto relative z-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex-1 flex flex-col justify-center py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
                className="flex flex-col justify-center min-h-[400px]"
              >
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 md:p-8 mx-0 sm:mx-2 relative w-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-amber-50/60 rounded-3xl"></div>

                  <div className="text-center mb-6 sm:mb-8 relative z-10">
                    <motion.h1
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight font-insanibc"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {currentStepConfig.title}
                    </motion.h1>
                    {currentStepConfig.subtitle && (
                      <motion.p
                        className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {currentStepConfig.subtitle}
                      </motion.p>
                    )}
                  </div>

                  <motion.div
                    className="w-full relative z-10"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {renderStep()}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            className="flex justify-between items-center py-4 sm:py-5 border-t border-amber-100/60 bg-white/70 backdrop-blur-md -mx-2 sm:-mx-4 px-4 sm:px-6 mt-auto rounded-t-3xl shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={goToPrevious}
              disabled={isFirstStep}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 !bg-white !text-gray-600 !border-gray-300 hover:!bg-gray-50 hover:!text-gray-700 hover:!border-gray-400 border-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{currentStep + 1}</span>
              <span>/</span>
              <span>{totalSteps}</span>
            </div>

            <Button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 !bg-emerald-500 !text-white hover:!bg-emerald-600 !border-0"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  <span className="hidden sm:inline">Submitting...</span>
                </>
              ) : isLastStep ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Complete</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {onCancel && (
        <motion.div
          className="p-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="!text-gray-600 hover:!text-gray-800 !bg-transparent hover:!bg-gray-100"
          >
            Cancel and go back
          </Button>
        </motion.div>
      )}

      <ConfettiCelebration
        isVisible={isSubmitSuccess}
        duration={3000}
        onComplete={() => {
          onSubmitSuccess?.();
        }}
      />
    </div>
  );
};

export default TypeformFlow;
