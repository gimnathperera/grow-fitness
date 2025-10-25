import { z } from 'zod';
import type { QuestionConfig } from './question-config';

const childSchema = z.object({
  kidsName: z
    .string()
    .min(2, "Kid's name must be at least 2 characters")
    .max(50),
  gender: z.enum(['girl', 'boy'], { message: 'Please select gender' }),
  location: z
    .string()
    .min(2, 'Location is required')
    .max(100, 'Location should be shorter'),
  kidsAge: z
    .number()
    .min(3, 'Age must be at least 3')
    .max(18, 'Age cannot exceed 18'),
  alreadyInSports: z.enum(['yes', 'no'], {
    message: 'Please select an option',
  }),
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
    field: 'location',
    type: 'text',
    stepTitle: 'Where do they live?',
    stepSubtitle:
      "Let us know each child's city so we can suggest nearby sessions",
    perChildLabel: "{name}'s location",
    placeholder: 'City, State',
  },
  {
    field: 'kidsAge',
    type: 'number',
    stepTitle: 'How old are they?',
    stepSubtitle: "Share each child's age to match them with the right program",
    perChildLabel: "{name}'s age",
    placeholder: 'Enter age',
  },
  {
    field: 'alreadyInSports',
    type: 'select',
    stepTitle: 'Are they active already?',
    stepSubtitle:
      'Tell us if your kids are already involved in sports or regular activities',
    perChildLabel: 'Is {name} already in sports?',
    options: [
      { value: 'yes', label: 'Yes', icon: '⚽' },
      { value: 'no', label: 'No', icon: '🌱' },
    ],
  },
  {
    field: 'trainingPreference',
    type: 'select',
    stepTitle: 'Pick their training style',
    stepSubtitle: 'Choose the session style each child would enjoy most',
    perChildLabel: "{name}'s preferred training",
    options: [
      { value: 'personal', label: 'Personal training', icon: '👤' },
      { value: 'group', label: 'Group training', icon: '👥' },
    ],
  },
];

export const createEmptyChild = () =>
  ({
    kidsName: '',
    gender: undefined,
    location: '',
    kidsAge: undefined,
    alreadyInSports: undefined,
    trainingPreference: undefined,
  }) as unknown as KidDetails;
