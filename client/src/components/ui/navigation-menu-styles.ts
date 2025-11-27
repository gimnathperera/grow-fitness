import { cva } from 'class-variance-authority';

export const navigationMenuTriggerStyle = cva(
  'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#23B685] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
);
