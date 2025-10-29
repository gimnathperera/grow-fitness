import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ParentSignupFlow from './components/parent-signup-flow';
import type { ParentSignupFormData } from '@/types/sign-up';
import AddKidsDetailsPage from '../kids-details';
import { useRegisterParentMutation, type LoginResponse } from '@/services/authApi';
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
  const navigate = useNavigate();
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);

  const [registerParent] = useRegisterParentMutation();
  const dispatch = useAppDispatch();

  const handleSignupSubmit = async (data: ParentSignupFormData) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        name: data.parentName,
        phone: data.contactNumber,
        location: data.location,
        role: 'client' as const,
        children: (data.children || []).map(child => ({
          name: child.name,
          birthDate: child.birthDate,
          gender: child.gender,
          location: child.location,
          goals: child.goals || ['Improve fitness'],
          medicalCondition: child.medicalCondition || 'None',
          isInSports: child.isInSports || false,
          preferredTrainingStyle: child.preferredTrainingStyle || 'group',
        }))
      };

      console.log('📤 Sending signup payload:', payload);

      const response = await registerParent(payload).unwrap();
      console.log('✅ Raw signup response from API:', response);

      // First, try to parse the response using the existing parser
      let loginPayload = parseRegisterResponse(response);
      console.log('🧩 Parsed loginPayload after initial parse:', loginPayload);

      // If parsing fails, try alternative parsing logic
      if (!loginPayload) {
        console.log('⚙️ Response did not match expected format, trying alternative parsing...');

        const responseData = (response as any)?.data || response;
        console.log('📦 Extracted responseData:', responseData);

        if (responseData.user || responseData.tokens) {
          loginPayload = {
            user: responseData.user || {},
            tokens: responseData.tokens,
          } as LoginResponse;
        } else if (responseData) {
          loginPayload = {
            user: responseData,
            tokens: responseData.tokens,
          } as LoginResponse;
        }

        console.log('🔁 Parsed loginPayload after alternative parsing:', loginPayload);
      }

      if (!loginPayload) {
        console.error('❌ Unexpected signup response format:', response);
        throw new Error('Unexpected signup response format. Please try again.');
      }

      if (loginPayload.tokens) {
        console.log('🔐 Dispatching tokens to Redux:', loginPayload.tokens);
        dispatch(setTokens(loginPayload.tokens));
      }

      if (loginPayload.user) {
        console.log('👤 Dispatching user to Redux:', loginPayload.user);
        dispatch(setUser(loginPayload.user));
      }

      // If we have children, we can directly navigate to dashboard
      if (data.children && data.children.length > 0) {
        toast.success('Registration successful! Welcome to Grow Fitness!');
        navigate('/client-dashboard');
      } else {
        // If no children, show the add children page
        const derivedParentId =
          loginPayload.user?.id ||
          (loginPayload.user as any)?._id ||
          (loginPayload as any)?.userId ||
          (loginPayload.user as any)?.userId;

        console.log('🆔 Derived parentId:', derivedParentId);

        if (!derivedParentId) {
          console.warn('⚠️ Could not determine parent ID from response:', loginPayload);
          toast.warning('Account created successfully! Please sign in to continue.');
          navigate('/sign-in');
          return;
        }

        setParentId(derivedParentId);
        setSignupSuccess(true);
      }
    } catch (err) {
      const error = err as { data?: { message?: string } };
      console.error('❌ Signup error:', error);

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
