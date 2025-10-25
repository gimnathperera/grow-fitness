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

const AddKidsDetailsPage: React.FC<AddKidsDetailsPageProps> = ({
  parentId,
}) => {
  const navigate = useNavigate();
  const [createKids] = useCreateKidsMutation();
  const currentUser = useAppSelector(selectCurrentUser);

  const resolvedParentId =
    parentId ??
    currentUser?.id ??
    (currentUser as unknown as { _id?: string })?._id ??
    (currentUser as unknown as { userId?: string })?.userId ??
    null;

  const handleFormSubmit = async (data: KidsDetailsFormData) => {
    try {
      if (!resolvedParentId) {
        toast.error('Missing parent information. Please signup again.');
        throw new Error('Missing parentId');
      }

      const payload = data.kids.map(kid => {
        const isInSports =
          kid.alreadyInSports === 'yes'
            ? true
            : kid.alreadyInSports === 'no'
              ? false
              : undefined;

        return {
          parentId: resolvedParentId,
          name: kid.kidsName.trim(),
          gender: kid.gender,
          age: kid.kidsAge,
          location: kid.location.trim(),
          isInSports,
          preferredTrainingStyle: kid.trainingPreference,
        };
      });

      await createKids(payload).unwrap();
      toast.success('Kids details saved successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      const apiError = error as { data?: { message?: string } };
      toast.error(
        apiError?.data?.message ??
          'There was an error saving the details. Please try again.',
      );
      throw error;
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
