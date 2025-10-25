import { z } from 'zod';
import type { QuestionConfig } from './question-config';

export const collectInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters long'),
  phoneNumber: z
    .string()
    .regex(/^[+]?[1-9][\d]{7,14}$/, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  location: z.string().min(2, 'Location is required'),
  planType: z.string().min(1, 'Plan type is required'),
});

export type CollectInfoFormData = z.infer<typeof collectInfoSchema>;

export type CollectInfoPayload = {
  fullName: string;
  phoneNumber: string;
  email: string;
  location: string;
  planType: string;
};

// Question configuration for typeform-style flow
export const collectInfoQuestions: QuestionConfig<keyof CollectInfoFormData>[] =
  [
    {
      id: 'fullName',
      type: 'text',
      title: "What's your full name?",
      placeholder: 'Enter your full name',
      required: true,
    },
    {
      id: 'phoneNumber',
      type: 'phone',
      title: "What's your phone number?",
      placeholder: 'Enter your phone number',
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
      id: 'location',
      type: 'text',
      title: 'Where are you located?',
      placeholder: 'Enter your city or location',
      required: true,
    },
    {
      id: 'planType',
      type: 'select',
      title: 'What type of plan are you interested in?',
      placeholder: 'Select a plan type',
      required: true,
      options: [
        { value: 'individual', label: 'Individual' },
        { value: 'group', label: 'Group' },
      ],
    },
  ];
