import { z } from 'zod';
import type { QuestionConfig } from './question-config';

const childSchema = z.object({
  kidsName: z
    .string()
    .min(2, "Kid's name must be at least 2 characters")
    .max(50),
  gender: z.enum(['girl', 'boy'], { message: 'Please select gender' }),
  birthDate: z.string().or(z.date()).refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 18);
      return date <= today && date >= minDate;
    },
    { message: 'Birth date must be within the last 18 years' }
  ),
  location: z
    .string()
    .min(2, 'Location is required')
    .max(100, 'Location should be shorter'),
  goals: z.array(z.string()).min(1, 'At least one goal is required'),
  medicalCondition: z.string().optional(),
  isInSports: z.boolean().default(false),
  trainingPreference: z.enum(['personal', 'group'], {
    message: 'Please select a training preference',
  }),
});

export const kidsDetailsSchema = z.object({
  kids: z
    .array(childSchema)
    .min(1, 'Please add at least one child before continuing'),
});

export type KidDetails = z.infer<typeof childSchema>;
export type KidsDetailsFormData = z.infer<typeof kidsDetailsSchema>;

export type ChildAttributeStep = {
  field: keyof Omit<KidDetails, 'kidsName'>;
  type: NonNullable<QuestionConfig<string>['type']>;
  stepTitle: string;
  stepSubtitle?: string;
  perChildLabel: string;
  placeholder?: string;
  options?: QuestionConfig<string>['options'];
  optional?: boolean;
};

export const childAttributeSteps: ChildAttributeStep[] = [
  {
    field: 'gender',
    type: 'select',
    stepTitle: "Let's get to know them",
    stepSubtitle: "Select each child's gender so we can tailor their workouts",
    perChildLabel: "{name}'s gender",
    options: [
      { value: 'girl', label: 'Girl', icon: '👧' },
      { value: 'boy', label: 'Boy', icon: '👦' },
    ],
  },
  {
    field: 'birthDate',
    type: 'date',
    stepTitle: 'When were they born?',
    stepSubtitle: 'We use this to provide age-appropriate activities',
    perChildLabel: "{name}'s birth date",
  },
  {
    field: 'location',
    type: 'text',
    stepTitle: 'Where do they live?',
    stepSubtitle: "Let us know each child's city so we can suggest nearby sessions",
    perChildLabel: "{name}'s location",
    placeholder: 'City, State',
  },
  {
    field: 'goals',
    type: 'multiselect',
    stepTitle: 'What are their fitness goals?',
    stepSubtitle: 'Select all that apply to help us customize their experience',
    perChildLabel: "{name}'s goals",
    options: [
      { value: 'Improve fitness', label: 'Improve overall fitness' },
      { value: 'Weight management', label: 'Weight management' },
      { value: 'Sports performance', label: 'Sports performance' },
      { value: 'Build confidence', label: 'Build confidence' },
      { value: 'Make friends', label: 'Make friends' },
    ],
  },
  {
    field: 'isInSports',
    type: 'select',
    stepTitle: 'Are they currently in sports?',
    stepSubtitle: 'This helps us understand their activity level',
    perChildLabel: 'Is {name} currently in sports?',
    options: [
      { value: true, label: 'Yes', icon: '⚽' },
      { value: false, label: 'No', icon: '🌱' },
    ],
  },
  {
    field: 'trainingPreference',
    type: 'select',
    stepTitle: 'Training preference',
    stepSubtitle: 'Which type of training do they prefer?',
    perChildLabel: "{name}'s training preference",
    options: [
      { value: 'personal', label: 'Personal training', icon: '👤' },
      { value: 'group', label: 'Group training', icon: '👥' },
    ],
  },
  {
    field: 'medicalCondition',
    type: 'text',
    stepTitle: 'Any medical conditions?',
    stepSubtitle: 'Please list any medical conditions we should be aware of',
    perChildLabel: "{name}'s medical conditions",
    placeholder: 'None, Asthma, Allergies, etc.',
    optional: true,
  },
];

export const createEmptyChild = (): KidDetails =>
  ({
    kidsName: '',
    gender: undefined,
    birthDate: new Date().toISOString().split('T')[0], // Default to today's date
    location: '',
    goals: ['Improve fitness'],
    medicalCondition: '',
    isInSports: false,
    alreadyInSports: undefined,
    trainingPreference: undefined,
  }) as unknown as KidDetails;
