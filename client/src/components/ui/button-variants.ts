import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-[#23B685] focus-visible:ring-[#23B685]/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 aria-invalid:ring-red-500/40 aria-invalid:border-red-500",
  {
    variants: {
      variant: {
        default: '!bg-[#23B685] text-white shadow-xs hover:!bg-[#243E36]',
        destructive:
          'bg-red-600 text-white shadow-xs hover:bg-red-700 focus-visible:ring-red-500/20 focus-visible:ring-red-500/40 bg-red-600/60',
        outline:
          'border bg-white shadow-xs hover:bg-gray-50 hover:text-gray-900 bg-gray-50 border-gray-300 hover:bg-gray-100',
        secondary: 'bg-gray-100 text-gray-900 shadow-xs hover:bg-gray-200',
        ghost: 'hover:bg-gray-100 hover:text-gray-900 hover:bg-gray-100',
        link: 'text-[#23B685] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
