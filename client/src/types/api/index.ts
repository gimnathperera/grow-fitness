import type { ReactNode } from 'react';

export type { paths, components, operations } from './generated';

export type ApiSuccessResponse<T> = {
  isInSports: any;
  goals: any;
  medicalCondition: string;
  trainingPreference: ReactNode;
  location: ReactNode;
  gender: ReactNode;
  status: any;
  name: ReactNode;
  createdAt: any;
  coachId: string;
  age: any;
  birthDate: any;
  ok: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiErrorResponse = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown> | string;
  };
  meta?: Record<string, unknown>;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
