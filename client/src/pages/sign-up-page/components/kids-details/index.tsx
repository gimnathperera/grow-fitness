import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { KidsDetailsFormData } from '@/types/kids-details';
import TypeformFlow from './components/kids-details-flow';
import { useCreateKidsMutation } from '@/services/kidsApi';
import { useAppSelector } from '@/hooks/store';
import { selectCurrentUser } from '@/auth/authSlice';

interface AddKidsDetailsPageProps {
  parentId?: string;
}

const AddKidsDetailsPage = ({
  parentId,
}: AddKidsDetailsPageProps) => {
  const navigate = useNavigate();
  const [createKids] = useCreateKidsMutation();
  const currentUser = useAppSelector(selectCurrentUser);
  const [isLoading, setIsLoading] = React.useState(false);

  const resolvedParentId = React.useMemo(() => {
    // Try to get parent ID from props first, then from current user
    return (
      parentId ||
      currentUser?.id ||
      (currentUser as any)?._id ||
      (currentUser as any)?.userId ||
      null
    );
  }, [parentId, currentUser]);

  // If we can't resolve parent ID, redirect to sign-in
  React.useEffect(() => {
    if (!resolvedParentId) {
      console.error('No parent ID available, redirecting to sign-in');
      toast.error('Session expired. Please sign in again.');
      navigate('/sign-in', { replace: true });
    }
  }, [resolvedParentId, navigate]);

  // Show loading state while checking for parent ID
  if (!resolvedParentId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account information...</p>
        </div>
      </div>
    );
  }

  const handleFormSubmit = async (data: KidsDetailsFormData) => {
    setIsLoading(true);
    try {
      if (!resolvedParentId) {
        toast.error('Missing parent information. Please sign in again.');
        navigate('/sign-in');
        return;
      }

      const kidsData = data.kids.map(kid => {
        // Calculate age from birth date
        const birthDate = new Date(kid.birthDate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        return {
          name: kid.kidsName.trim(),
          parentId: resolvedParentId,
          birthDate: birthDate.toISOString(),
          gender: kid.gender,
          location: kid.location.trim(),
          goals: kid.goals || ['Improve fitness'],
          medicalCondition: kid.medicalCondition || 'None',
          isInSports: kid.isInSports || false,
          preferredTrainingStyle: kid.trainingPreference,
          age, // Include calculated age for reference
        };
      });

      console.log('Sending kids data:', kidsData);
      const result = await createKids(kidsData).unwrap();
      console.log('Kids created successfully:', result);
      toast.success('Kids details saved successfully!');
      return result; // Return the result for the success handler
    } catch (error) {
      console.error('Error creating kids:', error);
      const apiError = error as { data?: { message?: string } };
      toast.error(
        apiError?.data?.message ??
          'There was an error saving the details. Please try again.',
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/client-dashboard');
  };

  const handleSubmitSuccess = () => {
    navigate('/client-dashboard');
  };

  return (
    <TypeformFlow
      onSubmit={handleFormSubmit}
      onCancel={handleCancel}
      onSubmitSuccess={handleSubmitSuccess}
    />
  );
};

export default AddKidsDetailsPage;
