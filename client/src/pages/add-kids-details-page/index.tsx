// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import TypeformFlow from '@/components/typeform-flow';
// import type { KidsDetailsFormData } from '@/types/kids-details';

// const AddKidsDetailsPage: React.FC = () => {
//   const navigate = useNavigate();

//   const handleFormSubmit = async (data: KidsDetailsFormData) => {
//     try {
//       // Here you would typically send the data to your backend
//       console.log('Kids Details Form Data:', data);

//       // Success handling is now done through confetti completion
//       // No immediate redirect - let confetti play first
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('There was an error saving the details. Please try again.');
//     }
//   };

//   const handleSubmitSuccess = () => {
//     // This is called after confetti animation completes
//     navigate('/client-dashboard');
//   };

//   const handleCancel = () => {
//     navigate('/client-dashboard');
//   };

//   return (
//     <TypeformFlow
//       onSubmit={handleFormSubmit}
//       onCancel={handleCancel}
//       onSubmitSuccess={handleSubmitSuccess}
//     />
//   );
// };

// export default AddKidsDetailsPage;
