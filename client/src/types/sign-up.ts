import { z } from 'zod';
import type { QuestionConfig } from './question-config';

export const parentSignupSchema = z
  .object({
    parentName: z
      .string()
      .min(2, 'Parent name must be at least 2 characters long'),
    email: z.string().email('Please enter a valid email address'),
    contactNumber: z
      .string()
      .regex(/^[+]?[1-9][\d]{7,14}$/, 'Please enter a valid phone number'),
    location: z.string().min(2, 'Location is required'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ParentSignupFormData = z.infer<typeof parentSignupSchema>;

export type ParentRegisterPayload = {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'client';
};

// Question configuration for typeform-style flow
export const parentSignupQuestions: QuestionConfig<
  keyof ParentSignupFormData
>[] = [
  {
    id: 'parentName',
    type: 'text',
    title: "What's your name?",
    placeholder: 'Enter your full name',
    required: true,
  },
  {
    id: 'email',
    type: 'email',
    title: "What's your email address?",
    placeholder: 'Enter your email',
    required: true,
  },
  {
    id: 'contactNumber',
    type: 'phone',
    title: "What's your contact number?",
    placeholder: 'Enter your phone number',
    required: true,
  },
  {
    id: 'location',
    type: 'text',
    title: 'Where are you located?',
    placeholder: 'Enter your city',
    required: true,
  },
  {
    id: 'password',
    type: 'password',
    title: 'Create a password',
    placeholder: 'Enter password',
    required: true,
  },
  {
    id: 'confirmPassword',
    type: 'password',
    title: 'Confirm your password',
    placeholder: 'Re-enter your password',
    required: true,
  },
];
