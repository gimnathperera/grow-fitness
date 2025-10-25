import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import CollectInfoFlow from './components/collect-info-flow';
import { type CollectInfoFormData } from '@/types/collect-info';
import { useCreateCollectInfoMutation } from '@/services/collectInfoApi';
import { errorToastConfig, toastContainerConfig } from '@/utils/toastStyles';

const CollectInfoPage: React.FC = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [createCollectInfo, { isLoading }] = useCreateCollectInfoMutation();

  const handleCollectInfoSubmit = async (data: CollectInfoFormData) => {
    try {
      setSubmitError(null);

      // Add timeout handling
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 second timeout
      });

      await Promise.race([createCollectInfo(data).unwrap(), timeoutPromise]);
      // Fire a single success toast when the confetti starts
      toast.success(
        "🎉 Request submitted successfully! We'll contact you soon to schedule your free session.",
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
    } catch (err) {
      console.error('Collect info error:', err);

      // Handle different types of errors
      let errorMessage = 'Something went wrong. Please try again.';

      if (err && typeof err === 'object') {
        const error = err as any;

        // Timeout errors
        if (error.message === 'Request timeout') {
          errorMessage =
            'Request is taking too long. Please check your connection and try again.';
        }
        // Network/connection errors
        else if (
          error.status === 'FETCH_ERROR' ||
          error.status === 'PARSING_ERROR'
        ) {
          errorMessage =
            'Unable to connect to the server. Please check your internet connection and try again.';
        }
        // Server errors (4xx, 5xx)
        else if (error.status && error.status >= 400) {
          if (error.status === 400) {
            errorMessage = 'Please check your information and try again.';
          } else if (error.status === 401) {
            errorMessage =
              'Session expired. Please refresh the page and try again.';
          } else if (error.status === 403) {
            errorMessage =
              'Access denied. Please contact support if this continues.';
          } else if (error.status === 404) {
            errorMessage =
              'Service temporarily unavailable. Please try again later.';
          } else if (error.status >= 500) {
            errorMessage = 'Server error. Please try again in a few moments.';
          } else {
            errorMessage =
              error.data?.message || 'Request failed. Please try again.';
          }
        }
        // API error with message
        else if (error.data?.message) {
          errorMessage = error.data.message;
        }
        // Validation errors
        else if (error.data?.error?.details) {
          const details = error.data.error.details;
          if (typeof details === 'object') {
            const fieldErrors = Object.values(details).join(', ');
            errorMessage = `Please fix the following: ${fieldErrors}`;
          }
        }
      }

      setSubmitError(errorMessage);
      toast.error(errorMessage, errorToastConfig);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSubmitSuccess = () => {
    navigate('/');
  };

  const handleRetry = () => {
    setSubmitError(null);
  };

  return (
    <>
      <ToastContainer {...toastContainerConfig} />
      <CollectInfoFlow
        onSubmit={handleCollectInfoSubmit}
        onCancel={handleCancel}
        onSubmitSuccess={handleSubmitSuccess}
        isLoading={isLoading}
        error={submitError}
        onRetry={handleRetry}
      />
    </>
  );
};

export default CollectInfoPage;
