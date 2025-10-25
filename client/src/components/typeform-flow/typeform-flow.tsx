// import React, { useState, useCallback } from 'react';
// import { useForm, type FieldError } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
// import { kidsDetailsSchema, questionsFlow } from '@/types/kids-details';
// import type { KidsDetailsFormData } from '@/types/kids-details';
// import { Button } from '@/components/ui/button';
// import QuestionRenderer from './question-renderer';
// import ProgressBar from './progress-bar';
// import ConfettiCelebration from '@/components/confetti-celebration';

// interface TypeformFlowProps {
//   onSubmit: (data: KidsDetailsFormData) => void;
//   onCancel?: () => void;
//   onSubmitSuccess?: () => void;
// }

// const TypeformFlow: React.FC<TypeformFlowProps> = ({
//   onSubmit,
//   onCancel,
//   onSubmitSuccess,
// }) => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

//   const {
//     control,
//     trigger,
//     getValues,
//     formState: { errors },
//   } = useForm<KidsDetailsFormData>({
//     resolver: zodResolver(kidsDetailsSchema),
//     mode: 'onChange',
//   });

//   const currentQuestion = questionsFlow[currentStep];
//   const isLastStep = currentStep === questionsFlow.length - 1;
//   const isFirstStep = currentStep === 0;
//   const progress = ((currentStep + 1) / questionsFlow.length) * 100;

//   const goToNext = useCallback(async () => {
//     const fieldName = currentQuestion.id;
//     const isValid = await trigger(fieldName);

//     if (isValid && !isLastStep) {
//       setCurrentStep(prev => prev + 1);
//     } else if (isValid && isLastStep) {
//       // Handle form submission
//       const formData = getValues();
//       setIsSubmitting(true);
//       try {
//         await onSubmit(formData);
//         setIsSubmitting(false);
//         setIsSubmitSuccess(true);
//       } catch (error) {
//         console.error('Error submitting form:', error);
//         setIsSubmitting(false);
//       }
//     }
//   }, [currentQuestion.id, isLastStep, trigger, getValues, onSubmit]);

//   const goToPrevious = useCallback(() => {
//     if (!isFirstStep) {
//       setCurrentStep(prev => prev - 1);
//     }
//   }, [isFirstStep]);

// const handleKeyPress = useCallback(
//   (event: KeyboardEvent) => {
//     if (event.key === 'Enter' && !event.shiftKey) {
//       event.preventDefault();
//       goToNext();
//     }
//   },
//   [goToNext],
// );

//   React.useEffect(() => {
//     document.addEventListener('keypress', handleKeyPress);
//     return () => document.removeEventListener('keypress', handleKeyPress);
//   }, [handleKeyPress]);

//   const slideVariants = {
//     enter: {
//       opacity: 0,
//       scale: 0.95,
//     },
//     center: {
//       opacity: 1,
//       scale: 1,
//     },
//     exit: {
//       opacity: 0,
//       scale: 0.95,
//     },
//   };

//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         ease: 'easeOut' as const,
//       },
//     },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col relative z-10">
//       {/* Background Decorative Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {/* Floating shapes - better distributed */}
//         <div className="absolute top-1/4 left-[5%] w-28 h-28 bg-emerald-200/15 rounded-full blur-xl animate-pulse"></div>
//         <div className="absolute top-[15%] right-[8%] w-20 h-20 bg-yellow-200/20 rounded-full blur-lg animate-bounce"></div>
//         <div className="absolute bottom-1/3 left-[10%] w-36 h-36 bg-orange-200/15 rounded-full blur-2xl animate-pulse"></div>
//         <div className="absolute bottom-[20%] right-[12%] w-16 h-16 bg-emerald-300/20 rounded-full blur-md animate-bounce"></div>

//         {/* Fitness Icons - more evenly distributed and less intrusive */}
//         <div className="absolute top-[25%] right-[15%] text-4xl opacity-[0.03] transform rotate-12 animate-pulse">
//           💪
//         </div>
//         <div className="absolute bottom-[35%] left-[8%] text-4xl opacity-[0.03] transform -rotate-12 animate-bounce">
//           🏃‍♂️
//         </div>
//         <div className="absolute top-[45%] right-[5%] text-3xl opacity-[0.03] transform rotate-45 animate-pulse">
//           ⚽
//         </div>
//         <div className="absolute bottom-[25%] left-[15%] text-4xl opacity-[0.03] transform -rotate-6 animate-bounce">
//           🤸‍♀️
//         </div>
//         <div className="absolute top-[35%] left-[45%] text-2xl opacity-[0.03] transform rotate-12 animate-pulse">
//           🌟
//         </div>
//         <div className="absolute bottom-[45%] right-[35%] text-3xl opacity-[0.03] transform -rotate-18 animate-pulse">
//           🏊‍♀️
//         </div>
//       </div>
//       {/* Progress Bar */}
//       <ProgressBar
//         progress={progress}
//         currentStep={currentStep + 1}
//         totalSteps={questionsFlow.length}
//       />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col px-2 sm:px-4">
//         <motion.div
//           className="flex-1 flex flex-col w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto relative z-20"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           {/* Question Container */}
//           <div className="flex-1 flex flex-col justify-center py-4">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={currentStep}
//                 variants={slideVariants}
//                 initial="enter"
//                 animate="center"
//                 exit="exit"
//                 transition={{
//                   duration: 0.3,
//                   ease: 'easeInOut',
//                 }}
//                 className="flex flex-col justify-center min-h-[400px]"
//               >
//                 {/* Question Card */}
//                 <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 md:p-8 mx-0 sm:mx-2 relative w-full">
//                   {/* Card background gradient */}
//                   <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-amber-50/60 rounded-3xl"></div>

//                   {/* Question Header */}
//                   <div className="text-center mb-6 sm:mb-8 relative z-10">
//                     <motion.h1
//                       className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight font-insanibc"
//                       initial={{ opacity: 0, y: -20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.1 }}
//                     >
//                       {currentQuestion.title}
//                     </motion.h1>
//                     {currentQuestion.subtitle && (
//                       <motion.p
//                         className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed"
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.2 }}
//                       >
//                         {currentQuestion.subtitle}
//                       </motion.p>
//                     )}
//                   </div>

//                   {/* Question Input */}
//                   <motion.div
//                     className="w-full relative z-10"
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ delay: 0.3 }}
//                   >
//                     <QuestionRenderer
//                       question={currentQuestion}
//                       control={control}
//                       error={
//                         errors[currentQuestion.id] as FieldError | undefined
//                       }
//                     />
//                   </motion.div>
//                 </div>
//               </motion.div>
//             </AnimatePresence>
//           </div>

//           {/* Navigation - Fixed at bottom */}
//           <motion.div
//             className="flex justify-between items-center py-4 sm:py-5 border-t border-amber-100/60 bg-white/70 backdrop-blur-md -mx-2 sm:-mx-4 px-4 sm:px-6 mt-auto rounded-t-3xl shadow-2xl"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//           >
//             {/* Back Button */}
//             <Button
//               type="button"
//               variant="outline"
//               onClick={goToPrevious}
//               disabled={isFirstStep}
//               className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 !bg-white !text-gray-600 !border-gray-300 hover:!bg-gray-50 hover:!text-gray-700 hover:!border-gray-400 border-2"
//             >
//               <ChevronLeft className="w-4 h-4" />
//               <span className="hidden sm:inline">Back</span>
//             </Button>

//             {/* Step Indicator */}
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               <span>{currentStep + 1}</span>
//               <span>/</span>
//               <span>{questionsFlow.length}</span>
//             </div>

//             {/* Next/Submit Button */}
//             <Button
//               type="button"
//               onClick={goToNext}
//               disabled={isSubmitting}
//               className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 !bg-emerald-500 !text-white hover:!bg-emerald-600 !border-0"
//             >
//               {isSubmitting ? (
//                 <>
//                   <motion.div
//                     className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
//                     animate={{ rotate: 360 }}
//                     transition={{
//                       duration: 1,
//                       repeat: Infinity,
//                       ease: 'linear',
//                     }}
//                   />
//                   <span className="hidden sm:inline">Submitting...</span>
//                 </>
//               ) : isLastStep ? (
//                 <>
//                   <Check className="w-4 h-4" />
//                   <span className="hidden sm:inline">Complete</span>
//                 </>
//               ) : (
//                 <>
//                   <span className="hidden sm:inline">Next</span>
//                   <ChevronRight className="w-4 h-4" />
//                 </>
//               )}
//             </Button>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Cancel Button (Bottom) */}
//       {onCancel && (
//         <motion.div
//           className="p-4 text-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6 }}
//         >
//           <Button
//             type="button"
//             variant="ghost"
//             onClick={onCancel}
//             className="!text-gray-600 hover:!text-gray-800 !bg-transparent hover:!bg-gray-100"
//           >
//             Cancel and go back
//           </Button>
//         </motion.div>
//       )}

//       {/* Confetti Celebration */}
//       <ConfettiCelebration
//         isVisible={isSubmitSuccess}
//         duration={3000}
//         onComplete={() => {
//           // Call the success callback which will handle redirect
//           onSubmitSuccess?.();
//         }}
//       />
//     </div>
//   );
// };

// export default TypeformFlow;
