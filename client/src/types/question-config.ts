import type { ReactNode } from 'react';

/**
 * Generic reusable question configuration for forms
 */
export type QuestionConfig<T extends string> = {
  id: T;
  label?: string; // optional label for generic usage
  title?: string; // typeform-style title
  subtitle?: string;
  placeholder?: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'date'
    | 'phone'
    | 'select'
    | 'multiselect';
  options?: {
    value: string | boolean;
    label: string;
    icon?: ReactNode;
  }[];
  required?: boolean;
};
