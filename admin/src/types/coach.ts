export interface Availability {
  day: string;
  from: string;
  to: string;
}

export interface Coach {
  id: string;
  name: string;
  dateOfBirth: string;
  photo: string | null;
  contactNo: string;
  email: string;
  homeAddress: string;
  school: string;
  availability: Availability[];
  employmentType: 'full-time' | 'part-time' | 'contract' | 'casual';
  cvFile: File | null;
  cvFileName: string | null;
  skills: string[];
  createdAt: Date;
}

export type CoachFormData = Omit<Coach, 'id' | 'createdAt'>;

export const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'casual', label: 'Casual' },
] as const;

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export const DEFAULT_SKILLS = [
  'Leadership',
  'Communication',
  'Fitness Training',
  'Team Management',
  'Sports Psychology',
  'Nutrition',
  'First Aid',
  'Youth Development',
] as const;
