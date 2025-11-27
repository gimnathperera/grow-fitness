import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:border-0 file:rounded-md file:px-3 file:py-1 file:transition-colors file:hover:bg-muted/50 file:focus-visible:outline-none file:focus-visible:ring-2 file:focus-visible:ring-[#23B685] file:focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#23B685] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'focus-visible:border-[#23B685] focus-visible:ring-[#23B685]/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-red-500/20 aria-invalid:border-red-500',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
