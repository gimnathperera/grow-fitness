import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ParentSignupFlow from './components/parent-signup-flow';
import type { ParentSignupFormData } from '@/types/sign-up';
import AddKidsDetailsPage from '../kids-details';
import { useRegisterMutation, type LoginResponse } from '@/services/authApi';
import { useAppDispatch } from '@/hooks/store';
import { setTokens, setUser } from '@/auth/authSlice';

const parseRegisterResponse = (response: unknown): LoginResponse | null => {
  if (
    response &&
    typeof response === 'object' &&
    'tokens' in response &&
    'user' in response
  ) {
    return response as LoginResponse;
  }

  if (
    response &&
    typeof response === 'object' &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object'
  ) {
    const payload = (response as { data: unknown }).data;
    if (
      payload &&
      typeof payload === 'object' &&
      'tokens' in payload &&
      'user' in payload
    ) {
      return payload as LoginResponse;
    }
  }

  return null;
};

const ParentSignupPage: React.FC = () => {
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);

  const [register] = useRegisterMutation();
  const dispatch = useAppDispatch();

  const handleSignupSubmit = async (data: ParentSignupFormData) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        name: data.parentName,
        phone: data.contactNumber,
        role: 'client' as const,
      };

      const response = await register(payload).unwrap();
      console.log('Parent registered successfully:', response);

      const loginPayload = parseRegisterResponse(response);

      if (!loginPayload) {
        throw new Error('Unexpected signup response format.');
      }

      if (loginPayload.tokens) {
        dispatch(setTokens(loginPayload.tokens));
      }

      if (loginPayload.user) {
        dispatch(setUser(loginPayload.user));
      }

      const derivedParentId =
        loginPayload.user?.id ??
        (loginPayload.user as unknown as { _id?: string })?._id ??
        (loginPayload.user as unknown as { userId?: string })?.userId ??
        null;

      setParentId(derivedParentId);

      setSignupSuccess(true);
      toast.success('Successfully signed up to Grow Fitness! Welcome!');
    } catch (err) {
      const error = err as { data?: { message?: string } };
      console.error('Signup error:', error);

      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error('Signup failed. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    window.location.href = '/';
  };

  if (signupSuccess) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <AddKidsDetailsPage parentId={parentId ?? undefined} />
      </>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <ParentSignupFlow onSubmit={handleSignupSubmit} onCancel={handleCancel} />
    </>
  );
};

export default ParentSignupPage;
