// import React from 'react';
// import { Controller } from 'react-hook-form';
// import type { Control, FieldError } from 'react-hook-form';
// import { motion, AnimatePresence } from 'framer-motion';
// import type { KidsDetailsFormData, QuestionConfig } from '@/types/kids-details';

// interface QuestionRendererProps {
//   question: QuestionConfig;
//   control: Control<KidsDetailsFormData>;
//   error?: FieldError;
// }

// const QuestionRenderer: React.FC<QuestionRendererProps> = ({
//   question,
//   control,
//   error,
// }) => {
//   const inputVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { delay: 0.1 },
//     },
//   };

//   const errorVariants = {
//     hidden: { opacity: 0, height: 0 },
//     visible: {
//       opacity: 1,
//       height: 'auto',
//       transition: { duration: 0.3 },
//     },
//   };

//   const renderInput = () => {
//     switch (question.type) {
//       case 'text':
//         return (
//           <Controller
//             name={question.id}
//             control={control}
//             render={({ field }) => (
//               <motion.input
//                 {...field}
//                 type="text"
//                 placeholder={question.placeholder}
//                 className={`w-full px-4 sm:px-6 py-4 sm:py-5 text-lg sm:text-xl bg-amber-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-200 text-gray-900 ${
//                   error
//                     ? 'border-red-400 focus:border-red-500'
//                     : 'border-amber-200 focus:border-emerald-400'
//                 }`}
//                 variants={inputVariants}
//                 initial="hidden"
//                 animate="visible"
//                 autoFocus
//               />
//             )}
//           />
//         );

//       case 'textarea':
//         return (
//           <Controller
//             name={question.id}
//             control={control}
//             render={({ field }) => (
//               <motion.textarea
//                 {...field}
//                 placeholder={question.placeholder}
//                 rows={4}
//                 className={`w-full px-4 sm:px-6 py-4 sm:py-5 text-lg sm:text-xl bg-amber-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-200 resize-none text-gray-900 ${
//                   error
//                     ? 'border-red-400 focus:border-red-500'
//                     : 'border-amber-200 focus:border-emerald-400'
//                 }`}
//                 variants={inputVariants}
//                 initial="hidden"
//                 animate="visible"
//                 autoFocus
//               />
//             )}
//           />
//         );

//       case 'number':
//         return (
//           <Controller
//             name={question.id}
//             control={control}
//             render={({ field: { value, onChange, ...field } }) => (
//               <motion.input
//                 {...field}
//                 type="number"
//                 value={value || ''}
//                 onChange={e =>
//                   onChange(e.target.value ? Number(e.target.value) : undefined)
//                 }
//                 placeholder={question.placeholder}
//                 className={`w-full px-4 sm:px-6 py-4 sm:py-5 text-lg sm:text-xl bg-amber-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-200 text-gray-900 ${
//                   error
//                     ? 'border-red-400 focus:border-red-500'
//                     : 'border-amber-200 focus:border-emerald-400'
//                 }`}
//                 variants={inputVariants}
//                 initial="hidden"
//                 animate="visible"
//                 autoFocus
//               />
//             )}
//           />
//         );

//       case 'date':
//         return (
//           <Controller
//             name={question.id}
//             control={control}
//             render={({ field }) => (
//               <motion.input
//                 {...field}
//                 type="date"
//                 className={`w-full px-4 sm:px-6 py-4 sm:py-5 text-lg sm:text-xl bg-amber-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-200 text-gray-900 ${
//                   error
//                     ? 'border-red-400 focus:border-red-500'
//                     : 'border-amber-200 focus:border-emerald-400'
//                 }`}
//                 variants={inputVariants}
//                 initial="hidden"
//                 animate="visible"
//                 autoFocus
//               />
//             )}
//           />
//         );

//       case 'phone':
//         return (
//           <Controller
//             name={question.id}
//             control={control}
//             render={({ field }) => (
//               <motion.input
//                 {...field}
//                 type="tel"
//                 placeholder={question.placeholder}
//                 className={`w-full px-4 sm:px-6 py-4 sm:py-5 text-lg sm:text-xl bg-amber-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-200 text-gray-900 ${
//                   error
//                     ? 'border-red-400 focus:border-red-500'
//                     : 'border-amber-200 focus:border-emerald-400'
//                 }`}
//                 variants={inputVariants}
//                 initial="hidden"
//                 animate="visible"
//                 autoFocus
//               />
//             )}
//           />
//         );

//       case 'select':
//         return (
//           <Controller
//             name={question.id}
//             control={control}
//             render={({ field }) => (
//               <motion.div
//                 className="grid gap-3 sm:gap-4 w-full"
//                 variants={inputVariants}
//                 initial="hidden"
//                 animate="visible"
//               >
//                 {question.options?.map((option, index) => (
//                   <motion.button
//                     key={option.value}
//                     type="button"
//                     onClick={() => field.onChange(option.value)}
//                     style={{
//                       backgroundColor:
//                         field.value === option.value ? '#ecfdf5' : '#fffbeb',
//                       borderColor:
//                         field.value === option.value ? '#10b981' : '#f3e8d0',
//                     }}
//                     className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 text-left group hover:shadow-md ${
//                       field.value === option.value
//                         ? 'border-emerald-500 bg-emerald-50 shadow-md !bg-emerald-50 !border-emerald-500'
//                         : 'border-amber-200 bg-amber-50 hover:border-amber-300 !bg-amber-50 !border-amber-200 hover:!bg-amber-100 hover:border-amber-300'
//                     }`}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <div className="flex items-center gap-4">
//                       {option.icon && (
//                         <span className="text-2xl sm:text-3xl">
//                           {option.icon}
//                         </span>
//                       )}
//                       <div className="flex-1">
//                         <span className="text-lg sm:text-xl font-medium text-gray-900">
//                           {option.label}
//                         </span>
//                       </div>
//                       {field.value === option.value && (
//                         <motion.div
//                           className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
//                           initial={{ scale: 0 }}
//                           animate={{ scale: 1 }}
//                           transition={{
//                             type: 'spring',
//                             stiffness: 500,
//                             damping: 30,
//                           }}
//                         >
//                           <div className="w-2 h-2 bg-white rounded-full" />
//                         </motion.div>
//                       )}
//                     </div>
//                   </motion.button>
//                 ))}
//               </motion.div>
//             )}
//           />
//         );

//       case 'multiselect':
//         return (
//           <Controller
//             name={question.id}
//             control={control}
//             render={({ field }) => {
//               const selectedValues: string[] = Array.isArray(field.value)
//                 ? field.value
//                 : [];

//               const toggleOption = (optionValue: string) => {
//                 const newValues = selectedValues.includes(optionValue)
//                   ? selectedValues.filter(v => v !== optionValue)
//                   : [...selectedValues, optionValue];
//                 field.onChange(newValues);
//               };

//               return (
//                 <motion.div
//                   className="grid gap-3 sm:gap-4 w-full"
//                   variants={inputVariants}
//                   initial="hidden"
//                   animate="visible"
//                 >
//                   {question.options?.map((option, index) => {
//                     const isSelected = selectedValues.includes(option.value);
//                     return (
//                       <motion.button
//                         key={option.value}
//                         type="button"
//                         onClick={() => toggleOption(option.value)}
//                         style={{
//                           backgroundColor: isSelected ? '#ecfdf5' : '#fffbeb',
//                           borderColor: isSelected ? '#10b981' : '#f3e8d0',
//                         }}
//                         className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 text-left group hover:shadow-md ${
//                           isSelected
//                             ? 'border-emerald-500 bg-emerald-50 shadow-md !bg-emerald-50 !border-emerald-500'
//                             : 'border-amber-200 bg-amber-50 hover:border-amber-300 !bg-amber-50 !border-amber-200 hover:!bg-amber-100 hover:border-amber-300'
//                         }`}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: index * 0.1 }}
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                       >
//                         <div className="flex items-center gap-4">
//                           {option.icon && (
//                             <span className="text-2xl sm:text-3xl">
//                               {option.icon}
//                             </span>
//                           )}
//                           <div className="flex-1">
//                             <span className="text-lg sm:text-xl font-medium text-gray-900">
//                               {option.label}
//                             </span>
//                           </div>
//                           <div
//                             className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all duration-200 ${
//                               isSelected
//                                 ? 'border-emerald-500 bg-emerald-500'
//                                 : 'border-gray-300'
//                             }`}
//                           >
//                             {isSelected && (
//                               <motion.div
//                                 className="w-2 h-2 bg-white rounded-sm"
//                                 initial={{ scale: 0 }}
//                                 animate={{ scale: 1 }}
//                                 transition={{
//                                   type: 'spring',
//                                   stiffness: 500,
//                                   damping: 30,
//                                 }}
//                               />
//                             )}
//                           </div>
//                         </div>
//                       </motion.button>
//                     );
//                   })}

//                   {selectedValues.length > 0 && (
//                     <motion.div
//                       className="mt-2 p-3 bg-emerald-50 rounded-lg"
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: 'auto' }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <p className="text-sm text-emerald-700">
//                         Selected: {selectedValues.length} goal
//                         {selectedValues.length !== 1 ? 's' : ''}
//                       </p>
//                     </motion.div>
//                   )}
//                 </motion.div>
//               );
//             }}
//           />
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {renderInput()}

//       {/* Error Message */}
//       <AnimatePresence>
//         {error && (
//           <motion.div
//             variants={errorVariants}
//             initial="hidden"
//             animate="visible"
//             exit="hidden"
//             className="text-red-500 text-sm sm:text-base font-medium px-2"
//           >
//             {error.message}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default QuestionRenderer;
