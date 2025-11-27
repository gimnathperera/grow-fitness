import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  headingLevel?: 'h1' | 'h2' | 'none' | 'h6';
}

export function AnimatedButton({
  href,
  onClick,
  children,
  variant = 'default',
  size = 'md',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className,
  type = 'button',
  rounded = 'lg',
  headingLevel = 'none',
}: AnimatedButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs md:px-6 md:py-3 md:text-base',
    md: 'px-4 py-2 text-sm md:px-8 md:py-4 md:text-lg',
    lg: 'px-6 py-3 text-base md:px-12 md:py-6 md:text-xl',
  };

  const variantClasses = {
    default: 'bg-primary hover:bg-foreground text-white',
    outline:
      'border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent',
    gradient:
      'bg-gradient-to-r from-[#23B685] to-[#243E36] hover:from-[#243E36] hover:to-[#23B685] text-white',
  };

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const buttonClasses = cn(
    'w-full md:w-auto font-extrabold transform hover:scale-105 transition-all duration-300 shadow-xl group inline-flex items-center justify-center cursor-pointer',
    'font-[Insaniburger_with_Cheese]',
    variantClasses[variant],
    sizeClasses[size],
    roundedClasses[rounded],
    className,
  );

  const HeadingTag = headingLevel === 'none' ? React.Fragment : headingLevel;

  const buttonContent = (
    <>
      {LeftIcon && (
        <LeftIcon className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6 group-hover:animate-bounce" />
      )}
      <HeadingTag>{children}</HeadingTag>
      {RightIcon && (
        <RightIcon className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6 group-hover:animate-bounce" />
      )}
    </>
  );

  if (href) {
    return (
      <Link to={href} className={buttonClasses}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={buttonClasses}>
      {buttonContent}
    </button>
  );
}
